import {
    autoDetectRenderer,
    Application,
    BaseRenderTexture,
    Container,
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
} from "pixi.js";


// settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const CELL_SIZE = 5;
const WORLD_WIDTH = Math.ceil(WIDTH/CELL_SIZE);
const WORLD_HEIGHT = Math.ceil(HEIGHT/CELL_SIZE);
const GRAVITY = 0.1;


const app = new Application({
    antialias: false,
    width: WIDTH,
    height: HEIGHT,
});
// @ts-expect-error
document.body.appendChild(app.view);

const container = new Container();
// const container = new ParticleContainer(WIDTH*HEIGHT, {
//     scale: true,
//     position: true,
//     rotation: false,
//     uvs: false,
//     alpha: false,
// });
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


const buffer: Cell[] = new Array(WORLD_WIDTH*WORLD_HEIGHT).fill(0).map((_, i) => {
    const sprite = new Sprite(Texture.WHITE);
    
    sprite.x = (i%WORLD_WIDTH)     * CELL_SIZE;
    sprite.y = ((i/WORLD_WIDTH)|0) * CELL_SIZE;

    sprite.width = CELL_SIZE;
    sprite.height = CELL_SIZE;

    container.addChild(sprite);

    return {
        type: CellType.Air,
        vel: { x: 0, y: 0 },
        sprite,
    };
});
let types = buffer.map(({ type }) => type);


function is_empty(i: number) {
    return i > 0
        && i < WORLD_WIDTH*WORLD_HEIGHT
        && buffer[i].type === CellType.Air;
}
function swap(a: number, b: number) {
    types[a] = buffer[b].type;
    types[b] = buffer[a].type;
}

setInterval(() => {
    for (let i = buffer.length-1; i > 0; i --) {
        if (buffer[i].type === CellType.Sand) {
            // buffer[i].vel.y += GRAVITY;

            const down = i+WORLD_WIDTH;
            // const left = i-1;
            // const right = i+1;
            const down_left = i+WORLD_WIDTH-1;
            const down_right = i+WORLD_WIDTH+1;

            if (is_empty(down)) { swap(down, i); }
            else if (is_empty(down_left)) { swap(down_left, i); }
            else if (is_empty(down_right)) { swap(down_right, i); }
        }
    }
    for (let i = buffer.length-1; i > 0; i --) {
        buffer[i].type = types[i];
    }
}, 1000/120);

app.ticker.add((delta: number) => {
    if (mouse.is_pressed) {
        for (let i = 0; i < 10; i ++) {
            const r = Math.random() * Math.PI*2;
            const d = Math.random() * 25;

            const rx = mouse.x + Math.cos(r) * d;
            const ry = mouse.y + Math.sin(r) * d;

            const x = (rx/CELL_SIZE) | 0;
            const y = (ry/CELL_SIZE) | 0;
            const index = x + y*WORLD_WIDTH;
            
            buffer[index].type = CellType.Sand;
        }
    }

    for (let i = 0; i < buffer.length; i ++) {
        if (buffer[i].type === CellType.Sand) {
            buffer[i].sprite.tint = 0xc4ab5e;
        } else if (buffer[i].type === CellType.Air) {
            buffer[i].sprite.tint = 0xffffff;
        }
    }
});




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
