const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

let pacman = { x: 1, y: 1 };
let dx = 1;
let dy = 0;
let gameRunning = true;

const food = [];
for (let i = 0; i < 10; i++) {
    food.push({
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    });
}

document.addEventListener('keydown', changeDirection);
document.getElementById('restartButton').addEventListener('click', () => {
    resetGame();
    gameLoop();
});
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

function changeDirection(event) {
    const keyPressed = event.keyCode;

    if (keyPressed === 37 && dx === 0) { // Left arrow
        dx = -1;
        dy = 0;
    } else if (keyPressed === 38 && dy === 0) { // Up arrow
        dx = 0;
        dy = -1;
    } else if (keyPressed === 39 && dx === 0) { // Right arrow
        dx = 1;
        dy = 0;
    } else if (keyPressed === 40 && dy === 0) { // Down arrow
        dx = 0;
        dy = 1;
    }
}

function gameLoop() {
    if (!gameRunning) return;

    movePacman();
    if (checkCollision()) {
        gameRunning = false;
        alert("Game Over!");
        return;
    }

    clearCanvas();
    drawFood();
    drawPacman();
    updateScore();

    setTimeout(gameLoop, 100);
}

function movePacman() {
    pacman.x += dx;
    pacman.y += dy;

    if (pacman.x < 0) pacman.x = tileCount - 1;
    if (pacman.x >= tileCount) pacman.x = 0;
    if (pacman.y < 0) pacman.y = tileCount - 1;
    if (pacman.y >= tileCount) pacman.y = 0;

    for (let i = 0; i < food.length; i++) {
        if (pacman.x === food[i].x && pacman.y === food[i].y) {
            food.splice(i, 1);
            score++;
            break;
        }
    }
}

function checkCollision() {
    // Pac-Man doesn't collide with walls, only with food or ghosts (not implemented)
    return false;
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = 'red';
    food.forEach(f => {
        ctx.fillRect(f.x * gridSize, f.y * gridSize, gridSize, gridSize);
    });
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2, gridSize / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2);
    ctx.closePath();
    ctx.fill();
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

function resetGame() {
    score = 0;
    dx = 1;
    dy = 0;
    pacman = { x: 1, y: 1 };
    food.length = 0;
    for (let i = 0; i < 10; i++) {
        food.push({
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        });
    }
    gameRunning = true;
}

gameLoop();
