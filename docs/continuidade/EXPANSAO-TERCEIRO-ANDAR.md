# 3º andar (ático): maquete explorável e Lab IA integrado (Fase B)

Data: 25/11/2026 (Claude). Base: a análise e a planta aprovadas em `docs/terceiro-andar/` (`ANALISE-3O-ANDAR.md` e `planta-3o-andar-v0.*`).

## Resumo

- **Ambiente novo:** o 3º andar é o ambiente `terceiro-andar` (`ambientes/terceiro-andar/`), carregado à parte, como recomenda o guia de VR (um ambiente por andar).
- **Elevador:** liga o 3º andar ao Hall nos dois sentidos (térreo, 1º e 3º). O 2º andar continua indisponível.
- **Lab IA:** deixou de ser uma sala solta.
  - Agora é uma sala da fachada do 3º andar, com a porta abrindo para o corredor da SCL.
  - O jogo começa dentro dele, como antes.
  - Saves antigos do Lab avulso abrem o Lab no 3º andar.
- **Materiais do Lab:** padronizados com os do Hall e do 1º andar.

## Coordenadas

Os números de `terceiro-andar.js` estão nas **coordenadas da planta v0**, as mesmas do Hall:

- x vai da ponta do café (0) à ponta do palco (44);
- z vai da fachada (0) ao núcleo;
- o arquivo converte com `X()` e `Z()`: **ambiente = planta − (3, 3)**;
- o retângulo do ambiente é o miolo fechado do ático: planta x 3,0–43,6, z 3,0–14,5;
- o piso do andar fica em y = 0 dentro do ambiente; a cota real estimada é +12,6 m;
- nos testes e nas capturas, as coordenadas são as do ambiente.

## Arquitetura implementada

| Elemento | Planta (x, z) | Fonte | Observação |
|---|---|---|---|
| Fachada envidraçada das salas | z 3,0 | PDF + foto do Lab | janelas com persiana de rolo e uma porta de sacada por sala; jardineira e pilares do lado de fora |
| Núcleo (parede "madeira") | x 9,85–26,17, frente em z 14,5 | PDF + T07, T17–T22, T32–T48 | duas escadas de emergência com antecâmara, elevador, venezianas duplas, hidrante, nicho PCD |
| Elevador "INOVAÇÃO ABRE PORTAS" | x 14,3 | PDF (alinhado ao do Hall) | portas animadas e cabine, como no Hall |
| Hall de estar | x 9,5–26,17, z 9,0–14,5 | T21, T30–T48 | tapete, dois sofás brancos (com assento), mesa de centro, almofadões azuis, bancada com 5 banquetas, vitrine, lixeiras, dois pilares escuros |
| Corredor da SCL | x 26,17–33,6, z 9,0–12,0 | T01–T10, T15–T18 | pilar branco, duas poltronas, floreira, planta, sofá azul com mesinha |
| Lab IA | x 25,4–30,2, z 3,0–9,0 | fotos do Lab + T09–T16 | ver "Como o Lab foi encaixado" |
| Sala A (película vermelha) | x 30,3–33,6 | T06, T15 | genérica, fechada, sem porta fotografada |
| Sala B (banner imobiliário) | x 22,2–25,3 | T11–T14 | genérica, porta branca trancada, banner sem nome |
| Salus | x 16,8–22,2 | T24–T29 | painel adesivado (porta trancada), salinha de vidro, aviso FAPESC |
| Athostec | x 11,1–16,8 | T30, T31, T44, T45 | porta adesivada trancada, painel escuro com a marca iluminada |
| Passagem e porta externa | x 9,5–11,1 | T34–T36 | porta de vidro para a jardineira (fechada) |
| Sala X | x 3,0–9,5, z 3,0–8,6 | T35, T36, T44 | genérica, porta escura trancada |
| Unimed Meio Oeste SC | x 3,0–9,5, z 8,6–14,5 | T37–T39, T46 | vidro jateado com quadrados, porta com placa (trancada) |
| SCL Automação | x 26,17–33,6, z 12,0–14,5 | T01–T03, T07, T08, T17–T25 | piso de madeira, letreiro, "Inteligência Industrial", porta "Administração", porta dupla de vidro (trancada) |
| Porta dupla de vidro "PUXE" | x 33,6, z 9,6–11,4 | T04, T05 | duas folhas que abrem para o corredor |
| Salão | x 33,9–43,6, z 3,0–14,5 | T04, T05, T08 | piso de madeira, janelas, TV em pedestal, bancadas baixas, cadeiras amarelas; uso não inventado |

