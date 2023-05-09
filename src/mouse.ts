export const mouse = {
    is_pressed: false,
    y: 0,
    x: 0,
    p_x: 0,
    p_y: 0,
}
document.addEventListener("mousemove", (e) => {
    mouse.p_x = mouse.x;
    mouse.p_y = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
document.addEventListener("mousedown", () => {
    mouse.is_pressed = true;
});
document.addEventListener("mouseup", () => {
    mouse.is_pressed = false;
});