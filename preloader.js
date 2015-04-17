(function() {
  'use strict';

  LD.PreloaderState = function(game) {
    this.game = game;
  };

  LD.PreloaderState.prototype = {
    preload: function() {
      this.stage.backgroundColor = '#DDDDDD';
      // Load sprites
      // this.load.image('titlescreen', 'assets/title_screen.png');


      // Sprite Sheets
      // this.load.spritesheet('fan_top', 'assets/fan_top.png', 192, 102);


      // Tile Map
      //this.load.tilemap('room', 'assets/room_tiled.json', null, Phaser.Tilemap.TILED_JSON);

      // Sounds
      // this.load.audio('fly_sound', 'assets/fly.ogg');

    },

    create: function() {
      console.log('preloader create');
      this.state.start('Game');
    }
  };
}());
