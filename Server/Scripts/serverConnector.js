function ServerConnector(connection, userInfo, subscribers, logger) {
    debugger;

    // Test
    var chat = connection.chatHub, 
        game = connection.gameHub;
    

    var signIn = function () {
        debugger;
        logger.write("Signing in...");
        game.server.signIn(userInfo);
    };

    game.client.signInComplete = function (a) {
        debugger;
        logger.write("Signed in :)");
    };

    game.client.playerJoined = subscribers.playerJoined;
    game.client.playerDisconnected = subscribers.playerDisconnected;

    var sendMessage = function(message) {

    };

    var updatePlayer = function(player) {

    };

    return {
        sendMessage: sendMessage,
        updatePlayer: updatePlayer,
        signIn: signIn
    };
}