function PlayerState() {
    var pressedKeys = [],
        stateHasChanged = false;

    var keyPressed = function (key) {
        var keyIndex = pressedKeys.indexOf(key);

        if (keyIndex < 0) {
            stateHasChanged = true;
            pressedKeys.push(key);
        }
    };

    var keyNotPressed = function (key) {
        var keyIndex = pressedKeys.indexOf(key);

        if (keyIndex >= 0) {
            stateHasChanged = true;
            pressedKeys.splice(keyIndex, 1);
        }
    };
    
    var changed = function() {
        return stateHasChanged;
    };

    var reset = function() {
        stateHasChanged = false;
    };

    return {
        changed: changed,
        reset: reset,
        keyPressed: keyPressed,
        keyNotPressed: keyNotPressed,
        pressedKeys: pressedKeys
    };
}