**Salas fechadas:** as salas das empresas e as genéricas têm portas de verdade (folha, arte e puxador) que não abrem (`trancada`). O interior aparece pelo vidro, como no 1º andar. Estão listadas em `fechadas`, fora da malha de navegação dos testes.

**Salas genéricas** (sem foto interna: sala A, sala B, sala X, Unimed e o interior da Salus e da Athostec): postos de trabalho simples (`mesa-empresa`), armários e ar-condicionado. Não têm nome, logotipo nem objeto característico inventado. Os nomes ilegíveis continuam pendentes.

## Como o Lab foi encaixado

- **Fonte única:** `ambientes/lab-ia/lab-ia.js` continua sendo a fonte da mobília, dos eletrodutos, das luminárias, dos vãos das janelas e das interações do Lab. O 3º andar importa tudo girado:
  - `x_planta = 30,2 − z_lab`, `z_planta = 3,0 + x_lab`, rotação de −90°;
  - janelas na fachada (z 3,0), porta no corredor (z 9,0), parede azul em x 30,2 e parede cinza em x 25,4.
- **Adaptação de jogabilidade:**
  - fundo de **6,0 m**, o real (era 7,2 m);
  - largura de **4,8 m**: a real estimada é 3,0 m, e os +1,6 m vêm da sala A, sem nome nem foto, como recomendado na análise.
- **Mobília:** as fileiras de mesas não mudaram de ordem nem de afastamento entre si. Encolheram só a zona da janela (1,80 → 1,25 m) e a da porta (2,10 → 1,45 m). A lixeira saiu da frente da porta e foi para o vão entre o carrinho e a mesa 1.
- **Larguras livres medidas:**
  - corredor principal: 1,40 m;
  - corredor de fundo: 0,97 m;
  - zona da janela: 1,25 m;
  - zona da porta: 1,53 m.
  O corpo mais largo (Gota) precisa de 0,74 m.
- **Porta:** branca com bandeira, junto à parede azul. Abre para dentro ao chegar perto e encosta na parede azul.
- **Frente para o corredor:** dois vidros com película e o painel "Laboratório de Inteligência Artificial", como em T15.
- **Interações preservadas:** os três monitores e o carrinho de recarga, com os mesmos textos. A antiga "ligação provisória" para o Hall saiu; o caminho real é pelo corredor e pelo elevador.
- **Lab avulso (`lab-ia`):** continua registrado, com o mesmo layout de 6,0 m e os materiais novos, por compatibilidade (testes, ramo VR e saves antigos). A porta dele leva ao corredor do 3º andar. Saves antigos são convertidos para o 3º andar (`Orvalho.ambientes.migracoes['lab-ia']`).

## O que mudou visualmente no Lab

| Antes | Depois (padrão do prédio) |
|---|---|
| Piso branco brilhante de 0,60 m | Porcelanato cinza-bege de 0,90 m com rejunte, o mesmo do Hall (`pisoTinta #aaa398`) |
| Parede azul viva `#5a84c0` | Azul mais fechado, o das fotos (`#56709a`); a identidade do Lab ficou |
| Paredes brancas e cinza-azuladas, rodapé claro | Pintura e rodapé do prédio (`#d9d6d0`/`#cfd1d0`, rodapé `#8f8070`) |
| Forro branco puro | Forro cinza-claro do prédio (`#e2e1dc`) |
| Vidro do corredor com degradê azul | Película de triângulos do corredor, a mesma das outras salas, como se vê do corredor em T15. A foto de dentro do Lab (09.27.12 (1)) mostra um degradê azul na base do vidro, que pode ser o verso da película ou o reflexo do pufe; fica como ponto a confirmar |
| Porta e caixilhos próprios | Porta lisa com bandeira e caixilho de alumínio das divisórias do prédio |
| Paisagem genérica e "corredor" falso atrás do vidro | Jardineira e pilar da fachada pela janela; corredor real, SCL e escada pela porta |

