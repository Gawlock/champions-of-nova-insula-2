// characters.js

export const characters = {
    andywn: {
        id: 'andywn', name: 'Andywn', icon: '✨', description: 'Magias fortes, lentas e teleguiadas.',
        playerSpeed: 2.25,
        playerColor: '#8A2BE2',
        baseProjectileDamage: 30,
        baseProjectileRadius: 40,
        projectileSpeed: 3,
        projectileColor: 'purple',
        baseAttackInterval: 1120,
        projectileLifespan: 120,
        startingHealth: 90,
        spriteSheetUrl: 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/playersprite/andsheetfinal.png',
        spriteWidth: 40,
        spriteHeight: 40,
        spriteFrames: {
            up: { sx: 133, sy: 0, sWidth: 133, sHeight: 127 },
            down: { sx: 0, sy: 0, sWidth: 133, sHeight: 127 },
            left: { sx: 266, sy: 0, sWidth: 133, sHeight: 127 },
            right: { sx: 399, sy: 0, sWidth: 133, sHeight: 127 }
        }
    },
    kazu: {
        id: 'kazu', name: 'Kazu', icon: '⚔️', description: 'Espadas médias, rápido e teleguiadas.',
        playerSpeed: 2.75,
        baseProjectileRadius: 7,
        projectileSpeed: 3.6,
        projectileColor: 'silver',
        baseAttackInterval: 700,
        baseProjectileDamage: 10,
        startingHealth: 100,
        spriteSheetUrl: 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/playersprite/kazusheetfinal2.png',
        spriteWidth: 40,
        spriteHeight: 40,
        spriteFrames: {
            up: { sx: 133, sy: 0, sWidth: 133, sHeight: 127 },
            down: { sx: 0, sy: 0, sWidth: 133, sHeight: 127 },
            left: { sx: 266, sy: 0, sWidth: 133, sHeight: 127 },
            right: { sx: 399, sy: 0, sWidth: 133, sHeight: 127 }
        }
    },
    teste: {
        id: 'teste', name: 'Teste', icon: '🧪', description: 'Personagem de teste. Escolha a sua arma inicial!',
        playerSpeed: 2.5,
        playerColor: '#808000',
        startingHealth: 100,
    }
    // Adicione os demais personagens da mesma forma...
};
