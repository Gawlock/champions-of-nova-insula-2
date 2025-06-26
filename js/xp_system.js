// xp_system.js

import { player } from './player.js';

export let xp = 0;
export let level = 1;
export let xpToNextLevel = 100;

export function addXp(amount) {
    xp += amount;
    updateXpDisplay();

    if (xp >= xpToNextLevel) {
        levelUp();
    }
}

function levelUp() {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.2);
    updateXpDisplay();

    console.log('Level Up! Nível: ' + level);
    // Aqui você pode adicionar a lógica para mostrar upgrade selection
}

function updateXpDisplay() {
    document.getElementById('xp-display').textContent = `XP: ${xp}/${xpToNextLevel}`;
    document.getElementById('level-display').textContent = `Nível: ${level}`;
}
