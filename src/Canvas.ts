import { GAME_CONFIG } from './game.config';
import { Vector2 } from './geom/Vector2';

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

    drawRect(position: Vector2, fillColor: string, strokeColor: string, width: number, height: number) : void {
        this._context.save();
        this._context.strokeStyle = strokeColor;
        this._context.fillStyle = fillColor;
        this._context.fillRect(position.X, position.Y, width, height);
        this._context.strokeRect(position.X, position.Y, width, height);
        this._context.restore();
    }

    drawText(text: string, font:string, color: string, position: Vector2): void {
        this._context.save();
        this._context.fillStyle = color;
        this._context.font = font;
        this._context.fillText(text, position.X, position.Y);
        this._context.restore();
    }

    drawRectAtCell(i: number, j: number, fillColor: string, strokeColor: string, cellSize: number) : void {
        this.drawRect(new Vector2(j * cellSize,i * cellSize), fillColor, strokeColor, cellSize, cellSize);
    }
}

const canvas : HTMLCanvasElement = document.getElementById('screen') as HTMLCanvasElement;
export const canvas2D = new Canvas2D(canvas);