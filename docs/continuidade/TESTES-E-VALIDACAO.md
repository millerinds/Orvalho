# Testes e validação

Data: 30/10/2026.

## Linha de base antes das alterações

Comando: `npm run teste:tudo` na configuração anterior.

- Lab/Jujuba: passou.
- Hall/Jujuba: passou.
- Hall/Gota: passou.
- Console: sem erros.

## Suíte atual

`npm run teste:tudo` executa o fluxo de personalização e seis cenários de navegação:

- primeira visita abre o provador;
- escolha e persistência de corpo/cor;
- Cancelar descarta a edição durante o jogo;
- Salvar atualiza o avatar e o raio do colisor;
- Continuar restaura aparência e ambiente.

| Ambiente | Jujuba | Gota | Esguio |
|---|---:|---:|---:|
| Lab de IA | passou | passou | passou |
| Hall do Inovale | passou | passou | passou |

Para a expansão E01–E45, `npm run teste:primeiro` executa uma matriz focada nos três corpos. Em 30/10/2026 ela passou com Jujuba, Gota e Esguio, incluindo elevador nos dois sentidos, folga nos três ambientes, NPCs, empresas confirmadas e console. O relatório fica em `testes/relatorio-primeiro-andar.json`.

Resultado final: sete cenários passaram (fluxo do avatar + seis combinações ambiente/corpo), sem erro de console. No Hall, os três corpos alcançaram 100% da área livre calculada; a escada chegou a `y = 4,20 m`, a câmera a `y = 6,71 m`, e o desempenho automatizado ficou em 121–122 fps no host de teste.

Além dos testes anteriores, o Hall passa a validar:

- percurso até a cafeteria corrigida;
- Nexo, acesso às salas à esquerda e corredor dos banheiros com portas nos dois lados;
- assentos do térreo e do primeiro andar;
- subida pelos dois lances e patamar;
- cota de +4,2 m no primeiro andar;
- câmera acima do piso superior;
- circulação lateral no corredor superior;
- tentativa de atravessar guarda-corpo e vidro;
- persistência e restauração de `y`;
- descida ao térreo;
- elevador térreo ↔ primeiro andar mantendo aparência e ambiente;
- 2º pavimento indisponível no seletor (o 3º passou a funcionar em 25/11/2026);
- ACIOC Hub, Incubadora e Administrativo com piso/folga navegáveis;
- cadastro dos NPCs Keila, Dagliê e Danimara;
- quatro empresas confirmadas na Incubadora;
- erros de console e desempenho.

## 3º andar e Lab integrado (25/11/2026, Claude)

`npm run teste:tudo` passou a rodar, nesta ordem:

1. fluxo do avatar;
2. 3º andar com Jujuba, Gota e Esguio (`--ambiente=terceiro-andar`);
3. Lab avulso (`--ambiente=lab-ia`);
4. Hall com os três corpos.

`npm run teste:primeiro` continua à parte. Scripts novos: `teste:terceiro` e `teste:lab`.

**Cenário do 3º andar** (`testes/navegacao.js`, coordenadas do ambiente = planta − (3, 3)):

- **Auditoria:** colisores dos móveis novos e do Lab importado contra a geometria visível (≤ 4 cm).
- **Larguras livres:** corredor da SCL, junto ao sofá azul, hall de estar, passagem da porta externa, salão e as quatro zonas do Lab.
- **Cobertura:** calculada com as portas que abrem abertas, sem atravessar as trancadas; as salas fechadas (`fechadas`) ficam fora.
- **Percurso real com o teclado:** monitores do Lab → saída pela porta → painel do Lab → SCL → porta dupla → salão → antecâmara da escada do lado do palco → nicho PCD → Salus → Athostec → estar → Unimed → elevador → antecâmara da escada do lado do café → passagem da porta externa → volta ao Lab, com as interações.
- **Portas:** as que abrem (Lab, porta dupla do salão, escadas de emergência) abrem perto e fecham longe; as trancadas (empresas, salas genéricas, SCL) continuam fechadas e sólidas.
- **Vidros e portas fechadas:** andar contra o vidro do Lab, da sala A, da SCL, da Unimed e contra a porta da Salus não atravessa.
- **Sem paredes invisíveis:** 11 pontos abertos com folga.
- **Vãos de porta:** todo vão de porta das divisórias tem folha.
- **Assentos:** sentar e levantar nos sofás do estar e no sofá azul.
- **Persistência:** autosave e "Continuar" no 3º andar; save antigo do Lab avulso abre o Lab do 3º andar.
- **Elevador:** 3º → térreo do Hall → 3º; 3º → 1º → 3º. Painel com o andar atual e o 2º bloqueados, chegada diante do elevador, aparência preservada, portas abrindo no destino e fechando sozinhas.
- **Console e desempenho.**

