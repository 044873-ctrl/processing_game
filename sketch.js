let player;
let playerBullets = [];
let enemies = [];
let enemyBullets = [];
let enemyDir = 1;
let enemySpeed = 1;
let enemyDrop = 20;
let cols = 6;
let rows = 4;
let enemyRadius = 12;
let playerRadius = 12;
let playerSpeed = 5;
let bulletRadius = 4;
let bulletSpeed = 8;
let enemyBulletSpeed = 5;
let fireInterval = 60;
let fireTimer = 0;
let score = 0;
let gameState = 'playing';
function setup() {
  createCanvas(400, 600);
  resetGame();
  textAlign(LEFT, TOP);
  textSize(16);
}
function resetGame() {
  player = { x: width / 2, y: height - 30 };
  playerBullets = [];
  enemyBullets = [];
  enemies = [];
  enemyDir = 1;
  enemySpeed = 1;
  fireTimer = 0;
  score = 0;
  gameState = 'playing';
  let spacingX = 50;
  let totalWidth = (cols - 1) * spacingX;
  let startX = (width - totalWidth) / 2;
  let startY = 60;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let ex = startX + c * spacingX;
      let ey = startY + r * 40;
      enemies.push({ x: ex, y: ey });
    }
  }
}
function draw() {
  background(0);
  fill(255);
  text('Score: ' + score, 10, 10);
  if (gameState === 'playing') {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= playerSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += playerSpeed;
    }
    if (player.x < playerRadius) {
      player.x = playerRadius;
    }
    if (player.x > width - playerRadius) {
      player.x = width - playerRadius;
    }
    if (keyIsDown(32) && playerBullets.length === 0) {
      let pb = { x: player.x, y: player.y - playerRadius - bulletRadius - 1 };
      playerBullets.push(pb);
    }
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      let b = playerBullets[i];
      b.y -= bulletSpeed;
      if (b.y < -bulletRadius) {
        playerBullets.splice(i, 1);
        continue;
      }
      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        let e = enemies[j];
        let dx = b.x - e.x;
        let dy = b.y - e.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= bulletRadius + enemyRadius) {
          enemies.splice(j, 1);
          playerBullets.splice(i, 1);
          score += 100;
          hit = true;
          break;
        }
      }
      if (hit) {
        continue;
      }
    }
    fireTimer++;
    if (fireTimer >= fireInterval) {
      fireTimer = 0;
      if (enemies.length > 0) {
        let idx = Math.floor(Math.random() * enemies.length);
        let shooter = enemies[idx];
        let eb = { x: shooter.x, y: shooter.y + enemyRadius + bulletRadius + 1 };
        enemyBullets.push(eb);
      }
    }
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      let eb = enemyBullets[i];
      eb.y += enemyBulletSpeed;
      if (eb.y > height + bulletRadius) {
        enemyBullets.splice(i, 1);
        continue;
      }
      let dxp = eb.x - player.x;
      let dyp = eb.y - player.y;
      let distp = Math.sqrt(dxp * dxp + dyp * dyp);
      if (distp <= bulletRadius + playerRadius) {
        gameState = 'over';
      }
    }
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < enemies.length; i++) {
      let e = enemies[i];
      if (e.x < minX) {
        minX = e.x;
      }
      if (e.x > maxX) {
        maxX = e.x;
      }
    }
    if (enemies.length === 0) {
      gameState = 'clear';
    } else {
      if ((enemyDir > 0 && maxX + enemyRadius + enemySpeed > width) || (enemyDir < 0 && minX - enemyRadius - enemySpeed < 0)) {
        enemyDir *= -1;
        for (let i = 0; i < enemies.length; i++) {
          enemies[i].y += enemyDrop;
        }
      }
      for (let i = 0; i < enemies.length; i++) {
        enemies[i].x += enemyDir * enemySpeed;
      }
    }
  }
  fill(0, 0, 255);
  ellipse(player.x, player.y, playerRadius * 2, playerRadius * 2);
  fill(255, 255, 0);
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    ellipse(e.x, e.y, enemyRadius * 2, enemyRadius * 2);
  }
  fill(255);
  for (let i = 0; i < playerBullets.length; i++) {
    let b = playerBullets[i];
    ellipse(b.x, b.y, bulletRadius * 2, bulletRadius * 2);
  }
  fill(255, 0, 0);
  for (let i = 0; i < enemyBullets.length; i++) {
    let eb = enemyBullets[i];
    ellipse(eb.x, eb.y, bulletRadius * 2, bulletRadius * 2);
  }
  if (gameState === 'over') {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2 - 20);
    textSize(16);
    text('Press R to restart', width / 2, height / 2 + 20);
    textAlign(LEFT, TOP);
    textSize(16);
  }
  if (gameState === 'clear') {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('CLEAR!', width / 2, height / 2 - 20);
    textSize(16);
    text('Press R to restart', width / 2, height / 2 + 20);
    textAlign(LEFT, TOP);
    textSize(16);
  }
}
function keyPressed() {
  if ((key === 'r' || key === 'R') && gameState !== 'playing') {
    resetGame();
  }
}
