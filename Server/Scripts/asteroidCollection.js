/// <reference path="asteroid.js" />
function AsteroidCollection(two, boundaries, asteroids) {
    asteroids = asteroids || [];

    var update = function() {
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].update();
        }
    };

    var newAsteroid = function () {
        var size = {
            width: 25 + Math.floor(Math.random() * 25) + 1,
            height: 25 + Math.floor(Math.random() * 25) + 1,
        };

        asteroids.push(new Asteroid(two, boundaries, size));
    };

    return {
        update: update,
        newAsteroid: newAsteroid
    };
};