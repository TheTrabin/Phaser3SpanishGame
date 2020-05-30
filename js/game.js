// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  //word Dtabase
  this.words = [
    {
    key: 'building',
    setXY: {
      x:100,
      y:240
    },
    spanish: 'edificio',
  },
  {
    key: 'house',
    setXY: {
      x:240,
      y:280
    },
    setScale: {
      x: 0.8,
      y: 0.8,
    },
    spanish: 'casa',
  },
  {
    key: 'car',
    setXY: {
      x:400,
      y:300
    },
    setScale: {
      x: 0.8,
      y: 0.8,
    },
    spanish: 'automovil',
  },
  {
    key: 'tree',
    setXY: {
      x:550,
      y:250
    },
    setScale: {
      x: 0.8,
      y: 0.8,
    },
    spanish: 'arbol',
  },
  ]
};

// load asset files for our game
gameScene.preload = function() {
  //load images
this.load.image('background', 'assets/images/background-city.png');
this.load.image('building', 'assets/images/building.png');
this.load.image('car', 'assets/images/car.png');
this.load.image('house', 'assets/images/house.png');
this.load.image('tree', 'assets/images/tree.png');

//load sound - freesound.org, audiojungle.net, Audacity.org
this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
this.load.audio('carAudio', 'assets/audio/auto.mp3');
this.load.audio('houseAudio', 'assets/audio/casa.mp3');
this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
this.load.audio('correct', 'assets/audio/correct.mp3');
this.load.audio('wrong', 'assets/audio/wrong.mp3');

};

// executed once, after assets were loaded
gameScene.create = function() {
//load background


//group
this.items = this.add.group(this.words);
let bg = this.add.sprite(0,0, 'background').setOrigin(0,0);
// items on top
this.items.setDepth(1);

// getting the group array
let items = this.items.getChildren();

for(let i = 0; i < items.length; i++) {

let item = items[i];

  //make item interactive
  item.setInteractive();

  //create tween - resize
  item.correctTween = this.tweens.add({
    targets: item,
    scaleX: 1.5,
    scaleY: 1.5,
    duration: 300,
    paused:true,
    yoyo: true,
    ease: 'quad.easeInOut'
  });

  item.wrongTween = this.tweens.add({
    targets: item,
    scaleX: 1.5,
    scaleY: 1.5,
    duration: 300,
    angle:90,
    paused:true,
    yoyo: true,
    ease: 'quad.easeInOut'
  });


// transparency tween
item.alphaTween = this.tweens.add({
  targets: item,
  alpha: 0.7,
  duration: 200,
  paused:true,
});


  item.on('pointerdown', function(pointer) {
    // item.resizeTween.restart();
let result = this.processAnswer(this.words[i].spanish);


//depending on the result, will play one tween or the other
if(result) {
  item.correctTween.restart();
}
else {
  item.wrongTween.restart();
}

    console.log('you clicked ' + item.texture.key);
    //show next question
    this.showNextQuestion();
  }, this);

  //listen to the pointerover
  item.on('pointerover', function(pointer) {
    item.alphaTween.restart();
  }, this);

//listen to the pointerover
item.on('pointerout', function(pointer) {

  //stop the alpha tween
  item.alphaTween.stop();

  //set no transparency
  item.alpha = 1;
}, this);

//create sound for each word
this.words[i].sound = this.sound.add(
this.words[i].key + 'Audio'
);

};

//text object
this.wordText = this.add.text(30,20, {
  font: '28px Open Sans',
  fill: '#ffffff',
});

//corrext / wrong sounds
this.correctSound = this.sound.add('correct');
this.wrongSound = this.sound.add('wrong');


//show the first question
this.showNextQuestion();

};

//show new question
gameScene.showNextQuestion = function() {

  //select random word
  this.nextWord = Phaser.Math.RND.pick(this.words);

  //play a sound for that word
  this.nextWord.sound.play();


  //show the text of the word in spanish
this.wordText.setText(this.nextWord.spanish);
};

//answer processing
gameScene.processAnswer = function(userResponse) {
  if(userResponse == this.nextWord.spanish) {
    //it's correct

    //play sound
this.correctSound.play();
    return true;
  }
  else {
    //it's incorrect

    //play sound
this.wrongSound.play();
    return false;
  }
};


// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
