# Hall do Polo Inovale: análise arquitetônica das 32 fotos (Fase A)

Status: **histórico (v0.1)**. A versão atual da planta é a **v1** (`planta-hall-v1.*`), corrigida com as fotos C01–C21 e a planta do ático; ver `CORRECOES-FASE-CD.md`. Na v0.1: o arco A fica encostado na parede da entrada, perto das floreiras (H29). As demais posições não mudaram. A Fase B (maquete 3D) parte desta planta.

Arquivos desta análise:
- `planta-hall-v0.svg` e `planta-hall-v0.png`: planta estimada e corte transversal;
- `planta-hall-v0.json`: os mesmos números, em formato de dados (é deles que a cena vai sair).

**Convenção:**
- "**confirmado**" quer dizer que o elemento e a sua posição *relativa* aparecem de forma coerente em duas ou mais fotos.
- **Nenhuma medida foi confirmada**: todas são estimativas. A régua principal é o piso (~0,90 m) e as alturas usam a porta (2,10 m), o balcão (~1,10 m) e as cadeiras como referência.

---

## 1. Índice das fotos

A pasta é `FOTOS HALL/`. A numeração segue a ordem do horário no nome do arquivo (13.27.07 → 13.27.38).

| Nº | Arquivo (horário) | O que mostra |
|---|---|---|
| H01 | 13.27.07 | Café: mesas, bancada alta e canto envidraçado da fachada, com pé-direito duplo e persianas |
| H02 | 13.27.09 | Entrada principal: portas de vidro, tapete INOVALE, marquise interna em cima, placa SAÍDA |
| H03 | 13.27.09 (1) | Da entrada para o palco: floreira, arco A com painel de patrocinadores, fachada |
| H04 | 13.27.10 | Vista longa até o palco: telão, escada aberta, mezanino do fundo, plateia, arco A |
| H05 | 13.27.10 (1) | Da recepção para o palco: pilares alinhados, borda do mezanino, plateia |
| H06 | 13.27.11 | Pilar, faixa do mezanino com logos de patrocinadores, área sob o mezanino (balcão, salas de vidro) |
| H07 | 13.27.11 (1) | Palco e telão de perto; escada atrás; mezanino do fundo com banners "Empresas incubadas/graduadas" |
| H08 | 13.27.12 | Bancos de madeira junto à fachada ("Dê um … na fome!"), arco A ao fundo |
| H09 | 13.27.13 | Vista longa do palco para o café (oposta à H04), fachada à direita |
| H10 | 13.27.13 (1) | Canto do estar: árvore, poltrona, tapete, porta "Acesso restrito", arco |
| H11 | 13.27.16 | Corredor lateral sob o mezanino até uma porta de vidro para fora; sala de vidro "nexo" |
| H12 | 13.27.16 (1) | Estar com árvore; ao fundo "Acesso às salas 1, 2 e 3" com balcão azul INOVALE |
| H13 | 13.27.27 | Balcões brancos, banqueta amarela, placa "Acesso às salas 1, 2 e 3", logo Pegoraro no mezanino |
| H14 | 13.27.28 | Sob a escada: porta branca, caixa de som, lateral preta do palco |
| H15 | 13.27.28 (1) | Balcões e sala de vidro "nexo" com placa SAÍDA |
| H16 | 13.27.29 | Arco à esquerda, vitrine de troféus; café ao fundo |
| H17 | 13.27.30 | Vitrine de troféus numa parede branca, placa "SAÍDA →" |
| H18 | 13.27.30 (1) | Interior do arco B: mesa branca, cadeiras amarelas giratórias |
| H19 | 13.27.30 (2) | De dentro da recepção: mesa, totem "Informações", coworking em cima |
| H20 | 13.27.31 | Totem de sinalização "Recepção" (térreo, 1º, 2º e 3º andar), porta do elevador |
| H21 | 13.27.32 | Balcão da recepção por fora; estante de livros, totem de LED, elevador ao fundo |
| H22 | 13.27.32 (1) | Recepção de frente: balcão laranja curvo, painel INOVALE; floreiras; placa "Rede Catarinense…"; porta da escada de emergência |
| H23 | 13.27.33 | Café: mesas amarelas; balcão "Pin"; porta da escada de emergência e pilar; ponta laranja da recepção |
| H24 | 13.27.34 | Do café para a entrada: bancada alta, pilar junto à fachada, portas; lado de trás da recepção (TV e balcão de folhetos) |
| H25 | 13.27.34 (1) | Lado de trás da recepção; corredor sob o mezanino ao longo da parede de madeira |
| H26 | 13.27.35 | **Do mezanino**, para baixo: café, bancada alta, entrada, tapete, floreiras, banco; topo da recepção |
| H27 | 13.27.35 (1) | **Do mezanino**: topo da recepção ("INSPIRE, CONECTE, INOVE."), arco A, plateia, palco, escada |
| H28 | 13.27.35 (2) | **Do mezanino**: mesmo enquadramento da H27, mais perto |
| H29 | 13.27.36 | **Do mezanino**: café, bancada, entrada, arco A, bancos da fachada, topo da recepção |
| H30 | 13.27.37 | **Do mezanino**: café inteiro e canto envidraçado (segundo tapete junto à fachada lateral) |
| H31 | 13.27.37 (1) | Balcão do café "Pin": armários de madeira, parede preta, geladeiras, estante junto ao vidro |
| H32 | 13.27.38 | Olhando para cima no café: borda do mezanino e o coworking com vidros adesivados |

