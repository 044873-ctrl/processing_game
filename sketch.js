let player;
let playerSpeed;
let playerRadius;
let playerBullets;
let playerBulletRadius;
let playerBulletSpeed;
let enemies;
let enemyRows;
let enemyCols;
let enemyRadius;
let enemyDirection;
let enemySpeed;
let enemyDrop;
let enemyBullets;
let enemyBulletRadius;
let enemyBulletSpeed;
let enemyShootCounter;
let enemyShootInterval;
let score;
let gameOver;
let gameClear;
function setup() {
  createCanvas(400, 600);
  playerSpeed = 5;
  playerRadius = 12;
  player = { x: width / 2, y: height - 30, r: playerRadius };
  playerBullets = [];
  playerBulletRadius = 4;
  playerBulletSpeed = 8;
  enemies = [];
  enemyRows = 4;
  enemyCols = 6;
  enemyRadius = 12;
  enemyDirection = 1;
  enemySpeed = 1.2;
  enemyDrop = 18;
  enemyBullets = [];
  enemyBulletRadius = 4;
  enemyBulletSpeed = 5;
  enemyShootCounter = 0;
  enemyShootInterval = 90;
  score = 0;
  gameOver = false;
  gameClear = false;
  let startX = 60;
  let startY = 60;
  let spacingX = 52;
  let spacingY = 42;
  for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
      let ex = startX + col * spacingX;
      let ey = startY + row * spacingY;
      enemies.push({ x: ex, y: ey, r: enemyRadius });
    }
  }
  textSize(16);
  noStroke();
}
function draw() {
  background(0);
  if (!gameOver && !gameClear) {
    handlePlayerMovement();
    handleEnemyMovement();
    handleEnemyShooting();
  }
  updatePlayerBullets();
  updateEnemyBullets();
  checkEnemyClear();
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawUI();
  if (gameOver) {
    fill(255, 50, 50);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(
