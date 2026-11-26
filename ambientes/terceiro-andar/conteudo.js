/* Conteúdo dos painéis do 3º andar. Os equipamentos do Lab usam o conteúdo do próprio Lab (ambientes/lab-ia/conteudo.js).
   As empresas aparecem só com o que a sinalização das fotos mostra: nenhum dado foi inventado. Trocar pelo texto oficial
   (e tirar o demo) quando o Polo Inovale e as empresas fornecerem. */
Orvalho.conteudo['terceiro-andar'] = Object.assign({}, Orvalho.conteudo['lab-ia'], {
  'lab-entrada': {
    demo: false, kicker: '3º andar · laboratório', titulo: 'Laboratório de Inteligência Artificial',
    texto: 'Tecnologia que conecta pessoas, ideias e o futuro. A porta abre ao chegar perto: lá dentro, cada computador mostra um projeto.',
    itens: [['Onde', '3º andar, na fachada, de frente para a SCL Automação'], ['Ao lado', 'escada de emergência e hall de estar']]
  },
  'elevador': {
    demo: false, kicker: 'Elevador', titulo: 'Térreo, 1º e 3º andar',
    texto: 'Chame a cabine, entre e escolha o pavimento. O térreo e o 1º andar levam ao Hall do Polo Inovale. O 2º andar ainda não está disponível nesta versão.',
    itens: []
  },
  'scl': {
    demo: true, kicker: 'Empresa do 3º andar', titulo: 'SCL Automação',
    texto: 'Escritório envidraçado ao lado da escada de emergência, com a recepção "Inteligência Industrial", a sala da administração e a Engenharia, atrás da parede da Unoesc. A sala é fechada; o interior aparece pelo vidro.',
    itens: [['Sobre a empresa', 'texto oficial pendente']]
  },
  'salus': {
    demo: true, kicker: 'Empresa do 3º andar', titulo: 'Salus',
    texto: 'Método Salus · Individualidade Biológica. A empresa conta com fomento da FAPESC, segundo o aviso colado no vidro.',
    itens: [['Sobre a empresa', 'texto oficial pendente']]
  },
  'athostec': {
    demo: true, kicker: 'Empresa do 3º andar', titulo: 'Athostec',
    texto: 'Evolução, Desenvolvimento e Gestão de Alta Qualidade. A sala é fechada; pelo vidro se vê o painel com a marca e as mesas junto às janelas.',
    itens: [['Sobre a empresa', 'texto oficial pendente']]
  },
  'unimed': {
    demo: true, kicker: 'Empresa do 3º andar', titulo: 'Unimed Meio Oeste SC',
    texto: 'Sala no fim do hall de estar, ao lado da escada de emergência. O vidro é jateado e o interior não foi fotografado.',
    itens: [['Sobre a sala', 'texto oficial pendente']]
  },
  'sicredi': {
    demo: true, kicker: '3º andar · sala de reuniões', titulo: 'Sicredi',
    texto: 'Sala de reuniões do Sicredi, entre a escada de emergência e a Unimed. A porta de vidro escuro abre ao chegar perto.',
    itens: [['Sobre a sala', 'texto oficial pendente']]
  },
  'salao': {
    demo: true, kicker: '3º andar', titulo: 'Unoesc',
    texto: 'Sala de capacitação e treinamento da Unoesc, atrás da porta dupla de vidro: fileiras de mesas brancas com plotagens de ciência, tecnologia e inovação, cadeiras amarelas, quadro branco com a TV embutida e mesa do instrutor.',
    itens: [['Sobre a sala', 'texto oficial pendente']]
  }
});
