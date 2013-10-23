// Contains all of the logic for movement within the the game
// Can pass any Two.js object in to give it ship movement
function Player(two, ship, boundaries, logger, guid, colour) {

    // consts
    var moveSpeed = 0.05,
		rotationSpeed = 0.04,
		velocityDrag = 0.998,
		rotationDrag = 0.940,
        maxSpeed = 4;

    // private members
    var velocityX = 0,
		velocityY = 0,
		velocityRotation = 0,
        shootCount = 0;

    var movement = new SpaceMovement({}, ship.translation.x, ship.translation.y, ship.rotation);

    var bullets = [];

    var eventHandlers = {
        bulletDestroyed: function () { }
    };

    var leftTurn = function () {
        movement.rotateLeft();
    };

    var rightTurn = function () {
        movement.rotateRight();
    };

    var accelerate = function () {
        movement.accelerate();
    };

    var fire = function () {
        shootCount++;

        var shipDetails = $.extend(movement.generateDto(), { colour: colour });

        var bullet = new Bullet(two, shipDetails, boundaries, logger, shootCount);
        bullets.push(bullet);

        return bullet;
    };

    var fireFromDto = function (bulletDto) {
        shootCount++;
        
        var shipDetails = $.extend(bulletDto, { colour: colour });

        var bullet = new Bullet(two, shipDetails, boundaries, logger, bulletDto.id);
        bullets.push(bullet);

        return bullet;
    };

    var update = function (enemies) {
        var shipUpdate = movement.update();

        ship.translation.x = shipUpdate.x;
        ship.translation.y = shipUpdate.y;
        ship.rotation = shipUpdate.rotation;

        wrapShip();
        updateBullets(enemies);
    };

    var updateBullets = function (enemies) {
        var removedItems = [];

        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            var shouldDestroy = false;

            bullet.update();

            if (bullet.outOfBounds()) {
                shouldDestroy = true;
            }

            for (var enemyGuid in enemies) {
                if (bullet.collisionDetected(enemies[enemyGuid])) {
                    shouldDestroy = true;
                    bullet.setVictim(enemyGuid);
                }
            }

            if (shouldDestroy) {
                removedItems.push(bullet);
            }
        }

        for (var j = 0; j < removedItems.length; j++) {
            var oldBullet = removedItems[j];
            eventHandlers.bulletDestroyed(oldBullet);

            destroyBullet(oldBullet);
        }
    };

    // If the ship leaves the boundaries of the games, wrap it
    var wrapShip = function () {
        // horizontal
        if (ship.translation.x < boundaries.width.min) {
            movement.setX(boundaries.width.max);
        }
        else if (ship.translation.x > boundaries.width.max) {
            movement.setX(boundaries.width.min);
        }

        // vertical
        if (ship.translation.y < boundaries.height.min) {
            movement.setY(boundaries.height.max);
        }
        else if (ship.translation.y > boundaries.height.max) {
            movement.setY(boundaries.height.min);
        }
    };

    var generateDto = function () {
        return movement.generateDto();
    };

    var updateFromDto = function (dto) {
        movement.updateFromDto(dto);
    };

    var destroyBullet = function (bullet) {
        var index = bullets.indexOf(bullet);
        bullet.destroy();

        if (index >= 0) {
            bullets.splice(index, 1);
        }
    };

    var destroyBulletDto = function (bulletDto) {
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];

            if (bullet.id == bulletDto.id) {
                destroyBullet(bullet);
                break;
            }
        }
    };

    var destroy = function () {
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];

            // we dont care about splicing the list, just kill all bullets
            bullet.destroy();
        }

        // remove ship element
        two.remove(ship);
    };

    return {
        ship: ship,
        leftTurn: leftTurn,
        rightTurn: rightTurn,
        accelerate: accelerate,
        update: update,
        generateDto: generateDto,
        fire: fire,
        updateFromDto: updateFromDto,
        fireFromDto: fireFromDto,
        eventHandlers: eventHandlers,
        destroyBulletDto: destroyBulletDto,
        destroy: destroy
    };
};