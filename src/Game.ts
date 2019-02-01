import { GameWorld } from './GameWorld';
import { keyboard } from './input/Keyboard';
import { canvas2D } from './Canvas';
import { GAME_CONFIG } from './game.config';

const gameWidth = canvas2D.Width / GAME_CONFIG.CELL_SIZE;
const gameHeight = canvas2D.Height / GAME_CONFIG.CELL_SIZE;

let map: GameWorld;

function start() {
    map = new GameWorld(gameWidth, gameHeight);
    gameLoop();
}

function update() {
    map.update();
    keyboard.reset();
}

function draw() {
    canvas2D.clear();
    canvas2D.drawBackground(GAME_CONFIG.BACKGROUND_COLOR);
    map.draw();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

start();