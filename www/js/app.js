//variable for game
var game;

//variable for timer
var timer = 0;
var total = 0;
//variable for enemybird timer
var birdTimer;

//var for the protag
var protag;
//var for enemy burds
var enemyburds;
//variable for the sun
var sun;


//when the window opens load all these reqs
window.onload = function () {
    console.log("==window  on load event");
    game = new Phaser.Game(640, 960, Phaser.AUTO, "");

    //add all the states of the game that will be needed
    //add a boot screen for the game
    //    game.state.add('boot', boot);
    //add the mainstate to the game
    game.state.add('main', mainState);

    //now start the state we have just added.
    game.state.start('main');


};
// 
//var boot = function () {
//    preload: function () {
//
//    }
//};

//create the main state of the phaser game
var mainState = function (game) {}
mainState.prototype = {
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
        //Set up the game and display all the assets we have just loaded
        //show the sky tile, repeated
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');
        //set the background color
        game.stage.backgroundColor = '#71c5cf';

        //set the physics system of our game
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //display the bird at the pos x and y
        protag = game.add.sprite(30, 245, 'protag');


        //add physics to our protag
        //this is needed for movemnet, grav and collisions
        game.physics.arcade.enable(protag);


        //add gravity to the protag so that he will fall]
        protag.body.gravity.y = 1000;
        //add the sun at 20, 20
        sun = game.add.sprite(1, 1, 'sun');

        //call the up/ascend function when the spacebar is hit
        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spacekey.onDown.add(this.jump, this);

        //create a group for the enemy birds
        enemyburds = game.add.group();
        //        game.physics.arcade.enable(enemyburds, true);
        //        enemyburds.enableBody = true;
        //        enemyburds.physicsBodyType = Phaser.Physics.ARCADE;

        //use a timer to spawn in the enemy birds
        birdTimer = game.time.events.loop(1500, this.bombardBirds, this);
        birdTimer.timer.start();

        //create score
        this.score = 0;
        this.userScore = game.add.text(20, 20, "0"), {
            font: "30px Arial",
            fill: "#ffffff"
        };

        //change the center of rotation
        protag.anchor.setTo(-0.2, 0.5);

        //add the sound to the game
        this.jumpNoise = game.add.audio('jump');
        //adds animation to the main protag sprite
        protag.animations.add('fly');
        //how quick do you want the animation to run
        protag.animations.play('fly', 10, true);

        //create animation for sun
        sun.animations.add('float');
        //play the animations with a certain speed
        sun.animations.play('float', 5, true);




    },

    update: function () {
        //does all the games functionality and animates the game through logic
        //if the bird falls outside of the phonescreen the restartGame function w ill be called
        if (protag.y < 0 || protag.y > 960) {
            this.restartGame();
        }

        //when the user passes the enemy add a point
        //update the score 
        //        this.score += 1;
        //        this.userScore.text = this.score;

        //attmept at collision
        game.physics.arcade.overlap(protag, enemyburds, this.hitEnemy, null, this);


        //adds roatation so that your gangster bird looks like its falling and ascending gracefully
        if (protag.angle < 20) {
            protag.angle += 1;
        }


        if (total < 200 && game.time.now > timer) {
            //            bombardBirds;
        }



    },

    jump: function () {
        //check to see if the protag is alive
        if (protag.alive == false) {
            return;
        }

        //add ascend to the protag
        protag.body.velocity.y = -350;

        //add animation for soaring
        var fly_animation = game.add.tween(protag);

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

    //    addOneEnemy: function (x, y) {
    //        //create the enemies position at x and y
    //        var eb = game.add.sprite(x, y, 'enemyb');
    //
    //        //add this enemy to the group
    //        this.enemybird.add(eb);
    //
    //        //enables physics on the enemies
    //        game.physics.arcade.enable(eb);
    //
    //        //add some velocity to the enemy so it will move towards our protag
    //        eb.body.velocity.x = -200;
    //
    //        //kill the enemy bird once it goes off screen
    //        eb.checkWorldBounds = true;
    //        eb.outOfBoundsKill = true;
    //    },

    bombardBirds: function () {
        enemyburd = game.add.sprite(640, game.world.randomY, 'enemyb');
        enemyburd.scale.set(1.5, 1.5);
        //        enemyburds.add(enemyburds);

        game.add.tween(enemyburd).to({
            x: game.width - (1600 + enemyburds.x) //loads the enemies from offscreen to the right
        }, 15000, Phaser.Easing.Linear.None, true);

        total++;
        //how quick the enemy burds spawn
        timer = game.time.now + 100;
        //enables physics on the enemies
        game.physics.arcade.enable(enemyburd);
        //add the enemyburd objhect to the group created in the create function
        enemyburds.add(enemyburd);



        //adds animation to the enemy burds
        enemyburd.animations.add('flap');
        //how quick do you want the animation to run
        enemyburd.animations.play('flap', 10, true);


    },

    hitEnemy: function () {
        //if our protag has hit an enemy already do nothing
        if (protag.alive == false) {
            return;
        }
        console.log("hitttt");
        //make our protag dead
        protag.alive = false;

        //prevent new enemies from appearing
        game.time.events.remove(birdTimer);

        //look for each enemey object and halt their movement
        enemyburds.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    },
};