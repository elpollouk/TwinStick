Chicken.inject(["ChickenVis.UpdateLoop", "ChickenVis.FixedDeltaUpdater", "ChickenVis.Draw", "ChickenVis.Math"],
function (UpdateLoop, FdUpdater, Draw, Math) {
    "use strict";

    var draw;
    var frameCount = 0;
    var x = 400;
    var y = 300;
    var playerSpeed = 10;
    var bulletSpeed = 20;
    var shotTime = 0.1;
    var currentShotTime = 0;
    var bullets = [];


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

        x += dX;
        y += dY;

        if (x < 15) x = 15;
        else if (x > 785) x = 785;
        if (y < 15) y = 15;
        else if (y > 585) y = 585;

        var bv = Math.vector2(getAxes(gamePad, 2), getAxes(gamePad, 3));
        currentShotTime -= dt;
        if (Math.lengthSqrd2(bv) >= 0.5 && currentShotTime <= 0) {
            Math.normalise2(bv);
            Math.scale2(bv, bulletSpeed);
            bullets.push({
                x: x,
                y: y,
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
            if ((0 < b.x) && (b.x < 800) && (0 < b.y) && (b.y < 600))
                bullets.push(b);
        }
    }

    var updater = new UpdateLoop(function (dt) {
        draw.rect(0, 0, 800, 600, "silver");

        updatePlayer(dt);
        updateBullets(dt);
        draw.circle(x, y, 15, "rgb(0, 255, 0)");

        for (var i = 0; i < bullets.length; i++)
            draw.circle(bullets[i].x, bullets[i].y, 5, "rgb(255, 0, 0)");

        draw.text(`${frameCount++}`, 5, 5);
    });

    window.onload = function () {
        draw = new Draw(document.body, 800, 600);
        updater.paused = false;
    }
});