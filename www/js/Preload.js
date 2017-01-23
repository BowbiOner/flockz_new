Flockz.Preloader = function (game) {
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

Flockz.Preloader.prototype = {
    //gonna load all our assests in here as it will be executed at the very beginning
    //load the background image
    this.load.image('bg', 'assets/background.png');
    //load the protag sprite
    this.load.spritesheet('protag', 'assets/protag.png', 123, 39, 4);
    //add the sun sprite
    this.load.spritesheet('sun', 'assets/sun.png', 69, 72, 4);



    //load the sounds for the game
    game.load.audio('jump', 'assets/jump.wav');
}