## 2. Relação entre as fotos (análise cruzada)

**Ângulos opostos que fecham a planta:**
- **Eixo longo:** a H04 olha para o palco e a H09 olha para o café, do lado oposto. Nas duas a fachada fica do mesmo lado (esquerda na H04, direita na H09), o que confirma que o hall é **um salão comprido com a fachada num dos lados longos**.
- **Eixo curto:** a H22 olha do lado da entrada para a parede interna e a recepção. A H26–H30 olha do mezanino, que fica sobre a parede interna, para a fachada. Juntas, elas dão a profundidade e a ordem fachada → café/entrada → recepção → borda do mezanino.
- **Café ↔ entrada:** a H24 olha do café para a entrada e para o palco; a H01 olha da entrada para o canto do café.
- **Recepção por dentro e por fora:** a H19 é tirada de dentro e as H21/H22 de fora. As H24/H25 mostram o lado de trás do mesmo quiosque (TV e folhetos), virado para o café.

**Elementos repetidos usados como âncora:**
- o tapete INOVALE da entrada (H02, H26–H30);
- as duas floreiras de madeira com a caixa de presente (H03, H22, H26–H30);
- o painel de patrocinadores do arco A (H03, H04, H27–H29);
- a porta com bonecos laranja da escada de emergência (H22, H23, H24);
- a escada inox no fundo do palco (H04, H07, H14, H27);
- os pilares redondos cor de areia (H05, H06, H22, H23, H32);
- os logos na faixa do mezanino: "Rede Catarinense…" acima da recepção (H22) e Pegoraro/Dexco perto do palco (H06, H13);
- o coworking "ACIOC HUB" acima do café (H19, H32).

## 3. Arquitetura

- **Salão retangular comprido.** Numa ponta fica o café; na outra, o palco com o telão e a escada aberta. Comprimento estimado em ~42 m (faixa 38–45) e profundidade em ~15 m (faixa 14–17).
- **Fachada de vidro** em toda a face longa, com **pé-direito duplo** (~8 m). Tem caixilhos de alumínio em módulos de ~1,2–1,5 m e uma **faixa fosca com triângulos** na altura dos olhos: o mesmo motivo da marca INOVALE e da película do Lab de IA. Na parte alta há duas fileiras de **persianas de rolo cinza** (H01, H08, H09). A fachada **dobra o canto** no lado do café, onde o vidro também tem pé-direito duplo (H01, H26, H30).
- **Vazio do pé-direito duplo:** cobre a faixa junto à fachada e o centro do salão, do café até o palco. O forro do vazio tem placas brancas, painéis de LED quadrados e ar-condicionado cassete (H04, H05, H09).
- **1º andar (mezanino), em forma de U:**
  - uma faixa ao longo da parede interna, com ~3 m de profundidade;
  - um trecho sobre o balcão do café, onde fica o coworking (H32);
  - um trecho sobre o fundo do palco, com os banners "Empresas incubadas/graduadas" (H04, H07).
  - A borda tem uma **faixa cor de areia** de ~1 m (laje), com logos aplicados, e **guarda-corpo com tampo de granito e corrimão de inox** (H26–H30, em primeiro plano). Atrás da borda ficam salas com vidro (H07, H32).
- **Pilares redondos** (Ø ~0,6 m, cor de areia) alinhados na borda do mezanino, a ~8 m uns dos outros (estimado), e **um pilar junto à fachada**, ao lado das portas de entrada (H24).
- **Parede interna do térreo** revestida com porcelanato que imita madeira cinza-amarronzada (H13, H14, H22, H25). Sob o mezanino, o forro é baixo (~3,2 m), com placas e LED.
- **Parede do café** preta, com o balcão de madeira clara (H31).
- **Parede do palco** revestida de "madeira", com a escada inox subindo junto a ela.
- **Piso** em porcelanato cinza-claro, em placas grandes (~0,90 m; incerto entre 0,9 e 1,2 m).
- **Marquise interna** baixa (~3,2 m), cor de areia, sobre a entrada principal (H02, H24, H29, H30).

