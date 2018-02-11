Chicken.inject(["Config", "ConfigParser", "Gamepad", "Ai.Network", "Game", "FieldVisualiser", "ChickenVis.UpdateLoop", "ChickenVis.Draw"],
function (Config, parseConfig, Gamepad, AiNetwork, Game, FieldVisualiser, UpdateLoop, Draw) {
    "use strict";

    var game;
    var network = null;
    var visualiser = null;

    var updater = new UpdateLoop((dt) => {
        game.update(dt);
        visualiser && visualiser.render();
        network && network.update(dt);
    });

    window.onload = () => {
        parseConfig();
        var draw = new Draw(document.body, Config.game.width, Config.game.height);
        var controller;
        if (Config.ai.enabled) {
            network = new AiNetwork(draw.context);
            controller = network.controller;
        } 
        else {
             controller = new Gamepad();
        }

        game = new Game(draw, controller);

        if (network && Config.ai.visualise)
            visualiser = new FieldVisualiser(network, document.body);

        updater.paused = false;
    }
});