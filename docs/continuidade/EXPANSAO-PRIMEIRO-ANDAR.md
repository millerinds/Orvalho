# 1º andar do Hall: revisão pelas fotos

## Ajustes finos (31/10/2026, 4ª rodada)

| Item | Causa / situação | Ajuste |
|---|---|---|
| Podcast largo demais | 5,6 m de frente | Estúdio compacto de 3,8 m (x 38,0–41,8), com a profundidade mantida (z 14,6–19,9) e porta de círculos em x 38,1–39,1. Mesa de 1,2 × 1,6 com 4 cadeiras nas laterais e 4 microfones, TV no centro do fundo, entre painéis estreitos (2 × 5). A luz indireta e o "NO AR" acompanharam. |
| Sala do servidor | Precisava ocupar o espaço liberado | Sala de reuniões com servidor de 6,0 m (x 32,0–38,0). Mesa redonda em x 35,0, TV na divisória (parede esquerda para quem entra), armário e cubo do servidor no canto, sem mudança. A porta (x 36,8–37,8) tem a dobradiça junto à divisória. |
| Painéis acústicos aparecendo na sala vizinha | A divisória era um plano de espessura zero, e o fundo dos quadrados ficava exatamente nesse plano (também na parede do Administrativo) | A divisória virou uma caixa de 10 cm, e os quadrados ficam a 3 cm da face. Os painéis estão só nas faces internas do estúdio. Um teste confere que todos ficam dentro dele. |
| Armário junto à porta do servidor | Era um armário de 0,9 m | Agora é um armário baixo e comprido (4,6 × 0,45 × 0,75 m), com portas de frisos e tampo claro, encostado no vidro desde o fim do vão da porta até a parede lateral. |
| Impressora no lugar da bancada de café | — | Bancada de café contínua (3,6 m) no vidro da sala de Dagliê e Danimara, com cafeteira, garrafas térmicas, xícaras e bandeja. A impressora foi para a parede da área de reuniões (face interna da parede norte), de frente para a mesa. |
| Barra no meio da porta da sala de projetos | O painel de vidro põe montantes a cada 1,0 m e um caía no meio do vão; o trilho inferior também atravessava o vão | Nenhum montante cai dentro do vão de uma porta, e as travessas abaixo da altura da porta são cortadas nele (vale para todos os painéis). Um teste varre o vão de cada porta animada atrás de geometria fora da folha. |
| Parede cinza da Incubadora | Painel do tipo "parede" junto à porta 103 | Virou uma divisória de vidro com faixa de triângulos. Atrás dela foi reconstruída a salinha envidraçada (x 46,5–49,2, z 11,75–14,6), com porta de vidro que abre e um posto de trabalho. O quadro da jornada foi para a face da salinha e as lixeiras ficaram ao lado dela. |

## Etapa de jogabilidade e detalhamento (31/10/2026, 3ª rodada)

