/// <reference path="player.js" />
/// <reference path="keys.js" />

function AsteroidsGame(two, boundaries) {
    
	// properties 
	var player = null,
		key = new Keys(),
	    spaceCount = 0;
	
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

		if (key.isPressed(key.keyMap.space)) {
		    if(spaceCount == 0)
		        player.fire();

		    spaceCount++;
		}
  
		if (spaceCount > 10)
		    spaceCount = 0;
		
		player.update();
		
		// update the fps counter
		fps.Count();
	});
	
	var createShip = function() {
		var height = 14,
			width = 20;
	
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
		
		return new Player(two, group, boundaries);
	};
	
	var play = function() {
	    player = player || createShip();
		two.play();
	};
	
	return {
		play: play
	};
};
