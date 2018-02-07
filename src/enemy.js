Chicken.register("Enemy", ["Config", "ChickenVis.Math"], (Config, Math) => {
    "use strict";

    return Chicken.Class(function (game, pos) {
        this.game = game;
        this.pos = Math.clone2(pos);
    }, {
        update: function (dt) {
            var playerPos = this.game.player.pos
            var d = Math.subAndClone2(playerPos, this.pos);
            Math.normalise2(d);
            Math.scaleAdd2(this.pos, d, Config.enemy.speed * dt);

            if (Math.distanceBetweenSqrd2(playerPos, this.pos) <= 30*30)
                this.game.reset();
        },

        render: function (dt, draw) {
            draw.circle(this.pos.x, this.pos.y, 15, "orange");
        }
    });
});