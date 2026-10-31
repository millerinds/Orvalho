# Orvalho: regras de design, modelagem e método

Este documento resume as decisões tomadas no projeto Orvalho (site de quiz em Flask, visual Frutiger Aero) e no boneco 3D com provador. Serve de base para os projetos derivados.

## 1. Direção estética

**Ideia central:** Frutiger Aero, como se tivesse nascido em 2026. A sensação é de um lugar calmo, luminoso e úmido de onde dá vontade de não sair. É feito de céu, água, bolhas, folhas e vidro molhado.

**O que é a cara do projeto:**
- **Bordas grossas.** A assinatura vem dos cards do antigo "Quiz Toon": borda sólida de 3–4 px na cor `--edge` e sombra dura deslocada (`4–7px 4–7px 0 var(--edge)`), sem desfoque. É isso que dá o ar de objeto 3D de brinquedo.
- **Brilho de gota.** Um gradiente branco ocupa a metade de cima e corta seco (`rgba(255,255,255,.9)` → transparente por volta de 45–52%).
- **Vidro só em acento.** `backdrop-filter` vai em painéis flutuantes (barra, popover). Nunca use vidro e sombra dura no mesmo elemento com `filter`: um `drop-shadow` no pai desliga o `backdrop-filter` dos filhos.
- **Ambiente vivo.** Céu em degradê com bokeh, que são bolhas subindo devagar. Animações ficam entre 200 e 400 ms, com ease-out ou um "pulinho" (`cubic-bezier(.3,1.4,.5,1)`).
- **Tipografia limpa e plana.** Nada de bevel, contorno ou cromado em texto.

**O que evitar:**
- O visual do WindowBlinds de 2007: menus densos, cinza chapado, botão vermelho de "Buy Now".
- Lens flare e chrome metálico.
- Gradientes concorrendo entre si.
- Cara de IA genérica.
- Névoa por cima de imagem de fundo. Isso foi testado e rejeitado.

## 2. Tokens de cor

| Papel | Valor |
|---|---|
| Céu (degradê do fundo) | `#0b62bd → #2a93e4 → #7cc8f5 → #d4efff → #eefaff` |
| `--sky-deep` / `--sky` / `--sky-mid` / `--sky-pale` | `#0a5fb4` / `#2f9be8` / `#7cc8f5` / `#d6f0ff` |
| `--aqua` / `--aqua-deep` | `#16bcc4` / `#0b8a95` |
| `--leaf` / `--leaf-deep` / `--leaf-pale` | `#71c935` / `#3b8f17` / `#e6f8d4` |
| Texto `--ink` / `--ink-soft` | `#0c2c4a` / `#3c5d7a` |
| **Bordas** `--edge` / `--edge-leaf` / `--edge-aqua` | `#0b3a6e` / `#2b6b0d` / `#06606a` |
| Acentos raros | coral `#ff8a5b`, âmbar `#f2a516`, erro `#e2506a` |
| Foco (anel) | `#19c2c9`, 3 px, offset 2 px |
| Raio de card | `--r-card: 24px` (molduras grandes: 28–34 px) |

**Fontes:**
- **Títulos:** Nunito, peso 800–900.
- **Corpo:** Figtree.
- **Rótulos pequenos e números:** JetBrains Mono, em caixa alta com `letter-spacing: .06em`.

**Ícones:** linha simples, `stroke 1.8–2.4`, cantos arredondados, em sprite SVG (`<symbol>`).

**Componentes base:**
- **Botão-gota:** pílula com gradiente de 4 paradas (claro → médio no meio → mais escuro logo abaixo → médio) e `::before` de brilho em cima. Variações: azul (padrão), `leaf` (verde, para confirmar) e `ghost` (branco).
- **Botão redondo de vidro (`.gbtn`):** 38 px, borda de 3 px, brilho radial em cima.
- **Trilho/slider estilo player antigo:** trilho côncavo e "pegador" verde em pílula.
- **Interruptor:** trilho com borda grossa; quando ligado fica verde com brilho e a bolinha desliza com o "pulinho".

## 3. O boneco: proporção e modelagem

