
export class Cell {

    //------Members------//

    private _filled : boolean;
    private _color : string;

    //------Properties------//

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

    //------Constructor------//

    constructor() {
        this._filled = false;
    }
    
}