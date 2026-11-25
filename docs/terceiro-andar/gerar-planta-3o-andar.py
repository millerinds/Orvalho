# Gera planta-3o-andar-v0.{json,svg,png}.
# Uso: python3 docs/terceiro-andar/gerar-planta-3o-andar.py docs/terceiro-andar
#
# Coordenadas = as do jogo (as mesmas do Hall e do 1º andar), em metros:
#   x: da ponta do café (0) à ponta do palco (44)   ·   z: da fachada principal (0) para o fundo do prédio (núcleo)
# Conversão a partir do PDF do ático (eixo x_pdf da esquerda para a direita, y_pdf de cima para baixo):
#   x = 44 − x_pdf      z = 20 − y_pdf      (rotação de 180°, sem espelhamento)
# Conferência: o poço do elevador do PDF cai em x 13,3–15,25, sobre o elevador do Hall (x 14,6),
# e a porta da escada de emergência do PDF em x 12,0–13,0, sobre a do 1º andar (x 12,0–13,0).
import json, os, shutil, subprocess, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
NOME = 'planta-3o-andar-v0'

C = 'confirmado'       # duas fontes coerentes (PDF + foto, ou duas fotos)
PR = 'provável'        # uma foto clara, ou dedução coerente com a estrutura
IN = 'incerto'         # sem foto/planta suficiente