| Item | Causa / situação | O que foi feito |
|---|---|---|
| Mureta atravessável | O colisor era uma linha na borda da laje, mas a mureta visível avança 0,15 m (faixa) a 0,285 m (tampo de granito) para dentro do corredor: o boneco afundava nela antes de parar. Uma sonda de 321 empurrões em vários ângulos não achou queda; o problema era o boneco entrar na mureta. | O colisor da mureta agora é gerado pela própria geometria (`sala.js`, guarda-corpo do mezanino): uma linha na face do tampo voltada para o corredor, com tampões em cada ponta até a borda. Vale só no pavimento da laje e em toda a altura (o pulo não passa). Os colisores manuais da borda saíram; ficou só o do vidro do ACIOC. As poltronas da ala leste foram afastadas para não entrar no tampo. |
| Portas de vidro com vidro parado no vão | O vidro fixo do painel cobria o comprimento inteiro, inclusive o vão da porta | O vidro e as faixas adesivas do painel são recortados nas portas; sobre o vão fica só a bandeira acima da porta. A folha de vidro ganhou caixilho, dobradiças e puxador, todos filhos do mesmo pivô: tudo gira junto. Fechada, a folha bloqueia; aberta, o vão fica livre e a folha encostada colide. |
| Pulo | Novo | Espaço, só do chão, sem pulo duplo: agacha 0,09 s, impulso de cerca de 0,42 m, gravidade de 15 m/s², alongamento subindo, pouso com achatamento e balanço de mola (escala do `root`; o kit do avatar não foi alterado) e braços erguidos no ar. A altura é medida sobre o piso de `alturaPiso` (térreo, escada e 1º andar), e a colisão horizontal segue ativa no ar. A cabeça respeita forros e lajes (`tetoEm`). A câmera sobe só 45% da altura do pulo, com suavização. |
| Danimara | A mesa ocupava a passagem junto à porta | A mesa e a personagem foram 0,5 m mais para o fundo e 0,4 m para o sul (agora em x 53,1, z 18,75). O ponto de conversa acompanhou. A Dagliê não mudou. |
| Sala de reuniões com servidor (antes "servidor", fechada) | Detalhamento pedido | Ficou com 4,2 m (x 32,0–36,2) e forro a 2,9 m: mesa redonda de 1,0 m com 4 cadeiras no centro, TV no meio da parede esquerda (leste), armário alto no canto direito do fundo com o cubo do servidor no alto (frisos de ventilação e LEDs que pulsam devagar), armário baixo junto ao vidro, à direita da porta. A porta abre e a sala é navegável. Interação "Ver equipamento", com painel demonstrativo sem especificações. |
| Estúdio de podcast | Vidro fumê, sala fechada | Vidro transparente com caixilhos; 6 painéis acústicos de quadrados pretos e cinza com espessura (nas 3 paredes); TV no centro do fundo; mesa quadrada de 2,0 m com 8 cadeiras e 4 microfones em braço articulado com pop filter e cabo; forro a 2,9 m com luminárias, luz indireta quente no alto das paredes, faixa de destaque junto ao piso e sinal "NO AR". A porta (de círculos) abre e a sala é navegável. Interação "Conhecer o estúdio", com texto genérico demonstrativo. |

## Correções de 31/10/2026, 2ª rodada (Administrativo, Incubadora, elevador, banheiros, escadas de emergência)

| Problema | Causa | Correção |
|---|---|---|
| Faltava a sala de projetos no Administrativo | Na rodada anterior, a sala pequena com posto branco e cadeira preta (E21) foi removida ao reduzir o Administrativo | O Administrativo segue a ordem de quem entra: **sala de projetos** envidraçada de frente para a porta (x 41,8–44,8, z 16,4–19,9, com dois postos), **área de reuniões** com a mesa de nogueira junto às janelas e o armário com impressora, e **sala de Dagliê e Danimara** ao fundo (x 50,4–55), com Dagliê logo na entrada, Danimara mais para dentro e armários atrás delas, diante das janelas (E28). |
| Administrativo apertado | 8,8 m de frente e passagens de 0,6 m | 13 m de frente (de x 41,8 a 55), faixa de circulação de 1,8 m junto à frente e passagens de 1,0 m ou mais entre móveis e divisórias. Adaptação discreta, como no Lab. |
| Sala 101 da Incubadora isolada e porta externa que não abria | Uma parede inteira em z = 3,0 (atrás das ripas) separava a parte norte; a porta norte era só uma imagem colada no vidro | A parede foi removida: o canto de ripas é a divisão parcial, e a parte norte (101) é contínua com o coworking. A porta norte agora é uma porta que abre para o corredor. As salas de incubação também ganharam portas de vidro que abrem, com a dobradiça do lado da divisória. A sala envidraçada que tapava a frente da última sala de incubação saiu. |
| Arte do elevador cortada e invertida | Cada folha leva metade da arte, mas o grupo das folhas não é girado: quem olha do hall vê a folha em -x à direita, e ela recebia a metade esquerda | A folha em +x (esquerda de quem olha) leva a metade esquerda e a folha em -x, a direita. As demais medidas contra cintilação foram mantidas. Um teste confere a ordem nos dois pavimentos. |
| Banheiros estranhos | Nichos de 2,0 × 1,9 m, com pé-direito de 2,7 m, sem batente nas portas e com moldura baixa | Nichos de 1,8 e 1,6 m de largura por 1,2 m de fundo, com forro a 2,4 m na altura da moldura branca e soleira. Portas de 0,75–0,9 m com batente completo (verga e montantes) e uma luminária em cada nicho. O revestimento madeira continua, como em E10 e E18. |
| Portas das escadas de emergência não abriam | Eram só textura: folha fixa do vão (térreo) e placas (1º andar) | O térreo e as duas escadas do 1º andar ganharam um vão de verdade e uma porta que abre. Cada uma dá numa antecâmara curta, fechada por uma segunda porta corta-fogo com a placa "ESCADA DE EMERGÊNCIA". Os lances internos não foram fotografados e não foram modelados. |
| Lixeiras bloqueando a escada do térreo | Estavam na frente do vão (x 12,35–13,15, porta em 12,3–13,2) | Ficaram ao lado, diante da porta veneziana do shaft (x 11,35–12,15), e a porta da escada ficou livre. |
| Colisão das portas | O segmento era fixo na posição aberta | A colisão acompanha a porta: fechada, o vão é sólido; aberta, só a folha encostada colide (`colisao.segmento` devolve o segmento, com `off`). |

