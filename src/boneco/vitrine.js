/* Vitrine: o palco pequeno do boneco (avatar da moldura e palco do provador).
   É o antigo Doll(canvas, o) do avatar-kit, com a mesma API (set/start/stop/wave/spinTo/hover),
   agora montado sobre O.criarBoneco(): o boneco é o mesmo do jogo, só muda quem desenha. */
(function(O){
  var clamp = O.clamp;

  O.Doll = function(canvas, o){
    if (!window.THREE) return null;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(25, 1, 0.1, 50);
    camera.position.fromArray(o.cam); camera.lookAt(o.target[0], o.target[1], o.target[2]);
    scene.environment = O.estudio(renderer);
    var key = new THREE.DirectionalLight(0xffffff, 0.5); key.position.set(-2, 3.5, 4); scene.add(key);

    var still = O.still;
    var doll = O.criarBoneco({ sombra: !!o.floor, swayK: o.drag ? 0.5 : 1 });
    scene.add(doll.root);
    var clock = new THREE.Clock(), running = false, raf = 0;

    /* no avatar pequeno, abre espaço para o que fica alto na cabeça */
    function fit(){
      if (!o.fit) return;
      var ex = doll.tall();
      camera.position.set(o.cam[0], o.cam[1] + ex * 0.45, o.cam[2] * (1 + ex * 0.32));
      camera.lookAt(o.target[0], o.target[1] + ex * 0.45, o.target[2]);
    }
    function render(){ renderer.render(scene, camera); }
    function set(c, instant){
      doll.set(c, instant); fit();
      if (still || !running) render();
    }

    function size(){
      var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      render();
    }
    if (window.ResizeObserver) new ResizeObserver(size).observe(canvas);

    /* olhar e braços seguem o mouse (em pixels até a cabeça, como no kit) */
    var tmp = new THREE.Vector3();
    function toScreen(obj, r){
      obj.getWorldPosition(tmp).project(camera);
      return { x: r.left + (tmp.x + 1) / 2 * r.width, y: r.top + (1 - tmp.y) / 2 * r.height };
    }
    function onMove(e){
      if (!running || (e.pointerType && e.pointerType !== 'mouse')) return;
      var r = canvas.getBoundingClientRect(), hp = toScreen(doll.head, r), reach = o.reach || 260;
      doll.olhar((e.clientX - hp.x) / reach, -(e.clientY - hp.y) / reach);
      if (o.raiseBox && e.clientY < o.raiseBox.getBoundingClientRect().top) {
        var br = o.raiseBox.getBoundingClientRect(), cx = br.left + br.width / 2, dx = e.clientX - cx, both = Math.abs(dx) < br.width * 0.5;
        var sR = toScreen(doll.armR, r), sL = toScreen(doll.armL, r);
        var aR = Math.atan2(e.clientX - sR.x, -(sR.y - e.clientY)), aL = Math.atan2(e.clientX - sL.x, -(sL.y - e.clientY));
        doll.erguer((both || dx < 0) ? 1 : 0, (both || dx > 0) ? 1 : 0,
          aL > 0 ? -3.05 : clamp(aL, -3.05, -1.3), aR < 0 ? 3.05 : clamp(aR, 1.3, 3.05));
      } else doll.erguer(0, 0);
    }
    function leave(){ doll.soltarOlhar(); }
    function onOut(e){ if (!e.relatedTarget) leave(); }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onOut);
    window.addEventListener('blur', leave);

    var spinT = 0;
    if (o.drag) {
      var dragX = null;
      o.drag.addEventListener('pointerdown', function(e){ dragX = e.clientX; o.drag.setPointerCapture(e.pointerId); });
      o.drag.addEventListener('pointermove', function(e){
        if (dragX === null) return;
        spinT += (e.clientX - dragX) * 0.012; dragX = e.clientX;
        if (o.onSpin) o.onSpin(spinT);
        doll.spinTo(spinT); if (still) render();
      });
      o.drag.addEventListener('pointerup', function(){ dragX = null; });
      o.drag.addEventListener('pointercancel', function(){ dragX = null; });
    }

    function loop(){
      if (!running) return;
      var dt = Math.min(clock.getDelta(), 0.1);
      doll.update(clock.elapsedTime, dt);
      render();
      raf = requestAnimationFrame(loop);
    }
    function start(){
      if (running) return; running = true; size();
      if (still) { doll.update(0, 0); render(); } else { clock.getDelta(); raf = requestAnimationFrame(loop); }
    }
    function stop(){ running = false; cancelAnimationFrame(raf); leave(); }
    document.addEventListener('visibilitychange', function(){ if (document.hidden) { if (running) { stop(); running = 'paused'; } } else if (running === 'paused') { running = false; start(); } });

    return {
      set: set, start: start, stop: stop, wave: doll.wave,
      spinTo: function(v){ spinT = v; doll.spinTo(v); if (still) render(); },
      hover: doll.hover,
      boneco: doll
    };
  };
})(window.Orvalho);
