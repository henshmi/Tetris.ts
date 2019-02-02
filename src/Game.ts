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

function gameOverScreen(): void {
    canvas2D.clear();
    canvas2D.drawBackground(GAME_CONFIG.BACKGROUND_COLOR);
    canvas2D.drawText(
        GAME_CONFIG.GAME_OVER_LABEL, 
        GAME_CONFIG.GAME_OVER_LABEL_FONT, 
        GAME_CONFIG.FONT_COLOR, 
        GAME_CONFIG.GAME_OVER_LABEL_POSITION,
        GAME_CONFIG.GAME_OVER_LABEL_POSITION.ALIGNMENT
    );

    canvas2D.drawText(
        GAME_CONFIG.GAME_OVER_YOUR_SCORE_LABEL + tetris.score, 
        GAME_CONFIG.GAME_OVER_YOUR_SCORE_LABEL_FONT, 
        GAME_CONFIG.FONT_COLOR, 
        GAME_CONFIG.GAME_OVER_YOUR_SCORE_LABEL_POSITION,
        GAME_CONFIG.GAME_OVER_LABEL_POSITION.ALIGNMENT
    );

    if(keyboard.isPressed(GAME_CONFIG.START_KEY)) {
        tetris.init();
    }
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
    if(tetris.gameOver) {
        gameOverScreen();
    }
    else{
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

start();