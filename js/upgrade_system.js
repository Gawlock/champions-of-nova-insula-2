import { upgrades } from './upgrades.js';
import { player } from './player.js';
import { addWeapon } from './weapon_system.js';

card.addEventListener('click', () => {
    if (upgrade.type === 'weapon') {
        addWeapon(upgrade.id);
    } else {
        upgrade.apply(player);
    }
    hideUpgradeSelection();
});

let isPaused = false;

export function showUpgradeSelection() {
    isPaused = true;

    const upgradeDiv = document.getElementById('upgrade-selection');
    const upgradeList = document.getElementById('upgrade-list');
    upgradeList.innerHTML = '';

    // Sorteia 3 upgrades aleatórios
    const upgradeKeys = Object.keys(upgrades);
    const selectedUpgrades = shuffle(upgradeKeys).slice(0, 3);

    selectedUpgrades.forEach((key) => {
        const upgrade = upgrades[key];

        const card = document.createElement('div');
        card.className = 'upgrade-card';

        const icon = document.createElement('div');
        icon.className = 'upgrade-icon';
        icon.textContent = upgrade.icon;

        const name = document.createElement('h3');
        name.textContent = upgrade.name;

        const desc = document.createElement('p');
        desc.textContent = upgrade.description;

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(desc);

        card.addEventListener('click', () => {
            upgrade.apply(player);
            hideUpgradeSelection();
        });

        upgradeList.appendChild(card);
    });

    upgradeDiv.style.display = 'block';
}

export function hideUpgradeSelection() {
    const upgradeDiv = document.getElementById('upgrade-selection');
    upgradeDiv.style.display = 'none';
    isPaused = false;
}

export function isGamePaused() {
    return isPaused;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
