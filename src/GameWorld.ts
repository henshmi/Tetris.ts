import { GAME_CONFIG } from './game.config';
import { keyboard } from './input/Keyboard';
import { Vector2 } from './geom/Vector2';
import { canvas2D } from './Canvas';
import { Shape } from './shape/Shape';
import { ShapeType } from './shape/ShapeType';
import { GameMap } from './map/GameMap';
import { ShapeFactory } from './shape/ShapeFactory';

export class GameWorld {

    //------Members------//

    private _map: GameMap;
    private _updateEveryXFrames: number;
    private _frame: number;
    private _movingShape: Shape = null;
    private _shapesQueue: Shape[] = [];
    private _score: number;
    private _gameOver : boolean;
    private _shapeFactory: ShapeFactory;

    private _shapeTypes: ShapeType[] = [
        ShapeType.I,
        ShapeType.J,
        ShapeType.L,
        ShapeType.O,
        ShapeType.S,
        ShapeType.Z,
        ShapeType.T
    ];

    //------Properties------//
    
    public get gameOver() : boolean {
        return this._gameOver;
    }
    
    
    //------Constructor------//

    constructor(width: number, height: number) {
        this._shapeFactory = new ShapeFactory();
        this._map = new GameMap(width, height);
        this.init();
    }

    private init(): void {
        this._score = 0;
        this._frame = 0; 
        this._updateEveryXFrames = GAME_CONFIG.UPDATE_AFTER_X_FRAMES;
        this._map.init();
        const newShape: Shape = this.generateRandomShape();
        this._shapesQueue = [newShape];
        this._movingShape = this.generateRandomShape();
    }

    //------Private Methods------//

    private increaseScore(toAdd: number) : void {
        this._score += toAdd;
    }

    private dropShape(): number {
        let numOfCells = 0;
        
        while(!this.lowerShape()){
            numOfCells++;
        }
        return numOfCells;
    }

    private handleInput(): void {

        let toMoveX = 0;

        if(keyboard.isPressed(GAME_CONFIG.DROP)) {
            let cellsDropped = this.dropShape();
            this.increaseScore(cellsDropped * GAME_CONFIG.DROPPED_SHAPE_BONUS);
        }
        else if(keyboard.isPressed(GAME_CONFIG.UP_KEY)) {
            this.rotateShape();
        }
        else if (keyboard.isPressed(GAME_CONFIG.DOWN_KEY)) {
            this.lowerShape();
            this.increaseScore(GAME_CONFIG.LOWERED_SHAPE_BONUS);
        }
        else if (keyboard.isPressed(GAME_CONFIG.LEFT_KEY)) {
            toMoveX = -1;
        }
        else if (keyboard.isPressed(GAME_CONFIG.RIGHT_KEY)) {
            toMoveX = 1;
        }

        if(toMoveX !== 0){
            
            const reachedBorder = this._movingShape.cells.some(cell => {
                const nextX = cell.X + toMoveX;
                const partOfShape = this._movingShape.isPartOfShape(cell.addX(toMoveX));
                return nextX < 0 || nextX === this._map.width ||
                    (this._map.isCellFilled(nextX, cell.Y) && !partOfShape);
            });

            if(!reachedBorder) {
                this._map.clearShape(this._movingShape);
                this._movingShape.move(toMoveX, 0);
                this._map.colorShape(this._movingShape);
            }
        }
    }

    private rotateShape(): void {

        if(!this._movingShape.origin){
            return;
        }

        let newShape = [];

        for(let cell of this._movingShape.cells) {
            let x = cell.X - this._movingShape.origin.X;
            let y = cell.Y - this._movingShape.origin.Y;
            let newX = -y;
            let newY = x;

            let newCell = this._movingShape.origin.addX(newX).addY(newY);
            newShape.push(newCell);
        }

        let possibleRotation = newShape.every(cell => {
            const partOfShape = this._movingShape.isPartOfShape(cell);
            return this._map.isInMap(cell.X, cell.Y) &&
                (!this._map.isCellFilled(cell.X, cell.Y) || partOfShape);
        });

        if(possibleRotation) {
            this._map.clearShape(this._movingShape);
            this._movingShape.cells = newShape;
            this._map.colorShape(this._movingShape);
        }
    }

