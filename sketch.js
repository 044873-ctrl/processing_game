let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
const CANVAS_W = 400;
const CANVAS_H = 600;
function createStars() {
  for (let i = 0; i < 30; i++) {
    let s = {
      x: Math.floor(Math.random() * CANVAS_W),
      y: Math.floor(Math.random() * CANVAS_H),
      size: Math.floor(Math.random() * 3) + 1,
      speed: Math.random() * 1 + 0.5
    };
    stars.push(s);
  }
}
function spawnEnemy() {
  let e = {
    x: Math.random() * (CANVAS_W - 24) + 12,
    y: -12,
    r: 12,
    speed: 2
  };
  enemies.push(e);
}
function createPlayer() {
  player = {
    x: CANVAS_W / 2,
    y: CANVAS_H - 40,
    r: 14,
    speed: 5
  };
}
function fireBullet() {
  if (gameOver === true) {
    return;
  }
  let b = {
    x: player.x,
    y: player.y - player.r - 4,
    r: 4,
    speed: 8
  };
  bullets.push(b);
}
function createParticles(px, py) {
  for (let i = 0; i < 5; i++) {
    let p = {
      x: px,
      y: py,
      r: 3,
      life: 20,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    };
    particles.push(p);
  }
}
function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  createPlayer();
  createStars();
  score = 0;
  gameOver = false;
}
function updateStars() {
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    s.y += s.speed;
    if (s.y > CANVAS_H) {
      s.y = 0;
      s.x = Math.floor(Math.random() * CANVAS_W);
    }
  }
}
function updatePlayer() {
  if (gameOver === true) {
    return;
  }
  if (keyIsDown(LEFT_ARROW) === true) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) === true) {
    player.x += player.speed;
  }
  if (player.x < player.r) {
    player.x = player.r;
  }
  if (player.x > CANVAS_W - player.r) {
    player.x = CANVAS_W - player.r;
  }
}
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y -= b.speed;
    if (b.y < -b.r) {
      bullets.splice(i, 1);
    }
  }
}
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    if (gameOver === false) {
      e.y += e.speed;
    }
    if (e.y > CANVAS_H + e.r) {
      enemies.splice(i, 1);
    }
  }
}
function handleCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      let d = dist(e.x, e.y, b.x, b.y);
      if (d <= e.r + b.r) {
        createParticles(e.x, e.y);
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
  if (gameOver === false) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      let d2 = dist(e.x, e.y, player.x, player.y);
      if (d2 <= e.r + player.r) {
        gameOver = true;
      }
    }
  }
}
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}
function drawStars() {
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    fill(200);
    circle(s.x, s.y, s.size);
  }
}
function drawPlayer() {
  fill(50, 200, 250);
  noStroke();
  triangle(player.x, player.y - player.r, player.x - player.r, player.y + player.r, player.x + player.r, player.y + player.r);
}
function drawBullets() {
  fill(255, 240, 100);
  noStroke();
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    circle(b.x, b.y, b.r * 2);
  }
}
function drawEnemies() {
  fill(250, 80, 80);
  noStroke();
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    circle(e.x, e.y, e.r * 2);
  }
}
function drawParticles() {
  noStroke();
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let alpha = Math.floor(255 * (p.life / 20));
    fill(255, 180, 50, alpha);
    circle(p.x, p.y, p.r * 2);
  }
}
function drawUI() {
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("SCORE: " + score, 8, 8);
  if (gameOver === true) {
    textSize(36);
    textAlign(CENTER, CENTER);
    text("GAME OVER", CANVAS_W / 2, CANVAS_H / 2);
  }
}
function draw() {
  background(0);
  updateStars();
  drawStars();
  if (frameCount % 60 === 0 && gameOver === false) {
    spawnEnemy();
  }
  updatePlayer();
  updateBullets();
  updateEnemies();
  handleCollisions();
  updateParticles();
  drawBullets();
  drawEnemies();
  drawParticles();
  drawPlayer();
  drawUI();
}
function keyPressed() {
  if (keyCode === 32) {
    fireBullet();
  }
}