O ACIOC Hub não foi alterado (só ganhou um `id` na porta).

## Correções de 31/10/2026 (após teste do usuário)

| Problema relatado | Causa encontrada | Correção |
|---|---|---|
| Parede bloqueando a entrada do Administrativo e cortando o ACIOC Hub | A parede sul do térreo (z = 15, revestida de madeira) subia até o forro (8 m) e colidia em **todos** os pavimentos. Atravessava o 1º andar inteiro logo depois das portas (folga medida de 0,10 m em z = 15 no ACIOC e no Administrativo). | Essa parede agora termina na laje (`altura: 3.2`) e colide só no térreo (`soTerreo`). As paredes dos anexos do térreo também passaram a colidir só no térreo. |
| Administrativo grande demais e com divisão errada | Leitura anterior das fotos | Agora vai de x 41,8 a 50,6. Na entrada fica a mesa de reuniões de nogueira, com armários e armário de impressora na parede oeste. Ao fundo, a sala interna envidraçada (x 46,8–50,6), com a porta logo à frente da mesa da Dagliê e a Danimara mais para dentro. As duas ficam de frente para a porta. O trecho x 50,6–55 ficou fechado, por não haver referência. |
| Armário encostado na entrada | O armário de impressora ficava a 0,24 m do vão | Foi para o fundo da parede oeste. |
| Layout interno da Incubadora | Ilhas repetidas para preencher o espaço | Pela porta sul (103): quadro e lixeiras na parede cinza, a sala envidraçada à direita (E36) e a mesa verde com TV junto ao vidro (E33, E36). No meio, o par de mesas azul e verde (E34) e a mesa branca (E35). Ao fundo, o canto de ripas (E33, E34, E41). Salas de incubação envidraçadas junto às janelas. A sala 101 (porta norte) fica fechada. |
| Nomes das empresas | Pedido do usuário: a Incubadora funciona por ciclos | BusQme, NEXUS CORE, quatroin e MocaPlus foram removidas das placas, artes, interações e textos. Ficaram só placas genéricas "Sala de incubação" e o ponto "Salas de incubação". Nenhuma empresa foi inventada no lugar. |
| Portas do elevador cortadas e piscando | A face das folhas coincidia com o plano da parede (térreo z = 15,0; 1º andar z = 14,6), o topo das folhas coincidia com a verga e o fundo do portal superior coincidia com o painel | As folhas ficaram 4,5 cm atrás do plano da parede, 1,2 cm mais baixas que o vão e com 4 mm de folga lateral; a cabine começa atrás delas e o portal se afastou 1,5 cm. Validado quadro a quadro (aberturas 0,71 → 0,92 → 0,98 → 1 → 0,25 → 0,05 → 0) nos dois pavimentos. |
| Salas entre o ACIOC e o Administrativo | Paredes de uma cor só | De leste para oeste: **podcast** (porta de círculos e vidro fumê, placa "Podcast", interação informativa), **servidor** (vidro jateado e porta lisa, sem identificação, fechada) e o núcleo com **dois nichos de banheiro navegáveis** (anexos com `y = 4.2`: PCD + veneziana, feminino + veneziana), hidrante, extintores e as duas escadas de emergência. Os interiores sem foto não foram inventados. |
| Letreiro do ACIOC | O grafismo ia até a parede da porta e era legível só por dentro | O grafismo foi centralizado na fachada (x ≈ 1,6–8,7), com face voltada para o hall (legível do térreo, como em X46, e espelhada por dentro, como em E15). A parede escura com o logotipo recuou 0,6 m. |
| Portas internas estreitas | 0,90 m | A porta do ACIOC e a da sala interna passaram para 1,0 m: o corpo Gota passa com folga. |


