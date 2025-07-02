export const upgrades = {
    might: { name: 'Força', icon: '💪', description: 'Aumenta o dano dos seus ataques em 1%.', apply: () => { player.damageMultiplier *= 1.01; } }, // player é global
    dexterity: { name: 'Destreza', icon: '🏃‍♂️', description: 'Aumenta a sua velocidade de movimento. (Atualmente desativado)', apply: () => { /* Nenhuma alteração na velocidade aqui */ } },
    willpower: { name: 'Vigor', icon: '❤️', description: 'Aumenta a vida máxima em 1% e recupera vida proporcionalmente.', apply: () => { const healthIncrease = player.maxHealth * 0.01; player.maxHealth = Math.floor(player.maxHealth + healthIncrease); player.health = Math.min(Math.floor(player.health + healthIncrease), player.maxHealth); } }, // player é global
    insight: { name: 'Percepção', icon: '👁️', description: 'Aumenta o raio de coleta de orbes e itens em 1%.', apply: () => { player.collectionRadiusMultiplier *= 1.01; } } // player é global
};

export const weapons = {
    basic_attack_level_2: {
        id: 'basic_attack_level_2', name: 'Ataque Básico Nv. 2', icon: '⬆️', description: 'Aumenta o ataque básico para Nível 2. Projéteis +5% e um projétil extra com atraso.',
        type: 'basic_attack_level_up', nextLevel: 2,
        trigger: (playerRef) => { playerRef.basicAttackLevel = 2; }
    },
    basic_attack_level_3: {
        id: 'basic_attack_level_3', name: 'Ataque Básico Nv. 3', icon: '⬆️⬆️', description: 'Aumenta o ataque básico para Nível 3. Projéteis +10% e dois projéteis extras com atraso.',
        type: 'basic_attack_level_up', nextLevel: 3,
        trigger: (playerRef) => { playerRef.basicAttackLevel = 3; }
    },
    basic_attack_level_4: {
        id: 'basic_attack_level_4', name: 'Ataque Básico Nv. 4', icon: '⬆️⬆️⬆️', description: 'Aumenta o ataque básico para Nível 4. Projéteis +15% e três projéteis extras com atraso.',
        type: 'basic_attack_level_up', nextLevel: 4,
        trigger: (playerRef) => { playerRef.basicAttackLevel = 4; }
    },
    basic_attack_level_5: {
        id: 'basic_attack_level_5', name: 'Ataque Básico Nv. 5 (Máx)', icon: '✨⬆️', description: 'Aumenta o ataque básico para Nível 5 (Máx). Projéteis +20% e quatro projéteis extras com atraso.',
        type: 'basic_attack_level_up', nextLevel: 5,
        trigger: (playerRef) => { playerRef.basicAttackLevel = 5; }
    },
    rotating_chakram: {
        id: 'rotating_chakram', name: 'Chakram Rotatório', icon: '🥏', description: 'Um projétil lento que orbita o personagem e some após 3 segundos. Ativa-se a cada 5 segundos.',
        cooldown: 5000, type: 'projectile',
        projectileProps: { radius: 10, speed: 0, color: 'gold', baseDamage: 50, lifespan: 180, type: 'orbiting', orbitRadius: 60, orbitSpeed: 0.1, },
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            const initialOrbitAngle = Math.random() * Math.PI * 2;
            projectilesRef.push({
                x: playerRef.x, y: playerRef.y,
                radius: this.projectileProps.radius,
                speed: this.projectileProps.speed,
                color: this.projectileProps.color,
                damage: this.projectileProps.baseDamage * playerRef.damageMultiplier,
                lifespan: this.projectileProps.lifespan,
                type: this.projectileProps.type,
                orbitRadius: this.projectileProps.orbitRadius,
                orbitSpeed: this.projectileProps.orbitSpeed,
                currentOrbitAngle: initialOrbitAngle,
                creationTime: currentTime
            });
        }
    },
    dragon_god_sword: {
        id: 'dragon_god_sword', name: 'Espada do Deus Dragão', icon: '🐉', description: 'Um raio atinge um inimigo aleatório. Ativa-se a cada 3 segundos, causando dano massivo.',
        cooldown: 3000, type: 'instant_effect',
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            if (enemiesRef.length > 0) {
                const targetEnemyIndex = Math.floor(Math.random() * enemiesRef.length);
                const targetEnemy = enemiesRef[targetEnemyIndex];
                targetEnemy.health -= (50 * playerRef.damageMultiplier);
                if (targetEnemy.health <= 0) {
                    // enemiesToRemove.add(targetEnemy); // enemiesToRemove é global
                    // score += Math.round(10 * playerRef.damageMultiplier); // score é global
                    // orbsToSpawn.push({ x: targetEnemy.x, y: targetEnemy.y, radius: 8, color: 'lightgreen', value: 10 }); // orbsToSpawn é global
                }
                // explosions.push({ x: targetEnemy.x, y: targetEnemy.y, radius: 50, color: 'yellow', duration: 5, type: 'flash' }); // explosions é global
            }
        }
    },
    crazy_boomerang: {
        id: 'crazy_boomerang', name: 'Bumerangue Doido', icon: '🪃', description: 'Dispara um projétil que faz um movimento de "oito" e some ao completar. Ativa-se a cada 4 segundos.',
        cooldown: 4000, type: 'projectile',
        projectileProps: { radius: 10, color: 'brown', baseDamage: 30, type: 'figure_eight', loopDuration: 4000, loopSizeX: 100, loopSizeY: 50, },
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            projectilesRef.push({
                initialX: playerRef.x, initialY: playerRef.y,
                x: playerRef.x, y: playerRef.y,
                radius: this.projectileProps.radius,
                color: this.projectileProps.color,
                damage: this.projectileProps.baseDamage * playerRef.damageMultiplier,
                type: this.projectileProps.type,
                loopStartTime: currentTime,
                loopDuration: this.projectileProps.loopDuration,
                loopSizeX: this.projectileProps.loopSizeX,
                loopSizeY: this.projectileProps.loopSizeY,
                creationTime: currentTime
            });
        }
    },
    fogo_fatuo: {
        id: 'fogo_fatuo', name: 'Fogo Fátuo', icon: '🔵', description: 'Cria um círculo semitransparente de 10x o raio do personagem. Inimigos dentro levam 50 de dano por segundo. Recarrega a cada 1s e dura 4s.',
        cooldown: 1000, duration: 4000, type: 'timed_effect',
        auraProps: { radiusMultiplier: 10, damage: 50, color: 'darkblue', tickInterval: 1000 },
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            const existingEffect = activeAurasRef.find(eff => eff.id === this.id && eff.type === 'timed_aura_damage');
            if (!existingEffect) {
                activeAurasRef.push({
                    id: this.id, type: 'timed_aura_damage',
                    radius: playerRef.radius * this.auraProps.radiusMultiplier,
                    visualRadius: playerRef.radius * this.auraProps.radiusMultiplier,
                    damage: this.auraProps.damage,
                    color: this.auraProps.color,
                    startTime: currentTime,
                    endTime: currentTime + this.duration,
                    nextDamageTime: currentTime,
                    tickInterval: this.auraProps.tickInterval
                });
            }
        }
    },
    dog_shield: {
        id: 'dog_shield', name: 'Escudo do Cão', icon: '🛡️', description: 'Cria um escudo que protege do próximo dano. Recarrega a cada 5 segundos.',
        cooldown: 5000, type: 'passive_effect',
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {}
    },
    strong_bomb: {
        id: 'strong_bomb', name: 'Bomba Forte', icon: '💣', description: 'Cria um projétil que explode a cada 4 segundos, causando dano em área.',
        cooldown: 2000, type: 'projectile',
        projectileProps: { radius: 12, color: 'black', baseDamage: 0, fuseTime: 240, type: 'bomb', explosionRadius: 80, explosionDamage: 50 },
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            const nearestEnemy = getNearestEnemy(playerRef.x, playerRef.y, enemiesRef); // Passa enemiesRef
            const baseAngle = nearestEnemy ? Math.atan2(nearestEnemy.y - playerRef.y, nearestEnemy.x - playerRef.x) : Math.random() * Math.PI * 2;
            const dx = Math.cos(baseAngle);
            const dy = Math.sin(baseAngle);
            projectilesRef.push({
                x: playerRef.x, y: playerRef.y,
                radius: this.projectileProps.radius,
                speed: this.projectileProps.speed,
                color: this.projectileProps.color,
                damage: this.projectileProps.baseDamage * playerRef.damageMultiplier,
                dx: dx, dy: dy,
                type: this.projectileProps.type,
                fuseTime: this.projectileProps.fuseTime,
                explosionRadius: this.projectileProps.explosionRadius,
                explosionDamage: this.projectileProps.explosionDamage * playerRef.damageMultiplier,
                spawnTime: currentTime,
                creationTime: currentTime
            });
        }
    },
    holy_heal: {
        id: 'holy_heal', name: 'Cura Sagrada', icon: '💚', description: 'Cura 20 de vida. Ativa-se a cada 5 segundos.',
        cooldown: 5000, type: 'instant_effect',
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            playerRef.health = Math.min(playerRef.health + 20, playerRef.maxHealth);
        }
    },
    multiplier: {
        id: 'multiplier', name: 'Multiplicador', icon: '✖️', description: 'Dobra o número de projéteis emitido por 20 segundos. Recarrega a cada 20 segundos.',
        cooldown: 20000, duration: 20000, type: 'timed_effect',
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            const existingMultiplier = activeAurasRef.find(eff => eff.id === this.id && eff.type === 'projectileMultiplier');
            if (!existingMultiplier) {
                activeAurasRef.push({
                    id: this.id, type: 'projectileMultiplier',
                    multiplierValue: 2,
                    startTime: currentTime,
                    endTime: currentTime + this.duration
                });
                playerRef.projectileCountMultiplier = 2;
            }
        },
        onEnd: function(playerRef) {
            playerRef.projectileCountMultiplier = 1;
        }
    },
    laser: {
        id: 'laser', name: 'Laser', icon: '💥', description: 'Dispara uma linha contínua que atravessa o ecrã. Ativa-se a cada 4 segundos.',
        cooldown: 4000, type: 'projectile',
        projectileProps: { width: 8, height: 1.5, color: 'lime', baseDamage: 40, lifespan: 60, type: 'laser', }, // height será ajustado no resizeCanvas
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            const nearestEnemy = getNearestEnemy(playerRef.x, playerRef.y, enemiesRef); // Passa enemiesRef
            const baseAngle = nearestEnemy ? Math.atan2(nearestEnemy.y - playerRef.y, nearestEnemy.x - playerRef.x) : Math.random() * Math.PI * 2;
            projectilesRef.push({
                x: playerRef.x, y: playerRef.y,
                width: this.projectileProps.width,
                height: this.projectileProps.height * Math.max(canvas.width, canvas.height), // Ajusta a altura com base no canvas
                color: this.projectileProps.color,
                damage: this.projectileProps.baseDamage * playerRef.damageMultiplier,
                angle: baseAngle,
                lifespan: this.projectileProps.lifespan,
                type: this.projectileProps.type,
                creationTime: currentTime
            });
        }
    },
    experienced_orb: {
        id: 'experienced_orb', name: 'Experiente', icon: '🌟', description: 'Faz com que 5 orbes de experiência extras apareçam. Ativa-se a cada 10 segundos.',
        cooldown: 10000, type: 'instant_effect',
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            for (let i = 0; i < 5; i++) {
                experienceOrbsRef.push({ x: Math.random() * mapWidth, y: Math.random() * mapHeight, radius: 8, color: 'deepskyblue', value: 20 });
            }
        }
    },
    leech: {
        id: 'leech', name: 'Sanguessuga', icon: '🩸', description: 'Projétil super lento de dano alto que cura pela quantidade de dano causado ao matar. Ativa-se a cada 5 segundos.',
        cooldown: 5000, type: 'projectile',
        projectileProps: { radius: 8, speed: 1, color: 'darkred', baseDamage: 100, lifespan: 300, type: 'leech' },
        trigger: function(playerRef, currentTime, enemiesRef, projectilesRef, activeAurasRef, explosionsRef, experienceOrbsRef) {
            const nearestEnemy = getNearestEnemy(playerRef.x, playerRef.y, enemiesRef); // Passa enemiesRef
            const baseAngle = nearestEnemy ? Math.atan2(nearestEnemy.y - playerRef.y, nearestEnemy.x - playerRef.x) : Math.random() * Math.PI * 2;
            const dx = Math.cos(baseAngle);
            const dy = Math.sin(baseAngle);
            projectilesRef.push({
                x: playerRef.x, y: player.y,
                radius: this.projectileProps.radius,
                speed: this.projectileProps.speed,
                color: this.projectileProps.color,
                damage: this.projectileProps.baseDamage * playerRef.damageMultiplier,
                dx: dx, dy: dy,
                lifespan: this.projectileProps.lifespan,
                type: this.projectileProps.type,
                creationTime: currentTime
            });
        }
    }
};
