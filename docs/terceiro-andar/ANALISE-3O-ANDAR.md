# 3º andar (ático) do Polo Inovale: análise arquitetônica e planta v0

> **Fase B implementada (25/11/2026):** a maquete explorável e a integração do Lab estão descritas em `docs/continuidade/EXPANSAO-TERCEIRO-ANDAR.md`. Adaptação em relação a esta planta: o Lab ficou com 4,8 m de largura (x 25,4–30,2) e a sala A encolheu para x 30,3–33,6. As posições do resto não mudaram.

Data: 25/11/2026. Etapa só de **análise e planta**: nada foi modelado, e o Hall, o 1º andar e o Lab não foram alterados.

**Arquivos desta etapa**

| Arquivo | O que é |
|---|---|
| `ANALISE-3O-ANDAR.md` | este documento |
| `indice-fotos-3o-andar.txt` | T01–T48: nome original, número e descrição |
| `gerar-planta-3o-andar.py` | gera os três arquivos abaixo (`python3 docs/terceiro-andar/gerar-planta-3o-andar.py docs/terceiro-andar`) |
| `planta-3o-andar-v0.json` | os números da planta (fonte para a futura cena) |
| `planta-3o-andar-v0.svg` / `.png` | a planta desenhada, com legenda e pontos de foto |
| `comparacoes/pdf-atico-girado-180-orientacao-do-jogo.png` | o PDF oficial girado para a mesma orientação da planta v0 |

Fotos: o ZIP `WhatsApp Unknown 2026-11-25 at 09.48.20.zip` continua na raiz, sem alterações. A extração ficou em `referencia/fotos-terceiro-andar/originais/` e as cópias numeradas em `referencia/fotos-terceiro-andar/numeradas/`. Tudo isso fica fora do Git: as fotos e o ZIP pelas regras existentes, e a planta gerada e as comparações por linhas novas no `.gitignore`, no mesmo padrão do hall.

**Convenção usada neste documento**

- **Confirmado:** aparece de forma coerente no PDF e numa foto, ou em duas fotos.
- **Provável:** uma foto clara, ou uma dedução coerente com a estrutura.
- **Incerto:** sem foto ou planta suficientes.
- **Medidas:** só as cotas do PDF são medidas. O resto é estimado.

---

## 0. A descoberta que muda a etapa: o PDF da raiz é a planta deste andar

`Centro de Inovação Plantas-Layout3 (1).pdf` é a **"Planta baixa – Ático"** (prancha 03/03, Prefeitura de Joaçaba, jan/2019, escala 1:125). O totem do térreo chama o 3º andar de "3º andar – ático" (C18). Até agora o PDF só tinha servido para a estrutura do térreo (44 m, pilares a cada 8 m, núcleo). Para o 3º andar ele vale como planta.

Ele é, porém, um **projeto de divisórias de 2019**. As fotos de hoje mostram outra distribuição de salas. Por isso:

- **a estrutura vem do PDF:** contorno, núcleo, escadas, poço do elevador, pilares, parede do terraço e jardineiras;
- **a distribuição atual vem das fotos:** empresas, corredor, estar e frentes de vidro.

**Conversão para as coordenadas do jogo** (as mesmas do Hall): `x = 44 − x_pdf` e `z = 20 − y_pdf`. É uma rotação de 180°, sem espelhamento. Três conferências independentes fecham:

1. o poço do elevador do PDF cai em x 13,3–15,25, sobre o elevador do Hall (x 14,6);
2. a porta da escada de emergência do PDF cai em x 12,0–13,0, sobre a porta do 1º andar (x 12,0–13,0);
3. a frente do núcleo do PDF fica em z ≈ 14,5, contra z 14,6 no 1º andar.

## 1. Resumo do pavimento

O ático ocupa o miolo do prédio de 44 × 20 m, recuado das bordas por jardineiras:

- **núcleo** encostado no fundo, como nos outros andares, com duas escadas de emergência, elevador e sanitários;
- **hall de estar** largo na frente do núcleo, com sofás, tapete, pufes e uma bancada com banquetas;
- **corredor** que segue do estar para a ponta do palco, entre a SCL Automação (lado do núcleo) e as salas da fachada;
- **fileira de salas envidraçadas** ao longo da fachada, com cerca de 6 m de fundo e janelas para a jardineira. O Lab IA é uma delas;
- na ponta do café, a **Unimed** fecha o hall, e uma passagem leva a uma **porta externa**;
- na ponta do palco, uma **porta dupla de vidro** dá num **salão** com piso de madeira. Em 2019 essa área era o terraço 31.

