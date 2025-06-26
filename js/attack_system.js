// attack_system.js

import { player } from './player.js';

let projectiles = [];
let lastAttackTime = 0;

export function updateAttack(currentTime) {
    if (currentTime - lastAttackTime >= 1000) { // Ataca a cada 1 segundo
        fireProjectile();
        lastAttackTime = currentTime;
    }
}

function fireProjectile() {
    projectiles.push({
        x: player.x,
        y: player.y,
        radius: 5,
        speed: 7,
        direction: 0, // Direção reta para cima (ajustável)
        color: 'yellow'
    });
}

export function updateProjectiles(canvas) {
    projectiles.forEach((proj) => {
        proj.y -= proj.speed;
    });

    projectiles = projectiles.filter((proj) => proj.y + proj.radius > 0);
}

export function drawProjectiles(ctx) {
    projectiles.forEach((proj) => {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fillStyle = proj.color;
        ctx.fill();
        ctx.closePath();
    });
}
