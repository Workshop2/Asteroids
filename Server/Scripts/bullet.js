﻿function Bullet(two, shipDetails, boundaries) {
    
    // consts
    var moveSpeed = 4.5;

    // properties
    var shape = two.makeCircle(shipDetails.x, shipDetails.y, 2),
        velocityX = /*shipDetails.velocityX +*/ moveSpeed,
        velocityY = /*shipDetails.velocityY +*/ moveSpeed;


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

    var destroy = function () {
        shape.translation.x = -100;
        shape.translation.y = -100;
        two.remove(shape);
    };

    var generateDto = function() {
        return {
            x: parseInt(shape.translation.x),
            y: parseInt(shape.translation.y),
            r: shape.rotation,
            id: shipDetails.guid
        };
    };

    return {
        update: update,
        outOfBounds: outOfBounds,
        destroy: destroy,
        shape: shape,
        generateDto: generateDto
    };
};