function NodeServerConnector(userInfo, logger) {

    var signedIn = null;

    var setSubscribers = function (subscribers) {
        socket.on('playerJoined', subscribers.playerJoined);
        socket.on('playerDisconnected', subscribers.playerDisconnected);
        socket.on('playerChange', subscribers.playerChange);
        socket.on('playerChange', subscribers.playerChange);
        game.client.enemyBullet = subscribers.enemyBullet;
        game.client.enemyBulletDestroyed = subscribers.enemyBulletDestroyed;
        signedIn = subscribers.signedIn;
    };


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
        signIn: signIn,
        setSubscribers: setSubscribers,
        updatePlayer: updatePlayer,
        sendBullet: sendBullet,
        bulletDestroyed: bulletDestroyed
    };
}