Revestimentos: porcelanato cinza no piso (placas grandes), forro modular com luminárias e ar-condicionado cassete, núcleo revestido de "madeira" como no térreo e no 1º andar, divisórias de alumínio com vidro e película de triângulos (a mesma identidade do Lab e do Hall).

## 2. O que cada foto mostra

O índice completo, arquivo por arquivo, está em `indice-fotos-3o-andar.txt`. Agrupado por trecho:

| Trecho | Fotos |
|---|---|
| Corredor visto do fim (salão) para o estar | T01–T03 |
| Porta dupla do salão (fim do corredor) | T04, T05, também ao fundo em T06, T08–T10, T15, T16, T18 |
| Frente da SCL Automação | T01–T03, T07, T08, T17–T20, T23–T25 |
| Frente do Lab IA e salas vizinhas (A e B) | T06, T09–T16 |
| Salus | T12, T13, T24–T29 |
| Núcleo: escada (lado do palco), venezianas, hidrante, nicho PCD | T07, T17–T22 |
| Núcleo: vitrine, bancada, elevador, escada (lado do café) | T21, T22, T32, T33, T38, T40, T42, T43, T47, T48 |
| Hall de estar | T30–T34, T38, T41, T44–T48 |
| Athostec | T26, T27, T30, T31, T33–T36, T40–T42, T44, T45 |
| Fim do hall: Unimed, sala X e porta externa | T34–T39, T41, T44, T46–T48 |

## 3. Fotos que se confirmam entre si

- **Lab ↔ corredor:** pelo vidro do Lab (foto 09.27.12 (1), de 30/10) aparecem um pilar branco, o letreiro "SCL AUTOMAÇÃO" e a porta da escada com bonecos laranja. Do corredor, T17/T18 mostram exatamente esse conjunto, e T09, T15 e T16 mostram o painel do Lab de frente para a SCL. Assim o Lab fica **em frente à quina SCL/escada**.
- **Porta do Lab:** a porta branca com bandeira e leitor de acesso (09.27.12) é a mesma de T15/T16. Por dentro, a parede azul fica à esquerda da porta; por fora, o painel e os vidros ficam do outro lado. O Lab se estende da porta para o lado do café.
- **Janela do Lab ↔ PDF:** na foto 09.27.12 (2) há um **pilar de concreto logo atrás do vidro** e a jardineira na base (09.27.16). Isso corresponde à fileira de pilares da fachada do PDF (z 1,96), dentro da jardineira. O vidro das salas está, portanto, em z ≈ 3,0, a linha externa da faixa hachurada do PDF.
- **Núcleo ↔ PDF:** a ordem das portas nas fotos (T19, T21, T37, T38, T48) é a mesma do PDF: escada, porta dupla, …, elevador, escada, porta dupla. O elevador é preto com "INOVAÇÃO ABRE PORTAS", igual ao do térreo (T38, T48).
- **Unimed ↔ PDF:** a porta da Unimed fica logo depois da veneziana dupla, na quina do núcleo (T37, T46). No PDF, a sala 27 tem a porta nessa mesma quina.
- **SCL ↔ PDF:** a SCL ocupa a posição da sala 30, entre o núcleo e a parede do terraço. O pilar do PDF em x 26,02 aparece exatamente na quina da SCL (T18, T23).
- **Pilares:** o pilar branco junto à SCL e os dois pilares bege do estar (T30, T37) caem na fileira z 11,96 do PDF, nos x 26,02, 18,04 e 10,03.
- **Sequência das frentes:** T12, T14, T15, T26, T28, T30 e T45 se encadeiam sem lacunas. Do salão para a Unimed: sala A → Lab → sala B → Salus → Athostec → passagem → sala X/Unimed.

## 4. Distribuição espacial proposta (planta v0)

As coordenadas são do jogo. Os retângulos estão em `planta-3o-andar-v0.json`.

| Ambiente | x | z | Status da posição |
|---|---|---|---|
| Salão do fim do corredor (antigo terraço 31) | 33,9–43,6 | 1,4–18,4 | incerto (extensão) |
| Sala A, sem identificação | 28,6–33,6 | 3,0–9,0 | provável |
| **Lab IA** | **25,4–28,6** | **3,0–9,0** | **confirmado** (posição relativa) |
| Sala B (banner imobiliário) | 22,2–25,4 | 3,0–9,0 | provável |
| Salus | 16,8–22,2 | 3,0–9,0 | provável |
| Athostec | 11,1–16,8 | 3,0–9,0 | confirmado (posição relativa) |
| Passagem para a porta externa | 9,5–11,1 | 3,0–9,0 | provável |
| Sala X, sem identificação | 3,0–9,5 | 3,0–8,6 | incerto |
| Unimed Meio Oeste SC | 3,0–9,5 | 8,6–17,1 | confirmado (frente); fundo incerto |
| SCL Automação | 26,17–33,6 | 12,0–14,5 | confirmado |
| Corredor (frente da SCL) | 26,17–33,6 | 9,0–12,0 | confirmado |
| Hall de estar/circulação | 9,5–26,17 | 9,0–14,5 | confirmado |
| Núcleo | 9,85–26,17 | 14,5–21,5 | confirmado (PDF) |

