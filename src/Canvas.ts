import { GAME_CONFIG } from './game.config';
import { Vector2 } from './geom/Vector2';

class Canvas2D {

    //------Members------//

    private _canvasContainer: HTMLElement;
    private _canvas : HTMLCanvasElement;
    private _context : CanvasRenderingContext2D;
    private _dpi: number;

    //------Constructor------//

    constructor(canvas : HTMLCanvasElement, canvasContainer: HTMLElement) {
        this._canvasContainer = canvasContainer;
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this.resizeCanvas();
    }

    //------Private Methods------//

    private fixDPI(scale: Vector2){
        //get DPI
        this._dpi = window.devicePixelRatio;

        //get CSS height
        //the + prefix casts it to an integer
        //the slice method gets rid of "px"
        let style_height: number = +getComputedStyle(this._canvas).getPropertyValue("height").slice(0, -2);
        
        //get CSS width
        let style_width: number = +getComputedStyle(this._canvas).getPropertyValue("width").slice(0, -2);
        
        //scale the canvas
        this._canvas.setAttribute('height', (style_height * this._dpi).toString());
        this._canvas.setAttribute('width', (style_width * this._dpi).toString());

        this._context.scale(this._dpi * scale.X, this._dpi * scale.Y);
    }

    //------Public Methods------//

    public resizeCanvas(): void {
        
        const originalCanvasWidth = GAME_CONFIG.GAME_WIDTH * GAME_CONFIG.CELL_SIZE;
        const originalCanvasHeight = GAME_CONFIG.GAME_HEIGHT * GAME_CONFIG.CELL_SIZE;
        const widthToHeight: number = originalCanvasWidth / originalCanvasHeight;

        let newHeight: number = window.innerHeight - 10 >= GAME_CONFIG.CANVAS_MIN_HEIGHT ? window.innerHeight - 10 : GAME_CONFIG.CANVAS_MIN_HEIGHT;
        let newWidth: number = window.innerWidth >= GAME_CONFIG.CANVAS_MIN_WIDTH ? window.innerWidth : GAME_CONFIG.CANVAS_MIN_WIDTH;
       
        const newWidthToHeight: number = newWidth / newHeight;

        newWidth = newWidthToHeight > widthToHeight ? newHeight * widthToHeight : newWidth / widthToHeight;
        
        this._canvasContainer.style.width = newWidth + 'px';
        this._canvasContainer.style.height = newHeight + 'px';
        this._canvasContainer.style.marginLeft = (window.innerWidth - 20 - newWidth) / 2 + 'px';
        this._canvasContainer.style.marginRight = (window.innerWidth - 20 - newWidth) / 2 + 'px';
        
        const scale = new Vector2(newWidth / originalCanvasWidth, newHeight / originalCanvasHeight);

        this._canvas.width = newWidth;
        this._canvas.height = newHeight;

        this.fixDPI(scale);
    }


    public clear() : void {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    public drawBackground(backgroundColor: string) {
        this._context.save();
        this._context.fillStyle = backgroundColor;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.restore();
    }

    public drawRect(position: Vector2, fillColor: string, strokeColor: string, width: number, height: number) : void {
        this._context.save();
        this._context.lineWidth = GAME_CONFIG.STROKE_WIDTH;
        this._context.strokeStyle = strokeColor;
        this._context.fillStyle = fillColor;
        this._context.fillRect(position.X, position.Y, width, height);
        this._context.strokeRect(position.X, position.Y, width, height);
        this._context.restore();
    }

    public drawText(text: string, font:string, color: string, position: Vector2, textAlign: string = 'left'): void {
        this._context.save();
        this._context.fillStyle = color;
        this._context.font = font;
        this._context.textAlign = textAlign as CanvasTextAlign;
        this._context.fillText(text, position.X, position.Y);
        this._context.restore();
    }

    public drawRectAtCell(i: number, j: number, fillColor: string, strokeColor: string, cellSize: number) : void {
        this.drawRect(new Vector2(j * cellSize,i * cellSize), fillColor, strokeColor, cellSize, cellSize);
    }
}

const canvas : HTMLCanvasElement = document.getElementById('screen') as HTMLCanvasElement;
const container : HTMLElement = document.getElementById('screen') as HTMLElement;
export const canvas2D = new Canvas2D(canvas, container);

window.addEventListener('resize', canvas2D.resizeCanvas.bind(canvas2D));
