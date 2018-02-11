Chicken.register("Ai.Controller", ["ChickenVis.Math"], (Math) => {

    return Chicken.Class(function () {
        this.isDisconnected = false;
        this.move = Math.vector2(0, 0);
        this.shoot = Math.vector2(0, 0);
    }, {
        update: function (dt) {
            this.move.x = Math.randomRange(-1, 1);
            this.move.y = Math.randomRange(-1, 1);
            this.shoot.x = Math.randomRange(-1, 1);
            this.shoot.y = Math.randomRange(-1, 1);
        }
    })

});