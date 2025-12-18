let player;
let bullets = [];
let enemies = [];

function setup() {
  createCanvas(400, 600);
  player = new Player();
}

function draw() {
  background(0);
  
  player.show();
  player.move();

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(enemies[j])) {
        enemies[j].destroy();
        enemies.splice(j, 1);
        bullets[i].evaporate();
        bullets.splice(i, 1);
        break;
      }
    }
  }

  if (random(1) < 0.01) {
    enemies.push(new Enemy());
  }

  for (let e of enemies) {
    e.show();
    e.move();
  }
}

function keyPressed() {
  if (key === ' ') {
    let bullet = new Bullet(player.x, height);
    bullets.push(bullet);
  }
  if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  }
}

function keyReleased() {
  if (key !== ' ') {
    player.setDir(0);
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.xdir = 0;
  }

  setDir(dir) {
    this.xdir = dir;
  }

  move() {
    this.x += this.xdir*5;
  }

  show() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, height-20, 20, 60);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(50, 0, 200);
    ellipse(this.x, this.y, 16, 16);
  }

  move() {
    this.y = this.y - 5;
  }

  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < 16;
  }
  
  evaporate() {
    this.toDelete = true;
  }
}

class Enemy {
  constructor() {
    this.x = random(width);
    this.y = 0;
  }

  move() {
    this.y = this.y + 2;
  }

  show() {
    fill(255, 0, 200);
    ellipse(this.x, this.y, 24, 24);
  }

  destroy() {
    this.toDelete = true;
  }
}
