var playerX;
var playerY;
var enemies = [];
var bullets = [];

function setup() {
  createCanvas(800, 600);
  playerX = width / 2;
  playerY = height - 40;
  for (var i = 0; i < 10; i++) {
    enemies[i] = new Enemy(random(width), random(height / 2));
  }
}

function draw() {
  background(0);

  // Player
  fill(255);
  rect(playerX, playerY, 30, 30);

  // Player movement
  if (keyIsDown(LEFT_ARROW) && playerX > 0) {
    playerX -= 5;
  }
  if (keyIsDown(RIGHT_ARROW) && playerX < width - 30) {
    playerX += 5;
  }

  // Bullets
  for (var i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();
    if (bullets[i].hits(enemies)) {
      bullets[i].remove();
    }
    if (bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }

  // Enemies
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].show();
  }
}

function keyPressed() {
  if (keyCode === 32) {
    var bullet = new Bullet(playerX, playerY);
    bullets.push(bullet);
  }
}

function Bullet(x, y) {
  this.x = x;
  this.y = y;

  this.show = function() {
    fill(150);
    rect(this.x, this.y, 10, 20);
  }

  this.update = function() {
    this.y -= 5;
  }

  this.offscreen = function() {
    return (this.y < 0);
  }

  this.hits = function(enemies) {
    for (var i = 0; i < enemies.length; i++) {
      var d = dist(this.x, this.y, enemies[i].x, enemies[i].y);
      if (d < 30) {
        enemies.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}

function Enemy(x, y) {
  this.x = x;
  this.y = y;

  this.show = function() {
    fill(255, 0, 0);
    rect(this.x, this.y, 40, 40);
  }
}
