import { Shape } from './../shape/Shape';
import { Cell } from "./Cell";
import { canvas2D } from "../Canvas";
import { GAME_CONFIG } from "../game.config";
import { Vector2 } from "../geom/Vector2";

export class GameMap {

    private _map: Cell[][];
    private _height: number;
    private _width: number;

    
    public get height() : number {
        return this._height;
    }
    
    public get width() : number {
        return this._width;
    }

    constructor(width: number, height: number) {
        this._map = [];
        this._width = width;
        this._height = height;
    }

    public init(): void{
        for(let i: number = 0 ; i < this._height ; i++ ){
            this._map[i] = [];

            for(let j: number = 0 ; j < this._width ; j++){
                this._map[i][j] = new Cell();
            }
        }
    }

    public isInMap(x: number, y: number) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    public isCellFilled(x: number, y: number): boolean {
        return this.isInMap(x,y) && this._map[y][x].filled;
    }


    public clearCell(x: number, y: number): void {
        if(this.isInMap(x, y)) {
            this._map[y][x].filled = false;
        }
    }

    public clearShape(shape: Shape): void {
        shape.cells.forEach(cell => {
            this.clearCell(cell.X, cell.Y);
        });
    }

    public colorCell(x: number, y: number, color: string): void {
        if(this.isInMap(x, y)){
            this._map[y][x].filled = true;
            this._map[y][x].color = color;
        }
    }

    public colorShape(shape: Shape): void {
        shape.cells.forEach(cell => {
            this.colorCell(cell.X, cell.Y, shape.color);
        });
    }

    public anyFilledOnRow(row: number) {
        return this._map[row].some(cell => cell.filled);
    }

    public removeFilledLines(): number {
            
        let filledLinesCount = 0;

        for (let i = 0 ; i < this._map.length ; i++) {
            const filledLine : boolean = this._map[i].every(cell => cell.filled);

            if(filledLine) {
                filledLinesCount++;
                this._map.splice(i,1);
                let newRow: Cell[] = [];
                for(let j = 0 ; j < this._width ; j++) {
                    newRow[j] = new Cell();
                }

                this._map.unshift(newRow);
            }
        }

        return filledLinesCount;
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
    }
}