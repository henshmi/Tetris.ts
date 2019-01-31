
class Keyboard {

    keysPressed : boolean[] = [];

    constructor() {
        document.addEventListener('keydown', (e) => {this.keyDown(e) });
    }

    keyDown(event: KeyboardEvent) {
        this.keysPressed[event.keyCode] = true;
    }

    reset() : void {
        this.keysPressed = [];
    }

    isPressed(keyCode: number) {
        return this.keysPressed[keyCode];
    }
}

export const keyboard = new Keyboard();