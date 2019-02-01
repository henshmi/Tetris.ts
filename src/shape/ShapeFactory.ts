import { ShapeType } from "./ShapeType";
import { Vector2 } from "../geom/Vector2";
import { Shape } from "./Shape";
import { GAME_CONFIG } from "../game.config";

export class ShapeFactory {
    public createShape(shapeType: ShapeType, position: Vector2, shapeColor: string): Shape {

        let shapeCells: Vector2[] = [];
        let shapeOrigin: Vector2;

        switch(shapeType) {
            case ShapeType.I:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X, position.Y + 2),
                    new Vector2(position.X, position.Y + 3)
                ];
                shapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.J:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X, position.Y + 2),
                    new Vector2(position.X - 1, position.Y + 2),
                ];
                shapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.L:
                shapeCells = [
                    new Vector2(position.X, position.Y ),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X, position.Y + 2),
                    new Vector2(position.X + 1, position.Y + 2),
                ];
                shapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.O:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X + 1, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X + 1, position.Y + 1),
                ];
                shapeOrigin = null;
                break;
            case ShapeType.S:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X + 1, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X - 1, position.Y + 1),
                ];
                shapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.Z:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X - 1, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X + 1, position.Y + 1),
                ];
                shapeOrigin = new Vector2(position.X, position.Y + 1);
                break;
            case ShapeType.T:
                shapeCells = [
                    new Vector2(position.X, position.Y),
                    new Vector2(position.X, position.Y + 1),
                    new Vector2(position.X - 1, position.Y + 1),
                    new Vector2(position.X + 1, position.Y + 1),
                ];
                shapeOrigin = new Vector2(position.X, position.Y + 1);
                break;  
        }

        return new Shape(shapeType, shapeCells, shapeOrigin, shapeColor);
    }
}