function ServerConnector(connection, userInfo, logger) {

    var game = connection.gameHub;

    var setSubscribers = function (subscribers) {
        game.client.playerJoined = subscribers.playerJoined;
        game.client.playerDisconnected = subscribers.playerDisconnected;
        game.client.playerChange = subscribers.playerChange;
        game.client.enemyBullet = subscribers.enemyBullet;
        game.client.enemyBulletDestroyed = subscribers.enemyBulletDestroyed;
        signedIn = subscribers.signedIn;
    };

    var signedIn = null;

    /*
            SEND
    */
    var signIn = function () {
        logger.write("Signing in...");
        game.server.signIn(userInfo);
    };

    var updatePlayer = function (player) {
        game.server.updatePlayer(player);
    };

    var sendBullet = function (bullet) {
        game.server.sendBullet(bullet);
    };

    var bulletDestroyed = function (bullet) {
        game.server.bulletDestroyed(bullet);
    };
    


    /*
            RECEIVE
    */
    game.client.signInComplete = function (a) {
        logger.write("Signed in :)");
        logger.write("Connected via " + a.connectionType);

        if (signedIn)
            signedIn(a);
    };

    game.client.tooManyConnections = function () {
        logger.write("Too many connections. Please try again later :)");
    };
    
    return {
        updatePlayer: updatePlayer,
        signIn: signIn,
        sendBullet: sendBullet,
        bulletDestroyed: bulletDestroyed,
        setSubscribers: setSubscribers
    };
}