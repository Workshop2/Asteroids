function Enemy(userInfo, ship, two) {
    
    var destroy = function() {
        two.remove(ship.ship);
    };

    var updateFromDto = function (dto) {
        ship.updateFromDto(dto);
    };

    var update = function () {
        ship.update();
    };

    return {
        guid: userInfo.guid,
        ship: ship,
        destroy: destroy,
        updateFromDto: updateFromDto,
        update: update
    };
}