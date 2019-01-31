
export class Cell {

    private _filled : boolean;
    private _color : string;

    public get color() : string {
        return this._color;
    }
    public set color(v : string) {
        this._color = v;
    }

    public get filled() : boolean {
        return this._filled;
    }
    public set filled(v : boolean) {
        this._filled = v;
    }

    constructor() {
        this._filled = false;
    }
    
}