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
