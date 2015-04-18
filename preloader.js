(function() {
  'use strict';

  LD.PreloaderState = function(game) {
    this.game = game;
  };

  LD.PreloaderState.prototype = {
    preload: function() {
      this.stage.backgroundColor = '#DDDDDD';
      // Load sprites
     this.load.image('floor', 'assets/floor.png');


      // Sprite Sheets
      this.load.spritesheet('bear', 'assets/bear.png', 128, 78);


      // Tile Map
      //this.load.tilemap('room', 'assets/room_tiled.json', null, Phaser.Tilemap.TILED_JSON);

      // Sounds
      // this.load.audio('fly_sound', 'assets/fly.ogg');

    },

    create: function() {
      console.log('preloader create');
      //scaling options
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.minWidth = 240;
      this.scale.minHeight = 170;
      this.scale.maxWidth = 2880;
      this.scale.maxHeight = 1920;


      this.state.start('Game');
    }
  };
}());
