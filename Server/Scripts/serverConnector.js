function ServerConnector(connection, userInfo, subscribers, logger) {

    var game = connection.gameHub;

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




    /*
            RECEIVE
    */
    game.client.signInComplete = function (a) {
        logger.write("Signed in :)");

        var signedIn = subscribers.signedIn;
        if (signedIn)
            subscribers.signedIn(a);
    };
    
    game.client.tooManyConnections = function (a) {
        logger.write("Too many connections. Please try again later :)");
    };

    game.client.playerJoined = subscribers.playerJoined;
    game.client.playerDisconnected = subscribers.playerDisconnected;
    game.client.playerChange = subscribers.playerChange;
    game.client.enemyBullet = subscribers.enemyBullet;

    //connection.game.stateChanged(function () {
    //    logger.write("Error, disconnected from game");
    //});

    return {
        updatePlayer: updatePlayer,
        signIn: signIn,
        sendBullet: sendBullet
    };
}