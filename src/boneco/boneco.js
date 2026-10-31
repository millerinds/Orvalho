/* Boneco 3D (cabeça flutuando, corpo de jujuba, braços soltos): a mesma modelagem, gelatina, acessórios e animações do avatar-kit,
   mas sem renderer, câmera nem listeners. Quem desenha é o palco: a vitrine (avatar e provador) ou o jogo.

   Estrutura: root (lugar, direção e escala: quem mexe é o mundo) → fig (o boneco se anima por dentro dele).
   API: set(cfg, instant) · update(t, dt) · olhar(tx, ty) / soltarOlhar() · olharPara(v3) · erguer(...) · acenar(ms) · girarPara(v)
        andar(velocidade, curva) · apertar(0..1) · tall() · dispose() */
(function(O){
  var P = O.paleta, G = O.gelatina, BODIES = P.BODIES, ACC = P.ACC, EYES = P.EYES, PRESETS = P.PRESETS, FIXED = P.FIXED;
  var clamp = O.clamp;
  /* lerp por quadro do kit (calibrado a 60 fps), corrigido para qualquer taxa de quadros */
  function k60(k, dt){ return 1 - Math.pow(1 - k, dt * 60); }

  O.criarBoneco = function(o){
    o = o || {};
    var still = o.still != null ? o.still : O.still;
    var mats = [], outlines = [];
    function jelly(p){ var m = G.jelly(p); mats.push(m); return m; }
    function outline(mesh, thick){ outlines.push(G.outline(mesh, thick)); }
    var lathe = G.lathe;

    var root = new THREE.Group(); root.name = 'boneco';
    var fig = new THREE.Group(); root.add(fig);
    var torso = new THREE.Mesh(lathe(BODIES.jujuba.pts, 72), jelly({ top: 0.7, bot: 0.05 }));
    torso.scale.z = 0.85; fig.add(torso); outline(torso, 0.035);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 48), jelly({ top: 0.12, bot: -0.48, arc: 1, eyes: true }));
    fig.add(head); outline(head, 0.035);
    var ARM_PTS = [[0,-0.86],[0.11,-0.845],[0.175,-0.8],[0.2,-0.72],[0.198,-0.56],[0.182,-0.4],[0.162,-0.24],[0.14,-0.12],[0.11,-0.045],[0.065,-0.01],[0,0]];
    function armGeoFor(kind){
      if (kind === 'curto') return lathe(ARM_PTS.map(function(p){ return [p[0] * 1.08, p[1] * 0.5]; }), 48);
      if (kind === 'bolinha') { var g = new THREE.SphereGeometry(0.165, 40, 28); g.translate(0, -0.3, 0); return g; }
      return lathe(ARM_PTS, 48);
    }
    /* braços curto e bolinha flutuam soltos, afastados do corpo; o curto inclina para dentro */
    var ARM_POSE = { normal: { rest: 0.36, dx: 0, dy: 0 }, curto: { rest: -0.14, dx: 0.17, dy: -0.12 }, bolinha: { rest: 0, dx: 0.2, dy: -0.05 } };
    var REST = 0.36, AP = ARM_POSE.normal, armMeshes = [], armKind = 'normal', armGeo0 = armGeoFor('normal');
    function arm(side){
      var pivot = new THREE.Group();
      var a = new THREE.Mesh(armGeo0, jelly({ top: -0.3, bot: -0.86 }));
      a.scale.z = 0.88; pivot.add(a); outline(a, 0.035); fig.add(pivot); armMeshes.push(a);
      return pivot;
    }
    function setArms(kind){
      if (kind === armKind) return false;
      armKind = kind; AP = ARM_POSE[kind]; REST = AP.rest;
      var g = armGeoFor(kind), old = armMeshes[0].geometry;
      armMeshes.forEach(function(a){
        a.geometry = g; a.children[0].geometry = g;
        var u = a.material.userData.u; u.uTop.value = kind === 'normal' ? -0.3 : kind === 'curto' ? -0.15 : -0.25; u.uBot.value = kind === 'normal' ? -0.86 : kind === 'curto' ? -0.43 : -0.47;
      });
      old.dispose(); return true;
    }
    var armL = arm(-1), armR = arm(1);
    /* sombra no chão: fica no root (não pula junto com o boneco) */
    if (o.sombra) {
      var sc = document.createElement('canvas'); sc.width = sc.height = 128;
      var sx = sc.getContext('2d'), gr = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(20,30,45,.45)'); gr.addColorStop(1, 'rgba(20,30,45,0)');
      sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
      var shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; shadow.renderOrder = -1; root.add(shadow);
    }

    var B = BODIES.jujuba, bodyName = 'jujuba';
    function setBody(name){
      if (name === bodyName) return;
      bodyName = name; B = BODIES[name];
      var g = lathe(B.pts, 72), old = torso.geometry;
      torso.geometry = g; torso.children[0].geometry = g; old.dispose();
    }

    /* ---------- acessórios: um por vez, na cor escolhida; peças fixas (lente, pompom...) têm cor própria ---------- */
    var accGroup = null, accName = 'nenhum', accBody = '';
    var V3 = function(x, y, z){ return new THREE.Vector3(x, y, z); };
    function piece(geo, fixed, thick){
      geo.computeBoundingBox();
      var bb = geo.boundingBox, m = jelly({ top: bb.max.y - (bb.max.y - bb.min.y) * 0.35, bot: bb.min.y });
      m.userData.acc = fixed || true;
      var mesh = new THREE.Mesh(geo, m);
      outline(mesh, thick == null ? 0.022 : thick);
      mesh.children[0].material.userData.acc = fixed || true;
      return mesh;
    }
    function rAt(y){ // raio do torso na altura y
      var p = B.pts;
      for (var i = 1; i < p.length; i++) if (p[i][1] >= y) { var a = p[i - 1], b = p[i], k = (y - a[1]) / ((b[1] - a[1]) || 1); return a[0] + (b[0] - a[0]) * k; }
      return 0;
    }
    function bow(sc){
      var b = new THREE.Group();
      [-1, 1].forEach(function(s){
        var lobe = piece(lathe([[0,0],[0.06,0.02],[0.1,0.08],[0.115,0.14],[0.095,0.195],[0.05,0.222],[0,0.228]], 24));
        lobe.scale.set(1, 1, 0.55); lobe.rotation.z = -s * 1.3; lobe.position.x = s * 0.02; b.add(lobe);
      });
      var knot = piece(new THREE.SphereGeometry(0.062, 20, 14)); knot.scale.set(1, 1.1, 0.85); b.add(knot);
      b.scale.setScalar(sc); return b;
    }
    function along(mesh, a, b){ // cilindro do ponto a ao b
      var d = b.clone().sub(a); mesh.position.copy(a).add(b).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); return mesh;
    }
    var BUILD = {
      fone: function(g){
        g.add(piece(new THREE.TorusGeometry(0.555, 0.045, 16, 64, Math.PI)));
        [-1, 1].forEach(function(s){
          var cup = piece(lathe([[0,-0.1],[0.14,-0.095],[0.18,-0.06],[0.19,0],[0.18,0.06],[0.14,0.095],[0,0.1]], 40));
          cup.rotation.z = Math.PI / 2; cup.position.set(s * 0.54, -0.02, 0); g.add(cup);
        });
      },
      orelhas: function(g){
        [-1, 1].forEach(function(s){
          var e = new THREE.Group();
          var out = piece(lathe([[0,0],[0.16,0],[0.168,0.06],[0.14,0.16],[0.09,0.245],[0.035,0.29],[0,0.297]], 32)); out.scale.z = 0.5; e.add(out);
          var inn = piece(lathe([[0,0],[0.09,0],[0.092,0.05],[0.072,0.13],[0.04,0.19],[0,0.205]], 24), 'rosa', 0.012);
          inn.scale.z = 0.3; inn.position.set(0, 0.03, 0.055); e.add(inn);
          e.position.set(s * 0.27, 0.36, -0.03); e.rotation.z = -s * 0.55; g.add(e);
        });
      },
      antena: function(g){
        var ants = [];
        [-1, 1].forEach(function(s){
          var a = new THREE.Group();
          var stalk = piece(new THREE.CylinderGeometry(0.022, 0.028, 0.34, 12), null, 0.015); stalk.position.y = 0.17; a.add(stalk);
          var ball = piece(new THREE.SphereGeometry(0.085, 24, 16)); ball.position.y = 0.37; a.add(ball);
          a.position.set(s * 0.16, 0.44, 0); a.userData.s = s; g.add(a); ants.push(a);
        });
        g.userData.anim = function(t){ ants.forEach(function(a, i){ a.rotation.z = -a.userData.s * 0.4 + 0.1 * Math.sin(t * 3 + i * 1.7); }); };
      },
      obra: function(g){
        var dome = piece(new THREE.SphereGeometry(0.54, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2)); dome.position.y = 0.06; g.add(dome);
        var brim = piece(lathe([[0.42,-0.026],[0.62,-0.022],[0.67,0],[0.62,0.022],[0.42,0.026]], 48)); brim.position.set(0, 0.07, 0.05); brim.scale.z = 1.08; g.add(brim);
        var ridge = piece(new THREE.TorusGeometry(0.54, 0.042, 10, 40, Math.PI)); ridge.rotation.y = Math.PI / 2; ridge.position.y = 0.06; g.add(ridge);
      },
      oculos: function(g){
        [-1, 1].forEach(function(s){
          var L = new THREE.Group();
          var lens = piece(lathe([[0,-0.02],[0.14,-0.018],[0.152,0],[0.14,0.018],[0,0.02]], 32), 'preto', 0.01); lens.rotation.x = Math.PI / 2; L.add(lens);
          L.add(piece(new THREE.TorusGeometry(0.152, 0.026, 10, 40), null, 0.014));
          L.scale.set(1.3, 1.1, 1); L.position.set(s * 0.215, -0.04, 0.535); L.rotation.y = s * 0.38; g.add(L);
          /* haste: sai da ponta de fora do aro e contorna a cabeça até a orelha */
          L.updateMatrix();
          var p0 = V3(s * 0.152, 0, 0).applyMatrix4(L.matrix), a0 = Math.atan2(Math.abs(p0.x), p0.z), r0 = Math.hypot(p0.x, p0.z), pts = [];
          for (var k = 0; k <= 8; k++) {
            var u = k / 8, a = a0 + (1.75 - a0) * u, r = r0 + (0.53 - r0) * (1 - (1 - u) * (1 - u));
            pts.push(V3(s * r * Math.sin(a), p0.y + 0.015 * u, r * Math.cos(a)));
          }
          g.add(piece(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.02, 10, false), null, 0.012));
          var tip = piece(new THREE.SphereGeometry(0.026, 12, 10), null, 0.012); tip.position.copy(pts[8]); g.add(tip);
        });
        var br = piece(new THREE.TorusGeometry(0.05, 0.02, 8, 16, Math.PI), null, 0.012); br.position.set(0, -0.02, 0.575); g.add(br);
      },
      flor: function(g){
        var f = new THREE.Group();
        for (var i = 0; i < 5; i++) {
          var a = i * Math.PI * 2 / 5 + 0.3, p = piece(new THREE.SphereGeometry(0.085, 20, 14));
          p.scale.set(1, 1, 0.45); p.position.set(Math.cos(a) * 0.092, Math.sin(a) * 0.092, 0); f.add(p);
        }
        var c = piece(new THREE.SphereGeometry(0.055, 20, 14), 'amarelo'); c.scale.z = 0.7; c.position.z = 0.03; f.add(c);
        var n = V3(0.56, 0.6, 0.57).normalize();
        f.position.copy(n).multiplyScalar(0.53); f.quaternion.setFromUnitVectors(V3(0, 0, 1), n); f.scale.setScalar(1.55); g.add(f);
      },
      tiara: function(g){
        var arco = piece(new THREE.TorusGeometry(0.54, 0.035, 12, 56, Math.PI), null, 0.014);
        arco.position.y = 0.08; g.add(arco);
        [-1, 1].forEach(function(s){
          var ponta = piece(new THREE.SphereGeometry(0.055, 16, 12), null, 0.012);
          ponta.position.set(s * 0.53, 0.02, 0); g.add(ponta);
        });
        [[-.24,.28],[0,.38],[.24,.28]].forEach(function(p){ var gema=piece(new THREE.SphereGeometry(0.055,16,12),'branco',0.01); gema.position.set(p[0],p[1],0.04); g.add(gema); });
      },
      laco: function(g){ var b = bow(1.75); b.position.set(0, 0.5, 0.08); b.rotation.x = -0.3; g.add(b); },
      cone: function(g){
        var c = new THREE.Group(), cut = [0.06, 0.19, 0.26, 0.37, 0.44, 0.59];
        function r(h){ return 0.22 - (h - 0.06) * (0.18 / 0.53); }
        c.add(piece(lathe([[0,0],[0.3,0],[0.315,0.025],[0.3,0.05],[0.22,0.06],[0,0.06]], 40)));
        for (var i = 0; i < cut.length - 1; i++) {
          var h0 = cut[i], h1 = cut[i + 1], top = i === cut.length - 2;
          var pts = [[r(h0), h0], [r((h0 + h1) / 2), (h0 + h1) / 2], [r(h1), h1]];
          if (top) pts = [[r(h0), h0], [0.05, h1 - 0.03], [0.025, h1 - 0.005], [0, h1]];
          c.add(piece(new THREE.LatheGeometry(pts.map(function(p){ return new THREE.Vector2(p[0], p[1]); }), 40), i % 2 ? 'branco' : null, 0.018));
        }
        c.position.set(0.03, 0.36, 0); c.rotation.z = -0.16; c.scale.setScalar(1.25); g.add(c);
      },
      bone: function(g){
        var dp = [[0,0],[0.55,0],[0.56,0.02]];
        for (var i = 1; i <= 10; i++) { var a = i / 10 * Math.PI / 2; dp.push([0.56 * Math.cos(a), 0.02 + 0.52 * Math.sin(a)]); }
        dp[dp.length - 1][0] = 0;
        var dome = piece(new THREE.LatheGeometry(dp.map(function(q){ return new THREE.Vector2(q[0], q[1]); }), 48)); dome.position.y = 0.1; g.add(dome);
        var band = piece(lathe([[0.53,-0.035],[0.575,-0.03],[0.585,0],[0.575,0.03],[0.53,0.035]], 48)); band.position.y = 0.12; g.add(band);
        /* aba reta: meia-elipse achatada, saindo para trás e levemente levantada */
        var sh = new THREE.Shape(); sh.moveTo(-0.4, 0); sh.lineTo(0.4, 0); sh.absellipse(0, 0, 0.4, 0.62, 0, Math.PI, false);
        var visor = piece(new THREE.ExtrudeGeometry(sh, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 }), null, 0.016);
        visor.rotation.x = -Math.PI / 2;
        var vg = new THREE.Group(); vg.add(visor); vg.position.set(0, 0.13, -0.4); vg.rotation.x = 0.28; g.add(vg);
        var btn = piece(new THREE.SphereGeometry(0.05, 16, 12)); btn.position.y = 0.66; g.add(btn);
      },
      exclama: function(g){
        var e = new THREE.Group();
        e.add(piece(lathe([[0,-0.1],[0.035,-0.095],[0.05,-0.05],[0.066,0.1],[0.06,0.145],[0.03,0.168],[0,0.172]], 24)));
        var dot = piece(new THREE.SphereGeometry(0.055, 20, 14)); dot.position.y = -0.2; e.add(dot);
        e.position.set(0.44, 0.78, 0.05); e.rotation.z = -0.25; g.add(e);
      },
      pergunta: function(g){
        var q = new THREE.Group();
        var pts = [[-0.1,0.08],[-0.08,0.155],[0,0.19],[0.085,0.155],[0.095,0.075],[0.035,0.015],[0,-0.035],[0,-0.09]].map(function(p){ return V3(p[0], p[1], 0); });
        q.add(piece(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.038, 12, false)));
        [pts[0], pts[pts.length - 1]].forEach(function(p){ var cap = piece(new THREE.SphereGeometry(0.038, 14, 10)); cap.position.copy(p); q.add(cap); });
        var dot = piece(new THREE.SphereGeometry(0.052, 20, 14)); dot.position.y = -0.2; q.add(dot);
        q.position.set(0.44, 0.8, 0.05); q.rotation.z = -0.25; g.add(q);
      },
      aureola: function(g){
        var h = piece(new THREE.TorusGeometry(0.28, 0.04, 16, 48)); h.rotation.x = Math.PI / 2 - 0.3; h.position.set(0, 0.8, -0.02); g.add(h);
      },
      natal: function(g){
        var geo = lathe([[0,0],[0.47,0],[0.43,0.12],[0.33,0.3],[0.2,0.46],[0.09,0.58],[0,0.64]], 40), pos = geo.attributes.position;
        for (var i = 0; i < pos.count; i++) {
          var y = pos.getY(i); if (y > 0.2) { var t = y - 0.2; pos.setX(i, pos.getX(i) + t * t * 1.7); pos.setY(i, y - t * t * 0.55); }
        }
        geo.computeVertexNormals();
        var hat = piece(geo); hat.position.y = 0.2; hat.rotation.z = -0.08; g.add(hat);
        var pom = piece(new THREE.SphereGeometry(0.09, 20, 14), 'branco'); pom.position.set(0.33, 0.53, 0); hat.add(pom);
        var trim = piece(lathe([[0.43,-0.07],[0.51,-0.065],[0.55,0],[0.51,0.065],[0.43,0.07]], 40), 'branco'); trim.position.y = 0.21; g.add(trim);
      },
      mago: function(g){
        var brim = piece(lathe([[0,-0.016],[0.72,-0.014],[0.78,-0.004],[0.79,0.006],[0.74,0.016],[0,0.018]], 56)); brim.position.y = 0.2; g.add(brim);
        var geo = lathe([[0,0],[0.45,0],[0.4,0.15],[0.31,0.35],[0.21,0.55],[0.11,0.76],[0.04,0.92],[0,0.97]], 48), pos = geo.attributes.position;
        for (var i = 0; i < pos.count; i++) {
          var y = pos.getY(i); if (y > 0.45) { var t = y - 0.45; pos.setX(i, pos.getX(i) + t * t * 1.1); pos.setY(i, y - t * t * 0.25); }
        }
        geo.computeVertexNormals();
        var cone = piece(geo); cone.position.y = 0.21; g.add(cone);
        var band = piece(lathe([[0.4,-0.045],[0.445,-0.04],[0.455,0],[0.435,0.04],[0.39,0.045]], 48), 'amarelo', 0.014); band.position.y = 0.3; g.add(band);
        var sh = new THREE.Shape();
        for (var k = 0; k < 10; k++) { var a = Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 0.032 : 0.075; sh[k ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
        [[0.47, 0.42, 1], [-0.55, 0.62, 0.7]].forEach(function(st){
          var star = piece(new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1 }), 'amarelo', 0.01);
          var h = st[1], rr = 0.45 * (1 - h / 0.97) + 0.02, sg = new THREE.Group();
          sg.add(star); sg.rotation.order = 'YXZ'; sg.rotation.y = st[0]; sg.rotation.x = -0.42;
          sg.position.set(Math.sin(st[0]) * rr, 0.21 + h, Math.cos(st[0]) * rr); sg.scale.setScalar(st[2]); g.add(sg);
        });
        g.rotation.z = -0.06;
      },
      monoculo: function(g){
        var n = V3(0.3, -0.05, 0.95).normalize(), m = new THREE.Group();
        m.position.copy(n).multiplyScalar(0.535); m.quaternion.setFromUnitVectors(V3(0, 0, 1), n);
        m.add(piece(new THREE.TorusGeometry(0.17, 0.026, 12, 48), null, 0.014));
        /* lente meio transparente: material próprio, não muda de cor */
        var glass = new THREE.MeshPhysicalMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.28, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false });
        var lens = new THREE.Mesh(lathe([[0,-0.012],[0.16,-0.008],[0.168,0],[0.16,0.008],[0,0.012]], 40), glass);
        lens.rotation.x = Math.PI / 2; m.add(lens); g.add(m);
        /* correntinha pendurada até o lado da cabeça */
        var a = V3(0.17 * 0.7, -0.17 * 0.7, 0).applyQuaternion(m.quaternion).add(m.position);
        var chain = new THREE.CatmullRomCurve3([a, V3(0.36, -0.36, 0.42), V3(0.47, -0.42, 0.22), V3(0.5, -0.28, 0.06)]);
        g.add(piece(new THREE.TubeGeometry(chain, 40, 0.008, 6, false), null, 0.006));
      },
      gravata: function(g){
        var topY = B.pts[B.pts.length - 1][1], y0 = topY - 0.13, y1 = y0 - 0.52;
        var z0 = rAt(y0) * 0.85, z1 = rAt(y1) * 0.85, t = new THREE.Group();
        var sh = new THREE.Shape();
        sh.moveTo(-0.045, 0); sh.lineTo(0.045, 0); sh.lineTo(0.08, -0.42); sh.lineTo(0, -0.53); sh.lineTo(-0.08, -0.42); sh.closePath();
        var blade = piece(new THREE.ExtrudeGeometry(sh, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 }), null, 0.016);
        blade.position.y = -0.04; t.add(blade);
        var knot = piece(new THREE.SphereGeometry(0.065, 20, 14)); knot.scale.set(1.1, 0.95, 0.7); t.add(knot);
        t.scale.set(1.45, 1.2, 1); t.position.set(0, y0, z0 + 0.05); t.rotation.x = -Math.atan2(z1 - z0, y0 - y1) * 0.8; g.add(t);
      },
      borboleta: function(g){
        var topY = B.pts[B.pts.length - 1][1], y0 = topY - 0.13;
        var b = bow(0.95); b.position.set(0, y0, rAt(y0) * 0.85 + 0.1); g.add(b);
      }
    };
    function setAcc(name, force){
      var onBody = ACC[name] && ACC[name].body;
      if (name === accName && !force && !(onBody && accBody !== bodyName)) return false;
      if (accGroup) {
        accGroup.parent.remove(accGroup);
        accGroup.traverse(function(o){
          if (!o.isMesh) return;
          var mi = mats.indexOf(o.material), oi = outlines.indexOf(o.material);
          if (mi >= 0) mats.splice(mi, 1); if (oi >= 0) outlines.splice(oi, 1);
          o.material.dispose(); if (o.geometry !== head.geometry) o.geometry.dispose();
        });
        accGroup = null;
      }
      accName = name; accBody = bodyName;
      if (BUILD[name]) { accGroup = new THREE.Group(); BUILD[name](accGroup); (onBody ? fig : head).add(accGroup); }
      return true;
    }

    function preset(n){ return G.paleta(PRESETS[n] || FIXED[n]); }
    var cfg = null, tgt, cur, accTgt, accCur, pop = 0, fixedPal = {};
    Object.keys(FIXED).forEach(function(k){ fixedPal[k] = preset(k); });
    function pal(a){ return !a ? cur : (a === true ? accCur : fixedPal[a]); }
    function apply(){
      mats.forEach(function(m){
        var u = m.userData.u, C = pal(m.userData.acc);
        m.color.copy(C.base); u.uRim.value.copy(C.rim); u.uGlow.value.copy(C.glow); u.uEye.value.copy(C.eye);
        if (m.userData.hasEyes) { u.uEyes.value = cfg.eyes === 'nenhum' ? 0 : 1; u.uEyeType.value = EYES[cfg.eyes][1]; }
      });
      outlines.forEach(function(om){ om.color.copy(pal(om.userData.acc).line); });
    }
    var tNow = 0;
    function set(c, instant){
      var bodyChanged = cfg && c.body !== cfg.body, eyesChanged = cfg && c.eyes !== cfg.eyes;
      cfg = O.avatar.copy(c); tgt = preset(c.color);
      if (!cur || instant) cur = preset(c.color);
      accTgt = preset(c.accColor);
      if (!accCur || instant) accCur = preset(c.accColor);
      setBody(c.body);
      if (setArms(c.arms || 'normal') && cfg && !instant) pop = Math.max(pop, 0.7);
      var accChanged = setAcc(c.acc);
      if (bodyChanged && !instant) pop = 1; else if (accChanged && cfg && !instant) pop = Math.max(pop, 0.5);
      if (eyesChanged && !instant && cfg.blink) blinkAt = tNow;
      if (!cfg.blink) { blinkAt = -1; setBlink(1); }
      apply(); pose(tNow);
    }

    /* olhar, braços e giro */
    var wave = 0, waveTarget = 0, waveTimer = null, nextBlink = 2.5, blinkAt = -1;
    var mouseIn = false, lk = 0, look = { x: 0, y: 0, tx: 0, ty: 0 };
    var raiseL = 0, raiseR = 0, raiseLT = 0, raiseRT = 0, angL = -2.9, angR = 2.9;
    var spin = 0, spinT = 0, swayK = o.swayK || 1;
    /* andar: w = quanto ele está andando (0 parado … 1 andando, até ~1,5 correndo); ph = fase dos pulinhos */
    var w = 0, wT = 0, ph = 0, speed = 0, curva = 0, curvaS = 0, aperto = 0, apertoT = 0, idleFrom = 0;
    var sit = 0, sitT = 0; // sentado: 0 em pé … 1 sentado (pose de descanso, sem pernas)
    var STRIDE = o.passo || 0.95; // metros por pulinho, no espaço do mundo (quem escala o boneco ajusta junto)
    function doWave(ms){ waveTarget = 1; clearTimeout(waveTimer); waveTimer = setTimeout(function(){ waveTarget = 0; }, ms || 1600); }
    function setBlink(v){ mats.forEach(function(m){ if (m.userData.hasEyes) m.userData.u.uBlink.value = v; }); }

    function pose(t){
      var hp = (t % 9) / 0.7, hop = (t > 1 && hp < 1 && !still && t - idleFrom > 1.5) ? Math.sin(Math.PI * hp) : 0;
      var s = still ? 0 : 1, iw = 1 - Math.min(w, 1); // iw: o quanto o idle ainda vale
      hop *= iw * (1 - sit);
      /* andar sem pernas: pulinhos de gelatina, achata ao tocar o chão, estica no ar, inclina para a frente */
      var hw = Math.abs(Math.sin(ph)), land = Math.pow(1 - hw, 4);
      fig.position.y = 0.08 * hop + 0.11 * hw * w;
      fig.rotation.x = 0.13 * Math.min(w, 1.3) - 0.14 * sit; // sentado: recosta um pouco
      fig.rotation.z = -clamp(curvaS, -1, 1) * 0.12 * Math.min(w, 1);
      fig.rotation.y = (0.28 * Math.sin(t * 0.33) * s * (1 - lk) * iw + look.x * 0.18 * lk) * swayK + spin;
      var sq = 0.09 * pop * Math.sin(t * 22) + (0.08 * land - 0.035 * hw) * Math.min(w, 1);
      fig.scale.set((1 + sq * 0.8) * (1 + 0.05 * sit), (1 - sq) * (1 - 0.07 * sit), (1 + sq * 0.8) * (1 + 0.05 * sit)); // gelatina acomodada no assento
      if (accGroup) {
        if (ACC[accName].float) accGroup.position.y = 0.035 * Math.sin(t * 2.2) * s;
        if (accGroup.userData.anim) accGroup.userData.anim(t * s);
      }
      var f = Math.sin(t * 1.6) * s;
      torso.position.y = 0.012 * Math.sin(t * 1.6 - 0.8) * s;
      torso.scale.set((1 + 0.008 * f) * (1 - 0.05 * aperto), 1 + 0.012 * f, 0.85 * (1 + 0.008 * f));
      /* a cabeça vem um tiquinho atrasada no pulo e compensa a inclinação para continuar olhando em frente */
      head.position.y = B.headY + (0.035 * Math.sin(t * 1.6 + 0.4)) * s + 0.04 * hop + 0.05 * Math.abs(Math.sin(ph - 0.5)) * w;
      head.rotation.set(
        (-0.04 + 0.05 * Math.sin(t * 0.8 + 1.3) * s) * (1 - lk) + (-0.04 - look.y * 0.28) * lk - 0.1 * Math.min(w, 1.3),
        0.22 * Math.sin(t * 0.45 + 0.6) * s * (1 - lk) * iw + look.x * 0.42 * lk,
        0.07 * Math.sin(t * 0.6) * s * (1 - lk) + look.x * 0.05 * lk);
      mats.forEach(function(m){ if (m.userData.hasEyes) { m.userData.u.uLook.value.set(look.x * lk, look.y * lk); m.userData.u.uTime.value = t; } });
      var fl = AP.dx ? 0.05 : 0.03; // soltos flutuam um pouco mais
      var ax = B.armX * (1 - 0.16 * aperto) + AP.dx * (1 - 0.6 * aperto); // apertado: os braços encostam no corpo, como gelatina
      armL.position.set(-ax, B.armY + AP.dy + fl * Math.sin(t * 1.6 + 1.1) * s, 0.02);
      armR.position.set(ax, B.armY + AP.dy + fl * Math.sin(t * 1.6 + 1.6) * s, 0.02);
      var rest = REST * (1 - 0.8 * aperto) + 0.1 * Math.min(w, 1) * (1 - aperto) + 0.3 * sit; // sentado: braços pousados para os lados
      var restL = -rest - 0.05 * Math.sin(t * 1.2) * s - 0.5 * hop;
      var restR = rest + 0.05 * Math.sin(t * 1.2 + 0.7) * s + 0.5 * hop;
      var wv = wave * (1 - raiseR);
      restR = restR * (1 - wv) + (2.95 + 0.2 * Math.sin(t * 12)) * wv;
      armL.rotation.z = restL * (1 - raiseL) + (angL - 0.06 * Math.sin(t * 3)) * raiseL;
      armR.rotation.z = restR * (1 - raiseR) + (angR + 0.06 * Math.sin(t * 3 + 1)) * raiseR;
      /* braços balançam alternados ao andar (para frente e para trás) */
      var swing = 0.55 * Math.sin(ph) * Math.min(w, 1.2);
      armL.rotation.x = 0.12 * Math.sin(t * 0.9) * s * (1 - raiseL) * iw + swing + 0.45 * sit;   // sentado: mãos no "colo"
      armR.rotation.x = 0.12 * Math.sin(t * 0.9 + 2.1) * s * (1 - Math.max(wv, raiseR)) * iw - swing * (1 - wv) + 0.45 * sit * (1 - wv);
      if (!still) {
        if (t >= nextBlink && blinkAt < 0 && cfg && cfg.blink) blinkAt = t;
        if (blinkAt >= 0) {
          var bp = (t - blinkAt) / 0.16;
          if (bp >= 1 || bp < 0) { setBlink(1); blinkAt = -1; nextBlink = t + 2.5 + Math.random() * 3.5; }
          else setBlink(1 - 0.94 * Math.sin(Math.PI * bp));
        }
      }
    }

    /* um passo da animação: os lerps do loop() do kit + a pose */
    function update(t, dt){
      if (dt == null) dt = 1 / 60;
      tNow = t;
      wave += (waveTarget - wave) * k60(0.12, dt);
      lk += ((mouseIn ? 1 : 0) - lk) * k60(0.06, dt);
      look.x += (look.tx - look.x) * k60(0.15, dt); look.y += (look.ty - look.y) * k60(0.15, dt);
      raiseL += (raiseLT - raiseL) * k60(0.1, dt); raiseR += (raiseRT - raiseR) * k60(0.1, dt);
      spin += (spinT - spin) * k60(0.15, dt); pop *= Math.pow(0.93, dt * 60);
      var wPrev = w;
      w += (wT - w) * k60(0.14, dt);
      if (wPrev > 0.45 && w <= 0.45 && wT < 0.1) { pop = Math.max(pop, 0.35); idleFrom = t; } // parou: balança como gelatina
      curvaS += (curva - curvaS) * k60(0.1, dt);
      aperto += (apertoT - aperto) * k60(0.15, dt);
      sit += (sitT - sit) * k60(0.12, dt);
      if (!still) ph += speed * dt / STRIDE * Math.PI;
      if (wT < 0.02 && w < 0.05) ph = 0;
      if (cur) { ['base', 'rim', 'glow', 'eye', 'line'].forEach(function(k){ cur[k].lerp(tgt[k], k60(0.12, dt)); accCur[k].lerp(accTgt[k], k60(0.12, dt)); }); apply(); }
      pose(t);
    }

    var tmpV = new THREE.Vector3();
    return {
      root: root, fig: fig, head: head, armL: armL, armR: armR,
      set: set, update: update, pose: function(){ pose(tNow); },
      wave: doWave, hover: function(){ doWave(1600); },
      spinTo: function(v, now){ spinT = v; if (now || still) { spin = v; pose(tNow); } },
      /* olhar em unidades do kit: -1…1 (horizontal) e -1…1 (vertical) */
      olhar: function(tx, ty){ mouseIn = true; look.tx = clamp(tx, -1, 1); look.ty = clamp(ty, -1, 1); },
      soltarOlhar: function(){ mouseIn = false; raiseLT = 0; raiseRT = 0; },
      /* olhar para um ponto 3D: mesmos limites do kit (±0,42 rad de giro e ±0,28 de inclinação, mais o giro do corpo) */
      olharPara: function(p){
        tmpV.copy(p); fig.worldToLocal(tmpV); tmpV.y -= B.headY;
        var yaw = Math.atan2(tmpV.x, tmpV.z), pitch = Math.atan2(tmpV.y, Math.hypot(tmpV.x, tmpV.z));
        if (Math.abs(yaw) > 1.9) { this.soltarOlhar(); return; } // atrás dele: não torce o pescoço
        this.olhar(yaw / 0.6, pitch / 0.5);
      },
      erguer: function(L, R, aL, aR){ raiseLT = L; raiseRT = R; if (aL != null) angL = aL; if (aR != null) angR = aR; },
      /* velocidade em m/s (do mundo) e curva (rad/s); 2,2 m/s = andar normal */
      andar: function(v, c){ speed = v; wT = Math.min(v / 2.2, 1.5); curva = c || 0; if (v < 0.05) curva = 0; },
      apertar: function(a){ apertoT = clamp(a, 0, 1); },
      /* sentar(true/false): pose de descanso; quem põe o boneco no assento é o jogo */
      sentar: function(v){ sitT = v ? 1 : 0; if (v) { wT = 0; speed = 0; } },
      sentado: function(){ return sitT > 0.5; },
      tall: function(){ return (ACC[accName] && ACC[accName].tall) || 0; },
      /* raio do tronco em unidades do boneco: o maior raio do perfil do corpo atual (o colisor do jogo sai daqui) */
      raioTronco: function(){ return B.pts.reduce(function(m, q){ return Math.max(m, q[0]); }, 0); },
      cfg: function(){ return cfg; },
      dispose: function(){
        root.traverse(function(n){ if (n.isMesh) { n.material.dispose(); if (n.material.map) n.material.map.dispose(); } });
        var geos = new Set(); root.traverse(function(n){ if (n.isMesh) geos.add(n.geometry); }); geos.forEach(function(g){ g.dispose(); });
      }
    };
  };
})(window.Orvalho);
