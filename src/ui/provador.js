/* Provador: a janela do avatar-kit (estilo Windows Media Player, abinha com o palco do boneco, abas Provador | Interface).
   O miolo (miniaturas, categorias, teclado) é o do kit sem mudanças. O que muda: ele abre a partir da tela inicial
   ou do jogo, e devolve o que a pessoa escolheu (salvar, cancelar ou "Entrar no Orvalho").
   API: O.provador.abrir({ modo: 'inicio' | 'jogo', aoFechar: function(acao, cfg){} })   acao: 'salvar' | 'cancelar' | 'entrar' */
(function(O){
  var P = O.paleta, PRESETS = P.PRESETS, EYES = P.EYES, BODIES = P.BODIES, ARMS = P.ARMS, ACC = P.ACC;
  var copy = O.avatar.copy;

  var back = document.getElementById('provador'), dialog = back.querySelector('.prov');
  var pane = document.getElementById('prov-pane'), cats = [].slice.call(back.querySelectorAll('.cat'));
  var spinInput = document.getElementById('prov-spin'), pwin = document.getElementById('prov-win');
  var saveBtn = document.getElementById('prov-save'), enterBtn = document.getElementById('prov-enter');
  var draft = copy(O.avatar.load()), big = null, catNow = 'olhos';
  var opts = null;

  function tint(){
    var p = PRESETS[draft.color];
    dialog.style.setProperty('--c1', p[0]); dialog.style.setProperty('--c2', p[1]); dialog.style.setProperty('--c3', p[2]);
    var q = PRESETS[draft.accColor]; dialog.style.setProperty('--a1', q[0]); dialog.style.setProperty('--a2', q[1]);
  }
  /* miniaturas em SVG, pintadas com a cor escolhida */
  function headSvg(inner){
    return '<svg class="thumb" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="27" fill="var(--c1)" stroke="var(--c2)" stroke-width="3"/>' +
      '<ellipse cx="32" cy="15" rx="15" ry="6" fill="#fff" opacity=".35"/>' + inner + '</svg>';
  }
  function star(cx, cy, r){
    var d = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  }
  var EYE_SVG = {
    capsula: '<rect x="18" y="25" width="9" height="17" rx="4.5" fill="var(--c2)"/><rect x="37" y="25" width="9" height="17" rx="4.5" fill="var(--c2)"/><ellipse cx="22.5" cy="28.5" rx="2.4" ry="2.6" fill="#fff" opacity=".9"/><ellipse cx="41.5" cy="28.5" rx="2.4" ry="2.6" fill="#fff" opacity=".9"/>',
    bolinha: '<circle cx="23" cy="33" r="5" fill="var(--c2)"/><circle cx="41" cy="33" r="5" fill="var(--c2)"/><circle cx="23" cy="31" r="1.7" fill="#fff"/><circle cx="41" cy="31" r="1.7" fill="#fff"/>',
    feliz: '<path d="M17 37q5-9 10 0M37 37q5-9 10 0" fill="none" stroke="var(--c2)" stroke-width="3.6" stroke-linecap="round"/>',
    sono: '<path d="M16.5 32h11a5.5 5 0 0 1-11 0zM36.5 32h11a5.5 5 0 0 1-11 0z" fill="var(--c2)"/>',
    brilho: '<ellipse cx="22.5" cy="33" rx="5.5" ry="8" fill="var(--c2)"/><ellipse cx="41.5" cy="33" rx="5.5" ry="8" fill="var(--c2)"/><circle cx="21" cy="30" r="2.2" fill="#fff"/><circle cx="40" cy="30" r="2.2" fill="#fff"/><circle cx="24.5" cy="37" r="1" fill="#fff"/><circle cx="43.5" cy="37" r="1" fill="#fff"/>',
    estrela: '<path d="' + star(22.5, 33, 7.5) + star(41.5, 33, 7.5) + '" fill="var(--c2)" stroke="var(--c2)" stroke-width="1.2" stroke-linejoin="round"/>',
    espiral: '<path d="M22.5 33a1.5 1.5 0 0 1 3 0a3 3 0 0 1-6 0a4.5 4.5 0 0 1 9 0a6 6 0 0 1-12 0M41.5 33a1.5 1.5 0 0 0-3 0a3 3 0 0 0 6 0a4.5 4.5 0 0 0-9 0a6 6 0 0 0 12 0" fill="none" stroke="var(--c2)" stroke-width="2" stroke-linecap="round"/>',
    fechado: '<path d="M18 27l8 6-8 6M46 27l-8 6 8 6" fill="none" stroke="var(--c2)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>',
    nenhum: ''
  };
  var BODY_SVG = { // cabeça, torso e braços em silhueta
    jujubaInv: '<circle cx="32" cy="13" r="10.5"/><path d="M18.5 29c3-2 24-2 27 0 1.5 14-3 27-13.5 29-10.5-2-15-15-13.5-29z"/><ellipse cx="13" cy="41" rx="4" ry="9" transform="rotate(14 13 41)"/><ellipse cx="51" cy="41" rx="4" ry="9" transform="rotate(-14 51 41)"/>',
    gotaInv: '<circle cx="32" cy="13" r="10.5"/><path d="M15 30c3-3 31-3 34 0-1 13-7 26-17 28-10-2-16-15-17-28z"/><ellipse cx="10" cy="41" rx="4" ry="9" transform="rotate(14 10 41)"/><ellipse cx="54" cy="41" rx="4" ry="9" transform="rotate(-14 54 41)"/>',
    jujuba: '<circle cx="32" cy="15" r="11"/><path d="M19 60c-1-14 3-24 13-24s14 10 13 24z"/><ellipse cx="14.5" cy="47" rx="4" ry="9" transform="rotate(14 14.5 47)"/><ellipse cx="49.5" cy="47" rx="4" ry="9" transform="rotate(-14 49.5 47)"/>',
    gota: '<circle cx="32" cy="16" r="11"/><path d="M18 60c-2-10 6-24 14-24s16 14 14 24z"/><ellipse cx="17" cy="48" rx="4" ry="9" transform="rotate(14 17 48)"/><ellipse cx="47" cy="48" rx="4" ry="9" transform="rotate(-14 47 48)"/>',
    esguio: '<circle cx="32" cy="12" r="10"/><path d="M23 60c-1-16 2-27 9-27s10 11 9 27z"/><ellipse cx="17.5" cy="45" rx="3.6" ry="9" transform="rotate(12 17.5 45)"/><ellipse cx="46.5" cy="45" rx="3.6" ry="9" transform="rotate(-12 46.5 45)"/>'
  };
  var A = 'fill="var(--a1)" stroke="var(--a2)" stroke-width="2.2" stroke-linejoin="round"';
  var ACC_SVG = {
    nenhum: ['', ''],
    fone: ['', '<path d="M12 38a20 20 0 0 1 40 0" fill="none" stroke="var(--a2)" stroke-width="6" stroke-linecap="round"/><path d="M12 38a20 20 0 0 1 40 0" fill="none" stroke="var(--a1)" stroke-width="2.6" stroke-linecap="round"/><rect x="6" y="31" width="10" height="16" rx="5" ' + A + '/><rect x="48" y="31" width="10" height="16" rx="5" ' + A + '/>'],
    orelhas: ['<path d="M14 30C11 18 15 9 20 8s9 8 10 16z" ' + A + '/><path d="M50 30c3-12-1-21-6-22s-9 8-10 16z" ' + A + '/><path d="M18 24c-1-6 1-10 3-10s4 4 4 8z" fill="#ff9cbc"/><path d="M46 24c1-6-1-10-3-10s-4 4-4 8z" fill="#ff9cbc"/>', ''],
    antena: ['<path d="M26 19 20 6M38 19 44 6" stroke="var(--a2)" stroke-width="2.6" stroke-linecap="round"/>', '<circle cx="20" cy="6" r="4.5" ' + A + '/><circle cx="44" cy="6" r="4.5" ' + A + '/>'],
    obra: ['', '<path d="M13 33a19 18 0 0 1 38 0z" ' + A + '/><rect x="8" y="30" width="48" height="6" rx="3" ' + A + '/><path d="M32 15v15" stroke="var(--a2)" stroke-width="2.2"/>'],
    oculos: ['', '<path d="M12 36h40" stroke="var(--a2)" stroke-width="2"/><rect x="16" y="31" width="14" height="10" rx="4" fill="#1d2230" stroke="var(--a1)" stroke-width="2.6"/><rect x="34" y="31" width="14" height="10" rx="4" fill="#1d2230" stroke="var(--a1)" stroke-width="2.6"/>'],
    flor: ['', petals(46, 22) + '<circle cx="46" cy="22" r="3.2" fill="#ffcf2a" stroke="#c46a00" stroke-width="1.2"/>'],
    laco: ['', '<path d="M32 17 19 9q-4 8 0 15zM32 17l13-8q4 8 0 15z" ' + A + '/><circle cx="32" cy="17" r="3.6" ' + A + '/>'],
    cone: ['', '<path d="M24 18 30 3q2-2 4 0l6 15z" ' + A + '/><path d="M26.5 12h11M28.4 7.5h7.2" stroke="#fff" stroke-width="2.6"/><rect x="19" y="16" width="26" height="4.5" rx="2" ' + A + '/>'],
    bone: ['<rect x="42" y="26" width="20" height="4.6" rx="2.3" ' + A + '/>', '<path d="M12.5 34a19.5 18 0 0 1 39 0z" ' + A + '/><circle cx="32" cy="16" r="2" fill="var(--a2)"/>'],
    exclama: ['', '<rect x="44" y="1" width="6.5" height="13" rx="3.2" ' + A + '/><circle cx="47.2" cy="19" r="3.2" ' + A + '/>'],
    pergunta: ['', '<path d="M42 7q0-5 5-5t5 5q0 4-5 6v2" fill="none" stroke="var(--a2)" stroke-width="5.4" stroke-linecap="round"/><path d="M42 7q0-5 5-5t5 5q0 4-5 6v2" fill="none" stroke="var(--a1)" stroke-width="2.6" stroke-linecap="round"/><circle cx="47" cy="20.5" r="2.8" ' + A + '/>'],
    aureola: ['', '<ellipse cx="32" cy="8" rx="14" ry="4" fill="none" stroke="var(--a2)" stroke-width="5.6"/><ellipse cx="32" cy="8" rx="14" ry="4" fill="none" stroke="var(--a1)" stroke-width="2.6"/>'],
    natal: ['', '<path d="M14 27Q18 8 36 5q14-2 20 10-8-3-13 0 5 5 7 12z" ' + A + '/><rect x="11" y="23" width="42" height="8" rx="4" fill="#f7fbff" stroke="#7f98ab" stroke-width="2"/><circle cx="56" cy="15" r="4.5" fill="#f7fbff" stroke="#7f98ab" stroke-width="2"/>'],
    mago: ['', '<path d="M21 22Q27 12 32 3q4-3 8 1-4 1-3 5l5 13z" ' + A + '/><path d="M31.5 12.5l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="#ffcf2a" stroke="#c46a00" stroke-width=".8"/><ellipse cx="32" cy="22" rx="25" ry="4.6" ' + A + '/>'],
    monoculo: ['', '<path d="M42.5 43q4 6 9 9" fill="none" stroke="var(--a2)" stroke-width="1.6" stroke-dasharray="2 1.6"/><circle cx="36.5" cy="37.5" r="7.5" fill="rgba(225,242,255,.45)" stroke="var(--a1)" stroke-width="2.8"/><circle cx="36.5" cy="37.5" r="7.5" fill="none" stroke="var(--a2)" stroke-width=".8"/>'],
    gravata: ['', '<path d="M29.5 53h5l-1 3 3 6.5L32 65l-4.5-2.5 3-6.5z" ' + A + '/>'],
    borboleta: ['', '<path d="M32 57l-9-5v10zM32 57l9-5v10z" ' + A + '/><circle cx="32" cy="57" r="2.6" ' + A + '/>']
  };
  function petals(cx, cy){
    var d = '';
    for (var i = 0; i < 5; i++) { var a = i * Math.PI * 2 / 5 - Math.PI / 2; d += '<circle cx="' + (cx + Math.cos(a) * 4.6).toFixed(1) + '" cy="' + (cy + Math.sin(a) * 4.6).toFixed(1) + '" r="3.6" ' + A + '/>'; }
    return d;
  }
  function accSvg(k){
    var t = ACC_SVG[k];
    return '<svg class="thumb acc" viewBox="0 0 64 64" aria-hidden="true">' + t[0] +
      '<circle cx="32" cy="38" r="20" fill="var(--c1)" stroke="var(--c2)" stroke-width="2.6"/><ellipse cx="32" cy="26" rx="11" ry="4.5" fill="#fff" opacity=".35"/>' +
      '<rect x="25" y="33" width="5" height="9" rx="2.5" fill="var(--c2)"/><rect x="34" y="33" width="5" height="9" rx="2.5" fill="var(--c2)"/>' + t[1] + '</svg>';
  }
  var ARM_SVG = {
    normal: '<ellipse cx="14.5" cy="47" rx="4" ry="9" transform="rotate(14 14.5 47)"/><ellipse cx="49.5" cy="47" rx="4" ry="9" transform="rotate(-14 49.5 47)"/>',
    curto: '<ellipse cx="15" cy="43" rx="4.2" ry="5" transform="rotate(14 15 43)"/><ellipse cx="49" cy="43" rx="4.2" ry="5" transform="rotate(-14 49 43)"/>',
    bolinha: '<circle cx="12.5" cy="45" r="4.6"/><circle cx="51.5" cy="45" r="4.6"/>'
  };
  function armSvg(k){
    return '<svg class="thumb" viewBox="0 0 64 64" aria-hidden="true"><g fill="var(--c1)" stroke="var(--c2)" stroke-width="2.6"><circle cx="32" cy="15" r="11"/><path d="M19 60c-1-14 3-24 13-24s14 10 13 24z"/>' + ARM_SVG[k] + '</g></svg>';
  }
  function bodySvg(k){
    return '<svg class="thumb" viewBox="0 0 64 64" aria-hidden="true"><g fill="var(--c1)" stroke="var(--c2)" stroke-width="2.6">' + BODY_SVG[k] + '</g></svg>';
  }
  /* aba Interface: por enquanto só organiza as opções (ainda não aplicam nada) */
  var UI = {
    fundo: { t: 'Fundo do site', sub: 'O cenário atrás de tudo.', list: {
      ceu: ['Céu', 'linear-gradient(180deg,#1b6fd8,#7cc6f5 60%,#c9ecff 61%,#6cc24a 62%,#3f9a14)'],
      manha: ['Manhã', 'linear-gradient(180deg,#ffb37a,#ffe0b8 45%,#bfe4ff 100%)'],
      tarde: ['Pôr do sol', 'linear-gradient(180deg,#5b3cc4,#e2668a 55%,#ffb35c 100%)'],
      aquario: ['Aquário', 'radial-gradient(circle at 30% 70%,rgba(130,240,255,.5) 0 8%,transparent 9%),linear-gradient(180deg,#0a5d7a,#04233f)'],
      floresta: ['Floresta', 'linear-gradient(180deg,#bff0a0,#5fb84a 55%,#1f6b2c 100%)'],
      nuvem: ['Nuvem', 'radial-gradient(circle at 30% 40%,#fff 0 18%,transparent 19%),radial-gradient(circle at 62% 46%,#fff 0 22%,transparent 23%),linear-gradient(180deg,#cfe3f3,#eef6fc)'] } },
    mouse: { t: 'Mouse', sub: 'O cursor que passeia pelo site.', list: {
      padrao: ['Padrão', '<path d="M10 6v22l6-6 4 9 4-2-4-9h8z" fill="#fff" stroke="var(--edge)" stroke-width="2.4" stroke-linejoin="round"/>'],
      gota: ['Gota', '<path d="M8 6c10 2 18 10 18 18a8 8 0 0 1-16 0c0-6-2-12-2-18z" fill="#3aa8f0" stroke="var(--edge)" stroke-width="2.4"/><ellipse cx="15" cy="21" rx="2.5" ry="4" fill="#fff" opacity=".8"/>'],
      bolha: ['Bolha', '<path d="M8 6l9 3" stroke="var(--edge)" stroke-width="2.4" stroke-linecap="round"/><circle cx="20" cy="20" r="10" fill="rgba(170,230,255,.5)" stroke="var(--edge)" stroke-width="2.4"/><path d="M14 17a7 7 0 0 1 5-4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>'],
      folha: ['Folha', '<path d="M8 6c14 0 22 6 22 16-10 0-18-4-22-16z" fill="#6cc24a" stroke="var(--edge-leaf)" stroke-width="2.4" stroke-linejoin="round"/><path d="M8 6l16 12" stroke="var(--edge-leaf)" stroke-width="1.8"/>'],
      estrela: ['Estrela', '<path d="M8 6l4 9M20 9l2.6 5.4 6 .8-4.4 4.2 1.1 5.9L20 22.5l-5.3 2.8 1.1-5.9-4.4-4.2 6-.8z" fill="#ffd34d" stroke="var(--edge)" stroke-width="2.2" stroke-linejoin="round"/>'],
      mao: ['Mãozinha', '<path d="M13 18V8a2 2 0 0 1 4 0v8m0-2a2 2 0 0 1 4 0v2m0 0a2 2 0 0 1 4 0v1m0 0a2 2 0 0 1 4 0v5c0 5-3 8-8 8-3.5 0-5.5-2-7-4.5L8 21a2 2 0 0 1 3.2-2.4L13 21" fill="#fff" stroke="var(--edge)" stroke-width="2.2" stroke-linejoin="round"/>'] } }
  };
  var ui = { fundo: 'ceu', mouse: 'padrao' };
  try { var uf = localStorage.getItem('orvalho-ui-fundo'), um = localStorage.getItem('orvalho-ui-mouse');
    if (UI.fundo.list[uf]) ui.fundo = uf; if (UI.mouse.list[um]) ui.mouse = um; } catch (e) {}
  var uiDraft = { fundo: ui.fundo, mouse: ui.mouse };
  function uiPane(sec){
    var S = UI[sec];
    var html = '<h2>' + S.t + '</h2><p class="sub">' + S.sub + ' <span class="tag">em breve</span></p>';
    (function(){
      html += '<section class="ui-sec"><div class="opt-grid" role="radiogroup" aria-label="' + S.t + '">';
      Object.keys(S.list).forEach(function(k){
        var it = S.list[k], th = sec === 'fundo' ? '<i class="bg-thumb" style="background:' + it[1] + '"></i>'
          : '<svg class="thumb cur-thumb" viewBox="0 0 40 40" aria-hidden="true">' + it[1] + '</svg>';
        html += '<button type="button" class="opt" role="radio" data-ui="' + sec + '" data-v="' + k + '" aria-checked="' + (uiDraft[sec] === k) + '">' + th + it[0] + '</button>';
      });
      html += '</div></section>';
    })();
    pane.innerHTML = html;
  }
  var CAT = {
    olhos: { t: 'Olhos', sub: 'O jeito que ele olha para você.', key: 'eyes', list: EYES, thumb: function(k){ return headSvg(EYE_SVG[k]); } },
    corpo: { t: 'Corpo', sub: 'A cabeça e os braços acompanham o formato.', key: 'body', list: BODIES, thumb: bodySvg },
    cores: { t: 'Cores', sub: 'Vidro-gelatina com brilho por dentro.', key: 'color', list: PRESETS },
    acess: { t: 'Acessórios', sub: 'Um por vez. A cor dele fica na aba Cores.', key: 'acc', list: ACC, thumb: accSvg }

  };
  function label(list, k){ var v = list[k]; return typeof v === 'string' ? v : (v.name || v[0] || v[3]); }
  function drawPane(){
    var c = CAT[catNow];
    pane.setAttribute('aria-labelledby', 'cat-' + catNow);
    if (UI[catNow]) { uiPane(catNow); return; }
    var html = '<h2>' + c.t + '</h2><p class="sub">' + c.sub + '</p>';
    if (catNow === 'cores') {
      html += '<h3 class="pane-sub">Cor do boneco</h3><div class="color-grid" role="radiogroup" aria-label="Cor do boneco">';
      Object.keys(PRESETS).forEach(function(k){
        var p = PRESETS[k];
        html += '<button type="button" class="color-opt" role="radio" data-v="' + k + '" aria-checked="' + (draft.color === k) + '" aria-label="' + p[3] + '" title="' + p[3] +
          '" style="--c1:' + p[0] + ';--c2:' + p[1] + ';--c3:' + p[2] + '"></button>';
      });
    } else {
      html += '<div class="opt-grid" role="radiogroup" aria-label="' + c.t + '">';
      Object.keys(c.list).forEach(function(k){
        html += '<button type="button" class="opt" role="radio" data-v="' + k + '" aria-checked="' + (draft[c.key] === k) + '">' + c.thumb(k) + label(c.list, k) + '</button>';
      });
    }
    html += '</div>';
    if (catNow === 'olhos') {
      html += '<label class="switch-row"><input type="checkbox" role="switch" id="blink-toggle"' + (draft.blink ? ' checked' : '') + '><span class="sw" aria-hidden="true"></span><span><strong>Piscar</strong><small>Ele pisca sozinho de tempos em tempos.</small></span></label>';
    }
    if (catNow === 'corpo') {
      html += '<section class="acc-sec"><h3>Braços</h3><div class="opt-grid" role="radiogroup" aria-label="Braços">';
      Object.keys(ARMS).forEach(function(k){
        html += '<button type="button" class="opt" role="radio" data-arms="' + k + '" aria-checked="' + (draft.arms === k) + '">' + armSvg(k) + ARMS[k] + '</button>';
      });
      html += '</div></section>';
    }
    if (catNow === 'cores') {
      html += '<section class="acc-sec"><h3>Cor do acessório</h3><div class="color-grid" role="radiogroup" aria-label="Cor do acessório">';
      Object.keys(PRESETS).forEach(function(k){
        var p = PRESETS[k];
        html += '<button type="button" class="color-opt" role="radio" data-acc-color="' + k + '" aria-checked="' + (draft.accColor === k) + '" aria-label="' + p[3] + '" title="' + p[3] +
          '" style="--c1:' + p[0] + ';--c2:' + p[1] + ';--c3:' + p[2] + '"></button>';
      });
      html += '</div></section>';
    }
    pane.innerHTML = html;
  }
  function pick(v){
    var c = CAT[catNow]; if (!c) return;
    draft[c.key] = v;
    [].forEach.call(pane.querySelectorAll('[data-v]'), function(b){ b.setAttribute('aria-checked', b.getAttribute('data-v') === v ? 'true' : 'false'); });
    tint();
    if (big) big.set(draft);
  }
  pane.addEventListener('change', function(e){
    if (e.target.id === 'blink-toggle') { draft.blink = e.target.checked; if (big) big.set(draft); }
  });
  pane.addEventListener('click', function(e){
    var am = e.target.closest('[data-arms]');
    if (am) {
      draft.arms = am.getAttribute('data-arms');
      [].forEach.call(pane.querySelectorAll('[data-arms]'), function(o){ o.setAttribute('aria-checked', o === am ? 'true' : 'false'); });
      if (big) big.set(draft); return;
    }
    var ac = e.target.closest('[data-acc-color]');
    if (ac) {
      draft.accColor = ac.getAttribute('data-acc-color');
      [].forEach.call(pane.querySelectorAll('[data-acc-color]'), function(o){ o.setAttribute('aria-checked', o === ac ? 'true' : 'false'); });
      tint(); if (big) big.set(draft); return;
    }
    var b = e.target.closest('[data-v]'); if (!b) return;
    var sec = b.getAttribute('data-ui');
    if (sec) { // interface: só marca a escolha por enquanto
      uiDraft[sec] = b.getAttribute('data-v');
      [].forEach.call(pane.querySelectorAll('[data-ui="' + sec + '"]'), function(o){ o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
      return;
    }
    pick(b.getAttribute('data-v'));
  });
  var mode = 'prov', lastCat = { prov: 'olhos', ui: 'fundo' };
  var modeTabs = [].slice.call(back.querySelectorAll('.prov-tab [role="tab"]')), rails = [].slice.call(back.querySelectorAll('.prov-rail'));
  function selectCat(name, focus){
    catNow = name; lastCat[mode] = name;
    cats.forEach(function(c){ var on = c.getAttribute('data-cat') === name; c.setAttribute('aria-selected', on); c.tabIndex = on ? 0 : -1; if (on && focus) c.focus(); });
    drawPane(); pane.scrollTop = 0;
  }
  function selectMode(m, focus){
    mode = m;
    modeTabs.forEach(function(t){ var on = t.getAttribute('data-mode') === m; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    rails.forEach(function(r){ r.hidden = r.getAttribute('data-mode') !== m; });
    selectCat(lastCat[m]);
  }
  modeTabs.forEach(function(t, i){
    t.addEventListener('click', function(){ selectMode(t.getAttribute('data-mode')); });
    t.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); selectMode(modeTabs[(i + d + modeTabs.length) % modeTabs.length].getAttribute('data-mode'), true); }
    });
  });
  rails.forEach(function(r){
    var list = [].slice.call(r.querySelectorAll('.cat'));
    list.forEach(function(c, i){
      c.addEventListener('click', function(){ selectCat(c.getAttribute('data-cat')); });
      c.addEventListener('keydown', function(e){
        var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
        if (d) { e.preventDefault(); selectCat(list[(i + d + list.length) % list.length].getAttribute('data-cat'), true); }
      });
    });
  });

  var lastFocus = null;
  function open(o){
    opts = o || {};
    draft = copy(O.avatar.load()); uiDraft = { fundo: ui.fundo, mouse: ui.mouse }; lastFocus = document.activeElement;
    /* na tela inicial: Salvar + "Entrar no Orvalho"; dentro do jogo: "Voltar ao lab" (salva e volta) */
    var inGame = opts.modo === 'jogo';
    enterBtn.hidden = inGame;
    saveBtn.querySelector('span').textContent = inGame ? 'Voltar ao lab' : 'Salvar';
    saveBtn.classList.toggle('leaf', inGame); saveBtn.classList.toggle('ghost', !inGame);
    back.hidden = false;
    tint(); selectMode(mode);
    if (!big) {
      big = O.Doll(pwin.querySelector('canvas'), { cam: [0, 1.4, 10.4], target: [0, 1.15, 0], floor: true, drag: pwin, reach: 420,
        onSpin: function(v){ var d = ((v * 180 / Math.PI + 180) % 360 + 360) % 360 - 180; spinInput.value = Math.round(d); } });
      if (!big) pwin.querySelector('.prov-hint').textContent = 'prévia 3D indisponível';
    }
    if (big) { big.set(draft, true); big.spinTo(0); spinInput.value = 0; big.start(); setTimeout(function(){ big.wave(1400); }, 350); }
    (inGame ? saveBtn : enterBtn).focus();
  }
  /* acao: 'salvar' (X, Esc, clique fora, Salvar, Voltar ao lab) · 'cancelar' (só o botão Cancelar descarta) · 'entrar' */
  function close(acao){
    if (back.hidden) return;
    if (acao !== 'cancelar') {
      O.avatar.store(draft);
      ui = { fundo: uiDraft.fundo, mouse: uiDraft.mouse };
      try { localStorage.setItem('orvalho-ui-fundo', ui.fundo); localStorage.setItem('orvalho-ui-mouse', ui.mouse); } catch (e) {}
    }
    back.hidden = true;
    if (big) big.stop();
    var cb = opts && opts.aoFechar; opts = null;
    if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) lastFocus.focus();
    if (cb) cb(acao, O.avatar.load());
  }
  document.getElementById('prov-close').addEventListener('click', function(){ close('salvar'); });
  document.getElementById('prov-cancel').addEventListener('click', function(){ close('cancelar'); });
  saveBtn.addEventListener('click', function(){ close('salvar'); });
  enterBtn.addEventListener('click', function(){ close('entrar'); });
  document.getElementById('prov-wave').addEventListener('click', function(){ if (big) big.wave(1800); });
  document.getElementById('prov-reset').addEventListener('click', function(){ spinInput.value = 0; if (big) big.spinTo(0); });
  spinInput.addEventListener('input', function(){ if (big) big.spinTo(spinInput.value * Math.PI / 180); });
  document.getElementById('prov-rand').addEventListener('click', function(){
    function any(o){ var k = Object.keys(o); return k[Math.floor(Math.random() * k.length)]; }
    draft = { shape: draft.shape, blink: draft.blink, color: any(PRESETS), eyes: any(EYES), body: any(BODIES), arms: any(ARMS), acc: any(ACC), accColor: any(PRESETS) };
    if (draft.eyes === 'nenhum') draft.eyes = 'capsula';
    tint(); drawPane(); if (big) { big.set(draft); big.wave(1200); }
  });
  back.addEventListener('click', function(e){ if (e.target === back) close('salvar'); });
  document.addEventListener('keydown', function(e){
    if (back.hidden) return;
    if (e.key === 'Escape') { close('salvar'); return; }
    if (e.key === 'Tab') { // mantém o foco dentro do provador
      var f = [].filter.call(dialog.querySelectorAll('button,input,[tabindex="0"]'), function(el){ return el.offsetParent !== null && el.tabIndex >= 0; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  O.provador = { abrir: open, fechar: close, aberto: function(){ return !back.hidden; } };
})(window.Orvalho);
