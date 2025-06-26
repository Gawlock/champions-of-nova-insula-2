export const weapons = {
    basic_attack_level_2: {
        id: 'basic_attack_level_2',
        name: 'Ataque Básico Nv. 2',
        icon: '⬆️',
        description: 'Aumenta o ataque básico para Nível 2.',
        type: 'basic_attack_level_up',
        nextLevel: 2,
        trigger: (playerRef) => { playerRef.basicAttackLevel = 2; }
    },

    rotating_chakram: {
        id: 'rotating_chakram',
        name: 'Chakram Rotatório',
        icon: '🥏',
        description: 'Projétil lento que orbita o personagem. Ativa a cada 5s.',
        cooldown: 5000,
        type: 'projectile',
        projectileProps: {
            radius: 10,
            speed: 0,
            color: 'gold',
            baseDamage: 50,
            lifespan: 180,
            type: 'orbiting',
            orbitRadius: 60,
            orbitSpeed: 0.1
        },
        trigger: function (playerRef, currentTime, enemiesRef, projectilesRef) {
            const initialOrbitAngle = Math.random() * Math.PI * 2;
            projectilesRef.push({
                x: playerRef.x,
                y: playerRef.y,
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
    }
    // Você pode adicionar mais armas personalizadas aqui.
};
