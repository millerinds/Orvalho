/* Móveis empurráveis (ex.: almofadões/puffs do 3º andar): física dinâmica simplificada no plano do piso, sem biblioteca.
   Cada móvel é um corpo rígido leve apoiado no chão (y = 0, sem quicar nem voar), descrito por 1–3 círculos ao longo do
   eixo maior da pegada. O boneco empurra ao andar contra ele; há atrito com o piso (desaceleração constante),
   amortecimento, rotação quando o empurrão é fora do centro, colisão entre os móveis e com paredes, pilares e demais
   móveis (os colisores estáticos da sala, via colisao.resolver). Os círculos ficam registrados na colisão da sala,
   então o boneco continua barrado por eles: ele avança porque o móvel cede à frente dele.
   Ligado por sala.js nos itens com "dinamico: true". */
(function(O){
  var ATRITO = 3.2,        // desaceleração do atrito com o piso (m/s²): um empurrão para em ~0,3 m
      AMORT = 2.4,         // amortecimento viscoso (1/s)
      ATRITO_GIRO = 4.0, AMORT_GIRO = 4.5,
      CEDE = 0.82,         // o móvel acompanha 82% da velocidade de quem empurra (massa baixa, mas não nula)
      PEGA = 16,           // rapidez com que o empurrão vence a inércia (1/s)
      RESTITUICAO = 0.12,  // choque com parede/outro móvel: quase sem quique
      VMAX = 2.6, WMAX = 2.5;

  function circulosDaPegada(w, d){
    var r = Math.min(w, d) / 2, L = Math.max(w, d), out = [], meio = L / 2 - r;
    if (meio < 0.04) return [{ lx: 0, lz: 0, r: r }];
    var n = meio > r ? 3 : 2;
    for (var i = 0; i < n; i++) { var s = -meio + i * (2 * meio / (n - 1)); out.push(w >= d ? { lx: s, lz: 0, r: r } : { lx: 0, lz: s, r: r }); }
    return out;
  }

  O.fisicaMoveis = {
    circulosDaPegada: circulosDaPegada,
    /* corpos: [{ x, z, rot, w, d, g (Object3D), cols: [colisor círculo da sala por círculo] }] */
    criar: function(corpos, col){
      corpos.forEach(function(c){
        c.vx = c.vz = c.w0 = 0; c.amassa = 0;
        c.inercia = (c.w * c.w + c.d * c.d) / 12;
        c.circ.forEach(function(k, i){ k.col = c.cols[i]; });
      });
      function centro(c, k){ var cs = Math.cos(c.rot), sn = Math.sin(c.rot), rx = k.lx * cs + k.lz * sn, rz = -k.lx * sn + k.lz * cs; return { x: c.x + rx, z: c.z + rz, rx: rx, rz: rz }; }
      function liga(on){ corpos.forEach(function(c){ c.circ.forEach(function(k){ k.col.off = !on; }); }); }
      function sincroniza(c){ c.circ.forEach(function(k){ var p = centro(c, k); k.col.x = p.x; k.col.z = p.z; }); }

      function empurraoDoJogador(c, jog, dt){
        if (!jog || Math.abs(jog.y || 0) > 0.5 || (jog.jy || 0) > 0.3) return;   // pulando por cima, não empurra
        var rj = jog.raio || 0.33;
        c.circ.forEach(function(k){
          var p = centro(c, k), dx = p.x - jog.x, dz = p.z - jog.z, d = Math.hypot(dx, dz);
          if (d > rj + k.r + 0.05 || d < 1e-5) return;
          var nx = dx / d, nz = dz / d, vn = (jog.vx || 0) * nx + (jog.vz || 0) * nz;
          if (vn <= 0.05) return;
          /* velocidade do ponto de contato do móvel ao longo da normal (linear + giro) */
          var qx = p.rx - nx * k.r, qz = p.rz - nz * k.r, vp = (c.vx + c.w0 * qz) * nx + (c.vz - c.w0 * qx) * nz;
          var alvo = vn * CEDE; if (vp >= alvo) return;
          var dv = (alvo - vp) * Math.min(1, dt * PEGA), ix = dv * nx, iz = dv * nz;
          c.vx += ix; c.vz += iz;
          c.w0 += 0.55 * (qz * ix - qx * iz) / (c.inercia + 0.05);   // empurrão fora do centro: o móvel gira
          c.amassa = Math.min(1, c.amassa + dv * 0.8);
        });
      }

      function entreMoveis(){
        for (var a = 0; a < corpos.length; a++) for (var b = a + 1; b < corpos.length; b++) {
          var A = corpos[a], B = corpos[b];
          if (Math.hypot(A.x - B.x, A.z - B.z) > (A.w + A.d + B.w + B.d) / 2) continue;
          A.circ.forEach(function(ka){ B.circ.forEach(function(kb){
            var pa = centro(A, ka), pb = centro(B, kb), dx = pb.x - pa.x, dz = pb.z - pa.z, d = Math.hypot(dx, dz), ov = ka.r + kb.r - d;
            if (ov <= 0) return;
            if (d < 1e-5) { dx = 1; dz = 0; d = 1; }
            var nx = dx / d, nz = dz / d;
            A.x -= nx * ov / 2; A.z -= nz * ov / 2; B.x += nx * ov / 2; B.z += nz * ov / 2;
            var vr = (B.vx - A.vx) * nx + (B.vz - A.vz) * nz;
            if (vr < 0) { var j = -(1 + RESTITUICAO) * vr / 2; A.vx -= j * nx; A.vz -= j * nz; B.vx += j * nx; B.vz += j * nz; A.w0 *= 0.85; B.w0 *= 0.85; }
          }); });
        }
      }

      /* paredes, pilares, portas e móveis fixos: cada círculo sai do que estiver invadindo; a correção vira translação
         (e um pouco de giro) e a velocidade contra a superfície é cancelada */
      function contraASala(c){
        for (var it = 0; it < 3; it++) {
          var mexeu = false;
          c.circ.forEach(function(k){
            var p = centro(c, k), q = { x: p.x, z: p.z };
            if (!col.resolver(q, k.r, 0)) return;
            var dx = q.x - p.x, dz = q.z - p.z, L = Math.hypot(dx, dz); if (L < 1e-6) return;
            c.x += dx; c.z += dz; mexeu = true;
            c.rot += 0.35 * (dx * p.rz - dz * p.rx) / (p.rx * p.rx + p.rz * p.rz + 0.08);
            var nx = dx / L, nz = dz / L, vn = c.vx * nx + c.vz * nz;
            if (vn < 0) { c.vx -= (1 + RESTITUICAO) * vn * nx; c.vz -= (1 + RESTITUICAO) * vn * nz; }
            c.w0 *= 0.7;
          });
          if (!mexeu) break;
        }
      }

      function integra(c, dt){
        var v = Math.hypot(c.vx, c.vz);
        if (v > VMAX) { c.vx *= VMAX / v; c.vz *= VMAX / v; v = VMAX; }
        if (v > 0) { var nv = Math.max(0, v - ATRITO * dt) * Math.exp(-AMORT * dt); c.vx *= nv / v; c.vz *= nv / v; }
        var w = Math.abs(c.w0);
        if (w > 0) { var nw = Math.min(WMAX, Math.max(0, w - ATRITO_GIRO * dt) * Math.exp(-AMORT_GIRO * dt)); c.w0 = c.w0 > 0 ? nw : -nw; }
        c.x += c.vx * dt; c.z += c.vz * dt; c.rot += c.w0 * dt;
      }

      return {
        corpos: corpos,
        passo: function(dt, jog){
          dt = Math.min(0.05, Math.max(0, dt)); if (!dt) return;
          var n = 2, h = dt / n;
          for (var s = 0; s < n; s++) {
            corpos.forEach(function(c){ empurraoDoJogador(c, jog, h); integra(c, h); });
            entreMoveis();
            liga(false); corpos.forEach(contraASala); liga(true);
          }
          corpos.forEach(function(c){
            sincroniza(c);
            c.amassa *= Math.exp(-dt * 6);
            var sq = Math.sin(performance.now() * 0.018) * 0.035 * c.amassa;   // gelatina: leve balanço ao ser empurrado
            c.g.position.set(c.x, 0, c.z); c.g.rotation.y = c.rot; c.g.scale.set(1 + sq, 1 - sq * 1.4, 1 + sq);
          });
        },
        estado: function(){ return corpos.map(function(c){ return { id: c.id, x: +c.x.toFixed(3), z: +c.z.toFixed(3), rot: +c.rot.toFixed(3), v: +Math.hypot(c.vx, c.vz).toFixed(3) }; }); }
      };
    }
  };
})(window.Orvalho);
