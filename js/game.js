import { characters } from './characters.js';
import { upgrades, weapons } from './weapons.js';
import { assetLoader, showMessageBox, hideMessageBox, getNearestEnemy, updateGameInfoUI } from './utils.js';
import { KAZU_ACCORDION_AMPLITUDE, KAZU_ACCORDION_FREQUENCY, TIME_INTERVAL_FOR_SPEED_INCREASE, SPEED_INCREASE_PERCENTAGE } from './constants.js';

// Obtém o elemento canvas e seu contexto de renderização 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis de estado do jogo
let gameRunning = false;
let selectedCharacter = null;
let isLevelingUp = false;
let isChoosingWeapon = false;
let isChoosingInitialWeapon = false;

// Variáveis de dimensão do mapa
let mapWidth = 0;
let mapHeight = 0;
let cameraX = 0; // Posição X da câmera (canto superior esquerdo da tela visível no mapa)
let cameraY = 0; // Posição Y da câmera (canto superior esquerdo da tela visível no mapa)

// Objeto do jogador com propriedades iniciais
let player = {
    x: 0, // Posição X do jogador no mapa (será centralizado no início)
    y: 0, // Posição Y do jogador no mapa (será centralizado no início)
    radius: 15, // Raio de colisão do jogador
    speed: 5, // Velocidade de movimento do jogador
    color: 'deepskyblue', // Cor padrão do jogador
    health: 100, // Vida atual
    maxHealth: 100, // Vida máxima
    damageMultiplier: 1.0, // Multiplicador de dano do jogador
    collectionRadiusMultiplier: 1.0, // Multiplicador do raio de coleta de orbes de experiência
    baseProjectileDamage: 5, // Dano base do projétil primário do personagem
    projectileCountMultiplier: 1, // Multiplicador para o número de projéteis disparados (para armas secundárias)
    basicAttackLevel: 0, // Nível do ataque básico (inicializado em 0, definido para 1 em selectCharacter)
    activeWeapons: [], // Array para armazenar armas ativas (escolhidas no level up)
    hasShield: false, // Flag para o status do escudo (da arma Escudo do Cão)
    lastShieldUsedTime: 0, // Timestamp do último uso do escudo
    isInvulnerable: false, // Flag para invulnerabilidade
    invulnerabilityStartTime: 0, // Timestamp de início da invulnerabilidade
    invulnerabilityDuration: 1000, // Duração da invulnerabilidade em ms (1 segundo)
    spriteSheet: null, // Referência à imagem da sprite sheet carregada
    spriteWidth: 0, // Largura de um único quadro na sprite sheet
    spriteHeight: 0, // Altura de um único quadro na sprite sheet
    useSprite: false, // Flag para indicar se a sprite deve ser usada
    isMoving: false, // Flag para indicar se o jogador está se movendo atualmente
    direction: 'down', // Direção atual para animação da sprite

    // --- Propriedades da Habilidade Heroica ---
    heroicCharge: 0,
    maxHeroicCharge: 100, // Exemplo: 100 pontos para carga total
    lastHeroicChargeTime: 0,
    heroicChargeInterval: 1000, // Ganha carga a cada 1 segundo
    heroicChargePerKill: 5, // Ganha 5 de carga por inimigo abatido
    isHeroicAbilityActive: false,
    heroicAbilityEndTime: 0,
    originalBasicAttackInterval: 0, // Para Raimé e Ito
    originalProjectileCountMultiplier: 0, // Para Kazu
    originalProjectileSpeed: 0, // Para Thorne
    originalProjectileLifespan: 0, // Para Thorne
    originalProjectileRadius: 0, // Para General
    originalEnemySpeed: 0, // Para Gaeru
    originalBasicProjectileDamage: 0, // Para General
};

// Arrays de entidades do jogo
let projectiles = []; // Array de projéteis ativos
let enemies = []; // Array de inimigos ativos
let experienceOrbs = []; // Array de orbes de experiência no campo
let activeAuras = []; // Array de efeitos de aura ativos (ex: Fogo Fátuo)
let explosions = []; // Array de efeitos visuais de explosão
let score = 0; // Pontuação do jogador
let currentExperience = 0; // Pontos de experiência atuais
let currentLevel = 1; // Nível atual do jogador
let experienceToNextLevel = 100; // XP necessário para o próximo nível
let lastBasicAttackTime = 0; // Cooldown para o ataque básico
let lastEnemySpawnTime = 0; // Timestamp do último spawn de inimigo
let enemySpawnInterval = 800; // Tempo (ms) entre os spawns de inimigos
let enemySpeed = 1; // Velocidade base dos inimigos

const enemyDamageToPlayer = 5; // Dano causado pelos inimigos em colisão
let projectilesToRemove = new Set(); // Conjunto para rastrear projéteis a serem removidos
let enemiesToRemove = new Set(); // Conjunto para rastrear inimigos a serem removidos
let orbsToSpawn = []; // Array temporário para orbes gerados a partir da morte de inimigos

// Função para redimensionar o canvas dinamicamente com base no tamanho da janela
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    // Limita o tamanho do canvas para telas maiores
    canvas.width = Math.min(canvas.width, 1200);
    canvas.height = Math.min(canvas.height, 800);

    // Atualiza as dimensões do mapa quando o canvas é redimensionado
    mapWidth = canvas.width * 2;
    mapHeight = canvas.height * 2;

    // Se o jogo estiver rodando e nenhum menu estiver aberto, redesenha
    if (gameRunning && !isLevelingUp && !isChoosingWeapon && !isChoosingInitialWeapon) {
        draw();
    }
    // Centraliza o jogador no mapa se o jogo estiver rodando
    if (gameRunning && player) {
        player.x = mapWidth / 2; // Centraliza o jogador no mapa
        player.y = mapHeight / 2; // Centraliza o jogador no mapa
    }
    // Atualiza a altura do projétil Laser se existir
    if (weapons.laser && weapons.laser.projectileProps) {
        weapons.laser.projectileProps.height = Math.max(canvas.width, canvas.height) * 1.5;
    }
}

// Listener de evento para redimensionamento da janela
window.addEventListener('resize', resizeCanvas);
// Chamada inicial de redimensionamento do canvas
resizeCanvas();

