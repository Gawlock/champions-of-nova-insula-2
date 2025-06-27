import { player } from './player.js';
import { weapons } from './weapons.js';

let weaponCooldowns = {};

export function updateActiveWeapons(currentTime, enemies, projectiles) {
    player.activeWeapons.forEach((weaponId) => {
        const weapon = weapons[weaponId];
        if (!weaponCooldowns[weaponId]) {
            weaponCooldowns[weaponId] = 0;
        }

        if (currentTime >= weaponCooldowns[weaponId]) {
            weapon.trigger(player, currentTime, enemies, projectiles);
            weaponCooldowns[weaponId] = currentTime + weapon.cooldown;
        }
    });
}

export function addWeapon(weaponId) {
    if (!player.activeWeapons.includes(weaponId)) {
        player.activeWeapons.push(weaponId);
    }
}
