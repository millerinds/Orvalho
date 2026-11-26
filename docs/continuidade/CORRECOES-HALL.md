# Correções do Hall — continuidade v2

## Referências usadas

- H01–H32 em `FOTOS HALL/`.
- C01–C21 indexadas por `docs/hall/indice-fotos-correcao.txt`.
- D01–D06 em `referencia/fotos-hall-correcoes/lote3/`, na ordem dos nomes:
  - D01/D03: balcão Pin, estante e saída envidraçada;
  - D02: Nexo, corredor e porta restrita;
  - D04: relação recepção → elevador → escada de emergência → pilar → porta de serviço → Pin;
  - D05/D06: portas restritas, hidrante, passagem, veneziana e banheiro acessível.
- `Centro de Inovação Plantas-Layout3 (1).pdf`: somente estrutura repetida (44 × 20 m, malha de pilares e núcleo). A distribuição do ático não foi aplicada ao térreo.

## Cafeteria

- Balcão principal saiu da parede oeste e foi para a parede interna, orientado para o salão.
- Porta de serviço foi colocada entre o balcão/freezer e o pilar x ≈ 10 m.
- Geladeiras do móvel ficaram na extremidade de menor x, próxima ao vidro.
- Estante de produtos foi para o canto envidraçado.
- A parede oeste agora é envidraçada até o fundo e inclui a porta de saída.
- Foi removida a projeção de um mezanino separado sobre as mesas. Permanece apenas o pavimento contínuo da faixa interna.

## Nexo e corredor

- A frente da Nexo passou de z = 12,4 para z ≈ 14,94, alinhada à parede interna.
- O volume da sala segue para dentro do prédio; não avança mais para o centro do Hall.
- A passagem “Acesso às salas 1, 2 e 3” permanece imediatamente ao lado.
- Foi criado o corredor navegável x = 31,5–33,5, z = 15–20, com veneziana, porta PCD e fechamento envidraçado.
- O interior da Nexo continua fechado e contém somente elementos visíveis nas fotos.

## Banheiros e segurança

- A passagem masculina já documentada em C10 foi mantida.
- A segunda passagem junto às portas restritas foi modelada a partir de D05/D06.
- Duas portas “Acesso restrito”, hidrante, tubulação, extintor e lixeira permanecem distintos e sólidos quando aplicável.
- A escada de emergência continua sendo uma porta fechada independente da escada principal aberta.

## Escada e primeiro andar

- A escada principal agora é `navegavel: true`.
- Dois lances de 12 degraus, patamar e chegada nivelada em +4,2 m.
- Guarda-corpos laterais sólidos em todas as cotas.
- Guarda-corpo superior tem abertura apenas em x = 42,3–44.
- Corredor superior acessível entre z = 12 e 13,6.
- Vidro das salas e borda do vazio são sólidos.

## Planta

- Fonte atual: `docs/hall/planta-hall-v2.json`.
- Derivados: `docs/hall/planta-hall-v2.svg` e `.png`.
- Gerador: `docs/hall/gerar-planta-v2.py`.
- v0 e v1 foram preservadas como histórico.

## Arquivos de implementação

- `ambientes/hall-inovale/hall-inovale.js`
- `ambientes/hall-inovale/conteudo.js`
- `src/mundo/sala.js`
- `src/mundo/colisao.js`
- `src/mundo/jogo.js`
- `src/mundo/camera.js`
- `src/mundo/formas.js`
- `testes/navegacao.js`
- `testes/fluxo-avatar.js`

## Correções de 26/11/2026 (térreo)

- **Luminárias flutuantes:** saíram quatro luminárias em y 3,2 sobre o café (x 1,8–3,6, z 8 e 10,5). Eram sobra do mezanino projetado sobre as mesas, removido na correção D01–D04, e ficavam soltas no vão do pé-direito duplo. No vazio as luminárias ficam no forro de 8 m; sob o mezanino (z ≥ 11,7), no forro de 3,2 m.
- **Acesso às salas 1, 2 e 3 e Nexo no canto do palco** (C12, D02, H13–H15):
  - em C12, na parede do palco (x 44), aparecem em sequência a caixa de som e a palmeira, a porta branca sob a escada (H14), os quadros elétricos e o acesso;
  - o acesso agora é um vão nessa parede (z 12,6–14,4), com um vestíbulo navegável sob a ala leste (`aberto: 'x0'`), a maquete e a porta das salas (fechada);
  - a Nexo foi para x 39,4–43,8, com a frente de vidro na parede interna e a porta dupla na ponta oeste;
  - o balcão com banquetas fica diante do acesso e o balcão azul INOVALE diante do vidro da Nexo;
  - a placa "Acesso às salas" fica sobre o vão e a placa SAÍDA sobre o vidro da Nexo;
  - a porta que existia na parede interna em x 40,9–41,8 saiu (ficava dentro da Nexo).
- **Região desocupada:**
  - a passagem x 31,5–33,5 voltou a ser o corredor dos fundos (H11, D02), com duas venezianas e a porta de vidro no fundo, sem a placa e sem a maquete;
  - o antigo vão da Nexo (x 34,0–38,2) virou parede revestida.
- **"Bebedouro":** era a maquete, um expositor com três blocos azul-água, sem colisão (`colisao: false`). Foi refeita como em C12 (pedestal preto, tampo branco e maquete branca de prédios) e colide pela caixa real (1,2 × 0,75 m).
- **Divergência:** em D02 a Nexo parece encostada no corredor das venezianas. Com a Nexo no canto do palco, como pedido e como mostram C12/H13/H15, sobra parede revestida entre os dois (x 33,5–39,4). Falta medida com trena para fechar a largura real da Nexo.
- Planta v2 atualizada no gerador (`gerar-planta-v2.py`).

### 2ª rodada de 26/11/2026 (salas 1, 2 e 3 e caixas de som)

- **Caixas de som do Hall:** apareciam com o modelo de tripé da Unoesc. O tipo do 3º andar tinha o mesmo nome (`caixa-som`), era carregado depois e substituía o do Hall. Ele virou `caixa-som-tripe` e o Hall voltou à coluna sobre o subwoofer (H14, C12), com o colisor original.
- **Salas 1, 2 e 3 sob a ala leste** (indicação do responsável; C12):
  - **Entrada** (x 44–49, z 10–16,4): a maquete do prédio fica à direita de quem entra e o posto da Vivian (NPC com "Conversar") à esquerda.
  - **Corredor à esquerda** (x 44,1–45,9) até o corredor das duas salas grandes junto à fachada (z 5,0–6,6). As salas grandes ocupam x 44,1–49,4 e x 49,4–54,9, z 0,1–5,0.
  - **Sala em frente ao acesso** (x 49–54,9, z 6,6–19,9): fica seguindo reto depois da maquete.
  - As salas são escritórios genéricos (postos de trabalho e armários), fechados e vistos pelo vidro, com portas de vidro fixas. Ficam em `fechadas`.
  - A fachada e a lateral leste do térreo sob a ala ganharam janelas, no lugar dos blocos fechados.
  - Anexo novo com `semParedes` (piso e forro sob a laje, a 3,1 m); as paredes vêm dos painéis.
- **Maquete do prédio:** pedestal de 0,95 m e o prédio em escala (térreo e 2º andar com fachada de vidro, lajes, ático recuado com jardineira, árvores). Não parece mais uma mesa e colide pela peça inteira.
- **Sem foto do interior:** a profundidade das salas e a posição exata das portas seguem a descrição do responsável. O vão do acesso continua onde está em C12.
