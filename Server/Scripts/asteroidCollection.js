/// <reference path="asteroid.js" />
function AsteroidCollection(two, boundaries, asteroids) {
    asteroids = asteroids || [];

    var update = function() {
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].update();
        }
    };

    var newAsteroid = function() {
        asteroids.push(new Asteroid(two, boundaries));
    };

    return {
        update: update,
        newAsteroid: newAsteroid
    };
};