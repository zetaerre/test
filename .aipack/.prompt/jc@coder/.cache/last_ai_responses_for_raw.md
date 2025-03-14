====
> Info: Duration: 34s 225ms | ~$0.0558 | Prompt Tokens: 4,450 | Completion Tokens: 2,831 | Model: claude-3-7-sonnet-latest | Adapter: Anthropic

I'll refactor the code by extracting the JavaScript and CSS into separate files, and organizing the JavaScript code into the requested structure. Here are the updated files:

````html
<!-- file: index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pong Game</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <canvas id="pongCanvas"></canvas>
    <script type="module" src="js/main.js"></script>
</body>
</html>
````

````css
/* file: css/main.css */
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

canvas {
    background-color: #000;
    display: block;
    margin: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
````

````js
// file: js/main.js
import { initGame } from './app.js';

// Initialize the game when the window loads
window.onload = function() {
    const canvas = document.getElementById('pongCanvas');
    initGame(canvas);
};
````

````js
// file: js/app.js
import { drawPaddle, drawBall, drawNet, drawScore, clearCanvas } from './cv-utils.js';

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const BALL_SPEED = 5;
const AI_SPEED = 3;
const MARGIN = 16;

// Game variables
let canvas, ctx;
let ballX, ballY, ballSpeedX, ballSpeedY;
let playerY, computerY;
let playerScore = 0, computerScore = 0;

export function initGame(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    
    resetGame();
    resizeCanvas();
    
    // Add event listeners
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Start the game loop
    setInterval(gameLoop, 1000/60); // 60 FPS
}

// Resize canvas to fit window with margin
function resizeCanvas() {
    canvas.width = window.innerWidth - MARGIN * 2;
    canvas.height = window.innerHeight - MARGIN * 2;
    
    // Adjust paddle height based on canvas height (optional)
    const paddleHeight = Math.min(PADDLE_HEIGHT, canvas.height / 4);
    
    // Make sure the paddles stay in bounds after resize
    if (playerY + paddleHeight > canvas.height) {
        playerY = canvas.height - paddleHeight;
    }
    if (computerY + paddleHeight > canvas.height) {
        computerY = canvas.height - paddleHeight;
    }
}

// Handle mouse movement
function handleMouseMove(event) {
    const relativeY = event.clientY - canvas.getBoundingClientRect().top;
    const paddleHeight = Math.min(PADDLE_HEIGHT, canvas.height / 4);
    
    // Update player paddle position
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, relativeY - paddleHeight / 2));
}

// Reset the game state
function resetGame() {
    const paddleHeight = Math.min(PADDLE_HEIGHT, canvas.height / 4);
    
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
    
    playerY = (canvas.height - paddleHeight) / 2;
    computerY = (canvas.height - paddleHeight) / 2;
}

// Main game loop
function gameLoop() {
    update();
    render();
}

// Update game state
function update() {
    const paddleHeight = Math.min(PADDLE_HEIGHT, canvas.height / 4);
    
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Ball collision with top and bottom walls
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
        ballSpeedY *= -1;
        // Keep the ball in bounds
        if (ballY - BALL_RADIUS < 0) {
            ballY = BALL_RADIUS;
        } else if (ballY + BALL_RADIUS > canvas.height) {
            ballY = canvas.height - BALL_RADIUS;
        }
    }
    
    // Ball collision with paddles
    // Left paddle (player)
    if (ballX - BALL_RADIUS < PADDLE_WIDTH && 
        ballY > playerY && 
        ballY < playerY + paddleHeight) {
        
        ballSpeedX *= -1;
        
        // Adjust ball angle based on where it hit the paddle
        const hitPosition = (ballY - playerY) / paddleHeight;
        ballSpeedY = BALL_SPEED * (2 * hitPosition - 1);
        
        // Move ball away from paddle to prevent multiple collisions
        ballX = PADDLE_WIDTH + BALL_RADIUS;
    }
    
    // Right paddle (computer)
    const rightPaddleX = canvas.width - PADDLE_WIDTH;
    if (ballX + BALL_RADIUS > rightPaddleX && 
        ballY > computerY && 
        ballY < computerY + paddleHeight) {
        
        ballSpeedX *= -1;
        
        // Adjust ball angle based on where it hit the paddle
        const hitPosition = (ballY - computerY) / paddleHeight;
        ballSpeedY = BALL_SPEED * (2 * hitPosition - 1);
        
        // Move ball away from paddle to prevent multiple collisions
        ballX = rightPaddleX - BALL_RADIUS;
    }
    
    // Ball out of bounds (scoring)
    if (ballX < 0) {
        // Computer scores
        computerScore++;
        resetGame();
    } else if (ballX > canvas.width) {
        // Player scores
        playerScore++;
        resetGame();
    }
    
    // Computer AI
    const computerPaddleCenter = computerY + paddleHeight / 2;
    const ballYPrediction = predictBallY();
    
    if (computerPaddleCenter < ballYPrediction - 10) {
        computerY += AI_SPEED;
    } else if (computerPaddleCenter > ballYPrediction + 10) {
        computerY -= AI_SPEED;
    }
    
    // Keep computer paddle in bounds
    computerY = Math.max(0, Math.min(canvas.height - paddleHeight, computerY));
}

