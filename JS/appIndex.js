const startGame = document.querySelectorAll('.iniciar-jogo')
startGame.forEach(el => {
el.addEventListener('click', () => {
    
    document.getElementById('tela-inicial').style.display = 'none';
    
    document.getElementById('jogo').style.display = 'block';
    
    
    flappyBird().inicioDeJogo();
});
});



const startButton = document.querySelectorAll('.iniciar-jogo');
const startSound = document.getElementById('start-sound');

startButton.forEach(el => {
    el.addEventListener('click', () => {
    startSound.play();
});

})