**Resultado em 25/11/2026** (rodado em blocos, porque a suíte inteira passa de 10 min nesta máquina): tudo passou, sem erros de console.

| Cenário | Jujuba | Gota | Esguio |
|---|---:|---:|---:|
| Fluxo do avatar | 9 ✔ | — | — |
| 3º andar + Lab integrado | 141 ✔ (167,9 m², 100%) | 141 ✔ (163,2 m², 100%) | 141 ✔ (184,5 m², 100%) |
| Lab avulso (6,0 m) | 33 ✔ (100%) | — | — |
| Hall + 1º andar | 253 ✔ (100%) | 253 ✔ (100%) | 253 ✔ (100%) |
| Matriz do 1º andar (`teste:primeiro`) | passou | passou | passou |

- No 3º andar, a folga mínima durante os percursos foi igual ao colisor nos três corpos: nenhuma penetração.
- Desempenho no host de teste:
  - 3º andar: ~250 chamadas de desenho e 0,95 M triângulos;
  - Hall: ~470 chamadas e 1,57 M triângulos;
  - os dois a 61 fps, que é o limite da tela desta máquina.

**Validação visual:** montagens foto × jogo (corredor, frente do Lab, estar, núcleo, salas, salão) e Lab antes × depois, em `docs/terceiro-andar/comparacoes/fase-b/`.

**Alterações em testes existentes:**

- O jogo começa no 3º andar: o teste só chama `irPara` quando o ambiente atual não é o pedido.
- O fluxo do avatar espera "Continuar" de volta no 3º andar.
- O seletor do elevador agora tem 2 botões desabilitados (o andar atual e o 2º), em `navegacao.js` e em `primeiro-andar.js`; o painel do elevador do Hall se chama "Térreo, 1º e 3º andar".
- O Lab avulso usa as coordenadas novas (6,0 m).
- **Defeito anterior corrigido no teste:** "vidro do 1º andar permaneceu sólido fora da porta" falhava já no `HEAD` original (z = 14,68 numa cópia limpa). O teste empurrava em x = 39, dentro do vão da porta do podcast, que abre desde a 3ª rodada de 31/10. Agora empurra em x = 40,5, no vidro fixo.

## Publicação (31/10/2026)

- **Local e online:** a suíte passou nos dois casos. Online, a mesma suíte roda com `ORVALHO_URL=https://millerinds.github.io/Orvalho/` e passou com 860 verificações e 0 falhas.
- **Testar o site publicado:** use `ORVALHO_URL=<url> npm run teste:tudo` (vale também para `teste:avatar`, `teste:hall` e `teste:primeiro`).

## Correções do 1º andar, 2ª rodada (31/10/2026, Claude)

`npm run teste:tudo` e `npm run teste:primeiro` passaram, sem erros de console: fluxo do avatar, Lab (3 corpos), Hall + 1º andar (3 corpos) e matriz do 1º andar.

Verificações novas em `testes/navegacao.js`:

- **Percursos com o teclado:** entrada → sala de projetos → área de reuniões → Dagliê → Danimara → volta à saída; nicho PCD; as duas antecâmaras de escada do 1º andar; ACIOC; Incubadora pela porta 103, uma sala de incubação, a parte norte (101) e a saída pela porta externa norte.
- **Térreo:** a porta da escada de emergência abre e dá na antecâmara, e as lixeiras ficam fora do vão.
- **Portas:** cada porta que abre (14, contando as 3 de escadas de emergência e a porta externa da Incubadora) é sólida fechada; com o boneco perto, abre (ângulo 1) e o vão fica com folga; com ele longe, fecha (ângulo 0) e volta a ser sólida.
- **Elevador:** a folha da esquerda de quem olha mostra a metade esquerda da arte, nos dois pavimentos.
- **Planejador do teste:** considera as portas abertas e as folhas encostadas (`amb.comPortasAbertas`).

Validação visual: capturas com câmera fixa e quadros do elevador (fechado, começando a abrir, parcialmente aberto, aberto, fechando, fechado). As montagens ficam em `docs/hall/comparacoes/primeiro-andar/correcoes-31-10-b/`.

## Correções do 1º andar (31/10/2026, Claude)

