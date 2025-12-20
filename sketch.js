let cols=10;
let rows=20;
let cellSize=30;
let shapes=[];
let colors=[];
function createEmptyGrid(){
  let g=[];
  for(let r=0;r<rows;r++){
    let row=[];
    for(let c=0;c<cols;c++){
      row.push(0);
    }
    g.push(row);
  }
  return g;
}
function cloneMatrix(m){
  let out=[];
  for(let r=0;r<m.length;r++){
    let row=[];
    for(let c=0;c<m[r].length;c++){
      row.push(m[r][c]);
    }
    out.push(row);
  }
  return out;
}
function rotateMatrix(m){
  let size=4;
  let out=[];
  for(let r=0;r<size;r++){
    out[r]=[];
    for(let c=0;c<size;c++){
      out[r][c]=0;
    }
  }
  for(let r=0;r<size;r++){
    for(let c=0;c<size;c++){
      out[c][size-1-r]=m[r][c];
    }
  }
  return out;
}
function canPlace(shape, px, py, gridRef){
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(shape[r][c]){
        let gx=px+c;
        let gy=py+r;
        if(gx<0||gx>=cols) return false;
        if(gy>=rows) return false;
        if(gy>=0){
          if(gridRef[gy][gx]!==0) return false;
        }
      }
    }
  }
  return true;
}
function lockPiece(piece){
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(piece.shape[r][c]){
        let gx=piece.x+c;
        let gy=piece.y+r;
        if(gy>=0&&gy<rows&&gx>=0&&gx<cols){
          grid[gy][gx]=piece.colorIndex;
        }
      }
    }
  }
}
function clearLines(){
  let newGrid=[];
  let cleared=0;
  for(let r=0;r<rows;r++){
    let full=true;
    for(let c=0;c<cols;c++){
      if(grid[r][c]===0){
        full=false;
        break;
      }
    }
    if(!full){
      newGrid.push(grid[r].slice());
    }else{
      cleared++;
    }
  }
  while(newGrid.length<rows){
    let emptyRow=[];
    for(let c=0;c<cols;c++) emptyRow.push(0);
    newGrid.unshift(emptyRow);
  }
  grid=newGrid;
  return cleared;
}
function spawnPiece(){
  let idx=floor(random(shapes.length));
  let sh=cloneMatrix(shapes[idx]);
  let p={};
  p.shape=sh;
  p.x=floor(cols/2)-2;
  p.y=0;
  p.colorIndex=idx+1;
  currentPiece=p;
  if(!canPlace(currentPiece.shape,currentPiece.x,currentPiece.y,grid)){
    gameOver=true;
  }
}
let grid=createEmptyGrid();
let currentPiece=null;
let gameOver=false;
let score=0;
let frameCounter=0;
let baseDrop=30;
function setup(){
  createCanvas(cols*cellSize,rows*cellSize);
  shapes=[
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ]
  ];
  colors=[
    [0,255,255],
    [255,255,0],
    [160,32,240],
    [255,165,0],
    [0,0,255],
    [0,255,0],
    [255,0,0]
  ];
  grid=createEmptyGrid();
  spawnPiece();
  textSize(16);
  noStroke();
}
function moveDown(){
  if(canPlace(currentPiece.shape,currentPiece.x,currentPiece.y+1,grid)){
    currentPiece.y++;
  }else{
    lockPiece(currentPiece);
    let cleared=clearLines();
    if(cleared>0){
      score+=cleared*100;
    }
    spawnPiece();
  }
}
function draw(){
  background(30);
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      let v=grid[r][c];
      if(v!==0){
        let col=colors[v-1];
        fill(col[0],col[1],col[2]);
        rect(c*cellSize,r*cellSize,cellSize,cellSize);
      }else{
        fill(20);
        rect(c*cellSize,r*cellSize,cellSize,cellSize);
      }
    }
  }
  if(currentPiece!==null){
    for(let r=0;r<4;r++){
      for(let c=0;c<4;c++){
        if(currentPiece.shape[r][c]){
          let gx=currentPiece.x+c;
          let gy=currentPiece.y+r;
          if(gy>=0){
            let col=colors[currentPiece.colorIndex-1];
            fill(col[0],col[1],col[2]);
            rect(gx*cellSize,gy*cellSize,cellSize,cellSize);
          }
        }
      }
    }
  }
  fill(255);
  text("Score: "+score,8,18);
  if(gameOver){
    fill(0,0,0,180);
    rect(0,height/2-40,width,80);
    fill(255);
    textSize(24);
    text("GAME OVER",width/2-70,height/2+8);
    noLoop();
    return;
  }
  frameCounter++;
  let curDrop=(keyIsDown(DOWN_ARROW)?2:baseDrop);
  if(frameCounter>=curDrop){
    frameCounter=0;
    if(currentPiece!==null) moveDown();
  }
}
function keyPressed(){
  if(gameOver) return;
  if(currentPiece===null) return;
  if(keyCode===LEFT_ARROW){
    if(canPlace(currentPiece.shape,currentPiece.x-1,currentPiece.y,grid)){
      currentPiece.x--;
    }
  }else if(keyCode===RIGHT_ARROW){
    if(canPlace(currentPiece.shape,currentPiece.x+1,currentPiece.y,grid)){
      currentPiece.x++;
    }
  }else if(keyCode===UP_ARROW){
    let rotated=rotateMatrix(currentPiece.shape);
    if(canPlace(rotated,currentPiece.x,currentPiece.y,grid)){
      currentPiece.shape=rotated;
    }
  }else if(keyCode===DOWN_ARROW){
    if(canPlace(currentPiece.shape,currentPiece.x,currentPiece.y+1,grid)){
      currentPiece.y++;
      frameCounter=0;
    }else{
      moveDown();
      frameCounter=0;
    }
  }
}