## 5. Posição do Lab IA (âncora)

- **Onde fica:** na fileira de salas da fachada, em x 25,4–28,6 e z 3,0–9,0. Na vertical do Hall, fica entre o arco B e a plateia.
- **Porta:** abre para o **corredor da SCL**, em x 27,7–28,6 (lado da ponta do palco), de frente para a quina SCL/escada de emergência e para o pilar branco. O painel "Laboratório de Inteligência Artificial" fica logo ao lado da porta, do lado do café.
- **Vizinhos:**
  - do lado do palco, a **sala A**, sem identificação, com película de triângulos vermelhos e mesas;
  - do lado do café, a **sala B**, com o banner "o maior marketplace imobiliário da região" (empresa ilegível).
- **Em frente:** a SCL Automação e a escada de emergência do lado do palco, com a porta veneziana dupla ao lado.
- **Hall de circulação próximo:** o estar começa a cerca de 2 m da porta, logo depois da escada, na frente do núcleo.
- **Banheiros mais próximos:** o nicho PCD do núcleo, a cerca de 8 m (x ≈ 20,3).
- **Janela:** dá para a jardineira, com um pilar da fachada (x 26,02) logo em frente. Isso confere com a foto 09.27.12 (2).
- **Correspondência com o modelo atual do Lab** (`ambientes/lab-ia/lab-ia.js`, eixos reais): `z_mundo = 3,0 + x_lab` (janelas em z 3,0, porta em z 9,0) e `x_mundo = 28,6 − z_lab` (parede azul em x 28,6, parede cinza em x 25,4). A porta real (z_lab 0,15–1,05) cai em x 27,55–28,45, ao lado da parede azul, como nas fotos.

## 6. Empresas e organizações identificadas

Só nomes **legíveis** na sinalização:

| Nome | Onde aparece | Sala |
|---|---|---|
| **SCL Automação** ("Inteligência Industrial", placa "Administração") | letreiro no vidro e na parede (T01–T03, T07–T10, T17–T20, T23–T25) | ao lado da escada, lado do palco |
| **Salus** ("Método Salus · Individualidade Biológica", metodosalus.com.br) | painel adesivado (T12, T24–T29) | entre a sala B e a Athostec |
| **Athostec** ("Evolução, Desenvolvimento e Gestão de Alta Qualidade") | porta adesivada e logotipo iluminado (T30, T31, T44, T45) | entre a Salus e a passagem |
| **Unimed Meio Oeste SC** | placa na porta e no vidro (T37–T39, T46–T48) | fim do hall, lado do café |
| Laboratório de Inteligência Artificial (INOVALE, FAPESC, …) | painel (T09–T16) | o Lab |
| FAPESC (aviso "Esta empresa conta com fomento FAPESC") | folha no vidro (T24–T26) | dentro da sala da Salus; é aviso de fomento, não ocupante |

**Pendências de identificação (não inventar):**

- **Sala B:** o banner diz "o maior marketplace IMOBILIÁRIO da região" (+12.000 imóveis, +100.000 acessos), mas o nome da empresa e os logotipos não são legíveis.
- **Sala X:** a porta tem um adesivo escuro ilegível.
- **Sala A:** sem placa visível.
- **Salão do fim do corredor:** sem placa visível.

Pelo critério já usado no projeto (DECISOES.md), os logotipos de terceiros devem virar composições genéricas, com nome e cores, até haver autorização.

## 7. Banheiros, elevador e acessos