## 4. Distribuição dos espaços (do café ao palco)

1. **Cafeteria:**
   - balcão "Pin Café e Restaurante" encostado na parede do fundo, sob o mezanino;
   - armários de madeira, geladeiras e estante junto ao vidro (H31);
   - **~12 mesas redondas brancas** (Ø ~0,9) com **cadeiras amarelas** estilo Eames, no vazio (H26, H30);
   - **bancada alta de madeira com banquetas coloridas**, paralela à fachada, perto da entrada (H01, H24, H26).
2. **Entrada principal:**
   - portas de vidro no meio da fachada, sob a marquise, com o tapete INOVALE;
   - à direita das portas há um **trecho de parede branca** na fachada (H29);
   - junto às portas, **duas floreiras de madeira em fila**, perpendiculares à fachada, a de dentro com a caixa de presente;
   - em seguida um **banco branco**, também perpendicular à fachada, e uma poltrona amarela. *(corrigido na v0.1)*
3. **Recepção:** um quiosque solto em frente à parede interna, logo abaixo da borda do mezanino.
   - **Frente**, virada para a fachada: balcão laranja curvo com triângulos, painel branco "INOVALE · Centro de Inovação Vale do Rio do Peixe", estante de livros e totem de LED (H22).
   - **Lado do café:** parede branca com TV e balcão de folhetos laranja (H24, H25).
   - **Ponta do lado do palco:** o totem "Recepção" (H20).
   - **Topo:** impresso com fotos de pessoas e "INOVALE · INSPIRE, CONECTE, INOVE.", visível do mezanino (H27–H29).
4. **Arcos brancos**, estruturas curvas arredondadas que lembram "cabines":
   - **arco A**, **encostado na parede branca da entrada**, logo depois das floreiras, do banco e da poltrona (H03, H29). Ele avança ~3 m para dentro do hall, e o painel de patrocinadores fica na ponta, virado para o salão;
   - **arco B**, ao lado da recepção, com mesa e cadeiras amarelas giratórias.
5. **Área de eventos:**
   - **plateia de cadeiras pretas** com pés cromados, em fileiras e com corredor central;
   - **palco preto** (~0,6 m de altura), **telão de LED** (~6 × 3,3 m) e caixas de som em pedestal;
   - **bancos de madeira** junto à fachada (H08).
6. **Sob o mezanino, perto do palco:**
   - canto de **estar** (poltrona branca, tapete cinza; a árvore de Natal é sazonal);
   - **balcões brancos com painel azul INOVALE** junto à placa "Acesso às salas 1, 2 e 3";
   - sala de vidro "nexo" e um corredor até uma porta de vidro para fora (H11, H15).

## 5. Térreo × 1º andar e acessos (o que está documentado)

| Acesso | Situação |
|---|---|
| **Escada aberta** de inox, junto à parede do palco, subindo do lado da fachada para o lado interno até o mezanino | **confirmada** (H04, H07, H14, H27) |
| **Escada de emergência** (porta branca com bonecos laranja), na parede interna, atrás da recepção | **porta confirmada**; a escada em si não aparece |
| **Elevador** na parede interna, atrás da recepção | **porta confirmada** (H20, H21) |
| Entrada principal pela fachada | **confirmada** |
| Porta secundária no canto envidraçado do café | **incerta** (só um tapete na H30) |
| Corredor "Acesso às salas 1, 2 e 3" e saída lateral perto do palco | **confirmados**, posição aproximada |
| Banheiros | sinalizados no térreo (H20), mas **não aparecem nas fotos** |

O totem da H20 lista o que há em cada andar, mas o hall só integra **térreo e 1º andar**. Do 2º e do 3º andar (ático) não há nada visível.

## 6. Medidas estimadas

| Item | Estimativa | Base |
|---|---|---|
| Comprimento do hall | 42 m (38–45) | soma das zonas: café ~11, entrada ~6, recepção e arcos ~9, plateia ~9, palco e escada ~5 |
| Profundidade | 15 m (14–17) | ~9–10 placas da fachada até a frente da recepção (H30), mais o quiosque e a faixa sob o mezanino |
| Pé-direito do vazio | 8,0 m (7,5–8,5) | módulos da fachada; dois andares de ~4 m |
| Piso do 1º andar | +4,2 m | forro +3,2 mais a faixa de laje de ~1 m (H07) |
| Guarda-corpo do mezanino | 1,1 m | padrão; tampo de granito mais corrimão |
| Forro sob o mezanino | +3,2 m | portas de 2,1 m com bandeira (H11, H13) |
| Profundidade do mezanino lateral | 3 m | H25, H06 |
| Pilares | Ø 0,6 m, a cada ~8 m | H05, H22 |
| Palco | 3,5 × 7,5 m, 0,6 m de altura | H07 |
| Telão de LED | 6,0 × 3,3 m | H07 |
| Recepção | 7,5 × 3,0 m, balcão de 1,1 m, cobertura ~2,6 m | H22, H19 |
| Mesas do café | Ø 0,9 m; cadeiras de 0,47 m | padrão |
| Cadeiras da plateia | 0,50 × 0,50 m, fileiras a ~0,9 m | H04, H09 |
| Placas do piso | 0,90 m (0,9–1,2) | cadeiras e portas como régua |

