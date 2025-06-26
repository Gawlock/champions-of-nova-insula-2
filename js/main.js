// Arquivo principal do jogo

import { assetLoader } from './assets.js';
import { initPlayer, player } from './player.js';
import { characters } from './characters.js';
import { weapons } from './weapons.js';
import { upgrades } from './upgrades.js';
import { showCharacterSelection, setupEventListeners, hideMessageBox } from './utils.js';
import { initGameLoop } from './game.js';

// Carrega todos os assets e inicia o jogo
document.addEventListener('DOMContentLoaded', () => {
    assetLoader.loadAll(() => {
        showCharacterSelection(selectCharacter);
        setupEventListeners();
    });
});

// Função chamada ao iniciar o jogo
export function startGame() {
    const canvas = document.getElementById('gameCanvas');
    initGameLoop(canvas);
}

// Função para selecionar o personagem e iniciar o jogo
function selectCharacter(characterId) {
    const selectedCharacter = characters[characterId];
    if (!selectedCharacter) return;

    document.getElementById('character-selection').style.display = 'none';

    const canvas = document.getElementById('gameCanvas');
    initPlayer(selectedCharacter, canvas.width, canvas.height, assetLoader);

    startGame();
}
