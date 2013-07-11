function ServerConnector(connection, userInfo, subscribers, logger) {

    // Test
    var chat = connection.chatHub, 
        game = connection.gameHub;
    
    /*
            SEND
    */
    var signIn = function () {
        logger.write("Signing in...");
        game.server.signIn(userInfo);
    };

    var sendMessage = function (message) {

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
        sendMessage: sendMessage,
        updatePlayer: updatePlayer,
        signIn: signIn
    };
}