Passaram, sem erros de console: fluxo do avatar, Lab (Jujuba, Gota e Esguio), Hall + 1º andar (Jujuba, Gota e Esguio) e `npm run teste:primeiro`.

A etapa nova "8. 1º andar" de `testes/navegacao.js` faz percursos reais com o teclado, usando um planejador no pavimento (`__planejarEm`):

- chegada da escada → entrada do Administrativo → mesa de reuniões;
- sala interna → Dagliê (logo na entrada) → Danimara (mais para dentro), com "Conversar" funcionando nas duas;
- nicho dos banheiros (PCD);
- corredor do núcleo → porta do ACIOC → interior → entre as ilhas e a bancada;
- corredor diante da sala de podcast → entrada da Incubadora → corredor das salas de incubação ("Salas de incubação") → canto das ripas;
- folga mínima durante os percursos igual ou maior que o colisor (sem atravessar paredes nem móveis);
- vãos livres: folga no meio de cada porta animada (dos dois lados) e na entrada dos nichos;
- portas do elevador nos dois pavimentos: fechadas 0 → abrindo cerca de 0,7 → abertas cerca de 0,99 → fechadas cerca de 0;
- nenhuma empresa nomeada (só "Salas de incubação").

Validação visual: capturas com câmera fixa comparadas com E07, E08, E10, E15, E18, E22, E28, E33, E35 e X46, e quadros da animação do elevador. As montagens ficam em `docs/hall/comparacoes/primeiro-andar/correcoes-31-10/`.

## Revisão do 1º andar (30/10/2026, Claude)

`npm run teste:tudo` e `npm run teste:primeiro` passaram, sem erros de console:

| Cenário | Jujuba | Gota | Esguio |
|---|---:|---:|---:|
| Fluxo do avatar | passou | — | — |
| Lab de IA | passou (100% da área) | passou (100%) | passou (100%) |
| Hall + 1º andar | passou (353,6 m², 100%) | passou (344,7 m², 100%) | passou (389,5 m², 100%) |
| Matriz do 1º andar | passou | passou | passou |

Cobertura nova:

- Parada "Keila": o boneco chega ao ponto de atendimento na frente do balcão, a bolha "Conversar" aparece e o painel abre.
- Auditoria de colisores dos móveis novos do 1º andar, com tolerância de 4 cm.
- Sentar e levantar em 16 assentos por corpo: 4 do térreo e 12 do 1º andar (9 poltronas da ala leste, 1 em frente ao Administrativo e 2 vermelhas no núcleo).
- Escada, guarda-corpo, vidro sólido e persistência vertical.
- Elevador nos dois sentidos, com portas animadas, aparência preservada e 2º/3º andares bloqueados.
- ACIOC, Incubadora (ala leste) e Administrativo navegáveis.
- Desempenho no host de teste: cerca de 121 fps, com 428 chamadas de desenho.

A validação visual foi feita por capturas comparadas com as fotos. As montagens ficam em `docs/hall/comparacoes/primeiro-andar/`.

## Validação visual realizada

Foram inspecionadas capturas de:

- cafeteria, com balcão encostado à parede interna e geladeiras na extremidade;
- frente da Nexo alinhada e passagem das salas ao lado;
- corredor dos banheiros e fechamento envidraçado;
- chegada da escada no primeiro andar e abertura do guarda-corpo;
- planta v2 em PNG.

As capturas dos testes ficam em `testes/*.png` e são ignoradas pelo Git. As plantas v2 são artefatos versionáveis em `docs/hall/`.

## Verificações estáticas

- `node --check` nos arquivos JavaScript alterados: passou.
- `python3 -m json.tool docs/hall/planta-hall-v2.json`: passou.
- `python3 -m py_compile docs/hall/gerar-planta-v2.py`: passou; o cache temporário foi removido.
- `git diff --check`: passou.

## Limites da validação

- Chromium automatizado usa a GPU disponível no host; fluidez final deve ser conferida também numa janela visível na máquina do usuário.
- As medidas arquitetônicas marcadas como estimadas não podem ser validadas sem planta do térreo/trena.
- Portas fechadas não tiveram interior inventado.

## Comandos

```sh
npm install
npm run teste:tudo
npm run teste:avatar
npm run teste:hall
npm run teste:hall -- --corpo=gota
npm run teste:hall -- --corpo=esguio
npm run teste:primeiro
python3 docs/hall/gerar-planta-v2.py docs/hall
sips -s format png docs/hall/planta-hall-v2.svg --out docs/hall/planta-hall-v2.png
```
