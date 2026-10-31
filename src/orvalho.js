/* Orvalho: espaço de nomes único. Cada arquivo de src/ se pendura aqui (scripts clássicos, sem build:
   abre direto no navegador, até por file://, e cada bloco já fica num arquivo próprio para a CSP do Flask). */
window.Orvalho = window.Orvalho || {};
(function(O){
  /* ambientes: cada sala se registra com a planta (dados) e o motor monta a cena a partir disso */
  O.ambientes = { lista: {}, registrar: function(def){ this.lista[def.id] = def; return def; } };
  O.conteudo = O.conteudo || {};
  O.still = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
})(window.Orvalho);
