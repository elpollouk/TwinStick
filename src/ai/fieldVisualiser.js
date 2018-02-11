Chicken.register("FieldVisualiser", ["Config", "ChickenVis.Draw"], (Config, Draw) => {
    "use strict";

    /*var stride = Config.fieldVisualiser.stride;
    var gameWidth = Config.game.width;
    var gameHeight = Config.game.height;
    var width = gameWidth / stride;
    var height = gameHeight / stride;

    function getSourceColour(data, x, y) {
        var red = y * (gameWidth * 4) + x * 4
        var colour = [data[red], data[red+1], data[red+2]];
        if (colour[0] === colour[1] && colour[1] === colour[2]) {
            colour[0] = 0;
            colour[1] = 0;
            colour[2] = 0;
        } else {
            var a = (colour[0] + colour[1] + colour[2]) / 3;
            colour[0] = a;
            colour[1] = a;
            colour[2] = a;
        }
        return colour;
    }

    function putTargetColour(data, x, y, colour) {
        var red = y * (width * 4) + x * 4
        data[red] = colour[0];
        data[red+1] = colour[1];
        data[red+2] = colour[2];
        data[red+3] = 255;
    }*/

    return Chicken.Class(function (network, container) {
        this.draw = new Draw(container, network._view.width, network._view.height);
        this.network = network;
    }, {
        render: function () {
            var width = this.network._view.width;
            var height = this.network._view.height;
            var target = this.draw.context.createImageData(width, height);
            for (var i = 0; i < this.network._view._array.length; i++) {
                var v = this.network._view._array[i];
                var o = i * 4;
                target.data[o + 0] = v;
                target.data[o + 1] = v;
                target.data[o + 2] = v;
                target.data[o + 3] = 255;
            }

            /*var x = 0;
            var y = 0;
            while (y < height) {
                while (x < width) {
                    var colour = getSourceColour(source.data, x * stride, y * stride);
                    putTargetColour(target.data, x, y, colour);
                    x++;
                }
                y++;
                x = 0;
            }*/

            this.draw.context.putImageData(target, 0, 0);
        }
    });
});