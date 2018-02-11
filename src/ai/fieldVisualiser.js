Chicken.register("FieldVisualiser", ["Config", "ChickenVis.Draw"], (Config, Draw) => {
    "use strict";

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

            this.draw.context.putImageData(target, 0, 0);
        }
    });
});