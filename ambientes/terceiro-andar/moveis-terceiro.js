/* 3º andar (ático): artes impressas e móveis próprios, a partir das fotos T01–T48 (docs/terceiro-andar/).
   Mesmo catálogo e mesmas regras do Hall: peças arredondadas, gelatina com contorno, tudo instanciado.
   Marcas de terceiros (SCL Automação, Salus, Athostec, Unimed): nome legível e composição simplificada, sem reproduzir
   o desenho original dos logotipos, sem endereço e sem QR code (DECISOES.md). Salas sem nome legível não ganham marca. */
(function(O){
  var F = O.formas, MV = O.moveis, M = MV.M, parte = MV.parte, A = F.ARTES, T = MV.TIPOS;
  var Q = function(w, h, d, r){ return F.caixa(w, h, d, r, 2); };

  /* ---------- utilitários de desenho ---------- */
  function cv(w, h){ var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tx(c){ var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t; }
  function txt(x, t, X, Y, font, cor, al){ x.font = font; x.fillStyle = cor; x.textAlign = al || 'left'; x.textBaseline = 'middle'; x.fillText(t, X, Y); }
  function rr(x, l, t, w, h, r){ x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r); x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath(); }
  function tri(x, cx, cy, s, fill, stroke, lw){ x.beginPath(); x.moveTo(cx - s * 0.45, cy - s * 0.52); x.lineTo(cx + s * 0.55, cy); x.lineTo(cx - s * 0.45, cy + s * 0.52); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); } }
  var semente = 11; function rnd(){ semente = (semente * 9301 + 49297) % 233280; return semente / 233280; }

  /* ---------- películas dos vidros (um módulo de ~1 m de largura por textura; faixa do piso até a altura indicada) ---------- */
  /* corredor do 3º andar (Salus, Athostec, SCL, sala X): fosco embaixo com triângulos vazados e faixa de triângulos brancos e
     grafite na altura dos olhos (T07, T26, T44) */
  function peliculaTriangulos(cores){
    return function(){
      var W = 256, Hm = 1.6, pxm = W / 1.0, Hp = Math.round(Hm * pxm), c = cv(W, Hp), x = c.getContext('2d'); semente = 11;
      var y = function(m){ return Hp - m * pxm; };
      var g = x.createLinearGradient(0, y(1.0), 0, Hp); g.addColorStop(0, 'rgba(236,242,246,0)'); g.addColorStop(0.12, 'rgba(236,242,246,.62)'); g.addColorStop(1, 'rgba(226,234,240,.72)');
      x.fillStyle = g; x.fillRect(0, y(1.0), W, Hp - y(1.0));
      for (var i = 0; i < 9; i++) tri(x, 20 + rnd() * 216, y(0.12 + rnd() * 0.7), 18 + rnd() * 22, null, 'rgba(120,135,148,.55)', 2);
      for (var k = 0; k < 13; k++) { var s = 0.09 + rnd() * 0.11, cx = (k + 0.3) * W / 12.5 + rnd() * 6, cy = y(1.02 + rnd() * 0.42);
        tri(x, cx, cy, s * pxm, k % 3 === 1 ? cores[1] : cores[0], 'rgba(90,100,110,.35)', 1.5); }
      return tx(c);
    };
  }
  A['pelicula-tri'] = peliculaTriangulos(['rgba(255,255,255,.92)', 'rgba(44,50,58,.88)']);
  A['pelicula-vermelha'] = peliculaTriangulos(['rgba(255,255,255,.92)', 'rgba(214,52,46,.9)']);     // sala A (T06, T15)
  /* vidro da Unimed: fosco embaixo e quadrados de cantos redondos em contorno verde, laranja e branco (T37, T46) */
  A['pelicula-unimed'] = function(){
    var W = 256, pxm = 256, Hp = Math.round(2.15 * pxm), c = cv(W, Hp), x = c.getContext('2d'); semente = 5;
    var y = function(m){ return Hp - m * pxm; };
    var g = x.createLinearGradient(0, y(1.3), 0, Hp); g.addColorStop(0, 'rgba(236,242,246,0)'); g.addColorStop(0.1, 'rgba(236,242,246,.6)'); g.addColorStop(1, 'rgba(228,236,240,.7)');
    x.fillStyle = g; x.fillRect(0, y(1.3), W, Hp - y(1.3));
    ['#3a9a3a', '#f07a2a', '#ffffff', '#3a9a3a', '#ffffff', '#f07a2a'].forEach(function(cor, i){ rr(x, 18 + rnd() * 170, y(1.35 + rnd() * 0.75), 48, 48, 12); x.strokeStyle = cor; x.lineWidth = 6; x.stroke(); });
    for (var i = 0; i < 7; i++) tri(x, 20 + rnd() * 216, y(0.1 + rnd() * 0.5), 20, null, 'rgba(120,135,148,.5)', 2);
    return tx(c);
  };

  /* ---------- cartazes e portas adesivadas ---------- */
  /* painel do Lab ao lado da porta (T09–T16): texto legível nas fotos; logos de parceiros só como nomes */
  A['lab-cartaz'] = function(){
    var c = cv(360, 880), x = c.getContext('2d');
    x.fillStyle = '#f7f8fa'; x.fillRect(0, 0, 360, 880);
    x.fillStyle = '#f26a21'; x.beginPath(); x.arc(330, 40, 90, 0, Math.PI * 2); x.fill(); x.fillStyle = '#3d5fc4'; x.beginPath(); x.arc(355, 120, 46, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#f26a21'; x.beginPath(); x.arc(330, 860, 80, 0, Math.PI * 2); x.fill(); x.fillStyle = '#3d5fc4'; x.beginPath(); x.arc(250, 900, 60, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#2f5fd0'; x.lineWidth = 7; rr(x, 34, 200, 70, 56, 18); x.stroke(); x.fillStyle = '#2f5fd0'; x.beginPath(); x.arc(57, 228, 7, 0, 7); x.arc(81, 228, 7, 0, 7); x.fill();
    x.beginPath(); x.moveTo(69, 200); x.lineTo(69, 182); x.stroke(); x.beginPath(); x.arc(69, 176, 7, 0, 7); x.fill();
    txt(x, 'LABORATÓRIO DE', 34, 310, '600 24px Figtree, Arial', '#3c4a5a');
    txt(x, 'Inteligência', 34, 356, '800 44px Figtree, Arial', '#1d2733'); txt(x, 'Artificial', 34, 404, '800 44px Figtree, Arial', '#1d2733');
    var g = x.createLinearGradient(34, 0, 230, 0); g.addColorStop(0, '#f26a21'); g.addColorStop(1, '#2f5fd0'); x.fillStyle = g; x.fillRect(34, 432, 196, 6);
    ['Tecnologia', 'que conecta', 'pessoas, ideias', 'e o futuro.'].forEach(function(l, i){ txt(x, l, 34, 500 + i * 30, '500 25px Figtree, Arial', '#3c4a5a'); });
    txt(x, 'INOVAÇÃO • CONHECIMENTO', 34, 650, '600 17px Figtree, Arial', '#3c4a5a'); txt(x, 'COLABORAÇÃO • IMPACTO', 34, 676, '600 17px Figtree, Arial', '#3c4a5a');
    txt(x, 'INOVALE', 34, 770, '800 22px Nunito, Figtree, Arial', '#6a7078'); txt(x, 'fapesc', 150, 770, '700 22px Figtree, Arial', '#6a7078');
    return tx(c);
  };
  A['porta-salus'] = function(){   // T12, T24–T29: azul-marinho, triângulo laranja, "SALUS · MÉTODO SALUS"
    var c = cv(256, 580), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 580);
    g.addColorStop(0, '#0f1730'); g.addColorStop(0.7, '#14224a'); g.addColorStop(1, '#1d4fa8'); x.fillStyle = g; x.fillRect(0, 0, 256, 580);
    x.fillStyle = '#f39a1e'; x.beginPath(); x.moveTo(128, 70); x.lineTo(160, 128); x.lineTo(96, 128); x.closePath(); x.fill();
    txt(x, 'SALUS', 128, 156, '800 34px Figtree, Arial', '#ffffff', 'center');
    for (var i = 0; i < 6; i++) { x.fillStyle = 'rgba(160,190,255,.45)'; rr(x, 50 + (i % 2) * 12, 196 + i * 18, 156 - (i % 2) * 24, 6, 3); x.fill(); }
    txt(x, 'MÉTODO SALUS', 128, 330, '800 22px Figtree, Arial', '#ffffff', 'center'); txt(x, 'Individualidade Biológica', 128, 354, '700 14px Figtree, Arial', '#f39a1e', 'center');
    for (i = 0; i < 4; i++) { x.fillStyle = 'rgba(160,190,255,.4)'; rr(x, 44, 380 + i * 16, 168, 5, 2); x.fill(); }
    x.strokeStyle = 'rgba(120,190,255,.5)'; x.lineWidth = 2; for (i = 0; i < 4; i++) { x.beginPath(); x.arc(128, 520, 18 + i * 14, 0, Math.PI * 2); x.stroke(); }
    return tx(c);
  };
  A['porta-athostec'] = function(){   // T30, T45: violeta-azulado, marca em "A" (simplificada) e o lema legível na porta
    var c = cv(256, 580), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 256, 580);
    g.addColorStop(0, '#3b2a8f'); g.addColorStop(1, '#1f2d7a'); x.fillStyle = g; x.fillRect(0, 0, 256, 580);
    x.strokeStyle = 'rgba(140,170,255,.25)'; x.lineWidth = 1.5; for (var i = 0; i < 14; i++) { x.beginPath(); x.moveTo(0, 300 + i * 22); x.lineTo(256, 250 + i * 26); x.stroke(); }
    x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(70, 210); x.lineTo(118, 90); x.lineTo(140, 90); x.lineTo(112, 160); x.lineTo(150, 160); x.lineTo(140, 186); x.lineTo(102, 186); x.lineTo(92, 210); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(146, 200); x.lineTo(200, 96); x.lineTo(206, 102); x.lineTo(160, 208); x.closePath(); x.fill();
    txt(x, 'ATHOSTEC', 128, 252, '800 30px Figtree, Arial', '#ffffff', 'center');
    x.fillStyle = '#ffffff'; x.fillRect(100, 300, 56, 56); x.fillStyle = '#2a2f7f'; for (i = 0; i < 9; i++) x.fillRect(104 + (i % 3) * 17, 304 + Math.floor(i / 3) * 17, 12, 12);   // quadrado genérico (sem QR real)
    ['Evolução,', 'Desenvolvimento e', 'Gestão de Alta Qualidade'].forEach(function(l, k){ txt(x, l, 128, 410 + k * 22, '600 15px Figtree, Arial', '#e8ecff', 'center'); });
    return tx(c);
  };
  A['porta-unimed'] = function(){     // porta branca com a placa verde e o aviso escuro (T37, T46)
    var c = cv(256, 580), x = c.getContext('2d'); x.fillStyle = '#eef0f1'; x.fillRect(0, 0, 256, 580);
    x.strokeStyle = '#f07a2a'; x.lineWidth = 4; rr(x, 196, 120, 40, 90, 14); x.stroke(); rr(x, 196, 300, 40, 120, 14); x.stroke();
    x.fillStyle = '#26282c'; rr(x, 64, 132, 120, 40, 4); x.fill(); x.fillStyle = '#f07a2a'; x.fillRect(70, 160, 40, 8);
    x.fillStyle = '#1f7a3a'; rr(x, 40, 190, 160, 66, 10); x.fill(); x.strokeStyle = '#ffffff'; x.lineWidth = 3; rr(x, 46, 196, 148, 54, 8); x.stroke();
    txt(x, 'Unimed', 112, 216, '800 30px Figtree, Arial', '#ffffff', 'center'); txt(x, 'Meio Oeste - SC', 112, 240, '700 13px Figtree, Arial', '#ffffff', 'center');
    x.fillStyle = '#9aa3ad'; x.fillRect(206, 284, 14, 6);
    return tx(c);
  };
  A['unimed-logo'] = function(){
    var c = cv(560, 200), x = c.getContext('2d'); x.clearRect(0, 0, 560, 200);
    x.fillStyle = '#1f7a3a'; rr(x, 8, 8, 544, 184, 22); x.fill(); x.strokeStyle = '#ffffff'; x.lineWidth = 6; rr(x, 20, 20, 520, 160, 16); x.stroke();
    txt(x, 'Unimed', 260, 86, '800 92px Figtree, Arial', '#ffffff', 'center'); txt(x, 'Meio Oeste SC', 260, 150, '700 38px Figtree, Arial', '#ffffff', 'center');
    x.fillStyle = '#ffffff'; x.fillRect(478, 50, 6, 100);
    return tx(c);
  };
  A['porta-escura'] = function(){     // sala X: adesivo escuro ilegível nas fotos (T35, T36): só cor e formas, sem texto
    var c = cv(256, 580), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 580);
    g.addColorStop(0, '#1a1f2a'); g.addColorStop(1, '#273246'); x.fillStyle = g; x.fillRect(0, 0, 256, 580);
    x.fillStyle = 'rgba(120,150,190,.35)'; rr(x, 50, 120, 156, 18, 9); x.fill(); rr(x, 70, 150, 116, 10, 5); x.fill(); rr(x, 60, 420, 136, 10, 5); x.fill();
    return tx(c);
  };
  A['scl-logo'] = function(){         // letreiro na parede da SCL (T01, T07, T08): três quadrados com S, C e L e "AUTOMAÇÃO"
    var c = cv(560, 360), x = c.getContext('2d'); x.clearRect(0, 0, 560, 360);
    ['S', 'C', 'L'].forEach(function(l, i){ x.fillStyle = '#2c2f34'; rr(x, 60 + i * 150, 40, 130, 130, 18); x.fill(); txt(x, l, 125 + i * 150, 108, '800 92px Figtree, Arial', '#f4f4f2', 'center'); });
    x.fillStyle = '#2c2f34'; rr(x, 60, 186, 430, 20, 10); x.fill(); x.fillRect(260, 206, 30, 26);
    txt(x, 'AUTOMAÇÃO', 275, 290, '800 66px Figtree, Arial', '#2c2f34', 'center');
    return tx(c);
  };
  A['inteligencia-industrial'] = function(){ var c = cv(560, 150), x = c.getContext('2d'); x.clearRect(0, 0, 560, 150); txt(x, 'INTELIGÊNCIA', 20, 48, '800 54px Figtree, Arial', '#33363b'); txt(x, 'INDUSTRIAL', 70, 110, '800 54px Figtree, Arial', '#33363b'); return tx(c); };
  A['administracao'] = function(){ var c = cv(400, 60), x = c.getContext('2d'); x.clearRect(0, 0, 400, 60); txt(x, 'ADMINISTRAÇÃO', 200, 32, '700 34px Figtree, Arial', '#33363b', 'center'); return tx(c); };
  A['fapesc-aviso'] = function(){ var c = cv(300, 210), x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, 300, 210); txt(x, 'Esta empresa conta com fomento', 150, 46, '600 19px Figtree, Arial', '#3c4650', 'center'); txt(x, 'FAPESC', 150, 120, '800 52px Figtree, Arial', '#2f6db0', 'center'); return tx(c); };
  A['nao-use-elevador'] = function(){ var c = cv(256, 300), x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, 256, 300); x.strokeStyle = '#d7262e'; x.lineWidth = 14; x.beginPath(); x.arc(70, 90, 50, 0, 7); x.stroke(); x.beginPath(); x.moveTo(36, 56); x.lineTo(104, 124); x.stroke();
    ['EM CASO DE', 'INCÊNDIO', 'NÃO USE', 'O ELEVADOR'].forEach(function(l, i){ txt(x, l, 132, 50 + i * 34, '800 22px Figtree, Arial', '#2b2b2b'); }); return tx(c); };

  /* ---------- texturas de móveis ---------- */
  MV.TEXTURAS['banner-generico'] = function(){   // banner de rolo da sala B: só cores e formas (empresa ilegível nas fotos)
    var c = cv(256, 600), x = c.getContext('2d'); x.fillStyle = '#f7f7f5'; x.fillRect(0, 0, 256, 600);
    x.fillStyle = '#d93a2b'; x.beginPath(); x.moveTo(256, 120); x.lineTo(140, 260); x.lineTo(256, 400); x.closePath(); x.fill();
    for (var i = 0; i < 6; i++) { x.fillStyle = i < 2 ? '#2b2f36' : '#9aa3ad'; rr(x, 24, 150 + i * 30, i < 2 ? 120 : 100, i < 2 ? 14 : 8, 4); x.fill(); }
    for (i = 0; i < 6; i++) { x.fillStyle = '#c3c8ce'; rr(x, 24 + (i % 3) * 72, 470 + Math.floor(i / 3) * 44, 58, 26, 6); x.fill(); }
    return tx(c);
  };
  MV.TEXTURAS['athostec-painel'] = function(){   // painel escuro com a marca iluminada (T33, T44), simplificada
    var c = cv(512, 448), x = c.getContext('2d'); semente = 3;
    x.fillStyle = '#3b4247'; x.fillRect(0, 0, 512, 448);
    for (var i = 0; i < 400; i++) { x.fillStyle = 'rgba(' + (rnd() > 0.5 ? '255,255,255,.05' : '0,0,0,.08') + ')'; x.fillRect(rnd() * 512, rnd() * 448, 3 + rnd() * 10, 2 + rnd() * 6); }
    x.shadowColor = '#bcd2ff'; x.shadowBlur = 24; x.fillStyle = '#5b5fd6';
    x.beginPath(); x.moveTo(170, 330); x.lineTo(236, 130); x.lineTo(270, 130); x.lineTo(230, 250); x.lineTo(290, 250); x.lineTo(278, 288); x.lineTo(218, 288); x.lineTo(204, 330); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(290, 320); x.lineTo(360, 150); x.lineTo(372, 158); x.lineTo(310, 328); x.closePath(); x.fill();
    x.shadowBlur = 0; x.strokeStyle = 'rgba(230,240,255,.9)'; x.lineWidth = 3; x.stroke();
    return tx(c);
  };

  /* ---------- cores ---------- */
  MV.PAL.marinho = ['#1e2f78', '#0a113a', '#6d8cff'];
  MV.PAL.celeste = ['#2aa8dc', '#0b4a6a', '#bff0ff'];
  MV.PAL['couro-branco'] = ['#f4f5f3', '#8a949c', '#ffffff'];

  /* ---------- móveis do hall de estar e do corredor ---------- */
  /* sofá branco de dois lugares com braços de tubo cromado (T30–T34, T38): 1,60 × 0,80 */
  T['sofa-branco'] = { colisao: { caixa: [1.62, 0.84] }, sombra: [1.9, 1.1],
    assentos: [{ x: -0.36, z: 0.06, rot: 0, altura: 0.44, saida: [-0.36, 1.0] }, { x: 0.36, z: 0.06, rot: 0, altura: 0.44, saida: [0.36, 1.0] }],
    partes: function(){
      var tuboV = new THREE.CapsuleGeometry(0.022, 0.5, 3, 8), tuboH = new THREE.CapsuleGeometry(0.022, 0.66, 3, 8);
      return [
        parte(Q(1.36, 0.2, 0.66, 0.07), 'couro-branco', 0.01, [M(0, 0.36, 0.04)]),
        parte(Q(1.36, 0.46, 0.2, 0.08), 'couro-branco', 0.01, [M(0, 0.62, -0.29, -0.08, 0, 0)]),
        parte(Q(0.16, 0.34, 0.78, 0.07), 'couro-branco', 0.01, [M(-0.7, 0.47, 0), M(0.7, 0.47, 0)]),
        parte(Q(1.44, 0.1, 0.7, 0.04), 'couro-branco', 0.008, [M(0, 0.21, 0)]),
        parte(tuboV, 'inox', 0, [M(-0.8, 0.3, 0.3), M(0.8, 0.3, 0.3), M(-0.8, 0.3, -0.3), M(0.8, 0.3, -0.3)]),
        parte(tuboH, 'inox', 0, [M(-0.8, 0.6, 0, Math.PI / 2, 0, 0), M(0.8, 0.6, 0, Math.PI / 2, 0, 0), M(-0.8, 0.02, 0, Math.PI / 2, 0, 0), M(0.8, 0.02, 0, Math.PI / 2, 0, 0)])
      ];
    } };
  /* mesa de centro branca baixa (T32, T33) */
  T['mesa-centro'] = { colisao: { caixa: [1.2, 0.72] }, sombra: [1.4, 0.9], partes: function(){ return [parte(Q(1.2, 0.3, 0.72, 0.04), 'branco', 0.01, [M(0, 0.15, 0)])]; } };
  /* tapete cinza felpudo do estar (T30–T34) */
  T['tapete-grande'] = { colisao: false, partes: function(){ return [parte(F.caixa(4.2, 0.025, 2.9, 0.01), 'cinza', 0, [M(0, 0.012, 0)])]; } };
  /* almofadões azul-marinho no chão, junto ao vidro da Unimed (T35–T39, T46) */
  T['almofadao'] = { colisao: { caixa: [1.1, 0.8] }, sombra: [1.3, 1.0], partes: function(){ return [parte(Q(1.1, 0.24, 0.8, 0.1), 'marinho', 0.012, [M(0, 0.12, 0)])]; } };
  /* sofá azul em bloco com encosto azul-claro e mesinha de pés finos (T11–T14) */
  T['sofa-azul'] = { colisao: { caixa: [1.9, 0.74] }, sombra: [2.1, 0.95],
    assentos: [{ x: -0.45, z: 0.08, rot: 0, altura: 0.42, saida: [-0.45, 0.95] }, { x: 0.45, z: 0.08, rot: 0, altura: 0.42, saida: [0.45, 0.95] }],
    partes: function(){ return [parte(Q(1.9, 0.42, 0.74, 0.06), 'marinho', 0.012, [M(0, 0.21, 0)]), parte(Q(1.15, 0.34, 0.16, 0.06), 'celeste', 0.01, [M(-0.3, 0.58, -0.27)])]; } };
  T['mesinha-azul'] = { colisao: { circulo: 0.24 }, sombra: [0.55, 0.55], partes: function(){
    var pes = []; for (var i = 0; i < 3; i++) { var a = i * Math.PI * 2 / 3; pes.push(M(Math.sin(a) * 0.12, 0.27, Math.cos(a) * 0.12, Math.cos(a) * 0.12, 0, -Math.sin(a) * 0.12)); }
    return [parte(F.cilindro(0.23, 0.03, 0.01, 24), 'marinho', 0.006, [M(0, 0.55, 0)]), parte(new THREE.CylinderGeometry(0.008, 0.008, 0.56, 5), 'marinho', 0, pes)];
  } };
  /* bancada branca na parede do núcleo com cinco banquetas coloridas (T21, T22, T47): origem no centro da pegada (bancada atrás,
     banquetas na frente); frente = +z */
  T['bancada-parede'] = { colisao: { caixa: [2.5, 0.85] }, sombra: [2.8, 1.0], partes: function(){
    var cores = ['celeste', 'amarelo', 'amarelo', 'celeste', 'vermelho'], porCor = {};
    cores.forEach(function(c, i){ (porCor[c] = porCor[c] || []).push(-1.0 + i * 0.5); });
    var out = [parte(Q(2.5, 0.04, 0.42, 0.015), 'branco', 0.008, [M(0, 0.98, -0.215)]),
               parte(Q(0.03, 0.26, 0.3, 0.01), 'branco', 0, [M(-1.1, 0.84, -0.25), M(1.1, 0.84, -0.25), M(0, 0.84, -0.25)])];
    Object.keys(porCor).forEach(function(c){
      var bases = porCor[c].map(function(x){ return M(x, 0, 0.255); }), assento = [], pernas = [];
      bases.forEach(function(b){ assento.push(b.clone().multiply(M(0, 0.66, 0))); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(s){ pernas.push(b.clone().multiply(M(s[0] * 0.11, 0.33, s[1] * 0.11, s[1] * 0.08, 0, -s[0] * 0.08))); }); });
      out.push(parte(F.cilindro(0.17, 0.06, 0.02, 20), c, 0.008, assento), parte(Q(0.04, 0.66, 0.04, 0.012), c, 0.004, pernas));
    });
    return out;
  } };
  /* vitrine de madeira com prateleiras (T21, T47): 0,90 × 0,45 × 1,90 */
  T['vitrine'] = { alto: true, colisao: { caixa: [0.9, 0.45] }, sombra: [1.1, 0.65], partes: function(){
    return [
      parte(Q(0.05, 1.9, 0.45, 0.012), 'madeira', 0.008, [M(-0.425, 0.95, 0), M(0.425, 0.95, 0)]),
      parte(Q(0.9, 0.06, 0.45, 0.012), 'madeira', 0.008, [M(0, 0.03, 0), M(0, 1.87, 0)]),
      parte(Q(0.8, 1.8, 0.02, 0.006), 'madeira', 0.006, [M(0, 0.95, -0.21)]),
      parte(Q(0.8, 0.012, 0.4, 0.004), 'inox', 0, [M(0, 0.55, 0), M(0, 0.95, 0), M(0, 1.35, 0)]),
      parte(Q(0.08, 0.12, 0.08, 0.02), 'branco', 0.004, [M(-0.2, 0.62, 0), M(0.15, 1.02, 0.05), M(-0.1, 1.42, 0)])
    ];
  } };
  /* banner de rolo (sala B) */
  T['banner-rollup'] = { colisao: { caixa: [0.85, 0.22] }, sombra: [0.95, 0.4], partes: function(){
    return [parte(Q(0.85, 0.08, 0.22, 0.03), 'grafite', 0.006, [M(0, 0.04, 0)]), parte(new THREE.PlaneGeometry(0.8, 1.95), 'banner-generico', 0, [M(0, 1.06, 0.02)])];
  } };
  /* painel solto escuro com a marca iluminada (Athostec, T44) */
  T['painel-logo'] = { alto: true, colisao: { caixa: [2.4, 0.14] }, sombra: [2.6, 0.4], partes: function(){
    return [parte(Q(2.4, 2.1, 0.12, 0.02), 'grafite', 0.008, [M(0, 1.05, 0)]), parte(new THREE.PlaneGeometry(2.3, 2.0), 'athostec-painel', 0, [M(0, 1.06, 0.062)])];
  } };
  /* TV em pedestal com rodízios (salão, T04, T05) */
  T['tv-pedestal'] = { colisao: { caixa: [1.22, 0.55] }, sombra: [1.0, 0.8], partes: function(){
    return [parte(Q(0.8, 0.05, 0.55, 0.02), 'grafite', 0.006, [M(0, 0.06, 0)]), parte(F.cilindro(0.035, 1.5, 0.01, 12), 'grafite', 0.006, [M(0, 0.06, 0)]),
            parte(Q(1.22, 0.72, 0.06, 0.015), 'grafite', 0.008, [M(0, 1.45, 0.06)]), parte(new THREE.PlaneGeometry(1.16, 0.66), 'tela', 0, [M(0, 1.45, 0.092)])];
  } };
  /* bancada baixa do salão (T04): tampo branco e frente azul */
  T['bancada-baixa'] = { colisao: { caixa: [1.8, 0.55] }, sombra: [2.0, 0.75], partes: function(){
    return [parte(Q(1.8, 0.05, 0.55, 0.02), 'branco', 0.008, [M(0, 0.88, 0)]), parte(Q(1.76, 0.84, 0.03, 0.01), 'celeste', 0.006, [M(0, 0.43, 0.25)]), parte(Q(1.7, 0.84, 0.45, 0.02), 'branco', 0.006, [M(0, 0.43, -0.03)])];
  } };
  /* cadeira de concha amarela (salão, T04) */
  T['cadeira-amarela'] = { colisao: { circulo: 0.33 }, sombra: [0.65, 0.65], partes: function(){
    return [parte(Q(0.46, 0.07, 0.43, 0.03), 'amarelo', 0.01, [M(0, 0.45, 0.02)]), parte(Q(0.44, 0.33, 0.05, 0.024), 'amarelo', 0.01, [M(0, 0.66, -0.19, -0.16, 0, 0)]),
            parte(new THREE.CylinderGeometry(0.012, 0.012, 0.44, 5), 'inox', 0, [M(-0.17, 0.21, 0.15), M(0.17, 0.21, 0.15), M(-0.17, 0.21, -0.15), M(0.17, 0.21, -0.15)])];
  } };
})(window.Orvalho);
