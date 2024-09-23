document.getElementById('iniciar-jogo').addEventListener('click', () => {
    
    document.getElementById('tela-inicial').style.display = 'none';
    
    document.getElementById('jogo').style.display = 'block';
    
    
    flappyBird().inicioDeJogo();
});



const startButton = document.getElementById('iniciar-jogo');
const startSound = document.getElementById('start-sound');

startButton.addEventListener('click', () => {
    startSound.play();
});
