(function() {
  'use strict';

  LD.MenuState = function(game) {
    this.game = game;
  };

  LD.MenuState.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'title_screen');
      this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Game');
    }
  };
}());
