function Enemy(userInfo, ship) {
    var keys = [],
        keyMap = new Keys().keyMap;

    var destroy = function () {
        ship.destroy();
    };

    var updateFromDto = function (dto) {
        // store down the currently pressed keys for the update to used
        keys = dto.keys;
        ship.updateFromDto(dto);
    };

    var update = function () {
        // simulate the buttons being pressed
        // improves smoothness
        if (keyExists(keyMap.up)) {
            ship.accelerate();
        }
        
        if (keyExists(keyMap.left)) {
            ship.leftTurn();
        }
        
        if (keyExists(keyMap.right)) {
            ship.rightTurn();
        }

        ship.update();
    };

    var keyExists = function(key) {
        return keys.indexOf(key) >= 0;
    };

    var shootBullet = function (bulletDto) {
        ship.fireFromDto(bulletDto);
    };

    var destroyBullet = function (bulletDto) {
        ship.destroyBulletDto(bulletDto);
    };

    return {
        guid: userInfo.guid,
        ship: ship,
        destroy: destroy,
        updateFromDto: updateFromDto,
        update: update,
        shootBullet: shootBullet,
        destroyBullet: destroyBullet
    };
}