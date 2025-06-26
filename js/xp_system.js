let xp = 0;
let level = 1;
let xpToNextLevel = 100;

export function addXp(amount) {
    xp += amount;
    updateXpDisplay();

    if (xp >= xpToNextLevel) {
        levelUp();
    }
}

function levelUp() {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.2);
    updateXpDisplay();
    console.log('Level Up! Nível: ' + level);
}

function updateXpDisplay() {
    document.getElementById('xp-display').textContent = `XP: ${xp}/${xpToNextLevel}`;
    document.getElementById('level-display').textContent = `Nível: ${level}`;
}
