/* Móveis do Hall do Polo Inovale (Fases C/D: detalhados a partir das fotos H01–H32 e C01–C21).
   Mesmo catálogo do Lab (O.moveis.TIPOS): peças em metros, origem no chão, frente = +z, gelatina com contorno.
   Desempenho: peças pequenas com grade reduzida (caixa k=2), pés e folhas sem contorno, tudo instanciado.
   "assentos" (opcional): pontos onde o boneco pode sentar { x, z, rot, altura, saida: [x, z] } no espaço do móvel. */
(function(O){
  var F = O.formas, MV = O.moveis, M = MV.M, parte = MV.parte, raiais = MV.raiais;

  /* cores do hall */
  MV.PAL.amarelo = ['#ffc62a', '#a86f00', '#fff1a8'];
  MV.PAL.laranja = ['#f26a21', '#9a3300', '#ffd2a6'];
  MV.PAL.preto = ['#24272e', '#000000', '#6f7a8a'];
  MV.PAL.cinza = ['#8f969d', '#41484e', '#dfe5ea'];
  MV.PAL.areia = ['#c9bda8', '#7a6a52', '#fff4e0'];
  MV.PAL['folha-escura'] = ['#2f8a2c', '#0b3a22', '#b9ec6a'];
  MV.PAL['folha-clara'] = ['#62b83a', '#1d5a20', '#e2ff9a'];
  MV.PAL['madeira-escura'] = ['#a5764a', '#5a3a1e', '#f3d2a8'];

  MV.TEXTURAS['logo-inovale'] = function(){ return F.logoInovale({ sub: 'CENTRO DE INOVAÇÃO VALE DO RIO DO PEIXE' }); };
  MV.TEXTURAS.inspire = F.inspire;
  MV.TEXTURAS.patrocinadores = F.patrocinadores;
  MV.TEXTURAS['tela-led'] = F.telaLed;
  MV.TEXTURAS['painel-azul'] = F.painelAzul;
  ['totem', 'pin', 'coffee', 'livros', 'produtos', 'geladeira', 'vidroQuadro'].forEach(function(n){ MV.TEXTURAS[n] = function(){ return F.arte(n); }; });

  function compor(bases, locais){ var out = []; bases.forEach(function(b){ locais.forEach(function(l){ out.push(b.clone().multiply(l)); }); }); return out; }
  var Q = function(w, h, d, r){ return F.caixa(w, h, d, r, 2); }; // caixa leve para peças pequenas

  /* ---------- folhas procedurais: plano afinado nas pontas e curvado (uma geometria, muitas instâncias) ---------- */
  function folha(L, W, curva, seg){
    seg = seg || 6;
    var g = new THREE.PlaneGeometry(W, L, 1, seg); g.translate(0, L / 2, 0);
    var p = g.attributes.position;
    for (var i = 0; i < p.count; i++) { var t = p.getY(i) / L; p.setX(i, p.getX(i) * Math.pow(Math.sin(Math.PI * Math.min(0.98, t * 0.92 + 0.06)), 0.75)); p.setZ(i, curva * t * t); }
    g.computeVertexNormals(); return g;
  }
  function folhaParte(geo, pal, ms){ var pt = parte(geo, pal, 0, ms); pt.duplo = true; return pt; }

  /* ---------- cadeira estilo Eames (concha amarela, pés de madeira) ---------- */
  function eames(bases){
    return [
      parte(Q(0.46, 0.07, 0.43, 0.03), 'amarelo', 0.01, compor(bases, [M(0, 0.45, 0.02)])),
      parte(Q(0.44, 0.33, 0.05, 0.024), 'amarelo', 0.01, compor(bases, [M(0, 0.66, -0.19, -0.16, 0, 0)])),
      parte(new THREE.CapsuleGeometry(0.012, 0.4, 2, 5), 'madeira', 0, compor(bases, [M(-0.17, 0.21, 0.15, 0.12, 0, -0.1), M(0.17, 0.21, 0.15, 0.12, 0, 0.1), M(-0.17, 0.21, -0.15, -0.12, 0, -0.1), M(0.17, 0.21, -0.15, -0.12, 0, 0.1)]))
    ];
  }
  /* cadeira giratória amarela (concha "cisne") dos arcos */
  function giratoria(bases){
    return [
      parte(Q(0.52, 0.16, 0.5, 0.07), 'amarelo', 0.01, compor(bases, [M(0, 0.47, 0)])),
      parte(Q(0.58, 0.42, 0.14, 0.07), 'amarelo', 0.01, compor(bases, [M(0, 0.72, -0.22, -0.22, 0, 0)])),
      parte(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), 'metal', 0, compor(bases, [M(0, 0.2, 0)])),
      parte(Q(0.05, 0.03, 0.3, 0.012), 'metal', 0, compor(bases, raiais(4, 0.14, 0.03, Math.PI / 4)))
    ];
  }

  var T = MV.TIPOS;

  /* ---------- área de convivência ---------- */
  /* mesa redonda branca Ø 0,90, pés de madeira, 4 cadeiras amarelas, suculenta num cubo de madeira e porta-guardanapos (H26, H31) */
  T['mesa-cafe'] = { colisao: { circulo: 0.88 }, sombra: [1.9, 1.9], partes: function(){
    var cadeiras = [0, 1, 2, 3].map(function(i){ var a = Math.PI / 4 + i * Math.PI / 2; return M(Math.sin(a) * 0.62, 0, Math.cos(a) * 0.62, 0, a + Math.PI, 0); });
    var folhas = []; for (var i = 0; i < 7; i++) folhas.push(M(0.1, 0.81, -0.04, 0, i * 0.9, 0).multiply(M(0, 0, 0, 0.6 + (i % 3) * 0.2, 0, 0)));
    return [
      parte(F.cilindro(0.45, 0.035, 0.012, 32), 'branco', 0.01, [M(0, 0.71, 0)]),
      parte(new THREE.CapsuleGeometry(0.02, 0.62, 2, 6), 'madeira', 0, [0, 1, 2, 3].map(function(i){ var a = i * Math.PI / 2; return M(0, 0, 0, 0, a, 0).multiply(M(0, 0.36, 0.12, 0.14, 0, 0)); })),
      parte(Q(0.08, 0.07, 0.08, 0.01), 'madeira-escura', 0.004, [M(0.1, 0.78, -0.04)]),
      folhaParte(folha(0.07, 0.035, 0.02, 3), 'folha-clara', folhas),
      parte(Q(0.06, 0.1, 0.05, 0.008), 'grafite', 0.004, [M(-0.12, 0.8, 0.06)])
    ].concat(eames(cadeiras));
  } };
  /* bancada alta de madeira junto à fachada, banquetas coloridas */
  T['bancada-alta'] = { colisao: { caixa: [5.45, 1.0] }, sombra: [5.9, 1.5], partes: function(){
    var cores = { agua: [], vermelho: [], amarelo: [] }, ordem = ['agua', 'vermelho', 'amarelo'];
    for (var i = 0; i < 10; i++) cores[ordem[i % 3]].push(M(-2.25 + i * 0.5, 0, 0.33));
    var out = [
      parte(F.caixa(5.4, 0.05, 0.62, 0.02), 'madeira', 0.01, [M(0, 1.05, -0.19)]),
      parte(F.caixa(5.2, 1.0, 0.48, 0.02), 'grafite', 0.01, [M(0, 0.5, -0.19)]),
      parte(F.caixa(0.05, 1.03, 0.62, 0.015), 'madeira', 0.006, [M(-2.7, 0.515, -0.19), M(2.7, 0.515, -0.19)]),
      parte(Q(0.06, 0.1, 0.05, 0.008), 'grafite', 0.004, [M(-1.5, 1.125, -0.2), M(1.2, 1.125, -0.2)])
    ];
    ordem.forEach(function(c){ out.push(parte(F.cilindro(0.17, 0.045, 0.015, 18), c, 0.008, compor(cores[c], [M(0, 0.7, 0)]))); });
    out.push(parte(new THREE.CapsuleGeometry(0.014, 0.62, 2, 5), 'madeira', 0, compor(cores.agua.concat(cores.vermelho, cores.amarelo), [M(-0.1, 0.34, 0.1, 0.12, 0, -0.12), M(0.1, 0.34, 0.1, 0.12, 0, 0.12), M(-0.1, 0.34, -0.1, -0.12, 0, -0.12), M(0.1, 0.34, -0.1, -0.12, 0, 0.12)])));
    return out;
  } };

  /* ---------- vegetação ---------- */
  /* floreira de madeira com lírios-da-paz: folhas largas em dois tons, espatas brancas em hastes (H22, C19) */
  T.floreira = { colisao: { caixa: [1.2, 0.8] }, sombra: [1.5, 1.0], partes: function(){
    var esc = [], cla = [], hastes = [], flores = [];
    for (var i = 0; i < 18; i++) {
      var a = i * 2.39996, r = (i % 4) * 0.07, px = Math.sin(a) * r * 1.3, pz = Math.cos(a) * r * 0.55, tilt = 0.25 + (i % 3) * 0.12; // folhas dentro da pegada do vaso
      (i % 3 ? esc : cla).push(M(px, 0.92, pz, 0, a, 0).multiply(M(0, 0, 0, tilt, 0, 0)));
    }
    for (i = 0; i < 4; i++) { var fx = -0.33 + i * 0.22, fz = (i % 2 ? 0.07 : -0.07), hh = 0.42 + (i % 2) * 0.12; hastes.push(M(fx, 0.95 + hh / 2, fz).multiply(new THREE.Matrix4().makeScale(1, hh, 1))); flores.push(M(fx, 0.95 + hh, fz, -0.25, i * 1.3, 0)); }
    return [
      parte(F.caixa(1.2, 0.95, 0.7, 0.03), 'madeira', 0.012, [M(0, 0.475, 0)]),
      folhaParte(folha(0.42, 0.16, 0.16), 'folha-escura', esc),
      folhaParte(folha(0.38, 0.15, 0.13), 'folha', cla),
      parte(new THREE.CylinderGeometry(0.006, 0.006, 1, 5), 'folha', 0, hastes),
      folhaParte(folha(0.13, 0.07, 0.04, 3), 'branco', flores)
    ];
  } };
  /* palmeira areca num vaso preto (C01, C12): folhas compostas arqueadas = haste curva + folíolos */
  T.palmeira = { colisao: { circulo: 0.72 }, sombra: [0.9, 0.9], partes: function(){
    var haste = F.tubo([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.45, 0.12), new THREE.Vector3(0, 0.75, 0.38), new THREE.Vector3(0, 0.82, 0.62)], 0.012, 8);
    var bases = [], fol = [], fol2 = [];
    for (var f = 0; f < 8; f++) {
      var sc = 0.8 + (f % 3) * 0.12;
      var b = M(0, 0.48, 0, 0, f * 0.785 + (f % 2) * 0.3, 0).multiply(M(0, 0, 0, -0.15 + (f % 3) * 0.12, 0, 0)).multiply(new THREE.Matrix4().makeScale(sc, sc, sc));
      bases.push(b);
      for (var k = 1; k <= 9; k++) {
        var t = k / 10, y = 0.45 * t + 0.37 * t * t, z = 0.62 * t * t + 0.12 * t;
        [-1, 1].forEach(function(sd){ (k % 2 ? fol : fol2).push(b.clone().multiply(M(0, y, z, 0.2, 0, sd * (1.2 - t * 0.4)))); });
      }
    }
    return [
      parte(F.cilindro(0.2, 0.48, 0.04, 20), 'preto', 0.012, [M(0, 0, 0)]),
      parte(haste, 'folha-escura', 0, bases),
      folhaParte(folha(0.26, 0.035, 0.03, 3), 'folha', fol),
      folhaParte(folha(0.24, 0.035, 0.03, 3), 'folha-escura', fol2)
    ];
  } };
  /* vasinho de mesa (suculenta) para balcões */
  T['planta-mesa'] = { colisao: false, partes: function(){
    var fs = []; for (var i = 0; i < 8; i++) fs.push(M(0, 0.07, 0, 0, i * 0.8, 0).multiply(M(0, 0, 0, 0.5 + (i % 3) * 0.25, 0, 0)));
    return [parte(Q(0.1, 0.09, 0.1, 0.015), 'branco', 0.004, [M(0, 0.045, 0)]), folhaParte(folha(0.09, 0.045, 0.02, 3), 'folha-clara', fs)];
  } };

  /* ---------- cafeteria Pin (C20, H31, C21): parede preta ao fundo (z local = -0,78), balcão na frente ---------- */
  T['balcao-cafe'] = { alto: true, colisao: { caixa: [5.6, 1.5] }, sombra: [6, 1.9], partes: function(){
    var cubas = [], xicaras = [];
    for (var i = 0; i < 5; i++) cubas.push(M(-1.6 + i * 0.6, 1.03, 0.36));
    for (i = 0; i < 6; i++) xicaras.push(M(-0.45 + (i % 3) * 0.17, i < 3 ? 1.97 : 2.22, -0.62));
    return [
      parte(F.caixa(5.4, 0.92, 0.68, 0.02), 'madeira', 0.01, [M(0, 0.5, 0.33)]),
      parte(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 6), 'inox', 0, [-2.5, -1.25, 0, 1.25, 2.5].map(function(x){ return M(x, 0.03, 0.55); })),
      parte(F.caixa(5.6, 0.05, 0.8, 0.015), 'preto', 0.008, [M(0, 0.985, 0.33)]),
      parte(F.caixa(4.6, 0.88, 0.5, 0.02), 'grafite', 0.008, [M(-0.4, 0.44, -0.5)]),
      parte(Q(4.4, 0.62, 0.02, 0.008), 'preto', 0, [M(-0.4, 1.32, -0.76)]),                                  // revestimento preto brilhante
      parte(F.caixa(1.55, 0.55, 0.35, 0.02), 'madeira', 0.008, [M(-1.75, 2.1, -0.6), M(0.85, 2.1, -0.6)]),  // armários altos
      parte(Q(1.05, 0.025, 0.3, 0.006), 'madeira', 0, [M(-0.28, 1.88, -0.62), M(-0.28, 2.13, -0.62), M(-0.28, 2.37, -0.62)]), // nicho aberto
      parte(F.cilindro(0.035, 0.08, 0.01, 10), 'branco', 0, xicaras),
      parte(Q(0.7, 0.42, 0.48, 0.04), 'inox', 0.006, [M(0.25, 1.1, -0.5)]),                                   // máquina de espresso
      parte(Q(0.2, 0.42, 0.22, 0.03), 'preto', 0.004, [M(-0.3, 1.1, -0.55)]),                                 // moedor
      parte(Q(0.5, 0.05, 0.32, 0.01), 'inox', 0, cubas),                                                        // cubas do bufê
      parte(F.cilindro(0.13, 0.18, 0.01, 18), 'branco', 0.004, [M(-2.35, 1.01, 0.3)]),                         // pilha de pratos
      parte(Q(0.32, 0.16, 0.3, 0.02), 'grafite', 0.004, [M(2.3, 1.09, 0.3)]),                                  // caixa registradora
      parte(F.caixa(0.62, 1.8, 0.6, 0.04), 'vermelho', 0.01, [M(1.72, 0.9, -0.42), M(2.4, 0.9, -0.42)]),     // geladeiras de bebida
      parte(new THREE.PlaneGeometry(0.5, 1.5), 'geladeira', 0, [M(1.72, 0.98, -0.115), M(2.4, 0.98, -0.115)]),
      parte(new THREE.PlaneGeometry(1.1, 0.43), 'pin', 0, [M(-0.28, 2.66, -0.765)]),                          // letreiro "Pin · Café e Restaurante"
      parte(new THREE.PlaneGeometry(0.62, 0.23), 'coffee', 0, [M(-1.75, 2.6, -0.765)])                        // placa-seta "COFFEE"
    ];
  } };
  /* estante alta de madeira com produtos, junto ao vidro (C20) */
  T['estante-cafe'] = { alto: true, colisao: { caixa: [1.2, 0.42] }, sombra: [1.4, 0.7], partes: function(){
    return [
      parte(Q(1.2, 2.0, 0.04, 0.01), 'madeira', 0.006, [M(0, 1.0, -0.19)]),
      parte(Q(0.04, 2.0, 0.42, 0.01), 'madeira', 0.006, [M(-0.58, 1.0, 0), M(0.58, 1.0, 0)]),
      parte(Q(1.16, 0.03, 0.4, 0.008), 'madeira', 0, [0.3, 0.75, 1.2, 1.65].map(function(y){ return M(0, y, 0); })),
      parte(new THREE.PlaneGeometry(1.1, 1.6), 'produtos', 0, [M(0, 1.05, -0.165)])
    ];
  } };
  /* freezer horizontal de sorvete (C07, C20) — genérico, sem marca */
  T.freezer = { colisao: { caixa: [1.0, 0.62] }, sombra: [1.2, 0.8], partes: function(){
    return [parte(F.caixa(1.0, 0.82, 0.6, 0.05), 'amarelo', 0.01, [M(0, 0.41, 0)]), parte(Q(0.94, 0.03, 0.54, 0.01), 'inox', 0, [M(0, 0.835, 0)]),
            parte(new THREE.PlaneGeometry(0.85, 0.45), 'produtos', 0, [M(0, 0.45, 0.301)])];
  } };
  /* par de lixeiras brancas de pedal com saco preto (C07) */
  T['lixeiras-pedal'] = { colisao: { caixa: [0.8, 0.4] }, sombra: [1.0, 0.6], partes: function(){
    return [parte(Q(0.36, 0.55, 0.36, 0.04), 'branco', 0.008, [M(-0.2, 0.275, 0), M(0.2, 0.275, 0)]), parte(Q(0.37, 0.06, 0.37, 0.02), 'preto', 0.006, [M(-0.2, 0.58, 0), M(0.2, 0.58, 0)])];
  } };

  /* ---------- recepção (H19–H22, C08, C17, C18): frente = -z (fachada), painel INOVALE do lado do palco ---------- */
  T.recepcao = { alto: true, colisao: { caixa: [8.52, 3.0] }, sombra: [9, 3.6], partes: function(){
    var frente = M(0, 0, 0, 0, Math.PI, 0);
    return [
      parte(F.caixa(3.7, 1.05, 0.55, 0.14), 'laranja', 0.014, [M(-1.75, 0.525, -1.15)]),
      parte(F.caixa(3.1, 1.2, 0.55, 0.06), 'branco', 0.014, [M(1.75, 0.6, -1.15)]),
      parte(F.caixa(6.9, 0.04, 0.64, 0.02), 'branco', 0.008, [M(0.0, 1.22, -1.15)]),
      parte(new THREE.PlaneGeometry(2.9, 0.7), 'logo-inovale', 0, [M(1.75, 0.68, -1.43).multiply(frente)]),
      parte(F.caixa(0.28, 2.7, 3.0, 0.12), 'branco', 0.014, [M(-3.55, 1.35, 0), M(3.55, 1.35, 0)]),
      parte(F.caixa(7.4, 0.2, 3.1, 0.08), 'cinza', 0.014, [M(0, 2.8, 0)]),                                    // cobertura (cinza-claro na C08)
      parte(new THREE.PlaneGeometry(7.1, 2.8), 'inspire', 0, [M(0, 2.905, 0, -Math.PI / 2, 0, 0)]),
      parte(new THREE.PlaneGeometry(1.1, 0.62), 'tela', 0, [M(-3.7, 1.7, 0.3, 0, -Math.PI / 2, 0)]),         // TV virada para o café
      parte(F.caixa(0.5, 1.0, 2.6, 0.12), 'laranja', 0.012, [M(-3.97, 0.5, 0.1)]),                            // balcão de folhetos
      parte(F.caixa(0.56, 0.04, 2.66, 0.02), 'branco', 0.006, [M(-3.97, 1.02, 0.1)]),
      parte(F.cilindro(0.14, 0.42, 0.04, 16), 'agua', 0.008, [M(-3.97, 1.04, 1.05)]),                         // galão de água (C03, C08)
      /* lado de dentro (C08, C17): armários brancos, bancada de tampo cinza, 2 monitores, impressora, cadeira */
      parte(Q(3.4, 0.9, 0.5, 0.03), 'branco', 0.008, [M(0.9, 0.45, 1.03)]),
      parte(Q(0.008, 0.8, 0.01, 0.002), 'cinza', 0, [-0.2, 0.65, 1.5, 2.3].map(function(x){ return M(x, 0.45, 0.78); })),
      parte(Q(2.6, 0.72, 0.6, 0.02), 'branco', 0.008, [M(1.2, 0.36, -0.25)]),
      parte(Q(2.7, 0.04, 0.66, 0.012), 'cinza', 0.004, [M(1.2, 0.74, -0.25)]),
      parte(Q(0.55, 0.34, 0.03, 0.01), 'preto', 0.004, [M(0.7, 1.05, -0.35), M(1.5, 1.05, -0.35)]),
      parte(new THREE.PlaneGeometry(0.5, 0.29), 'tela', 0, [M(0.7, 1.05, -0.334), M(1.5, 1.05, -0.334)]),
      parte(Q(0.44, 0.24, 0.38, 0.03), 'preto', 0.004, [M(-0.1, 1.02, 1.03)]),                                // impressora
      parte(Q(0.5, 0.1, 0.48, 0.04), 'preto', 0.006, [M(1.1, 0.48, 0.45)]), parte(Q(0.46, 0.5, 0.07, 0.03), 'preto', 0.006, [M(1.1, 0.82, 0.7, 0.1, 0, 0)]),
      parte(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 8), 'metal', 0, [M(1.1, 0.21, 0.45)]),
      /* estante de livros e totem de LED atrás do balcão; totem de sinalização "Recepção" na ponta leste (texto da C18) */
      parte(Q(1.6, 1.8, 0.32, 0.02), 'branco', 0.008, [M(-2.3, 0.9, 1.08)]),
      parte(new THREE.PlaneGeometry(1.5, 1.6), 'livros', 0, [M(-2.3, 0.92, 0.915).multiply(frente)]),
      parte(Q(0.6, 1.9, 0.1, 0.03), 'grafite', 0.008, [M(-0.8, 0.95, 1.15)]),
      parte(new THREE.PlaneGeometry(0.5, 1.7), 'tela-led', 0, [M(-0.8, 0.98, 1.09).multiply(frente)]),
      parte(F.caixa(0.64, 2.3, 0.1, 0.05), 'grafite', 0.008, [M(3.98, 1.15, -1.2)]),
      parte(new THREE.PlaneGeometry(0.58, 2.2), 'totem', 0, [M(3.98, 1.15, -1.252).multiply(frente)]),
      parte(Q(0.3, 1.8, 1.4, 0.03), 'branco', 0.008, [M(3.84, 0.9, 0.6)])                                    // vitrine de troféus (H17)
    ];
  } };

  /* ---------- arcos brancos (C01, C02, C09): pórtico arredondado com tubo interno, bancada e cadeiras giratórias.
     Pernas em z = ±prof/2, lados abertos em x = ±largura/2. Os assentos olham para a bancada (+x) e saem por -x;
     o ponto de sentar fica 16 cm à frente da cadeira, para as costas apoiarem no encosto sem atravessá-lo. ---------- */
  function arco(o){
    var Lg = o.largura, Pf = o.prof, cad = o.cadeiras.map(function(z){ return M(-0.22, 0, z, 0, Math.PI / 2, 0); });
    return { alto: true, colisao: { caixa: [Lg, Pf] }, sombra: [Lg + 0.4, Pf + 0.3],
      assentos: o.cadeiras.map(function(z){ return { x: -0.06, z: z, rot: Math.PI / 2, altura: 0.5, saida: [-Lg / 2 - 0.45, z] }; }),
      partes: function(){
        var out = [
          parte(F.caixa(Lg, 2.55, 0.26, 0.12), 'branco', 0.014, [M(0, 1.275, -Pf / 2 + 0.13), M(0, 1.275, Pf / 2 - 0.13)]),
          parte(F.caixa(Lg, 0.34, Pf, 0.16), 'branco', 0.014, [M(0, 2.62, 0)]),
          parte(new THREE.CapsuleGeometry(0.2, Pf - 0.9, 4, 12), 'branco', 0.01, [M(0, 2.32, 0, Math.PI / 2, 0, 0)]), // tubo arredondado sob a cobertura
          parte(Q(0.55, 0.05, Pf - 0.5, 0.02), 'branco', 0.008, [M(Lg / 2 - 0.42, 0.74, 0)]),                          // bancada branca
          parte(Q(0.06, 0.72, 0.06, 0.02), 'branco', 0, [M(Lg / 2 - 0.42, 0.36, -Pf / 2 + 0.45), M(Lg / 2 - 0.42, 0.36, Pf / 2 - 0.45)])
        ].concat(giratoria(cad));
        if (o.painel) out.push(parte(new THREE.PlaneGeometry(Math.min(1.6, Lg - 0.4), 2.0), 'patrocinadores', 0, [M(0, 1.3, Pf / 2 + 0.004)]));
        return out;
      } };
  }
  T['arco-a'] = arco({ largura: 2.2, prof: 3.1, cadeiras: [0.1], painel: true });       // encostado na parede da entrada (H29, C01)
  T['arco-b'] = arco({ largura: 1.6, prof: 2.9, cadeiras: [-0.85, 0, 0.85] });          // 3 cadeiras amarelas (C02)

  T['banco-branco'] = { colisao: { caixa: [1.5, 0.55] }, sombra: [1.8, 0.8], partes: function(){ return [parte(F.caixa(1.5, 0.45, 0.55, 0.05), 'branco', 0.012, [M(0, 0.225, 0)])]; } };
  /* bancada baixa branca encostada na parede de madeira (C05, C06) */
  T['banco-baixo'] = { colisao: { caixa: [1.6, 0.42] }, sombra: [1.8, 0.6], partes: function(){ return [parte(F.caixa(1.6, 0.6, 0.42, 0.03), 'branco', 0.01, [M(0, 0.3, 0)])]; } };
  T['banco-fachada'] = { colisao: { caixa: [3.6, 0.62] }, sombra: [3.9, 0.9], partes: function(){
    return [parte(F.caixa(3.6, 0.42, 0.62, 0.03), 'madeira', 0.012, [M(0, 0.21, 0)]), parte(F.caixa(3.5, 0.08, 0.52, 0.035), 'grafite', 0.008, [M(0, 0.46, 0.02)]), parte(F.caixa(3.5, 0.34, 0.1, 0.04), 'grafite', 0.008, [M(0, 0.72, -0.26)])];
  } };

  /* ---------- área de eventos ---------- */
  T['cadeira-plateia'] = { colisao: false, partes: function(){
    return [
      parte(Q(0.46, 0.05, 0.44, 0.02), 'preto', 0.008, [M(0, 0.46, 0)]),
      parte(Q(0.44, 0.3, 0.035, 0.014), 'preto', 0.008, [M(0, 0.78, -0.2, -0.1, 0, 0)]),
      parte(new THREE.CylinderGeometry(0.011, 0.011, 0.45, 5, 1), 'metal', 0, [M(-0.2, 0.225, 0.18), M(0.2, 0.225, 0.18), M(-0.2, 0.225, -0.18), M(0.2, 0.225, -0.18)]),
      parte(new THREE.CylinderGeometry(0.011, 0.011, 0.36, 5, 1), 'metal', 0, [M(-0.2, 0.64, -0.19), M(0.2, 0.64, -0.19)])
    ];
  } };
  T.telao = { colisao: false, partes: function(){
    return [parte(F.caixa(6.1, 3.4, 0.16, 0.03), 'grafite', 0.012, [M(0, 1.75, 0)]), parte(new THREE.PlaneGeometry(5.9, 3.2), 'tela-led', 0, [M(0, 1.75, 0.082)]), parte(F.caixa(0.15, 0.1, 0.8, 0.03), 'grafite', 0.006, [M(-2.6, 0.05, 0), M(2.6, 0.05, 0)])];
  } };
  T['caixa-som'] = { colisao: { circulo: 0.35 }, sombra: [0.8, 0.8], partes: function(){
    return [parte(Q(0.5, 0.45, 0.5, 0.04), 'grafite', 0.008, [M(0, 0.225, 0)]), parte(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8), 'metal', 0, [M(0, 0.95, 0)]), parte(Q(0.22, 1.1, 0.2, 0.04), 'grafite', 0.008, [M(0, 1.95, 0)])];
  } };

  /* ---------- fundo sob o mezanino ---------- */
  /* balcão branco com painel azul INOVALE (C12, C13, C15) */
  T['balcao-info'] = { colisao: { caixa: [1.15, 0.55] }, sombra: [1.4, 0.8], partes: function(){
    return [parte(F.caixa(1.15, 1.0, 0.55, 0.03), 'branco', 0.01, [M(0, 0.5, 0)]), parte(new THREE.PlaneGeometry(1.0, 0.5), 'painel-azul', 0, [M(0, 0.55, 0.28)])];
  } };
  /* balcão branco alto com duas banquetas amarelas (C12, C15, C16) */
  T['balcao-banquetas'] = { colisao: { caixa: [1.2, 1.18] }, sombra: [1.5, 1.4], partes: function(){
    var bq = [M(-0.28, 0, 0.385), M(0.28, 0, 0.385)];
    return [
      parte(F.caixa(1.2, 1.02, 0.55, 0.03), 'branco', 0.01, [M(0, 0.51, -0.315)]),
      parte(Q(0.42, 0.05, 0.4, 0.04), 'amarelo', 0.008, compor(bq, [M(0, 0.72, 0)])),
      parte(Q(0.4, 0.38, 0.05, 0.03), 'amarelo', 0.008, compor(bq, [M(0, 0.95, 0.18)])),
      parte(new THREE.CylinderGeometry(0.014, 0.014, 0.72, 5), 'amarelo', 0, compor(bq, [M(-0.16, 0.36, -0.15), M(0.16, 0.36, -0.15), M(-0.16, 0.36, 0.15), M(0.16, 0.36, 0.15)]))
    ];
  } };
  /* poltrona branca com laterais de ripas de madeira (C10, C11) e mesinha redonda branca */
  T['poltrona-branca'] = { colisao: { circulo: 0.52 }, sombra: [1.0, 1.0], partes: function(){
    var ripas = []; for (var i = 0; i < 4; i++) [-0.38, 0.38].forEach(function(x){ ripas.push(M(x, 0.18 + i * 0.1, 0)); });
    return [
      parte(Q(0.7, 0.16, 0.66, 0.06), 'branco', 0.01, [M(0, 0.4, 0.02)]),
      parte(Q(0.7, 0.42, 0.14, 0.05), 'branco', 0.01, [M(0, 0.7, -0.27)]),
      parte(Q(0.05, 0.05, 0.72, 0.01), 'madeira-escura', 0, ripas),
      parte(Q(0.06, 0.04, 0.74, 0.012), 'madeira-escura', 0.004, [M(-0.38, 0.6, 0), M(0.38, 0.6, 0)])
    ];
  } };
  T.mesinha = { colisao: { circulo: 0.26 }, sombra: [0.6, 0.6], partes: function(){ return [parte(F.cilindro(0.24, 0.03, 0.01, 24), 'branco', 0.006, [M(0, 0.55, 0)]), parte(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8), 'branco', 0, [M(0, 0.275, 0)]), parte(F.cilindro(0.18, 0.03, 0.01, 20), 'branco', 0.004, [M(0, 0, 0)])]; } };
  T.tapete = { colisao: false, partes: function(){ return [parte(F.caixa(2.6, 0.02, 1.9, 0.008), 'cinza', 0, [M(0, 0.01, 0)])]; } };
  /* quadro de vidro com espaçadores na parede (C06); y do item = centro */
  T['quadro-vidro'] = { colisao: false, partes: function(){
    return [parte(new THREE.PlaneGeometry(2.4, 1.2), 'vidroQuadro', 0, [M(0, 0, 0.03)]), parte(new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8), 'inox', 0, [[-1.1, 0.5], [1.1, 0.5], [-1.1, -0.5], [1.1, -0.5]].map(function(p){ return M(p[0], p[1], 0.015, Math.PI / 2, 0, 0); }))];
  } };
  /* caixa de hidrante vermelha e extintor (C06, C10, C11); y do item = base */
  T.hidrante = { colisao: false, partes: function(){ return [parte(Q(0.62, 0.85, 0.22, 0.02), 'vermelho', 0.008, [M(0, 0.425, 0.11)])]; } };
  T.extintor = { colisao: false, partes: function(){ return [parte(F.cilindro(0.075, 0.48, 0.03, 12), 'vermelho', 0.006, [M(0, 0, 0.09)]), parte(Q(0.05, 0.08, 0.05, 0.01), 'preto', 0, [M(0, 0.52, 0.09)])]; } };
  /* interior visível da sala Nexo (C12, C16): mesa de reunião escura, cadeiras pretas e uma poltrona vermelha */
  T['mesa-reuniao'] = { colisao: false, partes: function(){
    var cad = [M(-0.6, 0, -0.7), M(0, 0, -0.7), M(0.6, 0, -0.7), M(-0.6, 0, 0.7, 0, Math.PI, 0), M(0, 0, 0.7, 0, Math.PI, 0)];
    return [
      parte(Q(2.0, 0.05, 0.9, 0.03), 'grafite', 0.008, [M(0, 0.74, 0)]), parte(Q(0.1, 0.72, 0.6, 0.02), 'grafite', 0, [M(-0.8, 0.36, 0), M(0.8, 0.36, 0)]),
      parte(Q(0.46, 0.08, 0.44, 0.03), 'preto', 0.006, compor(cad, [M(0, 0.46, 0)])), parte(Q(0.44, 0.42, 0.05, 0.02), 'preto', 0.006, compor(cad, [M(0, 0.75, -0.2)])),
      parte(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6), 'metal', 0, compor(cad, [M(0, 0.21, 0)])),
      parte(Q(0.62, 0.36, 0.58, 0.16), 'vermelho', 0.008, [M(1.55, 0.5, 0.45)])
    ];
  } };

  /* ---------- primeiro andar (E06–E45, X46, X47): móveis de cada ambiente, refeitos a partir das fotos ----------
     Cadeiras encaixadas nas mesas fazem parte do móvel: o colisor cobre mesa + cadeiras, sem colisor solto no meio. */
  MV.PAL['madeira-clara'] = ['#cfc4b3', '#7d6f5c', '#fff6e6'];   // tampo das estações do ACIOC (E14–E16)
  MV.PAL.nogueira = ['#7a553a', '#3a2414', '#e3b48c'];            // mesa compartilhada do Administrativo (E22–E24)
  MV.PAL['verde-mesa'] = ['#557a4c', '#203a1c', '#c8f0a8'];       // mesas verdes da Incubadora (E33–E36)
  MV.PAL['azul-mesa'] = ['#447a92', '#163a4c', '#bfeaff'];        // mesas azuis da Incubadora (E34, E35)
  MV.PAL['azul-cadeira'] = ['#2f6fb8', '#0d2f5c', '#bfe0ff'];     // cadeiras fixas do Administrativo (E26–E29)
  MV.PAL['cinza-azul'] = ['#7f8da6', '#323c4f', '#e2e9f6'];       // poltronas do corredor da Incubadora (E44)
  MV.PAL.vidro = ['#d9f1f7', '#6f9fb0', '#ffffff'];               // divisórias de vidro das estações
  MV.TEXTURAS['acioc-totem'] = function(){ return F.arte('acioc-totem'); };
  MV.TEXTURAS['banner-ideia'] = function(){ return F.arte('banner-ideia'); };

  /* cadeiras de escritório (catálogo do Lab) em várias posições [x, z, rot] dentro de outro móvel */
  function cadeirasEm(pos){
    var bases = pos.map(function(p){ return M(p[0], 0, p[1], 0, p[2] || 0, 0); });
    return T.cadeira.partes().map(function(pt){ return parte(pt.geo, pt.pal, pt.esp, compor(bases, pt.ms)); });
  }
  function equipamento(tipo, pos){ var bases = pos.map(function(p){ return M(p[0], p[1], p[2], 0, p[3] || 0, 0); }); return T[tipo].partes().map(function(pt){ return parte(pt.geo, pt.pal, pt.esp, compor(bases, pt.ms)); }); }

  /* --- Administrativo --- */
  /* posto branco com gaveteiro aberto (E21, E27–E29): 1,40 × 0,65 × 0,74; "pc": monitor, notebook e porta-lápis */
  function mesaBranca(pc){ return { colisao: { caixa: [1.4, 0.65] }, sombra: [1.7, 0.95], partes: function(){
    var out = [
      parte(Q(1.4, 0.04, 0.65, 0.012), 'branco', 0.01, [M(0, 0.72, 0)]),
      parte(Q(0.04, 0.7, 0.62, 0.01), 'branco', 0.006, [M(0.66, 0.35, 0)]),
      parte(Q(0.42, 0.7, 0.6, 0.012), 'branco', 0.008, [M(-0.47, 0.35, 0)]),
      parte(Q(0.36, 0.015, 0.54, 0.004), 'cinza', 0, [M(-0.47, 0.25, 0.02), M(-0.47, 0.47, 0.02)]),
      parte(Q(0.9, 0.3, 0.02, 0.006), 'branco', 0.004, [M(0.2, 0.5, -0.3)])
    ];
    if (pc) out = out.concat(equipamento('monitor', [[0.05, 0.74, -0.12, 0]]), equipamento('notebook', [[0.45, 0.74, 0.02, 0]]),
      [parte(new THREE.CylinderGeometry(0.04, 0.04, 0.11, 10), 'laranja', 0.004, [M(-0.55, 0.795, -0.15)])]);
    return out;
  } }; }
  T['mesa-branca'] = mesaBranca(false);
  T['mesa-branca-pc'] = mesaBranca(true);
  /* cadeira fixa de base trenó, assento azul e encosto preto (E26–E29) */
  T['cadeira-azul'] = { colisao: { circulo: 0.33 }, sombra: [0.7, 0.7], partes: function(){
    return [
      parte(Q(0.46, 0.07, 0.45, 0.03), 'azul-cadeira', 0.01, [M(0, 0.46, 0.005)]),
      parte(Q(0.44, 0.3, 0.05, 0.03), 'preto', 0.008, [M(0, 0.8, -0.215, -0.1, 0, 0)]),
      parte(new THREE.CylinderGeometry(0.012, 0.012, 0.48, 6), 'metal', 0, [M(-0.21, 0.02, 0, Math.PI / 2, 0, 0), M(0.21, 0.02, 0, Math.PI / 2, 0, 0)]),
      parte(new THREE.CylinderGeometry(0.012, 0.012, 0.46, 6), 'metal', 0, [M(-0.21, 0.24, 0.2, 0.2, 0, 0), M(0.21, 0.24, 0.2, 0.2, 0, 0), M(-0.21, 0.24, -0.2, -0.2, 0, 0), M(0.21, 0.24, -0.2, -0.2, 0, 0)]),
      parte(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 6), 'metal', 0, [M(0, 0.62, -0.21)])
    ];
  } };
  /* mesa compartilhada de nogueira com 6 cadeiras pretas (E22–E24): 3,0 × 1,2 */
  T['mesa-compartilhada'] = { colisao: { caixa: [3.0, 2.14] }, sombra: [3.3, 2.3], partes: function(){
    return [
      parte(Q(3.0, 0.05, 1.2, 0.02), 'nogueira', 0.01, [M(0, 0.74, 0)]),
      parte(Q(0.06, 0.7, 1.0, 0.015), 'grafite', 0.006, [M(-1.35, 0.35, 0), M(1.35, 0.35, 0)]),
      parte(Q(2.6, 0.32, 0.03, 0.01), 'grafite', 0.004, [M(0, 0.52, 0)]),
      parte(Q(0.38, 0.55, 0.5, 0.02), 'grafite', 0.006, [M(-0.4, 0.29, -0.3), M(0.9, 0.29, 0.3)])
    ].concat(cadeirasEm([[-1, -0.75, 0], [0, -0.75, 0], [1, -0.75, 0], [-1, 0.75, Math.PI], [0, 0.75, Math.PI], [1, 0.75, Math.PI]]),
      equipamento('notebook', [[0.3, 0.765, 0.2, Math.PI], [-0.9, 0.765, -0.25, 0]]));
  } };
  /* armário alto branco de duas portas, atrás dos postos (E28, E29): 1,05 × 0,48 × 1,9 */
  T['armario-alto'] = { alto: true, colisao: { caixa: [1.05, 0.48] }, sombra: [1.25, 0.7], partes: function(){
    return [parte(Q(1.05, 1.9, 0.48, 0.035), 'branco', 0.01, [M(0, 0.95, 0)]),
      parte(Q(0.015, 1.7, 0.02, 0.005), 'cinza', 0, [M(0, 0.95, 0.245)]),
      parte(Q(0.025, 0.12, 0.03, 0.008), 'metal', 0.004, [M(-0.06, 1.0, 0.255), M(0.06, 1.0, 0.255)])];
  } };
  /* parede de armários brancos com frisos verticais (E24, E25, E30): 3,6 × 0,5 × 2,6 */
  T['armario-parede'] = { alto: true, colisao: { caixa: [3.6, 0.5] }, sombra: [3.8, 0.7], partes: function(){
    var frisos = []; for (var i = -2; i <= 2; i++) frisos.push(M(i * 0.72, 1.3, 0.252));
    return [parte(Q(3.6, 2.6, 0.5, 0.02), 'branco', 0.01, [M(0, 1.3, 0)]), parte(Q(0.012, 2.5, 0.01, 0.003), 'grafite', 0, frisos)];
  } };
  /* armário baixo com nicho, impressora e garrafa térmica (E25, E30) */
  T['balcao-impressora'] = { colisao: { caixa: [1.3, 0.46] }, sombra: [1.5, 0.7], partes: function(){
    return [
      parte(Q(1.3, 0.74, 0.46, 0.02), 'branco', 0.01, [M(0, 0.37, 0)]),
      parte(Q(0.4, 0.5, 0.02, 0.005), 'cinza', 0, [M(0.1, 0.4, 0.225)]),
      parte(Q(0.5, 0.24, 0.38, 0.03), 'preto', 0.006, [M(0.25, 0.86, -0.01)]),
      parte(Q(0.34, 0.02, 0.2, 0.005), 'branco', 0, [M(0.25, 1.0, -0.12, -0.3, 0, 0)]),
      parte(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 14), 'inox', 0.004, [M(-0.45, 0.89, 0)])
    ];
  } };

  /* --- ACIOC Hub --- */
  /* parede escura logo atrás da porta, com logotipo e TV (E12–E14): 2,0 × 0,3 × 2,9; a arte fica em +z */
  T['totem-acioc'] = { alto: true, colisao: { caixa: [2.0, 0.34] }, sombra: [2.2, 0.5], partes: function(){
    return [parte(Q(2.0, 2.9, 0.3, 0.02), 'grafite', 0.01, [M(0, 1.45, -0.02)]),
      parte(new THREE.PlaneGeometry(1.9, 2.4), 'acioc-totem', 0, [M(0, 1.5, 0.132)]),
      parte(Q(1.1, 0.64, 0.04, 0.01), 'preto', 0.004, [M(0, 1.45, 0.15)]), parte(new THREE.PlaneGeometry(1.04, 0.58), 'tela', 0, [M(0, 1.45, 0.171)])];
  } };
  function estacaoTampo(w, d, z){ // tampo claro sobre base grafite, com divisória de vidro (E14–E16)
    return [parte(Q(w, 0.04, d, 0.012), 'madeira-clara', 0.008, [M(0, 0.74, z)]), parte(Q(0.05, 0.72, d - 0.05, 0.01), 'grafite', 0.006, [M(-w / 2 + 0.03, 0.36, z), M(w / 2 - 0.03, 0.36, z)]),
      parte(Q(0.38, 0.55, d - 0.12, 0.015), 'madeira-clara', 0.006, [M(-w / 4, 0.29, z), M(w / 4, 0.29, z)])];
  }
  /* ilha de 4 lugares, mesas frente a frente com vidro no meio (E15): 2,8 × 1,4 + cadeiras */
  T['ilha-acioc'] = { colisao: { caixa: [2.8, 2.34] }, sombra: [3.0, 2.5], partes: function(){
    return estacaoTampo(2.8, 0.7, -0.35).concat(estacaoTampo(2.8, 0.7, 0.35), [parte(Q(2.7, 0.34, 0.012, 0.004), 'vidro', 0, [M(0, 0.93, 0)])],
      cadeirasEm([[-0.7, -0.86, 0], [0.7, -0.86, 0], [-0.7, 0.86, Math.PI], [0.7, 0.86, Math.PI]]));
  } };
  /* bancada encostada na parede, 2 lugares (E14, E16): a parede fica em -z */
  T['bancada-acioc'] = { colisao: { caixa: [2.8, 1.17] }, sombra: [3.0, 1.3], partes: function(){
    return estacaoTampo(2.8, 0.7, -0.24).concat([parte(Q(2.7, 0.34, 0.012, 0.004), 'vidro', 0, [M(0, 0.93, -0.58)])], cadeirasEm([[-0.7, 0.26, Math.PI], [0.7, 0.26, Math.PI]]));
  } };

  /* --- Incubadora Joaçaba --- */
  /* par de mesas coloridas frente a frente (azul + verde), gaveteiros azuis e 4 cadeiras (E34, E35, E37) */
  T['ilha-incubadora'] = { colisao: { caixa: [1.6, 2.56] }, sombra: [1.8, 2.7], partes: function(){
    return [
      parte(Q(1.6, 0.05, 0.75, 0.015), 'azul-mesa', 0.01, [M(0, 0.73, -0.375)]), parte(Q(1.6, 0.05, 0.75, 0.015), 'verde-mesa', 0.01, [M(0, 0.73, 0.375)]),
      parte(Q(0.05, 0.71, 0.7, 0.01), 'azul-mesa', 0.006, [M(-0.775, 0.355, -0.375), M(0.775, 0.355, -0.375)]),
      parte(Q(0.05, 0.71, 0.7, 0.01), 'verde-mesa', 0.006, [M(-0.775, 0.355, 0.375), M(0.775, 0.355, 0.375)]),
      parte(Q(0.4, 0.55, 0.5, 0.03), 'azul-mesa', 0.006, [M(0.45, 0.28, -0.4), M(-0.45, 0.28, 0.4)])
    ].concat(cadeirasEm([[-0.4, -0.97, 0], [0.4, -0.97, 0], [-0.4, 0.97, Math.PI], [0.4, 0.97, Math.PI]]), equipamento('monitor', [[0.3, 0.755, -0.5, 0]]), equipamento('notebook', [[-0.3, 0.755, 0.45, Math.PI]]));
  } };
  /* mesa branca com 4 cadeiras (E35): 1,6 × 0,8 */
  T['mesa-branca-4'] = { colisao: { caixa: [1.6, 1.98] }, sombra: [1.8, 2.1], partes: function(){
    return [parte(Q(1.6, 0.04, 0.8, 0.012), 'branco', 0.008, [M(0, 0.73, 0)]),
      parte(new THREE.CylinderGeometry(0.025, 0.025, 0.71, 8), 'metal', 0, [M(-0.72, 0.355, -0.33), M(0.72, 0.355, -0.33), M(-0.72, 0.355, 0.33), M(0.72, 0.355, 0.33)])]
      .concat(cadeirasEm([[-0.4, -0.67, 0], [0.4, -0.67, 0], [-0.4, 0.67, Math.PI], [0.4, 0.67, Math.PI]]));
  } };
  /* mesa verde maciça com TV (E33, E36): 1,8 × 0,75 */
  T['mesa-verde-tv'] = { colisao: { caixa: [1.8, 0.75] }, sombra: [2.0, 1.0], partes: function(){
    return [parte(Q(1.8, 0.74, 0.75, 0.02), 'verde-mesa', 0.01, [M(0, 0.37, 0)]),
      parte(Q(0.3, 0.03, 0.2, 0.01), 'preto', 0.004, [M(-0.4, 0.755, -0.1)]), parte(Q(0.05, 0.22, 0.03, 0.01), 'preto', 0, [M(-0.4, 0.86, -0.12)]),
      parte(Q(0.98, 0.58, 0.04, 0.012), 'preto', 0.006, [M(-0.4, 1.22, -0.12)]), parte(new THREE.PlaneGeometry(0.93, 0.53), 'tela', 0, [M(-0.4, 1.22, -0.098)])];
  } };
  /* canto de ripas de madeira com prateleiras e mesa em L (E33–E35, E41): a parede fica em -z */
  T['ripas-canto'] = { alto: true, colisao: { caixa: [2.6, 1.13] }, sombra: [2.8, 1.3], partes: function(){
    var ripas = [], teto = [];
    for (var i = 0; i < 9; i++) ripas.push(M(-1.25 + i * 0.07, 1.4, -0.5));
    for (i = 0; i < 9; i++) ripas.push(M(1.25 - i * 0.07, 1.4, -0.5));
    for (i = 0; i < 12; i++) teto.push(M(-1.2 + i * 0.22, 2.62, -0.05, 0, 0, (i - 5.5) * 0.06));
    return [
      parte(Q(0.04, 2.8, 0.06, 0.01), 'nogueira', 0.004, ripas),
      parte(Q(0.05, 0.14, 1.0, 0.015), 'nogueira', 0.005, teto),
      parte(Q(1.6, 0.03, 0.26, 0.008), 'nogueira', 0.004, [M(0, 1.35, -0.4), M(0, 1.75, -0.4)]),
      parte(Q(0.1, 0.16, 0.1, 0.03), 'laranja', 0.004, [M(-0.5, 1.45, -0.4), M(0.3, 1.85, -0.4)]), parte(Q(0.12, 0.2, 0.06, 0.02), 'agua', 0.004, [M(0.1, 1.47, -0.4), M(-0.3, 1.87, -0.4)]),
      parte(Q(2.0, 0.04, 0.6, 0.012), 'nogueira', 0.008, [M(0, 0.73, -0.17)]), parte(Q(0.04, 0.71, 0.56, 0.01), 'nogueira', 0.004, [M(-0.98, 0.355, -0.17), M(0.98, 0.355, -0.17)])
    ].concat(cadeirasEm([[0.3, 0.27, Math.PI]]), equipamento('monitor', [[0.3, 0.75, -0.32, 0]]));
  } };
  /* posto de trabalho das salas das empresas (E38–E43): a parede/vidro fica em -z */
  T['mesa-empresa'] = { colisao: { caixa: [1.4, 1.17] }, sombra: [1.6, 1.3], partes: function(){
    return [parte(Q(1.4, 0.04, 0.7, 0.012), 'branco', 0.008, [M(0, 0.73, -0.24)]), parte(Q(0.05, 0.71, 0.66, 0.01), 'grafite', 0.004, [M(-0.67, 0.355, -0.24), M(0.67, 0.355, -0.24)])]
      .concat(cadeirasEm([[0, 0.26, Math.PI]]), equipamento('monitor', [[0, 0.75, -0.38, 0]]));
  } };
  /* poltronas do corredor da Incubadora (E31, E32, E44, E45) e a do Administrativo (E06, E07) */
  T['poltrona-cinza'] = { colisao: { caixa: [0.72, 0.76] }, sombra: [0.95, 1.0], assentos: [{ x: 0, z: 0.03, rot: 0, altura: 0.45, saida: [0, 0.9] }], partes: function(){
    return [parte(Q(0.72, 0.2, 0.7, 0.1), 'cinza-azul', 0.01, [M(0, 0.42, 0.02)]),
      parte(Q(0.72, 0.55, 0.16, 0.08), 'cinza-azul', 0.01, [M(0, 0.68, -0.29, -0.08, 0, 0)]),
      parte(Q(0.12, 0.48, 0.66, 0.05), 'cinza-azul', 0.008, [M(-0.3, 0.32, 0.02), M(0.3, 0.32, 0.02)]),
      parte(Q(0.06, 0.08, 0.06, 0.02), 'grafite', 0, [M(-0.3, 0.04, 0.28), M(0.3, 0.04, 0.28), M(-0.3, 0.04, -0.28), M(0.3, 0.04, -0.28)])];
  } };
  /* poltrona vermelha arredondada do núcleo (E10, E11, E17) */
  T['poltrona-vermelha'] = { colisao: { circulo: 0.36 }, sombra: [0.8, 0.8], assentos: [{ x: 0, z: 0.04, rot: 0, altura: 0.45, saida: [0, 0.85] }], partes: function(){
    /* concha aberta na frente (+z): torno parcial, visto dos dois lados */
    var concha = new THREE.LatheGeometry([[0.29, 0.4], [0.34, 0.5], [0.35, 0.64], [0.32, 0.8]].map(function(q){ return new THREE.Vector2(q[0], q[1]); }), 24, Math.PI * 0.32, Math.PI * 1.36);
    var pc = parte(concha, 'vermelho', 0.01, [M(0, 0, 0)]); pc.duplo = true;
    return [pc, parte(F.cilindro(0.29, 0.08, 0.03, 24), 'vermelho', 0.01, [M(0, 0.38, 0.02)]),
      parte(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 8), 'metal', 0, [M(0, 0.19, 0)]), parte(F.cilindro(0.22, 0.02, 0.01, 20), 'metal', 0.004, [M(0, 0, 0)])];
  } };
  /* banner de chão "Qual é a sua ideia de negócio?" (E06, E07) */
  T['banner-ideia'] = { colisao: { caixa: [0.84, 0.26] }, sombra: [0.9, 0.4], partes: function(){
    return [parte(Q(0.84, 0.08, 0.26, 0.03), 'metal', 0.006, [M(0, 0.04, 0)]), parte(new THREE.PlaneGeometry(0.8, 2.0), 'banner-ideia', 0, [M(0, 1.08, 0.02)])];
  } };
  /* moldura branca do elevador no 1º andar, igual à do térreo (E11) */
  T['portal-elevador'] = { colisao: false, partes: function(){
    /* tudo afastado 1,5 cm do plano da parede (sem faces coincidentes = sem cintilação) */
    return [parte(Q(0.34, 2.5, 0.12, 0.03), 'branco', 0.01, [M(-0.72, 1.25, 0.075), M(0.72, 1.25, 0.075)]), parte(Q(1.78, 0.3, 0.12, 0.03), 'branco', 0.01, [M(0, 2.35, 0.075)]),
      parte(Q(0.12, 0.5, 0.03, 0.01), 'inox', 0.004, [M(1.05, 1.15, 0.03)]), parte(new THREE.SphereGeometry(0.018, 8, 6), 'led', 0, [M(1.05, 1.22, 0.05)]),
      parte(Q(0.6, 0.04, 0.4, 0.01), 'grafite', 0, [M(0, 0.02, 0.3)])];
  } };
  /* moldura branca de porta (núcleo do 1º andar): a folha impressa vem das placas da planta */
  T['moldura-porta'] = { colisao: false, partes: function(){
    return [parte(Q(0.07, 2.17, 0.1, 0.02), 'branco', 0.006, [M(-0.485, 1.085, 0.03), M(0.485, 1.085, 0.03)]), parte(Q(1.04, 0.07, 0.1, 0.02), 'branco', 0.006, [M(0, 2.17, 0.03)])];
  } };
  /* --- sala de reuniões com o servidor (ao lado do podcast) --- */
  /* mesa redonda Ø 1,0 m com coluna central e 4 cadeiras encaixadas */
  T['mesa-redonda'] = { colisao: { circulo: 1.11 }, sombra: [2.2, 2.2], partes: function(){
    var cad = [0, 1, 2, 3].map(function(k){ var a = Math.PI / 4 + k * Math.PI / 2; return [Math.sin(a) * 0.78, Math.cos(a) * 0.78, a + Math.PI]; });
    return [parte(F.cilindro(0.5, 0.04, 0.02, 40), 'madeira-clara', 0.008, [M(0, 0.72, 0)]),
      parte(F.cilindro(0.05, 0.7, 0.02, 16), 'grafite', 0.004, [M(0, 0.02, 0)]), parte(F.cilindro(0.28, 0.03, 0.01, 28), 'grafite', 0.004, [M(0, 0, 0)])]
      .concat(cadeirasEm(cad));
  } };
  /* televisão de parede (a parede fica em -z) */
  T['tv-parede'] = { colisao: false, partes: function(){
    return [parte(Q(1.24, 0.72, 0.05, 0.012), 'preto', 0.006, [M(0, 1.55, 0.03)]), parte(new THREE.PlaneGeometry(1.18, 0.66), 'tela', 0, [M(0, 1.55, 0.056)])];
  } };
  /* cubo do equipamento de servidor, no alto do canto: chapa grafite, frisos de ventilação, moldura (os LEDs vêm de "leds" na planta) */
  T['servidor-cubo'] = { colisao: false, partes: function(){
    var frisos = []; for (var i = 0; i < 7; i++) frisos.push(M(-0.1, -0.18 + i * 0.06, 0.301));
    return [parte(Q(0.6, 0.6, 0.6, 0.03), 'grafite', 0.008, [M(0, 0, 0)]),
      parte(Q(0.3, 0.018, 0.01, 0.004), 'preto', 0, frisos),
      parte(Q(0.62, 0.03, 0.62, 0.01), 'metal', 0.004, [M(0, 0.31, 0), M(0, -0.31, 0)]),
      parte(Q(0.14, 0.2, 0.01, 0.005), 'preto', 0, [M(0.17, 0.05, 0.301)])];
  } };

  /* --- estúdio de podcast --- */
  /* painel acústico: quadrados pretos e cinza alternados, com espessura (4 × 5, 1,96 × 2,45 m); a parede fica em -z */
  T['painel-acustico'] = { colisao: false, partes: function(){
    var pretos = [], cinzas = [];
    for (var c = 0; c < 4; c++) for (var r = 0; r < 5; r++) ((c + r) % 2 ? cinzas : pretos).push(M(-0.735 + c * 0.49, 0.695 + r * 0.49, 0.06));
    return [parte(Q(0.46, 0.46, 0.06, 0.02), 'preto', 0, pretos), parte(Q(0.46, 0.46, 0.05, 0.02), 'cinza', 0, cinzas)];
  } };
  /* painel acústico estreito (2 × 5, 0,96 × 2,45 m), para os lados da TV no estúdio compacto */
  T['painel-acustico-2'] = { colisao: false, partes: function(){
    var pretos = [], cinzas = [];
    for (var c = 0; c < 2; c++) for (var r = 0; r < 5; r++) ((c + r) % 2 ? cinzas : pretos).push(M(-0.245 + c * 0.49, 0.695 + r * 0.49, 0.06));
    return [parte(Q(0.46, 0.46, 0.06, 0.02), 'preto', 0, pretos), parte(Q(0.46, 0.46, 0.05, 0.02), 'cinza', 0, cinzas)];
  } };
  /* mesa do estúdio compacto: 1,2 × 1,6, com 4 cadeiras nas laterais compridas e 4 microfones em braço articulado */
  T['mesa-podcast-compacta'] = { colisao: { caixa: [2.14, 1.6] }, sombra: [2.3, 1.8], partes: function(){
    var cad = [[-0.75, -0.4, Math.PI / 2], [-0.75, 0.4, Math.PI / 2], [0.75, -0.4, -Math.PI / 2], [0.75, 0.4, -Math.PI / 2]];
    var mics = cad.map(function(c){ return M(c[0] * 0.8, 0, c[1], 0, c[2] + Math.PI, 0); });
    function mic(geo, pal, esp, locais){ return parte(geo, pal, esp, compor(mics, locais)); }
    return [
      parte(Q(1.2, 0.05, 1.6, 0.02), 'grafite', 0.01, [M(0, 0.74, 0)]),
      parte(Q(0.06, 0.71, 0.06, 0.01), 'preto', 0.004, [M(-0.54, 0.355, -0.74), M(0.54, 0.355, -0.74), M(-0.54, 0.355, 0.74), M(0.54, 0.355, 0.74)]),
      mic(Q(0.05, 0.05, 0.07, 0.01), 'preto', 0, [M(0, 0.79, 0.04)]),
      mic(new THREE.CylinderGeometry(0.01, 0.01, 0.4, 6), 'metal', 0, [M(0, 0.98, 0.04)]),
      mic(new THREE.CylinderGeometry(0.009, 0.009, 0.3, 6), 'metal', 0, [M(0, 1.22, -0.06, -1.0, 0, 0)]),
      mic(new THREE.CylinderGeometry(0.032, 0.028, 0.15, 12), 'preto', 0.004, [M(0, 1.27, -0.2, -1.25, 0, 0)]),
      mic(new THREE.CylinderGeometry(0.07, 0.07, 0.008, 20), 'grafite', 0, [M(0, 1.245, -0.29, -1.25 + Math.PI / 2, 0, 0)]),
      mic(new THREE.CylinderGeometry(0.004, 0.004, 0.4, 4), 'preto', 0, [M(0, 0.77, 0.2, Math.PI / 2, 0, 0)])
    ].concat(cadeirasEm(cad));
  } };
  /* armário baixo e comprido (altura de cadeira), com portas de frisos discretos: 4,6 × 0,45 × 0,72; a parede fica em -z */
  T['armario-baixo-longo'] = { colisao: { caixa: [4.6, 0.45] }, sombra: [4.8, 0.65], partes: function(){
    var frisos = [], puxadores = [];
    for (var i = 1; i < 8; i++) frisos.push(M(-2.3 + i * 0.575, 0.38, 0.226));
    for (i = 0; i < 8; i++) puxadores.push(M(-2.3 + (i + 0.5) * 0.575 + (i % 2 ? -0.2 : 0.2), 0.62, 0.232));
    return [parte(Q(4.6, 0.68, 0.45, 0.02), 'branco', 0.01, [M(0, 0.38, 0)]), parte(Q(4.58, 0.04, 0.42, 0.01), 'grafite', 0, [M(0, 0.02, 0)]),
      parte(Q(4.62, 0.03, 0.47, 0.008), 'madeira-clara', 0.006, [M(0, 0.735, 0)]),
      parte(Q(0.006, 0.6, 0.008, 0.002), 'cinza', 0, frisos), parte(Q(0.1, 0.018, 0.02, 0.006), 'metal', 0, puxadores)];
  } };
  /* bancada de café contínua junto ao vidro (3,6 × 0,5 × 0,9): tampo comprido, gaveteiros, cafeteira, garrafas térmicas e xícaras */
  T['bancada-cafe'] = { colisao: { caixa: [3.6, 0.5] }, sombra: [3.8, 0.7], partes: function(){
    return [parte(Q(3.6, 0.04, 0.5, 0.012), 'madeira-clara', 0.008, [M(0, 0.9, 0)]),
      parte(Q(3.5, 0.84, 0.46, 0.02), 'branco', 0.008, [M(0, 0.44, 0)]),
      parte(Q(0.006, 0.7, 0.008, 0.002), 'cinza', 0, [-1.17, -0.58, 0, 0.58, 1.17].map(function(x){ return M(x, 0.45, 0.232); })),
      parte(Q(0.28, 0.36, 0.3, 0.03), 'preto', 0.006, [M(-1.1, 1.1, -0.02)]), parte(Q(0.1, 0.02, 0.12, 0.004), 'inox', 0, [M(-1.1, 1.0, 0.08)]),
      parte(new THREE.CylinderGeometry(0.055, 0.055, 0.28, 14), 'inox', 0.004, [M(-0.55, 1.06, 0), M(-0.38, 1.06, -0.04)]),
      parte(new THREE.CylinderGeometry(0.035, 0.03, 0.08, 12), 'branco', 0.003, [M(0.2, 0.96, 0.05), M(0.32, 0.96, -0.03), M(0.44, 0.96, 0.06)]),
      parte(Q(0.34, 0.03, 0.24, 0.01), 'madeira-escura', 0, [M(0.9, 0.935, 0)])];
  } };
  /* mesa quadrada 2,0 × 2,0 com 8 cadeiras (2 por lado) e 4 microfones em braço articulado, com pop filter */
  T['mesa-podcast'] = { colisao: { caixa: [2.94, 2.94] }, sombra: [3.1, 3.1], partes: function(){
    var cad = [], lados = [[0, -1, 0], [0, 1, Math.PI], [-1, 0, Math.PI / 2], [1, 0, -Math.PI / 2]];
    lados.forEach(function(L){ [-0.5, 0.5].forEach(function(o){ cad.push([L[0] * 1.15 + (L[0] ? 0 : o), L[1] * 1.15 + (L[1] ? 0 : o), L[2]]); }); });
    /* microfone no lado de um dos assentos: braço preso na borda, inclinado para o assento */
    var mics = lados.map(function(L){ return M(L[0] * 0.92 + (L[0] ? 0 : -0.5), 0, L[1] * 0.92 + (L[1] ? 0 : -0.5), 0, L[2] + Math.PI, 0); });
    function mic(geo, pal, esp, locais){ return parte(geo, pal, esp, compor(mics, locais)); }
    return [
      parte(Q(2.0, 0.05, 2.0, 0.02), 'grafite', 0.01, [M(0, 0.74, 0)]),
      parte(Q(0.07, 0.71, 0.07, 0.01), 'preto', 0.004, [M(-0.92, 0.355, -0.92), M(0.92, 0.355, -0.92), M(-0.92, 0.355, 0.92), M(0.92, 0.355, 0.92)]),
      mic(Q(0.06, 0.05, 0.08, 0.01), 'preto', 0, [M(0, 0.79, 0)]),                                         // grampo na borda
      mic(new THREE.CylinderGeometry(0.01, 0.01, 0.42, 6), 'metal', 0, [M(0, 0.99, 0)]),                   // coluna
      mic(new THREE.CylinderGeometry(0.009, 0.009, 0.36, 6), 'metal', 0, [M(0, 1.26, -0.13, -1.0, 0, 0)]), // braço
      mic(new THREE.CylinderGeometry(0.035, 0.03, 0.16, 12), 'preto', 0.004, [M(0, 1.33, -0.3, -1.25, 0, 0)]), // corpo do microfone
      mic(new THREE.CylinderGeometry(0.075, 0.075, 0.008, 20), 'grafite', 0, [M(0, 1.30, -0.4, -1.25 + Math.PI / 2, 0, 0)]), // pop filter
      mic(new THREE.CylinderGeometry(0.004, 0.004, 0.5, 4), 'preto', 0, [M(0, 0.77, 0.12, Math.PI / 2, 0, 0)])                 // cabo
    ].concat(cadeirasEm(cad));
  } };

  /* moldura de porta de 1,0 m (escadas de emergência do 1º andar) */
  T['moldura-porta-larga'] = { colisao: false, partes: function(){
    return [parte(Q(0.07, 2.17, 0.1, 0.02), 'branco', 0.006, [M(-0.535, 1.085, 0.04), M(0.535, 1.085, 0.04)]), parte(Q(1.14, 0.07, 0.1, 0.02), 'branco', 0.006, [M(0, 2.17, 0.04)])];
  } };
  /* moldura branca de nicho de banheiro (E10, E18): marco de 9 cm no vão do revestimento, com soleira; largura = vão livre */
  function nicho(w, h){ return { colisao: false, partes: function(){
    return [parte(Q(0.09, h + 0.09, 0.16, 0.02), 'branco', 0.008, [M(-w / 2 - 0.045, (h + 0.09) / 2, 0.05), M(w / 2 + 0.045, (h + 0.09) / 2, 0.05)]),
      parte(Q(w + 0.18, 0.09, 0.16, 0.02), 'branco', 0.008, [M(0, h + 0.045, 0.05)]),
      parte(Q(w, 0.02, 0.12, 0.006), 'cinza', 0, [M(0, 0.01, 0.07)])];
  } }; }
  T['nicho-banheiro'] = nicho(1.8, 2.4);
  T['nicho-banheiro-pcd'] = nicho(1.6, 2.4);
  T.maquete = { colisao: { caixa: [1.2, 0.75] }, sombra: [1.4, 0.95], partes: function(){
    return [parte(Q(1.2, 0.82, 0.75, 0.025), 'grafite', 0.008, [M(0, 0.41, 0)]),
      parte(Q(1.1, 0.05, 0.65, 0.018), 'branco', 0.006, [M(0, 0.86, 0)]),
      parte(Q(0.18, 0.24, 0.16, 0.015), 'agua', 0.004, [M(-0.3, 1.0, -0.1), M(0.1, 0.96, 0.12), M(0.34, 1.08, -0.16)])];
  } };
})(window.Orvalho);
