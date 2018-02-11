Chicken.register("Game", ["Config", "Player", "Bullet", "Enemy", "Mode.Play", "Gamepad", "SoundPlayer", "ChickenVis.FixedDeltaUpdater", "ChickenVis.Math"],
(Config, Player, Bullet, Enemy, PlayMode, Gamepad, SoundPlayer, FdUpdater, Math) => {
    "use strict";

    return Chicken.Class(function (draw) {
        var that = this;
        this.draw = draw;
        this.highScore = 0;
        this.controller = new Gamepad();
        this.fixedUpdater = new FdUpdater((dt) => {
            that._update(dt);
        }, Config.game.updatePeriod);
        this.reset();

        this.sounds = new SoundPlayer();
    }, {
        reset: function () {
            this.player = new Player(this, this.controller);
            this.bullets = [];
            this.enemies = [];
            this.score = 0;
            this._currentMode = new PlayMode(this);
            this._currentMode.start();
        },

        update: function (dt) {
            this.controller.update(dt);
            this.fixedUpdater.update(dt);
            this._render(dt);
        },

        spawnBullet: function (pos, vel) {
            this.bullets.push(new Bullet(this, pos, vel));
        },

        spawnEnemy: function (pos) {
            this.enemies.push(new Enemy(this, pos));
        },

        removeBullet: function (bullet) {
            var i = this.bullets.indexOf(bullet);
            this.bullets.splice(i, 1);
        },

        fireBurst: function (pos) {
            var dir = Math.vector2(0, 1);
            var rot = Math.TWO_PI / Config.game.burstSize;
            for (var i = 0; i < Config.game.burstSize; i++) {
                this.spawnBullet(pos, dir);
                Math.rotate2(dir, rot);
            }
            this.sounds.playPlayerBurst();
        },

        killEnemy: function (enemy) {
            var i = this.enemies.indexOf(enemy);
            this.enemies.splice(i, 1);
            this.score++;
            if (this.score % Config.game.burstScore === 0)
                this.fireBurst(this.player.pos);

            this.sounds.playEnemyDeath();
        },

        killPlayer: function () {
            if (this.highScore < this.score)
                this.highScore = this.score;
            this.reset();

            this.sounds.playPlayerDeath();
        },

        enforceBounds: function(vector2, width) {
            var maxX = Config.game.width - width;
            var maxY = Config.game.height - width;

            if (vector2.x < width) vector2.x = width;
            else if (vector2.x > maxX) vector2.x = maxX;
            if (vector2.y < width) vector2.y = width;
            else if (vector2.y > maxY) vector2.y = maxY;
        },

        _update: function (dt) {
            this._currentMode.update(dt);
        },

        _render: function (dt) {
            var draw = this.draw;
            draw.rect(0, 0, Config.game.width, Config.game.height, "silver");
            this.player.render(dt, draw);
    
            for (var i = 0; i < this.enemies.length; i++)
                this.enemies[i].render(dt, draw);
    
            for (var i = 0; i < this.bullets.length; i++)
                this.bullets[i].render(dt, draw);

            this._currentMode.render(dt, draw);
    
            draw.text(`${this.score}`, 5, 5);
            draw.text(`${this.highScore}`, 5, 15);

            this._renderControllerWarning();
        },

        _renderControllerWarning: function() {
            if (Config.controller.notConnectedWarning && this.controller.isDisconnected) {
                var width = 300;
                var height = 20;
                var x = (Config.game.width - width) / 2;
                var y = 10;

                this.draw.rect(x, y, width, height, "red");
                this.draw.text('*** NO GAMEPAD DETECTED ***', x + 70, y + 6);
            }
        },

    });

});