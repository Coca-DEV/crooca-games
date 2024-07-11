const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

let pacman = { x: 1, y: 1 };
let dx = 0;
let dy = 0;
let gameRunning = true;
let initialDirectionChosen = false;

const food = [];
const walls = [];
const ghosts = [
    { x: 9, y: 9, dx: 1, dy: 0, color: 'red' },
    { x: 10, y: 9, dx: -1, dy: 0, color: 'pink' },
    { x: 9, y: 10, dx: 0, dy: 1, color: 'cyan' },
    { x: 10, y: 10, dx: 0, dy: -1, color: 'orange' }
];

const layout = [
    // Add your maze layout here, where 0 = empty, 1 = wall, 2 = food, 3 = ghost start, 4 = pacman start
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 2, 1],
    [1, 2, 1, 0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 0, 1, 2, 2, 1],
    [1, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 1],
    [1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 2, 1],
    [1, 2, 1, 0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 0, 1, 2, 2, 1],
    [1, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 1],
    [1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function setupGame() {
    for (let row = 0; row < layout.length; row++) {
        for (let col = 0; col < layout[row].length; col++) {
            if (layout[row][col] === 2) {
                food.push({ x: col, y: row });
            } else if (layout[row][col] === 1) {
                walls.push({ x: col, y: row });
            } else if (layout[row][col] === 3) {
                ghosts.forEach(ghost => {
                    ghost.x = col;
                    ghost.y = row;
                });
            } else if (layout[row][col] === 4) {
                pacman.x = col;
                pacman.y = row;
            }
        }
    }
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
        initialDirectionChosen = true;
    } else if (keyPressed === 38 && dy === 0) { // Up arrow
        dx = 0;
        dy = -1;
        initialDirectionChosen = true;
    } else if (keyPressed === 39 && dx === 0) { // Right arrow
        dx = 1;
        dy = 0;
        initialDirectionChosen = true;
    } else if (keyPressed === 40 && dy === 0) { // Down arrow
        dx = 0;
        dy = 1;
        initialDirectionChosen = true;
    }
}

function gameLoop() {
    if (!gameRunning) return;

    if (initialDirectionChosen) {
        movePacman();
        moveGhosts();
    }

    if (checkCollision()) {
        gameRunning = false;
        alert("Game Over!");
        return;
    }

    clearCanvas();
    drawFood();
    drawWalls();
    drawGhosts();
    drawPacman();
    updateScore();

    if (food.length === 0) {
        gameRunning = false;
        alert("You Win!");
        return;
    }

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

function moveGhosts() {
    ghosts.forEach(ghost => {
        if (Math.random() < 0.5) {
            ghost.dx = Math.sign(pacman.x - ghost.x);
            ghost.dy = 0;
        } else {
            ghost.dy = Math.sign(pacman.y - ghost.y);
            ghost.dx = 0;
        }

        let newX = ghost.x + ghost.dx;
        let newY = ghost.y + ghost.dy;

        if (!checkWallCollision(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;
        }
    });
}

function checkCollision() {
    const head = pacman;

    // Check collision with walls
    for (let i = 0; i < walls.length; i++) {
        if (head.x === walls[i].x && head.y === walls[i].y) {
            return true;
        }
    }

    // Check collision with ghosts
    for (let i = 0; i < ghosts.length; i++) {
        if (head.x === ghosts[i].x && head.y === ghosts[i].y) {
            return true;
        }
    }

    return false;
}

function checkWallCollision(x, y) {
    for (let i = 0; i < walls.length; i++) {
        if (x === walls[i].x && y === walls[i].y) {
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
    ctx.fillStyle = 'yellow';
    food.forEach(f => {
        ctx.fillRect(f.x * gridSize, f.y * gridSize, gridSize, gridSize);
    });
}

function drawWalls() {
    ctx.fillStyle = 'blue';
    walls.forEach(wall => {
        ctx.fillRect(wall.x * gridSize, wall.y * gridSize, gridSize, gridSize);
    });
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.fillRect(ghost.x * gridSize, ghost.y * gridSize, gridSize, gridSize);
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
    dx = 0;
    dy = 0;
    pacman = { x: 1, y: 1 };
    initialDirectionChosen = false;
    food.length = 0;
    walls.length = 0;
    ghosts.forEach(ghost => {
        ghost.x = 9;
        ghost.y = 9;
        ghost.dx = 1;
        ghost.dy = 0;
    });
    setupGame();
    gameRunning = true;
}

setupGame();
gameLoop();
