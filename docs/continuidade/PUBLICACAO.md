# Publicação e trabalho em equipe

Data: 31/10/2026.

## Onde está

| | |
|---|---|
| Repositório | <https://github.com/millerinds/Orvalho> (público, conta `millerinds`) |
| Jogo online | <https://millerinds.github.io/Orvalho/> |
| Branch principal | `main` |
| Primeiro commit público | `f19239296926ead54708add08a42414653c40af8` ("Orvalho 1.0: primeira versão pública") |
| Publicação | GitHub Pages pelo workflow `.github/workflows/pages.yml` (fonte: GitHub Actions) |
| Colaborador | `KalilMassignaniDaRosa`, permissão **write** (convite aceito em 31/10/2026) |
| Proprietário | `millerinds` (admin) |

## Como a publicação funciona

1. Um push ou merge na `main` dispara o workflow "Publicar no GitHub Pages". Também dá para rodá-lo pela aba Actions → "Run workflow".
2. O workflow copia só `index.html`, `css/`, `src/`, `ambientes/` e `vendor/` para `_site/` e publica no Pages. Não há build.
3. O site atualiza em cerca de 1 minuto. Documentação, testes e o kit original não vão para o site.

Todos os caminhos do jogo são relativos, então ele funciona no subdiretório `/Orvalho/` sem ajuste. A persistência (`orvalho-avatar-*`, `orvalho-jogo`) fica no `localStorage` de cada visitante, por origem.

## O que não é publicado

Pelo `.gitignore`, ficam só no computador local:

- `FOTOS HALL/` e `referencia/` (exceto `referencia/avatar-kit.html`);
- ZIPs, o PDF da planta e qualquer `.jpg`/`.jpeg`/`.heic`;
- as montagens foto × jogo (`docs/hall/comparacoes/`);
- as plantas geradas (`docs/hall/planta-hall-v*.{svg,png,json}`); recrie com `python3 docs/hall/gerar-planta-v2.py docs/hall`;
- relatórios e capturas dos testes, `node_modules/` e `.env`.

Publicar esse material exige autorização do Polo Inovale.

## Histórico

- O commit inicial antigo (`f8d4591`) continha fotos do Lab, esboços e prompts e foi assinado com um e-mail institucional. Ele **não foi publicado**: ficou preservado na branch local `historico-local`. Não envie essa branch.
- O histórico público começa no commit limpo `f192392`.
- O repositório local usa `user.email = 168568120+millerinds@users.noreply.github.com` (só neste repositório), para não expor e-mails pessoais nos commits.

## Auditoria antes do primeiro push

- Busca por tokens, chaves, senhas, `.env`, chaves privadas, e-mails, telefones e documentos nos 56 arquivos publicados: nada encontrado.
- Nomes que aparecem: as NPCs Keila, Dagliê e Danimara (primeiros nomes, definidos pelo responsável) e Juan e Kalil na documentação.
- Arquivos publicados: 56 (1,5 MB), sem nenhuma imagem, PDF ou ZIP.

## Testes da primeira publicação

- **Local:** `npm run teste:tudo` + `npm run teste:primeiro`. Passaram fluxo do avatar, Lab (Jujuba, Gota, Esguio), Hall + 1º andar (3 corpos) e matriz do 1º andar.
- **Online:** a mesma suíte com `ORVALHO_URL=https://millerinds.github.io/Orvalho/`. Passou inteira: 860 verificações, 0 falhas, console limpo e cerca de 121 fps no host de teste.
- **Carregamento online:** 58 requisições, nenhuma com erro ou 404. three.js r149 e os dois ambientes carregaram, e o provador abre na primeira visita.
- **Pela URL pública:** testes, documentação e fotos respondem 404 (o site contém só o jogo).

## Fluxo de trabalho recomendado

- Cada mudança fica numa branch própria (`git switch -c tipo/descricao`) e é enviada com `git push -u origin ...`. Depois vem o pull request, a revisão pela outra pessoa e o merge na `main`, que publica o site.
- Rode `npm run teste:tudo` antes do PR. Depois do merge, confira o site, se quiser com `ORVALHO_URL=... npm run teste:tudo`.
- **Proteção da `main`:** não foi configurada. Se for ativada (por exemplo, "exigir PR com 1 aprovação"), Kalil não poderá mais enviar direto para a `main`. Marcar "Do not allow bypassing" bloquearia também o proprietário. Decidir isso com o responsável antes de ativar.

## Pendências

- Os testes automatizados precisam de um Chromium com GPU e não rodam no GitHub Actions; rodam na máquina de quem desenvolve.
- O workflow usa as actions oficiais `checkout@v4`, `configure-pages@v5`, `upload-pages-artifact@v3` e `deploy-pages@v4`. O GitHub avisa que elas migrarão de Node 20; atualizar as versões quando houver novas majors.
