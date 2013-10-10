function Logger(display) {

    var logQueue = [];
    var loggerHub = null;
    var connected = false;

    var write = function (message, pushToRemote) {
        pushToRemote = typeof pushToRemote !== 'undefined' ? pushToRemote : true;
        console.log(message);

        if (pushToRemote) {
            if (!connected) {
                logQueue.push(message);
            } else {
                loggerHub.server.info(message);
            }
        }

        if (!display)
            return;

        display.prepend(message + "<br />");
    };

    var connect = function (connection) {
        loggerHub = connection.logEntriesHub;
        connected = true;

        console.log("Pushing " + logQueue.length + " log messages to the server");

        for (var i = 0; i < logQueue.length; i++) {
            loggerHub.server.info(logQueue[i]);
        }

        logQueue = [];
    };

    return {
        write: write,
        connect: connect
    };
}