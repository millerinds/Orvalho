/* Câmera em terceira pessoa: atrás do boneco, gira com o mouse (yaw/pitch), aproxima com a roda.
   Nunca atravessa parede: mede no chão até onde dá para recuar. Sem espaço atrás ela se ajeita:
   sobe um pouco (casa de bonecas), abre o campo de visão e, se a pessoa não estiver girando, escorrega
   sozinha para o lado mais livre. Também não passa do forro (nem da laje do mezanino, no hall).
   Em ambientes altos (pitchMin negativo) dá para olhar para cima: a câmera desce e o olhar sobe para o 1º andar. */
(function(O){
  var clamp = O.clamp;
  O.criarCameraTerceira = function(camera, o){
    o = o || {};
    var st = { yaw: 0, pitch: 0.42, dist: o.dist || 3.4 };
    var D_MIN = o.distMin || 2.0, D_MAX = o.distMax || 5.0, ALTURA = o.altura || 1.3, MARGEM = 0.3, FOV = 55;
    var P_MIN = -0.1, P_MAX = 1.2, OLHAR_CIMA = 0; // por ambiente: ver configurar()
    var olhar = new THREE.Vector3();
    function tetoEm(lim, x, z, y){ return lim.tetoEm ? lim.tetoEm(x, z, y) : lim.h; }
    var alvo = new THREE.Vector3(), alvoS = new THREE.Vector3(), desejo = new THREE.Vector3(), pos = new THREE.Vector3();
    var primeiro = true, aperto = 0, semGirar = 10, movendo = false;

    function recuo(col, yaw, y){ return Math.max(0.05, col.raio(alvoS.x, alvoS.z, Math.sin(yaw), Math.cos(yaw), y) - MARGEM); }
    function calcular(col, lim, dt){
      var pisoY = alvoS.y - ALTURA;
      var cp = Math.cos(st.pitch), sp = Math.sin(st.pitch);
      var hDes = st.dist * cp, vDes = st.dist * sp;
      if (st.pitch < 0) vDes = Math.max(vDes * 0.35, -0.5); // olhando para cima: a câmera desce pouco; quem sobe é o olhar
      /* assistência: andando, apertado e sem a pessoa girar → procura o lado com mais espaço */
      var hNow = recuo(col, st.yaw, pisoY);
      if (dt && movendo && hNow < hDes * 0.85 && semGirar > 0.8) {
        var hL = recuo(col, st.yaw + 0.45, pisoY), hR = recuo(col, st.yaw - 0.45, pisoY);
        if (Math.abs(hL - hR) > 0.15) st.yaw += Math.sign(hL - hR) * dt * 1.3 * (1 - hNow / hDes);
        hNow = recuo(col, st.yaw, pisoY);
      }
      var h = Math.min(hDes, hNow), falta = 1 - h / hDes;
      aperto += (falta - aperto) * (dt ? 1 - Math.exp(-dt * 6) : 1);
      var dx = Math.sin(st.yaw), dz = Math.cos(st.yaw);
      /* teto: o menor entre o do boneco, o da câmera e o do meio do caminho (forro baixo sob o mezanino) */
      var teto = Math.min(tetoEm(lim, alvoS.x, alvoS.z, pisoY), tetoEm(lim, alvoS.x + dx * h, alvoS.z + dz * h, pisoY), tetoEm(lim, alvoS.x + dx * h / 2, alvoS.z + dz * h / 2, pisoY)) - 0.2 - alvoS.y;
      var v = vDes + aperto * Math.max(0, teto - vDes) * 0.55;  // sobe só um pouco
      v = clamp(v, 0.3 - alvoS.y, teto);
      desejo.set(alvoS.x + dx * h, alvoS.y + v, alvoS.z + dz * h);
      /* trava no retângulo da sala (segurança extra além do raio contra as paredes) */
      desejo.x = clamp(desejo.x, lim.x0 + 0.15, lim.x1 - 0.15); desejo.z = clamp(desejo.z, lim.z0 + 0.15, lim.z1 - 0.15);
      /* perto demais: abre o campo de visão para não perder o entorno */
      var fov = FOV + aperto * 16;
      if (Math.abs(camera.fov - fov) > 0.05) { camera.fov = fov; camera.updateProjectionMatrix(); }
    }

    return {
      estado: st,
      girar: function(dx, dy){ st.yaw -= dx * 0.0055; st.pitch = clamp(st.pitch + dy * 0.0045, P_MIN, P_MAX); semGirar = 0; },
      /* ajustes por ambiente: o Lab usa o padrão; o hall libera olhar para cima e afastar mais */
      configurar: function(c){
        c = c || {};
        P_MIN = c.pitchMin != null ? c.pitchMin : -0.1; OLHAR_CIMA = c.olharCima || 0;
        D_MAX = c.distMax || o.distMax || 5.0; st.dist = clamp(c.dist || o.dist || 3.4, D_MIN, D_MAX); st.pitch = clamp(st.pitch, P_MIN, P_MAX);
      },
      zoom: function(d){ st.dist = clamp(st.dist * (1 + d * 0.0012), D_MIN, D_MAX); },
      /* põe a câmera direto atrás de quem olha para "rumo" */
      atras: function(rumo){ st.yaw = rumo + Math.PI; primeiro = true; },
      /* retoma a partir de onde a câmera está (ex.: depois do enquadramento de uma conversa), sem salto */
      continuarDe: function(v){ pos.copy(v); },
      restaurar: function(s){ if (!s) return; if (isFinite(s.yaw)) st.yaw = s.yaw; if (isFinite(s.pitch)) st.pitch = clamp(s.pitch, P_MIN, P_MAX); if (isFinite(s.dist)) st.dist = clamp(s.dist, D_MIN, D_MAX); primeiro = true; },
      atualizar: function(p, dt, col, lim){
        semGirar += dt;
        movendo = Math.hypot(p.vx || 0, p.vz || 0) > 0.3;
        alvo.set(p.x, (p.y || 0) + ALTURA, p.z);
        if (primeiro) alvoS.copy(alvo); else alvoS.lerp(alvo, 1 - Math.exp(-dt * 14));
        calcular(col, lim, primeiro ? 0 : dt);
        if (primeiro) { pos.copy(desejo); primeiro = false; } else pos.lerp(desejo, 1 - Math.exp(-dt * 10));
        pos.y = Math.min(pos.y, tetoEm(lim, pos.x, pos.z, alvoS.y - ALTURA) - 0.15); // a suavização nunca enfia a câmera na laje
        camera.position.copy(pos);
        /* olhando para cima (pitch negativo): o ponto de mira sobe, revelando o 1º andar */
        olhar.copy(alvoS); if (st.pitch < 0 && OLHAR_CIMA) olhar.y += -st.pitch * OLHAR_CIMA;
        camera.lookAt(olhar);
      },
      /* direção "para frente" da câmera no chão (para o WASD andar relativo a ela) */
      frente: function(out){ return out.set(-Math.sin(st.yaw), 0, -Math.cos(st.yaw)); }
    };
  };
})(window.Orvalho);
