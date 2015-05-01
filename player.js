(function() {
  'use strict';
  LD.Player = function(gameState) {
    this.animationTick = 0;
    this.fartAmmo = 5;
    Phaser.Sprite.call(this, gameState.game, 90,
      gameState.game.world.height - 200, 'player');
    this.gameState = gameState;
    this.startX = 100;
    this.startY = this.gameState.world.height - 200;
    this.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1);
    this.riding = false;
    this.health = 100;
    this.facing = 1;
    this.fartEmitter = this.game.add.emitter(0, 0, 10);
    this.fartEmitter.makeParticles(['fart_bubble']);
    this.fartEmitter.gravity = -120;
    this.fartEmitter.setAlpha(0.5, 0, 2000);
    this.fart = this.game.add.audio('fart');
    this.pDeath = this.game.add.audio('player_death');
    this.swipeSound = this.game.add.audio('swipe');
    this.hitSound = this.game.add.audio('hitsound');
    this.buzz = this.game.add.audio('buzz');
    //Assigned for later use
    this.healthText = this.game.add.text(100, 40, 'Health ' + this.health);
    this.fartText = this.game.add.text(240, 40, 'Farts ' + this.fartAmmo);
    //Center the text
    this.healthText.fixedToCamera = true;
    this.healthText.anchor.set(0.5, 0.5);
    this.fartText.fixedToCamera = true;
    this.fartText.anchor.set(0.5, 0.5);
    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.0;
    this.body.gravity.y = 900;
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 16, true);
    this.animations.add('bear_walk', [0, 1, 2, 3, 4], 16, true);
    this.animations.add('bear_swipe', [5, 6, 7, 8, 9], 16, false);
    this.animations.add('bear_fart',
                        [9, 10, 11, 12, 11, 12, 11, 10],
                        16, false);
    this.game.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.controls = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      fire: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      fart: this.game.input.keyboard.addKey(Phaser.Keyboard.F),
      bee: this.game.input.keyboard.addKey(Phaser.Keyboard.C),
    };
  };

  LD.Player.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Player.prototype.constructor = LD.Player;
  LD.Player.prototype.update = function() {
    if (this.health <= 0) {
      this.pDeath.play();
      this.game.state.start('GameOver');
    }
    this.game.physics.arcade.collide(this, this.gameState.level.platforms);
    this.game.physics.arcade.collide(this, this.gameState.level.layer[2]);
    this.healthText.setText('Health ' + parseInt(this.health, 10));
    this.fartText.setText('Farts ' + this.fartAmmo, 10);
    this.game.physics.arcade.overlap(this, this.gameState.bear, function() {
        this.gameState.bear.kill();
        this.riding = true;
        this.loadTexture('player_bear');
        this.body.setSize(128, 104);
        this.width = 128;
        this.height = 104;
      }, null, this);

    if (this.body.x > 6200) {
      this.game.state.start('GameWon');
    }
    if (!this.controlDisabled) {
      if (this.game.controls.left.isDown) {
        // console.log('LEFT!');
        this.body.velocity.x = -150;
        this.scale.x = 1;
        this.scale.x = -1;
      } else if (this.game.controls.right.isDown) {
        this.body.velocity.x = 150;
        this.scale.x = 1;
      } else if (this.game.controls.down.isDown) {
        this.body.velocity.x = 0;
      } else {
        this.body.velocity.x = 0;
      }
    }

    if (!this.controlDisabled) {
      if ((this.game.controls.left.isDown) && this.animationTick === 0) {
        this.facing = -1;
        if (this.riding) {
          this.animations.play('bear_walk');
        } else {
          this.animations.play('walk');
        }
      } else if (this.game.controls.right.isDown && this.animationTick === 0) {
        this.facing = 1;
        if (this.riding) {
          this.animations.play('bear_walk');
        } else {
          this.animations.play('walk');
        }
      } else if (this.game.controls.down.isDown && this.animationTick === 0) {
        // console.log('duck!');
        this.animations.stop();
        if (this.riding) {
          this.frame = 9;
        } else {
          this.frame = 8;
        }
      } else {
        if (this.animationTick === 0) {
          this.animations.stop();
          if (this.riding) {
            this.frame = 9;
          } else {
            this.frame = 8;
          }
        }
      }

      if (this.game.controls.up.isDown &&
          this.body.blocked.down &&
          this.animationTick === 0) {
        this.animations.stop();
        this.body.velocity.y = -350;
        if (this.riding) {
          this.frame = 9;
        } else {
          this.frame = 8;
        }
      }

      if (!this.body.blocked.down && this.animationTick === 0) {
        this.animations.stop();
        if (this.riding) {
          this.frame = 3;
        } else {
          this.frame = 8;
        }
      }

      if (this.game.controls.fart.isDown) {
        if (this.riding) {
          this.fartAction();
        }
      }

      if (this.game.controls.bee.isDown) {
        var bee = this.gameState.bee.beePool.getFirstExists(false);
        // spawn at a random location top of the screen
        if (bee) {
          this.buzz.play();
          bee.reset(this.gameState.player.x, this.gameState.player.y - 50);
          bee.body.velocity.x = 800 * this.facing;
          bee.body.velocity.y = 400;
          // also randomize the speed
          // enemy.body.velocity.y = this.game.rnd.integerInRange(500 );
          bee.play('fly');
        }
      }

      if (this.game.controls.fire.isDown) {
        if (this.riding) {
          this.swipe();
        } else {
          this.frame = 8;
        }
      }
    }
  };

  LD.Player.prototype.swipe = function() {
    if (this.animationTick === 0) {
      this.animationTick = 1;
      this.swipeSound.play();
      this.animations.play('bear_swipe');
      this.events.onAnimationComplete.add(function() {
        this.animationTick = 0;
      }, this);
    }
  };

  LD.Player.prototype.fartAction = function() {
    if (this.animationTick === 0) {
      this.animationTick = 1;

      this.animations.play('bear_fart');
      if (this.fartAmmo > 0) {
        this.fartAmmo -= 1;
        this.fart.play();
        this.fartBubbles(this.x, this.y);
        this.gameState.enemy.enemyPool.forEach(function(enemy) {
          enemy.health = 0;
        }, this, 200);
      } else {
        console.log('out');
      }
      this.events.onAnimationComplete.add(function() {
        this.animationTick = 0;
      }, this);
    }
  };

  LD.Player.prototype.fartBubbles = function(x, y) {
    var pos;
    if (this.facing === 1) {
      pos = (x - 50);
    } else {
      pos = x + 40;
    }
    this.fartEmitter.x = pos;
    this.fartEmitter.y = y - 30;
    this.fartEmitter.start(true, 2000, null, 100);
  };
}());
