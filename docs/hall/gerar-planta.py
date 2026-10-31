# Gera planta-hall-v0.svg e .json (uso: python3 docs/hall/gerar-planta.py docs/hall). Números = estimativas da ANALISE-HALL.md.
import json, math, sys
OUT = sys.argv[1]
L, D = 42.0, 15.0          # comprimento (café → palco) e profundidade (fachada → parede interna), estimados
P = {
  'eixos': 'x: da parede do café (0) à parede do palco (42); z: da fachada de vidro (0) à parede interna revestida de madeira (15). Metros, ESTIMADOS.',
  'salao': {'comprimento': L, 'profundidade': D, 'peDireitoVazio': 8.0, 'forroSobMezanino': 3.2, 'pisoMezanino': 4.2, 'peitorilMezanino': 1.1, 'piso': 0.9},
  'mezanino': [  # retângulos x0,z0,x1,z1 do 1º andar (o vazio é o resto)
    {'nome': 'faixa ao longo da parede interna', 'r': [0, 12, 42, 15], 'conf': 'confirmado (H05, H22, H26-H30)'},
    {'nome': 'mezanino do café (coworking em cima)', 'r': [0, 6.5, 5, 12], 'conf': 'confirmado (H32); profundidade estimada'},
    {'nome': 'mezanino do fundo do palco', 'r': [40.2, 0, 42, 12], 'conf': 'confirmado acima do telão (H04, H07); se chega à fachada é incerto'},
  ],
  'pilares': [  # x, z, diâmetro, confiança
    [5, 12, 0.6, 'provável (H23, H32)'], [13.5, 12, 0.6, 'estimado'], [21.5, 12, 0.6, 'confirmado (H22, atrás da recepção)'],
    [29.5, 12, 0.6, 'confirmado (H05, H06)'], [37.5, 12, 0.6, 'provável (H05)'], [12.4, 0.7, 0.6, 'confirmado (H24, junto à porta)'],
  ],
  'zonas': [  # nome, x0,z0,x1,z1, cor, confiança da posição
    ['Café: mesas redondas + cadeiras amarelas', 1.5, 3.0, 11.5, 9.8, '#ffe08a', 'confirmado (H01, H23, H24, H26, H30)'],
    ['Bancada alta com banquetas', 6.5, 1.4, 12.0, 2.1, '#d9b98c', 'confirmado (H01, H24, H26, H29)'],
    ['Balcão do café "Pin"', 0.1, 7.0, 1.1, 12.4, '#2b2b2b', 'confirmado (H23, H31, H32)'],
    ['Marquise interna da entrada', 12.4, 0.0, 18.0, 3.0, 'none', 'confirmado (H02, H24, H29, H30)'],
    ['Floreiras (2, em fila, perpendiculares à fachada)', 17.4, 0.7, 18.4, 3.3, '#9fd17a', 'confirmado (H22, H26, H29)'],
    ['Banco branco + poltrona amarela', 19.0, 0.8, 21.0, 2.5, '#ffffff', 'confirmado (H26, H29)'],
    ['Recepção (quiosque branco/laranja)', 15.5, 8.6, 23.0, 11.6, '#ff8a3d', 'confirmado; medidas estimadas (H19-H22, H24-H30)'],
    ['Arco A (patrocinadores)', 21.2, 0.15, 23.6, 3.4, '#ffffff', 'confirmado: encostado na parede branca da entrada, painel virado para o hall (H03, H29)'],
    ['Arco B (cadeiras amarelas)', 24.0, 9.0, 27.0, 11.8, '#ffffff', 'provável (H10, H16, H18, H20, H22)'],
    ['Plateia (cadeiras pretas)', 27.0, 2.0, 36.0, 10.5, '#c9ced6', 'confirmado; nº de fileiras estimado (H04-H06, H09, H27-H29)'],
    ['Bancos "Dê um ... na fome"', 26.0, 0.25, 37.0, 0.9, '#d9b98c', 'confirmado (H08, H27-H29)'],
    ['Palco + telão de LED', 37.0, 2.5, 40.5, 10.0, '#3a3a3a', 'confirmado (H04, H07, H14)'],
    ['Estar (árvore, poltrona, tapete)', 29.0, 12.4, 31.8, 14.6, '#e6eef5', 'confirmado; posição aproximada (H06, H10, H12)'],
    ['Balcões "Acesso às salas 1, 2 e 3"', 32.5, 12.6, 36.2, 13.6, '#3f6fd8', 'confirmado; posição aproximada (H12, H13, H15)'],
    ['Sala de vidro "nexo"', 37.0, 12.6, 40.0, 15.0, '#bfe6ff', 'incerto (H11, H15)'],
  ],
  'portas': [  # nome, x, z, largura, orientação ('h' na fachada / 'v' paredes laterais), confiança
    ['Entrada principal (portas de vidro)', 14.75, 0, 3.4, 'h', 'confirmado (H02, H26, H29, H30)'],
    ['Porta secundária do canto do café', 0, 2.8, 1.6, 'v', 'incerto (tapete em H30)'],
    ['Escada de emergência (porta c/ bonecos)', 14.2, 15, 0.9, 'h', 'confirmado (H22, H23, H24)'],
    ['Elevador', 19.6, 15, 1.1, 'h', 'confirmado (H20, H21)'],
    ['Acesso às salas 1, 2 e 3', 35.2, 15, 1.4, 'h', 'confirmado; posição aproximada (H12, H13)'],
    ['Acesso restrito', 30.3, 15, 0.9, 'h', 'confirmado; posição aproximada (H10, H12)'],
  ],
  'paredeEntrada': {'x0': 16.6, 'x1': 24.0, 'conf': 'confirmado (H29): trecho de parede branca na fachada, à direita das portas; o arco A encosta nele'},
  'escada': {'r': [40.6, 3.5, 41.9, 10.5], 'sobe': 'de z=3,5 (lado da fachada, atrás do telão) até z=10,5 (lado interno), chegando ao mezanino a +4,2 m', 'conf': 'confirmado (H04, H07, H14)'},
  'fotos': [  # câmera (x,z) → alvo (x,z); 'm' = tirada do mezanino
    ['H01', 13, 4, 0, 2], ['H02', 14.8, 4, 14.8, 0], ['H03', 17, 4.5, 30, 6], ['H04', 18, 6.5, 42, 6.5], ['H05', 22, 8, 40, 11],
    ['H06', 31, 9, 36, 15], ['H07', 34, 6.5, 42, 6.5], ['H08', 31, 3, 20, 1], ['H09', 36, 7, 0, 4], ['H10', 28, 10, 30, 15],
    ['H13', 33, 10.5, 34, 15], ['H14', 38, 11, 42, 12], ['H16', 26, 8.5, 0, 9], ['H22', 19.0, 5.0, 20, 12], ['H23', 9, 5, 0, 10],
    ['H24', 5, 7, 25, 4], ['H25', 12, 11.5, 40, 14], ['H31', 5, 9.5, 0, 9.5],
    ['H26m', 15, 12.3, 8, 3], ['H28m', 19, 12.3, 27, 4], ['H30m', 11, 12.3, 5, 2],
  ],
}
json.dump(P, open(f'{OUT}/planta-hall-v0.json', 'w'), ensure_ascii=False, indent=1)

