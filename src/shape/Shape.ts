import { ShapeType } from './ShapeType';
import { Vector2 } from './../geom/Vector2';

export class Shape {

    //------Members------//

    private _cells: Vector2[] = [];
    private _color: string = '';
    private _origin: Vector2 = null;
    private _shapeType: ShapeType;

    //------Properties------//
    
    public get shapeType() : ShapeType {
        return this._shapeType;
    }
    
    public get cells() : Vector2[] {
        return this._cells;
    }
    public set cells(cells : Vector2[]) {
        this._cells = cells;
    }

    public get origin() : Vector2 {
        return this._origin;
    }
    
    public get color() : string {
        return this._color;
    }

    //------Constructor------//
    
    constructor(shapeType: ShapeType, cells: Vector2[], origin: Vector2, color: string) {
        this._shapeType = shapeType;
        this._cells = cells;
        this._color = color;
        this._origin = origin;
    }

    //------Public Methods------//

    public isPartOfShape(cell: Vector2) {
        return this._cells.some(shapeCell => shapeCell.X === cell.X && shapeCell.Y === cell.Y);
    }

    public move(x: number = 0, y: number = 0) {
        if(this._origin){
            this._origin.addToX(x).addToY(y);
        }
        
        this.cells.forEach(cell => cell.addToX(x).addToY(y));
    }
}