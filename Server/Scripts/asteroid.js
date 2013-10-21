function Asteroid(two) {
    var height = 50,
		width = 50;

    //var coords = [];

    //var addCoord = function (x, y) {
    //    coords.push(new Two.Anchor(x, y));
    //};

    //addCoord(-width, -height);
    //addCoord(-width, height);
    //addCoord(width, height);
    //addCoord(width, -height);


    //var ship = two.makePolygon(coords);
    var asteroid = two.makeCircle(height, width, width);
    asteroid.stroke = '#BFFF00';
    asteroid.linewidth = 2;
    asteroid.noFill();
    
    for (var i = 0; i < asteroid.vertices.length; i++) {
        var v = asteroid.vertices[i];
        var pct = (i + 1) / asteroid.vertices.length;
        var theta = pct * Math.PI * 2;
        var radius = Math.random() * height / 3 + height / 6;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta);
        v.set(height / 3 * Math.cos(theta), height / 3 * Math.sin(theta));
        v.destination = new Two.Vector(x, y);
        v.step = Math.sqrt(Math.random()) + 2;

        for (var j = 0; j < 1000; j++) {
            var vv = asteroid.vertices[i];
            var d = vv.destination;


            vv.x += (d.x - vv.x) * 0.125;
            vv.y += (d.y - vv.y) * 0.125;
        }
    }

    //for (var j = 0; j < 1000; j++) {
    //    for (var ii = 0; ii < asteroid.vertices.length; ii++) {
    //        var vv = asteroid.vertices[ii];
    //        var d = vv.destination;


    //        vv.x += (d.x - vv.x) * 0.125;
    //        vv.y += (d.y - vv.y) * 0.125;
    //    }
    //}

    // position in center of screen
    var group = two.makeGroup(asteroid);
    group.translation.set(two.width / 2, two.height / 2);

    return group;
};