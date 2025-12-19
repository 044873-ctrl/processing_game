let playerX;
let playerY;
let playerRadius;
let playerSpeed;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
function setup(){
  createCanvas(400,600);
  playerRadius = 14;
  playerX = width/2;
  playerY = height - playerRadius - 10;
  playerSpeed = 5;
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  for(let i=0;i<30;i++){
    let sx = random(0,width);
    let sy = random(0,height);
    let sr = random(1,3);
    let sv = random(0.5,2);
    stars.push({x:sx,y:sy,r:sr,vy:sv});
  }
  textSize(18);
  textAlign(LEFT,TOP);
}
function draw(){
  background(0);
  fill(255);
  noStroke();
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    ellipse(s.x,s.y,s.r*2,s.r*2);
    s.y += s.vy;
    if(s.y > height + s.r){
      s.x = random(0,width);
      s.y = -s.r;
      s.vy = random(0.5,2);
      s.r = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      playerX -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      playerX += playerSpeed;
    }
    playerX = constrain(playerX, playerRadius, width - playerRadius);
    if(frameCount % 60 === 0){
      let er = 12;
      let ex = random(er, width - er);
      let ey = -er;
      let ev = 2;
      enemies.push({x:ex,y:ey,r:er,vy:ev});
    }
    for(let i=0;i<bullets.length;i++){
      let b = bullets[i];
      b.y -= b.vy;
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y - e.r > height){
        enemies.splice(i,1);
        continue;
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      for(let j=bullets.length-1;j>=0;j--){
        let e = enemies[i];
        let b = bullets[j];
        let dx = e.x - b.x;
        let dy = e.y - b.y;
        let rsum = e.r + b.r;
        if(dx*dx + dy*dy <= rsum*rsum){
          for(let k=0;k<5;k++){
            let angle = random(0,Math.PI*2);
            let speed = random(1,3);
            let vx = cos(angle)*speed;
            let vy = sin(angle)*speed;
            particles.push({x:e.x,y:e.y,r:3,life:20,vx:vx,vy:vy});
          }
          enemies.splice(i,1);
          bullets.splice(j,1);
          score += 1;
          break;
        }
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let dx = e.x - playerX;
      let dy = e.y - playerY;
      let rsum = e.r + playerRadius;
      if(dx*dx + dy*dy <= rsum*rsum){
        gameOver = true;
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      if(b.y + b.r < 0){
        bullets.splice(i,1);
      }
    }
  }
  fill(0,0,255);
  noStroke();
  ellipse(playerX,playerY,playerRadius*2,playerRadius*2);
  fill(255,0,0);
  noStroke();
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    ellipse(b.x,b.y,b.r*2,b.r*2);
  }
  fill(200,50,50);
  noStroke();
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    ellipse(e.x,e.y,e.r*2,e.r*2);
  }
  fill(255,200,0);
  noStroke();
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    ellipse(p.x,p.y,p.r*2,p.r*2);
  }
  fill(255);
  text("Score: "+score,8,8);
  if(gameOver){
    textAlign(CENTER,CENTER);
    textSize(36);
    fill(255,0,0);
    text("GAME OVER", width/2, height/2);
    textSize(18);
    textAlign(LEFT,TOP);
  }
}
function keyPressed(){
  if(!gameOver && keyCode === 32){
    let br = 4;
    let bx = playerX;
    let by = playerY - playerRadius - br;
    let bv = 8;
    bullets.push({x:bx,y:by,r:br,vy:bv});
  }
  if(gameOver && key === 'r'){
    resetGame();
  }
}
function resetGame(){
  playerX = width/2;
  playerY = height - playerRadius - 10;
  bullets = [];
  enemies = [];
  particles = [];
  score = 0;
  gameOver = false;
}
