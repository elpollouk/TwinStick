Chicken.register("Ai.Network", ["Config", "Ai.Controller", "Ai.Volume"], (Config, Controller, Volume) => {

    var stride = Config.fieldVisualiser.stride;
    var gameWidth = Config.game.width;
    var gameHeight = Config.game.height;
    var viewWidth = gameWidth / stride;
    var viewHeight = gameHeight / stride;

    var sizeFilters_Layer1 = 7;
    var numFilters_Layer1 = 3;
    var sizeFilters_layer2 = 7;
    var numFilters_Layer2 = 10;
    var sizeFilters_layer3 = 9;
    var numFilters_layer3 = 10;

    function getSourceValue(data, x, y) {
        var red = y * (gameWidth * 4) + x * 4
        var colour = [data[red], data[red+1], data[red+2]];
        if (colour[0] === colour[1] && colour[1] === colour[2])
            return 0;
        else 
            return (colour[0] + colour[1] + colour[2]) / 3;
    }

    function buildFilters(size, depth, count) {
        var filters = new Array(count);
        for (var i = 0; i < count; i++) {
            filters[i] = new Volume(size, size, depth, Volume.RANDOM_NEGTOPOS);
        }
        return filters;
    }

    function applyFilters(inputVolume, outputVolume, filters) {
        var filterCount = filters.length;
        for (var i = 0; i < filterCount; i++)
            inputVolume.filterReLU(filters[i], outputVolume, i);
    }

    return Chicken.Class(function (visualContext2d) {
        this._controller = new Controller();
        this._context2d = visualContext2d;
        this._view = new Volume(viewWidth, viewHeight, 1);

        this._build();
    }, {
        update: function (dt) {
            this._fillVisionVolume();

            applyFilters(this._view, this._layer2, this._layer1Filters);
            applyFilters(this._layer2, this._layer3, this._layer2Filters);
            this._layer3.maxPool(this._layer3Pool);
            applyFilters(this._layer3Pool, this._layer4, this._layer3Filters);
            this._layer4.maxPool(this._layer4Pool);
        },

        _build: function () {
            this._layer1Filters = buildFilters(sizeFilters_Layer1, 1, numFilters_Layer1);
            
            var layer2Width = viewWidth - (sizeFilters_Layer1 - 1);
            var layer2Height = viewHeight - (sizeFilters_Layer1 - 1);
            this._layer2 = new Volume(layer2Width, layer2Height, numFilters_Layer1);
            this._layer2Filters = buildFilters(sizeFilters_layer2, numFilters_Layer1, numFilters_Layer2);
            
            var layer3Width = this._layer2.width - (sizeFilters_layer2 - 1);
            var layer3Height = this._layer2.height - (sizeFilters_layer2 - 1);
            this._layer3 = new Volume(layer3Width, layer3Height, numFilters_Layer2);
            this._layer3Pool = new Volume(layer3Width / 2, layer3Height / 2, numFilters_Layer2);
            this._layer3Filters = buildFilters(sizeFilters_layer3, numFilters_Layer2, numFilters_layer3);
            
            var layer4Width = this._layer3Pool.width - (sizeFilters_layer3 - 1);
            var layer4Height = this._layer3Pool.height - (sizeFilters_layer3 - 1);
            this._layer4 = new Volume(layer4Width, layer4Height, numFilters_layer3);
            this._layer4Pool = new Volume(layer4Width / 2, layer4Height / 2, numFilters_layer3);
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