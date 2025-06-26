import { characters } from './characters.js';

export function resizeCanvas(canvas) {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    canvas.width = Math.min(canvas.width, 1200);
    canvas.height = Math.min(canvas.height, 800);
}

export function showCharacterSelection(selectCharacterCallback) {
    const charSelectionDiv = document.getElementById('character-selection');
    const charListDiv = document.getElementById('character-list');
    charListDiv.innerHTML = '';

    for (const id in characters) {
        const character = characters[id];

        const card = document.createElement('div');
        card.className = 'character-card';

        const icon = document.createElement('div');
        icon.className = 'char-icon';
        icon.textContent = character.icon;

        const name = document.createElement('h3');
        name.textContent = character.name;

        const desc = document.createElement('p');
        desc.textContent = character.description;

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(desc);

        card.addEventListener('click', () => {
            selectCharacterCallback(id);
        });

        charListDiv.appendChild(card);
    }

    charSelectionDiv.style.display = 'block';
}

export function setupEventListeners() {
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('gameCanvas');
        resizeCanvas(canvas);
    });
}