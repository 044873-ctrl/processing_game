let cols=10;
let rows=10;
let cellSize=40;
let minesCount=15;
let grid=[];
let gameOver=false;
let win=false;
let canvas;
function setup(){
  canvas=createCanvas(cols*cellSize,rows*cellSize);
  canvas.elt.oncontextmenu=function(){return false;};
  textAlign(CENTER,CENTER);
  textSize(18);
  setupGrid();
}
function setupGrid(){
  grid=[];
  gameOver=false;
  win=false;
  for(let i=0;i<cols;i++){
    grid[i]=[];
    for(let j=0;j<rows;j++){
      let cell=createCell(i,j);
      grid[i][j]=cell;
    }
  }
  placeMines();
  computeCounts();
}
function createCell(i,j){
  return {
    i:i,
    j:j,
    x:i*cellSize,
    y:j*cellSize,
    w:cellSize,
    isMine:false,
    state:'covered',
    count:0
  };
}
function placeMines(){
  let indices=[];
  for(let k=0;k<cols*rows;k++){
    indices.push(k);
  }
  for(let k=indices.length-1;k>0;k--){
    let r=floor(random(k+1));
    let tmp=indices[k];
    indices[k]=indices[r];
    indices[r]=tmp;
  }
  for(let m=0;m<minesCount;m++){
    let idx=indices[m];
    let i=floor(idx/rows);
    let j=idx%rows;
    if(i>=0 && i<cols && j>=0 && j<rows){
      grid[i][j].isMine=true;
    }
  }
}
function computeCounts(){
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      let c=0;
      for(let di=-1;di<=1;di++){
        for(let dj=-1;dj<=1;dj++){
          if(di===0 && dj===0)continue;
          let ni=i+di;
          let nj=j+dj;
          if(ni>=0 && ni<cols && nj>=0 && nj<rows){
            if(grid[ni][nj].isMine) c++;
          }
        }
      }
      grid[i][j].count=c;
    }
  }
}
function draw(){
  background(220);
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      drawCell(grid[i][j]);
    }
  }
  if(gameOver || win){
    fill(0,0,0,120);
    rect(0,0,width,height);
    fill(255);
    textSize(28);
    if(win){
      text("You Win",width/2,height/2);
    } else {
      text("Game Over",width/2,height/2);
    }
    textSize(14);
    text("Left click to restart",width/2,height/2+30);
  }
}
function drawCell(cell){
  stroke(0);
  if(cell.state==='covered'){
    fill(180);
    rect(cell.x,cell.y,cell.w,cell.w);
    if(cell.state==='covered' && cell.flagged){
    }
    if(cell.state==='covered' && cell.flagged){
    }
    if(cell.state==='covered' && cell.flagged){
    }
    if(cell.state==='covered' && isFlag(cell)){
    }
    if(cell.state==='covered' && hasFlag(cell)){
    }
    if(cell.state==='covered'){
    }
  } else if(cell.state==='open'){
    fill(240);
    rect(cell.x,cell.y,cell.w,cell.w);
    if(cell.isMine){
      fill(150,0,0);
      ellipse(cell.x+cell.w/2,cell.y+cell.w/2,cell.w*0.6,cell.w*0.6);
    } else if(cell.count>0){
      fill(0);
      textSize(18);
      text(cell.count,cell.x+cell.w/2,cell.y+cell.w/2);
    }
  }
  if(cell.state==='covered' && cell.flagged){
    fill(255,0,0);
    triangle(cell.x+cell.w*0.2,cell.y+cell.w*0.8,cell.x+cell.w*0.2,cell.y+cell.w*0.2,cell.x+cell.w*0.7,cell.y+cell.w*0.5);
    stroke(0);
    line(cell.x+cell.w*0.2,cell.y+cell.w*0.9,cell.x+cell.w*0.2,cell.y+cell.w*0.1);
  }
  if(gameOver && cell.isMine && cell.state!=='open'){
    noFill();
    stroke(0);
    rect(cell.x,cell.y,cell.w,cell.w);
    fill(255,0,0,180);
    rect(cell.x,cell.y,cell.w,cell.w);
    fill(0);
    ellipse(cell.x+cell.w/2,cell.y+cell.w/2,cell.w*0.5,cell.w*0.5);
  }
}
function isFlag(cell){
  return cell.flagged===true;
}
function hasFlag(cell){
  return cell.flagged===true;
}
function mousePressed(){
  if(gameOver || win){
    if(mouseButton===LEFT){
      setupGrid();
    }
    return;
  }
  let i=floor(mouseX/cellSize);
  let j=floor(mouseY/cellSize);
  if(i<0 || i>=cols || j<0 || j>=rows) return;
  let cell=grid[i][j];
  if(mouseButton===RIGHT){
    if(cell.state==='covered'){
      cell.flagged=!cell.flagged;
    }
    return;
  }
  if(mouseButton===LEFT){
    if(cell.state==='covered' && !cell.flagged){
      if(cell.isMine){
        revealMines();
        gameOver=true;
        return;
      } else {
        openCell(i,j);
        checkWin();
      }
    }
  }
}
function revealMines(){
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      if(grid[i][j].isMine){
        grid[i][j].state='open';
      }
    }
  }
}
function openCell(si,sj){
  let stack=[];
  if(grid[si][sj].state!=='covered') return;
  grid[si][sj].state='open';
  if(grid[si][sj].count===0){
    stack.push({i:si,j:sj});
  }
  while(stack.length>0){
    let pos=stack.pop();
    for(let di=-1;di<=1;di++){
      for(let dj=-1;dj<=1;dj++){
        let ni=pos.i+di;
        let nj=pos.j+dj;
        if(ni>=0 && ni<cols && nj>=0 && nj<rows){
          let nc=grid[ni][nj];
          if(nc.state==='covered' && !nc.flagged){
            nc.state='open';
            if(nc.count===0 && !nc.isMine){
              stack.push({i:ni,j:nj});
            }
          }
        }
      }
    }
  }
}
function checkWin(){
  let opened=0;
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      if(grid[i][j].state==='open' && !grid[i][j].isMine) opened++;
    }
  }
  if(opened===cols*rows-minesCount){
    win=true;
    revealMines();
  }
}
