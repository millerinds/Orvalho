/* 3º andar (ático) do Polo Inovale: maquete explorável (Fase B).
   Fontes: planta aprovada docs/terceiro-andar/planta-3o-andar-v0.json (fotos T01–T48 + planta oficial do ático, PDF 2019)
   e as fotos do Lab. Ver docs/continuidade/EXPANSAO-TERCEIRO-ANDAR.md.

   Coordenadas: os números deste arquivo estão nas coordenadas da PLANTA v0 (as mesmas do Hall: x da ponta do café (0) à
   ponta do palco (44); z da fachada principal (0) para o núcleo). O motor monta a sala a partir de (0, 0), então tudo passa
   por X()/Z(): ambiente = planta − (3, 3). O retângulo do ambiente é o miolo fechado do ático: planta x 3,0–43,6, z 3,0–14,5.
   Cota real estimada do piso: +12,6 m; no jogo o andar é um ambiente próprio, com piso em y = 0 (o elevador troca de ambiente).

   Lab IA: a mobília, os eletrodutos e as interações vêm de ambientes/lab-ia/lab-ia.js (fonte única), girados para cá:
   janela do Lab na fachada (z 3,0), porta no corredor (z 9,0), parede azul em x 30,2, parede cinza em x 25,4.
   Adaptação de jogabilidade: 6,0 m de fundo (real) × 4,8 m de largura (+1,6 m tomados da sala A, sem nome). */