Data: 30/10/2026. Esta revisão substitui a leitura da primeira expansão, que não foi aprovada visualmente.

## Referências

- E01–E45: `referencia/fotos-primeiro-andar/`. O índice arquivo por arquivo está em `docs/hall/indice-fotos-primeiro-andar.txt`.
- X46 e X47: `WhatsApp Image 2026-10-30 at 16.32.03.jpeg` e `16.32.04.jpeg`, na raiz do repositório. São fotos do térreo que não constavam do índice anterior e são decisivas:
  - X46 mostra o ACIOC Hub acima do café, com a frente de vidro e o grafismo verde na borda da laje.
  - X47 mostra o palco, a escada e o 1º andar continuando por cima da parede do palco, com as portas pretas "INCUBADORA JOAÇABA" e os cartazes das empresas incubadas.
- O ZIP original (`WhatsApp Unknown 2026-10-30 at 16.32.09.zip`) continua na raiz. Ele não está em `referencia/`, ao contrário do que dizia a versão anterior deste documento.

## O que estava errado na expansão anterior

| Ambiente | Antes | Pelas fotos |
|---|---|---|
| ACIOC Hub | Sala atrás do corredor, com porta lateral em x 4–5,5; vidro comum, sem nada visível do térreo | Ocupa a ponta oeste da faixa interna, inclusive a largura do corredor. O vidro com "coworking ACIOC HUB" e a faixa verde fica na borda da laje (X46, E15). A porta está no fim do corredor, depois do elevador (E11, E12), e logo atrás dela fica uma parede escura com logotipo e TV (E12–E14). |
| Incubadora | Na faixa interna (x 18–33), no lugar do núcleo | Fica na ala leste, sobre o palco (X47, E31, E32, E44, E45). Tem salas 101–103, duas portas pretas, cartazes "empresas incubadas" no vidro e uma fileira de poltronas cinza-azuladas de costas para o guarda-corpo. |
| Núcleo | Paredes lisas | Revestimento "madeira" (E09–E11, E17), elevador preto com "A INOVAÇÃO ABRE PORTAS", duas escadas de emergência com porta veneziana ao lado, hidrante e tubo vermelho, nichos de banheiro (PCD e feminino), poltronas vermelhas arredondadas e extintores. |
| Entre o núcleo e o Administrativo | Parte da "Incubadora" | Salas fechadas (E07–E09): vidro jateado, parede com porta de círculos (marca ilegível) e vidro fumê. O interior não foi fotografado e não foi inventado. |
| Administrativo | Mesas genéricas de madeira laranja, x 33–44 | Fica em frente à chegada da escada. A porta adesivada (textos legíveis em E07, E08, E21) está no canto oeste; na frente do vidro há o banner "Qual é a sua ideia de negócio?" e uma poltrona (E06, E07). Dentro: sala envidraçada com postos brancos e cadeiras, armários altos brancos e a placa laranja "INOVALE · ADMINISTRATIVO" (E23, E27–E29); sala pequena com posto branco (E21); mesa compartilhada de nogueira com seis cadeiras junto às janelas (E22–E24); parede de armários com frisos e um armário baixo com impressora e garrafa térmica (E24, E25, E30); pilar redondo (E26). |
| Keila | Atrás do balcão, coberta pelo tampo; bolha só dentro da recepção | Continua no posto, atrás da parte baixa do balcão, sobre um estrado que o balcão esconde. O ponto de atendimento fica na frente do balcão ("E · Conversar"). |
| Dagliê e Danimara | Sentadas de costas para a entrada, em mesas genéricas | Sentadas em postos brancos vizinhos, de frente para quem entra na sala envidraçada, com "E · Conversar" pela frente da mesa. |
| Elevador | Só um painel em tela cheia; nada se movia na cena | As folhas abrem e fecham nos dois pavimentos e a cabine de inox é visível. O painel fica de lado, com visor e seta de viagem. A cena continua desenhando durante a viagem. |

