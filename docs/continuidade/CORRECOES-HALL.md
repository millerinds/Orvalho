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