P = {
  'versao': 'v0.1 (25/11/2026) · análise das fotos T01–T48 + planta oficial do ático (PDF, 2019); Fase B: Lab com 4,8 m de largura (adaptação de jogo)',
  'pavimento': '3º andar (ático) do Polo Inovale',
  'eixos': 'x: ponta do café (0) → ponta do palco (44); z: fachada principal (0) → fundo do prédio. Metros. Mesmo sistema do Hall/1º andar.',
  'conversao_pdf': {'formula': 'x = 44 − x_pdf ; z = 20 − y_pdf', 'tipo': 'rotação de 180° (sem espelho)',
                    'conferencia': ['elevador do PDF em x 13,3–15,25 ↔ elevador do Hall em x 14,6',
                                    'porta da escada de emergência do PDF em x 12,0–13,0 ↔ porta do 1º andar em x 12,0–13,0',
                                    'frente do núcleo do PDF em z ≈ 14,5 ↔ frente do núcleo do 1º andar em z 14,6']},
  'cota_piso_estimada': {'valor': 12.6, 'status': 'estimado', 'base': '3 × 4,2 m (o 1º andar está a +4,2 m no jogo); não medido'},
  'pe_direito_forro': {'valor': 3.0, 'status': 'estimado', 'base': 'forro modular igual ao do Lab (3,0 m, MEDIDAS-lab-ia.md)'},
  'fontes': {
    'fotos': 'referencia/fotos-terceiro-andar/numeradas/T01–T48.jpeg (originais em referencia/fotos-terceiro-andar/originais/; ZIP preservado na raiz)',
    'pdf': 'Centro de Inovação Plantas-Layout3 (1).pdf — Planta baixa Ático, prancha 03/03, jan/2019, 1:125 (Prefeitura de Joaçaba). Projeto de divisórias de 2019: estrutura confiável; distribuição de salas desatualizada.',
    'lab': 'referencia/fotos-lab/ (11 fotos de 30/10/2026) e docs/MEDIDAS-lab-ia.md',
  },

  # ---------------- estrutura do PDF (confirmada) ----------------
  'estrutura_pdf': {
    'predio': {'r': [0, 0, 44, 20], 'status': C, 'nota': '44 × 20 m, cotas do PDF'},
    'nucleo': {'r': [9.85, 14.5, 26.17, 21.5], 'status': C, 'nota': '16,32 m; avança 1,5 m além da linha de 20 m (PDF)'},
    'escadas': [
      {'nome': 'escada de emergência (lado do café)', 'r': [10.05, 15.4, 12.96, 21.2], 'porta': [12.02, 12.96], 'veneziana_dupla': [10.15, 11.6], 'status': C,
       'fotos': 'T32, T33, T37–T39, T41, T46, T48'},
      {'nome': 'escada de emergência (lado do palco)', 'r': [22.83, 15.4, 25.74, 21.2], 'porta': [24.7, 25.7], 'veneziana_dupla': [22.83, 24.2], 'status': C,
       'fotos': 'T17–T20, T23'},
    ],
    'elevador': {'r': [13.27, 14.5, 15.25, 16.7], 'porta_centro': 14.3, 'status': C, 'fotos': 'T21, T38, T47, T48 ("INOVAÇÃO ABRE PORTAS", igual ao térreo)'},
    'sanitarios_pdf': {'r': [15.45, 14.5, 22.5, 21.2], 'salas': '32a, 32b, 32c, 32d, 33, 34, 35', 'status': PR,
                       'nota': 'no PDF são salas do núcleo; nas fotos só aparece um nicho com porta PCD + veneziana (T07, T19–T22)'},
    'pilares': {
      'diametro_estimado': 0.6,
      'fileira_corredor_z': 11.96, 'x': [2.02, 10.03, 18.04, 26.02, 34.06],
      'fileira_fachada_z': 1.96, 'x_fachada': [2.02, 10.03, 18.04, 26.02, 34.06, 42.04],
      'fileira_fundo_z': 17.96, 'x_fundo': [2.02, 34.06, 42.04],
      'observados': [[26.02, 11.96, 'branco', 'T07, T17, T18, T23, T24'], [18.04, 11.96, 'cinza-amarronzado', 'T30, T31, T40, T42, T43, T45'],
                     [10.03, 11.96, 'cinza-amarronzado', 'T37–T39, T46, T48'], [26.02, 1.96, 'concreto, do lado de fora da janela', 'foto do Lab 09.27.12 (2)']],
    },
    'salas_2019': [  # como estão no PDF (convertidas); servem só de comparação
      ['27', 4.2, 6.6, 9.1, 14.2], ['28', 9.1, 6.6, 16.5, 12.5], ['29', 16.5, 6.6, 33.6, 12.0], ['30', 26.17, 12.0, 33.6, 14.4],
      ['31 (terraço)', 33.9, 1.4, 43.6, 18.4]],
    'linha_portas_2019_z': 6.6,  # y_pdf 13,4: linha de vidro com portas para a faixa hachurada; não existe hoje no trecho fotografado
    'jardineiras': [[3.0, 1.4, 33.6, 3.0], [1.7, 1.4, 3.0, 18.5], [3.0, 17.1, 9.85, 18.5]],
  },

  # ---------------- leitura atual (fotos) ----------------
  'fachada_atual': {'z': 3.0, 'x': [3.0, 33.6], 'status': PR,
                    'base': 'linha externa da faixa hachurada do PDF (y_pdf 17). Pela janela do Lab se vê o pilar da fileira da fachada logo atrás do vidro e a jardineira na base (09.27.12 (2), 09.27.16). Com isso, as salas têm ~6 m de fundo, como o Lab (6 m).'},
  'ambientes': [
    # nome, retângulo, categoria, status da posição, interior, fotos, observação
    {'id': 'lab-ia', 'nome': 'Laboratório de Inteligência Artificial', 'r': [25.4, 3.0, 30.2, 9.0], 'adaptacao': 'largura real estimada ~3,2 m (x 25,4–28,6); no jogo 4,8 m, tomando 1,6 m da sala A', 'cat': 'lab', 'status': C, 'interior': 'documentado',
     'fotos': 'T09, T10, T11, T14, T15, T16 + 11 fotos do Lab',
     'obs': 'porta branca junto à parede azul (no jogo x 28,95–29,95), painel "Laboratório de Inteligência Artificial" logo a oeste da porta, dois vidros com película. Pelo vidro: pilar branco, SCL e porta da escada (foto do Lab 09.27.12 (1)).'},
    {'id': 'sala-a', 'nome': 'Sala sem identificação (película de triângulos vermelhos)', 'r': [30.3, 3.0, 33.6, 9.0], 'cat': 'generica', 'status': PR, 'interior': 'parcial',
     'fotos': 'T06, T15, T16, T18', 'obs': 'seis vidros até a parede do fim do corredor; mesas e cadeiras vistas de longe; porta não identificada nas fotos.'},
    {'id': 'sala-b', 'nome': 'Sala com banner "marketplace imobiliário" (empresa ilegível)', 'r': [22.2, 3.0, 25.4, 9.0], 'cat': 'generica', 'status': PR, 'interior': 'parcial',
     'fotos': 'T11–T14', 'obs': 'paredes brancas, uma mesa com monitor, ar-condicionado. Porta branca no lado oeste (x 22,2–23,1). O nome não é legível.'},
    {'id': 'salus', 'nome': 'Salus (Método Salus)', 'r': [16.8, 3.0, 22.2, 9.0], 'cat': 'empresa', 'status': PR, 'interior': 'parcial',
     'fotos': 'T12, T13, T24–T29', 'obs': 'painel adesivado "SALUS · MÉTODO SALUS · metodosalus.com.br" (provável porta, x 21,2–22,2) e quatro vidros com película; salinhas internas de vidro; aviso "Esta empresa conta com fomento FAPESC". A qual sala pertence a porta branca vizinha é incerto.'},
    {'id': 'athostec', 'nome': 'Athostec', 'r': [11.1, 3.0, 16.8, 9.0], 'cat': 'empresa', 'status': C, 'interior': 'parcial',
     'fotos': 'T26, T27, T30, T31, T33–T36, T40–T42, T44, T45', 'obs': 'porta adesivada "ATHOSTEC · Evolução, Desenvolvimento e Gestão de Alta Qualidade" (x 15,8–16,8); painel escuro com logotipo iluminado; mesas junto às janelas; guirlandas de Natal (sazonais).'},
    {'id': 'passagem', 'nome': 'Passagem para a porta externa', 'r': [9.5, 3.0, 11.1, 9.0], 'cat': 'circulacao', 'status': PR, 'interior': 'documentado',
     'fotos': 'T34, T35, T36', 'obs': 'entre a Athostec e a sala X; porta de vidro para a faixa externa (espreguiçadeira, guarda-corpo).'},
    {'id': 'sala-x', 'nome': 'Sala sem identificação (porta com adesivo escuro)', 'r': [3.0, 3.0, 9.5, 8.6], 'cat': 'generica', 'status': IN, 'interior': 'parcial',
     'fotos': 'T35, T36, T44', 'obs': 'mesas com monitores e pessoas, porta de vidro aberta; o adesivo da porta não é legível. Limites estimados.'},
    {'id': 'unimed', 'nome': 'Unimed Meio Oeste SC', 'r': [3.0, 8.6, 9.5, 17.1], 'cat': 'empresa', 'status': C, 'interior': 'não documentado',
     'fotos': 'T01, T21, T22, T37–T39, T41, T46–T48', 'obs': 'fecha o fim do hall, de frente para o núcleo e o estar; porta branca com placa Unimed e leitor de acesso logo depois da veneziana; vidro com película de quadrados arredondados. Corresponde à sala 27 do PDF. Profundidade e fundo incertos.'},
    {'id': 'scl', 'nome': 'SCL Automação', 'r': [26.17, 12.0, 33.6, 14.5], 'cat': 'empresa', 'status': C, 'interior': 'parcial',
     'fotos': 'T01–T03, T07–T10, T17–T20, T23–T25', 'obs': 'recepção com piso de madeira, parede "Inteligência Industrial", porta "Administração", porta dupla de vidro junto à escada; frente para o corredor com floreira e duas poltronas. Corresponde à sala 30 do PDF. A sala "Administração" pode avançar sobre o terraço norte (incerto).'},
    {'id': 'salao', 'nome': 'Salão no fim do corredor (antigo terraço 31?)', 'r': [33.9, 1.4, 43.6, 18.4], 'cat': 'incerta', 'status': IN, 'interior': 'parcial (pelas portas de vidro)',
     'fotos': 'T04, T05, T06, T08, T09', 'obs': 'porta dupla de vidro "PUXE"; piso de madeira, bancadas baixas, cadeiras amarelas, TV em pedestal, caixa de som, extintor. Em 2019 era terraço descoberto; extensão e uso atuais desconhecidos.'},
    {'id': 'corredor', 'nome': 'Corredor (frente da SCL)', 'r': [26.17, 9.0, 33.6, 12.0], 'cat': 'circulacao', 'status': C, 'interior': 'documentado', 'fotos': 'T01–T10, T15–T18', 'obs': 'pilar branco na frente da SCL'},
    {'id': 'estar', 'nome': 'Hall de circulação e estar (frente do núcleo)', 'r': [9.5, 9.0, 26.17, 14.5], 'cat': 'circulacao', 'status': C, 'interior': 'documentado',
     'fotos': 'T19–T23, T30–T34, T37–T48', 'obs': 'dois pilares bege, tapete cinza, dois sofás brancos, mesa de centro, pufes azuis; bancada com banquetas encostada no núcleo.'},
    {'id': 'nucleo-ne', 'nome': 'Fundo atrás da Unimed', 'r': [3.0, 14.5, 9.5, 17.1], 'cat': 'incerta', 'status': IN, 'interior': 'não documentado', 'fotos': '—',
     'obs': 'no PDF é faixa hachurada; não aparece nas fotos'},
  ],
  'portas': [  # nome, x, z, largura, orientação ('h' = parede em x, 'v' = parede em z), status
    ['Lab IA', 29.45, 9.0, 1.0, 'h', C], ['Sala B', 22.65, 9.0, 0.9, 'h', PR], ['Salus (painel adesivado)', 21.7, 9.0, 0.9, 'h', PR],
    ['Athostec (painel adesivado)', 16.3, 9.0, 0.9, 'h', C], ['Porta externa', 10.3, 3.0, 1.0, 'h', PR], ['Sala X', 9.5, 7.0, 0.9, 'v', IN],
    ['Unimed', 9.5, 13.65, 0.9, 'v', C], ['SCL (porta dupla de vidro)', 26.17, 13.2, 1.4, 'v', C], ['Salão (porta dupla de vidro)', 33.6, 10.5, 1.8, 'v', C],
    ['Escada (café)', 12.49, 14.5, 0.94, 'h', C], ['Veneziana dupla', 10.88, 14.5, 1.45, 'h', C], ['Elevador', 14.26, 14.5, 1.1, 'h', C],
    ['Escada (palco)', 25.2, 14.5, 1.0, 'h', C], ['Veneziana dupla', 23.5, 14.5, 1.37, 'h', C],
    ['Nicho banheiro (PCD + veneziana)', 20.3, 14.5, 1.8, 'h', PR],
  ],
  'nucleo_frente': [  # do lado do palco para o lado do café, como nas fotos
    ['porta da escada de emergência (bonecos laranja, "SAÍDA")', 25.2], ['porta dupla veneziana', 23.5], ['hidrante + extintor', 22.2],
    ['nicho: porta veneziana + banheiro PCD (piso branco)', 20.3], ['vitrine de vidro e madeira', 18.6], ['bancada branca + 5 banquetas coloridas', 16.5],
    ['elevador "INOVAÇÃO ABRE PORTAS"', 14.26], ['lixeiras (reciclável / não reciclável)', 13.3], ['porta da escada de emergência', 12.49],
    ['porta dupla veneziana', 10.88], ['extintor', 10.0]],
  'mobiliario_documentado': [  # nome, x, z, largura, profundidade
    ['2 poltronas brancas (braço de madeira)', 29.6, 11.55, 2.0, 0.75], ['floreira de madeira', 27.9, 11.6, 1.0, 0.6],
    ['sofá azul + mesinha', 24.4, 9.5, 1.9, 0.75], ['tapete cinza', 14.5, 10.75, 4.2, 2.9], ['sofá branco', 12.75, 10.75, 0.84, 1.62],
    ['sofá branco', 16.25, 10.75, 0.84, 1.62], ['mesa de centro branca', 14.5, 10.75, 0.72, 1.2], ['pufes azuis', 10.1, 10.85, 1.1, 1.6],
    ['bancada + banquetas', 16.5, 14.07, 2.5, 0.85], ['vitrine', 18.6, 14.25, 0.9, 0.45], ['mesinha com flores secas', 10.3, 4.0, 0.6, 0.6],
  ],
  'fotos': [  # id, x, z, alvo x, alvo z
    ['T01-T03', 32.5, 10.3, 10, 10.5], ['T04-T05', 31.5, 10.4, 34.5, 10.4], ['T06', 28.0, 10.0, 33.6, 9.2], ['T07', 30.0, 10.5, 22, 14.0],
    ['T08', 29.5, 9.6, 32, 13.5], ['T09-T10', 25.5, 10.3, 33.6, 10.3], ['T11/T14', 24.5, 10.6, 24.5, 8.0], ['T12-T13', 23.6, 10.8, 25.0, 8.0],
    ['T15-T16', 24.0, 10.4, 29.5, 8.5], ['T17-T18', 25.0, 10.2, 29, 13.5], ['T19-T20', 24.0, 10.8, 24.0, 14.5], ['T21-T22', 22.5, 10.8, 16.0, 14.5],
    ['T23', 21.5, 10.5, 28, 13], ['T24-T25', 22.3, 10.0, 33, 11], ['T26-T28', 20.0, 11.0, 20.0, 8.0], ['T29', 19.0, 10.8, 24, 8.5],
    ['T30-T31', 13.5, 10.5, 26, 9.5], ['T32-T33', 12.3, 13.3, 24, 12], ['T34', 11.0, 12.5, 16, 9], ['T35-T36', 10.0, 11.0, 10.3, 3.5],
    ['T37', 12.0, 12.8, 8.0, 12.0], ['T38', 17.0, 11.5, 9.5, 12.0], ['T39', 11.5, 13.0, 8.5, 11.5], ['T40/T42', 14.5, 13.0, 26, 11],
    ['T41', 16.5, 11.5, 9.5, 11.5], ['T43', 17.5, 13.3, 28, 11], ['T44', 12.5, 10.0, 10.0, 6.0], ['T45', 12.5, 10.5, 24, 9.5],
    ['T46', 13.0, 11.5, 9.5, 12.5], ['T47', 19.5, 13.3, 10, 12.5], ['T48', 16.5, 12.5, 9.5, 13.0],
  ],
  'medidas': [  # item, valor, status, base
    ['prédio', '44 × 20 m', 'confirmado', 'cotas do PDF'],
    ['núcleo', '16,32 m (x 9,85–26,17), frente em z ≈ 14,5', 'confirmado', 'PDF'],
    ['malha de pilares', 'a cada ~8 m; fileiras em z 1,96 / 11,96 / 17,96', 'confirmado', 'PDF + fotos'],
    ['frente da SCL', 'z 12,0 (alinhada aos pilares)', 'provável', 'PDF (sala 30) + T18 (pilar na quina da SCL)'],
    ['fachada das salas', 'z ≈ 3,0', 'provável', 'linha externa da faixa hachurada do PDF + pilar visto pela janela do Lab'],
    ['frente das salas da fachada', 'z ≈ 9,0', 'estimado', 'Lab com 6 m de fundo (MEDIDAS-lab-ia.md)'],
    ['corredor da SCL', '3,0 m (≈ 2,4 m livres ao lado do pilar)', 'estimado', 'z 9,0–12,0'],
    ['hall de estar na frente do núcleo', '5,5 m de fundo (z 9,0–14,5)', 'estimado', 'T21, T38, T41'],
    ['frente do Lab', '3,2 m (porta 0,9 + painel + 2 vidros)', 'estimado', 'T15 + MEDIDAS-lab-ia.md (3,0 m)'],
    ['portas comuns', '0,90 × 2,10 m com bandeira', 'confirmado no PDF', 'tabela do PDF ("porta cega 90×210")'],
    ['módulo de vidro das divisórias', '~1,0–1,1 m', 'estimado', 'contagem de painéis × portas de 0,9 m'],
    ['pé-direito (forro)', '~3,0 m', 'estimado', 'igual ao Lab'],
    ['cota do piso', '~+12,6 m', 'estimado', '3 × 4,2 m'],
  ],
}

