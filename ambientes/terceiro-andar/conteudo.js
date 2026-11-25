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
    texto: 'Sala envidraçada ao lado da escada de emergência, com a recepção "Inteligência Industrial" e a sala da administração. A sala é fechada; o interior aparece pelo vidro.',
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
  'salao': {
    demo: false, kicker: '3º andar', titulo: 'Salão',
    texto: 'Salão com piso de madeira no fim do corredor. Nas fotos aparecem bancadas, cadeiras e uma TV em pedestal, mas o uso do espaço ainda não foi confirmado.',
    itens: [['A confirmar', 'uso, nome e extensão do salão']]
  }
});