    private lowerShape(): boolean {
        
        const reachedBottom = this._movingShape.cells.some(cell => {
            const nextY: number = cell.Y + 1;
            const partOfShape = this._movingShape.isPartOfShape(cell.addY(1));
            return nextY === this._map.height ||
                   (this._map.isCellFilled(cell.X, nextY) && !partOfShape);
        });

        if(!reachedBottom) {
            this._map.clearShape(this._movingShape);
            this._movingShape.move(0, 1);
            this._map.colorShape(this._movingShape);
        }

        return reachedBottom;
    }

    private handleFilledLines(): void {
        
        let filledLinesCount = this._map.removeFilledLines();

        if(filledLinesCount > 0) {
            this.increaseScore(filledLinesCount * GAME_CONFIG.FILLED_LINE_BONUS);

            if(this._updateEveryXFrames > 0) {
                this._updateEveryXFrames--;
            }
        }
    }

    private checkForGameOver(): boolean {
        return this._map.anyFilledOnRow(0);
    } 

    private generateRandomShape(): Shape {
        const randomShapeTypeIndex = Math.floor(Math.random() * this._shapeTypes.length);
        let shapeColor = GAME_CONFIG.SHAPE_COLORS[randomShapeTypeIndex];
        
        return this._shapeFactory.createShape(
                    this._shapeTypes[randomShapeTypeIndex], 
                    new Vector2(Math.floor(this._map.width / 2), -3),
                    shapeColor
                );
    }

    private drawShapesInQueue(): void {
        canvas2D.drawText(
                GAME_CONFIG.NEXT_SHAPE_LABEL, 
                GAME_CONFIG.FONT, 
                GAME_CONFIG.FONT_COLOR, 
                GAME_CONFIG.NEXT_SHAPE_LABEL_POSITION
            );
        
        for(let i = this._shapesQueue.length - 1; i >= 0; i--){
            let shape = this._shapesQueue[i];
            let indexFromEnd = this._shapesQueue.length - 1 - i;
            let demoShape = this._shapeFactory.createShape(
                    shape.shapeType, 
                    new Vector2(
                        GAME_CONFIG.NEXT_SHAPE_POSITION.X + indexFromEnd * 4 * GAME_CONFIG.NEXT_SHAPE_CELL_SIZE, 
                        GAME_CONFIG.NEXT_SHAPE_POSITION.Y), 
                    shape.color,
                    GAME_CONFIG.NEXT_SHAPE_CELL_SIZE
                );

            demoShape.cells.forEach(cell => 
                canvas2D.drawRect(
                        cell, 
                        demoShape.color, 
                        GAME_CONFIG.STROKE_COLOR, 
                        GAME_CONFIG.NEXT_SHAPE_CELL_SIZE,
                        GAME_CONFIG.NEXT_SHAPE_CELL_SIZE
                    )
                );
        }
    }

    //------Public Methods------//

    public update(): void {
        this.handleInput();
        if(++this._frame % this._updateEveryXFrames) {
            return;
        }
        const reachedBottom = this.lowerShape();
        if(reachedBottom) {
            this.handleFilledLines();
            this._gameOver = this.checkForGameOver();
            if(!this._gameOver){
                let newShape: Shape = this.generateRandomShape();
                this._shapesQueue.unshift(newShape);
                this._movingShape = this._shapesQueue.pop();
            }
            else{
                this.init();
            }
        }
    }

    private drawScore(): void {
        canvas2D.drawText(
                GAME_CONFIG.SCORE_LABEL + this._score.toString(), 
                GAME_CONFIG.FONT, 
                GAME_CONFIG.FONT_COLOR, 
                GAME_CONFIG.SCORE_POSITION
            );
    }

    public draw(): void {
        this._map.draw();
        this.drawScore();
        this.drawShapesInQueue();
    }
}