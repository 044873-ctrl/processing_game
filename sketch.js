let player;
let enemies = [];
let bullets = [];
let stars = [];
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(width / 2, height - 50);
  for (let i = 0; i < 100; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  background(0);

  stars.forEach(star => {
    star.move();
    star.show();
  });

  if (!gameOver) {
    player.show();
    if (keyIsDown(LEFT_ARROW)) {
      player.move(-5);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.move(5);
    }

    if (random() < 0.01) {
      enemies.push(new Enemy(random(width), -20));
    }

    for (let bullet of bullets) {
      bullet.move();
      bullet.show();
      if (bullet.offscreen()) {
        bullets.splice(bullets.indexOf(bullet), 1);
      } else {
        for (let enemy of enemies) {
          if (bullet.hits(enemy)) {
            score += 10;
            bullets.splice(bullets.indexOf(bullet), 1);
            enemies.splice(enemies.indexOf(enemy), 1);
            break;
          }
        }
      }
    }

    for (let enemy of enemies) {
      enemy.move();
      enemy.show();
      if (enemy.hits(player) || enemy.offscreen()) {
        gameOver = true;
      }
    }

    textSize(32);
    fill(255);
    text("Score: " + score, 10, 50);
  } else {
    textSize(64);
    fill(255);
    text("Game Over", width / 2 - 100, height / 2);
    noLoop();
  }
}

function keyPressed() {
  if (key === ' ') {
    bullets.push(new Bullet(player.x, height - 60));
  }
}
