console.log("This is the game!!!");

// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(590, 490, Phaser.AUTO, 'game_div');

// Creates a new 'main' state that will contain the game
var main_state = {

  preload: function() {
    this.game.stage.backgroundColor = '#71c5cf';

    this.game.load.spritesheet('dog', '/images/dog.png', 50, 42);
    this.game.load.spritesheet('player', '/images/player.png', 40, 50);
    this.game.load.image('poop', '/images/poop.png');
  },

  create: function() {
    // Looks like I don't need this bellow line
    // this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.poops = game.add.group();
    this.poops.createMultiple(20, 'poop');

    this.poops.forEach( function(poop){
      this.game.physics.enable( [ poop ], Phaser.Physics.ARCADE);
    });

    this.dog = this.game.add.sprite(100, 245, 'dog');
    this.dog.scale.set(1.5);
    this.dog.animations.add('walk', [0, 1], 10, true);
    this.dog.animations.add('pooping', [2, 3], 10, true);
    this.dog.animations.play('walk');
    this.game.physics.enable( [ this.dog ], Phaser.Physics.ARCADE);
    this.dog.body.collideWorldBounds = true;
    this.dog.state = "walking";

    this.player = this.game.add.sprite(100, 245, 'player');
    this.player.animations.add('walk', [0, 1], 10, true);
    this.player.animations.play('walk');
    this.game.physics.enable( [ this.player ], Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.player.state = "walking";


    this.dog_change_direction();



    this.space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.space_key.onDown.add(this.player_wants_to_pick_up_poop, this);

    this.timer = this.game.time.events.loop(1500, this.does_the_dog_want_to_poop, this);

    // Score
    this.score = 0;
    var style = { font: "30px Arial", fill: "#ffffff" };
    this.label_score = this.game.add.text(20, 20, "0", style);

    this.cursors = game.input.keyboard.createCursorKeys();

    // Animations
    // this.anim_pooping = this.dog.animations.add('pooping');

    // this.anim_pooping.onStart.add(animationStarted, this);
    // this.anim_pooping.onLoop.add(animationLooped, this);
    // this.anim_pooping.onComplete.add(animationStopped, this);

    // anim.play(10, true);
  },

  update: function() {
    // If the dog is out of the world (too high or too low), call the 'restart_game' function
    // if (this.dog.inWorld == false) {
    //   this.restart_game();
    // }


    if(this.dog.state == "walking" && this.game.rnd.integerInRange(0, 40) == 1) {
      this.dog_change_direction();
    }


    // Looks like I have to kill the poop on my own when it is out of the canvas
    // this.poops.forEach( function(poop){
    //   if (poop.alive && !poop.inWorld) {
    //     poop.kill();
    //   }
    // });

    // this.game.physics.arcade.overlap(
    //   this.dog,
    //   this.poops,
    //   this.restart_game,
    //   null,
    //   this
    // );

    this.cursor_detection();
  },

  render: function(){

  },

  player_wants_to_pick_up_poop: function(){
    console.log("player_wants_to_pick_up_poop");

    this.game.physics.arcade.overlap(
      this.player,
      this.poops,
      this.player_picks_up_poop,
      null,
      this
    );

  },

  player_picks_up_poop: function(player, poop){
    console.log("player_picks_up_poop");
    poop.kill();
    this.score += 1;
    this.label_score.setText(this.score);
  },

  cursor_detection: function(){
    if(this.cursors.left.isDown) this.player.x -= 4;
    if(this.cursors.right.isDown) this.player.x += 4;
    if(this.cursors.up.isDown) this.player.y -= 4;
    if(this.cursors.down.isDown) this.player.y += 4;
  },

  dog_change_direction: function(){
    this.dog.body.velocity.y = this.game.rnd.integerInRange(-200, 200);
    this.dog.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
  },

  does_the_dog_want_to_poop: function(){
    if(this.dog.state == "pooping") return;

    var number = this.game.rnd.integerInRange(0, 1);
    console.log("number", number);

    if(number == 1){
      this.dog_start_pooping();
    }
  },

  dog_start_pooping: function(){
    console.log("dog_start_pooping");
    this.dog.state = "pooping"

    this.dog.body.velocity.y = 0;
    this.dog.body.velocity.x = 0;

    this.dog.animations.play('pooping');
    game.time.events.add(3000, this.dog_poops, this);
  },

  dog_walks: function(){
    console.log("dog_walks");
    this.dog.state = "walking"
    this.dog.animations.play('walk');
    this.dog_change_direction();
  },

  dog_poops: function(){
    console.log("dog_poops");
    var poop = this.poops.getFirstDead();

    // Set the new position of the poop
    poop.reset(this.dog.x + 70, this.dog.y + 20);

    this.dog_walks();
  },

};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);
game.state.start('main');