## Distribuição adotada (estimada onde não há planta)

- Faixa interna, de z 11,7 a 20, com piso a +4,2 m:
  - ACIOC Hub: x 0–10,5.
  - Núcleo: x 10,5–26,2. O elevador fica em x 14,6, alinhado com o do térreo.
  - Salas fechadas: x 26,2–41,8.
  - Administrativo: x 41,8–55.
  - Corredor: z 11,7–14,6, com guarda-corpo na borda da laje.
- Ala leste, de x 44 a 55 e de z 0 a 20:
  - Corredor com poltronas: x 44–46,5.
  - Coworking da Incubadora: x 46,5–51,6.
  - Salas das empresas junto às janelas: x 51,6–55.
- A largura de 11 m da ala leste é estimada. X47 confirma que a ala existe, mas o PDF do ático indica um prédio de 44 m. É preciso a planta do 1º andar para resolver isso.

## Adaptações de jogo

- Larguras: o corredor da faixa interna tem 2,9 m e o da ala leste tem 1,57 m livres ao lado das poltronas.
- As portas que abrem giram para dentro quando o boneco se aproxima. O vão é sempre passável, e a folha aberta é representada por um segmento de colisão fixo.
- As salas das empresas e as salas fechadas do corredor não são navegáveis: o interior das empresas aparece através do vidro, e as salas fechadas não foram fotografadas.
- O estrado da Keila (0,45 m) compensa a escala de 1,30 m sem deslocá-la do posto. De frente, ele fica escondido pelo balcão.

## Segurança factual

- Nenhuma empresa incubada é identificada (correção de 31/10). Os cartazes do programa ficam genéricos.
- Logotipos de terceiros (ACIOC, empresas, patrocinadores) aparecem como composições genéricas, com nome e cores, sem reproduzir o desenho original.
- As falas dos NPCs só cumprimentam e orientam. Não há biografias nem dados pessoais.
- O elevador continua restrito ao térreo e ao 1º andar e não leva ao Lab de IA.

## Arquivos

- Planta e cena: `ambientes/hall-inovale/hall-inovale.js`
- Móveis: `ambientes/hall-inovale/moveis-hall.js`
- Textos: `ambientes/hall-inovale/conteudo.js`
- Motor:
  - `src/mundo/sala.js`: parede com altura própria, colisão só no térreo, painéis de janela, madeira e fumê, forros extras, portas animadas, sombras no 1º andar, limites da câmera e elevador 3D.
  - `src/mundo/elevador.js`, `jogo.js`, `interacao.js` e `camera.js`.
- Artes: `src/mundo/formas.js`.
- Estilo do diálogo e do painel do elevador: `css/orvalho.css`.
- Planta: `docs/hall/gerar-planta-v2.py` → `planta-hall-v2.{json,svg,png}` (v2.1).
- Comparações: `docs/hall/comparacoes/primeiro-andar/`.
