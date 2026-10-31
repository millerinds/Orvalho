# Lab de IA: medidas reais (estimadas) × jogo (adaptadas)

A fonte de verdade é `ambientes/lab-ia/lab-ia.js`. Esta tabela é um resumo para conferir.

- **Real:** estimativa a partir do rabisco (6 × 3 m, pé-direito de 3 m), das fotos e da planta v0. **Ninguém mediu com trena.**
- **Jogo:** versão ampliada para o boneco circular em 3ª pessoa. Na v2 o boneco tem 1,30 m de altura e 0,66 m de tronco (Jujuba). O comprimento cresceu 20%; a largura, 60%, para caberem os corredores de 1,40 m e o corredor de fundo.

Eixos: x vai da parede das janelas (0) até a parede da porta; z vai da parede azul (0) até a parede cinza.

## Versão 2 (30/10/2026): personagem de 1,30 m e corredores de ~1,40 m

Na v1 (boneco de 1,70 m, sala de 7,2 × 3,8 m) o boneco só circulava na frente do laboratório. Na v2:
- o personagem caiu para **1,30 m** (escala 0,605, sem deformar);
- a sala ficou mais funda;
- as cadeiras ficam **encaixadas sob as mesas**;
- o puff foi para o canto do fundo;
- abriu-se um **corredor atrás das cadeiras 2 e 3**, que na sala real não existe, para chegar à frente dos monitores 2 e 3.

## Sala e circulação

Larguras **livres**, medidas pelo teste automático (`npm run teste:navegacao`) na planta de colisão, ao longo de todo o trecho.

| Medida | Real (estimada) | Jogo v1 | **Jogo v2** |
|---|---|---|---|
| Comprimento (janelas → porta) | 6,00 m | 7,20 m | **7,20 m** (+20%) |
| Largura (azul → cinza) | 3,00 m | 3,80 m | **4,80 m** (+60%) |
| Pé-direito | 3,00 m | 3,00 m | 3,00 m |
| Porta | 0,90 m | 1,00 m | 1,00 m |
| Corredor principal entre as fileiras, no ponto mais estreito (cadeira 1 ↔ mesas 2/3) | 0,45 m | 0,52 m | **1,40 m** |
| Corredor principal, fora da cadeira | 1,04 m | 1,23 m | **1,93 m** |
| Corredor de fundo (atrás das cadeiras 2 e 3) | 0,53 m (não passa) | 0,51 m (não passa) | **0,97 m** |
| Zona da janela | 1,35 m | 1,80 m | **1,80 m** |
| Zona da porta (no ponto mais estreito, ao lado da lixeira) | — | — | **1,65 m** |

Para passar, o boneco precisa de 2 × o raio do colisor: **0,66 m** (Jujuba), 0,74 m (Gota) e 0,53 m (Esguio). O caminho mais estreito (o corredor de fundo, com 0,97 m) ainda deixa pelo menos 23 cm de folga, mesmo com o corpo mais largo.

Os **móveis continuam no tamanho real**.

## Móveis (centro em x, z)

| Item | Medidas (L × P × A) | Colisor | Real | Jogo v2 |
|---|---|---|---|---|
| Carrinho de recarga | 0,64 × 0,55 × 1,05 | caixa | 2,28 · 0,39 | 2,62 · 0,40 |
| Mesa 1 (parede azul) | 1,60 × 0,60 × 0,75 | caixa | 3,72 · 0,40 | 4,30 · 0,42 |
| Cadeira 1 (encaixada) | Ø 0,62 | círculo de 0,36 | 3,81 · 0,95 | 4,30 · 0,89 |
| Lixeira | Ø 0,30 × 0,60 | círculo de 0,17 | 4,71 · 0,31 | 5,42 · 0,30 |
| Quadro elétrico (parede) | 0,40 × 0,50, de 1,45 a 1,95 m | — | x 5,30 | x 6,55 |
| Ar-condicionado (parede) | 0,86 × 0,29, topo a ~2,8 m | — | x 2,60 | x 2,90 |
| Mesa 2 | 1,60 × 0,60 × 0,75 | caixa | 2,11 · 1,93 | 2,60 · 2,95 |
| Mesa 3 | 1,60 × 0,60 × 0,75 | caixa | 3,68 · 1,93 | 4,22 · 2,95 |
| Cadeiras 2 e 3 (encaixadas) | Ø 0,62 | círculo de 0,36 | 2,13 / 3,81 · 2,47 | 2,60 / 4,22 · 3,47 |
| Armário | 0,90 × 0,45 × 0,75 | caixa | 0,74 · 2,67 | 0,95 · 4,555 |
| Puff (canto do fundo) | Ø 0,90 × 0,65 | círculo de 0,45 | 5,40 · 2,50 | 6,62 · 4,20 |
| Poste de energia | Ø 0,06 | — (fica sobre a mesa) | 1,42 · 1,70 | 1,88 · 2,72 |

Os colisores foram conferidos contra a geometria visível pelo teste: a maior diferença ficou abaixo de 4 cm. Em 30/10, o colisor da cadeira passou de 0,33 para 0,36 m, quando o teste começou a medir o raio real e achou os cantos do encosto 4,5 cm para fora. Monitores, notebooks, gabinete, poste e itens de parede não colidem, porque ficam sobre a mesa ou no alto. Não há colisor sem objeto visível: são 5 caixas, 5 círculos e 4 paredes.

Ficaram de fora, por decisão registrada: o robô, o suporte de TV com volante e a maleta.

## Vãos

| Parede | Real (z) | Jogo v2 (z) |
|---|---|---|
| Janelas: janela, janela, porta de vidro da sacada | 0–1,12 · 1,12–2,15 · 2,15–3,00 | 0,12–1,72 · 1,82–3,36 · 3,46–4,68 |
| Corredor: porta, vidro com película, vidro com película | 0,15–1,05 · 1,07–2,08 · 2,08–3,00 | 0,25–1,25 · 1,40–3,00 · 3,10–4,68 |

## Pendências para medir

1. **Piso:** "3 pisos e meio" na parede da porta, com piso de ~0,59 m (2 folhas A4 deitadas), dá ~2,1 m. O rabisco diz 3 m. Uma das duas informações está errada.
2. **Porta:** largura real e lado para onde abre.
3. **Vidros:** altura (estimada em ~2,60 m) e posição exata das divisões.
