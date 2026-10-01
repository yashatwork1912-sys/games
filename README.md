# 🏎️ Hand Gesture Racing Game

A high-performance, browser-based racing game where you control the car using real-time hand tracking via your webcam. No keyboard or controller needed—just your hands!

![Game Preview](https://via.placeholder.com/800x450?text=Hand+Gesture+Racing+Game+Preview)

## ✨ Features

- **Real-time Hand Tracking**: Powered by Google's MediaPipe Hands.
- **Intuitive Controls**: Move your hand left and right to steer the car.
- **Dynamic Difficulty**: Obstacle speed increases as you progress.
- **Persistence**: High scores are saved locally in your browser.
- **Responsive UI**: Professional game-over screens and real-time stat tracking.

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Edge, or Firefox).
- A webcam.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yashatwork1912-sys/games.git
   ```
2. Navigate to the project folder:
   ```bash
   cd games
   ```
3. Open `index.html` in your browser.
4. Grant camera permissions when prompted.

## 🎮 How to Play

1. **Start**: Place your hand in front of the webcam. The game starts as soon as a hand is detected.
2. **Steer**: Move your hand horizontally. The car will follow your hand's X-axis position.
3. **Goal**: Avoid the red obstacles for as long as possible to maximize your score and time.
4. **Game Over**: If you hit an obstacle, the game ends. Check your final score and try to beat your high score!

## 🛠️ Tech Stack

- **HTML5 Canvas**: For high-performance 2D rendering.
- **CSS3**: For modern UI and layout.
- **JavaScript (ES6+)**: Game logic and state management.
- **MediaPipe Hands**: For AI-powered hand landmark detection.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
