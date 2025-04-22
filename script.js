// Constants
const TILE_SIZE = 10;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const DELAY = 140;
const MAX_RANDOM = 29;
const MAX_SEGMENTS = 900;

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
};

// Variables globals
let canvas, ctx;
let headImg, bodyImg, appleImg;

let snakeLength = 3;
let snakeX = new Array(MAX_SEGMENTS);
let snakeY = new Array(MAX_SEGMENTS);
let appleX, appleY;
let inGame = true;

let direction = {
  left: false,
  right: true,
  up: false,
  down: false
};

function initGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  loadImages();
  initSnake();
  placeApple();
  setTimeout(gameLoop, DELAY);
}

function loadImages() {
  headImg = new Image();
  headImg.src = 'head.png';

  bodyImg = new Image();
  bodyImg.src = 'dot.png';

  appleImg = new Image();
  appleImg.src = 'apple.png';
}

function initSnake() {
  for (let i = 0; i < snakeLength; i++) {
    snakeX[i] = 50 - i * TILE_SIZE;
    snakeY[i] = 50;
  }
}

function placeApple() {
  appleX = Math.floor(Math.random() * MAX_RANDOM) * TILE_SIZE;
  appleY = Math.floor(Math.random() * MAX_RANDOM) * TILE_SIZE;
}

function gameLoop() {
  if (!inGame) return drawGameOver();

  checkAppleCollision();
  checkSelfCollision();
  checkWallCollision();

  moveSnake();
  drawScene();

  setTimeout(gameLoop, DELAY);
}

function checkAppleCollision() {
  if (snakeX[0] === appleX && snakeY[0] === appleY) {
    snakeLength++;
    placeApple();
  }
}

function checkSelfCollision() {
  for (let i = 4; i < snakeLength; i++) {
    if (snakeX[0] === snakeX[i] && snakeY[0] === snakeY[i]) {
      inGame = false;
    }
  }
}

function checkWallCollision() {
  if (
    snakeX[0] < 0 || snakeX[0] >= CANVAS_WIDTH ||
    snakeY[0] < 0 || snakeY[0] >= CANVAS_HEIGHT
  ) {
    inGame = false;
  }
}

function moveSnake() {
  for (let i = snakeLength; i > 0; i--) {
    snakeX[i] = snakeX[i - 1];
    snakeY[i] = snakeY[i - 1];
  }

  if (direction.left) snakeX[0] -= TILE_SIZE;
  if (direction.right) snakeX[0] += TILE_SIZE;
  if (direction.up) snakeY[0] -= TILE_SIZE;
  if (direction.down) snakeY[0] += TILE_SIZE;
}

function drawScene() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.drawImage(appleImg, appleX, appleY);

  for (let i = 0; i < snakeLength; i++) {
    const img = (i === 0) ? headImg : bodyImg;
    ctx.drawImage(img, snakeX[i], snakeY[i]);
  }
}

function drawGameOver() {
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 18px serif';
  const points = snakeLength - 3;
  const message = points === 1 ? '1 punt - Fi del joc' : `${points} punts - Fi del joc`;
  ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

// Inputs de teclat
document.addEventListener('keydown', (e) => {
  const key = e.keyCode;

  if (key === KEY.LEFT && !direction.right) {
    setDirection(true, false, false, false);
  } else if (key === KEY.RIGHT && !direction.left) {
    setDirection(false, true, false, false);
  } else if (key === KEY.UP && !direction.down) {
    setDirection(false, false, true, false);
  } else if (key === KEY.DOWN && !direction.up) {
    setDirection(false, false, false, true);
  }
});

function setDirection(left, right, up, down) {
  direction = { left, right, up, down };
}