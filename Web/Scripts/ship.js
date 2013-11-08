function Ship(two, colour) {
    var height = 14,
		width = 20;

    var x1 = -(width / 2),
        y1 = -(height / 2),

        x2 = -(width / 2),
        y2 = (height / 2),

        x3 = width / 2,
        y3 = 0;

    var ship = two.makePolygon(x1, y1, x2, y2, x3, y3);
    ship.stroke = colour || '#BFFF00';
    ship.linewidth = 2;
    ship.noFill();

    // position in center of screen
    var group = two.makeGroup(ship);
    group.translation.set(two.width / 2, two.height / 2);

    return group;
};