Os móveis do Lab (mesas, cadeiras, monitores, carrinho, puff e armário) e as interações não mudaram.

## Mudanças no motor (pequenas e opcionais; o Hall continua igual)

- `sala.js`:
  - **`pilares[].cor`:** cor por pilar (brancos junto à SCL, cinza-amarronzados no estar), mais **`fora`** (pilar externo, sem colisão);
  - **`pisos`:** piso sobreposto com textura (madeira da SCL e do salão);
  - **`fechadas`:** salas não navegáveis, fora de `limites.dentroDaSala`;
  - **painéis baixos com portas `'vao'`:** a divisória não colide no vão; quem colide é a folha da porta animada. A Nexo, cujas portas não são `'vao'`, continua sólida;
  - **`portasAnimadas[].trancada`:** a folha existe, mas não abre; `comPortasAbertas` (testes) também não a abre;
  - **parede com textura:** cada pedaço mostra o seu trecho da textura da parede inteira. Antes os trechos estreitos sobre as portas saíam espremidos; isso também melhora a parede interna do térreo do Hall.
- `elevador.js`: andares em dados (`O.elevador.andares`); 3º andar habilitado, 2º indisponível; o visor mostra T, 1 ou 3.
- `jogo.js`:
  - **elevador entre ambientes:** cada ambiente declara as paradas (`elevador.paradas[]`, com `chegada`). Se o destino está em outro ambiente, `irPara` troca de ambiente durante a viagem e as portas abrem no destino;
  - **`irPara(id, ponto, aoChegar)`:** os dois parâmetros novos são opcionais;
  - **`Orvalho.ambientes.inicial`:** ambiente de entrada (hoje o 3º andar);
  - **`Orvalho.ambientes.migracoes`:** conversão de saves;
  - **defeito antigo corrigido:** no elevador, um comentário engolia `player.update`, `cam3.atualizar` e `salvar()` (`jogo.js`, antiga linha 299).
- Hall: as paradas do elevador declaram as chegadas que já existiam (sem mudança de posição), e `chegadas['terceiro-andar']`.

## Escadas

As escadas de emergência do 3º andar seguem o PDF (x 12,0–13,0 e 24,7–25,7) e, como no térreo e no 1º andar, abrem para uma antecâmara com uma segunda porta corta-fogo fechada.

**Os lances entre andares não foram ligados:**

- no 1º andar do jogo, a segunda escada está em x 30,85, cerca de 5 m fora da posição do PDF;
- o 2º andar não existe.

Ligar as escadas exigiria corrigir o 1º andar (fora do escopo) e modelar os lances e o 2º andar, sem fotos. A circulação vertical é pelo elevador.

## Testes

Ver `TESTES-E-VALIDACAO.md` (seção "3º andar"). Resumo:

- cenário novo `npm run teste:terceiro`, para os três corpos;
- `teste:tudo` passou a incluir o 3º andar (Jujuba, Gota e Esguio) e o Lab avulso;
- **resultado em 25/11/2026:** tudo passou, sem erros de console:
  - 3º andar: 141 verificações por corpo, 100% do piso livre alcançável;
  - Hall: 253 por corpo;
  - Lab avulso, fluxo do avatar e matriz do 1º andar também passaram.
- O teste "vidro do 1º andar" já falhava no `HEAD` original e foi corrigido no próprio teste (ver `TESTES-E-VALIDACAO.md`).

