export const GAME_CONFIG : any = {

    // PHYSICS
    UPDATE_AFTER_X_FRAMES: 40,

    // SIZING
    CELL_SIZE: 40,
    NEXT_SHAPE_CELL_SIZE: 10,

    // COLORS
    BACKGROUND_COLOR: '#28363B',
    STROKE_COLOR: 'black',
    SHAPE_COLORS: ["#F9B38F", "#BF6C86", "#84AF9C", "#6D5C80", "#FFA3D0", "#439F9E", "#EF5F3C"],
    
    // TEXTS
    FONT: '20px Comic Sans MS',    
    FONT_COLOR: 'white',
    SCORE_LABEL: 'Score: ',
    NEXT_SHAPE_LABEL: 'Next Shape: ',

    // POSITIONS
    SCORE_POSITION: {X: 10, Y: 25},
    NEXT_SHAPE_LABEL_POSITION: {X: 400, Y: 25},
    NEXT_SHAPE_POSITION: {X: 545, Y: 8},

    // KEYS
    LEFT_KEY: 37,
    RIGHT_KEY: 39,
    UP_KEY: 38,
    DOWN_KEY: 40,
    DROP: 13,

    // RULES
    FILLED_LINE_BONUS: 100,
    DROPPED_SHAPE_BONUS: 2,
    LOWERED_SHAPE_BONUS: 1,
};
