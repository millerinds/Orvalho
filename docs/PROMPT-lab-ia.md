# Projeto: Sala do Lab de IA em Frutiger Aero

## Contexto

Este projeto é um spin-off do **Orvalho**, o site de quiz em Flask com visual Frutiger Aero. Anexei dois arquivos:

- **`REGRAS-orvalho.md`:** cores, estética, como o boneco foi modelado e como as maquetes foram feitas. **Siga essas regras.**
- **`avatar-kit.html`:** o boneco 3D (three.js r149) com o provador completo (olhos, corpo, braços, cores, acessórios e formato da janela). Ele é a **peça pronta** que vamos reaproveitar.

## Objetivo

Recriar a **sala do laboratório de IA da minha faculdade** como uma cena 3D no navegador, no mesmo estilo Frutiger Aero do boneco. A sala deve ser aconchegante, brilhante e com cara de brinquedo de vidro-gelatina. A primeira entrega é uma **prova de conceito em um HTML único**.

O boneco é a **régua da sala**. Em vez de mobília "realista", a sala é construída na escala dele:

1. **Escala:** fixe que o boneco mede 1,70 m, então 1 unidade do three.js = 1 metro. Na prática, aplique `scale = 1.70 / 2.15` (cerca de 0,79) no grupo do boneco, já que hoje ele tem 2,15 u.
2. **Medidas reais:** transforme as medidas da sala em metros: pé-direito, portas, bancadas, cadeiras, monitores.
3. **Estilizar, sem perder a escala:** aplique as regras dos acessórios: formas arredondadas, bordas com contorno escuro, exagero leve (~1,2×) nas coisas pequenas. A sala precisa continuar reconhecível; o tamanho relativo entre o boneco e a mobília é o que importa.

## Referências que vou mandar

Vou mandar fotos do lab marcadas. Se faltar algo, me peça. O que mais ajuda:

- **Planta vista de cima:** pode ser um rabisco, com a posição de bancadas, portas, janelas e quadro.
- **Algumas medidas reais**, ou objetos de tamanho conhecido para usar de referência: porta ~2,10 m, mesa ~0,75 m de altura, piso de 60 × 60 cm.
- **Contagem:** quantas bancadas, PCs, cadeiras, ar-condicionado, projetor.
- **Cores e materiais marcantes:** cor das paredes, do piso, das cadeiras.
- **O que é a "cara" do lab:** algum objeto, cartaz ou detalhe que todo mundo reconhece.

## Como trabalhar

1. **Antes de modelar:** leia as fotos e me devolva:
   - uma **planta em metros**, simples, em SVG ou tabela;
   - uma **lista de objetos com dimensões**;
   - o que você precisou chutar.

   Espere eu corrigir.
2. **Primeira maquete:** monte a sala com blocos simples, sem detalhes, com o boneco dentro para conferir a proporção.
   - Câmera em **"diorama"**: isométrica ou perspectiva de cima e de lado, com a sala aberta como casa de bonecas (duas paredes cortadas).
   - Testes com prints de 3 ângulos e do boneco ao lado de uma bancada e de uma porta.
3. **Depois:** aplique o estilo:
   - **Materiais:**
     - móveis em gelatina/acrílico com contorno escuro;
     - vidro fosco nas janelas;
     - telas dos PCs brilhando em azul-água.
   - **Luz:** quente e suave.
   - **Ambiente:** céu Aero visto pelas janelas.
4. **Interação:** o boneco pode andar pela sala (setas/WASD ou clique no chão), mantendo o idle, o olhar e o provador. O provador abre como no kit.
5. **Leveza:**
   - poucos materiais;
   - geometria reaproveitada (`InstancedMesh` para cadeiras e PCs);
   - `pixelRatio` no máximo 2;
   - pausar com a aba oculta.

Mantenha o three.js na **r149** enquanto reaproveitar os shaders do boneco. Se precisar mudar de versão, avise antes.

## Primeira tarefa

Confirme que entendeu o kit:
1. Abra `avatar-kit.html` e me descreva como `Doll()`, o material gelatina, o contorno e os acessórios funcionam.
2. Proponha como vai separar "boneco" de "sala" no código. A ideia é que a fábrica do boneco vire um módulo reaproveitável.

Depois espere as fotos.
