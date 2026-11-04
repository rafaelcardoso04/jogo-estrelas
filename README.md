# 🌌 O Guardião das Estrelas

Jogo de navegação espacial feito com **HTML5, CSS3 e JavaScript puro**, sem bibliotecas ou frameworks. Você controla uma nave, coleta estrelas douradas e desvia dos meteoros. Basta encostar em um meteoro para o jogo acabar.

> Projeto de estudos de Rafael Cardoso Flor.

## 🎮 Como jogar

- Mova a nave para os lados.
- Colete as estrelas douradas ⭐ para ganhar **10 pontos** cada.
- Desvie dos meteoros cinza ☄️. **Um único impacto termina a partida.**
- A cada **100 pontos** você sobe de nível e o jogo fica mais rápido.
- Na tela de fim de jogo, clique em **🔄 Reiniciar** para jogar de novo.

### Controles

| Ação | Teclado | Celular / mouse |
|---|---|---|
| Mover para a esquerda | ← | Arrastar o dedo ou o mouse para a esquerda |
| Mover para a direita | → | Arrastar o dedo ou o mouse para a direita |
| Pausar / continuar | `P` ou `Esc` | Botão **⏸️ Pausar** |
| Ligar / desligar o som | | Botão **🔊 Som** |

O jogo pausa automaticamente se você trocar de aba.

## ✨ Funcionalidades

- Nave desenhada em **SVG**, com chama animada no motor.
- Fundo azul escuro com **50 estrelas brancas** que piscam devagar, cada uma em um ritmo diferente.
- Meteoros redondos, cinza escuro, com crateras.
- **Dificuldade progressiva:** a velocidade aumenta e os meteoros surgem com mais frequência a cada nível.
- **Recorde** salvo no navegador (`localStorage`).
- **Efeitos sonoros** gerados pela Web Audio API, sem arquivos de áudio.
- **Responsivo:** a área do jogo se ajusta à largura da tela.
- **Acessibilidade:** foco visível nos botões, placar anunciado por leitores de tela e animações desativadas para quem usa `prefers-reduced-motion`.

## 📁 Estrutura do projeto

```
├── index.html   # Estrutura das telas (inicial, jogo e fim de jogo)
├── estilo.css   # Visual: fundo, nave, estrelas, meteoros e telas
└── script.js    # Lógica: movimento, colisões, níveis, pausa, som e recorde
```

## ▶️ Como executar

**Online:** acesse a página do jogo publicada no GitHub Pages.

**Localmente:**

1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/rafaelcardoso04/Projeto-site-de-jogos.git
   ```
2. Abra o arquivo `index.html` (ou o HTML do jogo) no navegador.

Não é preciso instalar nada.

## ⚙️ Como funciona

- **Loop do jogo:** usa `requestAnimationFrame` com cálculo de tempo entre quadros (`dt`), então a velocidade é a mesma em telas de 60 Hz, 120 Hz ou mais.
- **Surgimento de objetos:** estrelas e meteoros são criados por temporizadores dentro do próprio loop, sem `setInterval`, o que evita acúmulo de timers ao reiniciar.
- **Colisão:** compara a posição da nave com a de cada objeto. Nos meteoros, a área de colisão é um pouco menor que o desenho, para que passar raspando não seja punido.
- **Objetos fora da tela:** são removidos do DOM e do array, para o jogo não ficar pesado com o tempo.

## 🔧 Personalização

Alguns valores que você pode ajustar no `script.js`:

| O que mudar | Onde |
|---|---|
| Velocidade inicial | `velocidade = 2` em `iniciarJogo()` |
| Aumento de velocidade por nível | `velocidade += 0.4` no loop |
| Pontos por estrela | `pontos += 10` no loop |
| Frequência das estrelas | `tEstrela > 800` (milissegundos) |
| Frequência dos meteoros | `Math.max(500, 1200 - nivel * 80)` |
| Rigor da colisão com meteoros | o `5` em `bateu(m, m.tam, 5)` (quanto maior, mais fácil) |
| Quantidade de estrelas no fundo | `i < 50` em `criarFundo()` |

As cores do tema ficam nas variáveis CSS no início do `estilo.css` (`--dourado`, `--azul`, `--borda`, `--texto`).

## 🛠️ Tecnologias

- HTML5
- CSS3 (variáveis, animações, `clip-path`, `aspect-ratio`)
- JavaScript (ES6+, `localStorage`, Web Audio API, Pointer Events)
- SVG

## 🚀 Ideias para o futuro

- Trilha sonora de fundo
- Animação de explosão ao bater no meteoro
- Itens especiais (escudo, vida extra)
- Placar com os melhores resultados

## 👤 Autor

**Rafael Cardoso Flor**
GitHub: [@rafaelcardoso04](https://github.com/rafaelcardoso04)
