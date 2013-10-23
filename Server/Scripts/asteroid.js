/// <reference path="spaceMovement.js" />
/// <reference path="two.js" />
function Asteroid(two) {
    var height = 50,
		width = 50;

    var asteroid = generateAsteroid(two);

    var movementConsts = {
        moveSpeed: 0.01,
        rotationSpeed: 0.01,
        velocityDrag: 1,
        rotationDrag: 1,
        maxSpeed: 1
    };

    var movementVars = {
        velocityX: 0.5,
        velocityY: 0.5,
        velocityRotation: 0.02
    };

    var movement = new SpaceMovement(asteroid.translation.x, asteroid.translation.y, asteroid.rotation, movementConsts, movementVars);
    

    var update = function () {
        var updateResult = movement.update();

        asteroid.translation.set(updateResult.x, updateResult.y);
        //asteroid.translation.x = updateResult.x;
        //asteroid.translation.y = updateResult.y;
        asteroid.rotation = updateResult.rotation;
    };


    /*
        Static methods
    */
    function generateAsteroid(twoJs) {
        var newAsteroid = twoJs.makeCircle(height, width, width);
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

        // position in center of screen
        //var group = two.makeGroup(asteroid);
        //group.translation.set(two.width / 2, two.height / 2);

        return newAsteroid;
    };

    return {
        update: update
    };
};