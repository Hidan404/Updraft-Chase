const novoElemento = (classeName, tagName) => {
  const elemento = document.createElement(tagName);
  elemento.classList.add(classeName);

  return elemento;
};

const barreira = (reversa = false) => {
  const elemento = novoElemento("barreira", "div");

  const borda = novoElemento("borda", "div");
  const corpo = novoElemento("corpo", "div");

  elemento.appendChild(reversa ? corpo : borda);
  elemento.appendChild(reversa ? borda : corpo);

  const setAltura = (altura) => (corpo.style.height = `${altura}px`);

  return {
    elemento,
    setAltura,
  };
};

const parDeBarreiras = (altura, abertura, x) => {
  const elemento = novoElemento("par-de-Barreiras", "div");

  const superior = barreira(true);
  const inferior = barreira(false);

  elemento.appendChild(superior.elemento);
  elemento.appendChild(inferior.elemento);

  const sortearAbeertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;

    superior.setAltura(alturaSuperior);
    inferior.setAltura(alturaInferior);
  };

  const getX = () => parseInt(elemento.style.left.split("px")[0]);
  const setX = (x) => (elemento.style.left = `${x}px`);
  const getLargura = () => elemento.clientWidth;

  sortearAbeertura();
  setX(x);

  return {
    elemento,
    superior,
    inferior,
    getX,
    setX,
    getLargura,
    sortearAbeertura,
  };
};

function barreiras(altura, largura, abertura, espaco, notificarPonto) {
  this.pares = [
    parDeBarreiras(altura, abertura, largura),
    parDeBarreiras(altura, abertura, largura + espaco),
    parDeBarreiras(altura, abertura, largura + espaco * 2),
    parDeBarreiras(altura, abertura, largura + espaco * 3),
  ];

  const movimentoGradual = 3;
  this.animarLoop = () => {
    this.pares.forEach((par) => {
      par.setX(par.getX() - movimentoGradual);

      if (par.getX() + par.getLargura() < 0) {
        par.setX(par.getX() + espaco * this.pares.length);
        par.sortearAbeertura();
      }

      const meioDaTela = largura / 2;
      const atravessandoMeio =
        par.getX() + movimentoGradual >= meioDaTela && par.getX() < meioDaTela;

      if (atravessandoMeio) {
        notificarPonto();
      }
    });

    return this;
  };
}




const personagem = (alturaDoJogo) => {
  let voandoParaCima = false;
  let voandoParaBaixo = false;

  const elemento = novoElemento("personagemImg", "img");
  elemento.src = "/IMGs/frame-1.png";

  const getY = () => parseInt(elemento.style.bottom.split("px")[0]);
  const setY = (x) => (elemento.style.bottom = `${x}px`);

  window.onkeydown = (evento) => {
    if (evento.key === "w" || evento.key === "W") {
      voandoParaCima = true;
    }
    if (evento.key === "s" || evento.key === "S") {
      voandoParaBaixo = true;
    }
  };

  window.onkeyup = (evento) => {
    if (evento.key === "w" || evento.key === "W") {
      voandoParaCima = false;
    }
    if (evento.key === "s" || evento.key === "S") {
      voandoParaBaixo = false;
    }
  };

  const animarPersonagem = () => {
    let novoY = getY();

    if (voandoParaCima) {
      novoY += 8;
    }
    if (voandoParaBaixo) {
      novoY -= 5;
    }
    const alturaMaxima = alturaDoJogo - elemento.clientWidth;

    if (novoY < 0) {
      setY(0);
    } else if (novoY >= alturaMaxima) {
      setY(alturaMaxima);
    } else {
      setY(novoY);
    }
  };

  setY(alturaDoJogo / 2);

  return {
    elemento,
    getY,
    setY,
    animarPersonagem,
  };
};

const progressoGame = () => {
  const elemento = novoElemento("progresso", "span");

  const atualizarPontos = (pontos) => {
    elemento.innerHTML = pontos;
  };

  atualizarPontos(0);
  return {
    elemento,
    atualizarPontos,
  };
};

const sobreposicaoSouN = (elemA, elemB) => {
  const a = elemA.getBoundingClientRect();
  const b = elemB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vertical;
};

