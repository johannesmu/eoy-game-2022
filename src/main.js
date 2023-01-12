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
let obstacleFiles = [
 {name: "hat", file: "OBS_BowlerHat.png", static: true },
 {name: "chandelier", file:"OBS_Chandelier.png", static: true },
 {name: "clock", file:"OBS_DrippyClock.png", static: true },
 {name: "pipe", file:"OBS_Pipe.png", static: true },
 {name: "spider", file:"OBS_Spider.png", static: true },
 {name: "urinal", file:"OBS_Urinal.png", static: true },
 {name: "eyebrows", file: "OBS_Eyebrows_Spritesheet", static: false }
]

function preload() {
  //player
  this.load.spritesheet('santa', 'images/sprites/player/SantaSpriteSheet.png', { frameWidth: 600, frameHeight: 326 })
  //obstacles
  obstacleFiles.forEach( (obsfile) => {
    this.load.image( obsfile.name, `images/sprites/objects/${obsfile.file}`)
  })
  //eyebrows
  this.load.spritesheet('eyebrows', 'images/sprites/objects/OBS_Monobrows_Spritesheet.png',{ frameWidth: 600, frameHeight: 300 })
  
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
  // obstacle animations
  this.anims.create({
    key: "flap",
    frameRate: 8,
    frames: this.anims.generateFrameNumbers("eyebrows", { start: 0, end: 4 }),
    repeat: -1
  })
  // player animations
  this.anims.create({
    key: "up",
    frameRate: 8,
    frames: this.anims.generateFrameNumbers("santa", { start: 0, end: 3 }),
    repeat: -1
  })
  this.anims.create({
    key: "down",
    frameRate: 8,
    frames: this.anims.generateFrameNumbers("santa", { start: 4, end: 6 }),
    repeat: -1
  })
  this.anims.create({
    key: "crash",
    frameRate: 8,
    frames: this.anims.generateFrameNumbers("santa", { start: 7, end: 9 }),
    repeat: 1
  })
  this.anims.create({
    key: "burn",
    frameRate: 8,
    frames: this.anims.generateFrameNumbers("santa", { start: 10, end: 13 }),
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
  const obsRange = randGen( obstacleFiles.length - 1 )
  console.log(obsRange)
  const obsname = obstacleFiles[obsRange].name
  console.log( obsname )
  let obj = e.physics.add.sprite(1300, lanes[ randGen(2) ] + 120, obsname )
  // const framenum = randGen(5)
  // obj.setFrame( framenum )
  const oscale = randGen(0.7,0.3,false)
  console.log(`objectscale=${oscale}`)
  const obsScale = oscale
  obj.setScale(obsScale)
  e.physics.add.collider( player, obj, ( player, obj ) => {
    isPlaying = false
    player.play("crash")
    player.chain(["burn"])
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

function randGen(limit, min=0, int=true ) {
  const num = (int) ? Math.round(Math.random() * limit) : Math.random()
  return ( num >= min ) ? num : min
}