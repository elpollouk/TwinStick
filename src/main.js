Chicken.inject(["Config", "ConfigParser", "Game", "FieldVisualiser", "ChickenVis.UpdateLoop", "ChickenVis.Draw"],
function (Config, parseConfig, Game, FieldVisualiser, UpdateLoop, Draw) {
    "use strict";

    var visualiser;
    var game;
    var updater = new UpdateLoop((dt) => {
        game.update(dt);
        visualiser.render();
    });

    window.onload = () => {
        parseConfig();
        var draw = new Draw(document.body, Config.game.width, Config.game.height);
        game = new Game(draw);
        visualiser = new FieldVisualiser(draw.context, document.body);
        updater.paused = false;
    }
});