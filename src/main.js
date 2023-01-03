// game assets
const playerSpriteSheetImg = "/images/sprites/player/TestPlayer.png"
const groundSpriteImg = "/images/sprites/world/Ground.png"
const canvasID = "game"

// game variables and states
let score = 0;
let isAlive = true
let mouseDown = false
let gamePaused = false
// environment
const playerScale = 0.15
let canvasWidth = 0
let canvasHeight = 0

const timer = createjs.Ticker
const stage = new createjs.Stage(canvasID);

const getCanvasDimension = () => {
  canvasHeight = document.getElementById(canvasID).offsetHeight
  canvasWidth = document.getElementById(canvasID).offsetWidth
  console.log(canvasWidth, canvasHeight)
}
//
const playerSetUp = () => {
  const data = {
    images: [playerSpriteSheetImg],
    frames: {
      width: 400,
      height: 300
    },
    animations: {
      down: [0, 1],
      up: [2, 3],
      dead: [4]
    }
  };
  var spriteSheet = new createjs.SpriteSheet(data);
  var animation = new createjs.Sprite(spriteSheet, "down");
  player = new createjs.Sprite(spriteSheet, animation);
  player.x = 50
  player.y = 0;
  player.scaleX = playerScale
  player.scaleY = playerScale
  player.regX = 0;
  player.regY = 80;
  player.framerate = 15
  player.name = "player";
  stage.addChild(player);
  stage.update();
}
let flying = false;
let falling = false
const playAnimation = ( name ) => {
  if( name == "down" && flying == false ) {
    gotoAndPlay("down")
    flying = true
  }
  
}

const onUpdate = (event) => {
  if (gamePaused == false) {
    // if the game is playing
    if( mouseDown == true ) {
      playAnimation("down")
    }
    else {

    }
  }
  else {
    // do paused stuff
  }
  stage.update(event)
}

const initGame = () => {
  gamePaused = false
  timer.on("tick", onUpdate)
  timer.framerate = 60
  getCanvasDimension()
  playerSetUp()
}

// start game
document.onload = initGame()

window.addEventListener("keydown", (event) => {
  //if spacebar is pressed
  if (event.code == "Space") {
    mouseDown = true;
  }
});
window.addEventListener("keyup", (event) => {
  mouseDown = false
});