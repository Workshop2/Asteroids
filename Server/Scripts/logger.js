function Logger(display) {

    var logQueue = [];
    var loggerHub = null;
    var connected = false;

    var write = function (message, pushToRemote) {
        pushToRemote = typeof pushToRemote !== 'undefined' ? pushToRemote : true;
        console.log(message);

        if (pushToRemote) {
            if (!connected) {
                logQueue.push({ type: "info", message: message });
            } else {
                loggerHub.server.info(message);
            }
        }

        if (!display)
            return;

        display.prepend(message + "<br />");
    };

    var error = function (message, b, c, d, errorDetails) {
        message = "<span style='color: red'>Error detected: " + message + "</span>";
        message += "<br /><span style='color: red'>: " + errorDetails.stack + "</span>";
        console.log(message);

        if (!connected) {
            logQueue.push({ type: "error", message: message });
        } else {
            loggerHub.server.error(message);
        }

        if (!display)
            return;

        display.prepend(message + "<br />");
    };

    var connect = function (connection) {
        loggerHub = connection.logEntriesHub;
        connected = true;

        console.log("Pushing " + logQueue.length + " log messages to the server");
        
        pushMessages();
    };

    // pushes messages to server if they have were logged before the connection was made
    var pushMessages = function () {
        for (var i = 0; i < logQueue.length; i++) {
            var log = logQueue[i];

            if (log.type == "info") {
                loggerHub.server.info(logQueue[i]);
            }
            else if (log.type == "error") {
                loggerHub.server.error(logQueue[i]);
            }
        }

        logQueue = [];
    };

    return {
        write: write,
        error: error,
        connect: connect
    };
}