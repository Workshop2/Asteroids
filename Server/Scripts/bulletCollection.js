/// <reference path="bullet.js" />
/// <reference path="logger.js" />
function BulletCollection(two, boundaries, logger, colour) {
    var bullets = [],
        shootCount = 0;

    var update = function (enemies) {
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

            destroyBullet(oldBullet);
        }

        return removedItems;
    };

    var newBullet = function(position) {
        shootCount++;

        var bulletDto = $.extend(position, { colour: colour });

        var bullet = new Bullet(two, bulletDto, boundaries, logger, shootCount);
        bullets.push(bullet);

        return bullet;
    };

    var newBulletFromDto = function (bulletDto) {
        shootCount++;

        bulletDto = $.extend(bulletDto, { colour: colour });

        var bullet = new Bullet(two, bulletDto, boundaries, logger, bulletDto.id);
        bullets.push(bullet);

        return bullet;
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

    var clear = function () {
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];

            // we dont care about splicing the list, just kill all bullets
            bullet.destroy();
        }
    };

    return {
        update: update,
        
        newBullet: newBullet,
        newBulletFromDto: newBulletFromDto,
        
        destroyBullet: destroyBullet,
        destroyBulletDto: destroyBulletDto,
        
        clear: clear
    };
};