const $ = (id) => document.getElementById(id);
const telaInicial = $('telaInicial'), telaJogo = $('telaJogo'), telaGameOver = $('telaGameOver');
const areaJogo = $('areaJogo'), nave = $('nave'), pausaEl = $('pausa');
const elPontos = $('pontos'), elNivel = $('nivel');
const NAVE_L = 40, NAVE_A = 50, NAVE_BOTTOM = 30;

let pontos, nivel, velocidade, naveX, estrelas, meteoros;
let jogoAtivo = false, pausado = false, rafId = null, ultimo = 0;
let tEstrela = 0, tMeteoro = 0;
const teclas = { esq: false, dir: false };
let recorde = 0;
try { recorde = Number(localStorage.getItem('guardiaoRecorde')) || 0; } catch (e) {}

// ---------- Áudio (WebAudio, sem arquivos externos) ----------
let somLigado = true, ctx = null;
function tom(freq, dur, tipo = 'sine', vol = 0.08) {
    if (!somLigado) return;
    try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = tipo; o.frequency.value = freq; g.gain.value = vol;
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
    } catch (e) {}
}
$('botaoAudio').addEventListener('click', (e) => {
    somLigado = !somLigado;
    e.currentTarget.textContent = somLigado ? '🔊 Som' : '🔇 Mudo';
    e.currentTarget.setAttribute('aria-pressed', somLigado);
});

// ---------- Controles ----------
const largura = () => areaJogo.clientWidth;
const altura = () => areaJogo.clientHeight;
function posicionarNave() { nave.style.left = naveX + 'px'; }

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { teclas.esq = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { teclas.dir = true; e.preventDefault(); }
    if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && jogoAtivo) alternarPausa();
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') teclas.esq = false;
    if (e.key === 'ArrowRight') teclas.dir = false;
});
function moverPorToque(e) {
    if (!jogoAtivo || pausado) return;
    const r = areaJogo.getBoundingClientRect();
    naveX = Math.min(largura() - NAVE_L, Math.max(0, e.clientX - r.left - NAVE_L / 2));
    posicionarNave();
}
areaJogo.addEventListener('pointerdown', moverPorToque);
areaJogo.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') moverPorToque(e); });

// ---------- Objetos ----------
function criar(classe, tam) {
    const el = document.createElement('div');
    el.className = classe;
    const x = Math.random() * (largura() - tam);
    el.style.left = x + 'px';
    el.style.top = -tam + 'px';
    areaJogo.appendChild(el);
    return { el, x, y: -tam, tam };
}
function bateu(o, tam, folga = 0) { // folga encolhe a área de colisão para ficar mais justo
    const ny = altura() - NAVE_BOTTOM - NAVE_A;
    return naveX + folga < o.x + tam - folga && naveX + NAVE_L - folga > o.x + folga &&
           ny + folga < o.y + tam - folga && ny + NAVE_A - folga > o.y + folga;
}
function criarFundo() {
    const fundo = $('fundo');
    for (let i = 0; i < 50; i++) {
        const e = document.createElement('div');
        const t = 1 + Math.random() * 2;
        e.className = 'fundo-estrela';
        e.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${t}px;height:${t}px;` +
            `animation-duration:${4 + Math.random() * 5}s;animation-delay:-${Math.random() * 8}s`;
        fundo.appendChild(e);
    }
}

// ---------- Loop principal ----------
function loop(agora) {
    if (!jogoAtivo) return;
    rafId = requestAnimationFrame(loop);
    if (pausado) { ultimo = agora; return; }
    const dt = Math.min((agora - ultimo) / 16.67, 3); // 1 = 60fps
    ultimo = agora;

    if (teclas.esq) naveX -= 7 * dt;
    if (teclas.dir) naveX += 7 * dt;
    naveX = Math.min(largura() - NAVE_L, Math.max(0, naveX));
    posicionarNave();

    tEstrela += dt * 16.67; tMeteoro += dt * 16.67;
    if (tEstrela > 800) { tEstrela = 0; estrelas.push(criar('estrela', 22)); }
    if (tMeteoro > Math.max(500, 1200 - nivel * 80)) {
        tMeteoro = 0;
        if (Math.random() > 0.3) meteoros.push(criar('meteoro', 30));
    }

    // Percorre de trás para frente para remover com segurança
    for (let i = estrelas.length - 1; i >= 0; i--) {
        const s = estrelas[i];
        s.y += velocidade * dt; s.el.style.top = s.y + 'px';
        if (bateu(s, s.tam)) {
            pontos += 10; elPontos.textContent = pontos; tom(880, 0.12);
            s.el.remove(); estrelas.splice(i, 1);
            const novo = Math.floor(pontos / 100) + 1;
            if (novo > nivel) { nivel = novo; velocidade += 0.4; elNivel.textContent = nivel; tom(1200, 0.25, 'triangle'); }
        } else if (s.y > altura()) { s.el.remove(); estrelas.splice(i, 1); }
    }
    for (let i = meteoros.length - 1; i >= 0; i--) {
        const m = meteoros[i];
        m.y += velocidade * dt; m.el.style.top = m.y + 'px';
        if (bateu(m, m.tam, 5)) { tom(120, 0.4, 'sawtooth', 0.12); return gameOver(); // um meteoro = fim de jogo
        } else if (m.y > altura()) { m.el.remove(); meteoros.splice(i, 1); }
    }
}

// ---------- Fluxo do jogo ----------
function mostrar(tela) {
    [telaInicial, telaJogo, telaGameOver].forEach((t) => (t.hidden = t !== tela));
}
function alternarPausa() {
    pausado = !pausado;
    pausaEl.hidden = !pausado;
    $('btnPausar').textContent = pausado ? '▶️ Continuar' : '⏸️ Pausar';
}
function iniciarJogo() {
    cancelAnimationFrame(rafId);
    areaJogo.querySelectorAll('.estrela, .meteoro').forEach((e) => e.remove());
    pontos = 0; nivel = 1; velocidade = 2; estrelas = []; meteoros = [];
    tEstrela = tMeteoro = 0; pausado = false; pausaEl.hidden = true;
    $('btnPausar').textContent = '⏸️ Pausar';
    elPontos.textContent = 0; elNivel.textContent = 1;
    mostrar(telaJogo);
    naveX = (largura() - NAVE_L) / 2; posicionarNave();
    jogoAtivo = true; ultimo = performance.now();
    rafId = requestAnimationFrame(loop);
}
function gameOver() {
    jogoAtivo = false; cancelAnimationFrame(rafId);
    const novoRecorde = pontos > recorde;
    if (novoRecorde) {
        recorde = pontos;
        try { localStorage.setItem('guardiaoRecorde', recorde); } catch (e) {}
    }
    $('msgRecorde').textContent = novoRecorde ? '🏆 Novo recorde!' : '';
    $('pontuacaoFinal').textContent = pontos;
    document.querySelectorAll('.recorde').forEach((e) => (e.textContent = recorde));
    mostrar(telaGameOver);
}

$('btnIniciar').addEventListener('click', iniciarJogo);
$('btnReiniciar').addEventListener('click', iniciarJogo);
$('btnPausar').addEventListener('click', alternarPausa);
document.querySelectorAll('.recorde').forEach((e) => (e.textContent = recorde));
criarFundo();
document.addEventListener('visibilitychange', () => { if (document.hidden && jogoAtivo && !pausado) alternarPausa(); });
