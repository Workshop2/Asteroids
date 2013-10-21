function Asteroid(two) {
    var height = 50,
		width = 50;
    
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
        
        // where the magic happens (random stuff - no idea what is going on)
        var d = v.destination;
        v.x += (d.x - v.x) * 0.964;
        v.y += (d.y - v.y) * 0.976;
    }
    
    // position in center of screen
    var group = two.makeGroup(asteroid);
    group.translation.set(two.width / 2, two.height / 2);

    return group;
};