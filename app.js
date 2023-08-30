const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let unit = 20;
let row = canvas.height / unit;
let column = canvas.width / unit;

let snake = [];
function createSnake() {
    snake[0] = {
        x: 80,
        y: 0
    }
    snake[1] = {
        x: 60,
        y: 0
    }
    snake[2] = {
        x: 40,
        y: 0
    }
    snake[3] = {
        x: 20,
        y: 0
    }
}


class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }

    drawFruit() {
        ctx.fillStyle = "#FFCB1F";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    pickALocation() {
        let overlapping = false;
        let new_x;
        let new_y;

        function checkOverlap(new_x, new_y) {
            for (let i = 0; i < snake.length; i++) {
                if (new_x == snake[i].x && new_y == snake[i].y) {
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                }
            }
        }
        do {
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            //檢查有無重疊（吃到水果或是水果重生時座標正好與蛇重疊）
            checkOverlap(new_x, new_y);
        } while (overlapping)

        this.x = new_x;
        this.y = new_y;
    }
}

//初始設定
createSnake();
let myFruit = new Fruit();
let d = "Right";
window.addEventListener("keydown", changeDirection);
function changeDirection(e) {
    if (e.key == "ArrowRight" && d != "Left") {
        d = "Right"
    } else if (e.key == "ArrowLeft" && d != "Right") {
        d = "Left"
    } else if (e.key == "ArrowUp" && d != "Down") {
        d = "Up"
    } else if (e.key == "ArrowDown" && d != "Up") {
        d = "Down"
    }

    //在下一幀圖被畫出來前，先停止keydown事件
    window.removeEventListener("keydown", changeDirection);
}

let score = 0;
let highestScore;
loadHighestScore();
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;

function draw() {
    //確認蛇頭有沒有撞上蛇身
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            clearInterval(myGame);
            gameOver();
            return;
        }
    }

    // 每次畫蛇前，背景重置
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //畫水果
    myFruit.drawFruit();
    //畫蛇
    for (let i = 0; i < snake.length; i++) {
        if (i == 0) {
            ctx.fillStyle = "#F56960";//畫出物體的顏色(蛇頭)
        } else {
            ctx.fillStyle = "#FFCCC9";//畫出物體的顏色(蛇身)
        }
        ctx.strokeStyle = "#2F5560";//畫出物體的框的顏色

        //確認蛇頭有無在框外
        if (snake[0].x >= canvas.width) {
            snake[0].x = 0
        } else if (snake[0].x < 0) {
            snake[0].x = canvas.width - unit
        } else if (snake[0].y >= canvas.height) {
            snake[0].y = 0
        } else if (snake[0].y < 0) {
            snake[0].y = canvas.height - unit
        }
        //開始畫
        //x, y, width, height
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    let snakeX = snake[0].x; //右邊為primitive data type，因此修改snakeX，snake[0].x不會變動
    let snakeY = snake[0].y;
    if (d == "Left") {
        snakeX -= unit;
    } else if (d == "Right") {
        snakeX += unit;
    } else if (d == "Up") {
        snakeY -= unit;
    } else if (d == "Down") {
        snakeY += unit;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    //吃到水果
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
        myFruit.pickALocation();
        score++;
        changeSpeed();
        highlight();
        setHighestScore();
        document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
        document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
    } else {
        snake.pop();
    }

    snake.unshift(newHead);

    //若這邊才畫蛇，撞到時座標已經重疊但還是會畫出來，畫的順序從頭到尾，所以撞到自己時頭會被身體覆蓋導致看不見頭

    //重新開啟keydown事件
    window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
    if (localStorage.getItem("highestScore") == null) {
        highestScore = 0;
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}

function setHighestScore() {
    if (score > highestScore) {
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}

//隨積分改變速度
function changeSpeed() {
    if (score == 5) {
        clearInterval(myGame);
        myGame = setInterval(draw, 80);
    } else if (score == 10) {
        clearInterval(myGame);
        myGame = setInterval(draw, 60);
    } else if (score == 15) {
        clearInterval(myGame);
        myGame = setInterval(draw, 50);
    } else if (score == 20) {
        clearInterval(myGame);
        myGame = setInterval(draw, 40);
    } else if (score == 25) {
        clearInterval(myGame);
        myGame = setInterval(draw, 25);
    }
}

//隨積分顯示目前階段
function highlight() {
    if (score == 10) {
        document.getElementById("easy").classList.add("highlight");
    } else if (score == 16) {
        document.getElementById("easy").classList.toggle("highlight");
        document.getElementById("medium").classList.add("highlight");
    } else if (score == 21) {
        document.getElementById("medium").classList.toggle("highlight");
        document.getElementById("hard").classList.add("highlight");
    } else if (score == 26) {
        document.getElementById("hard").classList.toggle("highlight");
        document.getElementById("hell").innerHTML = "你太強了！";
        document.getElementById("hell").classList.add("highlight");
    }
}

//隨積分改變結束訊息
function gameOver() {
    if (score < 10) {
        alert("還可以更好")
    } else if( score >=10 && score <=15 ) {
        alert("很遺憾，到此為止了")
    } else if( score >=16 && score <=20 ) {
        alert("做得很好")
    } else if( score >=21 && score <=25 ) {
        alert("感謝大神的遊玩")
    } else if( score >25 ) {
        alert("太驚人了！")
    }
}