/// <reference path="player.js" />
/// <reference path="keys.js" />
/// <reference path="enemy.js" />
/// <reference path="fps.js" />
/// <reference path="playerState.js" />
function AsteroidsGame(two, boundaries, logger) {

    // consts
    var bulletRate = 10,
        updateRatio = 5;

    // properties 
    var player = null,
		key = new Keys(),
	    enemies = {},
	    server = null,
	    count = 0,
	    spaceCount = 0,
        playerState = new PlayerState(),
        userInfo = null,
        updateRate = 0; //changes depends on number of users

    two.bind('update', function () {
        // playerState alerts us when the currently pressed keys have changed
        // this will initiate an emergency update (sends to server)

        if (key.isPressed(key.keyMap.left)) {
            player.leftTurn();
            playerState.keyPressed(key.keyMap.left);
        } else {
            playerState.keyNotPressed(key.keyMap.left);
        }

        if (key.isPressed(key.keyMap.right)) {
            player.rightTurn();
            playerState.keyPressed(key.keyMap.right);
        } else {
            playerState.keyNotPressed(key.keyMap.right);
        }

        if (key.isPressed(key.keyMap.up)) {
            player.accelerate();
            playerState.keyPressed(key.keyMap.up);
        } else {
            playerState.keyNotPressed(key.keyMap.up);
        }

        if (key.isPressed(key.keyMap.space)) {
            if (spaceCount == 0) {
                var bullet = player.fire();
                sendBullet(bullet);
            }

            spaceCount++;
        }

        if (spaceCount > bulletRate)
            spaceCount = 0;

        player.update(enemies);

        var readyForUpdate = updateRate > 0 && count > updateRate;
        if (readyForUpdate || playerState.changed()) {
            updatePlayer();
            count = 0;
        }
        count++;

        updateEnemies();

        // update the fps counter
        fps.Count();
        playerState.reset();
    });

    // used for creating the player and enemy ships
    var createShip = function (colour, guid) {
        var height = 14,
			width = 20;

        var x1 = -(width / 2),
			y1 = -(height / 2),

			x2 = -(width / 2),
			y2 = (height / 2),

			x3 = width / 2,
			y3 = 0;

        var ship = two.makePolygon(x1, y1, x2, y2, x3, y3);
        ship.stroke = colour || '#BFFF00';
        ship.linewidth = 2;
        ship.noFill();

        // position in center of screen
        var group = two.makeGroup(ship);
        group.translation.set(two.width / 2, two.height / 2);

        return new Player(two, group, boundaries, logger, guid, colour);
    };

    var play = function (signedInDetails) {
        userInfo = signedInDetails;

        player = player || createShip(signedInDetails.colour, userInfo.guid);
        player.eventHandlers.bulletDestroyed = bulletDestroyed;

        two.play();
    };

    var updateEnemies = function () {
        for (var enemy in enemies) {
            enemies[enemy].update();
        }
    };

    var updateSendRatio = function () {
        var activeConnections = Object.keys(enemies).length;

        // reduces the update rate when more players exist
        updateRate = updateRatio * activeConnections;
    };

    /*
        ----------- Connection stuff -----------
    */
    var setConnector = function (connector) {
        server = connector;
    };

    var playerJoined = function (playerInfo) {
        logger.write(playerInfo.displayName + " has joined the game");

        var ship = createShip(playerInfo.colour, playerInfo.guid);
        var enemy = new Enemy(playerInfo, ship, two);

        enemies[playerInfo.guid] = enemy;

        updateSendRatio();
    };

    var playerDisconnected = function (playerDto) {
        logger.write(playerDto.displayName + " has left the game");

        var enemy = enemies[playerDto.guid];
        if (!enemy)
            return;

        enemy.destroy();

        delete enemies[playerDto.guid];

        updateSendRatio();
    };

    var updatePlayer = function () {
        if (numberOfEnemies() < 1)
            return;

        var dto = player.generateDto();

        // simulate the buttons being pressed - improves smoothness
        // attach the currently pressed keys
        dto = $.extend(dto, { keys: playerState.pressedKeys });
        server.updatePlayer(dto);
    };

    var playerChange = function (playerDto) {
        var enemy = enemies[playerDto.guid];
        if (!enemy)
            return;

        enemy.updateFromDto(playerDto);
    };

    var sendBullet = function (bullet) {
        if (numberOfEnemies() < 1)
            return;

        var dto = bullet.generateDto();

        // apply the current user id
        dto = $.extend(dto, { pid: userInfo.guid });
        server.sendBullet(dto);

        updatePlayer();
    };

    var enemyBullet = function (bulletDto) {
        var enemy = enemies[bulletDto.pid];
        if (!enemy)
            return;

        enemy.shootBullet(bulletDto);
    };

    var bulletDestroyed = function (bullet) {
        if (numberOfEnemies() < 1)
            return;

        var dto = bullet.generateDto();

        // apply the current user id
        dto = $.extend(dto, { pid: userInfo.guid });
        server.bulletDestroyed(dto);
    };

    var enemyBulletDestroyed = function (bulletDto) {
        var enemy = enemies[bulletDto.pid];
        if (!enemy)
            return;

        enemy.destroyBullet(bulletDto);
    };

    var numberOfEnemies = function () {
        return Object.keys(enemies).length;
    };

    return {
        play: play,
        setConnector: setConnector,
        playerJoined: playerJoined,
        playerDisconnected: playerDisconnected,
        playerChange: playerChange,
        enemyBullet: enemyBullet,
        enemyBulletDestroyed: enemyBulletDestroyed
    };
};