import {
    Application,
} from "pixi.js";
import {
    CellType,
    cells,
    container,
    is_empty,
} from "./sand";
import {
    WIDTH,
    HEIGHT,
    CELL_SIZE,
    WORLD_WIDTH,
} from "./constants";
import {
    mouse,
} from "./mouse";




const app = new Application({
    antialias: false,
    width: WIDTH,
    height: HEIGHT,
});
document.body.appendChild(app.view as unknown as Node);
app.stage.addChild(container);

app.ticker.add(() => {
    if (mouse.is_pressed) {
        spawn_sand(mouse.x, mouse.y, 50);
    }
});

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
            cells[index].type = CellType.Sand;
            cells[index].sprite.tint = 0xc4ab5e;
        }
    }
}


