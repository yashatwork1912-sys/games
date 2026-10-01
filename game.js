const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const timerElement = document.getElementById('timer');
const statusElement = document.getElementById('status');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const videoElement = document.getElementById('input_video');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const playerDisplay = document.querySelector('#player-display span');
const pauseScreen = document.getElementById('pause-screen');
const tipElement = document.getElementById('tip');

canvas.width = 400;
canvas.height = 600;

let score = 0;
let highScore = localStorage.getItem('racingHighScore') || 0;
let startTime = null;
let gameActive = false;
let isPaused = false;
let carX = canvas.width / 2 - 20;
const carY = canvas.height - 100;
const carWidth = 40;
const carHeight = 70;

highScoreElement.innerText = `High Score: ${highScore}`;

const obstacles = [];
const trees = [];
let obstacleSpeed = 5;
let frameCount = 0;

const tips = [
    "Keep your hand steady!",
    "Watch out for fast red cars!",
    "Punch to pause the game!",
    "Stay in the center for better control!",
    "Concentrate on the road!"
];

function spawnObstacle() {
    const x = Math.random() * (canvas.width - carWidth);
    obstacles.push({ x, y: -carHeight, width: carWidth, height: carHeight });
}

function spawnTree() {
    const side = Math.random() > 0.5 ? 0 : canvas.width - 40;
    const xOffset = (Math.random() - 0.5) * 20;
    trees.push({ x: side + xOffset, y: -60, size: 30 + Math.random() * 20 });
}

function update() {
    if (!gameActive || isPaused) return;

    frameCount++;
    if (frameCount % 60 === 0) spawnObstacle();
    if (frameCount % 30 === 0) spawnTree();
    if (frameCount % 300 === 0) {
        tipElement.innerText = `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`;
    }

    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.innerText = `Time: ${currentTime}s`;

    // Update obstacles
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

    // Update trees
    for (let i = trees.length - 1; i >= 0; i--) {
        trees[i].y += obstacleSpeed;
        if (trees[i].y > canvas.height) trees.splice(i, 1);
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
    document.getElementById('ui').style.display = "none";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grass background
    ctx.fillStyle = "#2d5a27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road
    const roadWidth = 280;
    const roadX = (canvas.width - roadWidth) / 2;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#222");
    gradient.addColorStop(1, "#444");
    ctx.fillStyle = gradient;
    ctx.fillRect(roadX, 0, roadWidth, canvas.height);

    // Road lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.setLineDash([40, 40]);
    ctx.lineDashOffset = -frameCount * obstacleSpeed;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Trees
    trees.forEach(tree => {
        ctx.fillStyle = "#1a3317";
        ctx.beginPath();
        ctx.arc(tree.x + tree.size/2, tree.y + tree.size/2, tree.size/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(tree.x + tree.size/2 - 5, tree.y + tree.size, 10, 10);
    });

    // Car
    ctx.fillStyle = "cyan";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "cyan";
    ctx.beginPath();
    ctx.roundRect(carX, carY, carWidth, carHeight, 10);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(carX + 5, carY + 15, carWidth - 10, 15);
    ctx.fillStyle = "yellow";
    ctx.shadowColor = "yellow";
    ctx.fillRect(carX + 5, carY, 8, 5);
    ctx.fillRect(carX + carWidth - 13, carY, 8, 5);
    ctx.shadowBlur = 0;

    // Obstacles
    obstacles.forEach(obs => {
        ctx.fillStyle = "#ff4444";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ff4444";
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 5);
        ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(obs.x + 5, obs.y + 10, obs.width - 10, 5);
    });
    ctx.shadowBlur = 0;

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
        const centerX = 0.5;
        const sensitivity = 1.2;
        
        const diff = wrist.x - centerX;
        carX = (canvas.width / 2 - carWidth / 2) + (diff * canvas.width * sensitivity);
        carX = Math.max(0, Math.min(canvas.width - carWidth, carX));

        const fingertips = [8, 12, 16, 20];
        const wristPos = hand[0];
        let isFist = true;
        fingertips.forEach(idx => {
            const dist = Math.sqrt(Math.pow(hand[idx].x - wristPos.x, 2) + Math.pow(hand[idx].y - wristPos.y, 2));
            if (dist > 0.2) isFist = false;
        });

        if (isFist && gameActive) {
            isPaused = true;
            pauseScreen.style.display = "block";
        } else if (!isFist && isPaused) {
            isPaused = false;
            pauseScreen.style.display = "none";
        }
    }
});

startBtn.addEventListener('click', () => {
    const name = playerNameInput.value || "Guest";
    playerDisplay.innerText = name;
    startScreen.style.display = "none";
    document.getElementById('ui').style.display = "block";
    gameActive = true;
    startTime = Date.now();
    statusElement.innerText = "Racing...";
});

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});

camera.start().then(() => {
    statusElement.innerText = "Ready!";
    draw();
});
