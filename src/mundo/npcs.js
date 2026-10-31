/* NPCs reutilizáveis: usam exatamente o mesmo kit do avatar, em escala humana do jogo.
   A planta fornece identidade visual, posição, pose e texto; este módulo só cuida da representação. */
(function(O){
  var ESCALA = 1.30 / 2.15;

  function etiqueta(nome){
    var c = document.createElement('canvas'); c.width = 512; c.height = 128;
    var x = c.getContext('2d');
    x.fillStyle = 'rgba(25,35,48,.82)'; x.beginPath(); x.roundRect(18, 18, 476, 92, 42); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 5; x.stroke();
    x.font = '800 54px Figtree, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(nome, 256, 65);
    var tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding;
    var mt = new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false });
    /* coordenadas locais do kit (2,15 u de altura); acima da cabeça, sem atravessar os olhos. */
    var sp = new THREE.Sprite(mt); sp.scale.set(1.5, 0.375, 1); sp.position.y = 2.62;
    return { sprite: sp, textura: tx, material: mt };
  }

  O.criarNPCs = function(defs){
    var grupo = new THREE.Group(), lista = [];
    (defs || []).forEach(function(d, i){
      var b = O.criarBoneco({ sombra: true, passo: 0.95 * ESCALA });
      b.set({ shape: d.shape || 'circulo', color: d.cor || 'agua', eyes: d.olhos || 'feliz', body: d.corpo || 'jujuba',
        arms: d.bracos || 'normal', blink: true, acc: d.acessorio || 'nenhum', accColor: d.corAcessorio || 'sol' }, true);
      b.root.scale.setScalar(ESCALA); b.root.position.set(d.x, d.y || 0, d.z); b.root.rotation.y = d.rot || 0;
      if (d.sentada) { b.sentar(true); b.root.position.y += d.alturaAssento || 0.39; }
      var et = etiqueta(d.nome); b.root.add(et.sprite);
      if (d.tatuagem) {
        var sh = new THREE.Shape();
        sh.moveTo(0, 0.07); sh.bezierCurveTo(-0.12, 0.17, -0.19, 0.01, 0, -0.14); sh.bezierCurveTo(0.19, 0.01, 0.12, 0.17, 0, 0.07);
        var mt = new THREE.MeshBasicMaterial({ color: 0x7f4ca5, side: THREE.DoubleSide });
        var tattoo = new THREE.Mesh(new THREE.ShapeGeometry(sh), mt); tattoo.scale.setScalar(0.65); tattoo.position.set(0, -0.16, 0.115); tattoo.rotation.x = -0.35;
        b.armR.add(tattoo); et.tatuagem = tattoo;
      }
      grupo.add(b.root); lista.push({ boneco: b, def: d, etiqueta: et, fase: i * 1.7 });
    });
    return {
      grupo: grupo,
      atualizar: function(t, dt, cam){
        lista.forEach(function(n){
          var b = n.boneco, d = n.def;
          b.andar(0, 0); b.update(t + n.fase, dt || 0.016);
          if (cam) {
            var dist = cam.distanceTo(b.root.position);
            n.etiqueta.sprite.material.opacity = Math.max(0, Math.min(1, (10 - dist) / 2));
            n.etiqueta.sprite.visible = dist < 10;
          }
          if (d.acena && Math.sin(t * 0.42 + n.fase) > 0.985) b.wave(1000);
        });
      },
      dispose: function(){ lista.forEach(function(n){ n.etiqueta.textura.dispose(); n.etiqueta.material.dispose(); n.boneco.dispose(); }); }
    };
  };
})(window.Orvalho);