**Referência visual:** o "buddy" do MSN e os bonecos de vidro-gelatina. Ele **não segue proporção humana**: a cabeça é grande e flutua acima do corpo, os braços são gomos soltos ao lado e ele só existe da barriga para cima. No palco, o corpo aparece inteiro e apoiado no chão.

**Medidas, em unidades do three.js:**
- **Cabeça:** esfera de raio 0,5, centro em y 1,65 (Jujuba), flutuando a cerca de 0,06 do topo do corpo.
- **Corpo:** `LatheGeometry` sobre um spline de pontos `[raio, altura]`, com altura de 1,09 na Jujuba e `scale.z = 0,85`, ou seja, levemente achatado.
- **Braço:** torno com 0,86 de comprimento, mais fino em cima. O pivô fica no ombro, em x ±0,6 e y 0,88, com inclinação de repouso de 0,36 rad.
- **Altura total:** cerca de **2,15 u**. Largura com braços: cerca de 1,6 u.
- **Variações de corpo:** Jujuba, Jujuba invertida, Gota, Gota invertida e Esguio. As invertidas são o perfil espelhado na altura (`flip()`). Cada corpo define `armX`, `armY` e `headY`.
- **Variações de braço:** Normal; Curto (metade do comprimento, solto do corpo, inclinado para dentro); Bolinha (esfera de raio 0,165 solta do corpo).

**Material vidro-gelatina** (`MeshPhysicalMaterial` com `clearcoat 1`, `roughness .18` e `onBeforeCompile`):
- Cada cor é um trio **base / borda / luz interna**. Por exemplo, azul é `#1f4fe0` / `#0a1d78` / `#38d6ff`.
- No shader:
  - a borda escurece pelo Fresnel (mistura com a cor de borda);
  - a luz interna sobe de baixo (`uTop`/`uBot`, em espaço do objeto);
  - a cabeça tem um arco de brilho branco embaixo;
  - **os olhos são desenhados no shader** com SDF (cápsula, bolinha, arco, estrela, espiral, `> <`), com piscar (`uBlink`) e olhar (`uLook`) por uniforms.
- **Contorno escuro:** é uma "casca invertida", ou seja, a mesma geometria com `BackSide`, empurrada ao longo da normal (0,035 no corpo e 0,012–0,022 em peças finas) e pintada com a cor de borda × 0,3.
- **Iluminação:** um ambiente de estúdio gerado com PMREM (cúpula cinza + "softboxes" redondas) e uma luz direcional fraca.
- **Saída de cor:** `outputEncoding = sRGBEncoding` e **sem tone mapping**. Com ACES as cores ficavam lavadas.
- **Fundo do estúdio:** cinza claro radial (`#fff → #eef0f1 → #d3d7da → #b7bcc0`) e sombra no chão feita com textura radial num plano.

**Paleta do boneco** (12 cores; cada uma é base, borda e luz interna):

| Cor | Base | Borda | Luz interna |
|---|---|---|---|
| Azul | `#1f4fe0` | `#0a1d78` | `#38d6ff` |
| Água | `#19b8d0` | `#05506a` | `#b4fbff` |
| Folha | `#3fae22` | `#0c4a3a` | `#d6ff5a` |
| Laranja | `#ff6f10` | `#a83300` | `#ffd76a` |
| Sol | `#ffbe0f` | `#c46a00` | `#fff3b0` |
| Rosa | `#ff6f9e` | `#b8235a` | `#ffe6f0` |
| Lilás | `#b07ff0` | `#6a35b0` | `#86f0ff` |
| Violeta | `#6e5cff` | `#2a1aa8` | `#e8e2ff` |
| Magenta | `#c0157f` | `#3a0b66` | `#ff70b0` |
| Fogo | `#ff3a12` | `#8f0c45` | `#ffb020` |
| Gelo | `#d5e3ea` | `#7d97a6` | `#ffffff` |
| Ônix | `#26272c` | `#050506` | `#a8a8a8` |

Peças com cor fixa usam paletas próprias:

