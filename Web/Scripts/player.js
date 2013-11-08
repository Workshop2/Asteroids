/// <reference path="spaceMovement.js" />
/// <reference path="bullet.js" />
/// <reference path="ship.js" />
/// <reference path="bulletCollection.js" />
function Player(two, boundaries, logger, guid, colour) {

    /*
        Private Members
    */
    var ship = new Ship(two, colour);

    var movement = new SpaceMovement({ x: ship.translation.x, y: ship.translation.y, rotation: ship.rotation }),
        bullets = new BulletCollection(two, boundaries, logger, colour);

    var eventHandlers = {
        bulletDestroyed: function () { }
    };



    /*
        Methods and functions
    */

    var update = function (enemies) {
        var shipUpdate = movement.update();

        ship.translation.set(shipUpdate.x, shipUpdate.y);
        ship.rotation = shipUpdate.rotation;

        wrapShip();
        updateBullets(enemies);
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

    var updateBullets = function (enemies) {
        var removedBullets = bullets.update(enemies);
        
        for (var i = 0; i < removedBullets.length; i++) {
            eventHandlers.bulletDestroyed(removedBullets[i]);
        }
    };

    var fire = function () {
        return bullets.newBullet(movement.generateDto());
    };
    
    
    /*
        Destructor
    */

    var destroy = function () {
        bullets.clear();

        // remove ship element
        two.remove(ship);
    };

    return {
        ship: ship,
        leftTurn: movement.rotateLeft,
        rightTurn: movement.rotateRight,
        accelerate: movement.accelerate,
        update: update,
        generateDto: movement.generateDto,
        fire: fire,
        updateFromDto: movement.updateFromDto,
        fireFromDto: bullets.newBulletFromDto,
        eventHandlers: eventHandlers,
        destroyBulletDto: bullets.destroyBulletDto,
        destroy: destroy
    };
};