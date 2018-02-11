Chicken.inject(["Config", "ConfigParser", "Gamepad", "Ai.Controller", "Game", "FieldVisualiser", "ChickenVis.UpdateLoop", "ChickenVis.Draw"],
function (Config, parseConfig, Gamepad, AiController, Game, FieldVisualiser, UpdateLoop, Draw) {
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
        var controller = Config.player.aiController ? new AiController() : new Gamepad();
        game = new Game(draw, controller);
        visualiser = new FieldVisualiser(draw.context, document.body);
        updater.paused = false;
    }
});