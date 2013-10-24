/// <reference path="asteroid.js" />
function AsteroidCollection(two, boundaries, asteroids) {
    asteroids = asteroids || [];

    var update = function () {
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].update();
        }
    };

    var newAsteroid = function (position) {
        var size = { width: 25 + random(25), height: 25 + random(25) };

        asteroids.push(new Asteroid(two, boundaries, size, position));
    };

    // used at runtime to generate an asteroid outside of the game boundaries
    var spawnAsteroid = function () {
        var position = { x: -random(300), y: -random(300) };
        newAsteroid(position);
    };

    function random(max) {
        max = max | 1;

        return Math.floor(Math.random() * max) + 1;
    }

    return {
        update: update,
        newAsteroid: newAsteroid,
        spawnAsteroid: spawnAsteroid
    };
};