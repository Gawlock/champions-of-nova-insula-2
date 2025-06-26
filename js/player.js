// player.js

export let player = {
    x: 0,
    y: 0,
    radius: 20,
    speed: 5,
    color: 'deepskyblue',
    health: 100,
    maxHealth: 100,
    damageMultiplier: 1.0,
    collectionRadiusMultiplier: 1.0,
    baseProjectileDamage: 5,
    projectileCountMultiplier: 1,
    basicAttackLevel: 0,
    activeWeapons: [],
    hasShield: false,
    lastShieldUsedTime: 0,
    isInvulnerable: false,
    invulnerabilityStartTime: 0,
    invulnerabilityDuration: 1000,
    spriteSheet: null,
    spriteWidth: 0,
    spriteHeight: 0,
    useSprite: false,
    isMoving: false,
    direction: 'down',
    movementAngle: Math.PI / 2,
    heroicCharge: 0,
    maxHeroicCharge: 100,
    lastHeroicChargeTime: 0,
    heroicChargeInterval: 1000,
    heroicChargePerKill: 3,
    isHeroicAbilityActive: false,
    heroicAbilityEndTime: 0,
    originalBasicAttackInterval: 0,
    originalProjectileCountMultiplier: 0,
    originalProjectileSpeed: 0,
    originalProjectileLifespan: 0,
    originalProjectileRadius: 0,
    originalEnemySpeed: 0,
    originalBasicProjectileDamage: 0,
    attackFunction: null,
    baseAttackInterval: 1000
};

export function initPlayer(selectedCharacter, mapWidth, mapHeight, assetLoader) {
    player.x = mapWidth / 2;
    player.y = mapHeight / 2;
    player.speed = selectedCharacter.playerSpeed;
    player.color = selectedCharacter.playerColor || 'deepskyblue';
    player.health = selectedCharacter.startingHealth;
    player.maxHealth = selectedCharacter.startingHealth;
    player.damageMultiplier = 1.0;
    player.collectionRadiusMultiplier = 1.0;
    player.baseProjectileDamage = selectedCharacter.baseProjectileDamage || 5;
    player.projectileCountMultiplier = 1;
    player.basicAttackLevel = selectedCharacter.id !== 'teste' ? 1 : 0;
    player.activeWeapons = [];
    player.hasShield = false;
    player.lastShieldUsedTime = 0;
    player.isInvulnerable = false;
    player.invulnerabilityStartTime = 0;
    player.useSprite = false;
    player.spriteSheet = null;
    player.direction = 'down';
    player.movementAngle = Math.PI / 2;
    player.isMoving = false;
    player.heroicCharge = 0;
    player.lastHeroicChargeTime = 0;
    player.isHeroicAbilityActive = false;
    player.heroicAbilityEndTime = 0;

    player.baseAttackInterval = selectedCharacter.baseAttackInterval || 1000;
    player.attackFunction = selectedCharacter.attackFunction;

    if (selectedCharacter.spriteSheetUrl) {
        player.spriteSheet = assetLoader.getImage(`${selectedCharacter.id}_sheet`);
        if (player.spriteSheet) {
            player.spriteWidth = selectedCharacter.spriteWidth;
            player.spriteHeight = selectedCharacter.spriteHeight;
            player.useSprite = true;
        }
    }

    player.originalBasicAttackInterval = selectedCharacter.baseAttackInterval || 0;
    player.originalProjectileCountMultiplier = 1;
    player.originalProjectileSpeed = selectedCharacter.projectileSpeed || 0;
    player.originalProjectileLifespan = selectedCharacter.projectileLifespan || 0;
    player.originalProjectileRadius = selectedCharacter.baseProjectileRadius || 0;
    player.originalEnemySpeed = 1;
    player.originalBasicProjectileDamage = 5;
}
