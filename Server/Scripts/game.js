/// <reference path="player.js" />
/// <reference path="enemy.js" />
/// <reference path="fps.js" />
/// <reference path="playerState.js" />
/// <reference path="ship.js" />
/// <reference path="asteroidCollection.js" />
/// <reference path="enemyCollection.js" />
function AsteroidsGame(two, boundaries, logger, keys) {

    // consts
    var bulletRate = 10;

    // properties 
    var player = null,
	    enemies = new EnemyCollection(two, boundaries, logger),
	    server = null,
	    count = 0,
	    spaceCount = 0,
        playerState = new PlayerState(),
        userInfo = null,
        updateRate = 40,
        asteroids = new AsteroidCollection(two, boundaries, logger);

    for (var i = 0; i < 20; i++) {
        asteroids.newAsteroid();
    }

    /*
        ----------- Start the game -----------
    */
    var start = function (signedInDetails) {
        userInfo = signedInDetails;

        player = player || createPlayer(signedInDetails.colour, userInfo.guid);
        player.eventHandlers.bulletDestroyed = bulletDestroyed;

        setInterval(function () { two.update(); }, 1000 / 60);
        setInterval(update, 1000 / 60);
        setInterval(handleKeys, 1000 / 60);
        setInterval(extraLoops, 1000 / 60);
    };

    /*
        ----------- Game Loops -----------
    */
    two.bind('update', function () {
        // update the fps counter
        fps.Count();
    });
    
    var update = function () {
        player.update(enemies._enemies);

        // playerState alerts us when the currently pressed keys have changed
        // this will initiate an emergency update (sends to server)
        // It is updated in the handleKeys method
        var readyForUpdate = updateRate > 0 && count > updateRate;
        if (readyForUpdate || playerState.changed()) {
            updatePlayer();
            count = 0;
        }
        count++;

        enemies.update();
        asteroids.update();
        
        playerState.reset();
    };

    var handleKeys = function () {
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
    };

    var tmpCount = 0;
    var extraLoops = function () {
        //TODO: Remove
        //if (tmpCount > 100) {
        //    asteroids.spawnAsteroid();
        //    tmpCount = 0;
        //}
        //tmpCount++;
    };

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

    /*
        ----------- Connection stuff -----------
    */
    var setConnector = function (connector) {
        server = connector;
    };

    var playerJoined = function (playerInfo) {
        enemies.newEnemy(playerInfo);

        // send our current position
        updatePlayer();
    };

    var playerDisconnected = function (playerDto) {
        enemies.removeEnemy(playerDto);
    };

    var updatePlayer = function () {
        if (player == null)
            return;
        if (enemies.numberOfEnemies() < 1)
            return;

        var dto = player.generateDto();

        // simulate the buttons being pressed - improves smoothness
        // attach the currently pressed keys
        dto = $.extend(dto, { keys: playerState.pressedKeys });
        server.updatePlayer(dto);
    };

    var playerChange = function (playerDto) {
        enemies.updateEnemy(playerDto);
    };

    var sendBullet = function (bullet) {
        if (enemies.numberOfEnemies() < 1)
            return;

        var dto = bullet.generateDto();

        // apply the current user id
        dto = $.extend(dto, { pid: userInfo.guid });
        server.sendBullet(dto);

        updatePlayer();
    };

    var enemyBullet = function (bulletDto) {
        enemies.shootBullet(bulletDto);
    };

    var bulletDestroyed = function (bullet) {
        if (enemies.numberOfEnemies() < 1)
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
        
        enemies.destroyBullet(bulletDto);
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