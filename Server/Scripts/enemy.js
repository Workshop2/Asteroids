function Enemy(userInfo, ship, two) {
    
    var destroy = function() {
        two.remove(ship.ship);
    };

    var update = function (dto) {
        ship.updateFromDto(dto);
    };

    return {
        guid: userInfo.guid,
        ship: ship,
        destroy: destroy,
        update: update
    };
}