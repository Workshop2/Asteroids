/// <reference path="keys.js" />
/// <reference path="player.js" />
function Enemy(userInfo, player) {
    var keys = [],
        keyMap = new Keys().keyMap;

    var destroy = function () {
        player.destroy();
    };

    var updateFromDto = function (dto) {
        // store down the currently pressed keys for the update to used
        keys = dto.keys;
        player.updateFromDto(dto);
    };

    var update = function () {
        // simulate the buttons being pressed
        // improves smoothness
        if (keyExists(keyMap.up)) {
            player.accelerate();
        }
        
        if (keyExists(keyMap.left)) {
            player.leftTurn();
        }
        
        if (keyExists(keyMap.right)) {
            player.rightTurn();
        }

        player.update();
    };

    var keyExists = function(key) {
        return keys.indexOf(key) >= 0;
    };

    var shootBullet = function (bulletDto) {
        player.fireFromDto(bulletDto);
    };

    var destroyBullet = function (bulletDto) {
        player.destroyBulletDto(bulletDto);
    };

    return {
        guid: userInfo.guid,
        ship: player.ship,
        destroy: destroy,
        updateFromDto: updateFromDto,
        update: update,
        shootBullet: shootBullet,
        destroyBullet: destroyBullet
    };
}