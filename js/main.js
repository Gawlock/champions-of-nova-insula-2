import { assetLoader } from './assets.js';
import { initPlayer, player } from './player.js';
import { characters } from './characters.js';
import { showCharacterSelection, setupEventListeners, resizeCanvas } from './utils.js';
import { initGameLoop } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 1500;
    canvas.height = 900;

       assetLoader.loadAll(() => {
        showCharacterSelection(selectCharacter);
        setupEventListeners();
    });
});

export function startGame() {
    const canvas = document.getElementById('gameCanvas');
    initGameLoop(canvas);
}

function selectCharacter(characterId) {
    const selectedCharacter = characters[characterId];
    if (!selectedCharacter) return;

    document.getElementById('character-selection').style.display = 'none';

    const canvas = document.getElementById('gameCanvas');
    initPlayer(selectedCharacter, canvas.width, canvas.height, assetLoader);

    startGame();
}
