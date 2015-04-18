(function() {
  'use strict';

  LD.Player = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 90,
      gameState.game.world.height - 32, 'bear');
    this.gameState = gameState;

    this.startX = 100;
    this.startY = 100;

    this.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1);

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.0;
    this.body.gravity.y = 800;

    this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);


    this.game.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.controls = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
      fire: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    };
  };

  LD.Player.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Player.prototype.constructor = LD.Player;

  LD.Player.prototype.update = function() {
    this.game.physics.arcade.collide(this, this.gameState.level.platforms);



    if (!this.controlDisabled) {
      if (this.game.controls.left.isDown) {
        // console.log('LEFT!');
        this.body.velocity.x = -150;
        this.animations.play('walk');
        this.scale.x = 1;
        this.scale.x = 1;
      } else if (this.game.controls.right.isDown) {
        this.body.velocity.x = 150;
        this.animations.play('walk');
        this.scale.x = -1;
      } else if (this.game.controls.down.isDown) {
        // console.log('duck!');
        this.animations.stop();
        this.frame = 15;
      } else {
        this.body.velocity.x = 0;
        this.animations.stop();
        this.frame = 0;
      }

      if (this.game.controls.up.isDown && this.body.touching.down) {
        // console.log('LEFT!');
        this.body.velocity.y = -350;
        this.animations.play('walk');
        this.frame = 0;
      }
    }
  };

}());
