/* Conteúdo dos painéis do Hall do Polo Inovale.
   ATENÇÃO: tudo com demo: true é texto de exemplo para testar a interação. Não são informações institucionais.
   Troque pelos dados reais (fornecidos pelo Polo Inovale) e tire o demo. */
Orvalho.conteudo['hall-inovale'] = {
  'recepcao': {
    demo: true, kicker: 'Recepção', titulo: 'Bem-vindo ao Polo Inovale',
    texto: 'Espaço reservado para a apresentação do Polo: o que é, quem atende aqui e como agendar uma visita.',
    itens: [['Horário', 'a preencher'], ['Contato', 'a preencher'], ['Andares', 'térreo, 1º, 2º e 3º (ático), conforme o totem da recepção']],
    fonte: 'Edite em ambientes/hall-inovale/conteudo.js'
  },
  'painel': {
    demo: true, kicker: 'Painel institucional', titulo: 'Apresentação do espaço',
    texto: 'Aqui entra a apresentação oficial do Polo Inovale e dos seus parceiros. Os logotipos dos patrocinadores aparecem como placas genéricas até haver autorização.',
    itens: [['Parceiros', 'a preencher'], ['Programas', 'a preencher']],
    fonte: 'Edite em ambientes/hall-inovale/conteudo.js'
  },
  'telao': {
    demo: true, kicker: 'Área de eventos', titulo: 'Telão · próximos eventos',
    texto: 'Painel de exemplo para a agenda de eventos e apresentações do hall.',
    itens: [['Próximo evento', '—'], ['Data', '—'], ['Inscrições', '—']],
    fonte: 'Edite em ambientes/hall-inovale/conteudo.js'
  },
  'expositores': {
    demo: true, kicker: 'Acesso às salas 1, 2 e 3', titulo: 'Expositores e projetos',
    texto: 'Espaço reservado para apresentar projetos e empresas do Polo (incubadas, graduadas e parceiras).',
    itens: [['Projeto', '—'], ['Equipe', '—'], ['Status', '—']],
    fonte: 'Edite em ambientes/hall-inovale/conteudo.js'
  },
  'cafeteria': {
    demo: true, kicker: 'Cafeteria Pin · Café e Restaurante', titulo: 'Café do hall',
    texto: 'Ponto de interação demonstrativo da área de alimentação. Cardápio e horários entram quando houver dados reais.',
    itens: [['Horário', '—']],
    fonte: 'Edite em ambientes/hall-inovale/conteudo.js'
  },
  'totem': {
    demo: false, kicker: 'Totem de orientação (texto da foto C18)', titulo: 'Onde fica cada coisa',
    texto: 'Reprodução do totem que fica junto à recepção.',
    itens: [['Térreo', 'Salas 1 a 3 · Banheiros · Elevadores / Escada · Café / Restaurante'], ['1º Andar', 'Incubadora · Administração · Copa / Banheiros · Coworking'],
            ['2º Andar', 'Salas 201 a 205 · Copa / Banheiros · Elevadores / Escada'], ['3º andar – Ático', 'Auditórios · Salas de Reuniões 1 a 3 · Copa / Banheiros']]
  },
  'nexo': {
    demo: true, kicker: 'Sala de vidro', titulo: 'Sala Nexo',
    texto: 'Sala de reunião envidraçada. A passagem para as salas 1, 2 e 3 fica imediatamente à esquerda, conforme as fotos E02–E04.',
    itens: [['Uso', 'a preencher'], ['Capacidade', 'a preencher']],
    fonte: 'Edite em ambientes/hall-inovale/conteudo.js'
  },
  'escada': {
    demo: false, kicker: 'Escada', titulo: 'Acesso ao 1º andar',
    texto: 'A escada principal é navegável: suba pelos dois lances e pelo patamar até o corredor acessível do 1º andar. O guarda-corpo protege as bordas do vazio.',
    itens: []
  },
  'elevador': {
    demo: false, kicker: 'Elevador', titulo: 'Térreo e 1º andar',
    texto: 'Chame a cabine, entre e escolha o pavimento. Nesta versão, somente o térreo e o 1º andar estão disponíveis; os demais permanecem bloqueados.',
    itens: []
  },
  'keila': {
    demo:false,kicker:'Recepção · conversa',titulo:'Keila',
    texto:'Olá! Seja bem-vindo ao Polo Inovale. Posso ajudar você a encontrar os espaços do térreo e do 1º andar.',
    itens:[['1º andar','Pela escada ao lado do palco ou pelo elevador junto à escada de emergência'],['Cafeteria','Pin · Café e Restaurante, no fundo do hall, à esquerda']]
  },
  'acioc': {
    demo:false,kicker:'1º andar',titulo:'ACIOC Hub',
    texto:'Coworking acima da cafeteria. A frente de vidro com o grafismo verde fica na borda da laje e é vista do térreo; a porta fica no fim do corredor, depois do elevador (fotos E11–E16 e 16.32.03).'
  },
  'incubadora': {
    demo:false,kicker:'1º andar · ala leste',titulo:'Incubadora Joaçaba',
    texto:'Salas 101 a 103 sobre o palco: coworking com mesa verde e TV, mesas azul e verde, mesa branca e canto de ripas de madeira, e salas de incubação envidraçadas junto às janelas (fotos E31–E45 e 16.32.04).'
  },
  'administrativo': {
    demo:false,kicker:'1º andar',titulo:'Administrativo',
    texto:'Em frente à chegada da escada. Na entrada fica a mesa de reuniões; ao fundo, a sala interna envidraçada onde trabalham Dagliê e Danimara (fotos E06–E08 e E19–E30).'
  },
  'daglie': { demo:false,kicker:'Administrativo · conversa',titulo:'Dagliê',texto:'Oi! Aqui é o Administrativo do Polo Inovale. Fique à vontade para conhecer o 1º andar.' },
  'danimara': { demo:false,kicker:'Administrativo · conversa',titulo:'Danimara',texto:'Oi! Este é o meu posto, ao lado da Dagliê. Bom passeio pelo Polo!' },
  'salas-incubacao': { demo:false,kicker:'Incubadora Joaçaba',titulo:'Salas de incubação',texto:'Salas envidraçadas ocupadas pelas empresas do programa de incubação. A Incubadora funciona por ciclos, e as empresas entram e saem ao longo do tempo; por isso, o ambiente não identifica empresas específicas.' },
  'podcast': { demo:true,kicker:'1º andar · estúdio',titulo:'Estúdio de podcast',texto:'Estúdio para gravação de conversas e programas em áudio e vídeo: mesa central com microfones em braço articulado, paredes com tratamento acústico em quadrados pretos e cinza, TV no fundo e luz indireta. Texto genérico; a gravação não está disponível nesta versão.' },
  'servidor': { demo:true,kicker:'Sala de reuniões',titulo:'Equipamento de servidor',texto:'Gabinete do servidor do Polo Inovale, instalado no alto do canto da sala de reuniões. Painel demonstrativo: nenhuma especificação técnica foi informada.' },
};
