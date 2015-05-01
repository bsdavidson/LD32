(function() {
  'use strict';

  LD.Bear = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 300,
                       gameState.game.world.height - 50, 'bear');
    this.gameState = gameState;
    this.game.physics.arcade.enable(this);
    this.phy = this.game.physics.arcade;
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
    this.animations.stop();
    this.frame = 5;
  };

  LD.Bear.prototype = Object.create(Phaser.Sprite.prototype);

  LD.Bear.prototype.constructor = LD.Bear;

  LD.Bear.prototype.update = function() {
    var platforms = this.gameState.level.platforms;
    this.game.physics.arcade.collide(this, platforms);
    this.game.physics.arcade.collide(this, this.gameState.level.layer[2]);

    if (this.body.touching.down) {
      this.animations.stop();
      this.frame = 5;
    }
  };

  LD.Bear.prototype.run = function() {
    this.direction = 1;
    this.scale.x = -1;
    this.body.velocity.x = 10 * this.direction;
    this.animations.play('run');
  };

  // BEEEEEEESSSSS!!!!!

  LD.Bee = function(gameState) {
    Phaser.Sprite.call(this, gameState.game,
      gameState.game.rnd.integerInRange(0, 360),
      gameState.game.rnd.integerInRange(0, 360), 'bee');
    this.gameState = gameState;
    this.kill();
    this.beePool = this.game.add.group();
    this.beePool.enableBody = true;
    this.beePool.physicsBodyType = Phaser.Physics.ARCADE;
    this.game.physics.arcade.enable(this.beePool);
    this.beePool.createMultiple(5, 'bee');

    this.beePool.forEach(function(bee) {
      bee.animations.add('fly', [0, 1, 2], 20, true);
    }, this);

    this.gameState = gameState;
    this.game.physics.arcade.enable(this);
    this.phy = this.game.physics.arcade;
    this.body.collideWorldBounds = false;
  };

  LD.Bee.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Bee.constructor = LD.Bee;

  LD.Bee.prototype.update = function() {
    this.phy.collide(this.beePool, this.gameState.level.layer[2]);
    this.phy.collide(this.beePool, this.beePool);

    this.beePool.forEach(function(bee) {
      var enemy = this.gameState.enemy.enemyPool.getFirstAlive();

      if (enemy) {
        if (this.phy.distanceToXY(bee, enemy.x, enemy.y) > 5 ||
          this.phy.distanceToXY(bee, enemy.x, enemy.y) < -5) {
          this.phy.moveToXY(bee, enemy.x, enemy.y, 300);
        }
      }

      if (bee.health <= 0) {
        bee.gravity = 100;
        bee.body.velocity.x = 0;
        bee.body.velocity.y = 50;
        bee.animations.stop();
        bee.scale.y = -0.5;
        if (bee.body.blocked.down) {
          bee.kill();
        }
      }

      if (bee.body.deltaX() > 0) {
        bee.scale.x = -0.5;
        bee.scale.y = 0.5;
      } else {
        bee.scale.x = 0.5;
        bee.scale.y = 0.5;
      }
    }, this, 200);
  };

  LD.Enemy = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 300,
      gameState.game.world.height - 400, 'enemy1');

    this.gameState = gameState;
    this.kill();
    // this.game.physics.arcade.enable(this);
    this.phy = this.game.physics.arcade;
    this.eDeath = this.game.add.audio('enemy_death');
    this.hitSound = this.game.add.audio('hit_sound');
    this.emitter = this.game.add.emitter(0, 0, 20);
    this.emitter.makeParticles(['blood_drop', 'gib_leg', 'gib_case']);
    this.emitter.gravity = 200;
    this.emitter.setAlpha(1, 0, 1200);
    this.emitterPool = this.game.add.group();
    this.enemyPool = this.game.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(120, 'enemy1');
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('outOfBoundsKill', false);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('bounce', 0.3);
    this.enemyPool.setAll('body.gravity.y', 900);
    this.phy.enable(this.enemyPool);

    // Set the animation for each sprite
    this.enemyPool.forEach(function(enemy) {
      enemy.animations.add('attack', [0, 1, 2, 3, 4, 5, 6], 20, true);
      enemy.animations.add('die', [7, 8, 9, 10, 10, 10, 10, 10], 10, false);
    }, this);

    this.nextEnemyAt = 0;
    this.enemyDelay = 1000;
  };

  LD.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Enemy.constructor = LD.Enemy;

  LD.Enemy.prototype.update = function() {
    this.phy.collide(this, this.gameState.level.layer[2]);
    this.phy.collide(this.enemyPool, this.gameState.level.layer[2]);
    this.phy.collide(this.emitter, this.gameState.level.layer[2]);

    if (this.nextEnemyAt <
        this.game.time.now &&
        this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.game.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(
        (this.gameState.player.body.x) +
        window.innerWidth + 300, 100
        );
      enemy.health = 100;
      enemy.alive = true;
      // also randomize the speed
      // enemy.body.velocity.y = this.game.rnd.integerInRange(500 );
      enemy.play('attack');
    }

    this.enemyPool.forEach(function(enemy) {
      if (enemy.body.blocked.down) {
        enemy.hasTouched = true;
        enemy.isJumping = false;
        this.phy.moveToXY(enemy, this.gameState.player.x, enemy.y, 200);
      } else {
        enemy.y += 1;
      }

      if ((!enemy.body.blocked.down &&
            enemy.hasTouched &&
            enemy.body.deltaY() > 0 &&
            !enemy.isJumping) ||
            (enemy.body.blocked.left ||
             enemy.body.blocked.right)
          ) {
        enemy.isJumping = true;
        enemy.body.velocity.y = -650;

        if (enemy.x > this.gameState.player.x) {
          enemy.body.velocity.x = -200;
        } else {
          enemy.body.velocity.x = 200;
        }
      }

      if (enemy.body.deltaX() > 0) {
        enemy.scale.x = 1;
      } else {
        enemy.scale.x = -1;
      }

      this.phy.overlap(enemy, this.gameState.player, function() {
        if (enemy.health > 0) {
          this.gameState.player.health -= 0.2;
        }
        if (this.game.controls.fire.isDown) {
          enemy.health -= 30;
          if (enemy.health < 0) {
            this.explode(enemy.x, enemy.y);
            enemy.kill();
            this.eDeath.play();
          } else {
            this.hitSound.play();
            enemy.body.velocity.x = 400;
            enemy.body.velocity.y = -300;
          }
        }
      }, null, this);

      if (enemy.health <= 0 && enemy.alive) {
        enemy.alive = false;
        enemy.animations.play('die');
        this.eDeath.play();
        enemy.body.velocity.x = 0;
        enemy.events.onAnimationComplete.add(function() {
          enemy.kill();
        }, this);
      }
    }, this, 200);
  };

  LD.Enemy.prototype.explode = function(x, y) {
    this.emitter.x = x;
    this.emitter.y = y;
    this.emitter.start(true, 1200, null, 100);
  };
}());
