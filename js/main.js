// Arquivo principal do jogo

import { assetLoader } from './assets.js';
import { initPlayer, player } from './player.js';
import { characters } from './characters.js';
import { weapons } from './weapons.js';
import { upgrades } from './upgrades.js';
import { showCharacterSelection, setupEventListeners } from './utils.js';

// Carrega todos os assets e inicia o jogo
document.addEventListener('DOMContentLoaded', () => {
    assetLoader.loadAll(() => {
        showCharacterSelection();
        setupEventListeners();
    });
});

// Aqui você pode criar loops de animação e importar as demais lógicas depois
