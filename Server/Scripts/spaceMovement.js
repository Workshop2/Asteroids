function SpaceMovement(variables, x, y, rotation) {

    variables = $.extend(variables, {
        moveSpeed:      0.05,
        rotationSpeed:  0.04,
        velocityDrag:   0.998,
        rotationDrag:   0.940,
        maxSpeed:       4
    });
    
    var velocityX = 0,
		velocityY = 0,
		velocityRotation = 0;

    var rotateLeft = function () {
        velocityRotation = -variables.rotationSpeed;
    };

    var rotateRight = function () {
        velocityRotation = variables.rotationSpeed;
    };

    var accelerate = function () {
        // where the magic happens
        if (velocityX < variables.maxSpeed && velocityX > -variables.maxSpeed)
            velocityX += Math.cos(rotation) * variables.moveSpeed;

        if (velocityY < variables.maxSpeed && velocityY > -variables.maxSpeed)
            velocityY += Math.sin(rotation) * variables.moveSpeed;
    };

    var update = function () {
        x += velocityX;
        y += velocityY;

        // apply drag to the ship
        velocityX *= variables.velocityDrag;
        velocityY *= variables.velocityDrag;
        
        rotation += velocityRotation;
        velocityRotation *= variables.rotationDrag;

        return {
            x: x,
            y: y,
            rotation: rotation
        };
    };

    var setX = function (newX) {
        x = newX;
    };

    var setY = function (newY) {
        y = newY;
    };

    return {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        accelerate: accelerate,
        update: update,
        setX: setX,
        setY: setY
    };
};