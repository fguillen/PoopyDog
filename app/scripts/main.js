console.log("This is the game!!!");

// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

// Creates a new 'main' state that will contain the game
var main_state = {

  preload: function() {
    this.game.stage.backgroundColor = '#71c5cf';

    this.game.load.image('dog', '/images/dog.png');
    this.game.load.image('poop', '/images/poop.png');
    this.game.load.image('player', '/images/player.png');
  },

  create: function() {
    // Looks like I don't need this bellow line
    // this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.dog = this.game.add.sprite(100, 245, 'dog');
    this.game.physics.enable( [ this.dog ], Phaser.Physics.ARCADE);
    this.dog.body.collideWorldBounds = true;

    this.player = this.game.add.sprite(100, 245, 'player');
    this.game.physics.enable( [ this.player ], Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;


    this.dog_change_direction();

    this.poops = game.add.group();
    this.poops.createMultiple(20, 'poop');

    this.poops.forEach( function(poop){
      this.game.physics.enable( [ poop ], Phaser.Physics.ARCADE);
    });

    this.space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.space_key.onDown.add(this.player_wants_to_pick_up_poop, this);

    this.timer = this.game.time.events.loop(1500, this.does_the_dog_want_to_poop, this);

    // Score
    this.score = 0;
    var style = { font: "30px Arial", fill: "#ffffff" };
    this.label_score = this.game.add.text(20, 20, "0", style);

    this.cursors = game.input.keyboard.createCursorKeys();
  },

  update: function() {
    // If the dog is out of the world (too high or too low), call the 'restart_game' function
    // if (this.dog.inWorld == false) {
    //   this.restart_game();
    // }

    if(!this.dog.inWorld) {
      this.dog_change_direction();
    }

    if(this.game.rnd.integerInRange(0, 40) == 1) {
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

    // this.poops.forEach( function(poop){
      this.game.physics.arcade.overlap(
        this.player,
        this.poops,
        this.player_picks_up_poop,
        null,
        this
      );
    // });


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
    var number = this.game.rnd.integerInRange(0, 1);
    console.log("number", number);

    if(number == 1){
      console.log("dog wants to poop");
      this.dog_poops();
    }
  },

  dog_poops: function(){
    console.log("dog poops");
    var poop = this.poops.getFirstDead();

    // Set the new position of the poop
    poop.reset(this.dog.x, this.dog.y);
  },

  // Make the dog jump
  jump: function() {
    // Add a vertical velocity to the dog
    this.dog.body.velocity.y = -350;
  },

  // Restart the game
  restart_game: function() {
    this.game.time.events.remove(this.timer);

    // Start the 'main' state, which restarts the game
    this.game.state.start('main');
  },

  add_one_poop: function(x, y) {
    console.log(this.poops.countDead());
    // Get the first dead poop of our group
    var poop = this.poops.getFirstDead();

    // Set the new position of the poop
    poop.reset(x, y);

    // Add velocity to the poop to make it move left
    poop.body.velocity.x = -200;

    // Kill the poop when it's no longer visible
    poop.outOfBoundsKill = true;
  },

  add_row_of_poops: function() {
    var hole = Math.floor(Math.random()*4)+1;

    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole +1 && i != hole +2) {
        this.add_one_poop(400, i*60+10);
      }
    }

    this.score += 1;
    this.label_score.setText(this.score);
  },
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);
game.state.start('main');