// Objeto para rastrear teclas pressionadas para movimento do jogador
let keys = { w: false, a: false, s: false, d: false, x: false }; // Adiciona 'x' para a habilidade heroica

// Listener de evento para pressionar teclas
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key.toLowerCase())) {
        keys[e.key.toLowerCase()] = true;
        e.preventDefault(); // Previne o comportamento padrão do navegador (ex: rolagem)
    }
    // Ativa a habilidade heroica com 'X'
    if (e.key.toLowerCase() === 'x' && !isLevelingUp && !isChoosingWeapon && !isChoosingInitialWeapon && gameRunning) {
        if (player.heroicCharge >= player.maxHeroicCharge && selectedCharacter.heroicAbility) {
            player.heroicCharge = 0; // Zera a barra
            selectedCharacter.heroicAbility(player, enemies, projectiles, activeAuras, explosions, mapWidth, mapHeight);
        }
    }
});

// Listener de evento para soltar teclas
document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key.toLowerCase())) {
        keys[e.key.toLowerCase()] = false;
    }
});

// Função para lidar com o level up do jogador
function levelUp() {
    currentLevel++; // Aumenta o nível
    currentExperience -= experienceToNextLevel; // Deduz o XP necessário para o level up
    experienceToNextLevel = Math.floor(experienceToNextLevel * 1.2); // Aumenta o XP necessário para o próximo nível
    updateGameInfoUI(score, currentLevel, currentExperience, experienceToNextLevel); // Atualiza a UI
    isLevelingUp = true; // Define a flag para pausar o jogo e exibir o menu de level up
    // console.log(`LEVEL UP! Nível do jogador: ${currentLevel}. Velocidade do jogador antes dos upgrades: ${player.speed.toFixed(4)}`); // DEBUG: Log de velocidade antes dos upgrades
    showMessageBox('Nível Atingido!', `Chegou ao Nível ${currentLevel}! Escolha uma melhoria de atributo:`, 'Escolher Atributo', showUpgradeSelection);
}

// Função para exibir o menu de seleção de personagens
function showCharacterSelection() {
    hideMessageBox(); // Esconde qualquer caixa de mensagem ativa
    const charSelectionDiv = document.getElementById('character-selection');
    const charListDiv = document.getElementById('character-list');
    charListDiv.innerHTML = ''; // Limpa personagens anteriores
    for (const charId in characters) {
        const char = characters[charId];
        const charCard = document.createElement('div');
        charCard.className = 'character-card';
        charCard.onclick = () => { selectCharacter(char); }; // Atribui o manipulador de clique

        // Verifica se a sprite sheet é usada para este personagem
        if (char.spriteSheetUrl) {
            const img = assetLoader.getImage(`${char.id}_sheet`);
            if (img && char.spriteFrames && char.spriteFrames.down) {
                // Usa o quadro 'down' para exibição na seleção de personagem
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = char.spriteWidth;
                tempCanvas.height = char.spriteHeight;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.imageSmoothingEnabled = false;
                tempCtx.drawImage(img, char.spriteFrames.down.sx, char.spriteFrames.down.sy, char.spriteFrames.down.sWidth, char.spriteFrames.down.sHeight, 0, 0, char.spriteWidth, char.spriteHeight);
                charCard.innerHTML = `<img src="${tempCanvas.toDataURL()}" alt="${char.name}" style="width: 48px; height: 48px; margin-bottom: 5px; image-rendering: pixelated;"><h3>${char.name}</h3><p>${char.description}</p>`;
            } else {
                // Fallback para emoji se a sprite sheet for especificada, mas os dados do quadro estiverem faltando ou a imagem não for carregada
                charCard.innerHTML = `<span class="char-icon">${char.icon}</span><h3>${char.name}</h3><p>${char.description}</p>`;
            }
        } else {
            // Fallback para ícone emoji se nenhuma sprite sheet for especificada
            charCard.innerHTML = `<span class="char-icon">${char.icon}</span><h3>${char.name}</h3><p>${char.description}</p>`;
        }
        charListDiv.appendChild(charCard);
    }
    charSelectionDiv.style.display = 'block'; // Exibe a seleção de personagens
}

// Função para selecionar um personagem
function selectCharacter(char) {
    selectedCharacter = char; // Define o personagem selecionado globalmente
    document.getElementById('character-selection').style.display = 'none'; // Esconde a seleção de personagens

    // Inicializa o nível de ataque básico com base no personagem
    if (selectedCharacter.id !== 'teste') {
        player.basicAttackLevel = 1;
    } else {
        player.basicAttackLevel = 0; // O personagem de teste não usa escalonamento de nível de ataque básico
    }

    // Se o personagem "Teste" for selecionado, exibe a seleção de arma inicial
    if (selectedCharacter.id === 'teste') {
        showInitialWeaponSelection();
    } else {
        initGame(); // Caso contrário, inicializa o jogo diretamente
    }
}

