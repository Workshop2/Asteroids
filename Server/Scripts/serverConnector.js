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
    



    /*
            RECEIVE
    */
    game.client.signInComplete = function (a) {
        logger.write("Signed in :)");
    };
    
    game.client.playerJoined = subscribers.playerJoined;
    game.client.playerDisconnected = subscribers.playerDisconnected;
    game.client.playerChange = subscribers.playerChange;

    return {
        updatePlayer: updatePlayer,
        signIn: signIn
    };
}