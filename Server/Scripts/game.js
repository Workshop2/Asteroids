function AsteroidsGame(two, boundaries, logger) {
    
	// properties 
	var player = null,
		key = new Keys();
	
	two.bind('update', function() {
		if(key.isPressed(key.keyMap.left)) {
			player.leftTurn();
		}
		
		if(key.isPressed(key.keyMap.right)) {
			player.rightTurn();
		}
		
		if(key.isPressed(key.keyMap.up)) {
			player.accelerate();
		}
		
		player.update();
		
		// update the fps counter
		fps.Count();
	});
	
	var createShip = function() {
		var height = 7,
			width = 10;
	
		var x1 = -(width / 2),
			y1 = -(height / 2),
			
			x2 = -(width / 2),
			y2 = (height / 2),
			
			x3 = width / 2,
			y3 = 0;
		
		var ship = two.makePolygon(x1, y1, x2, y2, x3, y3);
		ship.stroke = '#BFFF00';
		ship.linewidth = 1;
		ship.noFill();
		
		// position in center of screen
		var group = two.makeGroup(ship);
		group.translation.set(two.width / 2, two.height / 2);
		
		return new Player(group, boundaries);
	};
	
	var play = function() {
	    player = player || createShip();
		two.play();
	};

	var playerJoined = function (playerInfo) {
	    debugger;
	    logger.write(playerInfo.displayName + " has joined the game");
	};

	var playerDisconnected = function (playerInfo) {
	    debugger;
	    logger.write(playerInfo.displayName + " has left the game");
	};
	
	return {
	    play: play,
	    playerJoined: playerJoined,
	    playerDisconnected: playerDisconnected
	};
};