// Função para inicializar ou resetar o estado do jogo
function initGame() {
    // Redefine a posição e propriedades do jogador com base no personagem selecionado
    player.x = mapWidth / 2; // Posição central do mapa
    player.y = mapHeight / 2; // Posição central do mapa
    player.speed = selectedCharacter.playerSpeed; // Define a velocidade do jogador baseada no personagem
    player.color = selectedCharacter.playerColor; // Será undefined se o personagem usar sprite sheet
    player.health = 100;
    player.maxHealth = 100;
    player.damageMultiplier = 1.0;
    player.collectionRadiusMultiplier = 1.0;
    player.baseProjectileDamage = selectedCharacter.baseProjectileDamage || 5; // Define o dano base do projétil do jogador
    player.projectileCountMultiplier = 1; // Isso agora se aplica a outras armas, não à contagem de ataque básico
    // player.basicAttackLevel já é definido em selectCharacter

    player.useSprite = false;
    player.spriteSheet = null; // Garante que a referência da sprite sheet seja nula até ser carregada
    player.direction = 'down';
    player.isMoving = false;

    // Reinicia propriedades da habilidade heroica
    player.heroicCharge = 0;
    player.lastHeroicChargeTime = 0;
    player.isHeroicAbilityActive = false;
    player.heroicAbilityEndTime = 0;

    // Reseta as propriedades de invulnerabilidade
    player.isInvulnerable = false;
    player.invulnerabilityStartTime = 0;

    // Carrega a sprite sheet do personagem se disponível
    if (selectedCharacter.spriteSheetUrl) {
        player.spriteSheet = assetLoader.getImage(`${selectedCharacter.id}_sheet`); // Obtém a imagem da sprite sheet carregada
        if (player.spriteSheet) {
            player.spriteWidth = selectedCharacter.spriteWidth;
            player.spriteHeight = selectedCharacter.spriteHeight;
            player.useSprite = true; // Habilita a renderização da sprite
        }
    }

    // Limpa as armas ativas, a menos que o personagem 'teste' tenha sido selecionado (que já escolheu uma)
    if (selectedCharacter.id !== 'teste') {
        player.activeWeapons = [];
    }
    player.hasShield = false;
    player.lastShieldUsedTime = 0;

    // Limpa todas as entidades do jogo
    projectiles = [];
    enemies = [];
    experienceOrbs = [];
    activeAuras = [];
    explosions = [];

    // Redefine as estatísticas do jogo
    score = 0;
    currentExperience = 0;
    currentLevel = 1;
    experienceToNextLevel = 100;

    // Redefine as flags de estado do jogo
    isLevelingUp = false;
    isChoosingWeapon = false;
    isChoosingInitialWeapon = false;

    // Redefine temporizadores e parâmetros de spawn de inimigos
    lastBasicAttackTime = 0; // Usado para o cooldown do ataque básico
    lastEnemySpawnTime = 0;
    enemySpawnInterval = 800;
    enemySpeed = 1; // Redefine a velocidade do inimigo para o valor inicial

    // Inicializa o rastreamento de tempo para o aumento de velocidade dos inimigos
    gameStartTime = performance.now();
    lastTimeBasedSpeedIncrease = gameStartTime;

    // Guarda as propriedades originais para as habilidades heroicas que as modificam
    // Armazenando no objeto player para fácil acesso e restauração
    player.originalBasicAttackInterval = selectedCharacter.baseAttackInterval;
    player.originalProjectileCountMultiplier = player.projectileCountMultiplier;
    player.originalProjectileSpeed = selectedCharacter.projectileSpeed;
    player.originalProjectileLifespan = selectedCharacter.projectileLifespan || 0;
    player.originalBaseProjectileRadius = selectedCharacter.baseProjectileRadius;
    player.originalEnemySpeed = enemySpeed;
    player.originalBasicProjectileDamage = player.baseProjectileDamage;


    updateGameInfoUI(score, currentLevel, currentExperience, experienceToNextLevel); // Atualiza a UI com as estatísticas iniciais
    gameRunning = true; // Define o jogo como rodando
}

