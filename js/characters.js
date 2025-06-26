import { andywnAttack, kazuAttack, testeAttack } from './attack_system.js';

export const characters = {
    andywn: {
        id: 'andywn',
        name: 'Andywn',
        icon: '✨',
        description: 'Magias fortes, lentas e teleguiadas.',
        playerSpeed: 2.25,
        playerColor: '#8A2BE2',
        baseAttackInterval: 1200,
        startingHealth: 90,
        attackFunction: andywnAttack
    },
    kazu: {
        id: 'kazu',
        name: 'Kazu',
        icon: '⚔️',
        description: 'Espadas médias, rápido e teleguiadas.',
        playerSpeed: 2.75,
        playerColor: '#C0C0C0',
        baseAttackInterval: 700,
        startingHealth: 100,
        attackFunction: kazuAttack
    },
    teste: {
        id: 'teste',
        name: 'Teste',
        icon: '🧪',
        description: 'Personagem de teste.',
        playerSpeed: 2.5,
        playerColor: '#808000',
        baseAttackInterval: 1000,
        startingHealth: 100,
        attackFunction: testeAttack
    }
};