## Comparações visuais

Ficam em `docs/terceiro-andar/comparacoes/fase-b/`, fora do Git:

- foto × jogo: corredor (T09, T01), frente do Lab (T15), núcleo (T19, T21), estar (T38), Salus (T26), porta do salão (T04), SCL e núcleo (T07), Athostec (T44);
- Lab antes × depois, nos mesmos ângulos, e Lab × fotos do Lab;
- vista aérea do andar.

## Pendências e problemas conhecidos

- **Medidas:** frente das salas (z 9,0), largura do corredor e cota do piso são estimadas. Falta a trena (ver a análise).
- **Salão:** a extensão real (a planta de 2019 tinha terraço até z ≈ 18,4) e o uso são desconhecidos. O interior é neutro.
- **Nomes ilegíveis:** sala A, sala B (banner) e sala X ficam sem nome, e o interior delas é genérico.
- **Marcas:** SCL, Salus, Athostec e Unimed aparecem com o nome e composições simplificadas, sem URL nem QR. Falta autorização formal das marcas.
- **Fundo da Unimed** (faixa nordeste) e a sala "Administração" da SCL não foram modelados.
- **Porta externa** da passagem e portas de sacada das salas: fechadas (a jardineira não é navegável).
- **Escadas** entre andares não ligadas (ver acima).
- **Película do vidro do Lab:** usamos a das outras salas (T15). Falta confirmar se o degradê azul visto de dentro é da película ou reflexo do pufe.
- **Árvore de Natal e guirlandas** das fotos ficaram de fora (sazonais).
- **Ramo VR** (`recurso/vr-webxr`, no bundle):
  - não foi alterado nem integrado; o 3º andar ainda não tem `zonasVR` nem pontos de medição;
  - o andar segue a primeira regra do guia do VR (é carregado à parte) e mede ~200–430 chamadas de desenho e ~0,95 M triângulos no desktop (o Hall mede ~470 e 1,57 M);
  - a otimização específica de VR (compartilhar materiais da estrutura, células e zonas) não foi feita;
  - ao juntar os ramos, conferir `sala.js` e `jogo.js`, que os dois alteraram.

## Correções de 26/11/2026 (inspeção visual da versão publicada)

Seis pontos marcados pelo responsável nas capturas da versão publicada, conferidos com as fotos T04, T08, T15, T35–T37, T39, T44, T46 e o PDF do ático.

| # | Correção | Onde |
|---|---|---|
| 1 | **Pufes empurráveis:** os três almofadões junto à Unimed têm física dinâmica simplificada (empurrão do boneco, atrito com o piso, amortecimento, giro, colisão entre eles e com paredes, pilares e móveis; ficam no piso, sem quicar nem voar) | `src/mundo/fisica-moveis.js`; itens com `dinamico: true` |
| 2 | **Unimed e sala X:** frente da Unimed em x 8,9 e Unimed em L (ala junto à janela lateral); sala X horizontal (x 3,0–9,5, z 3,0–7,9) com frente e porta voltadas para o hall, recuada 1,5 m; lateral da Athostec no corredor da porta externa virou divisória de vidro com película | `terceiro-andar.js` |
| 3 | **Sala de reuniões Sicredi:** porta de vidro escuro na quina do núcleo (x 8,95–9,8), entre as venezianas (mantidas: aparecem em T37/T46) e a porta da Unimed; sala navegável de 4,25 × 3,0 m atrás da Unimed (anexo), com mesa para seis e a marca | anexo + `porta-sicredi` |
| 4 | **Cintilação dos batentes:** a moldura dos vãos `abertura` (nicho PCD, escadas, Sicredi) tinha a face interna no mesmo plano da cabeça da parede e da parede do anexo; agora fica 8 mm para dentro e cobre toda a espessura. Marcos de porta: 4 mm para dentro; batente das portas dos anexos com 3 mm de folga da folha | `sala.js` (`abertura`, marcos, anexos) |
| 5 | **Porta do Lab:** a arte é a textura da própria folha (`porta-lab`, mesma arte, proporção preservada) e gira com ela; o painel fixo ao lado saiu e o módulo voltou a ser vidro com película | `terceiro-andar.js`, `moveis-terceiro.js` |
| 6 | **Unoesc e SCL:** o "salão" é a Unoesc; a parede divisória corre na fileira de pilares (z 11,96), com a boneca de alvenaria entre o batente da porta dupla (z 11,4) e a divisória. Atrás dela fica a Engenharia da SCL (postos de trabalho). A SCL ganhou porta de entrada no vidro (x 31,85–32,75, abre) e passagem "ENGENHARIA" na parede do fundo da recepção; deixou de ser sala fechada | `terceiro-andar.js` |

