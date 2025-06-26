import { initPlayer, player } from './player.js';
import { initCharacters, characters } from './characters.js';
import { initWeapons, weapons } from './weapons.js';
import { upgrades } from './upgrades.js';
import { assetLoader } from './assets.js';
import { showCharacterSelection, setupEventListeners } from './utils.js';

// Inicializa os assets e o jogo
window.onload = () => {
    assetLoader.loadAll(() => {
        showCharacterSelection();
        setupEventListeners();
    });
};

// Você pode importar e organizar as funções de inicialização e loops aqui também.