(function(){
  var PI = Math.PI, OX = 3.0, OZ = 3.0, PE = 3.0;
  function X(x){ return +(x - OX).toFixed(3); }
  function Z(z){ return +(z - OZ).toFixed(3); }
  function P(x, z){ return [X(x), Z(z)]; }

  /* ---------- cores do prédio (as mesmas do Hall e do 1º andar) ---------- */
  var BRANCA = '#cfccc6', RODAPE = '#8f8070', AREIA = '#b8ad9b', PILAR_ESCURO = '#8e867a', PILAR_BRANCO = '#e6e4df', CONCRETO = '#c9c3b8';

  var moveis = [], paineis = [], portasA = [], placas = [], blocos = [], luminarias = [], interativos = [], tubos = [], obstaculos = [], pisos = [];
  function add(tipo, x, z, extra){ var it = { tipo: tipo, x: X(x), z: Z(z) }; for (var k in extra || {}) it[k] = extra[k]; moveis.push(it); return it; }
  /* painel de (ax, az) a (bx, bz): o lado "de leitura" (adesivos, cartazes) fica à direita de a → b */
  function painel(ax, az, bx, bz, o){ o = o || {}; o.a = P(ax, az); o.b = P(bx, bz); if (o.y0 == null) o.y0 = 0; if (o.y1 == null) o.y1 = PE; paineis.push(o); return o; }
  function parede(ax, az, bx, bz, cor, esp){ return painel(ax, az, bx, bz, { tipo: 'parede', cor: cor || BRANCA, esp: esp }); }
  /* faixas adesivas por módulo de vidro (cada textura cobre ~1 m: não estica) */
  function faixasMod(L, n, arte, y0, y1, de, ate){ var out = [], a0 = de || 0, a1 = ate == null ? L : ate, w = (a1 - a0) / n; for (var i = 0; i < n; i++) out.push({ de: a0 + i * w + 0.03, ate: a0 + (i + 1) * w - 0.03, y0: y0, y1: y1, arte: arte }); return out; }
  function vidroFrente(ax, az, bx, bz, o){ o = o || {}; var L = Math.hypot(bx - ax, bz - az), n = o.n || Math.max(1, Math.round(L / 1.1)); o.modulo = L / n; o.travessas = o.travessas || [2.25];
    if (o.pelicula) { o.faixas = (o.faixas || []).concat(faixasMod(L, n, o.pelicula, 0.05, o.pelicula === 'pelicula-unimed' ? 2.2 : 1.65)); delete o.pelicula; }
    return painel(ax, az, bx, bz, o); }
  function porta(id, ax, az, bx, bz, o){ o = o || {}; o.id = id; o.a = P(ax, az); o.b = P(bx, bz); portasA.push(o); return o; }
  function placa(arte, x, y, z, w, h, rot, o){ var p = { arte: arte, x: X(x), y: y, z: Z(z), w: w, h: h, rot: rot || 0 }; for (var k in o || {}) p[k] = o[k]; placas.push(p); return p; }
  function rodape(ax, az, bx, bz){ var r = [Math.min(ax, bx) - (az === bz ? 0 : 0.006), Math.min(az, bz) - (az === bz ? 0.006 : 0), Math.max(ax, bx) + (az === bz ? 0 : 0.006), Math.max(az, bz) + (az === bz ? 0.006 : 0)];
    blocos.push({ r: [X(r[0]), Z(r[1]), X(r[2]), Z(r[3])], y0: 0, y1: 0.07, cor: RODAPE }); }
  function lum(x, z, y){ luminarias.push(y ? { x: X(x), z: Z(z), y: y } : { x: X(x), z: Z(z) }); }
  function gradeLum(x0, z0, x1, z1, passo){ var nx = Math.max(1, Math.round((x1 - x0) / passo)), nz = Math.max(1, Math.round((z1 - z0) / passo));
    for (var i = 0; i < nx; i++) for (var j = 0; j < nz; j++) lum(x0 + (i + 0.5) * (x1 - x0) / nx, z0 + (j + 0.5) * (z1 - z0) / nz); }
  /* janelas de um trecho da fachada: n janelas iguais e, se pedida, a porta de vidro da sacada na ponta */
  function janelas(a, b, n, sacada){ var out = [], fim = b; if (sacada) { out.push({ tipo: 'porta-vidro', de: b - 1.05, ate: b - 0.05, base: 0, topo: 2.6, cortina: true }); fim = b - 1.15; }
    var w = (fim - a) / n; for (var i = 0; i < n; i++) out.push({ tipo: 'janela', de: a + i * w + 0.05, ate: a + (i + 1) * w - 0.05, base: 0.45, topo: 2.6, cortina: true }); return out; }
  function emX(vs){ return vs.map(function(v){ var o = Object.assign({}, v); o.de = X(v.de); o.ate = X(v.ate); return o; }); }
  function emZ(vs){ return vs.map(function(v){ var o = Object.assign({}, v); o.de = Z(v.de); o.ate = Z(v.ate); return o; }); }

  /* ================= Lab IA (importado do Lab avulso, girado para a fachada) ================= */
  var LAB = Orvalho.ambientes.lista['lab-ia'], LX = 30.2, LZ = 3.0;   // parede azul (z_lab = 0) e parede das janelas (x_lab = 0), na planta
  function labP(lx, lz){ return [LX - lz, LZ + lx]; }
  LAB.moveis.forEach(function(it){
    if (it.paisagem) return;                                        // árvores do Lab avulso: lá fora há outra paisagem
    var p = labP(it.x, it.z), n = Object.assign({}, it); delete n.real; delete n.fora;
    n.x = X(p[0]); n.z = Z(p[1]); n.rot = (it.rot || 0) - PI / 2; n.id = 'lab-' + (it.id || it.tipo);
    if (it.fora) n.y = 0.45;                                        // a iúca da sacada fica sobre a jardineira
    moveis.push(n);
  });
  LAB.tubos.forEach(function(t){ tubos.push(Object.assign({}, t, { pontos: t.pontos.map(function(q){ var p = labP(q[0], q[2]); return [X(p[0]), q[1], Z(p[1])]; }) })); });
  LAB.luminarias.forEach(function(l){ var p = labP(l.x, l.z); lum(p[0], p[1]); });
  LAB.interativos.forEach(function(it){ if (it.soAvulso) return; var p = labP(it.x, it.z); interativos.push(Object.assign({}, it, { x: X(p[0]), z: Z(p[1]) })); });
  var labJanelas = LAB.paredes.filter(function(p){ return p.lado === 'oeste'; })[0].vaos.map(function(v){ var o = Object.assign({}, v); delete o.real; o.de = LX - v.ate; o.ate = LX - v.de; return o; });
  /* paredes do Lab: azul (lado da porta) e cinza, cada face na sua sala (a outra face é branca, da sala vizinha) */
  painel(LX, 9.0, LX, 3.0, { tipo: 'parede', cor: LAB.cores.azul }); parede(LX + 0.1, 3.0, LX + 0.1, 9.0); parede(LX, 9.0, LX + 0.1, 9.0);
  painel(25.4, 3.0, 25.4, 9.0, { tipo: 'parede', cor: LAB.cores.cinza }); parede(25.3, 9.0, 25.3, 3.0); parede(25.3, 9.0, 25.4, 9.0);
  rodape(LX - 0.006, 3.0, LX - 0.006, 9.0); rodape(25.406, 3.0, 25.406, 9.0);
  /* frente do Lab (T15, T16): dois vidros com a mesma película de triângulos do corredor (é a que se vê do corredor em T15;
     o degradê azul na base, visto de dentro na foto 09.27.12 (1), pode ser o verso da película ou o reflexo do pufe:
     a confirmar), o painel "Laboratório de Inteligência Artificial" e a porta branca junto à parede azul, que abre para
     dentro e encosta nela */
  vidroFrente(25.4, 9.0, LX, 9.0, { n: 4, portas: [[3.55, 4.55, 2.1, 'vao']],
    faixas: faixasMod(2.5, 2, 'pelicula-tri', 0.05, 1.65).concat([{ de: 2.62, ate: 3.48, y0: 0.12, y1: 2.24, arte: 'lab-cartaz' }]) });
  porta('lab-ia', 29.95, 9.0, 28.95, 9.0, { altura: 2.1, arte: 'porta-lisa' });

  /* ================= frentes de vidro do corredor (z 9,0), da sala X à sala A ================= */
  /* sala X (sem identificação, T35, T36, T44): porta escura, interior genérico; Unimed ao lado (T37–T39, T46) */
  vidroFrente(9.5, 8.6, 9.5, 3.0, { n: 5, pelicula: 'pelicula-tri', portas: [[1.15, 2.05, 2.25, 'vao']] });
  porta('sala-x', 9.5, 7.45, 9.5, 6.55, { altura: 2.25, arte: 'porta-escura', trancada: true });
  vidroFrente(9.5, 14.5, 9.5, 8.6, { n: 5, pelicula: 'pelicula-unimed', portas: [[0.35, 1.25, 2.25, 'vao']] });
  porta('unimed', 9.5, 14.15, 9.5, 13.25, { altura: 2.25, arte: 'porta-unimed', trancada: true });
  parede(3.0, 8.6, 9.5, 8.6, null, 0.1);
  placa('unimed-logo', 9.53, 1.95, 10.5, 1.45, 0.52, PI / 2);
  /* passagem para a porta externa (T34–T36): parede lateral da Athostec */
  parede(11.1, 3.0, 11.1, 9.0, null, 0.1);
  /* Athostec (T30, T31, T44, T45): vidro com película e a porta adesivada no lado da Salus */
  vidroFrente(11.1, 9.0, 16.8, 9.0, { n: 5, pelicula: 'pelicula-tri', portas: [[4.7, 5.68, 2.25, 'vao']] });
  porta('athostec', 15.8, 9.0, 16.78, 9.0, { altura: 2.25, arte: 'porta-athostec', trancada: true });
  parede(16.8, 3.0, 16.8, 9.0, null, 0.1);
  /* Salus (T24–T29): quatro vidros com película e o painel adesivado na ponta (provável porta) */
  vidroFrente(16.8, 9.0, 22.2, 9.0, { n: 5, pelicula: 'pelicula-tri', portas: [[4.4, 5.38, 2.25, 'vao']] });
  porta('salus', 21.2, 9.0, 22.18, 9.0, { altura: 2.25, arte: 'porta-salus', trancada: true });
  placa('fapesc-aviso', 20.75, 1.55, 8.985, 0.3, 0.21, 0);           // folha colada por dentro do vidro
  parede(22.2, 3.0, 22.2, 9.0, null, 0.1);
  /* sala B (banner imobiliário, empresa ilegível, T11–T14): porta branca e vidro sem película */
  vidroFrente(22.2, 9.0, 25.3, 9.0, { n: 3, portas: [[0.02, 0.92, 2.25, 'vao']] });
  porta('sala-b', 22.22, 9.0, 23.12, 9.0, { altura: 2.25, arte: 'porta-lisa', trancada: true });
  /* sala A (película vermelha, sem identificação, T06, T15): 1,6 m mais estreita (adaptação do Lab); porta não fotografada */
  vidroFrente(30.3, 9.0, 33.6, 9.0, { n: 3, pelicula: 'pelicula-vermelha' });

  /* ================= SCL Automação (T01–T03, T07, T08, T17–T20, T23–T25) ================= */
  vidroFrente(33.6, 12.0, 26.17, 12.0, { n: 7, pelicula: 'pelicula-tri' });                       // lida do corredor
  vidroFrente(26.17, 12.0, 26.17, 14.5, { n: 2, pelicula: 'pelicula-tri', portas: [[1.0, 2.4, 2.25, 'vao']] });
  porta('scl-1', 26.17, 13.0, 26.17, 13.7, { altura: 2.25, trancada: true });                       // porta dupla de vidro, fechada
  porta('scl-2', 26.17, 14.4, 26.17, 13.7, { altura: 2.25, trancada: true, abre: 'direita' });
  painel(33.6, 14.47, 26.17, 14.47, { tipo: 'parede', cor: '#c3c0ba', y0: 1.1 });                  // parede de concreto aparente da SCL
  painel(33.6, 14.47, 26.17, 14.47, { tipo: 'parede', cor: '#55585c', y1: 1.1 });
  placa('scl-logo', 28.3, 1.85, 14.45, 1.5, 0.96, PI, { transparente: true });
  placa('inteligencia-industrial', 32.0, 2.05, 14.45, 1.7, 0.45, PI, { transparente: true });
  placa('administracao', 30.25, 2.33, 14.45, 0.8, 0.12, PI, { transparente: true });
  placa('porta-escura', 30.25, 1.06, 14.45, 0.9, 2.1, PI);
  pisos.push({ r: [X(26.2), Z(12.02), X(33.6), Z(14.47)], cor: '#e6c49b', textura: 'madeira' });

  /* ================= parede do fim do corredor, porta dupla de vidro "PUXE" (T04, T05) e salão ================= */
  parede(33.75, 3.0, 33.75, 9.6, null, 0.3); parede(33.75, 11.4, 33.75, 14.5, null, 0.3);
  blocos.push({ r: [X(33.6), Z(9.6), X(33.9), Z(11.4)], y0: 2.3, y1: PE, cor: BRANCA });
  obstaculos.push({ caixa: [X(33.6), Z(3.0), X(33.9), Z(9.6)], motivo: 'parede grossa do fim do corredor' }, { caixa: [X(33.6), Z(11.4), X(33.9), Z(14.5)], motivo: 'parede grossa do fim do corredor' });
  porta('salao-1', 33.6, 9.6, 33.6, 10.5, { altura: 2.3 });                                        // abrem para o corredor (puxe)
  porta('salao-2', 33.6, 11.4, 33.6, 10.5, { altura: 2.3, abre: 'direita' });
  pisos.push({ r: [X(33.9), Z(3.0), X(43.6), Z(14.5)], cor: '#c99f73', textura: 'madeira' });
  painel(43.6, 14.47, 33.9, 14.47, { tipo: 'parede', cor: BRANCA });                               // fundo do salão (cobre a madeira do núcleo)
  painel(9.5, 14.47, 3.0, 14.47, { tipo: 'parede', cor: BRANCA });                                 // fundo da Unimed

  /* ================= núcleo (PDF + T07, T17–T22, T32, T33, T37–T48) ================= */
  var nucleoVaos = [
    { tipo: 'porta', de: 10.15, ate: 10.86, base: 0, topo: 2.1, altura: 2.1, arte: 'veneziana' }, { tipo: 'porta', de: 10.89, ate: 11.6, base: 0, topo: 2.1, altura: 2.1, arte: 'veneziana' },
    { tipo: 'abertura', de: 12.02, ate: 12.96, base: 0, topo: 2.1, altura: 2.1 },                   // escada de emergência (lado do café)
    { tipo: 'elevador', de: 13.75, ate: 14.85, base: 0, topo: 2.2, altura: 2.2, animado: true },   // "INOVAÇÃO ABRE PORTAS"
    { tipo: 'abertura', de: 19.4, ate: 21.2, base: 0, topo: 2.4, altura: 2.35 },                    // nicho do banheiro PCD
    { tipo: 'porta', de: 22.83, ate: 23.5, base: 0, topo: 2.1, altura: 2.1, arte: 'veneziana' }, { tipo: 'porta', de: 23.53, ate: 24.2, base: 0, topo: 2.1, altura: 2.1, arte: 'veneziana' },
    { tipo: 'abertura', de: 24.7, ate: 25.7, base: 0, topo: 2.1, altura: 2.1 }                      // escada de emergência (lado do palco)
  ];
  porta('emergencia-cafe', 12.02, 14.5, 12.96, 14.5, { altura: 2.1, arte: 'emergencia' });
  porta('emergencia-palco', 24.7, 14.5, 25.7, 14.5, { altura: 2.1, arte: 'emergencia' });
  var anexos = [
    { r: [X(11.95), Z(14.5), X(13.05), Z(15.9)], pe: 2.6, cor: '#e7e6e2',
      portas: [{ lado: 'fundo', de: X(12.07), ate: X(12.93), arte: 'porta-lisa', placa: { arte: 'escada-emergencia', w: 0.62, h: 0.16 } }] },
    { r: [X(24.6), Z(14.5), X(25.8), Z(15.9)], pe: 2.6, cor: '#e7e6e2',
      portas: [{ lado: 'fundo', de: X(24.75), ate: X(25.65), arte: 'porta-lisa', placa: { arte: 'escada-emergencia', w: 0.62, h: 0.16 } }] },
    { r: [X(19.4), Z(14.5), X(21.2), Z(15.7)], pe: 2.4, textura: 'madeira',
      portas: [{ lado: 'fundo', de: X(19.5), ate: X(20.4), arte: 'banheiro-pcd' }, { lado: 'x1', de: Z(14.75), ate: Z(15.5), arte: 'veneziana' }] }
  ];
  add('bancada-parede', 16.5, 14.075, { rot: PI, id: 'bancada-banquetas' });            // termina antes do pilar: passagem de 2,2 m
  add('vitrine', 18.6, 14.27, { rot: PI });
  add('lixeiras-pedal', 13.35, 14.28, { rot: PI });
  add('hidrante', 22.2, 14.48, { y: 0.7, rot: PI }); add('extintor', 22.75, 14.48, { y: 0.85, rot: PI }); add('extintor', 10.0, 14.48, { y: 0.85, rot: PI });
  tubos.push({ pontos: [[X(21.92), 1.55, Z(14.45)], [X(21.92), PE, Z(14.45)]], raio: 0.025, pal: 'vermelho' }, { pontos: [[X(24.52), 1.0, Z(14.45)], [X(24.52), PE, Z(14.45)]], raio: 0.025, pal: 'vermelho' });
  placa('saida', 12.49, 2.38, 14.47, 0.36, 0.14, PI); placa('saida', 25.2, 2.38, 14.47, 0.36, 0.14, PI);
  placa('nao-use-elevador', 15.4, 1.55, 14.47, 0.3, 0.35, PI);

  /* ================= hall de estar e corredor (mobiliário visto nas fotos) ================= */
  add('tapete-grande', 14.5, 10.75);
  add('sofa-branco', 12.75, 10.75, { rot: PI / 2, id: 'sofa-estar-1' }); add('sofa-branco', 16.25, 10.75, { rot: -PI / 2, id: 'sofa-estar-2' });   // ~1 m livre até a mesa de centro
  add('mesa-centro', 14.5, 10.75, { rot: PI / 2 });
  add('almofadao', 10.1, 10.45); add('almofadao', 10.1, 11.25); add('almofadao', 11.15, 10.65, { rot: PI / 2 });   // junto ao vidro da Unimed, fora da boca da passagem
  add('mesinha', 10.82, 3.45, { id: 'mesinha-porta-externa' });
  add('sofa-azul', 25.0, 9.42, { id: 'sofa-azul' }); add('mesinha-azul', 23.75, 9.33);
  add('floreira', 27.9, 11.55); add('poltrona-branca', 29.3, 11.4, { rot: PI }); add('poltrona-branca', 30.55, 11.4, { rot: PI });
  add('planta', 32.1, 11.55, { colisao: { circulo: 0.47 } });                         // colisor no alcance das folhas

  /* ================= interiores (vistos pelo vidro; salas fechadas) ================= */
  /* SCL: cadeiras pretas e planta na recepção (T08, T18) */
  add('cadeira', 31.3, 12.85, { rot: 0.5 }); add('cadeira', 32.1, 12.9, { rot: -0.4 }); add('planta', 27.0, 13.95, { colisao: { circulo: 0.47 } });
  /* Athostec (T44): painel escuro com a marca, mesas junto às janelas e de frente para o painel */
  add('painel-logo', 13.95, 5.6, { id: 'painel-athostec' });
  add('mesa-empresa', 12.35, 3.9); add('mesa-empresa', 15.45, 3.9); add('mesa-empresa', 12.35, 7.45, { rot: PI }); add('mesa-empresa', 15.45, 7.45, { rot: PI });
  /* Salus (T26–T29): salinha de vidro no canto da fachada e postos de trabalho */
  painel(16.9, 5.6, 19.4, 5.6, { modulo: 0.85, travessas: [2.25] }); painel(19.4, 5.6, 19.4, 3.0, { modulo: 0.87, travessas: [2.25] });
  add('mesa-empresa', 18.1, 3.9); add('mesa-empresa', 21.0, 3.9); add('mesa-empresa', 18.4, 7.45, { rot: PI }); add('armario-alto', 21.6, 8.65, { rot: PI });
  /* sala B: uma mesa com monitor, banner de rolo e ar-condicionado (T12, T13) */
  add('mesa-empresa', 23.5, 5.6, { rot: PI }); add('banner-rollup', 24.75, 8.55); add('ar', 23.7, 3.11, { y: 2.55 });
  /* sala A (genérica): dois postos virados para as janelas e um armário */
  add('mesa-empresa', 31.2, 4.0); add('mesa-empresa', 32.75, 4.0); add('armario', 32.9, 8.6, { rot: PI });
  /* sala X (genérica, T44): quatro postos */
  add('mesa-empresa', 4.7, 4.0); add('mesa-empresa', 7.2, 4.0); add('mesa-empresa', 4.7, 7.5, { rot: PI }); add('mesa-empresa', 7.2, 7.5, { rot: PI });
  /* Unimed (interior não fotografado; vidro jateado): postos genéricos */
  add('mesa-empresa', 4.9, 10.2); add('mesa-empresa', 7.3, 10.2); add('mesa-empresa', 6.1, 13.4, { rot: PI });
  /* salão: interior neutro (uso não identificado). Só o que se vê pelas portas: TV em pedestal, bancadas, cadeiras amarelas */
  add('tv-pedestal', 42.6, 8.75, { rot: -PI / 2 });
  add('bancada-baixa', 37.0, 3.55); add('bancada-baixa', 39.4, 3.55); add('bancada-baixa', 37.0, 13.95, { rot: PI }); add('bancada-baixa', 39.4, 13.95, { rot: PI });
  [[36.3, 6.0], [37.1, 6.0], [36.3, 11.6], [37.1, 11.6]].forEach(function(p, i){ add('cadeira-amarela', p[0], p[1], { rot: i < 2 ? 0 : PI }); });
  add('extintor', 34.0, 13.2, { y: 0.85, rot: PI / 2 });

  /* ================= iluminação ================= */
  for (var lx = 10.6; lx <= 33.0; lx += 2.2) lum(lx, 10.5);                    // corredor e estar
  for (lx = 11.2; lx <= 25.0; lx += 2.4) lum(lx, 13.0);
  gradeLum(3.3, 3.3, 9.3, 8.4, 2.2); gradeLum(3.3, 8.8, 9.3, 14.3, 2.2);      // sala X e Unimed
  gradeLum(11.2, 3.2, 16.7, 8.8, 2.3); gradeLum(16.9, 3.2, 22.1, 8.8, 2.3); gradeLum(22.3, 3.2, 25.2, 8.8, 2.3); gradeLum(30.4, 3.2, 33.5, 8.8, 2.3);
  gradeLum(26.3, 12.1, 33.5, 14.4, 2.4); gradeLum(34.0, 3.2, 43.5, 14.4, 2.6); lum(10.3, 6.0);
  lum(12.5, 15.2, 2.6); lum(25.2, 15.2, 2.6); lum(20.3, 15.1, 2.4);              // antecâmaras e nicho

  /* ================= lá fora: jardineira, pilares da fachada, guarda-corpo e a cidade lá embaixo ================= */
  blocos.push(
    { r: [X(-1), Z(-1), X(45), Z(3.0)], y0: -0.3, y1: -0.01, cor: '#d1ccc3' },                       // laje externa (fachada)
    { r: [X(-1), Z(3.0), X(3.0), Z(18.5)], y0: -0.3, y1: -0.01, cor: '#d1ccc3' },                    // lado da Unimed
    { r: [X(43.6), Z(3.0), X(45), Z(18.5)], y0: -0.3, y1: -0.01, cor: '#d1ccc3' },                   // lado do salão
    { r: [X(0.4), Z(1.35), X(43.6), Z(2.95)], y0: -0.01, y1: 0.42, cor: '#b7b0a4' },                 // jardineira (T09, foto do Lab)
    { r: [X(0.5), Z(1.45), X(43.5), Z(2.85)], y0: 0.42, y1: 0.45, cor: '#78a94a' },
    { r: [X(1.6), Z(2.95), X(2.95), Z(18.0)], y0: -0.01, y1: 0.42, cor: '#b7b0a4' }, { r: [X(1.7), Z(2.95), X(2.85), Z(17.9)], y0: 0.42, y1: 0.45, cor: '#78a94a' },
    { r: [X(0.15), Z(0.18), X(43.85), Z(0.32)], y0: 1.02, y1: 1.08, cor: '#e9eef2' },               // corrimão do guarda-corpo
    { r: [X(-160), Z(-160), X(200), Z(160)], y0: -12.75, y1: -12.6, cor: '#9fb08f' }                 // chão da cidade (~12,6 m abaixo)
  );
  painel(0.2, 0.25, 43.8, 0.25, { y1: 1.05, modulo: 1.5 }); painel(0.25, 0.25, 0.25, 18.5, { y1: 1.05, modulo: 1.5 });

  Orvalho.ambientes.registrar({
    id: 'terceiro-andar',
    nome: '3º andar · Polo Inovale',
    planta: { fonte: 'docs/terceiro-andar/planta-3o-andar-v0.json', origem: [OX, OZ], conversao: 'ambiente = planta − (3, 3)', cotaReal: 12.6 },
    medidas: {
      confirmadas: { predio: '44 × 20 m', nucleo: 'x 9,85–26,17 (planta)', malhaPilares: '8 m; fileiras z 1,96 / 11,96 / 17,96', fonte: 'PDF do ático + fotos' },
      estimadas: { fachadaSalas: 'z 3,0', frenteSalas: 'z 9,0', frenteSCL: 'z 12,0', peDireito: 3.0, cota: 12.6 },
      adaptacoes: 'Lab com 6,0 × 4,8 m (largura +1,6 m tomada da sala A). Portas de 0,9–1,0 m. Salão limitado a z ≤ 14,5 (extensão real incerta).'
    },

    sala: { largura: X(43.6), fundo: Z(14.5), pe: PE, placa: 0.9, corForro: '#e2e1dc', pisoRugosidade: 0.42, pisoTinta: '#aaa398',
      pisoCores: { a: '#cbc5bb', b: '#bfb8ad', brilho: 'rgba(255,255,255,.10)', rejunte: '#9b9489', rejunteLargura: 3, manchas: true } },
    cores: { branca: BRANCA, madeira: '#ffffff', pilar: AREIA, rodape: RODAPE },
    luz: { hemi: 0.6, solForca: 0.46, solPos: [22, 18, -16], ceu: '#dbe8f2', chao: '#cdbfa8' },
    bolhas: 18,

    paredes: [
      /* fachada (z 3,0 na planta): janelas com persiana de rolo e uma porta de sacada por sala; no Lab, os vãos do próprio Lab */
      { lado: 'norte', cor: 'branca', vaos: emX([].concat(janelas(3.0, 9.5, 4), [{ tipo: 'porta-vidro', de: 9.65, ate: 10.95, base: 0, topo: 2.6 }],
          janelas(11.1, 16.8, 3, true), janelas(16.8, 22.2, 3, true), janelas(22.2, 25.3, 1, true), labJanelas, janelas(30.3, 33.6, 1, true), janelas(33.9, 43.6, 6))) },
      /* lado da Unimed e da sala X (x 3,0) e lado do salão (x 43,6): janelas */
      { lado: 'oeste', cor: 'branca', vaos: emZ([].concat(janelas(3.0, 8.6, 3), janelas(8.6, 14.5, 3))) },
      { lado: 'leste', cor: 'branca', vaos: emZ(janelas(3.0, 14.5, 6)) },
      /* núcleo: porcelanato "madeira" como no térreo e no 1º andar; as salas cobrem a face delas com um painel */
      { lado: 'sul', cor: 'madeira', textura: 'madeira', vaos: emX(nucleoVaos) }
    ],
    pilares: [[10.03, PILAR_ESCURO], [18.04, PILAR_ESCURO], [26.02, PILAR_BRANCO], [34.06, PILAR_BRANCO], [42.04, PILAR_BRANCO]].map(function(p){ return { x: X(p[0]), z: Z(11.96), d: 0.6, cor: p[1] }; })
      .concat([2.02, 10.03, 18.04, 26.02, 34.06, 42.04].map(function(x){ return { x: X(x), z: Z(1.96), d: 0.6, cor: CONCRETO, fora: true }; }))
      .concat([{ x: X(2.02), z: Z(11.96), d: 0.6, cor: CONCRETO, fora: true }]),
    /* salas fechadas (portas trancadas; o interior é visto pelo vidro): fora da malha de navegação dos testes */
    fechadas: [['sala X', 3.0, 3.0, 9.5, 8.6], ['Unimed', 3.0, 8.6, 9.5, 14.5], ['Athostec', 11.1, 3.0, 16.8, 9.0], ['Salus', 16.8, 3.0, 22.2, 9.0],
               ['sala B', 22.2, 3.0, 25.3, 9.0], ['sala A', 30.3, 3.0, 33.6, 9.0], ['SCL Automação', 26.17, 12.0, 33.6, 14.5]]
      .map(function(f){ return { nome: f[0], r: [X(f[1]), Z(f[2]), X(f[3]), Z(f[4])] }; }),
    blocos: blocos,
    obstaculos: obstaculos,
    pisos: pisos,
    paineis: paineis,
    anexos: anexos,
    portasAnimadas: portasA,
    elevador: { x: X(14.3), largura: 1.1, altura: 2.2, fundo: 1.4, paradas: [{ piso: 3, y: 0, z: Z(14.5), chegada: { x: X(14.3), y: 0, z: Z(13.15), rumo: PI } }] },
    placas: placas,
    tubos: tubos,
    luminarias: luminarias,
    moveis: moveis,

    exterior: {
      colinas: [{ x: 0, y: -40, z: -120, r: 80, h: 44 }, { x: 60, y: -42, z: -140, r: 90, h: 50 }, { x: -60, y: -40, z: -100, r: 60, h: 38 }, { x: 30, y: -36, z: -95, r: 45, h: 30 }],
      nuvens: [{ x: 0, y: 26, z: -70, s: 4 }, { x: 30, y: 34, z: -90, s: 5 }, { x: 55, y: 22, z: -60, s: 3 }, { x: -25, y: 30, z: -80, s: 4 }]
    },

    /* começa dentro do Lab, como antes (o ponto de chegada do Lab avulso, girado) */
    entrada: (function(){ var e = LAB.entrada, p = labP(e.x, e.z); return { x: X(p[0]), z: Z(p[1]), rumo: e.rumo - PI / 2, camYaw: e.camYaw - PI / 2 }; })(),
    chegadas: {
      'hall-inovale': { x: X(14.3), z: Z(13.15), rumo: PI, camYaw: PI / 2 + 0.45 },
      'lab-ia': { x: X(29.45), z: Z(9.95), rumo: 0, camYaw: PI }
    },

    interativos: interativos.concat([
      { id: 'lab-entrada', x: X(28.45), y: 1.4, z: Z(9.2), raio: 1.3, rotulo: 'Laboratório de IA', conteudo: 'lab-entrada' },
      { id: 'elevador-terceiro', x: X(14.3), y: 1.3, z: Z(14.4), piso: 0, raio: 1.8, rotulo: 'Chamar elevador', conteudo: 'elevador', acao: { elevador: true, rotulo: 'Entrar no elevador' } },
      { id: 'scl', x: X(29.9), y: 1.4, z: Z(11.95), raio: 1.9, rotulo: 'SCL Automação', conteudo: 'scl' },
      { id: 'salus', x: X(21.7), y: 1.4, z: Z(9.05), raio: 1.5, rotulo: 'Salus', conteudo: 'salus' },
      { id: 'athostec', x: X(16.3), y: 1.4, z: Z(9.05), raio: 1.5, rotulo: 'Athostec', conteudo: 'athostec' },
      { id: 'unimed', x: X(9.55), y: 1.4, z: Z(13.7), raio: 1.5, rotulo: 'Unimed Meio Oeste SC', conteudo: 'unimed' },
      { id: 'salao', x: X(35.4), y: 1.4, z: Z(10.5), raio: 2.0, rotulo: 'Salão', conteudo: 'salao' }
    ])
  });

  /* o jogo começa no 3º andar (dentro do Lab); saves do Lab avulso viram posições no Lab do 3º andar */
  Orvalho.ambientes.inicial = 'terceiro-andar';
  Orvalho.ambientes.migracoes = Orvalho.ambientes.migracoes || {};
  Orvalho.ambientes.migracoes['lab-ia'] = function(s){
    var p = labP(Math.min(s.x, 5.9), s.z);
    return Object.assign({}, s, { amb: 'terceiro-andar', x: X(p[0]), y: 0, z: Z(p[1]), rumo: (s.rumo || 0) - PI / 2, yaw: (s.yaw || 0) - PI / 2 });
  };
})();
