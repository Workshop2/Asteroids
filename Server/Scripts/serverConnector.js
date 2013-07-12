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

    game.client.playerJoined = subscribers.playerJoined;
    game.client.playerDisconnected = subscribers.playerDisconnected;
    game.client.playerChange = subscribers.playerChange;
    game.client.enemyBullet = subscribers.enemyBullet;

    return {
        updatePlayer: updatePlayer,
        signIn: signIn,
        sendBullet: sendBullet
    };
}