function PlayerState() {
    var pressedKeys = [],
        stateHasChanged = false;

    var keyUp = function(key) {
        var keyIndex = pressedKeys.indexOf(key);

        if (keyIndex >= 0) {
            pressedKeys.splice(keyIndex, 1);
        }
    };

    var keyDown = function (key) {

    };
    
    var changed = function() {
        return stateHasChanged;
    };

    return {
      changed: changed  
    };
}