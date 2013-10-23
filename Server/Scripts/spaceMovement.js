function SpaceMovement(x, y, rotation, consts, variables) {

    consts = $.extend({
        moveSpeed: 0.05,
        rotationSpeed: 0.04,
        velocityDrag: 0.998,
        rotationDrag: 0.940,
        maxSpeed: 4
    }, consts);

    variables = $.extend({
        velocityX: 0,
        velocityY: 0,
        velocityRotation: 0
    }, variables);

    var rotateLeft = function () {
        variables.velocityRotation = -consts.rotationSpeed;
    };

    var rotateRight = function () {
        variables.velocityRotation = consts.rotationSpeed;
    };

    var accelerate = function () {
        // where the magic happens
        if (variables.velocityX < consts.maxSpeed && variables.velocityX > -consts.maxSpeed)
            variables.velocityX += Math.cos(rotation) * consts.moveSpeed;

        if (variables.velocityY < consts.maxSpeed && variables.velocityY > -consts.maxSpeed)
            variables.velocityY += Math.sin(rotation) * consts.moveSpeed;
    };

    var update = function () {
        x += variables.velocityX;
        y += variables.velocityY;

        // apply drag to the ship
        variables.velocityX *= consts.velocityDrag;
        variables.velocityY *= consts.velocityDrag;
        
        rotation += variables.velocityRotation;
        variables.velocityRotation *= consts.rotationDrag;

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

    var updateFromDto = function (dto) {
        x = dto.x;
        y = dto.y;
        rotation = dto.r;

        variables.velocityX = dto.vx;
        variables.velocityY = dto.vy;
        variables.velocityRotation = dto.vR;
    };

    var generateDto = function () {
        return {
            x: Math.round(x), // returning int to help reduce the data size being transfered
            y: Math.round(y),
            r: rotation,
            vx: variables.velocityX,
            vy: variables.velocityY,
            vR: variables.velocityRotation
        };
    };

    return {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        accelerate: accelerate,
        update: update,
        setX: setX,
        setY: setY,
        updateFromDto: updateFromDto,
        generateDto: generateDto
    };
};