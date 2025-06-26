// upgrades.js

export const upgrades = {
    might: {
        name: 'Força',
        icon: '💪',
        description: 'Aumenta o dano dos ataques em 1%.',
        apply: (player) => { player.damageMultiplier *= 1.01; }
    },
    dexterity: {
        name: 'Destreza',
        icon: '🏃‍♂️',
        description: 'Aumenta a velocidade dos projéteis em 1%.',
        apply: (player, selectedCharacter) => {
            selectedCharacter.projectileSpeed *= 1.01;
            console.log(`Nova velocidade: ${selectedCharacter.projectileSpeed.toFixed(2)}`);
        }
    },
    willpower: {
        name: 'Vigor',
        icon: '❤️',
        description: 'Aumenta a vida máxima em 1% e recupera proporcionalmente.',
        apply: (player) => {
            const healthIncrease = player.maxHealth * 0.01;
            player.maxHealth = Math.floor(player.maxHealth + healthIncrease);
            player.health = Math.min(Math.floor(player.health + healthIncrease), player.maxHealth);
        }
    },
    insight: {
        name: 'Percepção',
        icon: '👁️',
        description: 'Aumenta o raio de coleta de orbes em 20%.',
        apply: (player) => { player.collectionRadiusMultiplier *= 1.20; }
    }
};
