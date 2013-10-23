/// <reference path="player.js" />
/// <reference path="enemy.js" />
/// <reference path="fps.js" />
/// <reference path="playerState.js" />
/// <reference path="ship.js" />
/// <reference path="asteroidCollection.js" />
function AsteroidsGame(two, boundaries, logger, keys) {

    // consts
    var bulletRate = 10;

    // properties 
    var player = null,
	    enemies = {},
	    server = null,
	    count = 0,
	    spaceCount = 0,
        playerState = new PlayerState(),
        userInfo = null,
        updateRate = 40,
        asteroids = new AsteroidCollection(two, boundaries);

    for (var i = 0; i < 10; i++) {
        asteroids.newAsteroid();
    }

    /*
        ----------- Start the game -----------
    */
    var start = function (signedInDetails) {
        userInfo = signedInDetails;

        player = player || createPlayer(signedInDetails.colour, userInfo.guid);
        player.eventHandlers.bulletDestroyed = bulletDestroyed;


        //two.play();
        setInterval(function () { two.update(); }, 1000 / 60);
    };

    /*
        ----------- Game Loop -----------
    */
    two.bind('update', function () {
        // playerState alerts us when the currently pressed keys have changed
        // this will initiate an emergency update (sends to server)

        updateKeyState(keys.keyMap.left, player.leftTurn);
        updateKeyState(keys.keyMap.right, player.rightTurn);
        updateKeyState(keys.keyMap.up, player.accelerate);
        
        if (keys.isPressed(keys.keyMap.space)) {
            if (spaceCount == 0) {
                var bullet = player.fire();
                sendBullet(bullet);
            }

            spaceCount++;
        } else {
            spaceCount = 0;
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
        asteroids.update();

        // update the fps counter
        fps.Count();
        playerState.reset();
    });

    var updateKeyState = function (key, pressedEvent) {
        playerState.updateKeyState(key, keys.isPressed(key));
        if (keys.isPressed(key) && pressedEvent != null) {
            pressedEvent();
        }
    };

    // used for creating the player and enemy ships
    var createPlayer = function (colour, guid) {
        var ship = new Ship(two, colour);

        return new Player(two, ship, boundaries, logger, guid, colour);
    };

    var updateEnemies = function () {
        for (var enemy in enemies) {
            enemies[enemy].update();
        }
    };

    /*
        ----------- Connection stuff -----------
    */
    var setConnector = function (connector) {
        server = connector;
    };

    var playerJoined = function (playerInfo) {
        logger.write(playerInfo.displayName + " has joined the game");

        var enemyPlayer = createPlayer(playerInfo.colour, playerInfo.guid);
        var enemy = new Enemy(playerInfo, enemyPlayer);

        enemies[playerInfo.guid] = enemy;

        // send our current position
        updatePlayer();
    };

    var playerDisconnected = function (playerDto) {
        logger.write(playerDto.displayName + " has left the game");

        var enemy = enemies[playerDto.guid];
        if (!enemy)
            return;

        enemy.destroy();

        delete enemies[playerDto.guid];
    };

    var updatePlayer = function () {
        if (player == null)
            return;
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
        var bulletVictim = bulletDto.v;
        if (bulletVictim == userInfo.guid) {
            logger.write("YOU GOT HIT");
        }

        var enemy = enemies[bulletDto.pid];
        if (!enemy)
            return;

        enemy.destroyBullet(bulletDto);
    };

    var numberOfEnemies = function () {
        return Object.keys(enemies).length;
    };

    return {
        start: start,
        setConnector: setConnector,
        playerJoined: playerJoined,
        playerDisconnected: playerDisconnected,
        playerChange: playerChange,
        enemyBullet: enemyBullet,
        enemyBulletDestroyed: enemyBulletDestroyed
    };
};