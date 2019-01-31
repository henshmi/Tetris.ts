
export class Vector2 {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get X() {
        return this._x;
    }
    
    get Y() {
        return this._y;
    }

    static get Zero() {
        return new Vector2(0, 0);
    }

    addX(x: number) {
        return new Vector2(this._x, this._y).addToX(x);
    }

    addY(y: number) {
        return new Vector2(this._x, this._y).addToY(y);
    }

    addToX(x: number) {
        this._x += x;
        return this;
    }

    addToY(y: number) {
        this._y += y;
        return this;
    }

    add(x : number, y: number) : void{
        this.addToX(x);
        this.addToY(y);
    }
}