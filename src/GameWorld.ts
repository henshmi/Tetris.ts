import { GAME_CONFIG } from './game.config';
import { keyboard } from './input/Keyboard';
import { Vector2 } from './geom/Vector2';
import { canvas2D } from './Canvas';
import { Cell } from "./map/Cell";
import { ShapeType } from './shapeType/ShapeType';

export class GameWorld {

    //------Members------//

    private _map: Cell[][];
    private _width: number;
    private _height: number;
    private _movingShapeColor: string;
    private _updateEveryXFrames: number = 20;
    private _frame: number = 0;
    private _movingShape: Vector2[] = [];
    private _movingShapeOrigin: Vector2;
    private _score: number = 0;
    private _gameOver : boolean;

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
        this._width = width;
        this._height = height;
        this.initMap();
        this.generateRandomShape();
    }

    //------Private Methods------//

    private initMap() {
        this._map = [];

        for(let i: number = 0 ; i < this._height ; i++ ){
            this._map[i] = [];

            for(let j: number = 0 ; j < this._width ; j++){
                this._map[i][j] = new Cell();
            }
        }
    }

    private isCellFilled(x: number, y: number): boolean {
        return this.isInMap(x,y) && this._map[y][x].filled;
    }

    private clearCell(x: number, y: number): void {
        if(this.isInMap(x, y)) {
            this._map[y][x].filled = false;
        }
    }

    private isInMap(x: number, y: number) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    private colorCell(x: number, y: number, color: string): void {
        if(this.isInMap(x, y)){
            this._map[y][x].filled = true;
            this._map[y][x].color = color;
        }
    }

    private isPartOfShape(cell: Vector2, shape: Vector2[]): boolean {
        return shape.some(shapeCell => shapeCell.X === cell.X && shapeCell.Y === cell.Y);
    }

    private increaseScore() : void {
        this._score += this._width;
    }

    private dropShape(): void {
        while(!this.lowerShape()){}
    }
    private handleInput(): void {

        let toMoveX = 0;

        if(keyboard.isPressed(GAME_CONFIG.DROP)) {
            this.dropShape();
        }
        else if(keyboard.isPressed(GAME_CONFIG.UP_KEY)) {
            this.rotateShape();
        }
        else if (keyboard.isPressed(GAME_CONFIG.DOWN_KEY)) {
            this.lowerShape();
        }
        else if (keyboard.isPressed(GAME_CONFIG.LEFT_KEY)) {
            toMoveX = -1;
        }
        else if (keyboard.isPressed(GAME_CONFIG.RIGHT_KEY)) {
            toMoveX = 1;
        }

        if(toMoveX !== 0){

            const reachedBorder = this._movingShape.some(cell => {
                const nextX = cell.X + toMoveX;
                const partOfShape = this.isPartOfShape(cell.addX(toMoveX), this._movingShape);
                return nextX < 0 || nextX === this._width ||
                    (this.isCellFilled(nextX, cell.Y) && !partOfShape);
            });

            if(!reachedBorder) {
                this._movingShape.forEach(cell => {
                    this.clearCell(cell.X, cell.Y);
                    cell.addToX(toMoveX);
                });

                if(this._movingShapeOrigin){
                    this._movingShapeOrigin.addToX(toMoveX);
                }

                this._movingShape.forEach(cell => {
                    this.colorCell(cell.X, cell.Y, this._movingShapeColor);
                });
            }
        }
    }

    private rotateShape(): void {

        if(!this._movingShapeOrigin){
            return;
        }

        let newShape = [];

        for(let i = 0 ; i < this._movingShape.length; i++) {
            let cell = this._movingShape[i];
            let x = cell.X - this._movingShapeOrigin.X;
            let y = cell.Y - this._movingShapeOrigin.Y;
            let newX = -y;
            let newY = x;

            let newCell = this._movingShapeOrigin.addX(newX).addY(newY);
            newShape.push(newCell);
        }

        let possibleRotation = newShape.every(cell => {
            const partOfShape = this.isPartOfShape(cell, this._movingShape);
            return cell.Y >= 0 && cell.X >= 0 && cell.X < this._width &&
                (!this.isCellFilled(cell.X, cell.Y) || partOfShape);
        });

        if(possibleRotation) {
            this._movingShape.forEach(cell => {
                this.clearCell(cell.X, cell.Y);
            });

            this._movingShape = newShape;

            this._movingShape.forEach(cell => {
                this.colorCell(cell.X, cell.Y, this._movingShapeColor);
            });
        }
    }

    private lowerShape(): boolean {
        
        const reachedBottom = this._movingShape.some(cell => {
            const nextY: number = cell.Y + 1;
            const partOfShape = this.isPartOfShape(cell.addY(1), this._movingShape);
            return nextY === this._height ||
                   (this.isCellFilled(cell.X, nextY) && !partOfShape);
        });

        if(!reachedBottom) {
            this._movingShape.forEach(cell => {
                this.clearCell(cell.X, cell.Y);
                cell.addToY(1);
            });

            if(this._movingShapeOrigin){
                this._movingShapeOrigin.addToY(1);
            }

            this._movingShape.forEach(cell => {
                this.colorCell(cell.X, cell.Y, this._movingShapeColor);
            });
        }

        return reachedBottom;
    }

    private handleFilledLines(): void {
        
        for (let i = 0 ; i < this._map.length ; i++) {
            const filledLine : boolean = this._map[i].every(cell => cell.filled);

            if(filledLine) {
                this._map.splice(i,1);
                let newRow: Cell[] = [];
                for(let j = 0 ; j < this._width ; j++) {
                    newRow[j] = new Cell();
                }

                this._map.unshift(newRow);
                this.increaseScore();
                
                if(this._updateEveryXFrames > 0) {
                    this._updateEveryXFrames--;
                }
            }
        }
    }

    private checkForGameOver(): boolean {
        return this._map[0].some(cell => cell.filled);
    }

    private addShape(shapeType: ShapeType): void {

        let shapeY = -4;
        let randomX: number;
        let position: Vector2;
        this._movingShape = [];

        switch(shapeType) {
            case ShapeType.I:
                randomX = Math.floor(Math.random() * this._width);
                position = new Vector2(randomX, shapeY);
                this._movingShape = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X, position.Y + 2),
                    new Vector2(position.X, position.Y + 3)
                ];
                this._movingShapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.J:
                randomX = Math.floor(Math.random() * (this._width - 1)) + 1;
                position = new Vector2(randomX, shapeY);
                this._movingShape = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X, position.Y + 2),
                    new Vector2(position.X - 1, position.Y + 2),
                ];
                this._movingShapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.L:
                randomX = Math.floor(Math.random() * (this._width - 1));
                position = new Vector2(randomX, shapeY);
                this._movingShape = [
                    new Vector2(position.X, position.Y ),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X, position.Y + 2),
                    new Vector2(position.X + 1, position.Y + 2),
                ];
                this._movingShapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.O:
                randomX = Math.floor(Math.random() * (this._width - 1));
                position = new Vector2(randomX, shapeY);
                this._movingShape = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X + 1, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X + 1, position.Y + 1),
                ];
                this._movingShapeOrigin = null;
                break;
            case ShapeType.S:
                randomX = Math.floor(Math.random() * (this._width - 2)) + 1;
                position = new Vector2(randomX, shapeY);
                this._movingShape = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X + 1, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X - 1, position.Y + 1),
                ];
                this._movingShapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.Z:
                randomX = Math.floor(Math.random() * (this._width - 2)) + 1;
                position = new Vector2(randomX, shapeY);
                this._movingShape = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X - 1, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X + 1, position.Y + 1),
                ];
                this._movingShapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.T:
                randomX = Math.floor(Math.random() * (this._width - 2)) + 1;
                position = new Vector2(randomX, shapeY);
                this._movingShape = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X - 1, position.Y + 1),
                    new Vector2(position.X + 1, position.Y + 1),
                ];
                this._movingShapeOrigin = new Vector2(position.X, position.Y + 1);
                break;  
        }

        // Sets shape color
        const shapeTypeIndex = this._shapeTypes.indexOf(shapeType) 
        this._movingShapeColor = GAME_CONFIG.SHAPE_COLORS[shapeTypeIndex];

        this._movingShape.forEach(cell => {
            this.colorCell(cell.X, cell.Y, this._movingShapeColor)
        });
    }

    private generateRandomShape(): void {
        const randomShapeTypeIndex = Math.floor(Math.random() * this._shapeTypes.length);
        this.addShape(this._shapeTypes[randomShapeTypeIndex]);
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
            const gameOver: boolean = this.checkForGameOver();
            if(!gameOver){
                this.generateRandomShape();
            }
            else{
                this._gameOver = true;
            }
        }
    }

    private drawScore(): void {
        canvas2D.drawText('Score: ' + this._score.toString(), GAME_CONFIG.FONT, GAME_CONFIG.FONT_COLOR, GAME_CONFIG.SCORE_POSITION);
    }

    public draw(): void {
        for(let i = 0 ; i < this._map.length ; i++){
            for(let j = 0 ; j < this._map[i].length ; j++){
                const cell: Cell = this._map[i][j];
                if(cell.filled){
                    canvas2D.drawRectAtCell(i, j, cell.color, GAME_CONFIG.STROKE_COLOR, GAME_CONFIG.CELL_SIZE);
                }
            }
        }

        this.drawScore();
    }
}