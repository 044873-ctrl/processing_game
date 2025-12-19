let player;
let playerSpeed;
let playerRadius;
let playerBullets;
let enemyRows;
let enemyCols;
let enemies;
let enemyRadius;
let enemyVX;
let enemyMoveDown;
let enemyFireInterval;
let enemyFireCounter;
let enemyBullets;
let enemyBulletRadius;
let enemyBulletSpeed;
let score;
let gameState;
let leftPressed;
let rightPressed;
let spacePressed;
function setup(){
  createCanvas(400,600);
  playerRadius = 16;
  player = {x: width/2, y: height - 40, r: playerRadius};
  playerSpeed = 5;
  playerBullets = [];
  enemyRows = 4;
  enemyCols = 6;
  enemies = [];
  enemyRadius = 12;
  let marginLeft = 40;
  let marginTop = 60;
  let spacingX = (width - marginLeft*2) / (enemyCols - 1);
  let spacingY = 40;
  for(let row=0; row<enemyRows; row++){
    for(let col=0; col<enemyCols; col++){
      let ex = marginLeft + col * spacingX;
      let ey = marginTop + row * spacingY;
      enemies.push({x: ex, y: ey, r: enemyRadius, alive: true});
    }
  }
  enemyVX = 1.2;
  enemyMoveDown = 18;
  enemyFireInterval = 60;
  enemyFireCounter = 0;
  enemyBullets = [];
  enemyBulletRadius = 4;
  enemyBulletSpeed = 5;
  score = 0;
  gameState = 'playing';
  leftPressed = false;
  rightPressed = false;
  spacePressed = false;
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw(){
  background(0);
  fill(255);
  if(gameState === 'playing'){
    if(leftPressed && !rightPressed){
      player.x -= playerSpeed;
    } else if(rightPressed && !leftPressed){
      player.x += playerSpeed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    for(let i = playerBullets.length - 1; i >= 0; i--){
      let b = playerBullets[i];
      b.y += b.vy;
      if(b.y + b.r < 0){
        playerBullets.splice(i,1);
        continue;
      }
      for(let j = 0; j < enemies.length; j++){
        let e = enemies[j];
        if(e.alive){
          let d = dist(b.x, b.y, e.x, e.y);
          if(d <= b.r + e.r){
            e.alive = false;
            playerBullets.splice(i,1);
            score += 100;
            break;
          }
        }
      }
    }
    let minX = width;
    let maxX = 0;
    let anyAlive = false;
    for(let i = 0; i < enemies.length; i++){
      if(enemies[i].alive){
        anyAlive = true;
        if(enemies[i].x < minX) minX = enemies[i].x;
        if(enemies[i].x > maxX) maxX = enemies[i].x;
      }
    }
    if(!anyAlive){
      gameState = 'clear';
    } else {
      if(minX - enemyRadius <= 0 || maxX + enemyRadius >= width){
        enemyVX = -enemyVX;
        for(let i = 0; i < enemies.length; i++){
          enemies[i].y += enemyMoveDown;
        }
      } else {
        for(let i = 0; i < enemies.length; i++){
          enemies[i].x += enemyVX;
        }
      }
    }
    enemyFireCounter++;
    if(enemyFireCounter >= enemyFireInterval && anyAlive){
      let aliveIndices = [];
      for(let i = 0; i < enemies.length; i++){
        if(enemies[i].alive) aliveIndices.push(i);
      }
      if(aliveIndices.length > 0){
        let idx = aliveIndices[floor(random(aliveIndices.length))];
        let shooter = enemies[idx];
        enemyBullets.push({x: shooter.x, y: shooter.y + shooter.r + enemyBulletRadius + 1, r: enemyBulletRadius, vy: enemyBulletSpeed});
      }
      enemyFireCounter = 0;
    }
    for(let i = enemyBullets.length - 1; i >= 0; i--){
      let eb = enemyBullets[i];
      eb.y += eb.vy;
      if(eb.y - eb.r > height){
        enemyBullets.splice(i,1);
        continue;
      }
      let d = dist(eb.x, eb.y, player.x, player.y);
      if(d <= eb.r + player.r){
        gameState = 'gameover';
        enemyBullets.splice(i,1);
        break;
      }
    }
    if(spacePressed){
      if(playerBullets.length === 0){
        playerBullets.push({x: player.x, y: player.y - player.r - 4, r:4, vy: -8});
      }
      spacePressed = false;
    }
  }
  fill(0,0,255);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  fill(255,255,0);
  for(let i = 0; i < playerBullets.length; i++){
    let b = playerBullets[i];
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  fill(255,0,0);
  for(let i = 0; i < enemies.length; i++){
    let e = enemies[i];
    if(e.alive){
      ellipse(e.x, e.y, e.r*2, e.r*2);
    }
  }
  fill(255,150,0);
  for(let i = 0; i < enemyBullets.length; i++){
    let eb = enemyBullets[i];
    ellipse(eb.x, eb.y, eb.r*2, eb.r*2);
  }
  fill(255);
  text("Score: " + score, 8, 8);
  if(gameState === 'gameover'){
    textAlign(CENTER, CENTER);
    textSize(32);
    text("GAME OVER", width/2, height/2);
    textSize(16);
    textAlign(LEFT, TOP);
  } else if(gameState === 'clear'){
    textAlign(CENTER, CENTER);
    textSize(32);
    text("CLEAR!", width/2, height/2);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function keyPressed(){
  if(keyCode === LEFT_ARROW){
    leftPressed = true;
  } else if(keyCode === RIGHT_ARROW){
    rightPressed = true;
  } else if(key === ' '){
    spacePressed = true;
  }
}
function keyReleased(){
  if(keyCode === LEFT_ARROW){
    leftPressed = false;
  } else if(keyCode === RIGHT_ARROW){
    rightPressed = false;
  } else if(key === ' '){
    spacePressed = false;
  }
}
