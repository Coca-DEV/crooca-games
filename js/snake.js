const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

let snake = [
    { x: 10, y: 10 }
];

let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

let dx = 0;
let dy = 0;
let gameRunning = true;

document.addEventListener('keydown', changeDirection);
document.getElementById('restartButton').addEventListener('click', () => {
    resetGame();
    gameLoop(); // Restart the game loop
});
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

function changeDirection(event) {
    const keyPressed = event.keyCode;

    if (keyPressed === 37 && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === 38 && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === 39 && dx === 0) {
        dx = 1;
        dy = 0;
    } else if (keyPressed === 40 && dy === 0) {
        dx = 0;
        dy = 1;
    }
}

function gameLoop() {
    if (!gameRunning) return;

    moveSnake();
    if (checkCollision()) {
        gameRunning = false;
        alert("Game Over!");
        return;
    }

    clearCanvas();
    drawFood();
    drawSnake();
    updateScore();

    setTimeout(gameLoop, 100);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

function resetGame() {
    score = 0;
    dx = 0;
    dy = 0;
    snake = [{ x: 10, y: 10 }];
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    gameRunning = true;
}

gameLoop();
