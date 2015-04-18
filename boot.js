LD = (function() {
  'use strict';

  var LD = {};

  LD.BootState = function() {};

  LD.BootState.prototype = {
    preload: function() {
      console.log('boot preload');
    },

    create: function() {
      console.log('boot create');

       //scaling options
      // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      // this.scale.minWidth = 240;
      // this.scale.minHeight = 170;
      // this.scale.maxWidth = 2880;
      // this.scale.maxHeight = 1920;


      this.state.start('Preloader');
    }
  };

  return LD;
}());
