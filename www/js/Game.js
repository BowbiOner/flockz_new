//variable for game
var game;

//variable for timer
var timer = 0;
var total = 0;


//when the window opens load all these reqs
window.onload = function () {
    console.log("==window  on load event");
    game = new Phaser.Game(640, 960, Phaser.AUTO, "");

    //add all the states of the game that will be needed
    //game start screen
    game.state.add('splash', MainMenu);
    //add the mainstate to the game
    game.state.add('main', mainState);
    //add gameover state
    game.state.add('end', gameOver);
    //now start the state we have just added.
    game.state.start('main');

};
//create the main state of the phaser game
var mainState = {
    preload: function () {
        //gonna load all our assests in here as it will be executed at the very beginning
        //load the background image
        this.load.image('bg', 'assets/background.png');
        //load the protag sprite
        this.load.spritesheet('protag', 'assets/protag.png', 123, 39, 4);
        //load enemy bird sprites
        this.load.spritesheet('enemyb', 'assets/enemybird.png', 75, 60, 3);
        //load the plane sprites

        //add the sun sprite
        this.load.spritesheet('sun', 'assets/sun.png', 69, 72, 4);



        //load the sounds for the game
        game.load.audio('jump', 'assets/jump.wav');

    },



    create: function () {
        //show the space tile, repeated
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');

        //give it speed in x
        this.background.autoScroll(-20, 0);

        //start game text
        var text = "Tap to begin";
        var style = {
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        };
        var t = this.game.add.text(this.game.width / 2, this.game.height / 2, text, style);
        t.anchor.set(0.5);

        //        //highest score
        //        text = "Highest score: " + this.highestScore;
        //        style = {
        //            font: "15px Arial",
        //            fill: "#fff",
        //            align: "center"
        //        };
        //
        //        var h = this.game.add.text(this.game.width / 2, this.game.height / 2 + 50, text, style);
        //        h.anchor.set(0.5);

        //Set up the game and display all the assets we have just loaded
        //set the background color
        game.stage.backgroundColor = '#71c5cf';

        //set the physics system of our game
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //display the bird at the pos x and y
        this.protag = game.add.sprite(30, 245, 'protag');


        //add physics to our protag
        //this is needed for movemnet, grav and collisions
        game.physics.arcade.enable(this.protag);

        //add gravity to the protag so that he will fall]
        this.protag.body.gravity.y = 1000;
        //add the sun at 20, 20
        this.sun = game.add.sprite(1, 1, 'sun');

        //call the up/ascend function when the spacebar is hit
        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spacekey.onDown.add(this.jump, this);

        //create a group for the enemy birds
        this.enemybird = game.add.group();

        //use a timer to spawn in the enemy birds
        this.birdTimer = game.time.events.loop(1500, this.bombardBirds, this);
        this.birdTimer.timer.start();

        //create score
        this.score = 0;
        this.userScore = game.add.text(20, 20, "0"), {
            font: "30px Arial",
            fill: "#ffffff"
        };

        //change the center of rotation
        this.protag.anchor.setTo(-0.2, 0.5);

        //add the sound to the game
        this.jumpNoise = game.add.audio('jump');
        //adds animation to the main protag sprite
        this.protag.animations.add('fly');
        //how quick do you want the animation to run
        this.protag.animations.play('fly', 10, true);

        //create animation for sun
        this.sun.animations.add('float');
        //play the animations with a certain speed
        this.sun.animations.play('float', 5, true);

        //add collision between enemy bird and the protag
        this.protag.onCollide = new Phaser.Signal();
        this.protag.onCollide(hitEnemy, this);



    },

    update: function () {
        //does all the games functionality and animates the game through logic
        //if the bird falls outside of the phonescreen the restartGame function w ill be called
        if (this.protag.y < 0 || this.protag.y > 960) {
            this.restartGame();
        }



        //when the user passes the enemy add a point
        game.physics.arcade.overlap(this.protag, this.enemybird, this.hitEnemy, null, this);

        //adds roatation so that your gangster bird looks like its falling and ascending gracefully
        if (this.protag.angle < 20) {
            this.protag.angle += 1;
        }


        if (total < 200 && game.time.now > timer) {
            //            bombardBirds;
        }



    },

    jump: function () {
        //check to see if the protag is alive
        if (this.protag.alive == false) {
            return;
        }

        //add ascend to the protag
        this.protag.body.velocity.y = -350;

        //add animation for soaring
        var fly_animation = game.add.tween(this.protag);

        //we will change angle of the bird after its falling for 400 ms
        fly_animation.to({
            angle: -20
        }, 400);

        fly_animation.start();

        //on each jump play the jump sound effect
        this.jumpNoise.play();
    },

    restartGame: function () {
        //game restart which just starts the main state again
        game.state.start('main');

    },

    addOneEnemy: function (x, y) {
        //create the enemies position at x and y
        var eb = game.add.sprite(x, y, 'enemyb');

        //add this enemy to the group
        this.enemybird.add(eb);

        //enables physics on the enemies
        game.physics.arcade.enable(eb);

        //add some velocity to the enemy so it will move towards our protag
        eb.body.velocity.x = -200;

        //kill the enemy bird once it goes off screen
        eb.checkWorldBounds = true;
        eb.outOfBoundsKill = true;
        //tell eb to use the specified collision group
        eb.body.setCollisionGroup(ebColGroup);
    },

    bombardBirds: function () {

        var burds = game.add.sprite(640, game.world.randomY, 'enemyb');
        burds.scale.set(1.5, 1.5);

        game.add.tween(burds).to({
            x: game.width - (1600 + burds.x) //loads the enemies from offscreen to the right
        }, 15000, Phaser.Easing.Linear.None, true);

        total++;
        timer = game.time.now + 10;


        //update the score 
        this.score += 1;
        this.userScore.text = this.score;

        //adds animation to the enemy burds
        burds.animations.add('flap');
        //how quick do you want the animation to run
        burds.animations.play('flap', 10, true);

    },

    hitEnemy: function () {
        //if our protag has hit an enemy already do nothing
        if (this.protag.alive == false) {
            return;
        }

        //make our protag dead
        this.protag.alive = false;

        //prevent new enemies from appearing
        game.time.events.remove(this.birdTimer);

        //look for each enemey object and halt their movement
        this.enemybird.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    },
};