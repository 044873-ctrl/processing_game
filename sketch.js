let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 10;
let cpuX = canvasW - paddleW - 10;
let playerY = 0;
let cpuY = 0;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let ballX = 0;
let ballY = 0;
let ballR = 8;
let ballVX = 4;
let ballVY = 3;
let leftScore = 0;
let rightScore = 0;
let cpuTargetY = 0;
let cpuMissFrames = 0;
function resetBall() {
  ballX = canvasW / 2;
  ballY = canvasH / 2;
  if (Math.random() < 0.5) {
    ballVX = 4;
  } else {
    ballVX = -4;
  }
  ballVY = (Math.random() * 6 - 3);
  cpuMissFrames = 0;
  cpuTargetY = cpuY;
}
function setup() {
  createCanvas(canvasW, canvasH);
  playerY = canvasH / 2 - paddleH / 2;
  cpuY = canvasH / 2 - paddleH / 2;
  cpuTargetY = cpuY;
  textAlign(CENTER, TOP);
  textSize(32);
  resetBall();
}
function draw() {
  background(0);
  fill(255);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
  ellipse(ballX, ballY, ballR * 2, ballR * 2);
  text(leftScore, canvasW * 0.25, 10);
  text(rightScore, canvasW * 0.75, 10);
  if (keyIsDown(UP_ARROW)) {
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    playerY += playerSpeed;
  }
  playerY = constrain(playerY, 0, canvasH - paddleH);
  if (cpuMissFrames > 0) {
    cpuMissFrames -= 1;
  } else {
    if (ballVX > 0 && ballX > canvasW / 2 && Math.random() < 0.01) {
      cpuMissFrames = 30;
      cpuTargetY = Math.floor(Math.random() * (canvasH - paddleH));
    }
  }
  if (cpuMissFrames <= 0) {
    cpuTargetY = ballY - paddleH / 2;
  }
  cpuTargetY = constrain(cpuTargetY, 0, canvasH - paddleH);
  let cpuDy = cpuTargetY - cpuY;
  if (Math.abs(cpuDy) > cpuMaxSpeed) {
    cpuY += (cpuDy > 0 ? cpuMaxSpeed : -cpuMaxSpeed);
  } else {
    cpuY += cpuDy;
  }
  cpuY = constrain(cpuY, 0, canvasH - paddleH);
  ballX += ballVX;
  ballY += ballVY;
  if (ballY - ballR <= 0) {
    ballY = ballR;
    ballVY = -ballVY;
  }
  if (ballY + ballR >= canvasH) {
    ballY = canvasH - ballR;
    ballVY = -ballVY;
  }
  if (ballVX < 0 && ballX - ballR <= playerX + paddleW && ballX + ballR >= playerX) {
    if (ballY >= playerY && ballY <= playerY + paddleH) {
      ballX = playerX + paddleW + ballR;
      ballVX = Math.abs(ballVX);
      let relative = (ballY - (playerY + paddleH / 2)) / (paddleH / 2);
      ballVY = relative * 5;
    }
  }
  if (ballVX > 0 && ballX + ballR >= cpuX && ballX - ballR <= cpuX + paddleW) {
    if (ballY >= cpuY && ballY <= cpuY + paddleH) {
      ballX = cpuX - ballR;
      ballVX = -Math.abs(ballVX);
      let relative = (ballY - (cpuY + paddleH / 2)) / (paddleH / 2);
      ballVY = relative * 5;
    }
  }
  if (ballX + ballR < 0) {
    rightScore += 1;
    resetBall();
  }
  if (ballX - ballR > canvasW) {
    leftScore += 1;
    resetBall();
  }
}
