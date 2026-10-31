/* Dados do boneco (iguais aos do avatar-kit) e a configuração salva do avatar.
   A configuração é uma só: o provador grava, a tela inicial e o jogo leem. As chaves do localStorage são as do kit. */
(function(O){
  var PRESETS = { // base, borda, luz interna
    azul:['#1f4fe0','#0a1d78','#38d6ff','Azul'], agua:['#19b8d0','#05506a','#b4fbff','Água'], folha:['#3fae22','#0c4a3a','#d6ff5a','Folha'],
    laranja:['#ff6f10','#a83300','#ffd76a','Laranja'], sol:['#ffbe0f','#c46a00','#fff3b0','Sol'], rosa:['#ff6f9e','#b8235a','#ffe6f0','Rosa'],
    'rosa-claro':['#ffb7cf','#c55a82','#fff4f8','Rosa claro'],
    lilas:['#b07ff0','#6a35b0','#86f0ff','Lilás'], violeta:['#6e5cff','#2a1aa8','#e8e2ff','Violeta'], magenta:['#c0157f','#3a0b66','#ff70b0','Magenta'],
    fogo:['#ff3a12','#8f0c45','#ffb020','Fogo'], gelo:['#d5e3ea','#7d97a6','#ffffff','Gelo'], onix:['#26272c','#050506','#a8a8a8','Ônix']
  };
  var EYES = { capsula:['Cápsula',0], bolinha:['Bolinha',1], feliz:['Feliz',2], sono:['Sonolento',3], brilho:['Brilhante',4],
    estrela:['Estrela',5], espiral:['Confuso',6], fechado:['Apertado',7], nenhum:['Sem olhos',-1] };
  /* corpos: perfil do torno (raio, altura), onde ficam os ombros e a cabeça */
  var BODIES = {
    jujuba:{ name:'Jujuba', pts:[[0,0],[0.38,0],[0.5,0.03],[0.555,0.12],[0.565,0.3],[0.555,0.5],[0.52,0.7],[0.45,0.86],[0.34,0.98],[0.18,1.06],[0,1.09]], armX:0.6, armY:0.88, headY:1.65 },
    gota:{ name:'Gota', pts:[[0,0],[0.42,0],[0.58,0.04],[0.64,0.16],[0.62,0.34],[0.53,0.56],[0.42,0.76],[0.31,0.92],[0.17,1.01],[0,1.04]], armX:0.5, armY:0.82, headY:1.6 },
    esguio:{ name:'Esguio', pts:[[0,0],[0.3,0],[0.42,0.03],[0.45,0.15],[0.455,0.42],[0.445,0.72],[0.41,0.96],[0.33,1.1],[0.18,1.17],[0,1.19]], armX:0.5, armY:0.98, headY:1.74 }
  };
  /* versões de ponta-cabeça: o perfil é espelhado na altura (largo em cima, fino embaixo) */
  function flip(pts){ var H = pts[pts.length - 1][1]; return pts.slice().reverse().map(function(p){ return [p[0], +(H - p[1]).toFixed(3)]; }); }
  BODIES.jujubaInv = { name:'Jujuba invertida', pts: flip(BODIES.jujuba.pts), armX:0.62, armY:0.86, headY:1.64 };
  BODIES.gotaInv = { name:'Gota invertida', pts: flip(BODIES.gota.pts), armX:0.7, armY:0.8, headY:1.6 };
  BODIES = { jujuba: BODIES.jujuba, jujubaInv: BODIES.jujubaInv, gota: BODIES.gota, gotaInv: BODIES.gotaInv, esguio: BODIES.esguio };
  var ARMS = { normal:'Normal', curto:'Curto', bolinha:'Bolinha' };
  /* acessórios: tall = quanto sobe acima da cabeça (o avatar pequeno afasta a câmera); float = flutua; body = vai no corpo */
  var ACC = {
    nenhum:{ name:'Nenhum' }, fone:{ name:'Fone' }, orelhas:{ name:'Orelhinhas', tall:0.2 }, antena:{ name:'Antenas', tall:0.38 },
    obra:{ name:'Capacete', tall:0.12 }, oculos:{ name:'Óculos escuros' }, flor:{ name:'Florzinha', tall:0.1 }, laco:{ name:'Laço', tall:0.22 }, tiara:{ name:'Tiara', tall:0.08 },
    cone:{ name:'Cone', tall:0.65 }, bone:{ name:'Boné pra trás', tall:0.18 }, exclama:{ name:'Exclamação', tall:0.4, float:1 },
    pergunta:{ name:'Interrogação', tall:0.42, float:1 }, aureola:{ name:'Auréola', tall:0.36, float:1 }, natal:{ name:'Gorro de Natal', tall:0.25 },
    mago:{ name:'Chapéu de mago', tall:0.75 }, monoculo:{ name:'Monóculo' },
    gravata:{ name:'Gravata', body:1 }, borboleta:{ name:'Gravata borboleta', body:1 }
  };
  var FIXED = { branco:['#f7fbff','#7f98ab','#ffffff'], preto:['#14171f','#000000','#0a0c12'], amarelo:['#ffcf2a','#c46a00','#fff3b0'], rosa:['#ff9cbc','#c0406e','#fff0f5'] };
  var SHAPES = { quadrado:'Quadrado', circulo:'Círculo', d:'Meia-lua', triangulo:'Triângulo', feijao:'Feijão', pedra:'Pedra' };

  function load(){
    var c = { shape:'quadrado', color:'azul', eyes:'capsula', body:'jujuba', arms:'normal', blink:true, acc:'nenhum', accColor:'sol' };
    try {
      var v = localStorage.getItem('orvalho-avatar-shape'); if (SHAPES[v]) c.shape = v;
      v = localStorage.getItem('orvalho-avatar-cor'); if (PRESETS[v]) c.color = v;
      v = localStorage.getItem('orvalho-avatar-olhos'); if (v === '0') c.eyes = 'nenhum'; else if (EYES[v]) c.eyes = v;
      v = localStorage.getItem('orvalho-avatar-corpo'); if (BODIES[v]) c.body = v;
      v = localStorage.getItem('orvalho-avatar-bracos'); if (ARMS[v]) c.arms = v;
      if (localStorage.getItem('orvalho-avatar-piscar') === '0') c.blink = false;
      v = localStorage.getItem('orvalho-avatar-acessorio'); if (ACC[v]) c.acc = v;
      v = localStorage.getItem('orvalho-avatar-acessorio-cor'); if (PRESETS[v]) c.accColor = v;
    } catch (e) {}
    return c;
  }
  function store(c){
    try {
      localStorage.setItem('orvalho-avatar-shape', c.shape); localStorage.setItem('orvalho-avatar-cor', c.color);
      localStorage.setItem('orvalho-avatar-olhos', c.eyes); localStorage.setItem('orvalho-avatar-corpo', c.body);
      localStorage.setItem('orvalho-avatar-bracos', c.arms); localStorage.setItem('orvalho-avatar-piscar', c.blink ? '1' : '0'); localStorage.setItem('orvalho-avatar-acessorio', c.acc); localStorage.setItem('orvalho-avatar-acessorio-cor', c.accColor);
    } catch (e) {}
  }
  function copy(c){ return { shape:c.shape, color:c.color, eyes:c.eyes, body:c.body, arms:c.arms, blink:c.blink !== false, acc:c.acc, accColor:c.accColor }; }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
  /* já existe um avatar salvo? (decide se "Entrar" passa antes pelo provador) */
  function exists(){ try { return localStorage.getItem('orvalho-avatar-cor') !== null; } catch (e) { return false; } }

  O.paleta = { PRESETS: PRESETS, EYES: EYES, BODIES: BODIES, ARMS: ARMS, ACC: ACC, FIXED: FIXED, SHAPES: SHAPES };
  O.avatar = { load: load, store: store, copy: copy, exists: exists };
  O.clamp = clamp;
})(window.Orvalho);
