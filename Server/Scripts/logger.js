function Logger(connection, display) {

    var loggerHub = connection.logEntriesHub;

    var write = function(message) {
        console.log(message);
        loggerHub.server.info(message);

        if (!display)
            return;

        display.prepend(message + "<br />");
    };

    return {
        write: write
    };
}