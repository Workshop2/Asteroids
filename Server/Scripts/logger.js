function Logger(display) {

    var write = function(message) {
        console.log(message);

        if (!display)
            return;

        display.prepend(message + "<br />");
    };

    return {
        write: write
    };
}