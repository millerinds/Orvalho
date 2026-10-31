# Estado atual do Orvalho

Data do handoff: 30/10/2026.

## Funciona

- Fluxo inicial, provador, Avatar Kit e persistência da aparência.
- Lab de IA navegável, com cinco interações e ligação provisória ao Hall.
- Hall navegável no térreo com os três corpos (Jujuba, Gota e Esguio).
- Cafeteria Pin na parede interna, na mesma linha do elevador e da escada de emergência.
- Nexo alinhada à parede interna e à passagem “Acesso às salas 1, 2 e 3”.
- Acesso às salas 1, 2 e 3 corrigido para a esquerda da Nexo, com maquete e fechamento envidraçado.
- Banheiros do térreo em corredor próprio, com portas em ambos os lados e PCD.
- Escada principal navegável: dois lances, patamar, chegada ao primeiro andar e descida.
- 1º andar refeito pelas fotos E01–E45, X46 e X47 (ver `EXPANSAO-PRIMEIRO-ANDAR.md`):
  - faixa interna com ACIOC Hub, núcleo, salas fechadas e Administrativo;
  - ala leste sobre o palco, com corredor de poltronas e Incubadora Joaçaba.
- O vidro do ACIOC fica na borda da laje e é visto do térreo; a Incubadora aparece por cima do palco.
- Portas de ACIOC, Administrativo, Incubadora e salas internas abrem quando o boneco se aproxima.
- Correções de 31/10:
  - a parede do térreo que cortava o 1º andar agora para na laje;
  - Administrativo com mesa de reuniões e sala interna (Dagliê na entrada, Danimara mais para dentro);
  - Incubadora refeita e sem nomes de empresas;
  - salas de podcast e servidor;
  - dois nichos de banheiro navegáveis;
  - elevador sem cintilação.
- 2ª rodada de 31/10:
  - Administrativo com sala de projetos, área de reuniões e sala de Dagliê e Danimara, com mais espaço para circular;
  - Incubadora sem sala isolada e com a porta externa norte funcionando;
  - salas de incubação com portas;
  - arte do elevador na ordem original;
  - nichos de banheiro refeitos;
  - portas das escadas de emergência abrindo para antecâmaras;
  - lixeiras fora do vão.
- Câmera acompanha a mudança de nível e respeita lajes/forros.
- Persistência de `x`, `y`, `z`, ambiente e câmera.
- Quatro assentos interativos nos arcos.
- NPCs Keila, Dagliê e Danimara construídos pelo mesmo sistema do avatar:
  - cada um tem um ponto de atendimento à frente, com "E · Conversar";
  - durante a conversa, a câmera enquadra a pessoa por cima do ombro e o diálogo fica na base da tela.
- Keila atende pela frente do balcão da recepção.
- Elevador interativo entre térreo e 1º andar, mantendo aparência e câmera:
  - folhas que abrem e fecham e cabine visível nos dois pavimentos;
  - painel lateral com visor e seta de viagem.

## Parcial ou propositalmente limitado

- As divisas e dimensões do 1º andar são estimadas pelas fotos, pois não há planta oficial do pavimento.
- A largura da ala leste (11 m) conflita com os 44 m do PDF do ático.
- Salas das empresas e salas fechadas do corredor não são navegáveis.
- A Nexo permanece fechada. O volume visível e os móveis documentados foram preservados, sem criar usos ou salas adicionais.
- A porta envidraçada no fim do corredor dos banheiros é fechada.
- O Lab continua como ambiente separado; o elevador não declara um pavimento para ele.
- Medidas verticais e profundidade do térreo continuam estimadas por fotos.
- Logos de terceiros continuam genéricos; o logo INOVALE é aproximado.

## Pendente de referência externa

- Planta oficial do térreo e do 1º andar, sobretudo a largura da ala leste e as divisas entre núcleo, salas e Administrativo.
- Fotos do interior das salas fechadas do corredor e da ordem real das salas das empresas.
- Medidas com trena: profundidade do hall, pé-direito, nível do primeiro andar e largura/comprimento da escada.
- Caminho real até o Lab de IA.
- Arquivo oficial do logo INOVALE e autorização para marcas de terceiros.
- Conteúdo institucional definitivo dos painéis marcados como demonstração.

## Fontes de verdade

- Cena: `ambientes/hall-inovale/hall-inovale.js`.
- Planta atualizada: `docs/hall/planta-hall-v2.json` (v2.1, com térreo e 1º andar) e índice E01–E45 + X46/X47 em `docs/hall/indice-fotos-primeiro-andar.txt`.
- Planta visual: `docs/hall/planta-hall-v2.svg` e `.png`.
- Motor de níveis: `src/mundo/sala.js`, `src/mundo/colisao.js`, `src/mundo/jogo.js` e `src/mundo/camera.js`.
- Resultados automatizados: `testes/relatorio-navegacao-*.json` e `testes/relatorio-fluxo-avatar.json`.