## 7. Posições confirmadas × incertas

- **Confirmadas** (pelo menos 2 fotos coerentes):
  - fachada, canto envidraçado do café, entrada, marquise e trecho de parede branca da entrada;
  - café, com balcão, mesas e bancada alta;
  - floreiras, recepção (as quatro faces), arco A, plateia, bancos da fachada, palco, telão e escada aberta;
  - borda do mezanino com guarda-corpo, mezanino do café e do palco;
  - pilares da borda perto da recepção e da plateia, pilar junto à porta;
  - porta da escada de emergência, elevador, balcões de "Acesso às salas", estar.
- **Prováveis:** o arco B logo ao lado da recepção; a vitrine de troféus na face da recepção voltada para o palco; o pilar perto do café.
- **Incertas:**
  - quantidade exata de pilares e o espaçamento entre eles;
  - se existem outros pilares junto à fachada;
  - se o mezanino do palco chega até a fachada;
  - a porta secundária do café;
  - a sala "nexo" e a saída lateral;
  - a localização dos banheiros;
  - todas as dimensões absolutas.

## 8. Proposta para as próximas fases

**Organização** (o mesmo padrão do Lab, sem um segundo motor):

```
ambientes/hall-inovale/
  hall-inovale.js     arquitetura: salão, fachada, mezanino, pilares, escada, aberturas (gerado a partir de planta-hall-v0.json)
  moveis-hall.js      tipos novos de móvel (mesa redonda, cadeira Eames, cadeira de plateia, balcão laranja, arco, palco, telão…)
  conteudo.js         textos dos painéis (demonstrativos, identificados)
```

Os interativos e a colisão ficam na planta, como no Lab: os colisores saem dos móveis e das paredes.

**O que o motor comum precisa ganhar** (vale para os dois ambientes):
- **Níveis:** lajes de mezanino, forro em mais de uma altura, guarda-corpo e pilares (estes também viram colisores).
- **Fachada de vidro com caixilhos e persianas**, generalizando o vidro do Lab.
- **Escada visual:** modelada, mas bloqueada nesta etapa, com a indicação "1º andar em breve".
- **Câmera:** limite de inclinação maior para olhar para cima (até ~+50°) e teto de 8 m no vazio, mantendo o teto de 3 m no Lab.
- **Identidade INOVALE:** desenhar o logotipo (letras cinza com o triângulo laranja), os triângulos laranja do balcão e a faixa "INSPIRE, CONECTE, INOVE." como texturas.

**Jogabilidade** (sem aplicar os +60% do Lab):
- As proporções ficam as reais.
- Só a **plateia** e o **café** precisam de ajuste:
  - entre fileiras de cadeiras a 0,9 m sobram ~0,45 m livres, menos que os 0,66 m do boneco. A proposta é tratar cada bloco de fileiras como um obstáculo único, com **corredor central de 1,4 m e laterais de 1,0 m**;
  - no café, abrir ~10% o espaço entre as mesas para garantir passagens de ≥ 0,9 m.

**Transição com o Lab:** as fotos não mostram onde fica o Lab de IA. Proponho uma **transição provisória identificada** ("Ir para o Lab de IA · ligação provisória") na **porta do elevador**, que existe e está documentada. A porta do corredor do Lab traz de volta ao hall. Nenhum corredor seria inventado.

## 9. Pendências (respostas que melhoram a reconstrução)

1. **Duas ou três medidas com trena:**
   - o comprimento do hall (ou a distância entre dois pilares);
   - a distância da fachada até a parede interna;
   - o tamanho de uma placa do piso.
2. **Onde fica o Lab de IA** (andar e caminho a partir do hall), para trocar a transição provisória pelo caminho real.
3. Se o mezanino do fundo do palco chega à fachada, e se existem outros pilares junto ao vidro.
4. A porta secundária do café existe? Onde ficam os banheiros?
5. **Logos de terceiros:** patrocinadores na faixa do mezanino, Rede Catarinense, ACIOC/BRDE/Badesc, marcas de bebida no café. Proponho reproduzir **só a marca INOVALE** e transformar os demais em placas genéricas, a menos que vocês confirmem que podem aparecer.
6. **Decoração de Natal** (árvore, guirlandas, caixa de doação): é sazonal. Proponho deixar de fora.
