# Gera planta-hall-v2.{svg,json} (uso: python3 docs/hall/gerar-planta-v2.py docs/hall). Números = ambientes/hall-inovale/hall-inovale.js.
import json, math, sys
OUT = sys.argv[1]
L, D = 44.0, 15.0          # comprimento (café → palco) CONFIRMADO pelo PDF (prédio de 44 m); profundidade do hall estimada
P = {
  'versao': 'v2.1 (1º andar refeito pelas fotos E01–E45 + 16.32.03/16.32.04)',
  'eixos': 'x: da parede do café (0) à parede do palco (44); z: da fachada de vidro (0) à parede interna (15). Metros.',
  'confirmado_pdf': {'fonte': 'Centro de Inovação Plantas-Layout3 (1).pdf — Planta baixa Ático (prancha 03/03, jan/2019). Só a estrutura, que se repete em todos os andares.',
                     'predio': '44 × 20 m', 'malha_pilares_x': [2.02, 10.06, 18.04, 26.03, 34.06, 42.04], 'fileiras_pilares_z': '1,96 / 11,96 / 17,96 m da fachada',
                     'nucleo_circulacao_x': [9.85, 26.17], 'mapeamento': 'planta espelhada: o lado de 9,85 m do PDF é a ponta do café'},
  'salao': {'comprimento': L, 'profundidade': D, 'peDireitoVazio': 8.0, 'forroSobMezanino': 3.2, 'pisoMezanino': 4.2, 'peitorilMezanino': 1.1, 'piso': 0.9},
  'mezanino': [
    {'nome': 'faixa interna (1º andar)', 'r': [0, 11.7, 44, 20], 'sem_guarda_corpo': [[0, 10.5], [42.25, 44]], 'conf': 'borda em z ≈ 12 confirmada (PDF + fotos); o vidro do ACIOC chega à borda da laje (16.32.03); vão da escada'},
    {'nome': 'ala leste sobre o palco (1º andar)', 'r': [44, 0, 55, 20], 'conf': 'existência confirmada pela foto 16.32.04 (1º andar com a Incubadora por cima da parede do palco); largura de 11 m ESTIMADA; conflita com os 44 m do PDF do ático — pendente de planta do 1º andar'},
  ],
  'pilares': [[x, 12, 0.6, 'PDF + fotos'] for x in [2.02, 10.06, 18.04, 26.03, 34.06, 42.04]] + [[10.06, 0.7, 0.6, 'PDF (x) + foto H24 (junto à fachada)'],
              [44.62, 0.7, 0.5, 'estimado: fim do corredor da Incubadora (E44, E45)'], [50.04, 19.62, 0.5, 'estimado: dentro do Administrativo (E22, E26)']],
  'zonas': [
    ['Café: mesas redondas + cadeiras amarelas', 2.4, 3.2, 13.1, 10.2, '#ffe08a', 'confirmado (H01, H23, H24, H26, H30)'],
    ['Bancada alta com banquetas', 6.5, 1.35, 12.0, 2.35, '#d9b98c', 'confirmado (H01, H24, H26, H29)'],
    ['Balcão do café "Pin"', 1.5, 13.3, 7.1, 14.8, '#2b2b2b', 'corrigido (D01, D03, D04, C20): na parede interna'],
    ['Estante + freezer', 0.05, 12.1, 0.7, 14.8, '#c9a26a', 'confirmado no canto junto ao vidro (D01, D03, C20)'],
    ['Marquise interna da entrada', 12.4, 0.0, 18.0, 3.0, 'none', 'confirmado (H02, H24, H29, H30)'],
    ['Floreiras (2, em fila)', 17.4, 0.7, 18.4, 3.3, '#9fd17a', 'confirmado (H22, H26, H29)'],
    ['Banco branco + palmeira', 19.1, 0.2, 21.0, 2.4, '#ffffff', 'confirmado (H29, C01)'],
    ['Recepção (quiosque branco/laranja)', 14.39, 8.2, 22.91, 11.2, '#ff8a3d', 'confirmado; aberta por trás (C08, C17)'],
    ['Arco A (patrocinadores)', 21.3, 0.2, 23.5, 3.3, '#ffffff', 'confirmado: na parede branca da entrada (H29, C01)'],
    ['Arco B (3 cadeiras)', 23.05, 9.75, 25.95, 11.35, '#ffffff', 'confirmado ao lado da recepção e do pilar (C02, C09)'],
    ['Plateia (2 blocos × 9 fileiras)', 29.1, 2.05, 36.9, 10.45, '#c9ced6', 'confirmado; fileiras estimadas'],
    ['Bancos "Dê um ... na fome"', 28.1, 0.25, 39.0, 0.9, '#d9b98c', 'confirmado (H08, H27-H29, C11)'],
    ['Palco + telão de LED', 39.0, 2.5, 42.5, 10.0, '#3a3a3a', 'confirmado (H04, H07, H14, C12)'],
    ['Estar (poltronas, tapete)', 26.6, 12.55, 29.3, 14.45, '#e6eef5', 'confirmado (C10, C11)'],
    ['Sala de vidro Nexo', 34.0, 14.94, 38.2, 18.4, '#bfe6ff', 'corrigido (D02, H11, H15): alinhada à parede e seguindo para dentro do prédio'],
    ['Corredor banheiros / Nexo', 31.5, 15.0, 33.5, 20.0, '#dce8ef', 'confirmado (D02, D05, D06, H11): veneziana, PCD e vidro no fundo'],
    ['Balcões (banquetas + azul)', 37.3, 11.9, 39.6, 13.9, '#3f6fd8', 'confirmado (C12, C15, C16)'],
  ],
  'portas': [
    ['Entrada principal (portas de vidro)', 14.75, 0, 3.4, 'h', 'confirmado'],
    ['Serviço da cafeteria', 9.15, 15, 0.9, 'h', 'confirmado (D04)'], ['Veneziana', 11.75, 15, 0.8, 'h', 'confirmado (C07)'], ['Escada de emergência', 12.75, 15, 0.9, 'h', 'confirmado (C07); núcleo do PDF'],
    ['Elevador', 14.6, 15, 1.1, 'h', 'confirmado (C04, C07)'], ['Banheiros (passagem)', 21.2, 15, 1.2, 'h', 'confirmado (C10); núcleo do PDF'],
    ['Acesso restrito ×2', 29.6, 15, 2.0, 'h', 'confirmado (C11, C13, D06)'], ['Corredor banheiros', 32.5, 15, 2.0, 'h', 'confirmado (D02, D05, D06)'], ['Frente Nexo', 36.1, 15, 4.2, 'h', 'confirmado (D02, H15)'],
    ['Acesso às salas 1, 2 e 3', 39.5, 15, 2.0, 'h', 'confirmado (C12, C15)'], ['Porta', 41.35, 15, 0.9, 'h', 'confirmado (C12)'],
    ['Saída envidraçada do café', 0, 10.5, 1.8, 'v', 'confirmado (D01, D03)'],
  ],
  'escada': {'r': [42.6, 3.4, 43.85, 12.45], 'sobe': '2 lances de 12 degraus com patamar (z 7,0–8,2), do lado da fachada para o interno, até +4,2 m', 'navegavel': True, 'conf': 'confirmado (H04, H07, H14); degraus estimados'},
  'niveis': {'terreo': 0, 'primeiro_andar': 4.2, 'areas_navegaveis': [[0, 11.7, 44, 20], [44, 0.06, 55, 20]],
             'guarda_corpo': [[10.5, 11.7, 42.25, 11.7], [44, 0.06, 44, 11.7]], 'vidro_acioc_na_borda': [[0.15, 11.78, 10.5, 11.78]]},
  'primeiro_andar': {
    'fonte': '45 fotos E01–E45 + 16.32.03 (X46: ACIOC visto do térreo) + 16.32.04 (X47: palco, escada e Incubadora). Sem planta oficial: limites estimados.',
    'corredores': [['corredor da faixa interna', 10.5, 11.7, 44, 14.6, 'E08–E11, E17'], ['corredor da ala leste (poltronas)', 44, 0.06, 46.5, 14.6, 'E31, E32, E44, E45, X47']],
    'ambientes': [
      ['ACIOC Hub', 0.15, 11.78, 10.5, 19.9, '#cfe8a0', 'confirmado acima do café (E11–E16, X46); vidro com grafismo na borda da laje; porta no fim do corredor (E12)'],
      ['Núcleo: escadas de emergência, elevador, banheiros', 10.5, 14.6, 32.0, 19.9, '#d8c7ad', 'confirmado (E09–E11, E17, E18) e núcleo do PDF; 2 nichos de banheiro e 2 antecâmaras de escada'],
      ['Reuniões + servidor', 32.0, 14.6, 38.0, 19.9, '#e8eef2', 'informado pelo usuário: mesa redonda, TV, armário com o cubo do servidor no alto, armário baixo junto ao vidro; porta lisa (E08)'],
      ['Podcast', 38.0, 14.6, 41.8, 19.9, '#9aa7b3', 'estúdio compacto (3,8 m): vidro transparente, painéis acústicos, mesa 1,2 × 1,6 com 4 microfones, TV (informado pelo usuário)'],
      ['Administrativo', 41.8, 14.6, 54.95, 19.9, '#ffd9b8', 'em frente à chegada da escada (E06, E07): sala de projetos, área de reuniões, sala de Dagliê e Danimara (E19–E30)'],
      ['Incubadora Joaçaba (101–103)', 46.5, 0.06, 51.6, 14.6, '#bfe0c8', 'ala leste (E31–E37, E44, E45, X47); 101 ao norte integrada, 103 ao sul'],
      ['Salas de incubação', 51.6, 0.06, 54.95, 14.6, '#d9ecf6', 'envidraçadas junto às janelas (E37–E43); portas que abrem; sem nomes de empresas'],
    ],
    'salas_internas': [['Sala de projetos', 41.8, 16.4, 44.8, 19.9], ['Sala de Dagliê e Danimara', 50.4, 14.6, 54.95, 19.9], ['Salinha', 46.5, 11.75, 49.2, 14.6]],
    'nichos_banheiro': [[23.1, 14.6, 24.9, 15.8, 'feminino + veneziana (E18)'], [25.7, 14.6, 27.3, 15.8, 'PCD + veneziana (E10)']],
    'antecamaras_escada': [[11.95, 14.6, 13.5, 16.0], [30.3, 14.6, 31.8, 16.0]],
    'portas_que_abrem': [['ACIOC Hub', 10.5, 12.7, 'v'], ['Administrativo', 42.5, 14.6, 'h'], ['sala de projetos', 44.0, 16.4, 'h'], ['sala de Dagliê e Danimara', 50.4, 15.35, 'v'],
                         ['Incubadora 101 (norte)', 46.5, 2.1, 'v'], ['Incubadora 103 (sul)', 46.5, 11.1, 'v'], ['escada de emergência oeste', 12.5, 14.6, 'h'], ['escada de emergência leste', 30.85, 14.6, 'h']]
                        + [['sala de incubação', 51.6, z, 'v'] for z in (2.35, 5.25, 8.15, 11.05, 12.5)],
    'elevador': [14.6, 14.6], 'chegada_escada': [43.2, 12.45],
    'npcs': [['Keila (térreo, atrás do balcão; atendimento em x 17,3, z 7,75)', 17.3, 9.2], ['Dagliê (entrada da sala)', 52.6, 15.65], ['Danimara (mais para dentro)', 52.6, 18.35]],
    'empresas_nomeadas': 'nenhuma: a Incubadora funciona por ciclos e o jogo não associa salas a empresas',
  },
  'anexos': [{'nome': 'corredor banheiros / Nexo', 'r': [31.5, 15, 33.5, 20], 'pe': 3.0, 'fundo': 'porta envidraçada'}],
  'fotos': [
    ['H04', 18, 6.5, 44, 6.5], ['H09', 38, 7, 0, 4], ['H22', 19.0, 5.0, 20, 12], ['H24', 5, 7, 25, 4], ['C01', 19.3, 4.9, 22.6, 1.3], ['C02', 24.5, 6.5, 24.5, 12.5],
    ['C07', 14.2, 11.3, 13.2, 15], ['C08', 16.8, 13.6, 17.5, 3], ['C11', 32, 10.2, 27.2, 14.5], ['C12', 40.8, 7.8, 36.5, 14.2], ['C20', 5.6, 9.8, 0, 9.7], ['C06', 14.6, 13.3, 24, 14.7],
    ['H26m', 12.2, 12.3, 7, 2.5], ['H29m', 18.5, 12.3, 21.5, 2.5], ['X46', 21, 8, 6, 13], ['X47', 22, 7, 44, 7],
  ],
  'fotos_primeiro_andar': [['E06', 43.2, 12.3, 43.2, 16], ['E08', 42.5, 13.2, 30, 13.2], ['E11', 16.5, 13, 10, 13], ['E12', 12, 13, 9, 13], ['E15', 8, 18.5, 3, 13],
    ['E17', 12, 13, 30, 12.5], ['E22', 53, 15.5, 49, 19], ['E27', 43, 16.6, 43, 19.5], ['E31', 45.3, 13, 45.8, 2], ['E33', 47.5, 11, 49, 14], ['E44', 45.4, 9, 45, 0.5]],
}
json.dump(P, open(f'{OUT}/planta-hall-v2.json', 'w'), ensure_ascii=False, indent=1)

