Chicken.register("Game", ["Config", "ChickenVis.FixedDeltaUpdater", "ChickenVis.Math"], (Config, FdUpdater, Math) => {
    "use strict";

    var Axes = {
        MoveX: 0,
        MoveY: 1,
        ShootX: 2,
        ShootY: 3
    };

    function getAxes(axes) {
        var gamePad = navigator.getGamepads()[0];
        if (!gamePad) return 0;
        var v = gamePad.axes[axes];
        if ((-Config.controller.deadzoneSize < v) && (v < Config.controller.deadzoneSize)) return 0;
        return v;
    }

    return Chicken.Class(function (draw) {
        var that = this;
        this.draw = draw;
        this.fixedUpdater = new FdUpdater((dt) => {
            that._update(dt);
        }, Config.game.updatePeriod);
        this.reset();
    }, {
        reset: function () {
            this.playerPos = Math.vector2(Config.game.width / 2, Config.game.height / 2);
            this.bullets = [];
            this.enemies = [];
            this.spawnCount = 1;
            this.currentShotTime = 0;
            this.currentEnemyTime = Config.enemy.intialSpawnDelay;
            this.score = 0;
        },

        update: function (dt) {
            this.fixedUpdater.update(dt);
            this._render(dt);
        },

        _update: function (dt) {
            this._updatePlayer(dt);
            this._updateEnemies(dt);
            this._updateBullets(dt);
        },

        _render: function (dt) {
            this.draw.rect(0, 0, Config.game.width, Config.game.height, "silver");
            this.draw.circle(this.playerPos.x, this.playerPos.y, 15, "rgb(0, 255, 0)");
    
            for (var i = 0; i < this.enemies.length; i++)
                this.draw.circle(this.enemies[i].x, this.enemies[i].y, 15, "orange");
    
            for (var i = 0; i < this.bullets.length; i++)
                this.draw.circle(this.bullets[i].x, this.bullets[i].y, 5, "rgb(255, 0, 0)");
    
            this.draw.text(`${this.score}`, 5, 5);
        },

        _updatePlayer: function (dt) {
            var dX = Config.player.speed * getAxes(Axes.MoveX) * dt;
            var dY = Config.player.speed * getAxes(Axes.MoveY) * dt;
    
            this.playerPos.x += dX;
            this.playerPos.y += dY;
    
            if (this.playerPos.x < 15) this.playerPos.x = 15;
            else if (this.playerPos.x > 785) this.playerPos.x = 785;
            if (this.playerPos.y < 15) this.playerPos.y = 15;
            else if (this.playerPos.y > 585) this.playerPos.y = 585;
    
            var bv = Math.vector2(getAxes(Axes.ShootX), getAxes(Axes.ShootY));
            this.currentShotTime -= dt;
            if ((bv.x + bv.y) !== 0.0 && this.currentShotTime <= 0) {
                Math.normalise2(bv);
                Math.scale2(bv, Config.bullet.speed);
                this.bullets.push({
                    x: this.playerPos.x,
                    y: this.playerPos.y,
                    dX: bv.x,
                    dY: bv.y
                });
                this.currentShotTime = Config.player.shotPeriod;
            }
        },
    
        _updateBullets: function (dt) {
            var oldBullets = this.bullets;
            this.bullets = [];
            for (var i = 0; i < oldBullets.length; i++) {
                var b = oldBullets[i];
                b.x += b.dX * dt;
                b.y += b.dY * dt;
    
                var hit = false;
                for (var j = 0; j < this.enemies.length; j++) {
                    var enemy = this.enemies[j];
                    if (Math.distanceBetweenSqrd2(enemy, b) <= (15*15)) {
                        this.enemies.splice(j, 1);
                        this.score++;
                        hit = true;
                        break;
                    }
                }
    
                if (!hit && (0 < b.x) && (b.x < Config.game.width) && (0 < b.y) && (b.y < Config.game.height))
                    this.bullets.push(b);
            }
        },
    
        _updateEnemies: function (dt) {
            this.currentEnemyTime -= dt;
            if (this.currentEnemyTime <= 0) {
                this.currentEnemyTime = Config.enemy.spawnPeriod;
                var neededEnemies = this.spawnCount - this.enemies.length;
                for (var i = 0; i < neededEnemies; i++) {
                    var ev;
                    do
                    {
                        var x = Math.randomRange(0, Config.game.width);
                        var y = Math.randomRange(0, Config.game.height);
                        ev = Math.vector2(x, y);
                    }
                    while (Math.distanceBetweenSqrd2(this.playerPos, ev) < Config.enemy.minSpawnDistance);
    
                    this.enemies.push(ev);
                }
                this.spawnCount++;
            }
    
            for (var i = 0; i < this.enemies.length; i++) {
                var ev = this.enemies[i];
                var d = Math.subAndClone2(this.playerPos, ev);
                Math.normalise2(d);
                Math.scaleAdd2(ev, d, Config.enemy.speed * dt);
    
                if (Math.distanceBetweenSqrd2(this.playerPos, ev) <= 30*30) {
                    this.reset();
                }
            }
        }
    });

});