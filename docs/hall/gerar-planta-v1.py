# Gera planta-hall-v1.{svg,json} (uso: python3 docs/hall/gerar-planta-v1.py docs/hall). Números = ambientes/hall-inovale/hall-inovale.js.
import json, math, sys
OUT = sys.argv[1]
L, D = 44.0, 15.0          # comprimento (café → palco) CONFIRMADO pelo PDF (prédio de 44 m); profundidade do hall estimada
P = {
  'versao': 'v1 (Fases C/D)',
  'eixos': 'x: da parede do café (0) à parede do palco (44); z: da fachada de vidro (0) à parede interna (15). Metros.',
  'confirmado_pdf': {'fonte': 'Centro de Inovação Plantas-Layout3 (1).pdf — Planta baixa Ático (prancha 03/03, jan/2019). Só a estrutura, que se repete em todos os andares.',
                     'predio': '44 × 20 m', 'malha_pilares_x': [2.02, 10.06, 18.04, 26.03, 34.06, 42.04], 'fileiras_pilares_z': '1,96 / 11,96 / 17,96 m da fachada',
                     'nucleo_circulacao_x': [9.85, 26.17], 'mapeamento': 'planta espelhada: o lado de 9,85 m do PDF é a ponta do café'},
  'salao': {'comprimento': L, 'profundidade': D, 'peDireitoVazio': 8.0, 'forroSobMezanino': 3.2, 'pisoMezanino': 4.2, 'peitorilMezanino': 1.1, 'piso': 0.9},
  'mezanino': [
    {'nome': 'faixa ao longo da parede interna', 'r': [0, 12, 44, 15], 'conf': 'borda em z = 12 confirmada (PDF + fotos)'},
    {'nome': 'mezanino do café (coworking)', 'r': [0, 6.5, 5, 12], 'conf': 'confirmado (H32, C21); profundidade estimada'},
    {'nome': 'faixa do fundo do palco', 'r': [43.85, 0, 44, 12], 'conf': 'confirmada acima do telão (H04, H07)'},
  ],
  'pilares': [[x, 12, 0.6, 'PDF + fotos'] for x in [2.02, 10.06, 18.04, 26.03, 34.06, 42.04]] + [[10.06, 0.7, 0.6, 'PDF (x) + foto H24 (junto à fachada)']],
  'zonas': [
    ['Café: mesas redondas + cadeiras amarelas', 2.4, 3.2, 13.1, 10.2, '#ffe08a', 'confirmado (H01, H23, H24, H26, H30)'],
    ['Bancada alta com banquetas', 6.5, 1.35, 12.0, 2.35, '#d9b98c', 'confirmado (H01, H24, H26, H29)'],
    ['Balcão do café "Pin"', 0.05, 6.9, 1.53, 12.5, '#2b2b2b', 'confirmado (C20, C21, H31)'],
    ['Estante + freezer', 0.15, 5.4, 0.86, 6.6, '#c9a26a', 'confirmado (C20)'],
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
    ['Sala de vidro Nexo', 33.8, 12.4, 37.2, 15.0, '#bfe6ff', 'confirmado (C12, C13, C16); porta fechada'],
    ['Balcões (banquetas + azul)', 37.3, 11.9, 39.6, 13.9, '#3f6fd8', 'confirmado (C12, C15, C16)'],
  ],
  'portas': [
    ['Entrada principal (portas de vidro)', 14.75, 0, 3.4, 'h', 'confirmado'],
    ['Veneziana', 11.75, 15, 0.8, 'h', 'confirmado (C07)'], ['Escada de emergência', 12.75, 15, 0.9, 'h', 'confirmado (C07); núcleo do PDF'],
    ['Elevador', 14.6, 15, 1.1, 'h', 'confirmado (C04, C07)'], ['Banheiros (passagem)', 21.2, 15, 1.2, 'h', 'confirmado (C10); núcleo do PDF'],
    ['Acesso restrito ×2', 29.6, 15, 2.0, 'h', 'confirmado (C11, C13)'], ['Venezianas ×2', 32.5, 15, 1.8, 'h', 'confirmado (C13)'],
    ['Acesso às salas 1, 2 e 3', 39.5, 15, 2.0, 'h', 'confirmado (C12, C15)'], ['Porta', 41.35, 15, 0.9, 'h', 'confirmado (C12)'],
    ['Serviço do café + veneziana', 0, 13.5, 2.0, 'v', 'confirmado (C20)'],
  ],
  'escada': {'r': [42.6, 3.4, 43.85, 11.8], 'sobe': '2 lances de 12 degraus com patamar (z 7,0–8,2), do lado da fachada para o interno, até +4,2 m', 'conf': 'confirmado (H04, H07, H14); degraus estimados'},
  'fotos': [
    ['H04', 18, 6.5, 44, 6.5], ['H09', 38, 7, 0, 4], ['H22', 19.0, 5.0, 20, 12], ['H24', 5, 7, 25, 4], ['C01', 19.3, 4.9, 22.6, 1.3], ['C02', 24.5, 6.5, 24.5, 12.5],
    ['C07', 14.2, 11.3, 13.2, 15], ['C08', 16.8, 13.6, 17.5, 3], ['C11', 32, 10.2, 27.2, 14.5], ['C12', 40.8, 7.8, 36.5, 14.2], ['C20', 5.6, 9.8, 0, 9.7], ['C06', 14.6, 13.3, 24, 14.7],
    ['H26m', 12.2, 12.3, 7, 2.5], ['H29m', 18.5, 12.3, 21.5, 2.5],
  ],
}
json.dump(P, open(f'{OUT}/planta-hall-v1.json', 'w'), ensure_ascii=False, indent=1)

