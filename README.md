# 🏎️ Hand Gesture Racing Game

A high-speed, immersive racing experience where your hands are the steering wheel. Built with real-time computer vision, this game transforms your webcam into a gaming controller.

## 📖 Game Description
Hand Gesture Racing is an arcade-style survival game. The player controls a cyan-colored car navigating a dangerous highway filled with red obstacle vehicles. The core challenge lies in the seamless integration of AI-powered hand tracking, requiring the player to move their hand physically to steer the vehicle in real-time. As the player survives longer, the speed of obstacles increases, testing their reflexes and precision.

## 🌟 Key Features
- **Real-time AI Steering**: Direct mapping of hand coordinates to car position for instantaneous response.
- **Dynamic Environment**: 
  - Animated road with moving lane markers.
  - Procedurally spawned trees and landscape elements for a sense of speed.
- **Collision System**: Physics-based collision detection with a visual "smoke" particle effect upon crashing.
- **Progression System**: 
  - Persistent High Score tracking using `localStorage`.
  - Increasing difficulty curve (speed scales with time).
- **User-Centric UI**:
  - Personalized player name entry.
  - Live timer and score tracking.
  - Contextual "Pro Tips" to help players improve their performance.

## 🛠️ Technical Stack
- **Frontend**: 
  - `HTML5 Canvas API`: Used for high-performance 2D rendering of the game world and particles.
  - `CSS3`: Custom neon-themed UI and responsive layout.
  - `Modern JavaScript (ES6+)`: Handles the game loop, state management, and coordinate transformations.
- **Computer Vision**: 
  - `MediaPipe Hands`: A high-fidelity hand and finger tracking solution. It processes webcam frames to extract 21 3D hand landmarks.
  - `Camera Utils`: Optimized pipeline for capturing and sending video frames to the AI model.

## 📈 Improvements Made
- **Control Refinement**: Transitioned from absolute center-offset steering to direct coordinate mapping for faster, more intuitive control.
- **Visual Polish**: Added linear gradients for the road, rounded car geometry, and particle-based smoke effects.
- **UX Enhancements**: Added a comprehensive start screen with clear instructions and mirror-movement warnings.
- **Performance**: Optimized the `requestAnimationFrame` loop to ensure smooth 60FPS gameplay.

## 🚀 Future Scope
- **Multi-Car Selection**: Allow players to choose different cars with varying handling properties.
- **Power-ups**: Implement collectable items (e.g., shields or speed boosts) to add strategic depth.
- **Multiple Levels**: Introduce different environments (e.g., night mode, desert, or snowy roads).
- **Advanced Gestures**: Integrate different hand signs to trigger special abilities (e.g., a "thumbs up" for a nitro boost).
- **Global Leaderboard**: Replace `localStorage` with a backend database (e.g., Firebase) to allow players to compete globally.

## 🎮 Getting Started
1. Clone the repository.
2. Open `index.html` in a modern web browser (Chrome or Edge recommended).
3. Grant camera permissions when prompted.
4. Enter your name and start racing!