K, OX, OY = 22, 70, 120              # px por metro, margens
X = lambda x: OX + x * K; Y = lambda z: OY + z * K
s = []
W, H = int(X(L) + 330), 940
s.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Figtree, Helvetica, Arial, sans-serif">')
s.append('<defs><pattern id="hach" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#6a8db8" stroke-width="2" opacity=".35"/></pattern>'
         '<marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c2410c"/></marker></defs>')
s.append(f'<rect width="{W}" height="{H}" fill="#f7fbff"/>')
s.append(f'<text x="{OX}" y="40" font-size="24" font-weight="800" fill="#0c2c4a">Hall do Polo Inovale · planta estimada v0 (térreo + projeção do 1º andar)</text>')
s.append(f'<text x="{OX}" y="66" font-size="13" fill="#3c5d7a">Reconstruída a partir das 32 fotos (H01–H32). Todas as medidas são ESTIMADAS (piso ~0,90 m como régua). Tracejado = posição incerta.</text>')
s.append(f'<text x="{OX}" y="86" font-size="13" fill="#3c5d7a">x: parede do café (0) → parede do palco ({L:.0f} m) · z: fachada de vidro (0) → parede interna revestida de madeira ({D:.0f} m)</text>')
# grade de 1 m
for i in range(int(L) + 1): s.append(f'<line x1="{X(i)}" y1="{Y(0)}" x2="{X(i)}" y2="{Y(D)}" stroke="#e3ebf2" stroke-width="{1.2 if i % 5 == 0 else .5}"/>')
for j in range(int(D) + 1): s.append(f'<line x1="{X(0)}" y1="{Y(j)}" x2="{X(L)}" y2="{Y(j)}" stroke="#e3ebf2" stroke-width="{1.2 if j % 5 == 0 else .5}"/>')
# mezanino (hachurado)
for m in P['mezanino']:
    x0, z0, x1, z1 = m['r']
    s.append(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="url(#hach)" stroke="#6a8db8" stroke-width="1.5" stroke-dasharray="6 4"/>')
s.append(f'<text x="{X(1.2)}" y="{Y(14.15)}" font-size="11" fill="#3f6fa8" font-weight="700">1º ANDAR por cima (piso +4,2 m) · borda com guarda-corpo de granito + inox em z ≈ 12</text>')
s.append(f'<text x="{X(14)}" y="{Y(6.3)}" font-size="20" fill="#9bb6d6" font-weight="800" letter-spacing="3">VAZIO · PÉ-DIREITO DUPLO (~8 m)</text>')
# zonas
for n, x0, z0, x1, z1, cor, conf in P['zonas']:
    dash = ' stroke-dasharray="5 3"' if conf.startswith(('incerto', 'provável')) else ''
    fill = 'none' if cor == 'none' else cor
    s.append(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" rx="4" fill="{fill}" fill-opacity="{0 if cor=="none" else .75}" stroke="#0b3a6e" stroke-width="1.6"{dash}/>')
lab = {'Café: mesas redondas + cadeiras amarelas': (2, 6.5, 'CAFÉ · ~12 mesas Ø0,9'), 'Bancada alta com banquetas': (6.7, 1.15, 'bancada alta'),
       'Balcão do café "Pin"': (1.5, 9.7, 'balcão do café'), 'Marquise interna da entrada': (12.6, 2.6, 'marquise (forro +3,2)'),
       'Floreiras (2, em fila, perpendiculares à fachada)': (17.0, 3.9, 'floreiras'), 'Banco branco + poltrona amarela': (19.05, 3.0, 'banco · poltrona'), 'Recepção (quiosque branco/laranja)': (16.2, 10.4, 'RECEPÇÃO INOVALE'),
       'Arco A (patrocinadores)': (21.5, 2.0, 'arco A'), 'Arco B (cadeiras amarelas)': (24.3, 10.6, 'arco B'),
       'Plateia (cadeiras pretas)': (28.6, 6.0, 'PLATEIA · ~9 fileiras'), 'Bancos "Dê um ... na fome"': (26.2, 1.7, 'bancos junto à fachada'),
       'Palco + telão de LED': (37.2, 6.4, 'PALCO'), 'Estar (árvore, poltrona, tapete)': (29.1, 13.7, 'estar'),
       'Balcões "Acesso às salas 1, 2 e 3"': (32.6, 13.3, 'balcões'), 'Sala de vidro "nexo"': (37.2, 14.0, 'sala "nexo"?')}
for n, (x, z, t) in lab.items():
    cor = '#fff' if n in ('Palco + telão de LED', 'Balcão do café "Pin"', 'Balcões "Acesso às salas 1, 2 e 3"') and n != 'Balcão do café "Pin"' else '#0c2c4a'
    if n == 'Balcão do café "Pin"': s.append(f'<text x="{X(x)}" y="{Y(z)}" font-size="11" fill="#0c2c4a" transform="rotate(-90 {X(x)} {Y(z)})" text-anchor="middle">{t}</text>')
    else: s.append(f'<text x="{X(x)}" y="{Y(z)}" font-size="{13 if t.isupper() or "·" in t else 11}" font-weight="{800 if t.split(" ")[0].isupper() else 600}" fill="{cor}">{t}</text>')
# telão e escada
s.append(f'<rect x="{X(40.15)}" y="{Y(3.3)}" width="{0.25*K}" height="{6*K}" fill="#111"/><text x="{X(39.0)}" y="{Y(3.0)}" font-size="10" fill="#111">telão LED ~6×3,3</text>')
x0, z0, x1, z1 = P['escada']['r']
s.append(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="#efe4d3" stroke="#0b3a6e" stroke-width="1.4"/>')
for k in range(1, 24): s.append(f'<line x1="{X(x0)}" y1="{Y(z0 + k * (z1 - z0) / 24)}" x2="{X(x1)}" y2="{Y(z0 + k * (z1 - z0) / 24)}" stroke="#b9a68a" stroke-width=".7"/>')
s.append(f'<line x1="{X((x0+x1)/2)}" y1="{Y(z0+0.3)}" x2="{X((x0+x1)/2)}" y2="{Y(z1-0.3)}" stroke="#c2410c" stroke-width="2" marker-end="url(#seta)"/>')
s.append(f'<text x="{X(42.4)}" y="{Y(7)}" font-size="11" fill="#7a3d00">escada aberta</text><text x="{X(42.4)}" y="{Y(7)+14}" font-size="11" fill="#7a3d00">sobe ao 1º andar</text>')
# paredes
s.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(L)}" y2="{Y(0)}" stroke="#2f9be8" stroke-width="6"/>')
s.append(f'<line x1="{X(16.6)}" y1="{Y(0)}" x2="{X(24.0)}" y2="{Y(0)}" stroke="#9aa7b3" stroke-width="8"/>')
s.append(f'<text x="{X(20.3)}" y="{Y(0)-22}" font-size="10" fill="#5c6b78" text-anchor="middle">parede branca da entrada (H29)</text>')
s.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(0)}" y2="{Y(6.5)}" stroke="#2f9be8" stroke-width="6"/>')
s.append(f'<line x1="{X(0)}" y1="{Y(6.5)}" x2="{X(0)}" y2="{Y(D)}" stroke="#1d1d1d" stroke-width="6"/>')
s.append(f'<line x1="{X(L)}" y1="{Y(0)}" x2="{X(L)}" y2="{Y(D)}" stroke="#8a6a46" stroke-width="6"/>')
s.append(f'<line x1="{X(0)}" y1="{Y(D)}" x2="{X(L)}" y2="{Y(D)}" stroke="#8a6a46" stroke-width="6"/>')
s.append(f'<text x="{X(L/2)}" y="{Y(0)-10}" font-size="13" font-weight="800" fill="#1d6fb8" text-anchor="middle">FACHADA DE VIDRO · pé-direito duplo · faixa fosca com triângulos · persianas em cima</text>')
s.append(f'<text x="{X(L/2)}" y="{Y(D)+22}" font-size="13" font-weight="800" fill="#7a5530" text-anchor="middle">PAREDE INTERNA revestida "madeira" (porcelanato) · forro baixo +3,2 sob o mezanino</text>')
s.append(f'<text x="{X(0)-14}" y="{Y(3.2)}" font-size="11" fill="#1d6fb8" text-anchor="middle" transform="rotate(-90 {X(0)-14} {Y(3.2)})">vidro (canto)</text>')
s.append(f'<text x="{X(0)-14}" y="{Y(10.8)}" font-size="11" fill="#1d1d1d" text-anchor="middle" transform="rotate(-90 {X(0)-14} {Y(10.8)})">parede preta do café</text>')
# portas
for n, x, z, w, o, conf in P['portas']:
    dash = ' stroke-dasharray="4 3"' if conf.startswith('incerto') else ''
    if o == 'h': s.append(f'<line x1="{X(x - w/2)}" y1="{Y(z)}" x2="{X(x + w/2)}" y2="{Y(z)}" stroke="#ff8a3d" stroke-width="9"{dash}/>')
    else: s.append(f'<line x1="{X(x)}" y1="{Y(z - w/2)}" x2="{X(x)}" y2="{Y(z + w/2)}" stroke="#ff8a3d" stroke-width="9"{dash}/>')
s.append(f'<text x="{X(14.75)}" y="{Y(0)+30}" font-size="12" font-weight="800" fill="#c2410c" text-anchor="middle">▲ ENTRADA</text>')
for n, x, t in [('esc', 14.2, 'escada emerg.'), ('elev', 19.6, 'elevador'), ('rest', 30.3, 'acesso restrito'), ('sal', 35.2, 'salas 1–3 · saída lateral?')]:
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

# ---------- corte transversal em x ≈ 20 (pela recepção) ----------
CY, CK = 560, 26        # base do corte em px e px/m
CX = lambda z: OX + 60 + z * CK; CZ = lambda y: CY + 300 - y * CK
s.append(f'<text x="{OX}" y="{CY - 10}" font-size="18" font-weight="800" fill="#0c2c4a">Corte transversal A–A (em x ≈ 20 m, pela recepção) · alturas estimadas</text>')
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
open(f'{OUT}/planta-hall-v0.svg', 'w').write('\n'.join(s))
print('ok')