K, OX, OY = 22, 70, 120              # px por metro, margens
X = lambda x: OX + x * K; Y = lambda z: OY + z * K
s = []
W, H = int(X(L) + 330), 940
s.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Figtree, Helvetica, Arial, sans-serif">')
s.append('<defs><pattern id="hach" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#6a8db8" stroke-width="2" opacity=".35"/></pattern>'
         '<marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c2410c"/></marker></defs>')
s.append(f'<rect width="{W}" height="{H}" fill="#f7fbff"/>')
s.append(f'<text x="{OX}" y="40" font-size="24" font-weight="800" fill="#0c2c4a">Hall do Polo Inovale · planta v1 (térreo + projeção do 1º andar)</text>')
s.append(f'<text x="{OX}" y="66" font-size="13" fill="#3c5d7a">Fontes: 32 fotos (H01–H32) + 21 fotos de correção (C01–C21) + planta do ático (PDF). Comprimento e pilares: PDF; o resto: estimado. Tracejado = incerto.</text>')
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
lab = {z[0]: ((z[1] + z[3]) / 2 - 1.2, (z[2] + z[4]) / 2 + 0.15, z[0].split(' (')[0].split(':')[0]) for z in P['zonas']}
for n, (x, z, t) in lab.items():
    cor = '#fff' if n.startswith('Palco') else '#0c2c4a'
    if n.startswith('Balcão do café'): s.append(f'<text x="{X(x)}" y="{Y(z)}" font-size="11" fill="#0c2c4a" transform="rotate(-90 {X(x)} {Y(z)})" text-anchor="middle">{t}</text>')
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
s.append(f'<rect x="{X(9.85)}" y="{Y(15)}" width="{16.32*K}" height="{12}" fill="#7c3aed" opacity=".35"/><text x="{X(18)}" y="{Y(15)+40}" font-size="11" font-weight="700" fill="#5b21b6" text-anchor="middle">núcleo de circulação do PDF (2 escadas + banheiros) atrás da parede, x 9,85–26,17</text>')
for n, x, t in [('v', 11.75, 'ven.'), ('e', 12.75, 'esc.'), ('el', 14.6, 'elev.'), ('b', 21.2, 'banh.'), ('r', 29.6, 'restrito'), ('v2', 32.5, 'ven.'), ('s', 39.5, 'salas 1–3')]:
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
open(f'{OUT}/planta-hall-v1.svg', 'w').write('\n'.join(s))
print('ok')
