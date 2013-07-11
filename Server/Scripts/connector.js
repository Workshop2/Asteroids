function ServerConnector(connection, userInfo, subscribers) {
    debugger;

    var chat = connection.chatHub, 
        game = connection.gameHub;
    

    var signIn = function () {
        debugger;
        game.server.signIn(userInfo);
    };

    game.client.signInComplete = function(a) {
        debugger;
    };

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