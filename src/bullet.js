Chicken.register("Bullet", ["Config", "ChickenVis.Math"], (Config, Math) => {
    "use strict";

    return Chicken.Class(function (game, pos, dir) {
        this.game = game;
        this.pos = Math.clone2(pos);
        this.dir = Math.normaliseAndClone2(dir);
        Math.scale2(this.dir, Config.bullet.speed);
    }, {
        update: function (dt) {
            Math.scaleAdd2(this.pos, this.dir, dt);
            var hit = false;
            var enemies = this.game.enemies;
            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                if (Math.distanceBetweenSqrd2(enemy.pos, this.pos) <= (15*15)) {
                    enemies.splice(i, 1);
                    this.game.score++;
                    hit = true;
                    break;
                }
            }

            if (hit || (0 > this.pos.x) || (this.pos.x > Config.game.width) || (0 > this.pos.y) || (this.pos.y > Config.game.height))
                this.game.removeBullet(this);
        },

        render: function (dt, draw) {
            draw.circle(this.pos.x, this.pos.y, 5, "rgb(255, 0, 0)");
        }
    });

});