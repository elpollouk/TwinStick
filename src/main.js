Chicken.inject(["Config", "Game", "ChickenVis.UpdateLoop", "ChickenVis.Draw"],
function (Config, Game, UpdateLoop, Draw) {
    "use strict";

    var game;
    var updater = new UpdateLoop((dt) => {
        game.update(dt);
    });

    window.onload = () => {
        var draw = new Draw(document.body, Config.game.width, Config.game.height);
        game = new Game(draw);
        updater.paused = false;
    }
});