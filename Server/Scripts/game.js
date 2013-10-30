/// <reference path="player.js" />
/// <reference path="enemy.js" />
/// <reference path="fps.js" />
/// <reference path="playerState.js" />
/// <reference path="ship.js" />
/// <reference path="asteroidCollection.js" />
/// <reference path="enemyCollection.js" />
/// <reference path="serverConnector.js" />
function AsteroidsGame(two, boundaries, server, logger, keys) {

    // consts
    var bulletRate = 10;

    // properties 
    var player = null,
	    enemies = new EnemyCollection(two, boundaries, logger),
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

        player = player || new Player(two, boundaries, logger, userInfo.guid, signedInDetails.colour);
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

    //var tmpCount = 0;
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
    

    /*
        ----------- Connection stuff -----------
    */
    var playerJoined = function (playerInfo) {
        enemies.newEnemy(playerInfo);

        // send our current position
        updatePlayer();
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
    
    var sendBullet = function (bullet) {
        if (enemies.numberOfEnemies() < 1)
            return;

        var dto = bullet.generateDto();

        // apply the current user id
        dto = $.extend(dto, { pid: userInfo.guid });
        server.sendBullet(dto);

        updatePlayer();
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

    // setup subscriber events
    server.setSubscribers({
        playerJoined: playerJoined,
        playerDisconnected: enemies.removeEnemy,
        playerChange: enemies.updateEnemy,
        signedIn: start, 
        enemyBullet: enemies.shootBullet,
        enemyBulletDestroyed: enemyBulletDestroyed
    });

    return {
        // Nothing to return
    };
};