// Função para desenhar o jogador no canvas
function drawPlayer() {
    ctx.imageSmoothingEnabled = false; // Para que a arte em pixel apareça nítida

    // Ajusta a posição de desenho do jogador pela câmera
    const drawX = player.x - cameraX;
    const drawY = player.y - cameraY;

    // Lógica de piscar para invulnerabilidade
    if (player.isInvulnerable && Math.floor(performance.now() / 100) % 2 === 0) {
        // Se invulnerável e no "quadro" certo, não desenha o jogador (ou desenha transparente)
        ctx.globalAlpha = 0;
    }

    // Verifica se o personagem usa sprite e se a sprite sheet foi carregada
    if (player.useSprite && player.spriteSheet && selectedCharacter.spriteFrames) {
        const frame = selectedCharacter.spriteFrames[player.direction];
        if (frame) {
            ctx.drawImage(
                player.spriteSheet,
                frame.sx, frame.sy, frame.sWidth, frame.sHeight,
                drawX - player.spriteWidth / 2, drawY - player.spriteHeight / 2,
                player.spriteWidth, player.spriteHeight
            );
        } else {
            console.warn(`No sprite frame defined for direction: ${player.direction} for character ${selectedCharacter.id}`);
            // Fallback para círculo se a sprite não puder ser desenhada
            ctx.beginPath();
            ctx.arc(drawX, drawY, player.radius, 0, Math.PI * 2);
            ctx.fillStyle = player.color; // Usa a cor padrão do personagem ou fallback
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
    } else {
        // Fallback padrão se não usar sprite ou não houver sprite sheet
        ctx.beginPath();
        ctx.arc(drawX, drawY, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    ctx.globalAlpha = 1; // Sempre reseta o alpha para 1 após desenhar o jogador

    // Desenha o efeito de escudo se ativo
    if (player.hasShield) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, player.radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
    }
}

// Função para desenhar projéteis no canvas
function drawProjectiles() {
    projectiles.forEach(p => {
        if (p.creationTime && performance.now() < p.creationTime) {
            return;
        }

        // Ajusta aposição de desenho do projétil pela câmera
        const drawX = p.x - cameraX;
        const drawY = p.y - cameraY;

        if (p.type === 'sprite_projectile' && p.sprite) {
            ctx.drawImage(p.sprite, drawX - p.width / 2, drawY - p.height / 2, p.width, p.height);
        } else if (p.type === 'laser') {
            ctx.save(); // Salva o estado atual do canvas
            ctx.translate(drawX, drawY); // Move a origem para o centro do projétil
            ctx.rotate(p.angle); // Rotaciona pelo ângulo do projétil
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            ctx.restore(); // Restaura o estado do canvas
        } else {
            ctx.beginPath();
            ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            if (p.type === 'orbiting') {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.closePath();
        }
    });
}

// Função para desenhar inimigos no canvas
function drawEnemies() {
    enemies.forEach(e => {
        // Ajusta a posição de desenho do inimigo pela câmera
        const drawX = e.x - cameraX;
        const drawY = e.y - cameraY;

        ctx.beginPath();
        ctx.arc(drawX, drawY, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        const barWidth = e.radius * 2 * 0.8;
        const barHeight = 4;
        const barX = drawX - barWidth / 2;
        const barY = drawY - e.radius - 8;
        ctx.fillStyle = '#555';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        const healthPercentage = e.health / e.maxHealth;
        let barColor = 'lime';
        if (healthPercentage < 0.6) barColor = 'yellow';
        if (healthPercentage < 0.3) barColor = 'red';
        ctx.fillStyle = barColor;
        ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    });
}

// Função para desenhar a barra de vida do jogador
function drawHealthBar(x, y, currentHealth, maxHealth) {
    // Ajusta a posição de desenho da barra de vida pela câmera
    const drawX = x - cameraX;
    const drawY = y - cameraY;

    const barWidth = 40;
    const barHeight = 6;
    const yOffset = player.useSprite ? player.spriteHeight / 2 : player.radius;
    const barX = drawX - barWidth / 2;
    const barY = drawY - yOffset - 15;
    ctx.fillStyle = '#555';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    const healthPercentage = currentHealth / maxHealth;
    const currentBarWidth = barWidth * healthPercentage;
    if (healthPercentage > 0.6) { ctx.fillStyle = '#0F0'; } else if (healthPercentage > 0.3) { ctx.fillStyle = '#FFD700'; } else { ctx.fillStyle = '#F00'; }
    ctx.fillRect(barX, barY, currentBarWidth, barHeight);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

// --- Função para desenhar a barra de habilidade heroica ---
function drawHeroicBar() {
    const barWidth = 100;
    const barHeight = 10;
    const barX = (canvas.width / 2) - (barWidth / 2);
    const barY = canvas.height - 30; // Posição fixa no fundo da tela

    ctx.fillStyle = '#555'; // Fundo da barra
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const chargePercentage = player.heroicCharge / player.maxHeroicCharge;
    let barColor = '#00BFFF'; // Cor azul para a barra
    if (chargePercentage >= 1) {
        barColor = '#FFD700'; // Dourado quando carregada
    }
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY, barWidth * chargePercentage, barHeight);

    ctx.strokeStyle = '#eee'; // Borda da barra
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

// Função para desenhar orbes de experiência
function drawExperienceOrbs() {
    experienceOrbs.forEach(orb => {
        // Ajusta a posição de desenho do orbe pela câmera
        const drawX = orb.x - cameraX;
        const drawY = orb.y - cameraY;

        ctx.beginPath();
        ctx.arc(drawX, drawY, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = orb.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Função para desenhar vários efeitos de jogo (explosões, auras)
function drawEffects() {
    explosions.forEach(effect => {
        // Ajusta a posição de desenho do efeito pela câmera
        const drawX = effect.x - cameraX;
        const drawY = effect.y - cameraY;

        ctx.beginPath();
        if (effect.type === 'flash') {
            ctx.arc(drawX, drawY, effect.radius, 0, Math.PI * 2);
            ctx.fillStyle = effect.color;
            ctx.globalAlpha = effect.alpha || 1;
            ctx.fill();
            ctx.globalAlpha = 1;
        } else if (effect.type === 'explosion') {
            ctx.arc(drawX, drawY, effect.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
            ctx.fill();
        }
        ctx.closePath();
    });
    activeAuras.forEach(aura => {
        if (aura.type === 'timed_aura_damage') {
            // Auras são desenhadas em relação à posição do inimigo ao jogador (centro da aura)
            const auraDrawX = player.x - cameraX;
            const auraDrawY = player.y - cameraY;

            ctx.beginPath();
            ctx.arc(auraDrawX, auraDrawY, aura.visualRadius, 0, Math.PI * 2);
            ctx.strokeStyle = aura.color;
            ctx.lineWidth = 5;
            ctx.globalAlpha = 0.5;
            ctx.stroke();
            ctx.fillStyle = `rgba(0, 0, 139, 0.2)`;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.closePath();
        }
    });
}

// Constantes para os parâmetros do projétil "sanfonado" do Kazu
const KAZU_ACCORDION_AMPLITUDE = 50; // Aumentado para ser mais "sanfonado"
const KAZU_ACCORDION_FREQUENCY = 0.04; // Aumentado para mais dobras

// Função para lidar com o spawn do projétil primário do jogador (ataque básico)
function spawnProjectile(currentTime) {
    const baseDamage = player.baseProjectileDamage * player.damageMultiplier; // MOVIDO PARA O TOPO DA FUNÇÃO

    // Somente dispara ataque básico se o personagem não for 'teste' e o cooldown for atendido
    if (selectedCharacter.id !== 'teste' && (currentTime - lastBasicAttackTime > player.baseAttackInterval)) { // Usa player.baseAttackInterval que pode ser modificado
        lastBasicAttackTime = currentTime; // Reinicia o timer de cooldown

        const baseRadius = selectedCharacter.baseProjectileRadius;
        // Calcula o raio do projétil escalado com base no nível de ataque básico
        const scaledRadius = baseRadius * (1 + (player.basicAttackLevel - 1) * 0.05);

        let projectileLifespan = selectedCharacter.projectileLifespan;
        let projectileSpeed = selectedCharacter.projectileSpeed;
        let projectileType = 'normal'; // Padrão

        // Ajustes para General e Thorne quando a habilidade heroica está ativa
        if (player.isHeroicAbilityActive && selectedCharacter.id === 'thorne') {
            projectileSpeed = player.projectileSpeed; // Já foi modificado no player.speed
            projectileLifespan = Infinity; // Atravessa inimigos (não some por tempo)
            // Thorne atira em todas as 8 direções quando a habilidade está ativa
            const allDirectionsAngles = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4];
            allDirectionsAngles.forEach(angle => {
                const dx_h = Math.cos(angle);
                const dy_h = Math.sin(angle);
                projectiles.push({
                    x: player.x, y: player.y,
                    radius: scaledRadius,
                    speed: projectileSpeed,
                    color: selectedCharacter.projectileColor,
                    damage: baseDamage, 
                    dx: dx_h, dy: dy_h,
                    type: 'penetrating', // Projéteis de Thorne atravessam
                    lifespan: projectileLifespan,
                    creationTime: currentTime
                });
            });
            return; // Retorna para não disparar os projéteis normais do Thorne abaixo
        }
        if (player.isHeroicAbilityActive && selectedCharacter.id === 'general') {
            projectileType = 'penetrating'; // Projéteis do General atravessam
        }
        
        // Loop para disparar múltiplos projéteis com base no basicAttackLevel
        // Kazu agora tem um ataque básico de projétil normal
        if (selectedCharacter.id === 'kazu') {
            // Determina o alvo/direção para o projétil
            const nearestEnemy = getNearestEnemy(player.x, player.y, enemies); // Passa 'enemies'
            let kazuBaseAngle = nearestEnemy ? Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x) : Math.random() * Math.PI * 2;
            let kazuDx = Math.cos(kazuBaseAngle);
            let kazuDy = Math.sin(kazuBaseAngle);

            projectiles.push({
                x: player.x, y: player.y,
                radius: scaledRadius,
                speed: selectedCharacter.projectileSpeed,
                color: selectedCharacter.projectileColor,
                damage: baseDamage,
                dx: kazuDx, dy: kazuDy,
                type: 'normal', // Kazu agora tem um projétil normal
                creationTime: projectileSpawnTime,
                lifespan: Infinity // Projéteis do Kazu não desaparecem com o tempo
            });
            return; // Retorna para não disparar os projéteis genéricos abaixo
        }

        for (let i = 0; i < player.basicAttackLevel; i++) {
            const delay = i * 500; // 0.5 seconds delay per extra projectile
            const projectileSpawnTime = currentTime + delay;

            // Determina o alvo/direção para o projétil
            const nearestEnemy = getNearestEnemy(player.x, player.y, enemies); // Passa 'enemies'
            let baseAngle = nearestEnemy ? Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x) : Math.random() * Math.PI * 2;
            let dx, dy;

            // Lógica de projétil específica do personagem, ajustada para scaledRadius
            switch (selectedCharacter.id) {
                case 'andywn':
                    const projectileSpriteAndywn = assetLoader.getImage(`${selectedCharacter.id}_projectile`);
                    dx = Math.cos(baseAngle); dy = Math.sin(baseAngle);
                    projectiles.push({
                        x: player.x, y: player.y, // Posição do projétil no mapa
                        radius: scaledRadius, // Usa raio escalado
                        speed: selectedCharacter.projectileSpeed,
                        damage: baseDamage,
                        dx: dx, dy: dy,
                        type: 'sprite_projectile', sprite: projectileSpriteAndywn,
                        // Escala as dimensões da sprite com base no escalonamento do raio
                        width: selectedCharacter.projectileSpriteWidth * (scaledRadius / baseRadius),
                        height: selectedCharacter.projectileSpriteHeight * (scaledRadius / baseRadius),
                        creationTime: projectileSpawnTime, // Define o tempo de criação para aparência escalonada
                        lifespan: projectileLifespan // Andywn's projectiles now have a lifespan
                    });
                    break;
                case 'gaeru':
                    dx = Math.cos(baseAngle); dy = Math.sin(baseAngle);
                    projectiles.push({
                        x: player.x, y: player.y, // Posição do projétil no mapa
                        radius: scaledRadius,
                        speed: selectedCharacter.projectileSpeed,
                        color: selectedCharacter.projectileColor,
                        damage: baseDamage,
                        dx: dx, dy: dy,
                        type: projectileType, // Pode ser 'normal' ou 'penetrating' para General
                        creationTime: projectileSpawnTime
                    });
                    break;
                case 'raime': // Lógica de projétil para Raimé (soco próximo)
                    const numPunches = 5;
                    const arcAngle = Math.PI * 0.8;
                    for (let j = 0; j < numPunches; j++) {
                        const spreadAngle = baseAngle - (arcAngle / 2) + (j * arcAngle / (numPunches - 1));
                        dx = Math.cos(spreadAngle); dy = Math.sin(spreadAngle);
                        projectiles.push({
                            x: player.x, y: player.y, // Posição do projétil no mapa
                            radius: scaledRadius,
                            speed: selectedCharacter.projectileSpeed,
                            color: selectedCharacter.projectileColor,
                            damage: baseDamage,
                            dx: dx, dy: dy,
                            type: 'melee', initialX: player.x, initialY: player.y, maxTravelDistance: selectedCharacter.projectileMaxTravelDistance,
                            creationTime: projectileSpawnTime
                        });
                    }
                    break;
                case 'thorne': // Thorne dispara 4 projéteis nas diagonais (normalmente)
                    const diagonalAngles = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
                    diagonalAngles.forEach(angle => {
                        dx = Math.cos(angle); dy = Math.sin(angle);
                        projectiles.push({
                            x: player.x, y: player.y, // Posição do projétil no mapa
                            radius: scaledRadius,
                            speed: selectedCharacter.projectileSpeed,
                            color: selectedCharacter.projectileColor,
                            damage: baseDamage,
                            dx: dx, dy: dy,
                            type: projectileType,
                            creationTime: projectileSpawnTime
                        });
                    });
                    break;
                case 'general':
                    const numShots = 3;
                    const fanAngle = Math.PI / 8;
                    for (let j = 0; j < numShots; j++) {
                        const spread = baseAngle - (fanAngle / 2) + (j * fanAngle / (numShots - 1));
                        dx = Math.cos(spread); dy = Math.sin(spread);
                        projectiles.push({
                            x: player.x, y: player.y, // Posição do projétil no mapa
                            radius: player.isHeroicAbilityActive ? player.originalBaseProjectileRadius * 3 : scaledRadius, // Aumenta o tamanho se a habilidade estiver ativa
                            speed: selectedCharacter.projectileSpeed,
                            color: selectedCharacter.projectileColor,
                            damage: baseDamage,
                            dx: dx, dy: dy,
                            type: projectileType, // Pode ser 'normal' ou 'penetrating'
                            creationTime: projectileSpawnTime
                        });
                    }
                    break;
                case 'ito':
                    dx = Math.cos(baseAngle); dy = Math.sin(baseAngle);
                    // Raio aleatório para projéteis de Ito, também escalado pelo nível de ataque básico
                    const randomBaseRadius = selectedCharacter.projectileMinRadius + (Math.random() * (selectedCharacter.projectileMaxRadius - selectedCharacter.projectileMinRadius));
                    const randomScaledRadius = randomBaseRadius * (1 + (player.basicAttackLevel - 1) * 0.05);
                    projectiles.push({
                        x: player.x, y: player.y, // Posição do projétil no mapa
                        radius: randomScaledRadius,
                        speed: selectedCharacter.projectileSpeed,
                        color: selectedCharacter.projectileColor,
                        damage: baseDamage,
                        dx: dx, dy: dy,
                        lifespan: projectileLifespan,
                        type: projectileType,
                        creationTime: currentTime
                    });
                    break;
            }
        }
    }

    // Função para lidar com o spawn de inimigos
    function spawnEnemy(currentTime) {
        // Se Gaeru estiver com habilidade heroica, não spawna inimigos (paralisa)
        if (selectedCharacter.id === 'gaeru' && player.isHeroicAbilityActive) {
            return;
        }

        if (currentTime - lastEnemySpawnTime > enemySpawnInterval) {
            let x, y;
            const padding = 50;
            const side = Math.floor(Math.random() * 4);
            // Gera a posição inicial do inimigo fora das bordas do MAPA
            switch (side) {
                case 0: x = Math.random() * mapWidth; y = -padding; break; // Topo do mapa
                case 1: x = mapWidth + padding; y = Math.random() * mapHeight; break; // Direita do mapa
                case 2: x = Math.random() * mapWidth; y = mapHeight + padding; break; // Fundo do mapa
                case 3: x = -padding; y = Math.random() * mapHeight; break; // Esquerda do mapa
            }
            const enemyInitialHealth = 10 + (currentLevel * 2) + (Math.floor(Math.random() * 20) + 1);
            const enemyCurrentSpeed = enemySpeed * ((Math.random() * 1.4 + 0.1));
            let enemyCurrentRadius = player.radius * ((Math.random() * 2.95) + 0.05); 
            enemies.push({ x: x, y: y, radius: enemyCurrentRadius, speed: enemyCurrentSpeed, color: 'red', health: enemyInitialHealth, maxHealth: enemyInitialHealth });
            lastEnemySpawnTime = currentTime;
            if (enemySpawnInterval > 250) enemySpawnInterval -= 5;
        }
    }

    // Lógica principal de atualização do jogo
    function update(currentTime) {
        // Pausa a atualização se o jogo não estiver rodando ou um menu estiver aberto
        if (!gameRunning || isLevelingUp || isChoosingWeapon || isChoosingInitialWeapon) return;

        // --- Lógica da Habilidade Heroica Ativa ---
        if (player.isHeroicAbilityActive && currentTime >= player.heroicAbilityEndTime) {
            player.isHeroicAbilityActive = false;
            // Chama a função onHeroicAbilityEnd se ela existir para o personagem selecionado
            if (selectedCharacter.onHeroicAbilityEnd) {
                selectedCharacter.onHeroicAbilityEnd(player);
            }
            console.log(`Habilidade Heroica de ${selectedCharacter.name} terminou.`);
        }
        // --- FIM Lógica Habilidade Heroica Ativa ---

        // Aplica o aumento de velocidade dos inimigos baseado no tempo
        if (currentTime - lastTimeBasedSpeedIncrease >= TIME_INTERVAL_FOR_SPEED_INCREASE) {
            enemySpeed *= (1 + SPEED_INCREASE_PERCENTAGE);
            lastTimeBasedSpeedIncrease = currentTime;
            // console.log(`Enemy speed increased to: ${enemySpeed.toFixed(2)}`); // Log para depuração
        }

        // Lógica de invulnerabilidade do jogador
        if (player.isInvulnerable && (currentTime - player.invulnerabilityStartTime) >= player.invulnerabilityDuration) {
            player.isInvulnerable = false; // Desativa invulnerabilidade
        }

        let dx = 0, dy = 0;
        if (keys.w) dy -= 1;
        if (keys.s) dy += 1;
        if (keys.a) dx -= 1;
        if (keys.d) dx += 1;

        player.isMoving = (dx !== 0 || dy !== 0);
        if (player.isMoving) {
            if (dy < 0) { player.direction = 'up'; }
            else if (dy > 0) { player.direction = 'down'; }
            else if (dx < 0) { player.direction = 'left'; }
            else if (dx > 0) { player.direction = 'right'; }

            const len = Math.sqrt(dx * dx + dy * dy);
            const moveAmount = (len === 0) ? 0 : (player.speed / len); // Evita divisão por zero
            player.x += dx * moveAmount;
            player.y += dy * moveAmount;
        }

        // Limita a posição do jogador dentro dos limites do MAPA
        player.x = Math.max(player.radius, Math.min(mapWidth - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(mapHeight - player.radius, player.y));

        // Atualiza a posição da câmera para seguir o jogador
        cameraX = player.x - canvas.width / 2;
        cameraY = player.y - canvas.height / 2;

        // Atualiza armas ativas
        player.activeWeapons.forEach(weapon => {
            if (weapon.type === 'passive_effect') {
                if (!player.hasShield && (currentTime - player.lastShieldUsedTime) >= weapon.cooldown) {
                    player.hasShield = true;
                }
            }
            else if (weapon.type !== 'permanent_effect' && weapon.type !== 'basic_attack_level_up' && (currentTime - weapon.lastActivatedTime) >= weapon.cooldown) {
                weapon.trigger(player, currentTime, enemies, projectiles, activeAuras, explosions, experienceOrbs);
                weapon.lastActivatedTime = currentTime;
            }
        });

        // Atualiza e filtra auras ativas
        activeAuras = activeAuras.filter(effect => {
            if (effect.endTime && currentTime >= effect.endTime) {
                if(effect.onEnd) effect.onEnd(player);
                return false;
            }
            if (effect.type === 'timed_aura_damage' && currentTime >= effect.nextDamageTime) {
                enemies.forEach((enemy) => {
                    // Colisão da aura agora considera a posição relativa do inimigo ao jogador (centro da aura)
                    const distance = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2);
                    if (distance < effect.radius + enemy.radius) {
                        enemy.health -= effect.damage * player.damageMultiplier;
                        if (enemy.health <= 0) {
                            enemiesToRemove.add(enemy);
                            score += Math.round(10 * player.damageMultiplier);
                            orbsToSpawn.push({ x: enemy.x, y: enemy.y, radius: 8, color: 'lightgreen', value: 10 });
                        }
                    }
                });
                effect.nextDamageTime = currentTime + effect.tickInterval;
            }
            return true;
        });

        // Atualiza e filtra projéteis
        projectiles = projectiles.filter(p => {
            if (p.creationTime && currentTime < p.creationTime) {
                return true;
            }

            // --- Lógica de movimento para projétil Kazu Sanfonado ---
            // Esta lógica não será mais usada se Kazu não tiver ataque básico com esse tipo
            // if (p.type === 'kazu_accordion_projectile') {
            //     const elapsedMs = currentTime - p.creationTime;
            //     const speedPerMs = p.speed / (1000 / 60); 
                
            //     const linearX = p.initialX + Math.cos(p.initialAngle) * (speedPerMs * elapsedMs);
            //     const linearY = p.initialY + Math.sin(p.initialAngle) * (speedPerMs * elapsedMs);

            //     const perpendicularAngle = p.initialAngle + Math.PI / 2; 
            //     const offsetX = Math.cos(perpendicularAngle) * p.amplitude * Math.sin(elapsedMs * p.frequency);
            //     const offsetY = Math.sin(perpendicularAngle) * p.amplitude * Math.sin(elapsedMs * p.frequency);
                
            //     p.x = linearX + offsetX;
            //     p.y = linearY + offsetY;
            // }
            // --- FIM Lógica Kazu Sanfonado ---
            // (MANTIDO) Outros tipos de projéteis
            if (p.type === 'orbiting') {
                p.currentOrbitAngle += p.orbitSpeed;
                p.x = player.x + Math.cos(p.currentOrbitAngle) * p.orbitRadius;
                p.y = player.y + Math.sin(p.currentOrbitAngle) * p.orbitRadius;
            }
            else if (p.type === 'figure_eight') {
                const elapsedTime = currentTime - p.loopStartTime;
                if (elapsedTime >= p.loopDuration) return false;
                const timeRatio = elapsedTime / p.loopDuration;
                const angle = timeRatio * Math.PI * 2;
                p.x = p.initialX + Math.sin(angle) * p.loopSizeX;
                p.y = p.initialY + Math.sin(angle * 2) * p.loopSizeY;
            }
            else {
                p.x += (p.dx || 0) * p.speed;
                p.y += (p.dy || 0) * p.speed;
            }

            // Projéteis penetrantes (penetrating) não expiram por lifespan, apenas se saírem do mapa
            if (p.type === 'penetrating') { 
                // Projéteis do Kazu sanfonados são penetrantes por padrão
            } else if (p.lifespan !== undefined) {
                p.lifespan--;
                return p.lifespan > 0;
            }
            
            if (p.type === 'bomb') {
                p.fuseTime--;
                if (p.fuseTime <= 0) {
                    explosions.push({ x: p.x, y: p.y, radius: p.explosionRadius, damage: p.explosionDamage, duration: 1, type: 'explosion' });
                    return false;
                }
                return true;
            }
            if (p.type === 'melee') {
                const dist = Math.sqrt((p.x - p.initialX)**2 + (p.y - p.initialY)**2);
                return dist < p.maxTravelDistance;
            }
            // Projéteis devem ser removidos se saírem dos limites do MAPA (não da tela visível)
            return p.x > -p.radius && p.x < mapWidth + p.radius && p.y > -p.radius && p.y < mapHeight + p.radius;
        });

        // Atualiza e filtra explosões
        explosions = explosions.filter(effect => {
            if (effect.type === 'explosion') {
                enemies.forEach((enemy) => {
                    if (Math.sqrt((effect.x - enemy.x) ** 2 + (effect.y - enemy.y) ** 2) < effect.radius + enemy.radius) {
                        enemy.health -= effect.damage;
                        if (enemy.health <= 0) {
                            enemiesToRemove.add(enemy);
                            score += Math.round(10 * player.damageMultiplier);
                            orbsToSpawn.push({ x: enemy.x, y: enemy.y, radius: 8, color: 'lightgreen', value: 10 });
                        }
                    }
                });
            }
            effect.duration--;
            if (effect.type === 'flash') effect.alpha = Math.max(0, (effect.alpha || 1) - 0.2);
            return effect.duration > 0;
        });

        // --- Carregamento da habilidade heroica por tempo ---
        if (currentTime - player.lastHeroicChargeTime >= player.heroicChargeInterval) {
            if (player.heroicCharge < player.maxHeroicCharge) {
                player.heroicCharge += 1; // Aumenta 1 a cada intervalo
                player.heroicCharge = Math.min(player.heroicCharge, player.maxHeroicCharge); // Limita ao máximo
            }
            player.lastHeroicChargeTime = currentTime;
        }
        // --- FIM Carregamento Habilidade Heroica ---


        // Atualiza posições dos inimigos e lida com colisões
        enemies.forEach((enemy) => {
            // Move inimigo em direção ao jogador no MAPA
            const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.x += Math.cos(angle) * enemy.speed;
            enemy.y += Math.sin(angle) * enemy.speed;

            // Colisões projétil-inimigo
            projectiles.forEach((p) => {
                if (p.creationTime && currentTime < p.creationTime) {
                    return;
                }

                const projectileEffectiveRadius = p.radius !== undefined ? p.radius : p.width / 2;
                if (Math.sqrt((p.x - enemy.x) ** 2 + (p.y - enemy.y) ** 2) < projectileEffectiveRadius + enemy.radius) {
                    enemy.health -= p.damage;
                    // Projéteis penetrantes não são removidos ao atingir
                    if (!['laser', 'figure_eight', 'melee', 'orbiting', 'sprite_projectile', 'penetrating'].includes(p.type)) { 
                        projectilesToRemove.add(p);
                    }
                    if (enemy.health <= 0) {
                        enemiesToRemove.add(enemy);
                        score += Math.round(10 * player.damageMultiplier);
                        orbsToSpawn.push({ x: enemy.x, y: enemy.y, radius: 8, color: 'lightgreen', value: 10 });
                        // --- Carrega habilidade ao matar ---
                        if (player.heroicCharge < player.maxHeroicCharge) {
                            player.heroicCharge += player.heroicChargePerKill;
                            player.heroicCharge = Math.min(player.heroicCharge, player.maxHeroicCharge);
                        }
                        // --- FIM Carrega Habilidade ao matar ---
                        if (p.type === 'leech') player.health = Math.min(player.health + p.damage, player.maxHealth);
                    }
                }
            });

            // Colisões jogador-inimigo
            if (Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2) < player.radius + enemy.radius) {
                if (!player.isInvulnerable) { // Só recebe dano se não estiver invulnerável
                    if (player.hasShield) {
                        player.hasShield = false; // Consome escudo
                        player.lastShieldUsedTime = currentTime; // Inicia cooldown do escudo
                        // O inimigo NÃO é removido aqui, ele continua vivo
                    }
                    else {
                        player.health -= enemyDamageToPlayer; // Recebe dano
                        player.isInvulnerable = true; // Torna-se invulnerável
                        player.invulnerabilityStartTime = currentTime; // Registra o início da invulnerabilidade
                    }

                    // Verifica Game Over após receber dano
                    if (player.health <= 0) {
                        gameRunning = false;
                        showMessageBox('Fim de Jogo!', `A sua pontuação final: ${score}<br>Foi derrotado.`, 'Jogar Novamente', showCharacterSelection);
                    }
                }
            }
        });

        experienceOrbs.push(...orbsToSpawn);
        orbsToSpawn = [];
        projectiles = projectiles.filter(p => !projectilesToRemove.has(p));
        projectilesToRemove.clear();
        enemies = enemies.filter(e => !enemiesToRemove.has(e));
        enemiesToRemove.clear();

        experienceOrbs = experienceOrbs.filter(orb => {
            // Colisão do orbe com o raio de coleta do jogador
            if (Math.sqrt((player.x - orb.x) ** 2 + (player.y - orb.y) ** 2) < player.radius * player.collectionRadiusMultiplier + orb.radius) {
                currentExperience += orb.value;
                return false;
            }
            return true;
        });

        if (currentExperience >= experienceToNextLevel) {
            levelUp();
            if (isLevelingUp) return;
        }

        updateGameInfoUI(score, currentLevel, currentExperience, experienceToNextLevel);
        spawnProjectile(currentTime);
        spawnEnemy(currentTime);
    }

    // Lógica principal de desenho do jogo
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

        // Desenha a imagem de fundo do mapa
        const backgroundMapImage = assetLoader.getImage('background_map');
        if (backgroundMapImage) {
            ctx.imageSmoothingEnabled = false; // Garante que a arte em pixel fique nítida
            ctx.drawImage(backgroundMapImage,
                          0, 0, backgroundMapImage.width, backgroundMapImage.height, // Retângulo de origem (a imagem inteira)
                          -cameraX, -cameraY, mapWidth, mapHeight); // Retângulo de destino (preenche o mapa e se move com a câmera)
        }

        drawExperienceOrbs(); // Desenha orbes
        drawPlayer(); // Desenha jogador (agora com lógica de sprite sheet e câmera)
        drawProjectiles(); // Desenha projéteis (agora com lógica de câmera)
        drawEnemies(); // Desenha inimigos (agora com lógica de câmera)
        drawHealthBar(player.x, player.y, player.health, player.maxHealth); // Desenha barra de vida (agora com lógica de câmera)
        drawEffects(); // Desenha explosões e auras (agora com lógica de câmera)
        drawHeroicBar(); // Desenha a barra de habilidade heroica
    }

    // Função de loop do jogo (recursiva via requestAnimationFrame)
    function gameLoop(currentTime) {
        if (gameRunning && !isLevelingUp && !isChoosingWeapon && !isChoosingInitialWeapon) {
            update(currentTime);
            draw();
        } else if (isLevelingUp || isChoosingWeapon || isChoosingInitialWeapon) {
            // Se um menu estiver aberto, apenas desenha (para exibir o menu sobre o jogo pausado)
            draw();
        }
        requestAnimationFrame(gameLoop); // Solicita o próximo quadro de animação
    }

    // Configuração inicial quando a janela é carregada
    window.onload = function() {
        // Pré-carrega as sprite sheets dos personagens e sprites de projéteis usando o asset loader
        for (const charId in characters) {
            const charData = characters[charId];
            if (charData.spriteSheetUrl) assetLoader.addImage(`${charId}_sheet`, charData.spriteSheetUrl); // Carrega a sprite sheet principal
            if (charData.projectileSpriteUrl) assetLoader.addImage(`${charId}_projectile`, charData.projectileSpriteUrl); // Carrega a sprite do projétil
        }
        // Adiciona a imagem de fundo do mapa
        assetLoader.addImage('background_map', 'https://raw.githubusercontent.com/Gawlock/champions-of-nova-insula/refs/heads/main/assets/pxArt.png');

        // Uma vez que todos os assets são carregados, exibe a mensagem de boas-vindas
        assetLoader.loadAll(() => {
            showMessageBox('Campeões de Nova Insula', 'Use W, A, S, D para se mover e sobreviva às hordas. Colete orbes de experiência para subir de nível e melhorar o seu herói! Cuidado para não ser tocado pelos inimigos! Pressione **X** para usar sua habilidade heroica quando a barra azul estiver cheia!', 'Continuar', showCharacterSelection);
        });
         // Start the animation loop when all assets are loaded and the initial message is handled.
        gameLoop();
    };

    // Variáveis de entrada por toque
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoving = false;

    // Listeners de eventos de toque para movimento em dispositivos móveis
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoving = true;
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (touchMoving && gameRunning && !isLevelingUp && !isChoosingWeapon && !isChoosingInitialWeapon) {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - touchStartX;
            const deltaY = currentY - touchStartY;
            // Move o jogador com base no delta do toque (ajustado com um multiplicador para sensibilidade)
            const moveAmount = 0.15; // Ajuste para a sensibilidade do toque
            player.x += deltaX * moveAmount;
            player.y += deltaY * moveAmount;
            // Mantém o jogador dentro dos limites do MAPA
            player.x = Math.max(player.radius, Math.min(mapWidth - player.radius, player.x));
            player.y = Math.max(player.radius, Math.min(mapHeight - player.radius, player.y));
            touchStartX = currentX; // Atualiza o ponto inicial para o próximo movimento
            touchStartY = currentY;
        }
    }, { passive: false });
    canvas.addEventListener('touchend', () => { touchMoving = false; });
</script>
