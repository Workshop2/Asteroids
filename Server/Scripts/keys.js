function Keys() {
	var pressedKeys = [];
	var ignoreKeys = [];
		
	var keyDown = function(e) {
		if(ignoreKey(e.which))
			return;
			
		var keyIndex = pressedKeys.indexOf(e.which);
		
		if(keyIndex < 0) {
			pressedKeys.push(e.which);
		}
		
		e.preventDefault();
	};
	
	var keyUp = function(e) {
		if(ignoreKey(e.which))
			return;
		
		var keyIndex = pressedKeys.indexOf(e.which);
		
		if(keyIndex >= 0) {
			pressedKeys.splice(keyIndex, 1);
		}
		
		e.preventDefault();
	};

    var isPressed = function(key) {
        var keyIndex = pressedKeys.indexOf(key);

        return (keyIndex >= 0);
    };
	
	var ignoreKey = function(key) {
		return ignoreKeys.indexOf(key) >= 0;
	};

    var reset = function() {
        pressedKeys = [];
    };
	
	var keyMap = {
		up:     38,
		down:   40,
		left:   37,
		right:  39,
		space:  32,
		alt:    18,
		ctrl:   17
	};
	
	$(document).keydown(keyDown);
	$(document).keyup(keyUp);
	
	// ignore the F keys
	for(var i = 112; i <= 123; i++) {
		ignoreKeys.push(i);
	}

	ignoreKeys.push(keyMap.alt);
	ignoreKeys.push(keyMap.ctrl);
	
	return {
		keyMap: keyMap,
		isPressed: isPressed,
		ignoreKeys: ignoreKeys,
		reset: reset
	};
};
