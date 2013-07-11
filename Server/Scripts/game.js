/// <reference path="player.js" />
/// <reference path="keys.js" />
/// <reference path="enemy.js" />
/// <reference path="fps.js" />
/// <reference path="playerState.js" />
function AsteroidsGame(two, boundaries, logger) {

    // properties 
    var player = null,
		key = new Keys(),
	    enemies = {},
	    server = null,
	    count = 0,
	    spaceCount = 0,
        playerState = new PlayerState();

    two.bind('update', function () {
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
            if (spaceCount == 0)
                player.fire();

            spaceCount++;
        }

        if (spaceCount > 10)
            spaceCount = 0;

        player.update();

        if (count > 15 || playerState.changed()) {
            updatePlayer(player.generateDto());
            count = 0;
        }
        count++;

        //if (playerState.changed())
        //    logger.write("State changed");

        updateEnemies();

        // update the fps counter
        fps.Count();
        playerState.reset();
    });

    var createShip = function () {
        var height = 14,
			width = 20;

        var x1 = -(width / 2),
			y1 = -(height / 2),

			x2 = -(width / 2),
			y2 = (height / 2),

			x3 = width / 2,
			y3 = 0;

        var ship = two.makePolygon(x1, y1, x2, y2, x3, y3);
        ship.stroke = '#BFFF00';
        ship.linewidth = 1;
        ship.noFill();

        // position in center of screen
        var group = two.makeGroup(ship);
        group.translation.set(two.width / 2, two.height / 2);

        return new Player(two, group, boundaries);
    };

    var play = function () {
        player = player || createShip();
        two.play();
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

        var ship = createShip();
        var enemy = new Enemy(playerInfo, ship, two);

        enemies[playerInfo.guid] = enemy;
    };

    var playerDisconnected = function (playerDto) {
        logger.write(playerDto.displayName + " has left the game");

        var enemy = enemies[playerDto.guid];
        if (!enemy)
            return;

        enemy.destroy();
    };

    var updatePlayer = function (userDto) {
        userDto = $.extend(userDto, { keys: playerState.pressedKeys });
        server.updatePlayer(userDto);
    };

    var playerChange = function (playerDto) {
        var enemy = enemies[playerDto.guid];
        if (!enemy)
            return;

        enemy.updateFromDto(playerDto);
    };

    return {
        play: play,
        setConnector: setConnector,
        playerJoined: playerJoined,
        playerDisconnected: playerDisconnected,
        playerChange: playerChange
    };
};
