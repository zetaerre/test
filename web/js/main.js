import { initGame } from './app.js';

// Initialize the game when the window loads
window.onload = function() {
    const canvas = document.getElementById('pongCanvas');
    initGame(canvas);
};
