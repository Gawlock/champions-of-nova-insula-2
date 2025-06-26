export let player = {
    x: 0,
    y: 0,
    radius: 20,
    speed: 5,
    color: 'deepskyblue',
    health: 100,
    maxHealth: 100,
    damageMultiplier: 1.0,
    baseAttackInterval: 1000,
    attackFunction: null
};

export function initPlayer(selectedCharacter, mapWidth, mapHeight, assetLoader) {
    player.x = mapWidth / 2;
    player.y = mapHeight / 2;
    player.speed = selectedCharacter.playerSpeed;
    player.color = selectedCharacter.playerColor || 'deepskyblue';
    player.health = selectedCharacter.startingHealth;
    player.maxHealth = selectedCharacter.startingHealth;
    player.damageMultiplier = 1.0;
    player.baseAttackInterval = selectedCharacter.baseAttackInterval || 1000;
    player.attackFunction = selectedCharacter.attackFunction;
}