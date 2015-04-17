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
      this.state.start('Preloader');
    }
  };

  return LD;
}());
