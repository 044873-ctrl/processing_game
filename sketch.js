let cols = 20;
let rows = 20;
let cellSize = 20;
let snake = [];
let dirX = 1;
let dirY = 0;
let moveInterval = 10;
let moveCounter = 0;
let food = {x: 0, y: 0};
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  let centerX = floor(cols / 2);
  let centerY = floor(rows / 2);
  snake = [];
  snake.push({x: centerX - 2, y: centerY});
  snake.push({x: centerX - 1, y: centerY});
  snake.push({x: centerX, y: centerY});
  dirX = 1;
  dirY = 0;
  moveCounter = 0;
  score = 0;
  gameOver = false;
  spawnFood();
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
}
function draw() {
  background(30);
  fill(255);
  text("Score: " + score, 8, 4);
  for (let i = 0; i < snake.length; i++) {
    let seg = snake[i];
    fill(0, 200, 0);
    rect(seg.x * cellSize, seg.y * cellSize, cellSize, cellSize);
  }
  fill(200, 50, 50);
  rect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
  if (!gameOver) {
    moveCounter++;
    if (moveCounter >= moveInterval) {
      moveCounter = 0;
      let head = snake[snake.length - 1];
      let newX = head.x + dirX;
      let newY = head.y + dirY;
      if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
        gameOver = true;
      } else {
        let willGrow = (newX === food.x && newY === food.y);
        let collided = false;
        for (let i = 0; i < snake.length; i++) {
          if (i === 0 && !willGrow) {
            continue;
          }
          let seg = snake[i];
          if (seg.x === newX && seg.y === newY) {
            collided = true;
            break;
          }
        }
        if (collided) {
          gameOver = true;
        } else {
          snake.push({x: newX, y: newY});
          if (willGrow) {
            score++;
            spawnFood();
          } else {
            snake.shift();
          }
        }
      }
    }
  }
  if (gameOver) {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 16);
    textSize(18);
    text("Score: " + score, width / 2, height / 2 + 16);
    textAlign(LEFT, TOP);
    textSize(16);
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    if (!(dirX === 1 && dirY === 0)) {
      dirX = -1;
      dirY = 0;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!(dirX === -1 && dirY === 0)) {
      dirX = 1;
      dirY = 0;
    }
  } else if (keyCode === UP_ARROW) {
    if (!(dirX === 0 && dirY === 1)) {
      dirX = 0;
      dirY = -1;
    }
  } else if (keyCode === DOWN_ARROW) {
    if (!(dirX === 0 && dirY === -1)) {
      dirX = 0;
      dirY = 1;
    }
  }
}
function spawnFood() {
  let attempts = 0;
  while (true) {
    let fx = floor(random(cols));
    let fy = floor(random(rows));
    let occupied = false;
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === fx && snake[i].y === fy) {
        occupied = true;
        break;
      }
    }
    if (!occupied) {
      food.x = fx;
      food.y = fy;
      return;
    }
    attempts++;
    if (attempts > 1000) {
      let found = false;
      for (let y = 0; y < rows && !found; y++) {
        for (let x = 0; x < cols; x++) {
          let occ = false;
          for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === x && snake[i].y === y) {
              occ = true;
              break;
            }
          }
          if (!occ) {
            food.x = x;
            food.y = y;
            found = true;
            break;
          }
        }
      }
      if (!found) {
        food.x = 0;
        food.y = 0;
      }
      return;
    }
  }
}