json.dump(P, open(f'{OUT}/{NOME}.json', 'w'), ensure_ascii=False, indent=1)

# ======================================================================== SVG
K, OX, OY = 24, 70, 150                     # px por metro; margens
X = lambda x: OX + x * K
Y = lambda z: OY + z * K
W, H = int(X(44) + 470), int(Y(22.5) + 230)
s = []
a = s.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Figtree, Helvetica, Arial, sans-serif">')
a('<defs>'
  '<pattern id="hach" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#8a97a6" stroke-width="2" opacity=".45"/></pattern>'
  '<pattern id="grama" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#cfe7a8"/><circle cx="3" cy="3" r="1" fill="#8fc45a"/></pattern>'
  '<marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c2410c"/></marker>'
  '</defs>')
a(f'<rect width="{W}" height="{H}" fill="#f7fbff"/>')
a(f'<text x="{OX}" y="40" font-size="25" font-weight="800" fill="#0c2c4a">Polo Inovale · 3º andar (ático) · planta estimada v0</text>')
a(f'<text x="{OX}" y="66" font-size="13" fill="#3c5d7a">Fontes: fotos T01–T48 (25/11/2026), fotos do Lab IA e planta oficial do ático (PDF, jan/2019). Estrutura: PDF. Distribuição atual: fotos. Medidas: estimadas, salvo indicação.</text>')
a(f'<text x="{OX}" y="86" font-size="13" fill="#3c5d7a">Coordenadas do jogo (iguais às do Hall): x = 44 − x_pdf · z = 20 − y_pdf. Cota do piso estimada: +12,6 m. Nada aqui foi medido com trena.</text>')

