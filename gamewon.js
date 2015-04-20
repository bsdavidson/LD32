(function() {
  'use strict';

  LD.GameWonState = function(game) {
    this.game = game;
  };

  LD.GameWonState.prototype = {
    create: function() {
      this.add.sprite(0, 0, 'game_won');
      this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Menu');
    }
  };

}());
