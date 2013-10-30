/// <reference path="enemies.js" />
/// <reference path="logger.js" />
/// <reference path="enemy.js" />
/// <reference path="player.js" />
/// <reference path="ship.js" />
function EnemyCollection(two, boundaries, logger) {
    var enemies = {};

    var update = function () {
        for (var enemy in enemies) {
            enemies[enemy].update();
        }
    };

    var updateEnemy = function(enemyDto) {
        var enemy = enemies[enemyDto.guid];
        if (!enemy)
            return;

        enemy.updateFromDto(enemyDto);
    };

    var newEnemy = function (enemyInfo) {
        logger.write(enemyInfo.displayName + " has joined the game");

        var enemyPlayer = new Player(two, boundaries, logger, enemyInfo.guid, enemyInfo.colour);
        var enemy = new Enemy(enemyInfo, enemyPlayer);

        enemies[enemyInfo.guid] = enemy;
    };

    var removeEnemy = function (enemyDto) {
        logger.write(enemyDto.displayName + " has left the game");

        var enemy = enemies[enemyDto.guid];
        if (!enemy)
            return;

        enemy.destroy();

        delete enemies[enemyDto.guid];
    };

    var shootBullet = function (bulletDto) {
        var enemy = enemies[bulletDto.pid];
        if (!enemy)
            return;

        enemy.shootBullet(bulletDto);
    };

    var destroyBullet = function (bulletDto) {
        var enemy = enemies[bulletDto.pid];
        if (!enemy)
            return;

        enemy.destroyBullet(bulletDto);
    };
    
    var numberOfEnemies = function () {
        return Object.keys(enemies).length;
    };

    return {
        update: update,
        newEnemy: newEnemy,
        removeEnemy: removeEnemy,
        updateEnemy: updateEnemy,
        shootBullet: shootBullet,
        destroyBullet: destroyBullet,
        numberOfEnemies: numberOfEnemies,
        _enemies: enemies
    };
};