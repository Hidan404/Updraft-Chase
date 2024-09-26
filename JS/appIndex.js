const startGame = document.querySelectorAll('.iniciar-jogo')
const gameOverScreen = document.getElementById("game-over");
startGame.forEach(el => {
el.addEventListener('click', () => {
    
    document.getElementById('tela-inicial').style.display = 'none';
    
    document.getElementById('jogo').style.display = 'block';
    gameOverScreen.classList.add("hidden");
    document.addEventListener('DOMContentLoaded', flappyBird().inicioDeJogo());
    
    
    
});
});



const startButton = document.querySelectorAll('.iniciar-jogo');
const startSound = document.getElementById('start-sound');

startButton.forEach(el => {
    el.addEventListener('click', () => {
    startSound.play();
});

})
