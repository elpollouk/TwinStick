Chicken.inject(["ChickenVis.UpdateLoop", "ChickenVis.FixedDeltaUpdater", "ChickenVis.Draw", "ChickenVis.Math"],
function (UpdateLoop, FdUpdater, Draw, Math) {
    "use strict";

    var playerSpeed = 10;
    var enemySpeed = 3;
    var bulletSpeed = 20;
    var shotTime = 0.1;
    var enemyTime = 2;
    var minEnemySpawnDistance = 150 * 150;


    var draw;
    var frameCount = 0;
    var score = 0;
    var playerPos = Math.vector2(400, 300);
    var spawnCount = 1;
    var currentEnemyTime = 3.0;
    var currentShotTime = 0;
    var bullets = [];
    var enemies = [];


    //var fixedUpdater = new FdUpdater(Core.onUpdate, 0.010);

    function getAxes(gamePad, axes) {
        var v = gamePad.axes[axes];
        if ((-0.3 < v) && (v < 0.3)) return 0;
        return v;
    }

    function updatePlayer(dt) {
        var gamePad = navigator.getGamepads()[0];
        if (!gamePad) return;

        var dX = playerSpeed * getAxes(gamePad, 0);
        var dY = playerSpeed * getAxes(gamePad, 1);

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
            Math.scale2(bv, bulletSpeed);
            bullets.push({
                x: playerPos.x,
                y: playerPos.y,
                dX: bv.x,
                dY: bv.y
            });
            currentShotTime = shotTime;
        }
    }

    function updateBullets(dt) {
        var oldBullets = bullets;
        bullets = [];
        for (var i = 0; i < oldBullets.length; i++) {
            var b = oldBullets[i];
            b.x += b.dX;
            b.y += b.dY;

            for (var j = 0; j < enemies.length; j++) {
                var enemy = enemies[j];
                if (Math.distanceBetweenSqrd2(enemy, b) <= (15*15)) {
                    enemies.splice(j, 1);
                    score++;
                    break;
                }
            }

            if ((0 < b.x) && (b.x < 800) && (0 < b.y) && (b.y < 600))
                bullets.push(b);
        }
    }

    function updateEnemies(dt) {
        currentEnemyTime -= dt;
        if (currentEnemyTime <= 0) {
            currentEnemyTime = enemyTime;
            var neededEnemies = spawnCount - enemies.length;
            for (var i = 0; i < neededEnemies; i++) {
                var ev;
                do
                {
                    var x = Math.randomRange(0, 800);
                    var y = Math.randomRange(0, 600);
                    ev = Math.vector2(x, y);
                }
                while (Math.distanceBetweenSqrd2(playerPos, ev) < minEnemySpawnDistance);

                enemies.push(ev);
            }
            spawnCount++;
        }

        for (var i = 0; i < enemies.length; i++) {
            var ev = enemies[i];
            var d = Math.subAndClone2(playerPos, ev);
            Math.normalise2(d);
            Math.scaleAdd2(ev, d, enemySpeed);

            if (Math.distanceBetweenSqrd2(playerPos, ev) <= 30*30) {
                playerPos = Math.vector2(400, 300);
                bullets = [];
                enemies = [];
                spawnCount = 1;
                currentShotTime = 0;
                currentEnemyTime = 3.0;
                score = 0;
            }
        }
    }

    var updater = new UpdateLoop(function (dt) {
        draw.rect(0, 0, 800, 600, "silver");

        updatePlayer(dt);
        updateEnemies(dt);
        updateBullets(dt);
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