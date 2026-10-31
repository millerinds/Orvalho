/* Formas e texturas da sala. Regra dos acessórios: só formas arredondadas e lisas (o contorno de casca invertida
   rasga em quina viva), modeladas em metros e nunca esticadas com escala não uniforme. Texturas desenhadas em canvas. */
(function(O){
  /* caixa com cantos arredondados e normais suaves: grade concentrada nos cantos e projetada numa esfera de raio r */
  function caixa(w, h, d, r, k){
    k = k || 3; r = Math.min(r, w / 2, h / 2, d / 2);
    var N = 2 * k + 1, g = new THREE.BoxGeometry(2, 2, 2, N, N, N), pos = g.attributes.position, nor = g.attributes.normal;
    var H = [w / 2, h / 2, d / 2], inner = [0, 0, 0], v = [0, 0, 0];
    function map(u, hh){
      var i = Math.round((u + 1) / 2 * N);
      if (i <= k) return -(hh - r) - r * Math.cos(i / k * Math.PI / 2);
      return (hh - r) + r * Math.sin((i - k - 1) / k * Math.PI / 2);
    }
    for (var n = 0; n < pos.count; n++) {
      v[0] = map(pos.getX(n), H[0]); v[1] = map(pos.getY(n), H[1]); v[2] = map(pos.getZ(n), H[2]);
      var dx = 0, dy = 0, dz = 0;
      for (var a = 0; a < 3; a++) inner[a] = Math.max(-(H[a] - r), Math.min(H[a] - r, v[a]));
      dx = v[0] - inner[0]; dy = v[1] - inner[1]; dz = v[2] - inner[2];
      var L = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (L > 1e-6) {
        dx /= L; dy /= L; dz /= L;
        pos.setXYZ(n, inner[0] + dx * r, inner[1] + dy * r, inner[2] + dz * r); nor.setXYZ(n, dx, dy, dz);
      } else pos.setXYZ(n, v[0], v[1], v[2]);
    }
    g.computeBoundingBox(); g.computeBoundingSphere();
    return g;
  }
  /* cilindro de borda arredondada (torno), base em y = 0 */
  function cilindro(r, h, rb, seg){
    rb = Math.min(rb == null ? r * 0.3 : rb, r, h / 2);
    var pts = [new THREE.Vector2(0, 0)], i, a;
    for (i = 0; i <= 4; i++) { a = -Math.PI / 2 + i / 4 * Math.PI / 2; pts.push(new THREE.Vector2(r - rb + Math.cos(a) * rb, rb + Math.sin(a) * rb)); }
    for (i = 0; i <= 4; i++) { a = i / 4 * Math.PI / 2; pts.push(new THREE.Vector2(r - rb + Math.cos(a) * rb, h - rb + Math.sin(a) * rb)); }
    pts.push(new THREE.Vector2(0, h));
    return new THREE.LatheGeometry(pts, seg || 24);
  }
  function tubo(pts, r, seg){ return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg || 24, r, 10, false); }

  function canvas(w, h){ var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, rep){
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
    return t;
  }
  /* sombra macia (a mesma do palco do provador) */
  function sombra(){
    var c = canvas(128, 128), x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(20,30,45,.45)'); gr.addColorStop(1, 'rgba(20,30,45,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  /* bolha (o .bokeh do site): brilho branco no alto à esquerda, corpo azul-gelo quase transparente, aro claro */
  function bolha(){
    var c = canvas(128, 128), x = c.getContext('2d');
    var g = x.createRadialGradient(45, 38, 2, 64, 64, 62);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.4, 'rgba(255,255,255,.3)'); g.addColorStop(0.7, 'rgba(180,230,255,.16)'); g.addColorStop(0.97, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.arc(64, 64, 62, 0, Math.PI * 2); x.fill();
    return tex(c);
  }
  /* piso 60 × 60: um ladrilho por repetição, rejunte claro e um brilho de gota em diagonal */
  function piso(rep, cores){
    cores = cores || {};
    var c = canvas(256, 256), x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 256, 256); g.addColorStop(0, cores.a || '#eef4f8'); g.addColorStop(1, cores.b || '#dde6ed');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    if (cores.manchas) { for (var i = 0; i < 40; i++) { x.fillStyle = 'rgba(' + (i % 2 ? '255,255,255,.05' : '90,80,70,.04') + ')'; x.beginPath(); x.arc((i * 73) % 256, (i * 151) % 256, 10 + (i % 5) * 9, 0, Math.PI * 2); x.fill(); } }
    x.fillStyle = cores.brilho || 'rgba(255,255,255,.55)'; x.beginPath(); x.moveTo(0, 0); x.lineTo(150, 0); x.lineTo(0, 150); x.fill();
    x.strokeStyle = cores.rejunte || '#bccbd7'; x.lineWidth = cores.rejunteLargura || 5; x.strokeRect(0, 0, 256, 256);
    return tex(c, rep);
  }
  /* forro de placas 60 × 60 */
  function forro(rep){
    var c = canvas(128, 128), x = c.getContext('2d');
    x.fillStyle = '#f6f9fb'; x.fillRect(0, 0, 128, 128);
    x.strokeStyle = '#d5dee6'; x.lineWidth = 4; x.strokeRect(0, 0, 128, 128);
    return tex(c, rep);
  }
  /* película do vidro do corredor: a "cara" do lab. Em cima vidro limpo; no meio, fileiras de triângulos;
     embaixo, degradê azul (como na foto). Canal alfa = o quanto o vidro fica fosco. */
  function pelicula(largura, altura){
    var W = 512, Hp = Math.round(W * altura / largura), c = canvas(W, Hp), x = c.getContext('2d');
    var px = W / largura; // pixels por metro
    x.clearRect(0, 0, W, Hp);
    var y0 = Hp - 1.75 * px; // a película vai do chão até ~1,75 m
    var g = x.createLinearGradient(0, y0, 0, Hp);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.08, 'rgba(240,250,255,.62)');
    g.addColorStop(0.55, 'rgba(225,244,255,.7)'); g.addColorStop(0.78, 'rgba(110,190,240,.78)'); g.addColorStop(1, 'rgba(22,120,205,.9)');
    x.fillStyle = g; x.fillRect(0, y0, W, Hp - y0);
    /* triângulos apontando para o lado, em fileiras que se apagam para cima */
    var s = 0.15 * px, rows = 7, base = Hp - 0.55 * px;
    for (var r = 0; r < rows; r++) {
      var yy = base - r * s * 1.25, a = 0.75 * (1 - r / rows);
      for (var cx = (r % 2) * s * 0.7 + s * 0.4; cx < W; cx += s * 1.4) {
        x.beginPath(); x.moveTo(cx - s * 0.38, yy - s * 0.45); x.lineTo(cx + s * 0.45, yy); x.lineTo(cx - s * 0.38, yy + s * 0.45); x.closePath();
        x.fillStyle = 'rgba(255,255,255,' + (a * 0.9).toFixed(2) + ')'; x.fill();
        x.lineWidth = 2.5; x.strokeStyle = 'rgba(11,138,149,' + a.toFixed(2) + ')'; x.stroke();
      }
    }
    return tex(c);
  }
  /* tela dos PCs: área de trabalho Aero (céu, colina, janela e ícones-bolha), brilhando em azul-água */
  function tela(){
    var c = canvas(512, 320), x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 320); g.addColorStop(0, '#0b62bd'); g.addColorStop(0.5, '#38b6f0'); g.addColorStop(1, '#bff0ff');
    x.fillStyle = g; x.fillRect(0, 0, 512, 320);
    x.fillStyle = '#6cc832'; x.beginPath(); x.moveTo(0, 250); x.bezierCurveTo(140, 200, 320, 290, 512, 225); x.lineTo(512, 320); x.lineTo(0, 320); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 3; x.beginPath(); x.moveTo(-10, 150); x.bezierCurveTo(160, 90, 300, 210, 530, 110); x.stroke();
    /* janela */
    x.fillStyle = 'rgba(255,255,255,.88)'; round(x, 150, 52, 300, 170, 14); x.fill();
    x.fillStyle = '#16bcc4'; round(x, 150, 52, 300, 28, 14); x.fill(); x.fillRect(150, 66, 300, 14);
    x.fillStyle = '#cfe9f8'; for (var i = 0; i < 4; i++) { round(x, 168, 98 + i * 28, 170 - i * 30, 12, 6); x.fill(); }
    x.fillStyle = '#9fe05a'; round(x, 360, 100, 72, 98, 10); x.fill();
    /* ícones-bolha à esquerda */
    ['#38d6ff', '#71c935', '#ff8a5b'].forEach(function(col, j){
      var cy = 70 + j * 74, rg = x.createRadialGradient(56, cy - 10, 4, 60, cy, 28);
      rg.addColorStop(0, '#fff'); rg.addColorStop(0.35, col); rg.addColorStop(1, '#0b3a6e');
      x.fillStyle = rg; x.beginPath(); x.arc(60, cy, 26, 0, Math.PI * 2); x.fill();
    });
    x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.moveTo(0, 0); x.lineTo(512, 0); x.lineTo(0, 170); x.fill(); // reflexo
    return tex(c);
  }
  function round(x, l, t, w, h, r){ x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r); x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath(); }

  /* céu Aero (degradê do REGRAS) numa cúpula com cores por vértice */
  function ceu(raio){
    var g = new THREE.SphereGeometry(raio, 48, 24), pos = g.attributes.position, cols = [];
    var stops = [[-0.2, '#cfeeff'], [0, '#eefaff'], [0.12, '#d4efff'], [0.3, '#7cc8f5'], [0.55, '#2a93e4'], [1, '#0b62bd']].map(function(s){ return [s[0], new THREE.Color(s[1])]; });
    for (var i = 0; i < pos.count; i++) {
      var y = pos.getY(i) / raio, c = stops[0][1].clone();
      for (var j = 1; j < stops.length; j++) if (y >= stops[j - 1][0]) c = stops[j - 1][1].clone().lerp(stops[j][1], Math.min(1, (y - stops[j - 1][0]) / (stops[j][0] - stops[j - 1][0])));
      c.convertSRGBToLinear(); // r149 não converte cor sozinho: o REGRAS dá sRGB, a saída é sRGB
      cols.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, fog: false }));
  }

  /* junta várias geometrias (já posicionadas) numa só: uma chamada de desenho para caixilhos, guarda-corpos etc. */
  function mesclar(geos){
    var pos = [], nor = [], uv = [], idx = [], off = 0, temUV = geos.some(function(g){ return g.attributes.uv; });
    geos.forEach(function(g){
      var p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv;
      for (var i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); if (temUV) uv.push(t ? t.getX(i) : 0, t ? t.getY(i) : 0); }
      if (g.index) for (var j = 0; j < g.index.count; j++) idx.push(g.index.getX(j) + off);
      else for (var k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count; g.dispose();
    });
    var out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    if (temUV) out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    out.setIndex(idx); out.computeBoundingSphere();
    return out;
  }
  /* porcelanato que imita madeira (parede interna do hall): réguas horizontais cinza-amarronzadas */
  function madeira(rep){
    var c = canvas(1024, 512), x = c.getContext('2d'), tons = ['#a08f7b', '#958572', '#ab9a85', '#8c7c6a', '#b2a28c', '#9a8a76'];
    var semente = 7; function rnd(){ semente = (semente * 9301 + 49297) % 233280; return semente / 233280; }
    for (var r = 0; r < 4; r++) {
      var X = -rnd() * 300;
      while (X < 1024) {
        var w = 560 + rnd() * 380, y0 = r * 128, tom = tons[Math.floor(rnd() * tons.length)];
        x.fillStyle = tom; x.fillRect(X, y0, w, 128);
        for (var v = 0; v < 9; v++) { // veios ondulados
          x.strokeStyle = 'rgba(70,52,36,' + (0.08 + rnd() * 0.12).toFixed(2) + ')'; x.lineWidth = 1 + rnd() * 2; x.beginPath();
          var yy = y0 + 10 + rnd() * 108; x.moveTo(X, yy);
          for (var k = 1; k <= 8; k++) x.lineTo(X + w * k / 8, yy + Math.sin(k * 1.3 + v) * (3 + rnd() * 5));
          x.stroke();
        }
        if (rnd() > 0.45) { var kx = X + 80 + rnd() * (w - 160), ky = y0 + 30 + rnd() * 68; x.fillStyle = 'rgba(70,50,32,.45)'; x.beginPath(); x.ellipse(kx, ky, 9 + rnd() * 7, 5 + rnd() * 4, 0, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = 'rgba(245,240,230,.5)'; x.fillRect(X, y0, 2, 128);              // rejunte claro entre réguas (C06)
        X += w;
      }
      x.fillStyle = 'rgba(245,240,230,.55)'; x.fillRect(0, r * 128 + 126, 1024, 2);
    }
    return tex(c, rep);
  }
  /* faixa fosca da fachada do hall: vidro jateado com uma fileira de triângulos (motivo da marca) */
  function faixaFosca(largura){
    var c = canvas(512, 96), x = c.getContext('2d');
    x.fillStyle = 'rgba(240,248,252,.62)'; x.fillRect(0, 0, 512, 96);
    for (var cx = 20; cx < 512; cx += 52) {
      x.beginPath(); x.moveTo(cx - 12, 30); x.lineTo(cx + 16, 48); x.lineTo(cx - 12, 66); x.closePath();
      x.fillStyle = 'rgba(255,255,255,.95)'; x.fill(); x.lineWidth = 2; x.strokeStyle = 'rgba(150,170,185,.7)'; x.stroke();
    }
    return tex(c, [Math.max(1, largura / 2.6), 1]);
  }
  /* logotipo INOVALE desenhado (aproximação: letras cinza + triângulo laranja). Trocar pelo arquivo oficial na Fase D. */
  function logoInovale(o){
    o = o || {};
    var c = canvas(1024, o.sub ? 300 : 220), x = c.getContext('2d');
    x.fillStyle = o.fundo || '#ffffff'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = o.cor || '#4b4f55'; x.font = '800 150px Nunito, Figtree, Arial, sans-serif'; x.textBaseline = 'middle';
    x.fillText('INOVALE', 120, 120);
    x.fillStyle = '#f26a21'; x.beginPath(); x.moveTo(108, 40); x.lineTo(160, 58); x.lineTo(108, 76); x.closePath(); x.fill();
    if (o.sub) { x.fillStyle = '#f26a21'; x.font = '700 40px Figtree, Arial, sans-serif'; x.fillText(o.sub, 124, 240); }
    return tex(c);
  }
  /* topo da recepção visto do mezanino: faixa "INSPIRE, CONECTE, INOVE." (as fotos de pessoas viram silhuetas genéricas) */
  function inspire(){
    var c = canvas(1024, 400), x = c.getContext('2d');
    x.fillStyle = '#6e7277'; x.fillRect(0, 0, 1024, 400);
    for (var i = 0; i < 4; i++) {
      var g = x.createLinearGradient(i * 256, 0, i * 256 + 256, 260); g.addColorStop(0, '#d9dcdf'); g.addColorStop(1, '#8d9196');
      x.fillStyle = g; x.fillRect(i * 256 + 4, 4, 248, 256);
      x.fillStyle = 'rgba(40,44,50,.55)'; x.beginPath(); x.arc(i * 256 + 128, 105, 46, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.ellipse(i * 256 + 128, 250, 92, 90, 0, Math.PI, 0); x.fill();
    }
    x.fillStyle = '#ffffff'; x.font = '800 70px Nunito, Figtree, Arial, sans-serif'; x.textBaseline = 'middle'; x.fillText('INOVALE', 60, 330);
    x.fillStyle = '#f26a21'; x.beginPath(); x.moveTo(50, 292); x.lineTo(80, 302); x.lineTo(50, 312); x.closePath(); x.fill();
    x.fillStyle = '#ffffff'; x.font = '700 46px Figtree, Arial, sans-serif'; x.fillText('INSPIRE, CONECTE, INOVE.', 420, 332);
    return tex(c);
  }
  /* painel de patrocinadores do arco A: só a marca INOVALE; os logos de terceiros viram placas genéricas */
  function patrocinadores(){
    var c = canvas(512, 640), x = c.getContext('2d');
    x.fillStyle = '#1f2329'; x.fillRect(0, 0, 512, 640); x.fillStyle = '#ffffff'; x.fillRect(18, 18, 476, 604);
    x.fillStyle = '#4b4f55'; x.font = '800 84px Nunito, Figtree, Arial, sans-serif'; x.textBaseline = 'middle'; x.fillText('INOVALE', 70, 92);
    x.fillStyle = '#f26a21'; x.beginPath(); x.moveTo(60, 50); x.lineTo(90, 60); x.lineTo(60, 70); x.closePath(); x.fill();
    for (var r = 0; r < 6; r++) for (var k = 0; k < 3; k++) { x.fillStyle = r % 2 ? '#d7dbe0' : '#c8cdd3'; round(x, 50 + k * 140, 180 + r * 70, 118, 46, 10); x.fill(); }
    x.fillStyle = '#8a9099'; x.font = '600 20px Figtree, Arial, sans-serif'; x.fillText('patrocinadores (genérico)', 140, 600);
    return tex(c);
  }
  /* telão de LED (desligado, azul-escuro Aero com uma vinheta suave) */
  function telaLed(){
    var c = canvas(512, 280), x = c.getContext('2d');
    var g = x.createRadialGradient(256, 120, 20, 256, 140, 320); g.addColorStop(0, '#1d4f8a'); g.addColorStop(1, '#061325');
    x.fillStyle = g; x.fillRect(0, 0, 512, 280);
    x.fillStyle = 'rgba(120,210,255,.25)'; for (var i = 0; i < 14; i++) { x.beginPath(); x.arc(40 + i * 33, 220 - (i % 4) * 30, 6 + (i % 3) * 4, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = 'rgba(255,255,255,.85)'; x.font = '800 34px Nunito, Figtree, Arial, sans-serif'; x.textAlign = 'center'; x.fillText('Polo Inovale · eventos', 256, 130);
    return tex(c);
  }
  /* painel azul INOVALE dos balcões de "Acesso às salas" */
  function painelAzul(){
    var c = canvas(512, 256), x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#2756c9'); g.addColorStop(1, '#0d2f86');
    x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    x.fillStyle = '#ffffff'; x.font = '800 92px Nunito, Figtree, Arial, sans-serif'; x.textBaseline = 'middle'; x.fillText('INOVALE', 70, 128);
    x.fillStyle = '#f26a21'; x.beginPath(); x.moveTo(60, 70); x.lineTo(92, 82); x.lineTo(60, 94); x.closePath(); x.fill();
    return tex(c);
  }


  /* ---------- artes das portas e placas do hall (fotos C03, C07, C10, C11, C12, C18, C20) ---------- */
  function txt(x, t, X, Y, font, cor, al){ x.font = font; x.fillStyle = cor; x.textAlign = al || 'left'; x.textBaseline = 'middle'; x.fillText(t, X, Y); }
  function tri(x, X, Y, s, cor, dir){ x.fillStyle = cor; x.beginPath(); x.moveTo(X - s * dir * 0.6, Y - s * 0.6); x.lineTo(X + s * dir * 0.6, Y); x.lineTo(X - s * dir * 0.6, Y + s * 0.6); x.closePath(); x.fill(); }
  /* símbolo genérico de 4 folhas verdes (identidade do ACIOC sem reproduzir o logotipo) */
  function trevo(x, X, Y, r){ [['#2d5f2e', -1, -1], ['#7aa21a', 1, -1], ['#b7d335', -1, 1], ['#4f8a2a', 1, 1]].forEach(function(f){ x.fillStyle = f[0]; x.beginPath(); x.ellipse(X + f[1] * r * 0.48, Y + f[2] * r * 0.48, r * 0.5, r * 0.36, f[1] * f[2] * 0.7, 0, Math.PI * 2); x.fill(); }); }
  function cartazIncubadas(cor){
    var c = canvas(256, 640), x = c.getContext('2d'); x.clearRect(0, 0, 256, 640);
    x.fillStyle = cor; x.fillRect(0, 0, 256, 96); txt(x, 'empresas', 128, 36, '800 30px Figtree, Arial', '#ffffff', 'center'); txt(x, 'incubadas', 128, 70, '800 30px Figtree, Arial', '#ffffff', 'center');
    for (var i = 0; i < 6; i++) { var cx = 70 + (i % 2) * 116, cy = 170 + Math.floor(i / 2) * 150;
      x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); x.arc(cx, cy, 44, Math.PI * 0.85, Math.PI * 2.15); x.lineTo(cx, cy + 78); x.closePath(); x.fill();
      x.strokeStyle = cor; x.lineWidth = 6; x.stroke(); x.fillStyle = ['#9aa7b4', '#5a6a7a', '#c0c8d0'][i % 3]; round(x, cx - 26, cy - 10, 52, 18, 6); x.fill(); }
    return tex(c);
  }
  function placaTexto(t, fundo, cor){ var c = canvas(512, 128), x = c.getContext('2d'); x.fillStyle = fundo || '#26313a'; x.fillRect(0, 0, 512, 128); txt(x, t, 256, 66, '800 46px Figtree, Arial', cor || '#ffffff', 'center'); return tex(c); }
  var ARTES = {
    /* elevador: folhas pretas com setas, "A INOVAÇÃO ABRE PORTAS" e o triângulo laranja (C04, C07) */
    elevador: function(){
      var c = canvas(256, 512), x = c.getContext('2d'); x.fillStyle = '#16181c'; x.fillRect(0, 0, 256, 512);
      x.fillStyle = '#2a2d33'; x.fillRect(126, 0, 4, 512);
      for (var i = 0; i < 4; i++) { tri(x, 22 + i * 26, 46, 22, '#f26a21', -1); tri(x, 150 + i * 26, 46, 22, '#f26a21', 1); }
      txt(x, 'A INOVAÇÃO', 12, 128, '800 30px Nunito, Arial', '#f26a21'); txt(x, 'ABRE PORTAS', 70, 160, '800 26px Nunito, Arial', '#f26a21');
      x.fillStyle = '#f26a21'; x.beginPath(); x.moveTo(20, 250); x.lineTo(236, 340); x.lineTo(20, 430); x.closePath(); x.fill();
      return tex(c);
    },
    /* escada de emergência: porta branca com bonecos laranja subindo degraus (C07) */
    emergencia: function(){
      var c = canvas(256, 512), x = c.getContext('2d'); x.fillStyle = '#f5f6f7'; x.fillRect(0, 0, 256, 512);
      x.strokeStyle = '#f26a21'; x.lineWidth = 14; x.lineJoin = 'miter'; x.beginPath(); x.moveTo(0, 470);
      for (var k = 0; k < 4; k++) { x.lineTo(60 * k + 40, 470 - 95 * k); x.lineTo(60 * k + 40, 375 - 95 * k); } x.stroke();
      [[70, 380], [150, 285], [190, 120]].forEach(function(p){ x.fillStyle = '#f26a21'; x.beginPath(); x.arc(p[0], p[1] - 70, 16, 0, Math.PI * 2); x.fill();
        x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); x.moveTo(p[0], p[1] - 50); x.lineTo(p[0] - 6, p[1]); x.lineTo(p[0] - 30, p[1] + 40); x.moveTo(p[0] - 6, p[1]); x.lineTo(p[0] + 26, p[1] + 30); x.moveTo(p[0] - 2, p[1] - 38); x.lineTo(p[0] + 30, p[1] - 20); x.moveTo(p[0] - 2, p[1] - 38); x.lineTo(p[0] - 32, p[1] - 14); x.stroke(); });
      x.fillStyle = '#2b2b2b'; x.fillRect(200, 260, 30, 12);
      return tex(c);
    },
    /* porta veneziana branca (shafts ao lado da escada e do café) */
    veneziana: function(){
      var c = canvas(128, 256), x = c.getContext('2d'); x.fillStyle = '#eef0f1'; x.fillRect(0, 0, 128, 256);
      for (var y = 16; y < 244; y += 9) { x.fillStyle = '#d4d8dc'; x.fillRect(12, y, 104, 4); x.fillStyle = '#ffffff'; x.fillRect(12, y + 4, 104, 2); }
      x.strokeStyle = '#c4c9ce'; x.lineWidth = 6; x.strokeRect(6, 6, 116, 244);
      return tex(c);
    },
    /* "ACESSO RESTRITO" (C11, C13) */
    restrito: function(){
      var c = canvas(256, 512), x = c.getContext('2d'); x.fillStyle = '#f4f5f6'; x.fillRect(0, 0, 256, 512);
      x.strokeStyle = '#2a2a2a'; x.lineWidth = 10; x.beginPath(); x.arc(128, 120, 46, 0, Math.PI * 2); x.stroke(); x.beginPath(); x.moveTo(96, 152); x.lineTo(160, 88); x.stroke();
      txt(x, 'ACESSO', 128, 215, '800 40px Nunito, Arial', '#2a2a2a', 'center'); txt(x, 'RESTRITO', 128, 255, '800 40px Nunito, Arial', '#2a2a2a', 'center');
      x.fillStyle = '#2a2a2a'; x.fillRect(196, 262, 28, 12);
      return tex(c);
    },
    /* porta de banheiro com o boneco laranja (C10) */
    banheiro: function(){
      var c = canvas(128, 256), x = c.getContext('2d'); x.fillStyle = '#f4f5f6'; x.fillRect(0, 0, 128, 256);
      x.fillStyle = '#f26a21'; x.beginPath(); x.arc(64, 56, 16, 0, Math.PI * 2); x.fill(); round(x, 46, 78, 36, 80, 14); x.fill(); x.fillRect(48, 150, 12, 70); x.fillRect(68, 150, 12, 70);
      return tex(c);
    },
    'banheiro-masculino': function(){ return ARTES.banheiro(); },
    'banheiro-feminino': function(){ return ARTES.banheiro(); },
    /* banheiro acessível visto no fim do corredor ao lado da Nexo (D05) */
    'banheiro-pcd': function(){
      var c = canvas(128, 256), x = c.getContext('2d'); x.fillStyle = '#f4f5f6'; x.fillRect(0, 0, 128, 256);
      x.fillStyle = '#f26a21'; x.beginPath(); x.arc(62, 48, 15, 0, Math.PI * 2); x.fill();
      x.strokeStyle = '#f26a21'; x.lineWidth = 13; x.lineCap = 'round'; x.beginPath(); x.moveTo(61, 70); x.lineTo(61, 126); x.lineTo(92, 126); x.stroke();
      x.lineWidth = 9; x.beginPath(); x.arc(66, 157, 38, -1.25, Math.PI * 1.55); x.stroke();
      x.beginPath(); x.moveTo(86, 127); x.lineTo(105, 178); x.stroke();
      x.fillStyle = '#2b2b2b'; x.fillRect(102, 116, 18, 9); return tex(c);
    },
    /* totem "Recepção" com o texto exato da foto C18 */
    totem: function(){
      var c = canvas(320, 1024), x = c.getContext('2d'); x.fillStyle = '#3c3f44'; x.fillRect(0, 0, 320, 1024);
      x.strokeStyle = '#f26a21'; x.lineWidth = 6; x.beginPath(); x.moveTo(40, 120); x.lineTo(70, 60); x.lineTo(100, 120); x.closePath(); x.stroke(); txt(x, 'i', 70, 98, '800 34px Nunito, Arial', '#f26a21', 'center');
      txt(x, 'Recepção', 118, 82, '700 38px Figtree, Arial', '#ffffff'); txt(x, 'reception | recepción', 120, 112, '500 16px Figtree, Arial', '#d8dade');
      var y = 180;
      function andar(t, itens){
        tri(x, 34, y, 26, '#f26a21', 1); txt(x, t, 56, y, '700 34px Figtree, Arial', '#ffffff'); x.fillStyle = '#f26a21'; x.fillRect(200, y + 2, 100, 3); y += 52;
        itens.forEach(function(i){ txt(x, i, 60, y, '500 24px Figtree, Arial', '#ffffff'); y += 36; }); y += 22;
      }
      andar('Térreo', ['Salas 1 a 3', 'Banheiros', 'Elevadores / Escada', 'Café / Restaurante']);
      andar('1º Andar', ['Incubadora', 'Administração', 'Copa / Banheiros', 'Coworking']);
      andar('2º Andar', ['Salas 201 a 205', 'Copa / Banheiros', 'Elevadores/Escada']);
      andar('3º andar - Ático', ['Auditórios', 'Salas de Reuniões 1 a 3', 'Copa / Banheiros']);
      return tex(c);
    },
    /* letreiro "Pin · Café e Restaurante" (C20) */
    pin: function(){
      var c = canvas(512, 200), x = c.getContext('2d'); x.fillStyle = '#1b1c1f'; x.fillRect(0, 0, 512, 200);
      x.strokeStyle = '#ffffff'; x.lineWidth = 5; x.beginPath(); x.moveTo(40, 70); x.lineTo(40, 120); x.quadraticCurveTo(40, 140, 70, 140); x.lineTo(110, 140); x.quadraticCurveTo(140, 140, 140, 120); x.lineTo(140, 70); x.closePath(); x.stroke();
      x.beginPath(); x.arc(150, 100, 16, -Math.PI / 2, Math.PI / 2); x.stroke(); x.beginPath(); x.moveTo(70, 55); x.quadraticCurveTo(80, 40, 70, 25); x.moveTo(100, 55); x.quadraticCurveTo(110, 40, 100, 25); x.stroke();
      txt(x, 'Pin', 300, 70, '800 74px Nunito, Arial', '#f26a21', 'center'); x.fillStyle = '#ffffff'; x.fillRect(200, 118, 260, 3);
      txt(x, 'Café e Restaurante', 330, 152, '600 34px Figtree, Arial', '#ffffff', 'center');
      return tex(c);
    },
    /* placa-seta "COFFEE" (C20) */
    coffee: function(){
      var c = canvas(256, 96), x = c.getContext('2d'); x.fillStyle = '#e8eef2'; x.beginPath(); x.moveTo(8, 12); x.lineTo(200, 12); x.lineTo(248, 48); x.lineTo(200, 84); x.lineTo(8, 84); x.closePath(); x.fill();
      x.strokeStyle = '#5b7a90'; x.lineWidth = 4; x.stroke(); txt(x, 'COFFEE', 110, 50, '800 38px Georgia, serif', '#3f5f78', 'center');
      return tex(c);
    },
    /* placa escura "Acesso às salas 1, 2 e 3" (C12, C15) */
    salas: function(){
      var c = canvas(512, 96), x = c.getContext('2d'); x.fillStyle = '#26282c'; x.fillRect(0, 0, 512, 96); tri(x, 26, 48, 22, '#f26a21', 1);
      txt(x, 'Acesso às salas 1, 2 e 3', 54, 40, '700 34px Figtree, Arial', '#ffffff'); txt(x, 'Access to rooms 1, 2 and 3 | Acceso a las oficinas 1, 2 y 3', 56, 76, '500 15px Figtree, Arial', '#c9ccd1');
      return tex(c);
    },
    saida: function(){ var c = canvas(256, 96), x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, 256, 96); x.fillStyle = '#d7262e'; x.fillRect(6, 6, 244, 84); txt(x, 'SAÍDA', 128, 50, '800 52px Nunito, Arial', '#ffffff', 'center'); return tex(c); },
    /* "Em caso de incêndio não use o elevador" (C06, C07) */
    incendio: function(){
      var c = canvas(384, 160), x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, 384, 160); x.strokeStyle = '#999'; x.lineWidth = 3; x.strokeRect(2, 2, 380, 156);
      x.strokeStyle = '#d7262e'; x.lineWidth = 12; x.beginPath(); x.arc(80, 80, 52, 0, Math.PI * 2); x.stroke(); x.beginPath(); x.moveTo(44, 116); x.lineTo(116, 44); x.stroke();
      ['EM CASO DE', 'INCÊNDIO', 'NÃO USE', 'O ELEVADOR'].forEach(function(t, i){ txt(x, t, 150, 34 + i * 31, '800 26px Figtree, Arial', '#222'); });
      return tex(c);
    },
    /* faixa adesiva da sala Nexo (C12, C16): fundo escuro com o nome */
    nexo: function(){ var c = canvas(512, 64), x = c.getContext('2d'); x.fillStyle = 'rgba(40,44,52,.88)'; x.fillRect(0, 0, 512, 64); txt(x, 'nexo', 140, 33, '600 34px Figtree, Arial', '#ffffff', 'center'); txt(x, 'nexo', 420, 33, '600 34px Figtree, Arial', '#ffffff', 'center'); return tex(c); },
    administrativo: function(){ return placaTexto('ADMINISTRATIVO', '#f4f6f7', '#29343c'); },
    acioc: function(){ return placaTexto('ACIOC HUB', '#26313a', '#d8ee39'); },
    incubadora: function(){ return placaTexto('INCUBADORA JOAÇABA', '#edf2f3', '#238c86'); },
    /* vidro do coworking sobre o café: grafismo verde genérico (os logos de terceiros ficam de fora) */
    coworking: function(){
      var c = canvas(512, 256), x = c.getContext('2d'); x.fillStyle = 'rgba(235,242,236,.55)'; x.fillRect(0, 0, 512, 256);
      x.fillStyle = 'rgba(205,230,40,.92)'; round(x, 250, 170, 250, 60, 26); x.fill();
      x.fillStyle = '#1f6b3a'; for (var i = 0; i < 4; i++) { x.beginPath(); x.arc(70 + (i % 2) * 34, 70 + Math.floor(i / 2) * 34, 18, 0, Math.PI * 2); x.fill(); }
      txt(x, 'coworking', 300, 80, '700 40px Figtree, Arial', '#7aa21a', 'center'); return tex(c);
    },
    /* ---------- 1º andar (E06–E45, X46, X47) ---------- */
    /* vidro jateado contínuo (salas fechadas do corredor) */
    jateado: function(){ var c = canvas(64, 256), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(236,244,248,.72)'); g.addColorStop(1, 'rgba(222,234,240,.86)'); x.fillStyle = g; x.fillRect(0, 0, 64, 256); return tex(c); },
    /* porta adesivada do Administrativo (E07, E08, E21): textos legíveis nas fotos */
    'porta-administrativo': function(){
      var c = canvas(256, 512), x = c.getContext('2d'); x.fillStyle = '#f6f7f8'; x.fillRect(0, 0, 256, 512);
      [[230, 40, 70, '#2a63c9'], [250, 100, 46, '#f26a21'], [20, 470, 60, '#2a63c9'], [240, 490, 52, '#f26a21'], [200, 455, 36, '#9a5bd6']].forEach(function(b){ x.fillStyle = b[3]; x.beginPath(); x.arc(b[0], b[1], b[2], 0, Math.PI * 2); x.fill(); });
      x.strokeStyle = '#4a74c4'; x.lineWidth = 4; [[44, 150], [60, 140], [76, 150]].forEach(function(q){ x.beginPath(); x.arc(q[0], q[1], 8, 0, Math.PI * 2); x.stroke(); });
      txt(x, 'Administrativo', 30, 186, '800 27px Figtree, Arial', '#2b3640'); x.fillStyle = '#f26a21'; x.fillRect(30, 204, 120, 4); x.fillStyle = '#2a63c9'; x.fillRect(150, 204, 50, 4);
      ['Organização', 'que impulsiona', 'grandes ideias.'].forEach(function(t, i){ txt(x, t, 30, 250 + i * 22, '500 18px Figtree, Arial', '#55606a'); });
      txt(x, 'PESSOAS • PROCESSOS', 30, 340, '700 13px Figtree, Arial', '#55606a'); txt(x, 'RESULTADOS REAIS', 30, 358, '700 13px Figtree, Arial', '#55606a');
      txt(x, 'INOVALE', 30, 410, '800 20px Nunito, Arial', '#4b4f55');
      x.fillStyle = '#2b2b2b'; x.fillRect(18, 262, 8, 34);
      return tex(c);
    },
    /* porta preta "INCUBADORA JOAÇABA" (E31, E32, E36, X47) */
    'porta-incubadora': function(){
      var c = canvas(256, 512), x = c.getContext('2d'); x.fillStyle = '#17191d'; x.fillRect(0, 0, 256, 512);
      txt(x, 'INCUBADORA', 128, 72, '800 32px Figtree, Arial', '#ffffff', 'center'); txt(x, 'JOAÇABA', 128, 108, '800 32px Figtree, Arial', '#ffffff', 'center');
      x.strokeStyle = '#1f5fd1'; x.lineWidth = 16; x.beginPath(); x.arc(128, 280, 50, 0, Math.PI * 2); x.stroke();
      [[64, 200, 12, '#e8d21d'], [196, 196, 22, '#2fae4a'], [58, 300, 10, '#1f5fd1'], [128, 400, 26, '#2fae4a'], [210, 300, 9, '#e8d21d']].forEach(function(b){ x.fillStyle = b[3]; x.beginPath(); x.arc(b[0], b[1], b[2], 0, Math.PI * 2); x.fill(); });
      x.fillStyle = '#9aa3ad'; x.fillRect(214, 250, 10, 50);
      return tex(c);
    },
    /* cartazes "empresas incubadas" no vidro da Incubadora: gotas com marcas (genéricas: só formas e cores) */
    'incubadas-verde': function(){ return cartazIncubadas('#2f9a4b'); },
    'incubadas-azul': function(){ return cartazIncubadas('#1f62c9'); },
    /* quadro "Jornada do empreendedor" junto à porta da Incubadora (E36): linha do tempo genérica */
    jornada: function(){
      var c = canvas(512, 256), x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, 512, 256);
      x.fillStyle = '#1f4fa8'; x.fillRect(0, 0, 512, 46); txt(x, 'Jornada do empreendedor', 18, 24, '700 24px Figtree, Arial', '#ffffff');
      for (var i = 0; i < 6; i++) { x.fillStyle = ['#2fae4a', '#1f62c9', '#e8d21d', '#f26a21', '#2fae4a', '#1f62c9'][i]; x.beginPath(); x.arc(46 + i * 84, 96, 13, 0, Math.PI * 2); x.fill(); x.fillStyle = '#c9d2dc'; x.fillRect(30 + i * 84, 124, 64, 8); x.fillRect(30 + i * 84, 140, 48, 8); }
      x.strokeStyle = '#9fb3c8'; x.lineWidth = 4; x.beginPath(); x.moveTo(46, 96); x.lineTo(466, 96); x.stroke();
      x.fillStyle = '#e9eef3'; x.fillRect(18, 170, 476, 70); return tex(c);
    },
    /* banner de chão da Incubadora em frente ao Administrativo (E06, E07): texto legível */
    'banner-ideia': function(){
      var c = canvas(256, 640), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, '#1d3f8f'); g.addColorStop(1, '#0f2252'); x.fillStyle = g; x.fillRect(0, 0, 256, 640);
      txt(x, 'Qual é', 24, 210, '700 34px Figtree, Arial', '#ffffff'); txt(x, 'a sua', 24, 248, '700 34px Figtree, Arial', '#ffffff');
      txt(x, 'IDEIA', 120, 248, '900 34px Figtree, Arial', '#f6a21e'); txt(x, 'de', 24, 288, '700 34px Figtree, Arial', '#ffffff'); txt(x, 'NEGÓCIO?', 70, 288, '900 34px Figtree, Arial', '#f6a21e');
      x.strokeStyle = '#ffffff'; x.lineWidth = 4; x.beginPath(); x.arc(70, 430, 22, 0, Math.PI * 2); x.stroke();
      txt(x, 'INCUBADORA', 104, 422, '800 18px Figtree, Arial', '#ffffff'); txt(x, 'JOAÇABA', 104, 444, '800 18px Figtree, Arial', '#ffffff');
      return tex(c);
    },
    /* porta branca com círculos concêntricos (E08): a marca da empresa não é legível, então só o grafismo */
    'porta-circulos': function(){
      var c = canvas(256, 512), x = c.getContext('2d'); x.fillStyle = '#f5f6f7'; x.fillRect(0, 0, 256, 512);
      x.strokeStyle = '#2b2d31'; x.lineWidth = 5; [40, 70, 100].forEach(function(r){ x.beginPath(); x.arc(128, 256, r, 0, Math.PI * 2); x.stroke(); });
      x.fillStyle = '#2b2d31'; x.fillRect(206, 250, 26, 10); return tex(c);
    },
    /* vidro da frente do ACIOC Hub, voltado para o vazio do hall (X46, E15, E16) */
    'acioc-vidro': function(){
      var c = canvas(2048, 512), x = c.getContext('2d'); x.clearRect(0, 0, 2048, 512);
      x.fillStyle = 'rgba(232,240,236,.32)'; x.fillRect(0, 0, 2048, 512);
      x.fillStyle = 'rgba(196,224,40,.95)'; round(x, 1040, 400, 960, 70, 30); x.fill();
      for (var i = 0; i < 5; i++) { x.fillStyle = 'rgba(255,255,255,.85)'; round(x, 1110 + i * 175, 414, 130, 42, 10); x.fill(); }
      trevo(x, 1180, 200, 70);
      txt(x, 'coworking', 1360, 120, '700 64px Figtree, Arial', '#7aa21a'); txt(x, 'ACIOC HUB', 1360, 235, '900 132px Figtree, Arial', '#2d5f2e');
      for (i = 0; i < 4; i++) { x.fillStyle = 'rgba(70,90,80,.55)'; round(x, 120 + i * 200, 360, 160, 52, 10); x.fill(); }
      return tex(c);
    },
    /* parede escura logo atrás da porta do ACIOC Hub, com TV (E12, E13, E14) */
    'acioc-totem': function(){
      var c = canvas(512, 640), x = c.getContext('2d'); x.fillStyle = '#3a3e43'; x.fillRect(0, 0, 512, 640);
      x.fillStyle = 'rgba(255,255,255,.05)'; for (var k = 0; k < 6; k++) x.fillRect(0, k * 107, 512, 2);
      trevo(x, 120, 120, 52); txt(x, 'coworking', 200, 72, '700 34px Figtree, Arial', '#b7d335'); txt(x, 'ACIOC', 200, 122, '900 62px Figtree, Arial', '#ffffff'); txt(x, 'HUB', 200, 176, '900 62px Figtree, Arial', '#ffffff');
      txt(x, 'ASSOCIAÇÃO COMERCIAL E INDUSTRIAL', 256, 476, '700 20px Figtree, Arial', '#e8ece9', 'center'); txt(x, 'DO OESTE CATARINENSE', 256, 500, '700 20px Figtree, Arial', '#e8ece9', 'center');
      for (k = 0; k < 3; k++) { x.fillStyle = 'rgba(255,255,255,.22)'; round(x, 60 + k * 140, 560, 110, 40, 8); x.fill(); }
      return tex(c);
    },
    /* parede branca interna do ACIOC com o logotipo grande e placas de parceiros genéricas (E16) */
    'acioc-parede': function(){
      var c = canvas(1024, 512), x = c.getContext('2d'); x.fillStyle = '#f1f2f0'; x.fillRect(0, 0, 1024, 512);
      trevo(x, 150, 130, 70); txt(x, 'coworking', 270, 70, '700 40px Figtree, Arial', '#b7d335'); txt(x, 'ACIOC', 270, 150, '900 120px Figtree, Arial', '#2d5f2e');
      for (var k = 0; k < 6; k++) { x.fillStyle = k % 2 ? '#d6dbd7' : '#cdd5cf'; round(x, 90 + (k % 3) * 290, 280 + Math.floor(k / 3) * 100, 230, 70, 12); x.fill(); }
      return tex(c);
    },
    /* faixa na borda da laje, acima do café e do núcleo (X46): texto legível */
    'rede-centros': function(){ var c = canvas(1024, 128), x = c.getContext('2d'); x.clearRect(0, 0, 1024, 128); txt(x, 'REDE CATARINENSE DE', 20, 36, '700 34px Figtree, Arial', '#3b3d40'); txt(x, 'CENTROS DE INOVAÇÃO', 20, 90, '900 50px Figtree, Arial', '#3b3d40'); return tex(c); },
    /* placa laranja no vidro da sala da coordenação administrativa (E23, E27) */
    'inovale-adm': function(){ var c = canvas(512, 96), x = c.getContext('2d'); x.fillStyle = '#f26a21'; x.fillRect(0, 0, 512, 96); txt(x, 'INOVALE', 24, 50, '800 40px Nunito, Arial', '#ffffff'); x.fillStyle = '#ffffff'; x.fillRect(214, 22, 3, 52); txt(x, 'ADMINISTRATIVO', 232, 50, '700 30px Figtree, Arial', '#ffffff'); return tex(c); },
    /* porta branca lisa (sala do servidor, E08) */
    'porta-lisa': function(){ var c = canvas(128, 256), x = c.getContext('2d'); x.fillStyle = '#f3f4f5'; x.fillRect(0, 0, 128, 256); x.strokeStyle = '#d5d9dd'; x.lineWidth = 5; x.strokeRect(5, 5, 118, 246); x.fillStyle = '#9aa3ad'; x.fillRect(100, 124, 16, 6); return tex(c); },
    /* sinalização institucional genérica */
    podcast: function(){ var c = canvas(512, 144), x = c.getContext('2d'); x.fillStyle = '#2a2d31'; x.fillRect(0, 0, 512, 144); x.strokeStyle = '#f26a21'; x.lineWidth = 7; [18, 32, 46].forEach(function(r){ x.beginPath(); x.arc(70, 72, r, -0.9, 0.9); x.stroke(); }); txt(x, 'Podcast', 300, 74, '800 62px Figtree, Arial', '#ffffff', 'center'); return tex(c); },
    'no-ar': function(){ var c = canvas(256, 96), x = c.getContext('2d'); x.clearRect(0, 0, 256, 96); txt(x, 'NO AR', 128, 50, '900 54px Figtree, Arial', '#ffffff', 'center'); return tex(c); },
    projetos: function(){ return placaTexto('Sala de projetos', '#2a2d31', '#ffffff'); },
    'escada-emergencia': function(){ var c = canvas(512, 128), x = c.getContext('2d'); x.fillStyle = '#1d8a3c'; x.fillRect(0, 0, 512, 128); txt(x, 'ESCADA DE EMERGÊNCIA', 256, 66, '800 40px Figtree, Arial', '#ffffff', 'center'); return tex(c); },
    'sala-incubacao': function(){ return placaTexto('Sala de incubação', '#2a2d31', '#ffffff'); },
    n101: function(){ return placaTexto('101', '#2a2d31', '#ffffff'); },
    n102: function(){ return placaTexto('102', '#2a2d31', '#ffffff'); },
    n103: function(){ return placaTexto('103', '#2a2d31', '#ffffff'); },
    /* lombadas de livros coloridos (estante da recepção) */
    livros: function(){
      var c = canvas(256, 256), x = c.getContext('2d'), cs = ['#c0392b', '#2e86c1', '#f1c40f', '#27ae60', '#8e44ad', '#e67e22', '#34495e', '#16a085'];
      x.fillStyle = '#f2f2f0'; x.fillRect(0, 0, 256, 256);
      for (var r = 0; r < 4; r++) { var X = 6; for (var k = 0; X < 250; k++) { var w = 10 + ((k * 7 + r * 3) % 9); x.fillStyle = cs[(k + r * 3) % cs.length]; x.fillRect(X, r * 64 + 10, w - 2, 50); X += w; } x.fillStyle = '#d0d0cc'; x.fillRect(0, r * 64 + 60, 256, 4); }
      return tex(c);
    },
    /* produtos coloridos (estante da cafeteria e freezer) */
    produtos: function(){
      var c = canvas(256, 256), x = c.getContext('2d'), cs = ['#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#9b59b6', '#ecf0f1', '#e67e22'];
      x.fillStyle = '#c9b18d'; x.fillRect(0, 0, 256, 256);
      for (var r = 0; r < 4; r++) for (var k = 0; k < 9; k++) { x.fillStyle = cs[(k * 3 + r) % cs.length]; x.fillRect(8 + k * 27, r * 64 + 22 + (k % 3) * 4, 20, 36 - (k % 3) * 4); }
      return tex(c);
    },
    /* geladeira de bebidas (vermelha, porta de vidro com garrafas) — sem marca */
    geladeira: function(){
      var c = canvas(128, 384), x = c.getContext('2d'); x.fillStyle = '#c8202a'; x.fillRect(0, 0, 128, 384);
      x.fillStyle = '#d9eef6'; x.fillRect(12, 40, 104, 320);
      for (var r = 0; r < 5; r++) for (var k = 0; k < 6; k++) { x.fillStyle = ['#8b1a1a', '#2c7a3a', '#c0c0c0', '#f1c40f'][(k + r) % 4]; x.fillRect(18 + k * 16, 52 + r * 62, 10, 44); }
      return tex(c);
    },
    /* quadro de vidro na parede (C06): leve reflexo */
    vidroQuadro: function(){ var c = canvas(64, 64), x = c.getContext('2d'); var g = x.createLinearGradient(0, 0, 64, 64); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(0.5, 'rgba(220,240,240,.12)'); g.addColorStop(1, 'rgba(255,255,255,.3)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(c); }
  };
  function arte(nome){ return ARTES[nome](); }

  O.formas = { arte: arte, ARTES: ARTES, caixa: caixa, cilindro: cilindro, tubo: tubo, sombra: sombra, bolha: bolha, mesclar: mesclar, madeira: madeira, faixaFosca: faixaFosca,
    logoInovale: logoInovale, inspire: inspire, patrocinadores: patrocinadores, telaLed: telaLed, painelAzul: painelAzul, piso: piso, forro: forro, pelicula: pelicula, tela: tela, ceu: ceu };
})(window.Orvalho);