const colisaoTest = (personagem, barreiras) => {
  const colisao =  barreiras.pares.some((parBarreiras) => {
    const superior = parBarreiras.superior.elemento;
    const inferior = parBarreiras.inferior.elemento;

    return (
      sobreposicaoSouN(personagem.elemento, superior) ||
      sobreposicaoSouN(personagem.elemento, inferior)
    );
  });

  if (colisao) {
    const collisionSound = document.getElementById("collision-sound");
    collisionSound.play(); // Toca o som de colisão
  }

  return colisao
};

let recorde = 0;
const bacgrounMusic = document.getElementById("background-music")



const flappyBird = () => {
  let pontos = 0;
  let dificuldade = 1;
  let pausado = false;
  const pausarButton = document.getElementById("pause-button")
  const retomarButton = document.getElementById("resume-button")

  const areaGame = document.querySelector("[wm-flappy]");
  const altura = areaGame.clientHeight;
  const largura = areaGame.clientWidth;

  const progresso = progressoGame(); // Inicializa a pontuação

  // Variáveis para barreiras e personagem
  let barreirasS; 
  let persona; 
  let jogoParado = false; // Flag para saber se o jogo está rodando ou parado
  let temporizadorJogo;
  const gameOverScreen = document.getElementById("game-over");

  const mostrarGameOver = () => {
    pausado =true
    

    const scoreDisplay = document.getElementById("score-display");
    const highScoreDisplay = document.getElementById("high-score-display");

    scoreDisplay.innerText = pontos;
    highScoreDisplay.innerText = Math.max(pontos, recorde);
    recorde = Math.max(pontos, recorde); 

    bacgrounMusic.pause()
    const musicaGameOver = document.getElementById("game-over-sound");
    gameOverScreen.classList.remove("hidden");
    musicaGameOver.play();
  };

  const aumentarDificuldade = () => {
    if (pontos > 5 === 0 && pontos > 0) {
      dificuldade++;
      console.log("Dificuldade aumentada! Agora está em: " + dificuldade);

      barreirasS.pares.forEach((par) => {
        const novaAbertura = Math.max(150, 250 - dificuldade * 5); // Abertura mínima de 150px
        par.sortearAbeertura(novaAbertura);
      });
    }
  };

  const inicioDeJogo = () => {
    // *** Limpa a área de jogo ***
    areaGame.innerHTML = ""; // Limpa todos os elementos da área de jogo

    // *** Reinicia variáveis ***
    pontos = 0; 
    dificuldade = 1; 
    pausado = false; 

    bacgrounMusic.loop = true;
    bacgrounMusic.play();

    // *** Recria barreiras e personagem ***
    barreirasS = new barreiras(altura, largura, 250, 400, () => progresso.atualizarPontos(++pontos));
    persona = personagem(altura);

    // Adiciona elementos ao DOM
    areaGame.appendChild(progresso.elemento);
    areaGame.appendChild(persona.elemento);
    areaGame.appendChild(pausarButton)
    areaGame.appendChild(retomarButton)
    barreirasS.pares.forEach((p) => areaGame.appendChild(p.elemento));

    const restartButton = document.getElementById("restart-button");
        if (restartButton) {
            restartButton.onclick = () => {
                location.reload();
            };
        }

    temporizadorJogo = setInterval(() => {
      if (!pausado) {
        const movimentoGradual = 1 + dificuldade;
        
        barreirasS.animarLoop(movimentoGradual);
        persona.animarPersonagem();
        aumentarDificuldade();

        if (colisaoTest(persona, barreirasS)) {
          console.log("Colisão detectada! Parando o jogo.");
          jogoParado = true; 
          clearInterval(temporizadorJogo); 
          
          mostrarGameOver();
        }
      }
    }, 20);
  };

  const retomarJogo = () => {
    pausado = false; 
    document.getElementById("pause-button").classList.remove("hidden"); 
    document.getElementById("resume-button").classList.add("hidden"); 
  };

 const pausarJogo = () => {
    pausado = true; 
    document.getElementById("pause-button").classList.add("hidden"); 
    document.getElementById("resume-button").classList.remove("hidden"); 
  };

  
  
  // Inicia o jogo quando o botão de reiniciar é clicado
  document.getElementById("reiniciar-jogo").onclick = () => {
    inicioDeJogo(); // Reinicia o jogo sem recarregar a página
  };

  // Mantenha as funções de pause e resume
  document.getElementById("pause-button").onclick = pausarJogo;
  document.getElementById("resume-button").onclick = retomarJogo;

  return {
    inicioDeJogo,
  };
};



window.flappyBird = flappyBird;



