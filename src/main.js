const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-view',
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

const game = new Phaser.Game(config);

function preload ()
{
  //player
  this.load.spritesheet('santa', 'images/sprites/player/PlayerSpriteSheet.png', {frameWidth: 600, frameHeight: 400})
  //obstacles
  this.load.spritesheet('objects', 'images/sprites/objects/Obstacles_Sprite_Sheet.png', {frameWidth: 600, frameHeight: 450})
  // background
}

function create ()
{
}

function update ()
{
}