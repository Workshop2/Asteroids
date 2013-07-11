function Enemy(userInfo, ship, two) {
    
    var destroy = function() {
        two.remove(ship);
    };

    var update = function(player) {
        debugger;

        ship.ship.translation.x = player.x;
        ship.ship.translation.y = player.y;
        ship.ship.rotation = player.r;
    };

    return {
        guid: userInfo.guid,
        ship: ship,
        destroy: destroy,
        update: update
    };
}