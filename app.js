const board = document.querySelector('.board');
const startBtn = document.querySelector('.btn-start');
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over")
const restartButton = document.querySelector(".btn-restart")

const finalScoreElement = document.querySelector("#final-score")

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

const blockHeight = 25;
const blockWidth = 25;

let highScore = localStorage.getItem("highScore") || 0
let score = 0
let time = `00:00`

let minutes = 0;
let seconds = 0;

highScoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;


const blocks =[];
let snake = [ {x: 1, y:3} ]
    
let direction ='down'

for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        const block = document.createElement('div');
        block.classList.add("block"); //css
        board.appendChild(block)
        blocks[`${i}-${j}`] = block;

    }
}
// generate Food 
function generateFood(){

    let newFood;
    do{
        newFood = {
            x:Math.floor(Math.random()*rows),
            y:Math.floor(Math.random()*cols)
        }
    }
    while(
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    )
    return newFood

}
let food = generateFood();
// Rendering
function render() {

    let head = null

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if(direction === "left"){
        head = {x:snake[0].x, y:snake[0].y-1}
    } else if(direction ==="right"){
        head = {x:snake[0].x, y:snake[0].y+1}
    } else if(direction === "up"){
        head = {x:snake[0].x-1, y:snake[0].y}
    } else if(direction == "down"){
        head = {x:snake[0].x+1, y:snake[0].y}
    }
    //wall collision
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        
        clearInterval(intervalId)
        clearInterval(timerIntervalId)
        intervalId = null;
        modal.style.display = "flex";
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"

        finalScoreElement.innerText = score

        isGameOver = true
        return
    }
    //Self Collision

    if(snake.some(segment => segment.x ===head.x && segment.y === head.y)){
        clearInterval(intervalId)
        clearInterval(timerIntervalId)
        intervalId = null;
        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"

        finalScoreElement.innerText = score

        isGameOver = true
        return
    }

    //Food Consume
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = generateFood();
        blocks[`${food.x}-${food.y}`].classList.add("food")
        
        snake.unshift(head)

        score += 10
        scoreElement.innerText = score
        if(score>highScore){
            highScore = score
            localStorage.setItem("highScore",highScore.toString())
        }

    }


    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
        blocks[`${segment.x}-${segment.y}`].classList.remove("head")
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach((segment,index) => {
        //console.log(blocks[`${segment.x}-${segment.y}`])'
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
        
        if(index===0){
            blocks[`${segment.x}-${segment.y}`].classList.add("head")
        }
    })
}
// Time 
function startTimer(){
    clearInterval(timerIntervalId)

    timerIntervalId = setInterval(() => {
        seconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        let minStr = minutes.toString().padStart(2, "0");
        let secStr = seconds.toString().padStart(2, "0");

        timeElement.innerText = `${minStr}:${secStr}`;
    }, 1000);
}

startBtn.addEventListener("click", ()=>{
    modal.style.display = "none"
    intervalId = setInterval(() => {
        render()
    }, 300)

    minutes = 0;
    seconds = 0;

    startTimer();

})
restartButton.addEventListener("click", restartGame)

function restartGame(){

    isGameOver = false;

    clearInterval(intervalId)
    clearInterval(timerIntervalId)

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
        blocks[`${segment.x}-${segment.y}`].classList.remove("head")
    })

    score = 0
    time = `00:00`
    minutes=0
    seconds=0

    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore


    modal.style.display = "none"
    direction = "down"
    snake = [{ x:1, y:3}]
    food = generateFood();

    intervalId = setInterval(() => {
        render()
    }, 300)

    startTimer()


}

// Key Press

addEventListener("keydown", (event) => {

    if(event.code === "Space"){
        //start Game
        if(intervalId === null && !isGameOver){
            startBtn.click();
            return;
        }
        if(isGameOver){
            restartGame();
            return;
        }
    }


    if(event.key === "ArrowRight" && direction !== "left"){
        direction = "right"
    }
    else if(event.key === "ArrowLeft" && direction !== "right"){
        direction = "left"
    }
    else if(event.key === "ArrowUp" && direction !== "down"){
        direction = "up"
    }
    else if(event.key === "ArrowDown" && direction !== "up"){
        direction = "down"
    }

       
})
