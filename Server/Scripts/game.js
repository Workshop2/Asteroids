/// <reference path="player.js" />
/// <reference path="keys.js" />
function AsteroidsGame(two, boundaries, logger) {
    
	// properties 
	var player = null,
		key = new Keys(),
	    enemies = {},
	    server = null,
	    count = 0,
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

		//if (count > 5) {
		    updatePlayer(player.generateDto());
		    count = 0;
		//}

		// update the fps counter
	    fps.Count();

	    count++;
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


    /*
        ----------- Connection stuff -----------
    */
    var setConnector = function(connector) {
        server = connector;
    };

	var playerJoined = function (playerInfo) {
	    debugger;
	    logger.write(playerInfo.displayName + " has joined the game");

	    var ship = createShip();
	    var enemy = new Enemy(playerInfo, ship, two);

	    enemies[playerInfo.guid] = enemy;
	};

	var playerDisconnected = function (playerInfo) {
	    debugger;
	    logger.write(playerInfo.displayName + " has left the game");
	};

    var updatePlayer = function(userDto) {
        server.updatePlayer(userDto);
    };

	var playerChange = function (playerDto) {
	    debugger;
	    logger.write(playerDto.guid + " moved");

	    var enemy = enemies[playerDto.guid];
	    if (!enemy)
	        return;

	    enemy.update(playerDto);
	};
	
	return {
	    play: play,
	    setConnector: setConnector,
	    playerJoined: playerJoined,
	    playerDisconnected: playerDisconnected,
	    playerChange: playerChange
	};
};
