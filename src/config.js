Chicken.register("Config", {
    game: {
        updatePeriod: 0.01,
        width: 800,
        height: 600,
    },
    controller: {
        deadzoneSize: 0.3,
    },
    player: {
        speed: 300,
        shotPeriod: 0.1,
    },
    enemy: {
        speed: 100,
        spawnPeriod: 2,
        intialSpawnDelay: 3,
        minSpawnDistance: 150 * 150,
    },
    bullet: {
        speed: 600,
    }
});