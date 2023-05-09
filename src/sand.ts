import {
    Sprite,
    Texture,
    ParticleContainer,
} from "pixi.js";
import {
    WORLD_SIZE,
    WORLD_WIDTH,
    CELL_SIZE,
} from "./constants";


export enum CellType {
    Air,
    Sand,
    Water,
}
export interface Vec2 {
    x: number,
    y: number,
}
export interface Cell {
    type: CellType,
    vel: Vec2,
    sprite: Sprite,
}


export const container = new ParticleContainer(WORLD_SIZE, {
    tint: true,
}, 16383);

export const cells: Cell[] = new Array(WORLD_SIZE).fill(0).map((_, i) => {
    const sprite = new Sprite(Texture.WHITE);
    
    sprite.x = (i%WORLD_WIDTH)   * CELL_SIZE;
    sprite.y = (i/WORLD_WIDTH|0) * CELL_SIZE;

    sprite.width = CELL_SIZE;
    sprite.height = CELL_SIZE;

    container.addChild(sprite);

    return {
        type: CellType.Air,
        vel: { x: 0, y: 0 },
        sprite,
    };
});
const types = cells.map(({ type }) => type);


let lastFrame = Date.now();
let delta = 0;
setInterval(function physics() {
    delta = Date.now()-lastFrame;
    lastFrame = Date.now();

    
    for (let i = cells.length-1; i > 0; i --) {
        types[i] = cells[i].type;
    }

    for (let i = cells.length-1; i > 0; i --) {
        if (types[i] === CellType.Sand) {
            cells[i].vel.y += delta / 100;

            const pos_y = WORLD_WIDTH * (cells[i].vel.y|0 + 1);
            
            const down = i + pos_y;
            const down_left = i + pos_y - 1;
            const down_right = i + pos_y + 1;

            if (is_empty(down)) {
                swap(down, i);
            } else if (is_empty(down_left)) {
                swap(down_left, i);
            } else if (is_empty(down_right)) {
                swap(down_right, i);
            } else {
                cells[i].vel.y = 0;
            }
        }
    }
}, 1000/60);


export function is_empty(i: number): boolean {
    return i > 0
        && i < WORLD_SIZE
        && types[i] === CellType.Air;
}
export function swap(a: number, b: number) {
    const temp = cells[a];

    cells[a].sprite.x = (b%WORLD_WIDTH)   * CELL_SIZE;
    cells[a].sprite.y = (b/WORLD_WIDTH|0) * CELL_SIZE;
    cells[a] = cells[b];

    cells[b].sprite.x = (a%WORLD_WIDTH)   * CELL_SIZE;
    cells[b].sprite.y = (a/WORLD_WIDTH|0) * CELL_SIZE;
    cells[b] = temp;
}