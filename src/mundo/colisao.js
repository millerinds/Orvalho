/* Colisão 2D no chão (plano xz). A sala é ortogonal, então bastam caixas, círculos e segmentos (paredes).
   O boneco é um círculo do tamanho do tronco; os braços passam por baixo do tampo das mesas e encolhem quando aperta.
   Níveis: cada colisor vale numa faixa de altura do piso do boneco (y0..y1). Sem faixa, vale em todas (o Lab é todo assim).
   O térreo do hall usa [-1, 2] e o 1º andar [3, 99]: um móvel do térreo não barra quem anda no mezanino. */
(function(O){
  O.criarColisao = function(){
    var caixas = [], circulos = [], segs = [], nivelAtual = null;
    function vale(c, y){ return !c.off && (c.y0 == null || y == null || (y >= c.y0 && y <= c.y1)); }  // off: colisor desligado (ex.: porta aberta)
    function marca(c){ if (nivelAtual) { c.y0 = nivelAtual[0]; c.y1 = nivelAtual[1]; } return c; }

    function empurrar(p, qx, qz, r){
      var dx = p.x - qx, dz = p.z - qz, d = Math.hypot(dx, dz);
      if (d >= r) return false;
      if (d < 1e-6) { dx = 1; dz = 0; d = 1e-6; }
      var k = (r - d) / d; p.x += dx * k; p.z += dz * k; return true;
    }
    function pertoSeg(px, pz, s){
      var vx = s.bx - s.ax, vz = s.bz - s.az, L = vx * vx + vz * vz;
      var t = L ? Math.max(0, Math.min(1, ((px - s.ax) * vx + (pz - s.az) * vz) / L)) : 0;
      return { x: s.ax + vx * t, z: s.az + vz * t };
    }

    return {
      /* cam = true: móvel alto (recepção, arco...) que também barra a câmera */
      caixa: function(x0, z0, x1, z1, cam){ caixas.push(marca({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), cam: !!cam })); },
      /* os colisores criados entre nivel([y0, y1]) e nivel(null) valem só nessa faixa de altura */
      nivel: function(faixa){ nivelAtual = faixa; },
      circulo: function(x, z, r){ circulos.push(marca({ x: x, z: z, r: r })); },
      /* devolve o segmento: quem o criou pode ligá-lo e desligá-lo (s.off), como as portas que abrem */
      segmento: function(ax, az, bx, bz){ var s = marca({ ax: ax, az: az, bx: bx, bz: bz }); segs.push(s); return s; },

      /* empurra o ponto p {x,z} para fora de tudo (algumas passadas resolvem cantos) */
      resolver: function(p, r, y){
        var hit = false;
        for (var it = 0; it < 4; it++) {
          var moved = false, i, b;
          for (i = 0; i < caixas.length; i++) {
            b = caixas[i]; if (!vale(b, y)) continue;
            var qx = Math.max(b.x0, Math.min(b.x1, p.x)), qz = Math.max(b.z0, Math.min(b.z1, p.z));
            if (qx === p.x && qz === p.z) { // centro dentro da caixa: sai pelo lado mais perto
              var l = p.x - b.x0, rr = b.x1 - p.x, t = p.z - b.z0, bo = b.z1 - p.z, m = Math.min(l, rr, t, bo);
              if (m === l) p.x = b.x0 - r; else if (m === rr) p.x = b.x1 + r; else if (m === t) p.z = b.z0 - r; else p.z = b.z1 + r;
              moved = true;
            } else if (empurrar(p, qx, qz, r)) moved = true;
          }
          for (i = 0; i < circulos.length; i++) { b = circulos[i]; if (vale(b, y) && empurrar(p, b.x, b.z, r + b.r)) moved = true; }
          for (i = 0; i < segs.length; i++) { if (!vale(segs[i], y)) continue; var q = pertoSeg(p.x, p.z, segs[i]); if (empurrar(p, q.x, q.z, r)) moved = true; }
          hit = hit || moved;
          if (!moved) break;
        }
        return hit;
      },

      /* distância do centro até a superfície mais próxima (para o "aperto" dos braços) */
      folga: function(p, y){
        var best = Infinity, i, b;
        for (i = 0; i < caixas.length; i++) {
          b = caixas[i]; if (!vale(b, y)) continue;
          var qx = Math.max(b.x0, Math.min(b.x1, p.x)), qz = Math.max(b.z0, Math.min(b.z1, p.z));
          best = Math.min(best, Math.hypot(p.x - qx, p.z - qz));
        }
        for (i = 0; i < circulos.length; i++) { b = circulos[i]; if (vale(b, y)) best = Math.min(best, Math.hypot(p.x - b.x, p.z - b.z) - b.r); }
        for (i = 0; i < segs.length; i++) { if (!vale(segs[i], y)) continue; var q = pertoSeg(p.x, p.z, segs[i]); best = Math.min(best, Math.hypot(p.x - q.x, p.z - q.z)); }
        return best;
      },

      /* marca círculos que também barram a câmera (pilares altos; cadeira e mesa ficam abaixo da câmera) */
      bloqueiaCamera: function(x, z, r){ circulos.push({ x: x, z: z, r: r, cam: true }); },
      /* raio no chão contra as paredes e os pilares: até onde a câmera pode recuar (Infinity se não bate) */
      raio: function(ox, oz, dx, dz, y){
        var best = Infinity;
        for (var bi = 0; bi < caixas.length; bi++) { // caixas altas: interseção raio × retângulo (método das faixas), com margem
          var bx = caixas[bi]; if (!bx.cam || !vale(bx, y)) continue;
          var m = 0.15, tmin = -Infinity, tmax = Infinity, ok = true;
          [[ox, dx, bx.x0 - m, bx.x1 + m], [oz, dz, bx.z0 - m, bx.z1 + m]].forEach(function(e){
            if (Math.abs(e[1]) < 1e-9) { if (e[0] < e[2] || e[0] > e[3]) ok = false; return; }
            var t1 = (e[2] - e[0]) / e[1], t2 = (e[3] - e[0]) / e[1]; tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2));
          });
          if (ok && tmax >= tmin && tmin > 0) best = Math.min(best, tmin);
        }
        for (var c = 0; c < circulos.length; c++) {
          var cc = circulos[c]; if (!cc.cam || !vale(cc, y)) continue;
          var fx = ox - cc.x, fz = oz - cc.z, bq = fx * dx + fz * dz, cq = fx * fx + fz * fz - (cc.r + 0.15) * (cc.r + 0.15), disc = bq * bq - cq;
          if (cq > 0 && disc > 0) { var tq = -bq - Math.sqrt(disc); if (tq > 0) best = Math.min(best, tq); }
        }
        for (var i = 0; i < segs.length; i++) {
          var s = segs[i]; if (!vale(s, y)) continue; var ex = s.bx - s.ax, ez = s.bz - s.az;
          var den = dx * ez - dz * ex; if (Math.abs(den) < 1e-9) continue;
          var wx = s.ax - ox, wz = s.az - oz;
          var t = (wx * ez - wz * ex) / den, u = (wx * dz - wz * dx) / den;
          if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
        }
        return best;
      },
      contagem: function(){ return { caixas: caixas.length, circulos: circulos.length, paredes: segs.length }; }
    };
  };
})(window.Orvalho);
