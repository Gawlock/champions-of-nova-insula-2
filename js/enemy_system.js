import { player } from './player.js';
import { getProjectiles } from './attack_system.js';
import { addXp } from './xp_system.js';

let enemies = [];
let spawnInterval = 2000;
let lastSpawnTime = 0;

export function updateEnemies(currentTime, canvas) {
    if (currentTime - lastSpawnTime >= spawnInterval) {
        spawnEnemy(canvas);
        lastSpawnTime = currentTime;
    }

    enemies.forEach((enemy) => {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;
    });
}

function spawnEnemy(canvas) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push({ x, y, radius: 15, speed: 1.5, health: 10 });
}

export function drawEnemies(ctx) {
    enemies.forEach((enemy) => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    });
}

export function checkCollisions() {
    const projectiles = getProjectiles();

    projectiles.forEach((proj) => {
        enemies.forEach((enemy) => {
            const dx = proj.x - enemy.x;
            const dy = proj.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < proj.radius + enemy.radius) {
                enemy.health -= 10;
                proj.toRemove = true;
                if (enemy.health <= 0) {
                    enemy.toRemove = true;
                    addXp(20);
                }
            }
        });
    });

    enemies = enemies.filter((enemy) => !enemy.toRemove);
}
