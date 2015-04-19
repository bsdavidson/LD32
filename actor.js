(function() {
  'use strict';


  LD.Bear = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 300,
      gameState.game.world.height / 2, 'bear');

    this.gameState = gameState;

    this.game.physics.arcade.enable(this);

    this.roar = this.game.add.audio('roar');

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.0;
    this.body.bounce.x = 0.0;
    this.body.gravity.y = 700;
    this.body.drag.x = 100;
    this.body.drag.y = 100;

    this.anchor.setTo(0.5, 1);
    this.direction = 1;
    this.acceleration = 1200;

    this.animations.add('run', [0, 1, 2, 3, 4], 5, true);
    this.run();
  };

  LD.Bear.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Bear.prototype.constructor = LD.Bear;

  LD.Bear.prototype.update = function() {
    var platforms = this.gameState.level.platforms;
    this.game.physics.arcade.collide(this, platforms);
    this.game.physics.arcade.collide(this, this.gameState.level.layer[2]);


    if (this.body.touching.down) {
      this.run();
    }

  };


  LD.Bear.prototype.run = function() {
      this.direction = 1;
      this.scale.x = -1;

    // this.body.setSize(43, 35, -7, -5);
    this.body.velocity.x = 10 * this.direction;
    this.animations.play('run');
  };


  // BEEEEEEESSSSS!!!!!

  LD.Bee = function(gameState) {
   Phaser.Sprite.call(this, gameState.game, gameState.game.rnd.integerInRange(0, 360),
      gameState.game.rnd.integerInRange(0, 360), 'bee');

    this.gameState = gameState;

    this.game.physics.arcade.enable(this);
    // this.roar = this.game.add.audio('roar');\\
    this.body.collideWorldBounds = false;
    // this.body.bounce(0.50);
    this.animations.add('fly', [0, 1, 2], 20, true);
    this.animations.play('fly');
  };


  LD.Bee.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Bee.constructor = LD.Bee;

  LD.Bee.prototype.update = function() {
    this.game.physics.arcade.collide(this, this.gameState.level.layer[2]);


    if (this.body.deltaX() > 0){
      this.scale.x = -0.5;
      this.scale.y = 0.5;
    } else {
      this.scale.x = 0.5;
      this.scale.y = 0.5;

    }

    this.game.physics.arcade.moveToPointer(this, 60, this.gameState.player.sprite, 500);
  };




  LD.Enemy = function(gameState) {
   Phaser.Sprite.call(this, gameState.game, 300,
      gameState.game.world.height - 200, 'enemy1');

  this.gameState = gameState;

    this.game.physics.arcade.enable(this);

    this.roar = this.game.add.audio('roar');

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.0;
    this.body.bounce.x = 0.0;
    this.body.gravity.y = 700;
    this.body.drag.x = 100;
    this.body.drag.y = 100;







    // this.roar = this.game.add.audio('roar');\\
    // this.body.collideWorldBounds = false;
    // this.body.bounce(0.50);

  };


  LD.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Enemy.constructor = LD.Enemy;

  LD.Enemy.prototype.update = function() {
    this.game.physics.arcade.collide(this, this.gameState.level.layer[2]);

    if (!this.gameState.player.riding) {

    this.game.physics.arcade.moveToXY(this, this.gameState.player.x, this.gameState.player.y, 100);

  } else {
        this.game.physics.arcade.moveToXY(this, -this.gameState.player.x, this.gameState.player.y, 100);

  }



    // console.log(this.gameState.player.y, this.gameState.player.x);

  };





}());
