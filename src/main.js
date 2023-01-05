const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  parent: 'game-view',
  backgroundColor: "#5DACD8",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
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
let cloudL, cloudS, player, keyPress

function preload() {
  //player
  this.load.spritesheet('santa', 'images/sprites/player/PlayerSpriteSheet.png', { frameWidth: 600, frameHeight: 300 })
  //obstacles
  this.load.spritesheet('objects', 'images/sprites/objects/Obstacles_Sprite_Sheet.png', { frameWidth: 600, frameHeight: 450 })
  // background
  this.load.image('cloudsL', 'images/backgrounds/Clouds_Large-Fluffy.png')
  this.load.image('cloudsS', 'images/backgrounds/Clouds_Small-fluffy.png')
}

function create() {
  // backgrounds
  cloudL = this.add.tileSprite(400, 300, 2400, 600, 'cloudsL')
  cloudS = this.add.tileSprite(400, 300, 2400, 600, 'cloudsS')
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

  // player
  player = this.physics.add.sprite(400, 50, 'santa')
  player.setCollideWorldBounds(true)
  player.play("crash")

  //keys
  this.input.keyboard.on('keydown', function (event) {
    keyPress = event.key
  })
  this.input.keyboard.on('keyup', function (event) {
    keyPress = null
  })
}

function update() {
  cloudL.tilePositionX += 1
  cloudS.tilePositionX += 0.25
}