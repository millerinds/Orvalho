/* Interação: perto de um equipamento aparece uma bolinha de gelatina flutuando sobre ele e, quando o boneco está
   de frente e ao alcance, a bolha "E · Ver projeto". E (ou clique na bolha) abre o painel Aero com o conteúdo. */
(function(O){
  var G = O.gelatina;
  O.criarInteracao = function(o){
    var camera = o.camera, canvas = o.canvas, itens = o.itens || [], conteudo = o.conteudo || {};
    var aviso = document.getElementById('aviso'), avisoTxt = aviso.querySelector('span');
    var painel = document.getElementById('painel'), pk = document.getElementById('painel-k'), pt = document.getElementById('painel-t'),
        pd = document.getElementById('painel-demo'), pc = document.getElementById('painel-c'), px = document.getElementById('painel-x');
    var atual = null, aberto = false, lastFocus = null;

    /* marcadores: bolinhas de água-gelatina sobre cada equipamento */
    var grupo = new THREE.Group(), geo = new THREE.SphereGeometry(0.055, 24, 16), C = G.paleta(O.moveis.PAL.agua), mats = [];
    itens.forEach(function(it){
        if (it.assento || it.npc) return; // assentos e pessoas (já têm balão com o nome) não ganham marcador
      var m = G.jelly({ top: 0.02, bot: -0.055 }), mesh = new THREE.Mesh(geo, m), om = G.outline(mesh, 0.01);
      G.pintar(m, C, om); mats.push(m, om);
      mesh.position.set(it.x, it.y + 0.24, it.z); mesh.userData.it = it; it._mesh = mesh;
      grupo.add(mesh);
    });

    var tmp = new THREE.Vector3(), dir = new THREE.Vector3();
    function melhor(p, frente){
      var best = null, bd = Infinity;
      itens.forEach(function(it){
        var piso = it.piso != null ? it.piso : (it.y > 3 ? 4.2 : 0);
        if (Math.abs((p.y || 0) - piso) > 1.15) return;
        var dx = it.x - p.x, dz = it.z - p.z, d = Math.hypot(dx, dz);
        if (d > it.raio) return;
        /* com "alvo" (ex.: pessoa atrás do balcão), o alcance é medido até o ponto de atendimento e a frente, até a pessoa */
        var fx = it.alvo ? it.alvo[0] - p.x : dx, fz = it.alvo ? it.alvo[2] - p.z : dz, fd = Math.hypot(fx, fz);
        var f = fd > 0.01 ? (fx * frente.x + fz * frente.z) / fd : 1; // de frente para o equipamento?
        if (f < 0.15) return;
        var score = d - f * 0.4;
        if (score < bd) { bd = score; best = it; }
      });
      return best;
    }
    function posAviso(){
      if (!atual) return;
      if (atual.alvo) tmp.set(atual.alvo[0], atual.alvo[1] + 0.62, atual.alvo[2]).project(camera);
      else tmp.set(atual.x, atual.y + 0.42, atual.z).project(camera);
      /* fora da tela (ou atrás da câmera): a bolha fica presa na borda, do lado do equipamento, em vez de sumir */
      if (tmp.z > 1) { tmp.x = -tmp.x; tmp.y = -0.75; }
      tmp.x = Math.max(-0.88, Math.min(0.88, tmp.x)); tmp.y = Math.max(-0.75, Math.min(0.82, tmp.y));
      aviso.style.visibility = 'visible';
      var r = canvas.getBoundingClientRect();
      aviso.style.left = ((tmp.x + 1) / 2 * r.width) + 'px';
      aviso.style.top = ((1 - tmp.y) / 2 * r.height) + 'px';
    }
    function el(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
    function abrir(it){
      it = it || atual; if (!it) return;
      if (it.assento) { if (o.aoAssento) o.aoAssento(it.assento); return; } // assento: sentar em vez de abrir painel
      var c = conteudo[it.conteudo] || { titulo: it.id, texto: 'Sem conteúdo cadastrado.' };
      pk.textContent = c.kicker || ''; pt.textContent = c.titulo || ''; pd.hidden = !c.demo;
      pc.textContent = '';
      if (c.texto) pc.appendChild(el('p', null, c.texto));
      if (c.itens && c.itens.length) {
        var ul = el('ul');
        c.itens.forEach(function(row){ var li = el('li'); li.appendChild(el('b', null, row[0])); li.appendChild(el('span', null, row[1])); ul.appendChild(li); });
        pc.appendChild(ul);
      }
      if (c.fonte) pc.appendChild(el('p', 'fonte', c.fonte));
      /* ação do equipamento (definida na planta, não no texto): ex. ir para outro ambiente */
      if (it.acao) {
        var bt = el('button', 'btn leaf'); bt.type = 'button'; bt.appendChild(el('span', null, it.acao.rotulo || 'Ir'));
        bt.addEventListener('click', function(){ fechar(); if (o.aoAcao) o.aoAcao(it.acao); });
        pc.appendChild(bt);
      }
      lastFocus = document.activeElement;
      painel.classList.toggle('conversa', !!it.npc); // conversa: o diálogo desce para a base e a pessoa continua à vista
      painel.hidden = false; aviso.hidden = true; aberto = true; px.focus();
      if (o.aoAbrir) o.aoAbrir(it);
    }
    function fechar(){
      if (!aberto) return;
      painel.hidden = true; aberto = false;
      (canvas || lastFocus).focus();
      if (o.aoFechar) o.aoFechar();
    }
    px.addEventListener('click', fechar);
    painel.addEventListener('click', function(e){ if (e.target === painel) fechar(); });
    aviso.addEventListener('click', function(){ abrir(); });

    return {
      grupo: grupo,
      atualizar: function(t, p, frente){
        var novo = aberto ? atual : melhor(p, frente);
        if (novo !== atual) {
          atual = novo;
          if (atual) { avisoTxt.textContent = atual.rotulo || 'Interagir'; aviso.hidden = aberto; aviso.style.animation = 'none'; void aviso.offsetWidth; aviso.style.animation = ''; }
          else aviso.hidden = true;
        }
        /* as bolinhas flutuam; a do equipamento em foco cresce e sobe um pouco */
        itens.forEach(function(it, i){
          var m = it._mesh; if (!m) return;
          var piso = it.piso != null ? it.piso : (it.y > 3 ? 4.2 : 0), mesmoPiso = Math.abs((p.y || 0) - piso) <= 1.15;
          m.visible = mesmoPiso;
          var on = it === atual, d = Math.hypot(it.x - p.x, it.z - p.z), near = mesmoPiso && d < it.raio + 1.2;
          var s = on ? 1.5 : (near ? 1 : 0.7);
          m.scale.setScalar(m.scale.x + (s - m.scale.x) * 0.15);
          m.position.y = it.y + 0.24 + (on ? 0.06 : 0) + (O.still ? 0 : 0.03 * Math.sin(t * 2.2 + i));
        });
        if (atual && !aberto) posAviso();
        return atual;
      },
      abrir: abrir, fechar: fechar,
      aberto: function(){ return aberto; },
      /* esconde a bolha (ex.: enquanto o boneco está sentado) */
      limpar: function(){ atual = null; aviso.hidden = true; },
      atual: function(){ return atual; },
      dispose: function(){ geo.dispose(); mats.forEach(function(m){ m.dispose(); }); aviso.hidden = true; painel.hidden = true; }
    };
  };
})(window.Orvalho);
