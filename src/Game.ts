import { GameWorld } from './GameWorld';
import { keyboard } from './input/Keyboard';
import { canvas2D } from './Canvas';
import { GAME_CONFIG } from './game.config';

let tetris: GameWorld;

function start(): void {
    const gameWidth = canvas2D.Width / GAME_CONFIG.CELL_SIZE;
    const gameHeight = canvas2D.Height / GAME_CONFIG.CELL_SIZE;
    tetris = new GameWorld(gameWidth, gameHeight);
    gameLoop();
}

function update(): void {
    tetris.update();
    keyboard.reset();
}

function draw(): void {
    canvas2D.clear();
    canvas2D.drawBackground(GAME_CONFIG.BACKGROUND_COLOR);
    tetris.draw();
}

function gameLoop(): void {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

start();