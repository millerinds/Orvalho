# Hall do Polo Inovale: maquete 3D (Fase B) e primeira exploração

Status em 30/10/2026: **maquete navegável**. O hall já é um ambiente do Orvalho, no mesmo motor do Lab de IA. As medidas continuam **estimadas** (ver `ANALISE-HALL.md`, v0.1, com o arco A já corrigido).

As imagens de referência são `maquete-v0-aerea.png` (sem o forro), `maquete-v0-mezanino.png` (do mesmo ponto da foto H29) e `maquete-v0-eixo.png` (do café para o palco).

## O que foi construído

**Arquitetura:**
- salão de 42 × 15 m com **pé-direito duplo geométrico** (forro a +8 m);
- **1º andar em U**: laje com faixa cor de areia, forro baixo a +3,2 m, piso a +4,2 m e guarda-corpo de granito com corrimão de inox, calculado automaticamente nas bordas voltadas para o vazio;
- **vidros das salas do 1º andar**, incluindo o coworking sobre o café e as salas do fundo;
- **6 pilares redondos**, que colidem e não deixam a câmera passar;
- **fachada de vidro** com caixilhos a cada 1,4 m, travessas, faixa fosca com triângulos, persianas e as portas de entrada;
- trecho de **parede branca da entrada** (vidro só em cima), onde o arco A encosta;
- canto envidraçado do café e parede preta do balcão;
- paredes internas com revestimento "madeira" e as portas da escada de emergência, do elevador, do acesso restrito e das salas 1–3;
- marquise interna;
- **escada aberta** junto à parede do palco, subindo do lado da fachada para o lado interno, com patamar. Nesta etapa ela é **só visual e bloqueada**.

**Móveis**, em volumes reconhecíveis (gelatina com contorno):
- café com 12 mesas e cadeiras amarelas, bancada alta com banquetas coloridas e balcão com geladeiras;
- floreiras **em fila junto às portas**, banco branco, poltrona amarela e **arco A encostado na parede da entrada**, com o painel virado para o hall;
- recepção laranja e branca (painel INOVALE do lado do palco, balcão curvo do lado do café, TV e folhetos virados para o café, topo impresso "INSPIRE, CONECTE, INOVE." visível do 1º andar);
- arco B;
- plateia de 2 × 9 fileiras com corredor central, palco com degrau, telão de LED, caixas de som e bancos junto à fachada;
- canto de estar e balcões azuis "Acesso às salas" sob o mezanino.

**Identidade:**
- o logotipo INOVALE é **desenhado de forma aproximada**: letras cinza e o triângulo laranja. Na Fase D deve ser trocado pelo arquivo oficial;
- os logotipos de terceiros (patrocinadores e outros) **viraram placas genéricas**;
- as fotos de pessoas do topo da recepção viraram silhuetas;
- a decoração de Natal ficou de fora.

## Câmera no hall

- Ela continua atrás do boneco e **não atravessa paredes, pilares nem móveis altos** (recepção, arcos, balcão do café).
- **Teto em cada ponto:** sob o mezanino ela fica abaixo do forro de 3,2 m; no vazio pode subir até 8 m. A suavização também respeita a laje.
- **Olhar para cima:** arrastar o mouse para cima (inclinação até −0,45) baixa um pouco a câmera e ergue o olhar, mostrando o guarda-corpo e as salas do 1º andar.
- **Configuração por ambiente** (`camera` na planta): o Lab mantém exatamente o comportamento anterior.
- Quando o equipamento em foco sai da tela, a bolha de interação fica presa na borda, em vez de sumir. Isso vale também para o Lab.

## Circulação e colisões

- Proporções reais. Os dois ajustes previstos na análise:
  - **plateia em blocos**, com corredor central de 1,40 m e laterais de 1,19 m e 1,25 m;
  - mesas do café a ~2,8 m entre centros.
- Os colisores foram conferidos contra a geometria visível: **diferença máxima ≤ 4 cm**. Os círculos são comparados pelo raio real.
- Não há colisor invisível: cada um vem de um móvel visível, de uma parede, de um pilar ou de um obstáculo da planta, como um bloco de cadeiras.
- A sala de vidro "nexo" fica **fechada** porque a porta dela não aparece nas fotos.

Larguras livres medidas pelo teste:

| Trecho | Largura livre |
|---|---|
| Entrada → interior do hall | 5,62 m |
| Café, entre a 1ª e a 2ª fileira de mesas | 0,91 m |
| Corredor central da plateia | 1,40 m |
| Plateia ↔ bancos da fachada | 1,19 m |
| Plateia ↔ linha de pilares | 1,25 m |
| Frente do palco | 1,70 m |
| Corredor sob o mezanino, junto à parede | 1,13 m |

**Cobertura:** 100% do piso livre é alcançável a partir da entrada, com os três tipos de corpo.

## Ligação com o Lab de IA (provisória e identificada)

- O caminho real até o Lab não aparece nas fotos. A ligação usa a **porta do elevador** do hall (botão "Ir para o Lab de IA (ligação provisória)") e a **porta do corredor** do Lab ("Ir para o Hall do Inovale (ligação provisória)").
- Nenhum corredor foi inventado.
- A aparência do boneco é preservada na troca, e a posição salva inclui o ambiente: "Continuar exploração" volta para o hall se foi lá que a pessoa parou.
- "Entrar no Orvalho" continua começando no Lab, como antes. Começar pela entrada do hall faz parte da Fase E.

## Testes (`npm run teste:hall`, `npm run teste:tudo`)

- **Hall, com os três corpos:**
  - 12 trechos dirigidos com o teclado sem travar (entrada → recepção → painel do arco A → café → balcão da cafeteria → corredor sob o mezanino → elevador → balcões → frente do palco → plateia → pé da escada → entre plateia e pilares → entrada);
  - 7 de 7 interações e nenhuma penetração;
  - ida e volta hall ↔ Lab com a aparência preservada;
  - console sem erros;
  - **~121 fps, ~225 chamadas de desenho, ~523 mil triângulos** (GPU Apple M4, headless).
- **Lab de IA, com os três corpos:** continua passando em tudo.
- **Fluxo** (provador, persistência, continuar): 16 de 16.

## Pendências

1. Medidas com trena: comprimento, profundidade, placa do piso e distância entre pilares.
2. Onde fica o Lab de IA em relação ao hall, para substituir a ligação provisória.
3. O que fica atrás das salas de vidro do 1º andar, e se o mezanino do fundo do palco chega à fachada.
4. Porta da sala "nexo", banheiros e porta secundária do café.
5. Arquivo oficial do logotipo INOVALE e autorização para logos de terceiros.
6. **Fase D:** materiais e detalhes Aero (sinalização, totens, vitrine de troféus, livros, banners do 1º andar, arte das portas). Também otimizar os triângulos das cadeiras, que são a maior parte da cena.
