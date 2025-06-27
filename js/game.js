import { player } from './player.js';
import { updateAttack, updateProjectiles, drawProjectiles } from './attack_system.js';
import { updateEnemies, drawEnemies, checkCollisions } from './enemy_system.js';
import { isGamePaused } from './upgrade_system.js';
import { updateActiveWeapons } from './weapon_system.js';
import { getEnemies } from './enemy_system.js';
import { getProjectiles } from './attack_system.js';


let keys = { w: false, a: false, s: false, d: false };
let canvas = null;
let ctx = null;

export function initGameLoop(gameCanvas) {
    canvas = gameCanvas;
    ctx = canvas.getContext('2d');
    setupMovementListeners();
    requestAnimationFrame(gameLoop);
}

function setupMovementListeners() {
    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.key.toLowerCase())) {
            keys[e.key.toLowerCase()] = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.key.toLowerCase())) {
            keys[e.key.toLowerCase()] = false;
        }
    });
}

function gameLoop(timestamp) {
    if (!isGamePaused()) {
        update(timestamp);
        draw();
    }
    requestAnimationFrame(gameLoop);
}


function update(timestamp) {
    const speed = player.speed;
    if (keys.w) player.y -= speed;
    if (keys.s) player.y += speed;
    if (keys.a) player.x -= speed;
    if (keys.d) player.x += speed;

    updateAttack(timestamp);
    updateProjectiles(canvas);
    updateEnemies(timestamp, canvas);
    checkCollisions();
    updateActiveWeapons(timestamp, getEnemies(), getProjectiles());
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    drawProjectiles(ctx);
    drawEnemies(ctx);
}
