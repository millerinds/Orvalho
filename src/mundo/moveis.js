/* Catálogo de móveis: cada tipo descreve as peças (em metros, origem no chão, frente = +z) e onde colide.
   A sala junta todos os itens do mesmo tipo e desenha cada peça com um InstancedMesh (uma chamada de desenho por peça).
   Materiais: gelatina com contorno escuro, em poucas paletas fixas (base / borda / luz interna). */
(function(O){
  var F = O.formas;
  /* paletas dos móveis, no mesmo formato das paletas do boneco */
  var PAL = {
    madeira:  ['#f3d6a8', '#9c6b34', '#fff3dc'],
    metal:    ['#e3ebf1', '#6f8698', '#ffffff'],
    cadeira:  ['#2c3a5c', '#0a1430', '#6fc4ff'],
    branco:   ['#f7fbff', '#7f98ab', '#ffffff'],
    grafite:  ['#2a313e', '#06080d', '#7fa6c8'],
    puff:     ['#1fa5d8', '#05506a', '#b4fbff'],
    inox:     ['#d5e3ea', '#7d97a6', '#ffffff'],
    vermelho: ['#ff5a4a', '#a3122a', '#ffd0c0'],
    folha:    ['#3fae22', '#0c4a3a', '#d6ff5a'],
    copa:     ['#5fd06a', '#0c5a3a', '#e2ffb0'],
    agua:     ['#19b8d0', '#05506a', '#b4fbff'],
    tronco:   ['#c9a27a', '#6b4526', '#ffe9cc'],
    vaso:     ['#f7fbff', '#5f8fb0', '#e8f8ff']
  };
  /* peças "acesas" não recebem luz nem contorno */
  var BRILHO = { tela: true, led: true };

  var M = function(x, y, z, rx, ry, rz){
    var m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0));
    return m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1));
  };
  function parte(geo, pal, esp, ms){ return { geo: geo, pal: pal, esp: esp == null ? 0.012 : esp, ms: ms }; }
  function raiais(n, r, y, rotOff){ var out = []; for (var i = 0; i < n; i++) { var a = i * Math.PI * 2 / n + (rotOff || 0); out.push(M(Math.sin(a) * r, y, Math.cos(a) * r, 0, a, 0)); } return out; }

  var TIPOS = {
    /* mesa de madeira com pé em T e rodízio: 1,60 × 0,60 × 0,75 */
    mesa: { colisao: { caixa: [1.6, 0.6] }, sombra: [2.0, 1.0], partes: function(){
      var rod = new THREE.SphereGeometry(0.03, 16, 10);
      return [
        parte(F.caixa(1.6, 0.036, 0.6, 0.015), 'madeira', 0.012, [M(0, 0.732, 0)]),
        parte(F.caixa(0.056, 0.67, 0.056, 0.024), 'metal', 0.01, [M(-0.7, 0.375, 0), M(0.7, 0.375, 0)]),
        parte(F.caixa(0.072, 0.046, 0.58, 0.021), 'metal', 0.01, [M(-0.7, 0.07, 0), M(0.7, 0.07, 0)]),
        parte(F.caixa(1.34, 0.05, 0.036, 0.016), 'metal', 0.01, [M(0, 0.66, -0.2)]),
        parte(rod, 'grafite', 0.008, [M(-0.7, 0.03, 0.26), M(-0.7, 0.03, -0.26), M(0.7, 0.03, 0.26), M(0.7, 0.03, -0.26)])
      ];
    } },
    /* cadeira de tela preta, base estrela, sem braço: Ø 0,62, assento 0,47, encosto 0,95 */
    cadeira: { colisao: { circulo: 0.36 }, sombra: [0.8, 0.8], partes: function(){
      return [
        parte(F.caixa(0.07, 0.036, 0.3, 0.016), 'grafite', 0.009, raiais(5, 0.15, 0.075)),
        parte(new THREE.SphereGeometry(0.03, 14, 10), 'grafite', 0.008, raiais(5, 0.29, 0.03)),
        parte(F.cilindro(0.028, 0.36, 0.01, 16), 'metal', 0.008, [M(0, 0.09, 0)]),
        parte(F.caixa(0.5, 0.075, 0.48, 0.035), 'cadeira', 0.014, [M(0, 0.47, 0.01)]),
        parte(F.caixa(0.06, 0.32, 0.036, 0.016), 'grafite', 0.009, [M(0, 0.62, -0.25, -0.1, 0, 0)]),
        parte(F.caixa(0.47, 0.46, 0.05, 0.024), 'cadeira', 0.014, [M(0, 0.82, -0.255, -0.12, 0, 0)])
      ];
    } },
    /* carrinho de recarga de notebooks (TES Guardian): 0,64 × 0,55 × 1,05 */
    recarga: { colisao: { caixa: [0.64, 0.55] }, sombra: [0.95, 0.85], partes: function(){
      return [
        parte(F.caixa(0.64, 0.99, 0.55, 0.045), 'branco', 0.014, [M(0, 0.535, 0)]),
        parte(F.caixa(0.2, 0.13, 0.014, 0.006), 'vermelho', 0.006, [M(-0.15, 0.86, 0.278)]),
        parte(F.caixa(0.16, 0.012, 0.012, 0.005), 'grafite', 0.004, [M(0.14, 0.64, 0.278), M(0.14, 0.68, 0.278), M(0.14, 0.72, 0.278)]),
        parte(new THREE.SphereGeometry(0.03, 14, 10), 'grafite', 0.008, [M(-0.27, 0.03, 0.22), M(0.27, 0.03, 0.22), M(-0.27, 0.03, -0.22), M(0.27, 0.03, -0.22)]),
        parte(F.caixa(0.34, 0.026, 0.24, 0.01), 'grafite', 0.006, [M(0.02, 1.044, -0.02, 0, 0.12, 0)])
      ];
    } },
    /* armário baixo de 2 portas: 0,90 × 0,45 × 0,75 */
    armario: { colisao: { caixa: [0.9, 0.45] }, sombra: [1.2, 0.75], partes: function(){
      return [
        parte(F.caixa(0.9, 0.71, 0.45, 0.03), 'branco', 0.014, [M(0, 0.395, 0)]),
        parte(F.caixa(0.84, 0.04, 0.4, 0.012), 'grafite', 0.006, [M(0, 0.02, 0)]),
        parte(F.caixa(0.008, 0.6, 0.012, 0.003), 'metal', 0.003, [M(0, 0.4, 0.226)]),
        parte(F.caixa(0.11, 0.02, 0.024, 0.009), 'metal', 0.006, [M(-0.08, 0.62, 0.234), M(0.08, 0.62, 0.234)])
      ];
    } },
    /* puff pera: Ø 0,90 × 0,65 */
    puff: { colisao: { circulo: 0.45 }, sombra: [1.25, 1.25], partes: function(){
      var g = O.gelatina.lathe([[0,0],[0.36,0],[0.44,0.06],[0.46,0.2],[0.42,0.38],[0.33,0.52],[0.2,0.62],[0.08,0.64],[0,0.62]], 48);
      return [parte(g, 'puff', 0.016, [M(0, 0, 0)])];
    } },
    /* lixeira inox de pedal: Ø 0,30 × 0,60 */
    lixeira: { colisao: { circulo: 0.17 }, sombra: [0.5, 0.5], partes: function(){
      var tampa = O.gelatina.lathe([[0,0],[0.152,0],[0.158,0.02],[0.13,0.06],[0.07,0.085],[0,0.09]], 32);
      return [
        parte(F.cilindro(0.15, 0.52, 0.03, 32), 'inox', 0.01, [M(0, 0, 0)]),
        parte(tampa, 'inox', 0.01, [M(0, 0.515, 0)]),
        parte(F.caixa(0.12, 0.022, 0.07, 0.01), 'grafite', 0.006, [M(0, 0.03, 0.15)])
      ];
    } },
    /* quadro elétrico na parede (y do item = centro), 0,40 × 0,50 */
    quadro: { partes: function(){
      return [
        parte(F.caixa(0.4, 0.5, 0.12, 0.022), 'branco', 0.01, [M(0, 0, 0)]),
        parte(F.caixa(0.2, 0.08, 0.012, 0.005), 'grafite', 0.004, [M(0, 0.12, 0.062)])
      ];
    } },
    /* ar-condicionado split no alto da parede azul (y do item = centro) */
    ar: { partes: function(){
      return [
        parte(F.caixa(0.86, 0.29, 0.22, 0.07), 'branco', 0.012, [M(0, 0, 0)]),
        parte(F.caixa(0.7, 0.02, 0.012, 0.006), 'grafite', 0.004, [M(0, -0.11, 0.105)]),
        parte(F.caixa(0.08, 0.012, 0.006, 0.003), 'led', 0, [M(0.3, 0.06, 0.111)])
      ];
    } },
    /* monitor (~0,60 × 0,40) com teclado e mouse; origem no tampo da mesa */
    monitor: { partes: function(){
      return [
        parte(F.caixa(0.24, 0.016, 0.17, 0.006), 'grafite', 0.005, [M(0, 0.008, -0.02)]),
        parte(F.caixa(0.045, 0.26, 0.03, 0.012), 'grafite', 0.006, [M(0, 0.15, -0.05)]),
        parte(F.caixa(0.62, 0.38, 0.028, 0.012), 'grafite', 0.008, [M(0, 0.33, -0.03)]),
        parte(new THREE.PlaneGeometry(0.585, 0.345), 'tela', 0, [M(0, 0.33, -0.0155)]),
        parte(F.caixa(0.42, 0.018, 0.14, 0.007), 'branco', 0.006, [M(-0.02, 0.009, 0.2)]),
        parte(F.caixa(0.06, 0.028, 0.1, 0.013), 'grafite', 0.005, [M(0.3, 0.014, 0.21)])
      ];
    } },
    /* notebook aberto (0,33 × 0,23); origem no tampo */
    notebook: { partes: function(){
      var h = M(0, 0.018, -0.11, -0.3, 0, 0);
      return [
        parte(F.caixa(0.33, 0.018, 0.23, 0.007), 'grafite', 0.005, [M(0, 0.009, 0)]),
        parte(F.caixa(0.33, 0.22, 0.01, 0.005), 'grafite', 0.005, [h.clone().multiply(M(0, 0.11, 0))]),
        parte(new THREE.PlaneGeometry(0.3, 0.19), 'tela', 0, [h.clone().multiply(M(0, 0.11, 0.0058))])
      ];
    } },
    /* gabinete de PC branco: 0,22 × 0,45 × 0,48; origem no tampo */
    gabinete: { partes: function(){
      return [
        parte(F.caixa(0.21, 0.44, 0.46, 0.02), 'branco', 0.008, [M(0, 0.22, 0)]),
        parte(F.caixa(0.012, 0.3, 0.3, 0.005), 'grafite', 0.004, [M(-0.106, 0.24, 0)]),
        parte(new THREE.SphereGeometry(0.008, 8, 6), 'led', 0, [M(0.05, 0.4, 0.232)])
      ];
    } },
    /* poste de energia: do tampo da mesa até o forro */
    poste: { partes: function(){
      return [
        parte(F.cilindro(0.032, 2.25, 0.012, 16), 'grafite', 0.008, [M(0, 0, 0)]),
        parte(F.caixa(0.08, 0.13, 0.08, 0.02), 'grafite', 0.006, [M(0, 0.2, 0)])
      ];
    } },
    /* planta (na sacada): vaso e folhas compridas, como a iúca da foto */
    planta: { partes: function(){
      var folhas = [];
      for (var i = 0; i < 11; i++) {
        var a = i * 2.39996, tilt = 0.25 + (i % 3) * 0.17;
        folhas.push(M(0, 0.42, 0, 0, a, 0).multiply(M(0, 0, 0, tilt, 0, 0)).multiply(M(0, 0.38 + (i % 2) * 0.08, 0)));
      }
      return [
        parte(F.cilindro(0.22, 0.42, 0.05, 28), 'vaso', 0.012, [M(0, 0, 0)]),
        parte(new THREE.CapsuleGeometry(0.038, 0.68, 4, 10), 'folha', 0.01, folhas)
      ];
    } },
    /* árvore Aero (lá fora): tronco e copa de bolhas */
    arvore: { partes: function(){
      return [
        parte(F.cilindro(0.18, 2.4, 0.08, 16), 'tronco', 0.03, [M(0, 0, 0)]),
        parte(new THREE.SphereGeometry(1, 32, 20), 'copa', 0.04, [M(0, 2.9, 0), M(0.75, 2.4, 0.2), M(-0.7, 2.5, -0.1), M(0.1, 3.5, -0.3)])
      ];
    } }
  };

  /* peças impressas: cada ambiente pode registrar texturas próprias (logotipo, telão...) */
  var TEXTURAS = {};
  O.moveis = { TIPOS: TIPOS, PAL: PAL, BRILHO: BRILHO, TEXTURAS: TEXTURAS, M: M, parte: parte, raiais: raiais };
})(window.Orvalho);
