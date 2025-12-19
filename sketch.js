let player;
let bullets = [];
let enemies = [];
let explosions = [];
let stars = [];
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  for (let i = 0; i < 200; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  background(0);

  stars.forEach(star => {
    star.show();
    star.update();
  });

  if (!gameOver) {
    player.show();

    if (keyIsDown(LEFT_ARROW)) {
      player.move(-5);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      player.move(5);
    }

    bullets.forEach(bullet => {
      bullet.show();
      bullet.update();

      enemies.forEach(enemy => {
        if (bullet.hits(enemy)) {
          score++;
          bullets.splice(bullets.indexOf(bullet), 1);
          enemies.splice(enemies.indexOf(enemy), 1);
          explosions.push(new Explosion(enemy.x, enemy.y));
        }
      });
    });

    enemies.forEach(enemy => {
      enemy.show();
      enemy.update();

      if (enemy.y > height) {
        gameOver = true;
      }
    });

    explosions.forEach(explosion => {
      explosion.show();
      explosion.update();
    });

    if (random() < 0.01) {
      enemies.push(new Enemy());
    }
  } else {
    fill(255);
    textSize(32);
    text('Game Over', width / 2, height / 2);
    text('Score: ' + score, width / 2, height / 2 + 50);
  }
}

function keyPressed() {
  if (keyCode === 32) {
    bullets.push(new Bullet(player.x, height));
  }
}
