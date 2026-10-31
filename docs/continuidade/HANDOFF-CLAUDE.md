# Handoff para o Claude

> **Atualização de 30/10/2026 (Claude):**
> - o 1º andar foi refeito pelas fotos e pelas duas fotos novas do térreo (X46, X47);
> - a Keila agora atende pela frente do balcão;
> - o elevador ganhou portas animadas;
> - leia `EXPANSAO-PRIMEIRO-ANDAR.md` antes de mexer no 1º andar.
>
> Histórico da fase anterior. Para o estado após as fotos E01–E45, leia primeiro `ESTADO-ATUAL.md` e `EXPANSAO-PRIMEIRO-ANDAR.md`; a ligação provisória pelo elevador descrita abaixo foi removida.

## Contexto

O Orvalho é uma experiência 3D estática em three.js r149. O usuário personaliza um boneco de vidro-gelatina e explora o Lab de IA e o Hall do Polo Inovale. Este handoff conclui a etapa interrompida em que o motor já tinha rascunhos para níveis e anexos, mas o jogo ainda permanecia em `y = 0`.

Leia, nesta ordem:

1. `docs/continuidade/ESTADO-ATUAL.md`
2. `docs/continuidade/CORRECOES-HALL.md`
3. `docs/continuidade/ARQUITETURA-TECNICA.md`
4. `docs/continuidade/TESTES-E-VALIDACAO.md`
5. `README.md`, `docs/DECISOES.md` e `docs/REGRAS-orvalho.md`

## Estado anterior

- Hall térreo explorável e detalhado.
- Escada visual bloqueada.
- `sala.js` e `colisao.js` continham código parcial para faixas de altura, anexos e `alturaPiso`.
- `jogo.js` não usava esse código: não havia `st.y`, colisão por nível no movimento ou persistência vertical.
- Cafeteria estava orientada na parede oeste.
- Nexo avançava para o centro do salão.
- D01–D06 ainda não estavam incorporadas à planta/cena.

## Git antes desta etapa

- Branch `main`.
- `.gitignore` já estava modificado.
- Havia renomeações staged de documentação, histórico, esboços, fotos do Lab e Avatar Kit para `docs/` e `referencia/`.
- A maior parte da implementação atual (`README.md`, `src/`, `ambientes/`, `testes/`, `docs/hall/` etc.) já aparecia como untracked.
- Nada desse estado anterior foi descartado, revertido, commitado ou enviado.

## Trabalho realizado

- Integração completa de `y` no movimento, câmera, colisão e save.
- Escada principal navegável com rampa suave sob os degraus visuais.
- Primeiro andar acessível, com guarda-corpo, abertura da escada e vidro sólido.
- Cafeteria recomposta conforme D01/D03/D04.
- Nexo alinhada à parede e corredor/banheiros adicionados conforme D02/D05/D06.
- Planta v2 JSON/SVG/PNG gerada e consistente com a cena.
- Teste automatizado ampliado para níveis, guarda-corpos e persistência.
- Fluxo dedicado do Avatar Kit cobrindo primeira visita, cancelamento, salvamento e retomada.

## Validação final

- Avatar Kit/provador: passou, incluindo Cancelar, Salvar e Continuar.
- Lab: Jujuba, Gota e Esguio passaram.
- Hall: Jujuba, Gota e Esguio passaram, com 100% da área livre alcançável em cada corpo.
- Escada, primeiro andar, guarda-corpos, vidro, persistência vertical, assentos e Hall ↔ Lab passaram.
- Console sem erros nos sete cenários.

## Decisões técnicas

- O personagem continua um círculo em x/z; colisores são filtrados pela cota do piso.
- Degraus visuais usam uma rampa de navegação contínua para evitar engasgos.
- `null` em `alturaPiso` significa “não há piso nesta altura” e impede quedas.
- Salas sem referência permanecem fechadas.
- v0/v1 foram preservadas; a versão atual é v2.
- A escada de emergência não foi convertida em escada aberta.

## Arquivos principais modificados/criados

- Motor: `src/mundo/sala.js`, `jogo.js`, `camera.js` e `formas.js` (o suporte parcial preexistente de `colisao.js` foi integrado sem recomeçar o módulo)
- Hall: `ambientes/hall-inovale/{hall-inovale,conteudo}.js`
- Testes: `testes/navegacao.js`, `testes/fluxo-avatar.js`, `package.json`
- Planta: `docs/hall/gerar-planta-v2.py`, `planta-hall-v2.{json,svg,png}`, `indice-fotos-correcao.txt` e `CORRECOES-FASE-CD.md`
- Continuidade: os cinco arquivos deste diretório
- Decisões/entrada: `docs/DECISOES.md`, `README.md` e `CLAUDE.md`
- Artefatos de teste: `testes/relatorio-fluxo-avatar.json`, `testes/relatorio-navegacao-*.json` e capturas `testes/*.png`

## Problemas conhecidos

- Trajeto real até o Lab desconhecido; elevador continua como ligação provisória.
- Medidas do térreo/primeiro andar são estimadas, salvo estrutura do PDF do ático.
- Conteúdo institucional de vários painéis ainda é demonstrativo.
- Logos oficiais/terceiros ainda pendentes.

## Próximos passos recomendados

1. Obter planta do térreo e primeiro andar e medir escada/pé-direito.
2. Ajustar a v2 sem mover elementos confirmados por D01–D06.
3. Substituir a transição provisória pelo trajeto real ao Lab.
4. Trocar conteúdo demonstrativo e logo aproximado por arquivos oficiais.
5. Se novas áreas superiores forem abertas, ampliar `niveis.superior.areas` e seus segmentos; não liberar piso sem guarda-corpo.

## Rodar e testar

```sh
python3 -m http.server 8000
# abrir http://localhost:8000

npm install
npm run teste:tudo
npm run teste:avatar

python3 docs/hall/gerar-planta-v2.py docs/hall
sips -s format png docs/hall/planta-hall-v2.svg --out docs/hall/planta-hall-v2.png
```

Não fazer push ou commit sem revisão do usuário. O repositório já continha muitas alterações não rastreadas/renomeadas antes desta etapa; preserve-as.
