Chicken.register("Game", ["Config", "Player", "Bullet", "Enemy", "ChickenVis.FixedDeltaUpdater", "ChickenVis.Math"],
(Config, Player, Bullet, Enemy, FdUpdater, Math) => {
    "use strict";

    return Chicken.Class(function (draw) {
        var that = this;
        this.draw = draw;
        this.highScore = 0;
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

        killEnemy: function (enemy) {
            var i = this.enemies.indexOf(enemy);
            this.enemies.splice(i, 1);
            this.score++;
        },

        killPlayer: function () {
            if (this.highScore < this.score)
                this.highScore = this.score;
            this.reset();
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
                this.enemies[i].render(dt, this.draw);
    
            for (var i = 0; i < this.bullets.length; i++)
                this.bullets[i].render(dt, this.draw);
    
            this.draw.text(`${this.score}`, 5, 5);
            this.draw.text(`${this.highScore}`, 5, 15);
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
                    var pos;
                    do
                    {
                        var x = Math.randomRange(0, Config.game.width);
                        var y = Math.randomRange(0, Config.game.height);
                        pos = Math.vector2(x, y);
                    }
                    while (Math.distanceBetweenSqrd2(this.player.pos, pos) < Config.enemy.minSpawnDistanceSqrd);
    
                    this.enemies.push(new Enemy(this, pos));
                }
                this.spawnCount++;
            }
    
            for (var i = 0; i < this.enemies.length; i++)
                this.enemies[i].update(dt);
        }
    });

});