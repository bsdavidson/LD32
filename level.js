(function() {
  'use strict';
  console.log('level Load');
  // var ANIMATE_SEQ = [];

  LD.Level = function(gameState) {
    // INITIALIZE
    this.gameState = gameState;
    this.game = gameState.game;
    this.layer = [];

    this.platforms = this.game.make.group();
    this.platforms.enableBody = true;
    var floor = this.platforms.create(0, this.game.world.height - 32,
      'floor');

    floor.scale.setTo(100, 2);
    floor.body.immovable = true;

  };

  LD.Level.prototype.add = function() {
    this.game.world.add(this.platforms);
  };

  LD.Level.prototype.render = function() {

  };

  LD.Level.prototype.update = function(player) {

  };


}());
