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
    this.kill();
    this.beePool = this.game.add.group();
    this.beePool.enableBody = true;
    this.beePool.physicsBodyType = Phaser.Physics.ARCADE;
    this.beePool.createMultiple(10, 'bee');

    this.beePool.forEach(function (bee) {
     bee.animations.add('fly', [0, 1, 2], 20, true);
    }, this);

    this.gameState = gameState;

    this.game.physics.arcade.enable(this);
    this.phy = this.game.physics.arcade;
    // this.roar = this.game.add.audio('roar');\\
    this.body.collideWorldBounds = false;
    // this.body.bounce(0.50);

  };


  LD.Bee.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Bee.constructor = LD.Bee;

  LD.Bee.prototype.update = function() {
    this.game.physics.arcade.collide(this, this.gameState.level.layer[2]);


      var bee = this.beePool.getFirstExists(false);
      // spawn at a random location top of the screen
      if(bee) {
        bee.reset(this.gameState.player.x , this.gameState.player.y - 50 );
        // also randomize the speed
        // enemy.body.velocity.y = this.game.rnd.integerInRange(500 );
        bee.play('fly');
      }


      this.beePool.forEach(function (bee) {




         if (this.phy.distanceToXY(bee, this.gameState.player.x, this.gameState.player.y) > 150 ||
                this.phy.distanceToXY(bee, this.gameState.player.x, this.gameState.player.y) < -150) {
            this.phy.moveToXY(bee, Math.round(this.gameState.player.x - 50), Math.round(this.gameState.player.y - 20) , 300);
          }

      if (bee.body.deltaX() > 0){
        bee.scale.x = -0.5;
        bee.scale.y = 0.5;
      } else {
        bee.scale.x = 0.5;
        bee.scale.y = 0.5;

      }



      }, this, 200);




    if (this.phy.distanceToXY(this, this.gameState.player.x, this.gameState.player.y) > 150 ||
        this.phy.distanceToXY(this, this.gameState.player.x, this.gameState.player.y) < -150) {
    this.phy.moveToXY(this, Math.round(this.gameState.player.x - 50), Math.round(this.gameState.player.y - 20) , 300);
  }
  };




  LD.Enemy = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 300,
     gameState.game.world.height - 400, 'enemy1');

    this.gameState = gameState;
    this.kill();
    // this.game.physics.arcade.enable(this);
    this.phy = this.game.physics.arcade;

    this.emitter = this.game.add.emitter(0, 0, 100);
    this.emitter.makeParticles('blood_drop');
    this.emitter.gravity = 100;
    this.emitter.setAlpha(1, 0, 3000);


    this.enemyPool = this.game.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(50, 'enemy1');
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('bounce', 0.3);
    this.enemyPool.setAll('body.gravity.y', 1900);

    // Set the animation for each sprite
    this.enemyPool.forEach(function (enemy) {
      enemy.animations.add('attack', [ 0, 1, 2, 3, 4, 5, 6 ], 20, true);
      enemy.animations.add('die', [ 7, 8, 9, 10 ], 20, false);

    }, this);

    this.nextEnemyAt = 0;
    this.enemyDelay = 4000;

  };


  LD.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Enemy.constructor = LD.Enemy;

  LD.Enemy.prototype.update = function() {
    this.phy.collide(this, this.gameState.level.layer[2]);
    this.phy.collide(this.enemyPool, this.gameState.level.layer[2]);
    this.phy.collide(this.emitter, this.gameState.level.layer[2]);

    if (this.nextEnemyAt < this.game.time.now && this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.game.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(this.gameState.player.x + 400, this.gameState.player.y - 50 );
      // also randomize the speed
      // enemy.body.velocity.y = this.game.rnd.integerInRange(500 );
      enemy.play('attack');
    }


    this.enemyPool.forEach(function (enemy) {
      if (enemy.body.blocked.down) {
        enemy.hasTouched = true;
        enemy.isJumping = false;
        this.phy.moveToXY(enemy, this.gameState.player.x, enemy.y, 200);
      } else {
        enemy.y += 1;
      }

      if ((!enemy.body.blocked.down && enemy.hasTouched && enemy.body.deltaY() > 0 && !enemy.isJumping) ||
          (enemy.body.blocked.left || enemy.body.blocked.right)
          ) {
         enemy.isJumping = true;
         enemy.body.velocity.y = -650;

         if (enemy.x > this.gameState.player.x) {
            enemy.body.velocity.x = -200;
          } else {
            enemy.body.velocity.x = 200;
       }
      }

       if (enemy.body.deltaX() > 0){
          enemy.scale.x = 1;
        } else {
          enemy.scale.x = -1;
        }

      this.phy.overlap(enemy, this.gameState.player, function() {
        if (this.game.controls.fire.isDown) {
          this.explode(enemy.x, enemy.y);
          enemy.kill();
        }
      }, null, this);

    }, this, 200);

    // console.log(this.gameState.player.y, this.gameState.player.x);

  };

  LD.Enemy.prototype.explode = function(x, y) {
    this.emitter.x = x;
    this.emitter.y = y;
    this.emitter.start(true, 3000, null, 200);
  };



}());