**Motor (opcional, o Hall não usa):** `colisao.circulo` devolve o círculo; `st.raio` expõe o raio do boneco; `amb.dinamicos` dá o estado dos móveis empurráveis; vão `abertura` aceita `cor`.

**Decisões sem confirmação fotográfica completa:** profundidade da sala X e do recuo (estimadas por T35), medidas internas da Sicredi, posição exata da porta da SCL (deslocada 0,85 m da quina para não cair no giro da porta dupla da Unoesc, que abre para o corredor) e a passagem "ENGENHARIA" (placa vista em T08). O vaso que ficava diante da nova porta da SCL foi para o lado da porta dupla (T04, T05).

**Validação (rápida, a pedido):** carregamento do 3º andar, Hall e Lab avulso sem erros de console; pufe em área livre andou 1,27 m em 1,5 s de empurrão e parou ~3 cm depois de solto; contra o vidro da Athostec parou em z 9,44 (mínimo 9,40); Sicredi, SCL e Engenharia percorridas com o teclado; capturas das portas e batentes. A suíte completa (`npm run teste:tudo`) não foi rodada nesta etapa; as coordenadas do cenário do 3º andar que mudaram foram atualizadas em `testes/navegacao.js`.

### 2ª rodada de 26/11/2026 (prevalece sobre a anterior)

- **Unimed inteira:** retângulo contínuo x 3,0–8,9, z 9,0–14,5 (frente de 5,5 m, só um pouco menor que a original de 5,9 m), sem a ala em L.
- **L só na sala X, menor:** corpo x 3,0–9,5, z 3,0–7,9 (frente e porta voltadas para o hall) e uma perna x 3,0–6,6, z 7,9–9,0 sob a Unimed. O recuo diante da porta da sala X (2,9 × 1,1 m) abre para o corredor da porta externa, que continua com 1,6 m.
- **Portas:** só as do Lab e da Unoesc abrem. Sicredi, Unimed, sala X, salas da fachada, SCL (entrada e Engenharia) e as escadas de emergência ficam fechadas (`trancada`). SCL, Engenharia e Sicredi voltaram para `fechadas`.
- **Sicredi:** porta de vidro escuro, sem plotagem e sem interação. A sala continua modelada atrás dela.
- **Unoesc, sala de capacitação** (fotos 08.00.28 e 07.58.24):
  - a frente fica na parede da porta, com o painel de vidro, a tela e a mesa do instrutor;
  - na divisória ficam os quadros brancos e o painel azul;
  - são três fileiras de mesas brancas (`mesa-treino-a/b/c`), duas mesas por bloco e dois blocos, com painel frontal plotado em azul-escuro (a frase de Marcelo Gleiser legível na foto e ilustrações simplificadas) e cadeiras amarelas de encosto perfurado;
  - no fundo ficam a mesa de reunião com cadeiras pretas e a caixa de som;
  - há persianas de rolo, dois ar-condicionados cassete e luminárias retangulares;
  - corredores livres: junto à fachada 0,85 m, central 1,0 m, entre as fileiras 0,82 m, junto à divisória (da porta ao fundo) 1,85 m;
  - percorrida com o teclado da porta ao fundo e entre as fileiras.
