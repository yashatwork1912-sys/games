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
const tipElement = document.getElementById('tip');
const pauseBtn = document.getElementById('pause-btn');
const pauseScreen = document.getElementById('pause-screen');

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
const particles = [];
let obstacleSpeed = 5;
let frameCount = 0;

const tips = [
    "Keep your hand steady!",
    "Watch out for fast red cars!",
    "Fast reflexes win the race!",
    "Stay in the center for better control!",
    "Concentrate on the road!"
];

function createSmoke(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: Math.random() * 15 + 5,
            life: 1.0,
            color: `rgba(150, 150, 150, ${Math.random()})`
        });
    }
}

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
            createSmoke(carX + carWidth / 2, carY + carHeight / 2);
            endGame();
        }
    }

    // Update trees
    for (let i = trees.length - 1; i >= 0; i--) {
        trees[i].y += obstacleSpeed;
        if (trees[i].y > canvas.height) trees.splice(i, 1);
    }

    // Update particles (smoke)
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].life -= 0.02;
        if (particles[i].life <= 0) particles.splice(i, 1);
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

    // Smoke
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;

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
        
        // DYNAMIC & FAST CONTROL
        const wrist = hand[0];
        // Fast response using direct mapping
        carX = (wrist.x * canvas.width) - (carWidth / 2);
        carX = Math.max(0, Math.min(canvas.width - carWidth, carX));
    }
});

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseScreen.style.display = isPaused ? "block" : "none";
    pauseBtn.innerText = isPaused ? "Resume" : "Pause";
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