// Simple ball Y position prediction for AI
function predictBallY() {
    if (ballSpeedX < 0) {
        // Ball moving towards player, aim for center
        return canvas.height / 2;
    }
    
    // Calculate how many steps until ball reaches the right paddle
    const stepsToRightPaddle = (canvas.width - PADDLE_WIDTH - ballX) / ballSpeedX;
    
    // Predict Y position
    let predictedY = ballY + ballSpeedY * stepsToRightPaddle;
    
    // Account for bounces
    const bounceHeight = canvas.height - BALL_RADIUS * 2;
    predictedY = predictedY % (2 * bounceHeight);
    if (predictedY < 0) predictedY = -predictedY;
    if (predictedY > bounceHeight) predictedY = 2 * bounceHeight - predictedY;
    
    return predictedY;
}

// Render the game
function render() {
    const paddleHeight = Math.min(PADDLE_HEIGHT, canvas.height / 4);
    
    // Clear the canvas
    clearCanvas(ctx, canvas.width, canvas.height);
    
    // Draw the net
    drawNet(ctx, canvas.width, canvas.height);
    
    // Draw scores
    drawScore(ctx, playerScore, computerScore, canvas.width);
    
    // Draw paddles
    drawPaddle(ctx, 0, playerY, PADDLE_WIDTH, paddleHeight); // Left paddle (player)
    drawPaddle(ctx, canvas.width - PADDLE_WIDTH, computerY, PADDLE_WIDTH, paddleHeight); // Right paddle (computer)
    
    // Draw ball
    drawBall(ctx, ballX, ballY, BALL_RADIUS);
}
````

````js
// file: js/cv-utils.js
// Canvas utility functions for drawing game elements

// Clear the canvas
export function clearCanvas(ctx, width, height) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
}

// Draw the center net
export function drawNet(ctx, canvasWidth, canvasHeight) {
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.strokeStyle = '#AAA';
    ctx.stroke();
    ctx.setLineDash([]);
}

// Draw a paddle
export function drawPaddle(ctx, x, y, width, height) {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x, y, width, height);
}

// Draw the ball
export function drawBall(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();
}

// Draw the score
export function drawScore(ctx, playerScore, computerScore, canvasWidth) {
    ctx.font = '48px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(playerScore, canvasWidth / 4, 60);
    ctx.fillText(computerScore, canvasWidth * 3 / 4, 60);
}
````

This refactoring separates the code into the requested modules:

1. The CSS has been moved to `css/main.css`
2. The JavaScript has been split into three modules:
   - `main.js` - Entry point that initializes the game
   - `app.js` - Core game logic including physics, collision detection, and game state
   - `cv-utils.js` - Canvas utility functions for drawing game elements

The script tag in the HTML file has been updated to type "module" to support ES6 module imports/exports. The overall functionality of the game remains the same, but the code is now better organized and more maintainable.

