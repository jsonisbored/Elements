import {
    autoDetectRenderer,
    Application,
    BaseRenderTexture,
    Container,
    Filter,
    Geometry,
    Graphics,
    RenderTexture,
    Matrix,
    MSAA_QUALITY,
    ParticleContainer,
    Sprite,
    TilingSprite,
    Text,
    Texture,
    settings,
    Shader,
    Mesh,
} from "pixi.js";


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const CELL_SIZE = 6;
const WORLD_WIDTH = Math.ceil(WIDTH/CELL_SIZE);
const WORLD_HEIGHT = Math.ceil(HEIGHT/CELL_SIZE);
const WORLD_SIZE = WORLD_WIDTH * WORLD_HEIGHT;


const app = new Application({
    antialias: false,
    width: WIDTH,
    height: HEIGHT,
});
document.body.appendChild(app.view as unknown as Node);

const container = new ParticleContainer(WORLD_SIZE, {
    tint: true,
    
}, 16383);
app.stage.addChild(container);


enum CellType {
    Air,
    Sand,
    Water,
}
interface Vec2 {
    x: number,
    y: number,
}
interface Cell {
    type: CellType,
    vel: Vec2,
    sprite: Sprite,
}


const world: Cell[] = new Array(WORLD_SIZE).fill(0).map((_, i) => {
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
let types = world.map(({ type }) => type);


function is_empty(i: number) {
    return i > 0
        && i < WORLD_SIZE
        && types[i] === CellType.Air;
}
function swap(a: number, b: number) {
    const temp = world[a];

    world[a].sprite.x = (b%WORLD_WIDTH)   * CELL_SIZE;
    world[a].sprite.y = (b/WORLD_WIDTH|0) * CELL_SIZE;
    world[a] = world[b];

    world[b].sprite.x = (a%WORLD_WIDTH)   * CELL_SIZE;
    world[b].sprite.y = (a/WORLD_WIDTH|0) * CELL_SIZE;
    world[b] = temp;
}


let lastFrame = Date.now();
let delta = 0;
setInterval(function physics() {
    delta = Date.now()-lastFrame;
    lastFrame = Date.now();

    if (mouse.is_pressed) {
        spawn_sand(mouse.x, mouse.y, 50);
    }
    
    for (let i = world.length-1; i > 0; i --) {
        types[i] = world[i].type;
    }

    for (let i = world.length-1; i > 0; i --) {
        if (types[i] === CellType.Sand) {
            world[i].vel.y += delta / 100;

            const pos_y = WORLD_WIDTH * (world[i].vel.y|0 + 1);
            
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
                world[i].vel.y = 0;
            }
        }
    }
}, 1000/60);


function spawn_sand(mouse_x: number, mouse_y: number, amount: number) {
    for (let i = 0; i < amount; i ++) {
        const r = Math.random() * Math.PI*2;
        const d = Math.random() * 40;

        const rx = mouse_x + Math.cos(r) * d;
        const ry = mouse_y + Math.sin(r) * d;

        const x = rx/CELL_SIZE | 0;
        const y = ry/CELL_SIZE | 0;
        const index = x + y*WORLD_WIDTH;
        
        if (is_empty(index)) {
            world[index].type = CellType.Sand;
            world[index].sprite.tint = 0xc4ab5e;
        }
    }
}


const mouse = {
    is_pressed: false,
    x: 0,
    y: 0,
}
document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
document.addEventListener("mousedown", () => {
    mouse.is_pressed = true;
});
document.addEventListener("mouseup", () => {
    mouse.is_pressed = false;
});
