// Utilitário Asset Loader para imagens
export const assetLoader = {
    images: {}, // Armazena objetos de imagem carregados
    imageUrls: {}, // Armazena URLs a serem carregadas
    loadCount: 0, // Contador para imagens carregadas
    totalCount: 0, // Total de imagens a carregar
    // Adiciona uma URL de imagem à fila do carregador
    addImage(id, url) {
        this.imageUrls[id] = url;
        this.totalCount++;
    },
    // Carrega todas as imagens adicionadas e chama um callback quando concluído
    loadAll(callback) {
        if (this.totalCount === 0) {
            callback(); // Se não houver imagens, chama o callback imediatamente
            return;
        }
        for (const id in this.imageUrls) {
            const url = this.imageUrls[id];
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Necessário para carregar imagens de outras origens
            img.src = url;
            img.onload = () => {
                this.images[id] = img;
                this.loadCount++;
                if (this.loadCount === this.totalCount) {
                    callback(); // Todas as imagens carregadas, chama o callback
                }
            };
            img.onerror = () => {
                console.error(`Falha ao carregar a imagem: ${url}`); // Tratamento de erro para o carregamento da imagem
                this.loadCount++;
                if (this.loadCount === this.totalCount) {
                    callback();
                }
            };
        }
    },
    // Recupera uma imagem carregada pelo seu ID
    getImage(id) {
        return this.images[id] || null;
    }
};

// Função para exibir uma caixa de mensagem personalizada
export function showMessageBox(title, text, buttonText, buttonAction) {
    const msgBox = document.getElementById('message-box');
    document.getElementById('message-title').innerHTML = title;
    document.getElementById('message-text').innerHTML = text;
    const msgButton = document.getElementById('message-button');
    msgButton.innerText = buttonText;
    msgButton.onclick = () => {
        msgBox.style.display = 'none'; // Esconde a caixa de mensagem ao clicar no botão
        buttonAction(); // Executa a ação fornecida
    };
    msgBox.style.display = 'block'; // Exibe a caixa de mensagem
}

// Função para esconder a caixa de mensagem
export function hideMessageBox() {
    document.getElementById('message-box').style.display = 'none';
}

// Função para encontrar o inimigo mais próximo de uma dada coordenada (x, y)
export function getNearestEnemy(x, y, enemiesArray) {
    let nearestEnemy = null;
    let minDistance = Infinity;
    if (enemiesArray.length === 0) return null; // Se não houver inimigos, retorna nulo
    enemiesArray.forEach(enemy => {
        const distance = Math.sqrt((x - enemy.x) ** 2 + (y - enemy.y) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            nearestEnemy = enemy;
        }
    });
    return nearestEnemy;
}

// Função para atualizar a UI de informações do jogo (pontuação, nível, XP)
export function updateGameInfoUI(score, currentLevel, currentExperience, experienceToNextLevel) {
    document.getElementById('score-display').innerText = `Pontuação: ${score}`;
    document.getElementById('level-display').innerText = `Nível: ${currentLevel}`;
    document.getElementById('xp-display').innerText = `XP: ${currentExperience}/${experienceToNextLevel}`;
}
