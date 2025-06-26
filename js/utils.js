// utils.js

export function resizeCanvas(canvas) {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    canvas.width = Math.min(canvas.width, 1200);
    canvas.height = Math.min(canvas.height, 800);
}

export function showMessageBox(title, text, buttonText, buttonAction) {
    const msgBox = document.getElementById('message-box');
    document.getElementById('message-title').innerHTML = title;
    document.getElementById('message-text').innerHTML = text;
    const msgButton = document.getElementById('message-button');
    msgButton.innerText = buttonText;
    msgButton.onclick = () => {
        msgBox.style.display = 'none';
        buttonAction();
    };
    msgBox.style.display = 'block';
}

export function hideMessageBox() {
    document.getElementById('message-box').style.display = 'none';
}

export function showCharacterSelection() {
    const charSelectionDiv = document.getElementById('character-selection');
    charSelectionDiv.style.display = 'block';
}

export function setupEventListeners() {
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('gameCanvas');
        resizeCanvas(canvas);
    });

    document.addEventListener('keydown', (e) => {
        // Exemplo: adicionar suas teclas de controle aqui
        if (e.key.toLowerCase() === 'x') {
            console.log('Habilidade heroica ativada');
        }
    });
}
