Chicken.inject(["Config", "ChickenVis.UpdateLoop", "ChickenVis.FixedDeltaUpdater", "ChickenVis.Draw", "ChickenVis.Math"],
function (Config, UpdateLoop, FdUpdater, Draw, Math) {
    "use strict";

    Config.enemy.minSpawnDistance *= Config.enemy.minSpawnDistance;

    var draw;
    var frameCount = 0;
    var score = 0;
    var playerPos = Math.vector2(400, 300);
    var spawnCount = 1;
    var currentEnemyTime = Config.enemy.intialSpawnDelay;
    var currentShotTime = 0;
    var bullets = [];
    var enemies = [];


    var fixedUpdater = new FdUpdater((dt) => {
        updatePlayer(dt);
        updateEnemies(dt);
        updateBullets(dt);
    }, 0.010);

    function getAxes(gamePad, axes) {
        var v = gamePad.axes[axes];
        if ((-0.3 < v) && (v < 0.3)) return 0;
        return v;
    }

    function updatePlayer(dt) {
        var gamePad = navigator.getGamepads()[0];
        if (!gamePad) return;

        var dX = Config.player.speed * getAxes(gamePad, 0) * dt;
        var dY = Config.player.speed * getAxes(gamePad, 1) * dt;

        playerPos.x += dX;
        playerPos.y += dY;

        if (playerPos.x < 15) playerPos.x = 15;
        else if (playerPos.x > 785) playerPos.x = 785;
        if (playerPos.y < 15) playerPos.y = 15;
        else if (playerPos.y > 585) playerPos.y = 585;

        var bv = Math.vector2(getAxes(gamePad, 2), getAxes(gamePad, 3));
        currentShotTime -= dt;
        if (Math.lengthSqrd2(bv) >= 0.5 && currentShotTime <= 0) {
            Math.normalise2(bv);
            Math.scale2(bv, Config.bullet.speed);
            bullets.push({
                x: playerPos.x,
                y: playerPos.y,
                dX: bv.x,
                dY: bv.y
            });
            currentShotTime = Config.player.shotFrequency;
        }
    }

    function updateBullets(dt) {
        var oldBullets = bullets;
        bullets = [];
        for (var i = 0; i < oldBullets.length; i++) {
            var b = oldBullets[i];
            b.x += b.dX * dt;
            b.y += b.dY * dt;

            var hit = false;
            for (var j = 0; j < enemies.length; j++) {
                var enemy = enemies[j];
                if (Math.distanceBetweenSqrd2(enemy, b) <= (15*15)) {
                    enemies.splice(j, 1);
                    score++;
                    hit = true;
                    break;
                }
            }

            if (!hit && (0 < b.x) && (b.x < 800) && (0 < b.y) && (b.y < 600))
                bullets.push(b);
        }
    }

    function updateEnemies(dt) {
        currentEnemyTime -= dt;
        if (currentEnemyTime <= 0) {
            currentEnemyTime = Config.enemy.spawnFrequency;
            var neededEnemies = spawnCount - enemies.length;
            for (var i = 0; i < neededEnemies; i++) {
                var ev;
                do
                {
                    var x = Math.randomRange(0, 800);
                    var y = Math.randomRange(0, 600);
                    ev = Math.vector2(x, y);
                }
                while (Math.distanceBetweenSqrd2(playerPos, ev) < Config.enemy.minSpawnDistance);

                enemies.push(ev);
            }
            spawnCount++;
        }

        for (var i = 0; i < enemies.length; i++) {
            var ev = enemies[i];
            var d = Math.subAndClone2(playerPos, ev);
            Math.normalise2(d);
            Math.scaleAdd2(ev, d, Config.enemy.speed * dt);

            if (Math.distanceBetweenSqrd2(playerPos, ev) <= 30*30) {
                playerPos = Math.vector2(400, 300);
                bullets = [];
                enemies = [];
                spawnCount = 1;
                currentShotTime = 0;
                currentEnemyTime = Config.enemy.intialSpawnDelay;
                score = 0;
            }
        }
    }

    var updater = new UpdateLoop(function (dt) {
        fixedUpdater.update(dt);

        draw.rect(0, 0, 800, 600, "silver");
        draw.circle(playerPos.x, playerPos.y, 15, "rgb(0, 255, 0)");

        for (var i = 0; i < enemies.length; i++)
            draw.circle(enemies[i].x, enemies[i].y, 15, "orange");

        for (var i = 0; i < bullets.length; i++)
            draw.circle(bullets[i].x, bullets[i].y, 5, "rgb(255, 0, 0)");

        draw.text(`${score}`, 5, 5);
    });

    window.onload = function () {
        draw = new Draw(document.body, 800, 600);
        updater.paused = false;
    }
});