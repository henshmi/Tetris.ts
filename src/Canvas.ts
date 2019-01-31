import { GAME_CONFIG } from './game.config';
import { Vector2 } from './geom/Vector2';
const CELL_SIZE = GAME_CONFIG.CELL_SIZE;

class Canvas2D {

    private _canvas : HTMLCanvasElement;
    private _context : CanvasRenderingContext2D;

    constructor(canvas : HTMLCanvasElement) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
    }

    get Width() {
        return this._canvas.width;
    }
    
    get Height() {
        return this._canvas.height;
    }

    clear() : void {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    drawBackground(backgroundColor: string) {
        this._context.save();
        this._context.fillStyle = backgroundColor;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.restore();
    }

    drawGrid(gridColor: string) {
        this._context.save();
        this._context.strokeStyle = gridColor;

        for(let i = 0 ; i < this.Width / CELL_SIZE ; i++){
            this._context.beginPath();
            this._context.moveTo(i * CELL_SIZE, 0);
            this._context.lineTo(i * CELL_SIZE, this.Height);
            this._context.stroke();
        }

        for(let i = 0 ; i < this.Height / CELL_SIZE ; i++){
            this._context.beginPath();
            this._context.moveTo(0, i * CELL_SIZE);
            this._context.lineTo(this.Width, i * CELL_SIZE);
            this._context.stroke();
        }

        this._context.restore();
    }

    drawRect(position: Vector2, color: string, width: number, height: number) : void {
        this._context.save();
        this._context.fillStyle = color;
        this._context.fillRect(position.X, position.Y, width, height);
        this._context.restore();
    }

    drawRectAtCell(i: number, j: number, color: string) : void {
        this.drawRect(new Vector2(j * CELL_SIZE,i * CELL_SIZE), color, CELL_SIZE, CELL_SIZE);
    }
}

const canvas : HTMLCanvasElement = document.getElementById('screen') as HTMLCanvasElement;
export const canvas2D = new Canvas2D(canvas);