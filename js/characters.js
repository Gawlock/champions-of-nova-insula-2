export const characters = {
    andywn: {
        id: 'andywn', name: 'Andywn', icon: '✨', description: 'Magias fortes, lentas e teleguiadas.',
        playerSpeed: 4.5 * 0.5,
        playerColor: '#8A2BE2',
        baseProjectileRadius: 10,
        projectileSpeed: 4 * 0.6,
        projectileColor: 'purple',
        baseAttackInterval: 800 * 1.4,
        projectileLifespan: 60, // 1 segundo (60 frames)
        spriteSheetUrl: 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/playersprite/andsheetfinal.png', 
        spriteWidth: 40, 
        spriteHeight: 40, 
        spriteFrames: {
            up: { sx: 133, sy: 0, sWidth: 133, sHeight: 127 }, 
            down: { sx: 0, sy: 0, sWidth: 133, sHeight: 127 },   
            left: { sx: 266, sy: 0, sWidth: 133, sHeight: 127 }, 
            right: { sx: 399, sy: 0, sWidth: 133, sHeight: 127 } 
        },
        projectileSpriteUrl: 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/playersprite/projectileAndy.png',
        projectileSpriteWidth: 30,
        projectileSpriteHeight: 30,
        heroicAbility: (playerRef, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, mapWidth, mapHeight) => {
            enemiesRef.forEach(enemy => {
                const enemyDrawX = enemy.x - cameraX; // cameraX não está no escopo aqui, precisa ser passado ou acessado globalmente
                const enemyDrawY = enemy.y - cameraY; // cameraY não está no escopo aqui, precisa ser passado ou acessado globalmente
                if (enemyDrawX > -enemy.radius && enemyDrawX < canvas.width + enemy.radius && // canvas não está no escopo aqui
                    enemyDrawY > -enemy.radius && enemyDrawY < canvas.height + enemy.radius) { // canvas não está no escopo aqui
                    enemiesToRemove.add(enemy); // enemiesToRemove não está no escopo aqui
                    score += Math.round(10 * playerRef.damageMultiplier); // score não está no escopo aqui
                    orbsToSpawn.push({ x: enemy.x, y: enemy.y, radius: 8, color: 'lightgreen', value: 10 }); // orbsToSpawn não está no escopo aqui
                    explosions.push({ x: enemy.x, y: enemy.y, radius: enemy.radius * 2, color: 'magenta', duration: 10, type: 'flash' }); // explosions não está no escopo aqui
                }
            });
        }
    },
    kazu: {
        id: 'kazu', name: 'Kazu', icon: '⚔️', description: 'Espadas médias, rápido e teleguiadas.',
        playerSpeed: 5.5 * 0.5,
        baseProjectileRadius: 7,
        projectileSpeed: 6 * 0.6,
        projectileColor: 'silver',
        baseAttackInterval: 500 * 1.4,
        baseProjectileDamage: 10,
        spriteSheetUrl: 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/playersprite/kazusheetfinal2.png', 
        spriteWidth: 40, 
        spriteHeight: 40, 
        spriteFrames: { 
            up: { sx: 133, sy: 0, sWidth: 133, sHeight: 127 },
            down: { sx: 0, sy: 0, sWidth: 133, sHeight: 127 },
            left: { sx: 266, sy: 0, sWidth: 133, sHeight: 127 },
            right: { sx: 399, sy: 0, sWidth: 133, sHeight: 127 }
        },
        // Habilidade heroica removida para Kazu
        // removido heroicAbility e onHeroicAbilityEnd
    },
    raime: {
        id: 'raime', name: 'Raimé', icon: '👊', description: 'Socos fortes em arco de 180º, curto alcance.',
        playerSpeed: 5 * 0.5,
        playerColor: '#CD853F',
        baseProjectileRadius: 12,
        projectileSpeed: 10 * 0.6,
        projectileColor: 'orange',
        baseAttackInterval: 400 * 1.4,
        projectileMaxTravelDistance: 120,
        spriteSheetUrl: 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/playersprite/raimesheetfinal.png',
        spriteWidth: 40,
        spriteHeight: 40,
        spriteFrames: {
            up: { sx: 133, sy: 0, sWidth: 133, sHeight: 127 },
            down: { sx: 0, sy: 0, sWidth: 133, sHeight: 127 },
            left: { sx: 266, sy: 0, sWidth: 133, sHeight: 127 },
            right: { sx: 399, sy: 0, sWidth: 133, sHeight: 127 }
        },
        heroicAbility: (playerRef, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, mapWidth, mapHeight) => {
            playerRef.originalBasicAttackInterval = playerRef.baseAttackInterval;
            playerRef.baseAttackInterval = 100;
            playerRef.isHeroicAbilityActive = true;
            playerRef.heroicAbilityEndTime = performance.now() + 30000;
        },
        onHeroicAbilityEnd: (playerRef) => {
            playerRef.baseAttackInterval = playerRef.originalBasicAttackInterval;
        }
    },
    thorne: {
        id: 'thorne', name: 'Thorne', icon: '🎯', description: 'Tiros rápidos de baixo dano nas 4 diagonais.',
        playerSpeed: 5.2 * 0.5,
        baseProjectileRadius: 4,
        projectileSpeed: 9 * 0.6,
        projectileColor: 'lightblue',
        baseAttackInterval: 600 * 1.4,
        spriteSheetUrl: 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/playersprite/thornesheetfinal.png', 
        spriteWidth: 40, 
        spriteHeight: 40, 
        spriteFrames: { 
            up: { sx: 133, sy: 0, sWidth: 133, sHeight: 127 },
            down: { sx: 0, sy: 0, sWidth: 133, sHeight: 127 },
            left: { sx: 266, sy: 0, sWidth: 133, sHeight: 127 },
            right: { sx: 399, sy: 0, sWidth: 133, sHeight: 127 }
        },
        heroicAbility: (playerRef, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, mapWidth, mapHeight) => {
            playerRef.originalProjectileSpeed = playerRef.projectileSpeed;
            playerRef.projectileSpeed *= 2;
            
            playerRef.isHeroicAbilityActive = true;
            playerRef.heroicAbilityEndTime = performance.now() + 30000;
        },
        onHeroicAbilityEnd: (playerRef) => {
            playerRef.projectileSpeed = playerRef.originalProjectileSpeed;
        }
    },
    gaeru: {
        id: 'gaeru', name: 'Gaeru', icon: '⚡', description: 'Especialista em alvo único, tiro mais rápido, dano muito baixo. Mais rápido na movimentação.',
        playerSpeed: 6.5 * 0.5,
        playerColor: '#3CB371',
        baseProjectileRadius: 3,
        projectileSpeed: 12 * 0.6,
        projectileColor: 'lime',
        baseAttackInterval: 300 * 1.4,
        heroicAbility: (playerRef, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, mapWidth, mapHeight) => {
            playerRef.originalEnemySpeed = enemySpeed; // enemySpeed é global
            enemySpeed = 0;
            playerRef.originalBasicAttackInterval = playerRef.baseAttackInterval;
            playerRef.baseAttackInterval /= 2;
            playerRef.isHeroicAbilityActive = true;
            playerRef.heroicAbilityEndTime = performance.now() + 40000;
        },
        onHeroicAbilityEnd: (playerRef) => {
            enemySpeed = playerRef.originalEnemySpeed;
            playerRef.baseAttackInterval = playerRef.originalBasicAttackInterval;
        }
    },
    general: {
        id: 'general', name: 'General', icon: '🔫', description: 'Atira três tiros em leque na direção do inimigo. Dano médio.',
        playerSpeed: 4.8 * 0.5,
        playerColor: '#696969',
        baseProjectileRadius: 6,
        projectileSpeed: 7 * 0.6,
        projectileColor: 'darkgray',
        baseAttackInterval: 700 * 1.4,
        heroicAbility: (playerRef, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, mapWidth, mapHeight) => {
            playerRef.originalBaseProjectileDamage = playerRef.baseProjectileDamage; 
            playerRef.originalBasicAttackInterval = playerRef.baseAttackInterval;
            playerRef.originalProjectileRadius = playerRef.baseProjectileRadius;

            playerRef.baseProjectileRadius *= 3;
            playerRef.baseProjectileDamage *= 1.5;
            playerRef.baseAttackInterval /= 2;
            
            playerRef.isHeroicAbilityActive = true;
            playerRef.heroicAbilityEndTime = performance.now() + 30000;
        },
        onHeroicAbilityEnd: (playerRef) => {
            playerRef.baseProjectileRadius = playerRef.originalProjectileRadius;
            playerRef.baseProjectileDamage = playerRef.originalBasicProjectileDamage;
            playerRef.baseAttackInterval = playerRef.originalBasicAttackInterval;
        }
    },
    ito: {
        id: 'ito', name: 'Ito', icon: '🍳', description: 'Projéteis de tamanhos aleatórios, curto alcance.',
        playerSpeed: 5.3 * 0.5,
        playerColor: '#FFD700',
        projectileMinRadius: 5,
        projectileMaxRadius: 15,
        projectileSpeed: 8 * 0.6,
        projectileColor: '#8B4513',
        baseAttackInterval: 450 * 1.4,
        projectileLifespan: 30,
        heroicAbility: (playerRef, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, mapWidth, mapHeight) => {
            playerRef.health = playerRef.maxHealth;
            playerRef.originalBasicAttackInterval = playerRef.baseAttackInterval;
            playerRef.baseAttackInterval = 0;
            playerRef.isHeroicAbilityActive = true;
            playerRef.heroicAbilityEndTime = performance.now() + 30000;
        },
        onHeroicAbilityEnd: (playerRef) => {
            playerRef.baseAttackInterval = playerRef.originalBasicAttackInterval;
        }
    },
    teste: {
        id: 'teste', name: 'Teste', icon: '🧪', description: 'Personagem de teste. Escolha a sua arma inicial!',
        playerSpeed: 5.0 * 0.5,
        playerColor: '#808000',
        // Personagem Teste não possui habilidade heroica
    }
};
