/// <reference path="enemy.js" />
/// <reference path="logger.js" />
function Bullet(two, shipDetails, boundaries, logger, id) {

    // consts
    var moveSpeed = 4.5;

    // properties
    var shape = two.makeCircle(shipDetails.x, shipDetails.y, 2),
        velocityX = /*shipDetails.velocityX +*/ moveSpeed,
        velocityY = /*shipDetails.velocityY +*/ moveSpeed,
        victim = null;

    shape.fill = shipDetails.colour;
    shape.rotation = shipDetails.rotation;


    var update = function () {
        shape.translation.x += Math.cos(shape.rotation) * velocityX;
        shape.translation.y += Math.sin(shape.rotation) * velocityY;
    };

    var outOfBounds = function () {
        var x = shape.translation.x,
            y = shape.translation.y,
            result = false;

        if (x < boundaries.width.min) {
            result = true;
        }

        if (x > boundaries.width.max) {
            result = true;
        }

        if (y < boundaries.height.min) {
            result = true;
        }

        if (y > boundaries.height.max) {
            result = true;
        }

        return result;
    };

    // Has the bullet collided with an enemy
    var collisionDetected = function (enemy) {
        var twoObject = enemy.ship.ship;
        var distance = shape.translation.distanceTo(twoObject.translation);
        var detected = distance < 10;

        if (detected) {
            logger.write("Collision detected with player " + enemy.guid, false);
        }

        return detected;
    };

    var destroy = function () {
        shape.translation.x = -100;
        shape.translation.y = -100;
        two.remove(shape);
    };

    var generateDto = function () {
        return {
            x: parseInt(shape.translation.x),
            y: parseInt(shape.translation.y),
            r: shape.rotation,
            id: id,
            v: victim
        };
    };

    var setVictim = function(newVictim) {
        victim = newVictim;
    };

    return {
        update: update,
        outOfBounds: outOfBounds,
        destroy: destroy,
        shape: shape,
        generateDto: generateDto,
        collisionDetected: collisionDetected,
        setVictim: setVictim
    };
};