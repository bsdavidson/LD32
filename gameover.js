(function() {
  'use strict';

  LD.GameOverState = function(game) {
    this.game = game;
  };

  LD.GameOverState.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'gameoverscreen');
      this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Menu');
    }
  };
}());
