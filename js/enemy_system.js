// attack_system.js

import { player } from './player.js';
import { characters } from './characters.js';

let projectiles = [];
let lastAttackTime = 0;

export function updateAttack(currentTime) {
    if (currentTime - lastAttackTime >= player.baseAttackInterval) {
        player.attackFunction(projectiles);
        lastAttackTime = currentTime;
    }
}

export function updateProjectiles(canvas) {
    projectiles.forEach((proj) => {
        proj.x += Math.cos(proj.angle) * proj.speed;
        proj.y += Math.sin(proj.angle) * proj.speed;
    });

    projectiles = projectiles.filter((proj) => {
        return proj.x > 0 && proj.x < canvas.width && proj.y > 0 && proj.y < canvas.height;
    });
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

// Ataques específicos por personagem
export function andywnAttack(projectilesArray) {
    const angle = Math.random() * Math.PI * 2;
    projectilesArray.push({
        x: player.x,
        y: player.y,
        radius: 8,
        speed: 4,
        color: 'purple',
        angle: angle
    });
}

export function kazuAttack(projectilesArray) {
    const angles = [-0.1, 0, 0.1]; // Três projéteis em leque
    angles.forEach((offset) => {
        projectilesArray.push({
            x: player.x,
            y: player.y,
            radius: 5,
            speed: 6,
            color: 'silver',
            angle: offset
        });
    });
}

export function testeAttack(projectilesArray) {
    projectilesArray.push({
        x: player.x,
        y: player.y,
        radius: 6,
        speed: 5,
        color: 'yellow',
        angle: -Math.PI / 2 // Direção para cima
    });
}