| Elemento | Posição (x, frente do núcleo em z 14,5) | Status |
|---|---|---|
| Escada de emergência, lado do café (porta com bonecos laranja + "SAÍDA") | porta 12,0–13,0; antecâmara e lances no PDF | confirmado (PDF + T32, T37, T38) |
| Porta dupla veneziana (shaft) ao lado | 10,15–11,6 | confirmado |
| Elevador "INOVAÇÃO ABRE PORTAS" | 13,3–15,25 (porta ~14,3) | confirmado (PDF + T38, T48) |
| Escada de emergência, lado do palco | porta 24,7–25,7 | confirmado (PDF + T18, T19) |
| Porta dupla veneziana ao lado | 22,8–24,2 | confirmado |
| Hidrante + extintor | ~22,2 | confirmado (T19–T21) |
| Nicho de banheiro: porta veneziana + banheiro PCD | ~19,4–21,2 | posição provável; existência confirmada (T21, T22) |
| Demais sanitários (PDF 32a–32d, 33–35) | dentro do núcleo, x 15,45–22,5 | provável pelo PDF; sem foto |
| Porta externa para a jardineira/terraço | x ~10,3, na fachada | provável (T35, T36) |
| Porta dupla de vidro para o salão | x 33,6, z ~10,5 | confirmado (T04, T05) |

**Observação para outra etapa (não corrigida agora):** no 1º andar do jogo, a segunda escada de emergência está em x 30,85. Pelo PDF, as escadas se empilham em x 12,0–13,0 e x 24,7–25,7. A escada do lado do café bate; a outra está ~5 m deslocada. Isso só importa se um dia as escadas forem ligadas entre andares.

## 8. Medidas estimadas

| Item | Valor | Tipo | Base |
|---|---|---|---|
| Prédio | 44 × 20 m | **confirmada** | cotas do PDF |
| Núcleo | 16,32 m (x 9,85–26,17); avança 1,5 m além dos 20 m | **confirmada** | PDF |
| Malha de pilares | ~8 m; fileiras em z 1,96 / 11,96 / 17,96 | **confirmada** | PDF + fotos |
| Portas comuns | 0,90 × 2,10 m com bandeira | **confirmada** (padrão do projeto) | tabela do PDF |
| Corredor de 2019 na frente do núcleo | 1,77 m | confirmada **para 2019**; hoje é o estar | PDF |
| Frente da SCL | z 12,0 | provável | PDF (sala 30) + pilar na quina (T18) |
| Vidro das salas da fachada | z ≈ 3,0 | provável | PDF + pilar visto da janela do Lab |
| Frente das salas da fachada | z ≈ 9,0 | estimada | Lab com 6 m de fundo |
| Corredor da SCL | 3,0 m (≈ 2,4 m livres ao lado do pilar) | estimada | posições acima; T09, T17 |
| Hall de estar | 5,5 m de fundo | estimada | T21, T38, T41 |
| Frente do Lab | ~3,2 m | estimada | T15 (porta + painel + 2 vidros) e MEDIDAS-lab-ia.md (3,0 m) |
| Larguras das demais salas | módulo de vidro de ~1,0–1,1 m × nº de painéis | estimada | contagem nas fotos |
| Pé-direito (forro) | ~3,0 m | estimada | igual ao Lab |
| Cota do piso | ~+12,6 m | estimada | 3 × 4,2 m (1º andar do jogo em +4,2) |

## 9. Elementos confirmados

- Contorno estrutural, núcleo, duas escadas com antecâmara, poço do elevador e malha de pilares (PDF).
- Ordem dos elementos na frente do núcleo, revestimento "madeira", hidrante, extintores, nicho PCD, vitrine, bancada com cinco banquetas, lixeiras e placa "não use o elevador" (fotos).
- Lab IA em frente à quina SCL/escada; porta, painel e vizinhança.
- SCL Automação ao lado da escada do lado do palco, com a frente para o corredor.
- Sequência das frentes: sala A → Lab → sala B → Salus → Athostec → passagem.
- Unimed fechando o hall, com a porta na quina do núcleo.
- Hall de estar: tapete, dois sofás brancos, mesa de centro, pufes azuis, dois pilares bege.
- Corredor: duas poltronas brancas, floreira de madeira, sofá azul com mesinha, pilar branco.
- Porta dupla de vidro no fim do corredor, com um salão de piso de madeira atrás.
- Jardineira externa na fachada das salas.

## 10. Elementos prováveis

- Vidro das salas em z ≈ 3,0 e salas com ~6 m de fundo (frente em z ≈ 9,0).
- Larguras individuais das salas da fachada.
- A porta do painel SALUS é a porta da Salus, e a porta branca vizinha é da sala B.
- Passagem entre a Athostec e a sala X, com a porta externa na fachada.
- Posição exata do nicho PCD e da bancada ao longo do núcleo.
- Demais sanitários dentro do núcleo, conforme o PDF.

## 11. Elementos incertos

