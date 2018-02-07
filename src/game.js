Chicken.register("Game", ["Config", "Player", "Bullet", "ChickenVis.FixedDeltaUpdater", "ChickenVis.Math"],
(Config, Player, Bullet, FdUpdater, Math) => {
    "use strict";

    return Chicken.Class(function (draw) {
        var that = this;
        this.draw = draw;
        this.fixedUpdater = new FdUpdater((dt) => {
            that._update(dt);
        }, Config.game.updatePeriod);
        this.reset();
    }, {
        reset: function () {
            this.player = new Player(this);
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

        spawnBullet: function (pos, vel) {
            this.bullets.push(new Bullet(this, pos, vel));
        },

        removeBullet: function (bullet) {
            var i = this.bullets.indexOf(bullet);
            this.bullets.splice(i, 1);
        },

        _update: function (dt) {
            this.player.update(dt);
            this._updateEnemies(dt);
            this._updateBullets(dt);
        },

        _render: function (dt) {
            this.draw.rect(0, 0, Config.game.width, Config.game.height, "silver");
            this.player.render(dt, this.draw);
    
            for (var i = 0; i < this.enemies.length; i++)
                this.draw.circle(this.enemies[i].x, this.enemies[i].y, 15, "orange");
    
            for (var i = 0; i < this.bullets.length; i++)
                this.bullets[i].render(dt, this.draw);
    
            this.draw.text(`${this.score}`, 5, 5);
        },
    
        _updateBullets: function (dt) {
            for (var i = 0; i < this.bullets.length; i++)
                this.bullets[i].update(dt);
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
                    while (Math.distanceBetweenSqrd2(this.player.pos, ev) < Config.enemy.minSpawnDistance);
    
                    this.enemies.push(ev);
                }
                this.spawnCount++;
            }
    
            for (var i = 0; i < this.enemies.length; i++) {
                var ev = this.enemies[i];
                var d = Math.subAndClone2(this.player.pos, ev);
                Math.normalise2(d);
                Math.scaleAdd2(ev, d, Config.enemy.speed * dt);
    
                if (Math.distanceBetweenSqrd2(this.player.pos, ev) <= 30*30) {
                    this.reset();
                }
            }
        }
    });

});