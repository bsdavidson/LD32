(function() {
  'use strict';
  console.log('Game Load');

  LD.GameState = function(game) {
    this.game = game;
  };

  LD.GameState.prototype = {
    create: function() {
      this.game.world.setBounds(0, 0, 2000, 1500);

      this.score = 0;
      this.level = new LD.Level(this);

      this.player = new LD.Player(this);
      this.bear = new LD.Bear(this);
      this.bee = new LD.Bee(this);
      this.enemy = new LD.Enemy(this);

      this.level.add();
      this.game.world.add(this.player);
      this.game.world.add(this.bear);
      this.game.world.add(this.enemy);
      this.game.world.add(this.bee);
      this.game.world.add(this.bee);

      this.game.camera.follow(this.player);
    },

    render: function() {
      this.level.render();
    },

    update: function() {
      this.level.update();

    this.game.physics.arcade.overlap(this.bee.beePool, this.enemy.enemyPool, function(bee, enemy){
      enemy.health -= 0.5;
      bee.health -= 0.01;
      console.log(enemy.health);

    },null, this);
    }
  };
}());
