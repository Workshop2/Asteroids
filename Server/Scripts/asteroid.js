/// <reference path="spaceMovement.js" />
/// <reference path="two.js" />
function Asteroid(two, boundaries, size, initialPosition) {
    
    size = $.extend({}, {width: 50, height: 50}, size);

    var asteroid = generateAsteroid(two);

    initialPosition = $.extend({}, {
        x: random(boundaries.width.max),
        y: random(boundaries.height.max),
        rotation: asteroid.rotation
    }, initialPosition);

    var movementConsts = {
        moveSpeed: 0.01,
        rotationSpeed: 0.01,
        velocityDrag: 1, // never drag
        rotationDrag: 1, // never drag
        maxSpeed: 1
    };

    var movementVars = {
        velocityX: Math.random() - 0.6,
        velocityY: Math.random() - 0.4,
        velocityRotation: Math.random() / 10 - 0.04
    };

    var movement = new SpaceMovement(initialPosition, movementConsts, movementVars);
    

    var update = function () {
        var updateResult = movement.update();

        asteroid.translation.set(updateResult.x, updateResult.y);
        asteroid.rotation = updateResult.rotation;

        wrapAsteroid();
    };
    
    var wrapAsteroid = function () {
        // horizontal
        if (asteroid.translation.x < boundaries.width.min) {
            movement.setX(boundaries.width.max);
        }
        else if (asteroid.translation.x > boundaries.width.max) {
            movement.setX(boundaries.width.min);
        }

        // vertical
        if (asteroid.translation.y < boundaries.height.min) {
            movement.setY(boundaries.height.max);
        }
        else if (asteroid.translation.y > boundaries.height.max) {
            movement.setY(boundaries.height.min);
        }
    };


    /*
        Static methods
    */
    function generateAsteroid(twoJs) {
        var height = size.height,
            width = size.width;

        var newAsteroid = twoJs.makeCircle(height, width, 0);
        newAsteroid.translation.set(-size.width, -size.height);
        newAsteroid.stroke = '#BFFF00';
        newAsteroid.linewidth = 2;
        newAsteroid.noFill();

        for (var i = 0; i < newAsteroid.vertices.length; i++) {
            var v = newAsteroid.vertices[i];
            var pct = (i + 1) / newAsteroid.vertices.length;
            var theta = pct * Math.PI * 2;
            var radius = Math.random() * height / 3 + height / 6;
            var x = radius * Math.cos(theta);
            var y = radius * Math.sin(theta);
            v.set(height / 3 * Math.cos(theta), height / 3 * Math.sin(theta));
            v.destination = new Two.Vector(x, y);
            v.step = Math.sqrt(Math.random()) + 2;

            // where the magic happens (random stuff - no idea what is going on)
            var d = v.destination;
            v.x += (d.x - v.x) * 0.964;
            v.y += (d.y - v.y) * 0.976;
        }
        
        return newAsteroid;
    };
    
    function random(max) {
        max = max | 1;

        return Math.floor(Math.random() * max) + 1;
    }

    return {
        update: update
    };
};