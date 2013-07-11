function Logger(display) {

    var logQueue = [];
    var loggerHub = null;
    var connected = false;

    var write = function (message) {
        console.log(message);

<<<<<<< HEAD
        if (!connected) {
            logQueue.push(message);
        }
        else {
=======
        if (!connected)
        {
            logQueue.push(message);
        }
        else
        {
>>>>>>> eba791889fd44f028d3f3b3a33dc59b73b141054
            loggerHub.server.info(message);
        }

        if (!display)
            return;

        display.prepend(message + "<br />");
    };

    var connect = function (connection) {
        loggerHub = connection.logEntriesHub;
        connected = true;

        console.log("Pushing " + logQueue.length + " log messages to the server");
<<<<<<< HEAD

=======
>>>>>>> eba791889fd44f028d3f3b3a33dc59b73b141054
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