# grade
for i in range(45): a(f'<line x1="{X(i)}" y1="{Y(0)}" x2="{X(i)}" y2="{Y(21.5)}" stroke="#e3ebf2" stroke-width="{1.2 if i % 5 == 0 else .5}"/>')
for j in range(22): a(f'<line x1="{X(0)}" y1="{Y(j)}" x2="{X(44)}" y2="{Y(j)}" stroke="#e3ebf2" stroke-width="{1.2 if j % 5 == 0 else .5}"/>')
for i in range(0, 45, 5): a(f'<text x="{X(i)}" y="{Y(0)-8}" font-size="10" fill="#7d93a8" text-anchor="middle">{i}</text>')
for j in range(0, 22, 5): a(f'<text x="{X(0)-8}" y="{Y(j)+4}" font-size="10" fill="#7d93a8" text-anchor="end">{j}</text>')

E = P['estrutura_pdf']
# contorno do prédio e jardineiras
a(f'<rect x="{X(0)}" y="{Y(0)}" width="{44*K}" height="{20*K}" fill="none" stroke="#9aa7b3" stroke-width="2" stroke-dasharray="10 6"/>')
for x0, z0, x1, z1 in E['jardineiras']:
    a(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="url(#grama)" stroke="#6aa33a" stroke-width="1"/>')
a(f'<text x="{X(18)}" y="{Y(2.35)}" font-size="11" fill="#3b6b17" font-weight="700" text-anchor="middle">JARDINEIRA + guarda-corpo (lado de fora do vidro) · pilares da fachada</text>')
a(f'<text x="{X(22)}" y="{Y(0.75)}" font-size="12" fill="#5c6b78" font-weight="800" text-anchor="middle">▼ FACHADA PRINCIPAL (mesmo lado da fachada de vidro do Hall) · borda do prédio em z 0</text>')

# salas de 2019 (comparação)
for n, x0, z0, x1, z1 in E['salas_2019']:
    a(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="none" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="3 4" opacity=".8"/>')
    a(f'<text x="{X(x1)-4}" y="{Y(z1)-5}" font-size="10" fill="#7e22ce" text-anchor="end" opacity=".9">PDF 2019: {n}</text>')
a(f'<line x1="{X(4.2)}" y1="{Y(6.6)}" x2="{X(33.6)}" y2="{Y(6.6)}" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="3 4" opacity=".8"/>')

# ambientes atuais
CORES = {'lab': '#19c2c9', 'empresa': '#c7ecb0', 'generica': '#dfe6ee', 'circulacao': '#ffffff', 'incerta': 'url(#hach)'}
TRACO = {C: '', PR: ' stroke-dasharray="7 4"', IN: ' stroke-dasharray="2 4"'}
for amb in P['ambientes']:
    x0, z0, x1, z1 = amb['r']
    op = '.9' if amb['cat'] != 'circulacao' else '.75'
    sw = 3 if amb['cat'] == 'lab' else 1.8
    a(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" rx="3" fill="{CORES[amb["cat"]]}" fill-opacity="{op}" stroke="#0b3a6e" stroke-width="{sw}"{TRACO[amb["status"]]}/>')

def rotulo(x, z, linhas, tam=12, peso=800, cor='#0c2c4a'):
    for k, t in enumerate(linhas):
        a(f'<text x="{X(x)}" y="{Y(z) + k * (tam + 3)}" font-size="{tam if k == 0 else tam - 2}" font-weight="{peso if k == 0 else 500}" fill="{cor}" text-anchor="middle">{t}</text>')

rotulo(27.8, 5.3, ['LAB IA', 'Laboratório de', 'Intel. Artificial', '6,0 × 4,8 m (jogo)'], 13, 900, '#053b40')
rotulo(31.95, 5.6, ['Sala A', 'sem nome', 'película', 'vermelha'], 11)
rotulo(23.8, 5.6, ['Sala B', 'banner', '"marketplace', 'imobiliário"', '(ilegível)'], 11)
rotulo(19.5, 5.8, ['SALUS', 'Método Salus', 'fomento FAPESC'], 12)
rotulo(13.95, 5.8, ['ATHOSTEC', 'logo iluminado', 'mesas junto às janelas'], 12)
rotulo(6.25, 5.6, ['Sala X', 'sem identificação', 'porta com adesivo', 'escuro (ilegível)'], 11)
rotulo(6.25, 12.0, ['UNIMED', 'Meio Oeste SC', 'interior não', 'fotografado'], 12)
rotulo(29.9, 13.1, ['SCL AUTOMAÇÃO', 'recepção "Inteligência Industrial"'], 12)
rotulo(38.75, 9.0, ['SALÃO NO FIM', 'DO CORREDOR', 'piso de madeira, bancadas,', 'TV, cadeiras amarelas', '(visto pelas portas)', 'em 2019: terraço 31', 'extensão INCERTA'], 12)
rotulo(29.9, 10.65, ['CORREDOR'], 11, 800, '#3c5d7a')
rotulo(19.9, 12.9, ['HALL DE ESTAR / CIRCULAÇÃO'], 12, 800, '#3c5d7a')
rotulo(10.3, 5.0, ['passa-', 'gem'], 9, 700, '#3c5d7a')
rotulo(6.25, 15.9, ['fundo: sem foto'], 9, 600, '#5c6b78')

# fachada atual (vidro) e paredes
FA = P['fachada_atual']
a(f'<line x1="{X(FA["x"][0])}" y1="{Y(3)}" x2="{X(FA["x"][1])}" y2="{Y(3)}" stroke="#2f9be8" stroke-width="5"/>')
a(f'<line x1="{X(3)}" y1="{Y(3)}" x2="{X(3)}" y2="{Y(17.1)}" stroke="#2f9be8" stroke-width="5" stroke-dasharray="8 5"/>')
a(f'<line x1="{X(33.6)}" y1="{Y(3)}" x2="{X(33.6)}" y2="{Y(14.5)}" stroke="#55606b" stroke-width="6"/>')
a(f'<line x1="{X(26.17)}" y1="{Y(14.5)}" x2="{X(33.6)}" y2="{Y(14.5)}" stroke="#55606b" stroke-width="6"/>')
a(f'<text x="{X(18)}" y="{Y(3)+15}" font-size="10" fill="#1d6fb8" font-weight="700" text-anchor="middle">vidro das salas em z ≈ 3,0 (provável) · janelas com persiana · portas de sacada</text>')

# núcleo
x0, z0, x1, z1 = E['nucleo']['r']
a(f'<rect x="{X(x0)}" y="{Y(z0)}" width="{(x1-x0)*K}" height="{(z1-z0)*K}" fill="#e8d9bf" stroke="#7a5530" stroke-width="3"/>')
a(f'<line x1="{X(x0)}" y1="{Y(z0)}" x2="{X(x1)}" y2="{Y(z0)}" stroke="#8a6a46" stroke-width="7"/>')
for esc in E['escadas']:
    ex0, ez0, ex1, ez1 = esc['r']
    a(f'<rect x="{X(ex0)}" y="{Y(ez0)}" width="{(ex1-ex0)*K}" height="{(ez1-ez0)*K}" fill="#f4ecdd" stroke="#7a5530" stroke-width="1.3"/>')
    for k in range(1, 12): a(f'<line x1="{X(ex0)}" y1="{Y(ez0 + 1.6 + k*0.35)}" x2="{X(ex1)}" y2="{Y(ez0 + 1.6 + k*0.35)}" stroke="#c4ae8c" stroke-width=".7"/>')
    a(f'<text x="{X((ex0+ex1)/2)}" y="{Y(ez0)+16}" font-size="9" fill="#7a3d00" text-anchor="middle">antecâmara</text>')
    a(f'<text x="{X((ex0+ex1)/2)}" y="{Y(ez1)-6}" font-size="10" font-weight="700" fill="#7a3d00" text-anchor="middle">escada emerg.</text>')
ex0, ez0, ex1, ez1 = E['elevador']['r']
a(f'<rect x="{X(ex0)}" y="{Y(ez0)}" width="{(ex1-ex0)*K}" height="{(ez1-ez0)*K}" fill="#2b2b2b" stroke="#000" stroke-width="1"/>')
a(f'<text x="{X((ex0+ex1)/2)}" y="{Y(15.7)}" font-size="10" fill="#ff8a3d" font-weight="800" text-anchor="middle">ELEV.</text>')
sx0, sz0, sx1, sz1 = E['sanitarios_pdf']['r']
a(f'<rect x="{X(sx0)}" y="{Y(sz0)}" width="{(sx1-sx0)*K}" height="{(sz1-sz0)*K}" fill="#efe4d3" stroke="#7a5530" stroke-width="1" stroke-dasharray="5 3"/>')
rotulo((sx0+sx1)/2, 17.6, ['sanitários e salas técnicas', 'PDF: 32a–32d, 33, 34, 35', 'nas fotos: nicho PCD + veneziana'], 10, 700, '#7a3d00')
a(f'<text x="{X(18)}" y="{Y(21.5)+16}" font-size="11" font-weight="800" fill="#7a5530" text-anchor="middle">NÚCLEO (PDF) · revestimento "madeira" no lado do hall · avança 1,5 m além da linha de 20 m</text>')

# frente do núcleo: elementos
for n, x in P['nucleo_frente']:
    a(f'<circle cx="{X(x)}" cy="{Y(14.5)-0}" r="3" fill="#7a3d00"/>')
curto = {25.2: 'escada', 23.5: 'ven.', 22.2: 'hidr.', 20.3: 'PCD', 18.6: 'vitr.', 16.9: 'bancada', 14.26: 'elev.', 12.49: 'escada', 10.88: 'ven.'}
for x, t in curto.items():
    a(f'<text x="{X(x)}" y="{Y(14.5)-7}" font-size="9" fill="#7a3d00" text-anchor="middle">{t}</text>')

# portas
for n, x, z, w, o, st in P['portas']:
    d = TRACO[st].replace('7 4', '4 3')
    if o == 'h': a(f'<line x1="{X(x - w/2)}" y1="{Y(z)}" x2="{X(x + w/2)}" y2="{Y(z)}" stroke="#ff8a3d" stroke-width="8"{d}/>')
    else: a(f'<line x1="{X(x)}" y1="{Y(z - w/2)}" x2="{X(x)}" y2="{Y(z + w/2)}" stroke="#ff8a3d" stroke-width="8"{d}/>')

# mobiliário documentado
for n, x, z, w, dp in P['mobiliario_documentado']:
    cor = '#2846a8' if 'azu' in n else ('#b7bcc4' if 'tapete' in n else ('#9fd17a' if 'floreira' in n else '#ffffff'))
    op = '.45' if 'tapete' in n else '.95'
    a(f'<rect x="{X(x - w/2)}" y="{Y(z - dp/2)}" width="{w*K}" height="{dp*K}" rx="4" fill="{cor}" fill-opacity="{op}" stroke="#4a5a6a" stroke-width=".8"/>')

# pilares
PI = E['pilares']
obs = {(round(x, 2), round(z, 2)): c for x, z, c, f in PI['observados']}
pts = [(x, PI['fileira_corredor_z']) for x in PI['x']] + [(x, PI['fileira_fachada_z']) for x in PI['x_fachada']] + [(x, PI['fileira_fundo_z']) for x in PI['x_fundo']]
for x, z in pts:
    c = obs.get((round(x, 2), round(z, 2)))
    fill = '#ffffff' if c == 'branco' else ('#8e867a' if c == 'cinza-amarronzado' else ('#9aa3ad' if c else '#c9ced4'))
    a(f'<circle cx="{X(x)}" cy="{Y(z)}" r="{0.3*K}" fill="{fill}" stroke="#3a4651" stroke-width="{2 if c else 1}"{"" if c else " stroke-dasharray=\"2 2\""}/>')

# pontos de foto
for fid, x, z, tx, tz in P['fotos']:
    import math
    dx, dz = tx - x, tz - z
    L = math.hypot(dx, dz) or 1
    ex, ez = x + dx / L * 1.6, z + dz / L * 1.6
    a(f'<line x1="{X(x)}" y1="{Y(z)}" x2="{X(ex)}" y2="{Y(ez)}" stroke="#c2410c" stroke-width="1.6" marker-end="url(#seta)"/>')
    a(f'<circle cx="{X(x)}" cy="{Y(z)}" r="3.2" fill="#c2410c"/>')
    a(f'<text x="{X(x)+4}" y="{Y(z)-4}" font-size="8.5" fill="#9a3412" font-weight="700">{fid}</text>')

# orientação + escala
bx, by = X(0.4), Y(22.6)
a(f'<g font-size="11" fill="#0c2c4a"><text x="{bx}" y="{by+10}" font-weight="800">ORIENTAÇÃO (convenção do projeto)</text>'
  f'<line x1="{bx}" y1="{by+26}" x2="{bx+80}" y2="{by+26}" stroke="#0c2c4a" stroke-width="2" marker-end="url(#seta)"/><text x="{bx+88}" y="{by+30}">+x: para a ponta do palco (leste no projeto)</text>'
  f'<line x1="{bx}" y1="{by+26}" x2="{bx}" y2="{by+76}" stroke="#0c2c4a" stroke-width="2" marker-end="url(#seta)"/><text x="{bx+8}" y="{by+72}">+z: da fachada para o núcleo</text>'
  f'<text x="{bx}" y="{by+96}" fill="#5c6b78">Abaixo deste andar: café (x ≈ 0–10) e palco/escada (x ≈ 39–44) do Hall. Norte geográfico não verificado.</text>'
  f'<line x1="{X(30)}" y1="{by+26}" x2="{X(35)}" y2="{by+26}" stroke="#0c2c4a" stroke-width="4"/><text x="{X(32.5)}" y="{by+18}" text-anchor="middle">5 m</text></g>')

# legenda
lx, ly = X(44) + 30, OY
a(f'<g font-size="12" fill="#0c2c4a"><text x="{lx}" y="{ly}" font-size="15" font-weight="800">LEGENDA</text>')
itens = [('rect', '#19c2c9', 'Lab IA (âncora, já existe)'), ('rect', '#c7ecb0', 'empresa identificada pela sinalização'), ('rect', '#dfe6ee', 'sala sem identificação → escritório genérico'),
         ('rect', '#ffffff', 'circulação / estar'), ('hach', '', 'área incerta (sem foto interna/planta)'), ('rect', '#e8d9bf', 'núcleo (PDF): escadas, elevador, sanitários'),
         ('grama', '', 'jardineira externa (PDF + foto do Lab)')]
y = ly + 24
for tipo, cor, t in itens:
    f = 'url(#hach)' if tipo == 'hach' else ('url(#grama)' if tipo == 'grama' else cor)
    a(f'<rect x="{lx}" y="{y-11}" width="26" height="15" rx="2" fill="{f}" stroke="#0b3a6e"/><text x="{lx+34}" y="{y+1}">{t}</text>'); y += 22
y += 6
for d, t in [('', 'contorno contínuo: posição confirmada'), ('7 4', 'tracejado: posição provável'), ('2 4', 'pontilhado: incerto')]:
    a(f'<line x1="{lx}" y1="{y-4}" x2="{lx+26}" y2="{y-4}" stroke="#0b3a6e" stroke-width="2"{" stroke-dasharray=" + chr(34) + d + chr(34) if d else ""}/><text x="{lx+34}" y="{y}">{t}</text>'); y += 20
y += 6
SIMB = [('porta (laranja)', lambda y: f'<line x1="{lx}" y1="{y-4}" x2="{lx+26}" y2="{y-4}" stroke="#ff8a3d" stroke-width="8"/>'),
        ('vidro externo (azul)', lambda y: f'<line x1="{lx}" y1="{y-4}" x2="{lx+26}" y2="{y-4}" stroke="#2f9be8" stroke-width="5"/>'),
        ('parede de alvenaria (PDF)', lambda y: f'<line x1="{lx}" y1="{y-4}" x2="{lx+26}" y2="{y-4}" stroke="#55606b" stroke-width="6"/>'),
        ('divisões do PDF de 2019 (comparação)', lambda y: f'<line x1="{lx}" y1="{y-4}" x2="{lx+26}" y2="{y-4}" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="3 4"/>'),
        ('pilar visto (branco / escuro)', lambda y: f'<circle cx="{lx+7}" cy="{y-4}" r="6" fill="#fff" stroke="#3a4651" stroke-width="2"/><circle cx="{lx+21}" cy="{y-4}" r="6" fill="#8e867a" stroke="#3a4651" stroke-width="2"/>'),
        ('pilar só no PDF', lambda y: f'<circle cx="{lx+13}" cy="{y-4}" r="6" fill="#c9ced4" stroke="#3a4651" stroke-dasharray="2 2"/>'),
        ('ponto e direção da foto', lambda y: f'<circle cx="{lx+4}" cy="{y-4}" r="3.2" fill="#c2410c"/><line x1="{lx+4}" y1="{y-4}" x2="{lx+26}" y2="{y-4}" stroke="#c2410c" stroke-width="1.6" marker-end="url(#seta)"/>'),
        ('mobiliário visto nas fotos', lambda y: f'<rect x="{lx}" y="{y-11}" width="26" height="12" rx="4" fill="#2846a8" stroke="#4a5a6a"/>')]
for t, el in SIMB:
    a(el(y) + f'<text x="{lx+34}" y="{y}">{t}</text>'); y += 22
y += 14
a(f'<text x="{lx}" y="{y}" font-size="15" font-weight="800">EMPRESAS (sinalização legível)</text>'); y += 22
for t in ['SCL Automação', 'Salus (Método Salus)', 'Athostec', 'Unimed Meio Oeste SC']:
    a(f'<text x="{lx}" y="{y}">• {t}</text>'); y += 18
y += 8
a(f'<text x="{lx}" y="{y}" font-size="15" font-weight="800">ILEGÍVEIS / PENDENTES</text>'); y += 22
for t in ['banner "marketplace imobiliário" (sala B)', 'porta com adesivo escuro (sala X)', 'sala de película vermelha (sala A)', 'salão do fim do corredor']:
    a(f'<text x="{lx}" y="{y}">• {t}</text>'); y += 18
y += 8
a(f'<text x="{lx}" y="{y}" font-size="15" font-weight="800">NÃO USAR COMO FATO</text>'); y += 20
for t in ['frente das salas (z 9,0) e fundo da Unimed', 'extensão do salão / terraço', 'cota +12,6 m e pé-direito 3,0 m', 'qual sala usa a porta branca vizinha', 'da Salus']:
    a(f'<text x="{lx}" y="{y}" fill="#7a3d00">• {t}</text>'); y += 18
a('</g></svg>')
svg = f'{OUT}/{NOME}.svg'
open(svg, 'w').write('\n'.join(s))

png = f'{OUT}/{NOME}.png'
if shutil.which('sips'):   # PNG em 2× (o sips rasteriza no tamanho declarado em width/height)
    tmp = f'{OUT}/.{NOME}-2x.svg'
    open(tmp, 'w').write('\n'.join(s).replace(f'width="{W}" height="{H}"', f'width="{2*W}" height="{2*H}"', 1))
    subprocess.run(['sips', '-s', 'format', 'png', tmp, '--out', png], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(tmp)
print('gerados:', f'{OUT}/{NOME}.json', svg, png if os.path.exists(png) else '(PNG: rode sips manualmente)')
