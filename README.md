# Orvalho · Polo Inovale em 3D

Experiência 3D no navegador, em estilo Frutiger Aero: o visitante personaliza o próprio bonequinho de vidro-gelatina (o provador do Orvalho) e explora, em terceira pessoa, o **Laboratório de Inteligência Artificial** e o **Hall do Polo Inovale**. O Hall inclui cafeteria Pin, Nexo, banheiros corrigidos, escada principal e o 1º andar refeito pelas fotos: ACIOC Hub sobre o café, núcleo, Administrativo e, numa ala leste sobre o palco, a Incubadora Joaçaba. Também tem NPCs com conversa e elevador com portas animadas entre o térreo e o 1º andar. Consulte `docs/continuidade/ESTADO-ATUAL.md`.

O Lab continua como ambiente separado porque seu trajeto real no prédio não foi documentado. O elevador do Hall atende somente térreo e 1º andar e não atribui um pavimento ao Lab.

**Jogar online:** <https://millerinds.github.io/Orvalho/> · **Repositório:** <https://github.com/millerinds/Orvalho>

## Tecnologias

- HTML, CSS e JavaScript puros, com scripts clássicos no espaço de nomes `window.Orvalho`. Não há bundler nem etapa de build, e funciona até por `file://`.
- [three.js r149](https://threejs.org/) (cópia local em `vendor/three-r149.min.js`): material vidro-gelatina com shaders próprios, `InstancedMesh` para móveis repetidos e texturas desenhadas em canvas.
- Persistência no `localStorage` do navegador (aparência do avatar e ponto da exploração).
- Testes com [playwright-core](https://playwright.dev/) (só para desenvolvimento), dirigindo o boneco pelo teclado num Chromium real.
- Publicação estática no GitHub Pages por GitHub Actions.

## Como rodar

Não precisa instalar nada nem fazer build.

- **Mais simples:** abra `index.html` no navegador (duplo clique). Funciona por `file://`.
- **Com servidor local** (recomendado para desenvolver):
  ```sh
  python3 -m http.server 8000
  ```
  e abra <http://localhost:8000>.

As fontes vêm do Google Fonts. Sem internet, o navegador usa as fontes de reserva e o resto funciona igual: o three.js está em `vendor/`.

## Controles

| | |
|---|---|
| `W A S D` ou setas | andar (relativo à câmera), inclusive na escada principal |
| `Shift` | correr |
| `Espaço` | pular (só do chão; sem pulo duplo) |
| arrastar o mouse | girar a câmera |
| roda do mouse | aproximar e afastar |
| `E`, `Enter` ou clique na bolha | interagir com o equipamento em foco (Espaço agora é o pulo) |
| `P` ou botão do cabide | abrir o provador sem sair do lab |
| `E` perto de um assento | sentar (E, Espaço, Esc ou andar para levantar) |
| `E` na frente de uma pessoa | conversar (a câmera enquadra a pessoa; `Esc` encerra) |
| `Esc` | fechar painel ou provador |

## Fluxo

1. **Tela inicial:** "Entrar no Orvalho", "Personalizar personagem" e "Continuar exploração" (este último só aparece quando há uma exploração salva). Na primeira visita, "Entrar" passa antes pelo provador.
2. **Provador:** é o do avatar-kit (olhos, 5 corpos, 3 braços, 12 cores, 17 acessórios + "Nenhum", formato da janela). O botão "Entrar no Orvalho" salva e entra.
3. **Jogo:** o boneco entra com a configuração salva, antes do primeiro quadro, então nunca aparece o boneco padrão. O provador abre por cima do jogo pausado; "Voltar ao lab" salva e volta.
4. **Persistência:** a aparência fica no `localStorage`, com as mesmas chaves do kit (`orvalho-avatar-*`). Ambiente, posição horizontal, altura/pavimento e câmera ficam em `orvalho-jogo`.

## Estrutura

```
index.html                 telas (inicial, jogo, provador) e ordem dos scripts
css/orvalho.css            estilos: os blocos "do kit" vêm do avatar-kit sem mudanças
vendor/three-r149.min.js   three.js r149 (a mesma versão e o mesmo build do kit)
src/
  orvalho.js               espaço de nomes window.Orvalho e registro de ambientes
  app.js                   fluxo de telas
  boneco/
    paleta.js              dados do boneco + carregar/salvar o avatar (copiados do kit)
    gelatina.js            material vidro-gelatina e contorno (o shader do kit, compartilhado com os móveis)
    estudio.js             ambiente PMREM de estúdio (reflexos)
    boneco.js              criarBoneco(): modelo, acessórios e animações, sem renderer
    vitrine.js             Doll(): palco pequeno do avatar e do provador (mesma API do kit)
  ui/provador.js           provador do kit, abrindo a partir da tela inicial ou do jogo
  mundo/
    jogo.js                loop, entrada no mundo, WASD, salvar posição
    camera.js              câmera em 3ª pessoa que não atravessa parede
    colisao.js             colisão no plano x/z filtrada pela altura do piso
    sala.js                monta um ambiente a partir da planta (dados)
    moveis.js              catálogo de móveis (peças em metros, paletas, colisão)
    formas.js              caixa arredondada, cilindro e texturas em canvas
    interacao.js           bolha "E · Ver projeto" e painel Aero
    npcs.js                pessoas do espaço (Keila, Dagliê, Danimara) com o kit do avatar
    elevador.js            elevador do Hall: folhas animadas, cabine e painel de andares
ambientes/lab-ia/
  lab-ia.js                planta do lab: medidas reais × jogo, paredes, móveis, interativos
  conteudo.js              texto dos painéis (por enquanto, demonstrativo)
ambientes/hall-inovale/
  hall-inovale.js          planta do hall: fachada, níveis, anexo, pilares, escada, móveis, interativos
  moveis-hall.js           móveis próprios do hall (mesa do café, recepção, arcos, plateia, telão…)
  conteudo.js              texto dos painéis (demonstrativo)
referencia/                avatar-kit.html original (intocado); fotos e esboços ficam só localmente (fora do Git)
docs/                      regras de design, prompts, histórico e decisões (DECISOES.md, MEDIDAS-lab-ia.md)
```

## Testes de navegação

```sh
npm install                       # só o playwright-core, para os testes
npm run teste:avatar              # provador: criar, cancelar, salvar e continuar
npm run teste:navegacao           # Lab de IA, corpo Jujuba (também: teste:navegacao:gota, teste:navegacao:esguio)
npm run teste:hall                # Hall do Inovale, escada, térreo e primeiro andar
npm run teste:primeiro            # matriz focada do 1º andar com Jujuba, Gota e Esguio
npm run teste:tudo                # Lab e Hall com Jujuba, Gota e Esguio
```

Os testes cobrem o provador e dirigem o boneco pelo teclado pela sala inteira, medem corredores, conferem colisores, assentos, transições e, no Hall, sobem/descem a escada, testam guarda-corpos e restauram a altura salva. Os relatórios ficam em `testes/relatorio-*.json`. A suíte procura o Chromium do Playwright em `~/Library/Caches/ms-playwright`; em outro lugar, use `CHROMIUM=/caminho/do/chrome`.

Para rodar a mesma suíte contra o site publicado: `ORVALHO_URL=https://millerinds.github.io/Orvalho/ npm run teste:tudo` (vale também para `teste:avatar`, `teste:hall` e `teste:primeiro`).

## Trabalho em equipe (Juan e Kalil)

O repositório é `millerinds/Orvalho`; a branch principal é `main`. Cada mudança nasce numa branch própria e chega à `main` por pull request revisado.

```sh
git switch main && git pull                 # começa sempre da main atualizada
git switch -c ajuste/porta-do-podcast       # uma branch por funcionalidade ou correção
# ... edita, testa no navegador ...
npm run teste:tudo                          # os testes precisam passar antes do PR
git add -A && git commit -m "Ajusta a porta do podcast"
git push -u origin ajuste/porta-do-podcast
gh pr create --fill                         # ou abra o PR pelo site do GitHub
```

- **Revisão:** a outra pessoa revisa o PR (de preferência abrindo o jogo e conferindo o que mudou). O merge na `main` publica o site.
- **Fotos e material institucional** (pastas `FOTOS HALL/`, `referencia/`, ZIPs, PDF, comparações e plantas em imagem) ficam fora do repositório pelo `.gitignore`. Cada pessoa os mantém localmente. Não publique esse material sem autorização do Polo Inovale.
- Leia `CLAUDE.md` e `docs/continuidade/` antes de mexer no motor ou nos ambientes.

## Publicação (GitHub Pages)

`.github/workflows/pages.yml` roda a cada push na `main` (ou manualmente, na aba **Actions**). Ele copia só os arquivos do jogo (`index.html`, `css/`, `src/`, `ambientes/`, `vendor/`) para o site e publica no Pages. Leva cerca de 1 minuto. O andamento aparece em **Actions** e o endereço é <https://millerinds.github.io/Orvalho/>. Todos os caminhos são relativos, então o jogo funciona no subdiretório `/Orvalho/`. Não há backend: a persistência fica no navegador de cada visitante.

## Como criar outro ambiente

1. Copie `ambientes/lab-ia/` para `ambientes/<id>/` e edite a planta: `sala`, `paredes` (com vãos), `moveis`, `entrada` e `interativos`.
2. Se precisar de um móvel novo, acrescente o tipo em `src/mundo/moveis.js`, sempre com formas arredondadas (`O.formas.caixa`, torno, esferas).
3. Inclua os dois arquivos no `index.html`.
4. A troca de ambiente já existe em `jogo.js` (`carregarAmbiente`). Falta só ligar uma porta a ela (ver `docs/DECISOES.md`).
