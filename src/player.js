Chicken.register("Player", ["Config", "ChickenVis.Math"], (Config, Math) => {
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
    };

    return Chicken.Class(function (game) {
        this.game = game;
        this.reset();
    }, {
        reset: function () {
            this.pos = Math.vector2(Config.game.width / 2, Config.game.height / 2);
            this._currentShotTime = 0;
        },

        update: function (dt) {
            var dX = Config.player.speed * getAxes(Axes.MoveX) * dt;
            var dY = Config.player.speed * getAxes(Axes.MoveY) * dt;
    
            this.pos.x += dX;
            this.pos.y += dY;
    
            if (this.pos.x < 15) this.pos.x = 15;
            else if (this.pos.x > 785) this.pos.x = 785;
            if (this.pos.y < 15) this.pos.y = 15;
            else if (this.pos.y > 585) this.pos.y = 585;
    
            var bv = Math.vector2(getAxes(Axes.ShootX), getAxes(Axes.ShootY));
            this._currentShotTime -= dt;
            if ((bv.x + bv.y) !== 0.0 && this._currentShotTime <= 0) {
                this.game.spawnBullet(this.pos, bv);
                this._currentShotTime = Config.player.shotPeriod;
            }
        },

        render: function (dt, draw) {
            draw.circle(this.pos.x, this.pos.y, 15, "rgb(0, 255, 0)");
        },
    });
});