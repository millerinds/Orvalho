# Estado atual do Orvalho

> **3º andar explorável e Lab IA integrado (25/11/2026, Fase B):**
> - leia `EXPANSAO-TERCEIRO-ANDAR.md` (implementação) e `docs/terceiro-andar/ANALISE-3O-ANDAR.md` (análise e planta v0);
> - o jogo começa no 3º andar (ambiente `terceiro-andar`), dentro do Lab, que agora é uma sala da fachada (planta x 25,4–30,2) com a porta para o corredor da SCL;
> - o elevador liga térreo, 1º e 3º andar (o 2º segue indisponível);
> - o Lab ficou com 6,0 × 4,8 m e com os materiais do prédio; o Lab avulso (`lab-ia`) continua registrado por compatibilidade;
> - empresas com nome legível: SCL Automação, Salus, Athostec e Unimed Meio Oeste SC (salas fechadas, vistas pelo vidro);
> - o PDF da raiz é a planta oficial do ático; conversão para o jogo: `x = 44 − x_pdf`, `z = 20 − y_pdf`.

> **Publicado em 31/10/2026:**
> - repositório <https://github.com/millerinds/Orvalho>;
> - jogo <https://millerinds.github.io/Orvalho/>;
> - Kalil (`KalilMassignaniDaRosa`) é colaborador com permissão write.
>
> Ver `PUBLICACAO.md`.

Data do handoff: 30/10/2026.

## Funciona

- Fluxo inicial, provador, Avatar Kit e persistência da aparência.
- Lab de IA navegável, com quatro interações, agora como sala do 3º andar (25/11/2026): a porta abre para o corredor e o elevador leva ao Hall.
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
- 3º andar: salas das empresas e salas sem foto ficam fechadas (vistas pelo vidro); o salão do fundo tem interior neutro; as escadas de emergência não ligam os andares (ver `EXPANSAO-TERCEIRO-ANDAR.md`).
- Medidas verticais e profundidade do térreo continuam estimadas por fotos.
- Logos de terceiros continuam genéricos; o logo INOVALE é aproximado.

## Pendente de referência externa

- Planta oficial do térreo e do 1º andar, sobretudo a largura da ala leste e as divisas entre núcleo, salas e Administrativo.
- Fotos do interior das salas fechadas do corredor e da ordem real das salas das empresas.
- Medidas com trena: profundidade do hall, pé-direito, nível do primeiro andar e largura/comprimento da escada.
- Medidas do 3º andar com trena (profundidade do Lab, largura do corredor), uso e extensão do salão e nomes ilegíveis das salas A, B e X.
- Arquivo oficial do logo INOVALE e autorização para marcas de terceiros.
- Conteúdo institucional definitivo dos painéis marcados como demonstração.

## Fontes de verdade

- Cena: `ambientes/hall-inovale/hall-inovale.js`.
- Planta atualizada: `docs/hall/planta-hall-v2.json` (v2.1, com térreo e 1º andar) e índice E01–E45 + X46/X47 em `docs/hall/indice-fotos-primeiro-andar.txt`.
- Planta visual: `docs/hall/planta-hall-v2.svg` e `.png`.
- Motor de níveis: `src/mundo/sala.js`, `src/mundo/colisao.js`, `src/mundo/jogo.js` e `src/mundo/camera.js`.
- Resultados automatizados: `testes/relatorio-navegacao-*.json` e `testes/relatorio-fluxo-avatar.json`.
