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
- 2º e 3º pavimentos indisponíveis no seletor;
- ACIOC Hub, Incubadora e Administrativo com piso/folga navegáveis;
- cadastro dos NPCs Keila, Dagliê e Danimara;
- quatro empresas confirmadas na Incubadora;
- erros de console e desempenho.

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
