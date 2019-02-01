import { GameWorld } from './GameWorld';
import { keyboard } from './input/Keyboard';
import { canvas2D } from './Canvas';
import { GAME_CONFIG } from './game.config';

const gameWidth = canvas2D.Width / GAME_CONFIG.CELL_SIZE;
const gameHeight = canvas2D.Height / GAME_CONFIG.CELL_SIZE;

let tetris: GameWorld;

function start() {
    tetris = new GameWorld(gameWidth, gameHeight);
    gameLoop();
}

function update() {
    tetris.update();
    keyboard.reset();
}

function draw() {
    //canvas2D.fixDPI();
    canvas2D.clear();
    canvas2D.drawBackground(GAME_CONFIG.BACKGROUND_COLOR);
    tetris.draw();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

start();