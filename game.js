(function() {
  'use strict';
  console.log('Game Load');

  LD.GameState = function(game) {
    this.game = game;
  };

  LD.GameState.prototype = {
    create: function() {
      this.level = new LD.Level(this);

      this.player = new LD.Player(this);

      this.level.add();
      this.game.world.add(this.player);
    },

    render: function() {
      this.level.render();
    },

    update: function() {
      this.level.update();
    }
  };
}());
