// Variáveis do jogo
let pontos = 0;
let vidas = 3;
let velocidade = 2;
let jogoAtivo = false;
let posicaoNave = 230;
let estrelas = [];
let meteoros = [];
let temporizador;

// Elementos
const telaInicial = document.getElementById('telaInicial');
const telaJogo = document.getElementById('telaJogo');
const telaGameOver = document.getElementById('telaGameOver');
const areaJogo = document.getElementById('areaJogo');
const nave = document.getElementById('nave');
const elemPontos = document.getElementById('pontos');
const elemVidas = document.getElementById('vidas');
const elemPontuacaoFinal = document.getElementById('pontuacaoFinal');

// Controles do teclado
document.addEventListener('keydown', (e) => {
    if (!jogoAtivo) return;
    if (e.key === 'ArrowLeft' && posicaoNave > 0) {
        posicaoNave -= 15;
    }
    if (e.key === 'ArrowRight' && posicaoNave < 460) {
        posicaoNave += 15;
    }
    nave.style.left = posicaoNave + 'px';
});

// Criar estrela
function criarEstrela() {
    const estrela = document.createElement('div');
    estrela.className = 'estrela';
    estrela.style.left = Math.random() * 480 + 'px';
    estrela.style.top = '-20px';
    areaJogo.appendChild(estrela);
    estrelas.push({ elem: estrela, y: -20 });
}

// Criar meteoro
function criarMeteoro() {
    const meteoro = document.createElement('div');
    meteoro.className = 'meteoro';
    meteoro.style.left = Math.random() * 470 + 'px';
    meteoro.style.top = '-40px';
    areaJogo.appendChild(meteoro);
    meteoros.push({ elem: meteoro, y: -40 });
}

// Verificar colisão
function colisao(obj1, obj2, t1=40, l1=20, t2=30, l2=15) {
    const x1 = parseInt(obj1.style.left);
    const y1 = parseInt(obj1.style.top || '0');
    const x2 = parseInt(obj2.style.left);
    const y2 = parseInt(obj2.style.top || '0');
    return x1 < x2 + t2 && x1 + l1 > x2 && y1 < y2 + t2 && y1 + l1 > y2;
}

// Loop principal do jogo
function loopJogo() {
    if (!jogoAtivo) return;

    // Movimentar estrelas
    estrelas.forEach((estrela, i) => {
        estrela.y += velocidade;
        estrela.elem.style.top = estrela.y + 'px';
        
        // Colisão com estrela
        if (colisao(nave, estrela.elem, 40, 40, 15, 15)) {
            pontos += 10;
            elemPontos.textContent = pontos;
            estrela.elem.remove();
            estrelas.splice(i, 1);
            // Aumentar velocidade a cada 100 pontos
            if (pontos % 100 === 0) velocidade += 0.5;
        }
        
        // Estrela saiu da tela
        if (estrela.y > 500) {
            estrela.elem.remove();
            estrelas.splice(i, 1);
        }
    });

    // Movimentar meteoros
    meteoros.forEach((meteoro, i) => {
        meteoro.y += velocidade;
        meteoro.elem.style.top = meteoro.y + 'px';
        
        // Colisão com meteoro
        if (colisao(nave, meteoro.elem, 40, 40, 30, 30)) {
            vidas--;
            atualizarVidas();
            meteoro.elem.remove();
            meteoros.splice(i, 1);
            if (vidas <= 0) gameOver();
        }
        
        // Meteoro saiu da tela
        if (meteoro.y > 500) {
            meteoro.elem.remove();
            meteoros.splice(i, 1);
        }
    });

    temporizador = requestAnimationFrame(loopJogo);
}

// Atualizar vidas na tela
function atualizarVidas() {
    elemVidas.textContent = '❤️'.repeat(Math.max(0, vidas));
}

// Iniciar jogo
function iniciarJogo() {
    pontos = 0;
    vidas = 3;
    velocidade = 2;
    posicaoNave = 230;
    estrelas = [];
    meteoros = [];
    elemPontos.textContent = '0';
    atualizarVidas();
    nave.style.left = posicaoNave + 'px';
    
    // Limpar objetos antigos
    document.querySelectorAll('.estrela, .meteoro').forEach(e => e.remove());
    
    telaInicial.style.display = 'none';
    telaGameOver.style.display = 'none';
    telaJogo.style.display = 'block';
    jogoAtivo = true;
    
    loopJogo();
    
    // Gerar estrelas e meteoros
    setInterval(() => { if (jogoAtivo) criarEstrela(); }, 800);
    setInterval(() => { if (jogoAtivo && Math.random() > 0.4) criarMeteoro(); }, 1200);
}

// Game Over
function gameOver() {
    jogoAtivo = false;
    cancelAnimationFrame(temporizador);
    elemPontuacaoFinal.textContent = pontos;
    telaJogo.style.display = 'none';
    telaGameOver.style.display = 'block';
}

// Reiniciar
function reiniciarJogo() {
    iniciarJogo();
}

// Áudio — você pode adicionar depois!
function alternarAudio() {
    alert('🔊 Em breve: trilha sonora! Por enquanto, imagine a música espacial tocando 🎵✨');
}