K, OX, OY = 22, 70, 120              # px por metro, margens
X = lambda x: OX + x * K; Y = lambda z: OY + z * K
s = []
W, H = int(X(L) + 330), 1720
s.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Figtree, Helvetica, Arial, sans-serif">')
s.append('<defs><pattern id="hach" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#6a8db8" stroke-width="2" opacity=".35"/></pattern>'
         '<marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c2410c"/></marker></defs>')
s.append(f'<rect width="{W}" height="{H}" fill="#f7fbff"/>')
s.append(f'<text x="{OX}" y="40" font-size="24" font-weight="800" fill="#0c2c4a">Hall do Polo Inovale · planta v2.1 (térreo + 1º andar navegável)</text>')
s.append(f'<text x="{OX}" y="66" font-size="13" fill="#3c5d7a">Fontes: H01–H32, C01–C21, D01–D06, E01–E45, 16.32.03/04 (X46, X47) + planta do ático (PDF). Comprimento e pilares: PDF; o resto: estimado.</text>')
s.append(f'<text x="{OX}" y="86" font-size="13" fill="#3c5d7a">x: parede do café (0) → parede do palco ({L:.0f} m) · z: fachada de vidro (0) → parede interna revestida de madeira ({D:.0f} m)</text>')
# grade de 1 m
for i in range(int(L) + 1): s.append(f'<line x1="{X(i)}" y1="{Y(0)}" x2="{X(i)}" y2="{Y(D)}" stroke="#e3ebf2" stroke-width="{1.2 if i % 5 == 0 else .5}"/>')
for j in range(int(D) + 1): s.append(f'<line x1="{X(0)}" y1="{Y(j)}" x2="{X(L)}" y2="{Y(j)}" stroke="#e3ebf2" stroke-width="{1.2 if j % 5 == 0 else .5}"/>')
# mezanino (hachurado)
for m in P['mezanino']:
    x0, z0, x1, z1 = m['r']
    if x0 >= L: continue          # a ala leste aparece na planta do 1º andar
    z1 = min(z1, D)
    s.append(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="url(#hach)" stroke="#6a8db8" stroke-width="1.5" stroke-dasharray="6 4"/>')
s.append(f'<text x="{X(1.2)}" y="{Y(14.15)}" font-size="11" fill="#3f6fa8" font-weight="700">1º ANDAR (piso +4,2 m) · corredor navegável · guarda-corpo com vão da escada em x 42,3–44</text>')
s.append(f'<text x="{X(14)}" y="{Y(6.3)}" font-size="20" fill="#9bb6d6" font-weight="800" letter-spacing="3">VAZIO · PÉ-DIREITO DUPLO (~8 m)</text>')
# zonas
for n, x0, z0, x1, z1, cor, conf in P['zonas']:
    dash = ' stroke-dasharray="5 3"' if conf.startswith(('incerto', 'provável')) else ''
    fill = 'none' if cor == 'none' else cor
    s.append(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" rx="4" fill="{fill}" fill-opacity="{0 if cor=="none" else .75}" stroke="#0b3a6e" stroke-width="1.6"{dash}/>')
lab = {z[0]: ((z[1] + z[3]) / 2 - 1.2, (z[2] + z[4]) / 2 + 0.15, z[0].split(' (')[0].split(':')[0]) for z in P['zonas']}
for n, (x, z, t) in lab.items():
    cor = '#fff' if n.startswith('Palco') else '#0c2c4a'
    if n.startswith('Balcão do café'): s.append(f'<text x="{X(x)}" y="{Y(z)}" font-size="11" fill="#ffffff" text-anchor="middle">{t}</text>')
    else: s.append(f'<text x="{X(x)}" y="{Y(z)}" font-size="{13 if t.isupper() or "·" in t else 11}" font-weight="{800 if t.split(" ")[0].isupper() else 600}" fill="{cor}">{t}</text>')
# telão e escada
s.append(f'<rect x="{X(42.15)}" y="{Y(3.3)}" width="{0.25*K}" height="{6*K}" fill="#111"/>')
x0, z0, x1, z1 = P['escada']['r']
s.append(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="#efe4d3" stroke="#0b3a6e" stroke-width="1.4"/>')
for k in range(1, 25): s.append(f'<line x1="{X(x0)}" y1="{Y(z0 + k * (z1 - z0) / 24)}" x2="{X(x1)}" y2="{Y(z0 + k * (z1 - z0) / 24)}" stroke="#b9a68a" stroke-width=".7"/>')
s.append(f'<line x1="{X((x0+x1)/2)}" y1="{Y(z0+0.3)}" x2="{X((x0+x1)/2)}" y2="{Y(z1-0.3)}" stroke="#c2410c" stroke-width="2" marker-end="url(#seta)"/>')
s.append(f'<text x="{X(44.4)}" y="{Y(7)}" font-size="11" fill="#7a3d00">escada (2 lances)</text><text x="{X(44.4)}" y="{Y(7)+14}" font-size="11" fill="#7a3d00">sobe ao 1º andar</text>')
# paredes
s.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(L)}" y2="{Y(0)}" stroke="#2f9be8" stroke-width="6"/>')
s.append(f'<line x1="{X(16.6)}" y1="{Y(0)}" x2="{X(24.0)}" y2="{Y(0)}" stroke="#9aa7b3" stroke-width="8"/>')
s.append(f'<text x="{X(20.3)}" y="{Y(0)-22}" font-size="10" fill="#5c6b78" text-anchor="middle">parede branca da entrada (H29)</text>')
s.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(0)}" y2="{Y(D)}" stroke="#2f9be8" stroke-width="6"/>')
s.append(f'<line x1="{X(L)}" y1="{Y(0)}" x2="{X(L)}" y2="{Y(D)}" stroke="#8a6a46" stroke-width="6"/>')
s.append(f'<line x1="{X(0)}" y1="{Y(D)}" x2="{X(L)}" y2="{Y(D)}" stroke="#8a6a46" stroke-width="6"/>')
s.append(f'<text x="{X(L/2)}" y="{Y(0)-10}" font-size="13" font-weight="800" fill="#1d6fb8" text-anchor="middle">FACHADA DE VIDRO · pé-direito duplo · faixa fosca com triângulos · persianas em cima</text>')
s.append(f'<text x="{X(L/2)}" y="{Y(D)+22}" font-size="13" font-weight="800" fill="#7a5530" text-anchor="middle">PAREDE INTERNA revestida "madeira" (porcelanato) · forro baixo +3,2 sob o mezanino</text>')
s.append(f'<text x="{X(0)-14}" y="{Y(7.5)}" font-size="11" fill="#1d6fb8" text-anchor="middle" transform="rotate(-90 {X(0)-14} {Y(7.5)})">fundo envidraçado do café + saída</text>')
# portas
for n, x, z, w, o, conf in P['portas']:
    dash = ' stroke-dasharray="4 3"' if conf.startswith('incerto') else ''
    if o == 'h': s.append(f'<line x1="{X(x - w/2)}" y1="{Y(z)}" x2="{X(x + w/2)}" y2="{Y(z)}" stroke="#ff8a3d" stroke-width="9"{dash}/>')
    else: s.append(f'<line x1="{X(x)}" y1="{Y(z - w/2)}" x2="{X(x)}" y2="{Y(z + w/2)}" stroke="#ff8a3d" stroke-width="9"{dash}/>')
s.append(f'<text x="{X(14.75)}" y="{Y(0)+30}" font-size="12" font-weight="800" fill="#c2410c" text-anchor="middle">▲ ENTRADA</text>')
s.append(f'<rect x="{X(9.85)}" y="{Y(15)}" width="{16.32*K}" height="{12}" fill="#7c3aed" opacity=".35"/><text x="{X(18)}" y="{Y(15)+40}" font-size="11" font-weight="700" fill="#5b21b6" text-anchor="middle">núcleo de circulação do PDF (2 escadas + banheiros) atrás da parede, x 9,85–26,17</text>')
for n, x, t in [('c', 9.15, 'serviço café'), ('v', 11.75, 'ven.'), ('e', 12.75, 'esc.'), ('el', 14.6, 'elev.'), ('b', 21.2, 'banh.'), ('r', 29.6, 'restrito'), ('v2', 32.5, 'corredor'), ('n', 36.1, 'Nexo'), ('s', 39.5, 'salas 1–3')]:
    s.append(f'<text x="{X(x)}" y="{Y(D)-6}" font-size="10" fill="#c2410c" text-anchor="middle">{t}</text>')
# pilares
for x, z, d, conf in P['pilares']:
    dash = ' stroke-dasharray="3 2"' if conf.startswith(('estimado', 'provável')) else ''
    s.append(f'<circle cx="{X(x)}" cy="{Y(z)}" r="{d/2*K}" fill="#b8ab98" stroke="#5a4a36" stroke-width="1.6"{dash}/>')
# câmeras das fotos
for n, cx, cz, tx, tz in P['fotos']:
    a = math.atan2(tz - cz, tx - cx); ex, ez = cx + math.cos(a) * 1.6, cz + math.sin(a) * 1.6
    cor = '#7c3aed' if n.endswith('m') else '#0b8a95'
    s.append(f'<line x1="{X(cx)}" y1="{Y(cz)}" x2="{X(ex)}" y2="{Y(ez)}" stroke="{cor}" stroke-width="1.6" marker-end="url(#seta)" opacity=".85"/>')
    s.append(f'<circle cx="{X(cx)}" cy="{Y(cz)}" r="3" fill="{cor}"/><text x="{X(cx)+4}" y="{Y(cz)-4}" font-size="9" font-weight="700" fill="{cor}">{n.rstrip("m")}</text>')
# régua e legenda
s.append(f'<line x1="{X(0)}" y1="{Y(D)+46}" x2="{X(10)}" y2="{Y(D)+46}" stroke="#0c2c4a" stroke-width="2"/><text x="{X(0)}" y="{Y(D)+62}" font-size="11" fill="#0c2c4a">0</text><text x="{X(10)-14}" y="{Y(D)+62}" font-size="11" fill="#0c2c4a">10 m</text>')
lx = X(L) + 120; ly = OY + 10
leg = [('#2f9be8', 'linha', 'fachada de vidro'), ('#8a6a46', 'linha', 'parede revestida'), ('#ff8a3d', 'linha', 'porta / acesso'), ('url(#hach)', 'ret', '1º andar (projeção)'),
       ('#b8ab98', 'circ', 'pilar Ø ~0,6 m'), ('#0b8a95', 'cam', 'foto (térreo)'), ('#7c3aed', 'cam', 'foto (do mezanino)'), ('none', 'trac', 'tracejado = incerto')]
s.append(f'<text x="{lx}" y="{ly}" font-size="13" font-weight="800" fill="#0c2c4a">LEGENDA</text>')
for i, (c, t, txt) in enumerate(leg):
    y = ly + 22 + i * 22
    if t == 'linha': s.append(f'<line x1="{lx}" y1="{y-4}" x2="{lx+26}" y2="{y-4}" stroke="{c}" stroke-width="6"/>')
    elif t == 'ret': s.append(f'<rect x="{lx}" y="{y-12}" width="26" height="14" fill="{c}" stroke="#6a8db8" stroke-dasharray="4 3"/>')
    elif t == 'circ': s.append(f'<circle cx="{lx+13}" cy="{y-5}" r="7" fill="{c}" stroke="#5a4a36"/>')
    elif t == 'cam': s.append(f'<line x1="{lx+2}" y1="{y-4}" x2="{lx+24}" y2="{y-4}" stroke="{c}" stroke-width="1.6" marker-end="url(#seta)"/>')
    else: s.append(f'<rect x="{lx}" y="{y-12}" width="26" height="14" fill="none" stroke="#0b3a6e" stroke-dasharray="5 3"/>')
    s.append(f'<text x="{lx+34}" y="{y}" font-size="12" fill="#0c2c4a">{txt}</text>')

# ---------- 1º andar (+4,2 m) ----------
P1 = P['primeiro_andar']; OY1 = 690; Y1 = lambda z: OY1 + z * K
s.append(f'<text x="{OX}" y="{OY1 - 40}" font-size="20" font-weight="800" fill="#0c2c4a">1º andar (+4,2 m) · faixa interna + ala leste sobre o palco · limites estimados pelas fotos</text>')
s.append(f'<rect x="{X(0)}" y="{Y1(0)}" width="{44*K}" height="{11.7*K}" fill="#eef5fb" stroke="#9bb6d6" stroke-dasharray="6 4"/><text x="{X(16)}" y="{Y1(6)}" font-size="18" font-weight="800" fill="#9bb6d6" letter-spacing="3">VAZIO DO HALL</text>')
for n, x0, z0, x1, z1, ref in P1['corredores']: s.append(f'<rect x="{X(x0)}" y="{Y1(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="#f4efe6" stroke="#b9a68a"/>')
for n, x0, z0, x1, z1, cor, conf in P1['ambientes']:
    s.append(f'<rect x="{X(x0)}" y="{Y1(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="{cor}" fill-opacity=".85" stroke="#0b3a6e" stroke-width="1.6"/>')
    if (x1 - x0) > 4: s.append(f'<text x="{X(x0)+6}" y="{Y1(z0)+16}" font-size="11" font-weight="800" fill="#0c2c4a">{n}</text>')
    else: s.append(f'<text x="{X((x0+x1)/2)}" y="{Y1((z0+z1)/2)}" font-size="9" font-weight="700" fill="#0c2c4a" text-anchor="middle" transform="rotate(-90 {X((x0+x1)/2)} {Y1((z0+z1)/2)})">{n}</text>')
for n, x0, z0, x1, z1 in P1['salas_internas']: s.append(f'<rect x="{X(x0)}" y="{Y1(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="none" stroke="#2f9be8" stroke-width="2"/><text x="{X(x0)+4}" y="{Y1(z1)-6}" font-size="9" fill="#1d6fb8">{n}</text>')
for x0, z0, x1, z1, n in P1['nichos_banheiro']: s.append(f'<rect x="{X(x0)}" y="{Y1(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="#f4efe6" stroke="#8a6a46" stroke-width="1.5"/><text x="{X((x0+x1)/2)}" y="{Y1(z1)+10}" font-size="8" fill="#7a5530" text-anchor="middle">WC</text>')
for x0, z0, x1, z1 in P1['antecamaras_escada']: s.append(f'<rect x="{X(x0)}" y="{Y1(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="#e7e6e2" stroke="#1d8a3c" stroke-width="1.5"/>')
for z0 in [3.0, 5.9, 8.8, 11.7]: s.append(f'<line x1="{X(51.6)}" y1="{Y1(z0)}" x2="{X(54.95)}" y2="{Y1(z0)}" stroke="#2f9be8" stroke-width="1.5"/>')
for a in P['niveis']['guarda_corpo']: s.append(f'<line x1="{X(a[0])}" y1="{Y1(a[1])}" x2="{X(a[2])}" y2="{Y1(a[3])}" stroke="#7a7a7a" stroke-width="5"/>')
for a in P['niveis']['vidro_acioc_na_borda']: s.append(f'<line x1="{X(a[0])}" y1="{Y1(a[1])}" x2="{X(a[2])}" y2="{Y1(a[3])}" stroke="#7aa21a" stroke-width="5"/>')
s.append(f'<rect x="{X(42.6)}" y="{Y1(3.4)}" width="{1.25*K}" height="{9.05*K}" fill="#efe4d3" stroke="#0b3a6e"/><text x="{X(42.4)}" y="{Y1(7.5)}" font-size="10" fill="#7a3d00" text-anchor="end">escada ↑</text>')
s.append(f'<rect x="{X(14.05)}" y="{Y1(14.6)}" width="{1.1*K}" height="{1.4*K}" fill="#555"/><text x="{X(14.6)}" y="{Y1(16.6)}" font-size="9" fill="#fff" text-anchor="middle">elev.</text>')
for n, x, z, o in P1['portas_que_abrem']:
    if o == 'h': s.append(f'<line x1="{X(x-0.5)}" y1="{Y1(z)}" x2="{X(x+0.5)}" y2="{Y1(z)}" stroke="#ff8a3d" stroke-width="7"/>')
    else: s.append(f'<line x1="{X(x)}" y1="{Y1(z-0.5)}" x2="{X(x)}" y2="{Y1(z+0.5)}" stroke="#ff8a3d" stroke-width="7"/>')
for n, x, z in P1['npcs'][1:]: s.append(f'<circle cx="{X(x)}" cy="{Y1(z)}" r="5" fill="#ff6f9e" stroke="#b8235a"/><text x="{X(x)}" y="{Y1(z)+16}" font-size="9" fill="#b8235a" text-anchor="middle">{n}</text>')
for x, z, d, conf in P['pilares']:
    if z > 11: s.append(f'<circle cx="{X(x)}" cy="{Y1(z)}" r="{d/2*K}" fill="#b8ab98" stroke="#5a4a36"/>')
s.append(f'<circle cx="{X(44.62)}" cy="{Y1(0.7)}" r="{0.25*K}" fill="#b8ab98" stroke="#5a4a36"/>')
for n, cx, cz, tx, tz in P['fotos_primeiro_andar']:
    a = math.atan2(tz - cz, tx - cx); ex, ez = cx + math.cos(a) * 1.4, cz + math.sin(a) * 1.4
    s.append(f'<line x1="{X(cx)}" y1="{Y1(cz)}" x2="{X(ex)}" y2="{Y1(ez)}" stroke="#0b8a95" stroke-width="1.6" marker-end="url(#seta)"/><text x="{X(cx)+4}" y="{Y1(cz)-4}" font-size="9" font-weight="700" fill="#0b8a95">{n}</text>')
s.append(f'<text x="{X(44.2)}" y="{Y1(20)+18}" font-size="10" fill="#c2410c">ala leste: largura estimada (X47); o PDF do ático indica prédio de 44 m</text>')

# ---------- corte transversal em x ≈ 20 (pela recepção) ----------
CY, CK = 1220, 26        # base do corte em px e px/m
CX = lambda z: OX + 60 + z * CK; CZ = lambda y: CY + 300 - y * CK
s.append(f'<text x="{OX}" y="{CY - 10}" font-size="18" font-weight="800" fill="#0c2c4a">Corte transversal A–A (em x ≈ 18 m, pela recepção) · alturas estimadas</text>')
s.append(f'<line x1="{CX(-1)}" y1="{CZ(0)}" x2="{CX(D+1)}" y2="{CZ(0)}" stroke="#0c2c4a" stroke-width="3"/>')
s.append(f'<rect x="{CX(-0.15)}" y="{CZ(8)}" width="{0.15*CK}" height="{8*CK}" fill="#9fd4ff" stroke="#2f9be8" stroke-width="2"/>')
for yy in (1.0, 1.6): s.append(f'<line x1="{CX(-0.6)}" y1="{CZ(yy)}" x2="{CX(0)}" y2="{CZ(yy)}" stroke="#2f9be8" stroke-width="1"/>')
s.append(f'<text x="{CX(-0.4)}" y="{CZ(4)}" font-size="11" fill="#1d6fb8" transform="rotate(-90 {CX(-0.4)} {CZ(4)})" text-anchor="middle">fachada de vidro ~8 m</text>')
s.append(f'<line x1="{CX(0)}" y1="{CZ(8)}" x2="{CX(D)}" y2="{CZ(8)}" stroke="#7d93a6" stroke-width="3"/><text x="{CX(5)}" y="{CZ(8)-6}" font-size="11" fill="#3c5d7a">forro do vazio ~ +8,0 m (placas + painéis de LED + ar-condicionado cassete)</text>')
s.append(f'<rect x="{CX(12)}" y="{CZ(4.2)}" width="{3*CK}" height="{1.0*CK}" fill="#b8ab98" stroke="#5a4a36"/>')
s.append(f'<rect x="{CX(12)}" y="{CZ(5.3)}" width="{0.12*CK}" height="{1.1*CK}" fill="#7a7a7a"/><line x1="{CX(11.9)}" y1="{CZ(5.3)}" x2="{CX(12.3)}" y2="{CZ(5.3)}" stroke="#aab" stroke-width="3"/>')
s.append(f'<rect x="{CX(13)}" y="{CZ(7.4)}" width="{2*CK}" height="{3.2*CK}" fill="#d8ecfa" stroke="#6a8db8" stroke-dasharray="4 3"/><text x="{CX(13.1)}" y="{CZ(6)}" font-size="10" fill="#3f6fa8">salas 1º andar</text>')
s.append(f'<line x1="{CX(12)}" y1="{CZ(3.2)}" x2="{CX(15)}" y2="{CZ(3.2)}" stroke="#7d93a6" stroke-width="2"/><text x="{CX(12.2)}" y="{CZ(3.2)+14}" font-size="10" fill="#3c5d7a">forro +3,2</text>')
s.append(f'<rect x="{CX(15)}" y="{CZ(8)}" width="{0.25*CK}" height="{8*CK}" fill="#8a6a46"/>')
s.append(f'<rect x="{CX(11.7)}" y="{CZ(4.2)}" width="{0.6*CK}" height="{4.2*CK}" fill="#b8ab98" stroke="#5a4a36"/><text x="{CX(11.2)}" y="{CZ(2)}" font-size="10" fill="#5a4a36" text-anchor="end">pilar</text>')
s.append(f'<rect x="{CX(8.6)}" y="{CZ(2.6)}" width="{3*CK}" height="{0.1*CK}" fill="#fff" stroke="#0b3a6e"/><rect x="{CX(8.6)}" y="{CZ(1.1)}" width="{3*CK}" height="{1.1*CK}" fill="#ff8a3d" stroke="#0b3a6e"/><text x="{CX(8.7)}" y="{CZ(2.9)}" font-size="10" fill="#c2410c">recepção (balcão 1,1 · cobertura ~2,6, topo impresso visto do mezanino)</text>')
s.append(f'<rect x="{CX(14.95)}" y="{CZ(2.1)}" width="{0.06*CK}" height="{2.1*CK}" fill="#ff8a3d"/><text x="{CX(15.4)}" y="{CZ(1)}" font-size="10" fill="#c2410c">porta 2,1</text>')
# boneco de 1,30 m para escala
bx = CX(6)
s.append(f'<ellipse cx="{bx}" cy="{CZ(0.3)}" rx="{0.33*CK}" ry="{0.3*CK}" fill="#1f4fe0"/><circle cx="{bx}" cy="{CZ(1.0)}" r="{0.3*CK}" fill="#1f4fe0"/><text x="{bx}" y="{CZ(1.45)}" font-size="10" fill="#1f4fe0" text-anchor="middle">boneco 1,30</text>')
for y, t in [(0, '0'), (3.2, '+3,2'), (4.2, '+4,2'), (5.3, '+5,3'), (8, '+8,0')]:
    s.append(f'<line x1="{CX(D+0.6)}" y1="{CZ(y)}" x2="{CX(D+1.0)}" y2="{CZ(y)}" stroke="#0c2c4a"/><text x="{CX(D+1.2)}" y="{CZ(y)+4}" font-size="11" fill="#0c2c4a">{t}</text>')
s.append(f'<text x="{CX(1)}" y="{CZ(6)}" font-size="16" font-weight="800" fill="#9bb6d6">VAZIO · PÉ-DIREITO DUPLO</text>')
s.append(f'<text x="{CX(0)}" y="{CZ(0)+20}" font-size="11" fill="#3c5d7a">fachada (z=0)</text><text x="{CX(D)}" y="{CZ(0)+20}" font-size="11" fill="#3c5d7a" text-anchor="end">parede interna (z=15)</text>')
s.append('</svg>')
open(f'{OUT}/planta-hall-v2.svg', 'w').write('\n'.join(s))
print('ok')
