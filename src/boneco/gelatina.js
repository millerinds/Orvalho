/* Material vidro-gelatina e contorno escuro: o mesmo shader do avatar-kit, agora fora do boneco
   para os móveis da sala usarem igual (um só programa de shader para tudo que é gelatina). */
(function(O){
  /* material vidro-gelatina: borda escurecida, luz interna embaixo, arco de brilho e olhos desenhados no shader */
  function jelly(p){
      var m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03 });
      var u = {
        uRim: { value: new THREE.Color() }, uGlow: { value: new THREE.Color() }, uEye: { value: new THREE.Color() },
        uTop: { value: p.top }, uBot: { value: p.bot }, uArc: { value: p.arc || 0 },
        uEyes: { value: p.eyes ? 1 : 0 }, uEyeType: { value: 0 }, uBlink: { value: 1 }, uTime: { value: 0 }, uLook: { value: new THREE.Vector2() }
      };
      m.userData.u = u; m.userData.hasEyes = !!p.eyes;
      m.extensions = { derivatives: true };
      m.onBeforeCompile = function(sh){
        for (var k in u) sh.uniforms[k] = u[k];
        sh.vertexShader = 'varying vec3 vObjPos;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n\tvObjPos = position;');
        sh.fragmentShader = [
          'varying vec3 vObjPos;', 'uniform vec3 uRim;', 'uniform vec3 uGlow;', 'uniform vec3 uEye;',
          'uniform float uTop;', 'uniform float uBot;', 'uniform float uArc;', 'uniform float uEyes;', 'uniform float uEyeType;',
          'uniform float uBlink;', 'uniform float uTime;', 'uniform vec2 uLook;',
          'float sdCapsY(vec2 p, float h, float r){ p.y -= clamp(p.y, -h, h); return length(p) - r; }',
          'float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }',
          'float sdStar5(vec2 p, float r, float rf){',
          '  const vec2 k1 = vec2(0.809016994375, -0.587785252292); const vec2 k2 = vec2(-k1.x, k1.y);',
          '  p.x = abs(p.x); p -= 2.0 * max(dot(k1, p), 0.0) * k1; p -= 2.0 * max(dot(k2, p), 0.0) * k2;',
          '  p.x = abs(p.x); p.y -= r;',
          '  vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0.0, 1.0); float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);',
          '  return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);',
          '}',
          'float fill(float d){ float a = fwidth(d) + 0.002; return 1.0 - smoothstep(-a, a, d); }', ''
        ].join('\n') + sh.fragmentShader.replace('#include <tonemapping_fragment>', [
          'vec3 nV = normalize(normal);',
          'float ndv = clamp(dot(nV, normalize(vViewPosition)), 0.0, 1.0);',
          'float low = clamp((uTop - vObjPos.y) / (uTop - uBot), 0.0, 1.0); low = low * low * (3.0 - 2.0 * low);',
          'vec3 col = gl_FragColor.rgb;',
          'col += uGlow * low * pow(ndv, 1.8) * 0.7;',
          'col = mix(col, uRim, smoothstep(0.3, 0.95, 1.0 - ndv) * 0.8);',
          'float rr = length(nV.xy);',
          'float arc = exp(-pow((rr - 0.85) / 0.035, 2.0)) * smoothstep(-0.52, -0.72, nV.y);',
          'col += vec3(1.0) * arc * uArc * 1.8;',
          'if (uEyes > 0.5) {',
          '  vec3 op = normalize(vObjPos);',
          '  if (op.z > 0.0) {',
          '    vec2 q0 = op.xy - uLook * vec2(0.11, 0.09);',
          '    vec2 q = vec2(abs(q0.x), q0.y);',
          '    float bl = max(uBlink, 0.06);',
          '    float eye = 0.0, wh = 0.0;',
          '    if (uEyeType < 0.5) {',           // cápsula
          '      vec2 e = q - vec2(0.33, -0.06); e.y /= bl;',
          '      eye = fill(sdCapsY(e, 0.21, 0.2));',
          '      wh = fill((length((e - vec2(0.0, 0.18)) / vec2(0.125, 0.17)) - 1.0) * 0.12) * eye;',
          '    } else if (uEyeType < 1.5) {',    // bolinha
          '      vec2 e = q - vec2(0.28, -0.03); e.y /= bl;',
          '      eye = fill(length(e) - 0.185);',
          '      wh = fill(length(e - vec2(0.0, 0.075)) - 0.06) * eye;',
          '    } else if (uEyeType < 2.5) {',    // feliz ^ ^
          '      vec2 e = q - vec2(0.3, -0.15);',
          '      float d = abs(length(e) - 0.18) - 0.06;',
          '      d = max(d, -e.y - 0.01);',
          '      d = min(d, length(vec2(abs(e.x) - 0.18, e.y + 0.01)) - 0.06);',
          '      eye = fill(d);',
          '    } else if (uEyeType < 3.5) {',    // sonolento: meia-lua com pálpebra reta
          '      vec2 e = q - vec2(0.3, -0.02); e.y /= bl;',
          '      float d = length(e / vec2(1.0, 0.8)) - 0.24;',
          '      eye = fill(max(d, e.y + 0.01));',
          '    } else if (uEyeType < 4.5) {',    // brilhante: oval grande com dois brilhos
          '      vec2 e = q - vec2(0.3, -0.04); e.y /= bl;',
          '      eye = fill((length(e / vec2(0.18, 0.25)) - 1.0) * 0.18);',
          '      wh = max(fill(length(e - vec2(-0.05, 0.1)) - 0.065), fill(length(e - vec2(0.06, -0.1)) - 0.035)) * eye;',
          '    } else if (uEyeType < 5.5) {',    // estrela
          '      vec2 e = q - vec2(0.3, -0.04); e.y /= bl;',
          '      eye = fill(sdStar5(e, 0.27, 0.5) - 0.02);',
          '      wh = fill(length(e - vec2(-0.035, 0.06)) - 0.04) * eye;',
          '    } else if (uEyeType < 6.5) {',    // espiral girando (confuso)
          '      vec2 e = q - vec2(0.3, -0.04); e.y /= bl;',
          '      float r = length(e), s = 0.058;',
          '      float a = atan(e.y, e.x) + uTime * 3.0;',
          '      float dr = abs(fract((r - s * (a / 6.2832)) / s + 0.5) - 0.5) * s;',
          '      eye = fill(max(dr - 0.014, r - 0.2));',
          '    } else {',                        // fechadinho > <
          '      vec2 e = q - vec2(0.3, -0.04);',
          '      float d = min(sdSeg(e, vec2(0.1, 0.12), vec2(-0.09, 0.0)), sdSeg(e, vec2(-0.09, 0.0), vec2(0.1, -0.12))) - 0.045;',
          '      eye = fill(d);',
          '    }',
          '    col = mix(col, col * 0.15 + uEye, eye * 0.95);',
          '    col = mix(col, vec3(0.92, 0.95, 1.0), wh);',
          '  }',
          '}',
          'gl_FragColor.rgb = col;',
          '#include <tonemapping_fragment>'
        ].join('\n'));
      };
    return m;
  }
  /* contorno escuro: casca invertida, empurrada ao longo da normal */
  function outline(mesh, thick){
    var om = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
    om.onBeforeCompile = function(sh){
      sh.uniforms.uOut = { value: thick };
      sh.vertexShader = 'uniform float uOut;\n' + sh.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position + normal * uOut;');
    };
    var shell = mesh.isInstancedMesh ? new THREE.InstancedMesh(mesh.geometry, om, mesh.count) : new THREE.Mesh(mesh.geometry, om);
    if (mesh.isInstancedMesh) shell.instanceMatrix = mesh.instanceMatrix; // mesma matriz: o contorno anda junto
    mesh.add(shell);
    return om;
  }
  function lathe(points, seg){
    var v = points.map(function(p){ return new THREE.Vector2(p[0], p[1]); });
    return new THREE.LatheGeometry(new THREE.SplineCurve(v).getPoints(64), seg);
  }
  function lin(h){ return new THREE.Color(h).convertSRGBToLinear(); }
  /* trio base / borda / luz interna → cores lineares (igual ao preset() do kit) */
  function paleta(p){
    var rim = lin(p[1]);
    return { base: lin(p[0]), rim: rim, glow: lin(p[2]), eye: rim.clone().multiplyScalar(0.55), line: rim.clone().multiplyScalar(0.3) };
  }
  /* pinta um material gelatina (e o contorno, se vier) com uma paleta fixa */
  function pintar(m, C, om){
    var u = m.userData.u;
    m.color.copy(C.base); u.uRim.value.copy(C.rim); u.uGlow.value.copy(C.glow); u.uEye.value.copy(C.eye);
    if (om) om.color.copy(C.line);
  }
  O.gelatina = { jelly: jelly, outline: outline, lathe: lathe, lin: lin, paleta: paleta, pintar: pintar };
})(window.Orvalho);
