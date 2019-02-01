
class Keyboard {

    //------Members------//

    _keysPressed : boolean[] = [];
    
    //------Constructor------//

    constructor() {
        document.addEventListener('keydown', (e) => {this.keyDown(e) });
    }

    //------Private Methods------//

    private keyDown(event: KeyboardEvent) : void{
        this._keysPressed[event.keyCode] = true;
    }

    //------Public Methods------//

    public reset() : void {
        this._keysPressed = [];
    }

    public isPressed(keyCode: number): boolean {
        return this._keysPressed[keyCode];
    }
}

export const keyboard = new Keyboard();