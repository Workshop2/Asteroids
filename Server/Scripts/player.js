/// <reference path="spaceMovement.js" />
/// <reference path="bullet.js" />
function Player(two, ship, boundaries, logger, guid, colour) {

    /*
        Private Members
    */
    
    var shootCount = 0,
        movement = new SpaceMovement({}, ship.translation.x, ship.translation.y, ship.rotation),
        bullets = [];

    var eventHandlers = {
        bulletDestroyed: function () { }
    };




    /*
        Methods and functions
    */

    var update = function (enemies) {
        var shipUpdate = movement.update();

        ship.translation.x = shipUpdate.x;
        ship.translation.y = shipUpdate.y;
        ship.rotation = shipUpdate.rotation;

        wrapShip();
        updateBullets(enemies);
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

        var bulletDto = $.extend(movement.generateDto(), { colour: colour });

        var bullet = new Bullet(two, bulletDto, boundaries, logger, shootCount);
        bullets.push(bullet);

        return bullet;
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
    


    /*
        Bullets
    */

    var fireFromDto = function (bulletDto) {
        shootCount++;
        
        bulletDto = $.extend(bulletDto, { colour: colour });

        var bullet = new Bullet(two, bulletDto, boundaries, logger, bulletDto.id);
        bullets.push(bullet);

        return bullet;
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



    /*
        Network Stuff
    */

    var generateDto = function () {
        return movement.generateDto();
    };

    var updateFromDto = function (dto) {
        movement.updateFromDto(dto);
    };



    /*
        Destructor
    */

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