1. **Salão do fim do corredor:** em 2019 era o terraço 31, descoberto. Hoje há um salão fechado atrás da porta dupla, mas não se sabe se ocupa o terraço inteiro, nem para que serve.
2. **Fundo e profundidade da Unimed:** é a área atrás dela (faixa hachurada nordeste no PDF). Não há foto.
3. **Sala X:** limites, porta e quem ocupa.
4. **Sala A:** onde fica a porta (não aparece nas fotos) e quem ocupa.
5. **SCL "Administração":** a sala de 2019 tinha 2,4 m de fundo. A sala "Administração" tem janela e pode avançar sobre o terraço norte.
6. **Porta branca entre a sala B e a Salus:** a qual das duas pertence.
7. **Linha das portas de 2019 (z 6,6):** não aparece no trecho fotografado. Como ela convive com as salas atuais é desconhecido.
8. **Medidas verticais:** cota do piso e pé-direito.
9. **Norte geográfico:** a planta usa a convenção do projeto (ponta do café = oeste). O norte real não foi verificado.

## 12. Salas sem foto interna: estratégia para a modelagem

| Sala | Interior | Estratégia futura |
|---|---|---|
| Lab IA | documentado (11 fotos) | reaproveitar o Lab existente (ver §13) |
| SCL Automação | parcial: recepção, letreiros, piso de madeira | modelar a recepção vista; fechar a porta "Administração" |
| Salus | parcial: salinhas de vidro, mesas | o que se vê pelo vidro; interior não navegável ou escritório genérico atrás da película |
| Athostec | parcial: painel com logo, mesas junto às janelas | o mesmo da Salus |
| Sala B | parcial: uma mesa, monitor, ar-condicionado | escritório genérico pequeno, sem nome |
| Sala A | parcial (de longe): mesas e cadeiras | escritório genérico, sem nome |
| Sala X | parcial: mesas com monitores | escritório genérico, sem nome |
| Unimed | não documentado (vidro jateado) | fachada fiel; interior fechado ou escritório genérico atrás do jateado |
| Salão do fim do corredor | parcial, pelas portas | só o que se vê pelas portas; porta fechada até haver foto |

**Escritório genérico provisório** (vale para qualquer sala sem foto):

- mesas retas de 1,40–1,60 × 0,60 m, cadeiras de escritório pretas, um armário baixo, ar-condicionado de parede e persianas;
- sem logotipo, sem nome e sem objetos característicos inventados;
- película de triângulos no vidro, como nas fotos;
- de preferência visto pelo vidro, sem precisar entrar (como as salas das empresas do 1º andar).

Nesta etapa nada disso foi modelado.

## 13. Próximos passos recomendados

**Antes da maquete, perguntar ou medir (por ordem de impacto):**

1. **Profundidade do Lab e largura do corredor:** com trena, da porta do Lab até a janela e da porta do Lab até o vidro da SCL. Isso fixa a frente das salas (z 9,0).
2. **O salão do fim do corredor:** o que é, se ocupa o antigo terraço inteiro e se pode ser fotografado por dentro.
3. **Os nomes ilegíveis:** sala B (banner imobiliário), sala X (porta escura) e sala A. Também, se as marcas SCL, Salus, Athostec e Unimed podem aparecer ou devem ficar genéricas.
4. **A porta da sala A** e a porta branca entre a sala B e a Salus.
5. **Fotos do fundo da Unimed e da sala X**, e da porta externa vista de fora.

**Decisões de jogo para a próxima fase:**

- **Encaixe do Lab:** o Lab do jogo tem 7,2 × 4,8 m (adaptado para o boneco), e a vaga real tem cerca de 6,0 × 3,2 m. As opções são:
  1. alargar a vaga para 4,8 m, tomando 1,6 m da sala A (sem foto e sem nome), e encurtar o Lab para 6,0 m de fundo;
  2. manter o Lab como ambiente separado, com uma transição pela porta.

  Recomendação: a opção 1, porque preserva a vizinhança real e mexe só numa sala genérica.
- **Ligação vertical:** abrir a parada "3º andar" no elevador (hoje bloqueada) em x 14,3, z 14,5, na cota estimada de +12,6 m. As escadas de emergência ficam com antecâmara e porta corta-fogo, como no 1º andar.
- **Circulação:**
  - corredor da SCL com ~2,4 m livres ao lado do pilar e estar com mais de 5 m: folga para os três corpos;
  - portas de 0,9 m podem virar 1,0 m, como no 1º andar, para a Gota (0,74 m) passar com folga;
  - a passagem para a porta externa (~1,6 m) é suficiente.
- **Pavimento:** usar o mesmo motor de níveis do Hall (`niveis`, `alturaPiso`, colisores filtrados por cota), com os três raios de colisor.

Quando estes pontos estiverem fechados, dá para pedir: **"agora sim, monte a maquete 3D do terceiro andar"**.
