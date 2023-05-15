const snakeSpeed=5;
let lastRenderTime=0;
let gameOver=false
let inputDirection={x:0,y:0}
let lastInputDirection={x:0,y:0}
const snakeBody=[
    {x:11,y:11} 
]
const GRID_SIZE=21;
let foodBody=getRandomFoodPosition();
const expansionRate=1;
let newSegments=0;
const gameBoard=document.getElementById('gameboard')
function main(currentTime){
  if(gameOver){
    if(confirm('You Lost!, Press ok to Restart')){
        window.location='/'
    }
    return
  }
  window.requestAnimationFrame(main)
  const secondsSinceLastRedner= (currentTime-lastRenderTime)/1000
  if(secondsSinceLastRedner < 1/snakeSpeed)return
  lastRenderTime=currentTime
  updateSnake();
  updateFood();
  checkDeath();
  gameBoard.innerHTML=''
  drawSnake(gameBoard);
  drawFood(gameBoard);
}
window.requestAnimationFrame(main)
function updateSnake(){
   addSegments();
   const inputDirection=getInputDirection()
   for(let i=snakeBody.length-2 ; i>=0 ; i--){
      snakeBody[i+1]={...snakeBody[i]}
   }
   snakeBody[0].x+=inputDirection.x;
   snakeBody[0].y+=inputDirection.y;
}
function drawSnake(gameBoard){
    snakeBody.forEach(segment=>{
           const snakeElement=document.createElement('div')
           snakeElement.style.gridRowStart=segment.y
           snakeElement.style.gridColumnStart=segment.x
           snakeElement.classList.add('snake')
           gameBoard.appendChild(snakeElement)  
    })  
} 
function getInputDirection(){
    lastInputDirection=inputDirection
    return inputDirection
}
window.addEventListener('keydown',e=>{
    switch (e.key){
        case 'ArrowUp':
           if (lastInputDirection.y !== 0) break
           inputDirection={x:0,y:-1}
           break;
         case 'ArrowDown':
            if(lastInputDirection.y !== 0) break
           inputDirection={x:0,y:1}
           break;
        case 'ArrowLeft':
        if(lastInputDirection.x !== 0) break
           inputDirection={x:-1,y:0}
           break;
        case 'ArrowRight':
            if(lastInputDirection.x !== 0) break
           inputDirection={x:1,y:0}
           break;
    }
})
function drawFood(gameBoard){
        const  foodElement=document.createElement('div')
        foodElement.style.gridRowStart=foodBody.y
        foodElement.style.gridColumnStart=foodBody.x
        foodElement.classList.add('food')
        gameBoard.appendChild(foodElement)
}

function updateFood(){
    if(onSnake(foodBody)){
        expandSnake(expansionRate);
        foodBody=getRandomFoodPosition(); 
    }
}
function expandSnake(amount){
    newSegments+=amount  
}
function onSnake(position,{ignoreHead=false}={}){
    return snakeBody.some((segment,index)=>{
        if(ignoreHead && index === 0) return false
        return equalPositions(segment,position)
    })
}
function equalPositions(pos1,pos2){
    return pos1.x===pos2.x && pos1.y===pos2.y;  
}
function addSegments(){
    for(let i=0;i<newSegments;i++){
        snakeBody.push({...snakeBody[snakeBody.length-1]})
    }
    newSegments=0;
}

function getRandomFoodPosition(){
    let newFoodPosition
    while(newFoodPosition==null || onSnake(newFoodPosition)){
         newFoodPosition=randomGridPosition()
    }
    return newFoodPosition
}

function randomGridPosition(){
    return{
        x:Math.floor(Math.random()*GRID_SIZE)+1,
        y:Math.floor(Math.random()*GRID_SIZE)+1
    }
}

function checkDeath(){
    gameOver= outSideGrid(snakeHead()) || snakeIntersection();
}

function snakeHead(){
    return snakeBody[0];
}

function outSideGrid(position){
    return(
       position.x < 1 || position.x > GRID_SIZE ||
       position.y <1 || position.y > GRID_SIZE
    )
}

function snakeIntersection(){
    return onSnake(snakeBody[0],{ignoreHead:true})
}




