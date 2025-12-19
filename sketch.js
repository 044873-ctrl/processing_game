let canvasW = 400;
let canvasH = 600;
let paddle = {
  w: 90,
  h: 12,
  x: 200,
  y: 560
};
let ball = {
  x: 200,
  y: 520,
  r: 6,
  vx: 4,
  vy: -5
};
let blocks = [];
let rows = 6;
let cols = 7;
let blockPadding = 6;
let blockTop = 60;
let particles = [];
let score = 0;
let gameOver = false;
let rowColors = [
  [200, 30, 30],
  [230, 110, 20],
  [240, 200, 20],
  [60, 160, 60],
  [50, 130, 200],
  [150, 80, 190]
];

function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
  let closestX = cx;
  if (cx < rx) {
    closestX = rx;
  } else if (cx > rx + rw) {
    closestX = rx + rw;
  }
  let closestY = cy;
  if (cy < ry) {
    closestY = ry;
  } else if (cy > ry + rh) {
    closestY = ry + rh;
  }
  let dx = cx - closestX;
  let dy = cy - closestY;
  return dx * dx + dy * dy <= cr * cr;
}

function initBlocks() {
  blocks = [];
  let totalPaddingX = (cols + 1) * blockPadding;
  let blockW = (canvasW - totalPaddingX) / cols;
  let blockH = 20;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = blockPadding + c * (blockW + blockPadding);
      let by = blockTop + r * (blockH + blockPadding);
      let colorArr = rowColors[r % rowColors.length];
      let block = {
        x: bx,
        y: by,
        w: blockW,
        h: blockH,
        color: colorArr
      };
      blocks.push(block);
    }
  }
}

function spawnParticles(px, py) {
  for (let i = 0; i < 3; i++) {
    let vx = random(-2, 2);
    let vy = random(-3, 1);
    let p = {
      x: px,
      y: py,
      vx: vx,
      vy: vy,
      life: 15,
      size: random(3, 6)
    };
    particles.push(p);
  }
}

function setup() {
  createCanvas(canvasW, canvasH);
  rectMode(CORNER);
  textAlign(LEFT, TOP);
  textSize(18);
  initBlocks();
}

function draw() {
  background(30);
  fill(255);
  text('Score: ' + score, 10, 10);
  for (let i = blocks.length - 1; i >= 0; i--) {
    let b = blocks[i];
    fill(b.color[0], b.color[1], b.color[2]);
    rect(b.x, b.y, b.w, b.h);
  }
  paddle.x = constrain(mouseX, paddle.w / 2, width - paddle.w / 2);
  let paddleDrawX = paddle.x - paddle.w / 2;
  let paddleDrawY = paddle.y - paddle.h / 2;
  fill(200);
  rect(paddleDrawX, paddleDrawY, paddle.w, paddle.h, 4);
  if (!gameOver) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx = -ball.vx;
    } else if (ball.x + ball.r > width) {
      ball.x = width - ball.r;
      ball.vx = -ball.vx;
    }
    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy = -ball.vy;
    }
    if (ball.y - ball.r > height) {
      gameOver = true;
    }
    let paddleRectX = paddle.x - paddle.w / 2;
    let paddleRectY = paddle.y - paddle.h / 2;
    if (ball.vy > 0 && circleRectCollision(ball.x, ball.y, ball.r, paddleRectX, paddleRectY, paddle.w, paddle.h)) {
      let relative = (ball.x - paddle.x) / (paddle.w / 2);
      if (relative < -1) {
        relative = -1;
      } else if (relative > 1) {
        relative = 1;
      }
      let maxAngle = PI / 3;
      let angle = relative * maxAngle;
      let speed = sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = speed * sin(angle);
      ball.vy = -abs(speed * cos(angle));
      ball.y = paddleRectY - ball.r - 0.1;
    }
    for (let i = blocks.length - 1; i >= 0; i--) {
      let b = blocks[i];
      if (circleRectCollision(ball.x, ball.y, ball.r, b.x, b.y, b.w, b.h)) {
        blocks.splice(i, 1);
        score += 10;
        spawnParticles(ball.x, ball.y);
        ball.vy = -ball.vy;
        break;
      }
    }
  }
  fill(255, 200, 0);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= 1;
    let alpha = map(p.life, 0, 15, 0, 255);
    if (alpha < 0) {
      alpha = 0;
    }
    fill(255, 220, 100, alpha);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  if (gameOver) {
    fill(255, 200, 200);
    textSize(36);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2 - 20);
    textSize(18);
    text('Final Score: ' + score, width / 2, height / 2 + 20);
  }
}
