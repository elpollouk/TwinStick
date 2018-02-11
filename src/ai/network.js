Chicken.register("Ai.Network", ["Config", "Ai.Controller", "Ai.Volume"], (Config, Controller, Volume) => {

    var stride = Config.fieldVisualiser.stride;
    var gameWidth = Config.game.width;
    var gameHeight = Config.game.height;
    var viewWidth = gameWidth / stride;
    var viewHeight = gameHeight / stride;

    function getSourceValue(data, x, y) {
        var red = y * (gameWidth * 4) + x * 4
        var colour = [data[red], data[red+1], data[red+2]];
        if (colour[0] === colour[1] && colour[1] === colour[2])
            return 0;
        else 
            return (colour[0] + colour[1] + colour[2]) / 3;
    }

    return Chicken.Class(function (visualContext2d) {
        this._controller = new Controller();
        this._context2d = visualContext2d;
        this._view = new Volume(viewWidth, viewHeight, 1);
    }, {
        update: function (dt) {
            this._fillVisionVolume();
        },

        _fillVisionVolume: function () {
            var source = this._context2d.getImageData(0, 0, gameWidth, gameHeight);
            this._view.fillAtZ((x, y) => getSourceValue(source.data, x * stride, y * stride), 0);
        }
    }, {
        controller: {
            get: function () {
                return this._controller;
            },
            enumerable: true
        }
    });
});