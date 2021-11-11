import { GameWorld } from './GameWorld';
import { keyboard } from './input/Keyboard';
import { canvas2D } from './Canvas';
import { GAME_CONFIG } from './game.config';



class Game {
    private tetris: GameWorld;


    constructor() {
        this.init();
    }

    public init(): void {
        this.tetris = new GameWorld(GAME_CONFIG.GAME_WIDTH, GAME_CONFIG.GAME_HEIGHT);
    }

    public gameOverScreen(): void {
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
            GAME_CONFIG.GAME_OVER_YOUR_SCORE_LABEL + this.tetris.score, 
            GAME_CONFIG.GAME_OVER_YOUR_SCORE_LABEL_FONT, 
            GAME_CONFIG.FONT_COLOR, 
            GAME_CONFIG.GAME_OVER_YOUR_SCORE_LABEL_POSITION,
            GAME_CONFIG.GAME_OVER_LABELTetris_POSITION.ALIGNMENT
        );

        if(keyboard.isPressed(GAME_CONFIG.START_KEY)) {
            this.tetris.init();
        }
    }

    public update(): void {
        this.tetris.update();
    }

    public draw(): void {
        canvas2D.clear();
        canvas2D.drawBackground(GAME_CONFIG.BACKGROUND_COLOR);
        this.tetris.draw();
    }

    public start(): void {
        if(this.tetris.gameOver) {
            this.gameOverScreen();
        }
        else{
            this.update();
            this.draw();
        }
        keyboard.reset();
        requestAnimationFrame(()=>this.start());
    }

}

const game = new Game();
game.start();
