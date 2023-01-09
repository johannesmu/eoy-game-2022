const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  parent: 'game-view',
  backgroundColor: "#5DACD8",
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 800 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// globals
let cloudL, cloudS, player, keyPress, text
let isPlaying = true
let tick = 0
let score = 0
// obstacles
let obsInterval = 400
let obstacles = []

function preload() {
  //player
  this.load.spritesheet('santa', 'images/sprites/player/SantaSpriteSheet.png', { frameWidth: 600, frameHeight: 326 })
  //obstacles
  this.load.spritesheet('objects', 'images/sprites/objects/Obstacles_Sprite_Sheet.png', { frameWidth: 480, frameHeight: 360 })
  // background
  this.load.image('cloudsL', 'images/backgrounds/Clouds_Large-Fluffy.png')
  this.load.image('cloudsS', 'images/backgrounds/Clouds_Small-fluffy.png')
}

function create() {
  // backgrounds
  cloudL = this.add.tileSprite(400, 300, 2400, 600, 'cloudsL')
  cloudS = this.add.tileSprite(400, 300, 2400, 600, 'cloudsS')
  // text
  text = this.add.text(0, 0, score, { fontFamily:'Arial, Helvetica, sans-serif', fontSize: 20, padding: 10, textShadow: "1 1 1 4px black" })
  // animations
  this.anims.create({
    key: "down",
    frameRate: 7,
    frames: this.anims.generateFrameNumbers("santa", { start: 0, end: 3 }),
    repeat: -1
  })
  this.anims.create({
    key: "up",
    frameRate: 7,
    frames: this.anims.generateFrameNumbers("santa", { start: 4, end: 6 }),
    repeat: -1
  })
  this.anims.create({
    key: "crash",
    frameRate: 7,
    frames: this.anims.generateFrameNumbers("santa", { start: 7, end: 9 }),
    repeat: -1
  })

  // chaining animations
//   character.sprite.play("ball_out").once('animationcomplete', () => {
//     character.sprite.play("feather_in");
//  });

  // player
  player = this.physics.add.sprite(400, 50, 'santa')
  player.setCollideWorldBounds(true)
  player.play("down")
  player.setScale(0.38)

  // obstacle
  this.anims.create({
    key: "pipe",
    framerate: 7,
    frames: this.anims.generateFrameNumbers("objects", { start: 0, end: 0 }),
    repeat: 1
  })
  // controls
  this.input.keyboard.on('keydown', function (event) {
    keyPress = event.key
  })
  this.input.keyboard.on('keyup', function (event) {
    keyPress = null
  })
}

function update() {
  if( isPlaying == false ) {
    return
  }

  cloudL.tilePositionX += 1
  cloudS.tilePositionX += 0.25
  
  if(keyPress == " ") {
    player.setVelocityY(-300)
    player.play("up")
  }
  else {
    player.setVelocityY(100)
    player.play("down")
  }

  tick++
  if( tick % obsInterval == 0 ) {
    console.log(`ticking ${tick}`)
    createObstacle(this)
  }
  else if ( tick % 2000 == 0) {
    obsInterval = 300
  }
  else if ( tick % 5000 == 0 ) {
    obsInterval = 400
  }
  manageObstacles()
}

function createObstacle(e) {
  lanes = [30, 240, 480]
  let obj = e.physics.add.sprite(1300, lanes[ randGen(2) ] + 120,"objects")
  const framenum = randGen(5)
  obj.setFrame( framenum )
  e.physics.add.collider( player, obj, ( player, obj ) => {
    // console.log("hit")
    isPlaying = false
    player.play("crash")
    player.setVelocityY(300)
    obj.destroy()
  }, null )
  obstacles.push(obj)
}

function manageObstacles() {
  // console.log( obstacles.length)
  obstacles.forEach( (obst) => {
    if( obst.x >= -200 ) {
      obst.x -= 3
    }
    else {
      obst.destroy()
      let item = obstacles.shift()
      item = null
      score += 1
      text.setText(score)
    }
  })
}

function randGen(limit) {
  return Math.round(Math.random() * limit)
}