| Paleta fixa | Base | Borda | Luz interna |
|---|---|---|---|
| branco | `#f7fbff` | `#7f98ab` | `#ffffff` |
| preto | `#14171f` | `#000000` | `#0a0c12` |
| amarelo | `#ffcf2a` | `#c46a00` | `#fff3b0` |
| rosa | `#ff9cbc` | `#c0406e` | `#fff0f5` |

**Como modelar peças novas (regra dos acessórios):**
1. **Formas:** use só formas **arredondadas e lisas**: torno (`lathe`), esferas, toros, cápsulas e `ExtrudeGeometry` com bevel. Cubos e cilindros com quina viva deixam buracos no contorno.
2. **Material:** toda peça passa por `piece(geo, corFixa?, espessuraDoContorno)`, que aplica o material gelatina e o contorno.
3. **Cor:** a peça usa a cor escolhida, exceto os detalhes, que levam uma paleta fixa (lente preta, pompom branco, estrela amarela).
4. **Posição:** monte em coordenadas da cabeça (raio 0,5, frente = +z) ou do corpo, quando a peça depende do formato. Para colar na superfície, use a normal (`quaternion.setFromUnitVectors`).
5. **Exageros:** cerca de 1,2–1,7× maior que o "realista". Pontas curvadas por deformação dos vértices (chapéus).
6. **Animação:** a peça pode ter `anim(t)` (as antenas balançam) ou `float` (sobe e desce).
7. **Ao trocar:** descarte geometria e material e remova a peça das listas de cores.

**Comportamento:**
- **Parado:** respira, olha em volta, pisca a cada 2,5–6 s e dá um pulinho a cada 9 s.
- **Mouse:** segue o mouse com olhos e cabeça; levanta o braço quando o cursor fica acima da caixinha.
- **Interação:** acena no hover, gira com arraste e balança como gelatina ao trocar de peça.
- **Transições:** as cores fazem um lerp de 0,12 por quadro.
- **Movimento reduzido:** com `prefers-reduced-motion`, fica parado e redesenha só quando algo muda.

## 4. Decisões já tomadas

- **Avatar:** moldura de borda grossa (vidro foi rejeitado) com uma janelinha de estúdio cinza.
  - São 6 formatos de janela, aplicados com `clipPath` `objectBoundingBox`. O feijão tem recortes próprios para a borda ficar uniforme.
  - O **lápis** troca só o formato. **Clicar no boneco** abre o provador.
- **Provador:** janela no estilo Windows Media Player, com o palco do boneco sobreposto saindo pela esquerda (a "abinha") e as abas **Provador | Interface** no topo.
  - Os menus ficam à direita, como categorias.
  - O **X**, o Esc e o clique fora salvam. Só o botão **Cancelar** descarta.
- **Interface (fundo e mouse):** só a estrutura por enquanto, sem aplicar nada no site.
- **Persistência:** `localStorage` agora; no app real, uma tabela `avatar_config` em JSONB com validação por lista branca.
- **Futuro:** o tema escuro será o "Dark Aero" (aquário à noite, bioluminescente).

## 5. Como as maquetes foram feitas

1. **Formato.** Cada maquete é **um HTML único** (CSS e JS dentro dele). O three.js vem do CDN `three@0.149.0/build/three.min.js` (r149, UMD), fixado nessa versão porque os shaders usam chunks dessa versão. Ícones em sprite SVG e fontes do Google Fonts.
2. **Iteração.** É só na conversa: o Kalil descreve ou manda prints anotados, eu edito o HTML, testo e publico.
3. **Teste.** Uso o Chromium headless (Playwright) com WebGL por software (`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`). Tiro prints dos estados importantes (cada opção, de frente, de lado, de costas, em mobile de 390 px) e monto **grades de comparação** antes de mostrar.
4. **Ajustes finos.** Variantes de forma (por exemplo, o feijão) são comparadas lado a lado antes de escolher. Contornos uniformes são calculados com geometria (offset de polígono), não no olho.
5. **Passagem para código.** A maquete aprovada vira referência (`design/referencia/*.html`). O Claude Code porta para o app, separando JS e CSS para a CSP, e para com prints lado a lado para aprovação.
6. **Ressalva.** Os testes rodam sem GPU, então a fluidez sempre precisa ser conferida na máquina do Kalil.
