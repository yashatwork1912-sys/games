const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const timerElement = document.getElementById('timer');
const statusElement = document.getElementById('status');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const videoElement = document.getElementById('input_video');

canvas.width = 400;
canvas.height = 600;

let score = 0;
let highScore = localStorage.getItem('racingHighScore') || 0;
let startTime = null;
let gameActive = false;
let carX = canvas.width / 2 - 20;
const carY = canvas.height - 100;
const carWidth = 40;
const carHeight = 70;

highScoreElement.innerText = `High Score: ${highScore}`;

const obstacles = [];
let obstacleSpeed = 5;
let frameCount = 0;

function spawnObstacle() {
    const x = Math.random() * (canvas.width - carWidth);
    obstacles.push({ x, y: -carHeight, width: carWidth, height: carHeight });
}

function update() {
    if (!gameActive) return;

    frameCount++;
    if (frameCount % 60 === 0) spawnObstacle();

    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.innerText = `Time: ${currentTime}s`;

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacleSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            scoreElement.innerText = `Score: ${score}`;
        } else if (
            carX < obstacles[i].x + obstacles[i].width &&
            carX + carWidth > obstacles[i].x &&
            carY < obstacles[i].y + obstacles[i].height &&
            carY + carHeight > obstacles[i].y
        ) {
            endGame();
        }
    }
    obstacleSpeed += 0.001;
}

function endGame() {
    gameActive = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('racingHighScore', highScore);
    }
    finalScoreElement.innerText = `Final Score: ${score} | Time: ${timerElement.innerText.split(': ')[1]}`;
    gameOverScreen.style.display = "block";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Road background
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road lines
    ctx.strokeStyle = "white";
    ctx.setLineDash([20, 20]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Car
    ctx.fillStyle = "cyan";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "cyan";
    ctx.fillRect(carX, carY, carWidth, carHeight);
    ctx.shadowBlur = 0;

    // Obstacles
    ctx.fillStyle = "#ff4444";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const hand = results.multiHandLandmarks[0];
        const wrist = hand[0];
        carX = wrist.x * canvas.width - carWidth / 2;
        carX = Math.max(0, Math.min(canvas.width - carWidth, carX));
        
        if (!gameActive && gameOverScreen.style.display === "none") {
            gameActive = true;
            startTime = Date.now();
            statusElement.innerText = "Driving...";
            statusElement.style.color = "#aaa";
        }
    }
});

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});

camera.start().then(() => {
    statusElement.innerText = "Hand detected to start!";
    draw();
});
