// Contains all of the logic for movement within the the game
// Can pass any Two.js object in to give it ship movement
function Player(two, ship, boundaries) {

	// consts
    var moveSpeed = 0.05,
		rotationSpeed = 0.04,
		velocityDrag = 0.998,
		rotationDrag = 0.940,
        bulletVelocity = 4;
		
	// private members
	var velocityX = 0,
		velocityY = 0,
		velocityRotation = 0;

    //ship.scale = 2;
	var bullets = [];

	var leftTurn = function() {
		velocityRotation = -rotationSpeed;
	};
	
	var rightTurn = function() {
		velocityRotation = rotationSpeed;
	};
	
	var accelerate = function () {
		velocityX += Math.cos(ship.rotation) * moveSpeed;
		velocityY += Math.sin(ship.rotation) * moveSpeed;
	};

	var fire = function () {
	    var bullet = two.makeCircle(ship.translation.x, ship.translation.y, 2);
	    bullet.rotation = ship.rotation;
	    bullets.push(bullet);
	};
	
	var update = function() {
		ship.translation.x += velocityX;
		ship.translation.y += velocityY;
		
		// apply drag to the ship
		velocityX *= velocityDrag;
		velocityY *= velocityDrag;
		
		ship.rotation += velocityRotation;
		velocityRotation *= rotationDrag;
		
		wrapShip();
		calculateBullets();
	};

	var calculateBullets = function () {
	    var removedItems = [];

	    for (var i = 0; i < bullets.length; i++) {
	        var bullet = bullets[i];
	        console.log(bullet.rotation);

	        if (bullet.translation.x < boundaries.width.min + 53
                || bullet.translation.x > boundaries.width.max - 53
	            || bullet.translation.y < boundaries.height.min
	            || bullet.translation.y > boundaries.height.max) {
	            two.remove(bullet);
	            removedItems.push(i);
	        }
	        else {
	            bullet.translation.x += Math.cos(bullet.rotation) * bulletVelocity;
	            bullet.translation.y += Math.sin(bullet.rotation) * bulletVelocity;
	        }
	    }

	    for (var j = 0; j < removedItems.length; j++) {
	        var index = removedItems[j];
	        bullets.splice(index, 1);
	    }
	};
	
	// If the ship leaves the boundaries of the games, wrap it
	var wrapShip = function () {
	    // horizontal
        if (ship.translation.x < boundaries.width.min) {
            ship.translation.x = boundaries.width.max;
        }
        else if (ship.translation.x > boundaries.width.max) {
            ship.translation.x = boundaries.width.min;
        }

        // vertical
        if (ship.translation.y < boundaries.height.min) {
            ship.translation.y = boundaries.height.max;
        }
        else if (ship.translation.y > boundaries.height.max) {
            ship.translation.y = boundaries.height.min;
        }
    };
	
	return {
		ship: ship,
		leftTurn: leftTurn,
		rightTurn: rightTurn,
		accelerate: accelerate,
		update: update,
        fire: fire
	};
};