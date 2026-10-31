/* Estúdio para os reflexos: cúpula cinza + softboxes redondas (o mesmo do avatar-kit).
   A gelatina depende dele; a sala usa o mesmo, um pouco mais quente, para móvel e boneco brilharem igual. */
(function(O){
  O.estudio = function(renderer, o){
    o = o || {};
    var env = new THREE.Scene();
    var g = new THREE.SphereGeometry(10, 48, 24), pos = g.attributes.position, cols = [];
    var top = o.quente ? new THREE.Color(0.9, 0.88, 0.84) : new THREE.Color(0.85, 0.87, 0.9), mid = new THREE.Color(0.3, 0.32, 0.35), bot = new THREE.Color(0.06, 0.07, 0.08);
    for (var i = 0; i < pos.count; i++) {
      var y = pos.getY(i) / 10, c = y > 0 ? mid.clone().lerp(top, Math.pow(y, 0.8)) : mid.clone().lerp(bot, Math.pow(-y, 0.7));
      cols.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    env.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    function panel(w, h, x, y, z, k){
      var p = new THREE.Mesh(new THREE.CircleGeometry(0.5, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }));
      p.scale.set(w, h, 1); p.position.set(x, y, z); p.lookAt(0, 0, 0); env.add(p);
    }
    panel(5, 3.4, -4, 5, 5, 5); panel(1.3, 1.3, 4.7, 5.6, -3.2, 12); panel(7, 4, 0, 9, 0.5, 1.8);
    panel(1.4, 6, 6.5, 0.5, 2.5, 2.2); panel(6, 1.4, 0, 4.5, -6.5, 3);
    var pm = new THREE.PMREMGenerator(renderer);
    var tex = pm.fromScene(env, 0.02).texture;
    pm.dispose();
    env.traverse(function(m){ if (m.isMesh) { m.geometry.dispose(); m.material.dispose(); } });
    return tex;
  };
})(window.Orvalho);
