# Direção editorial do Pages Space Jam

## Contexto e decisão

Esta especificação evolui a versão local da branch `codex/pages-desktop-20260922`, no commit `ab920e0`. Ela complementa a [especificação de navegação desktop de 22/09/2026](2026-09-22-space-jam-pages-desktop-design.md), sem refazer o trabalho de menus, fotos, históricos e consolidação de Lições Aprendidas já realizado. O Pages publicado e a `main` não são alvos desta etapa.

O usuário aprovou a direção exibida no estudo visual local `home-editorial-espaco-v2.html`: apresentação editorial e elegante, identidade roxa do Space Jam, logotipo original, fotografias do cliente e da equipe na home e referências discretas à quadra e ao espaço. MindCycle e Crianex servem somente como referências de qualidade de organização e composição; não serão copiados código, tema, textos, imagens nem identidade.

## Resultado esperado

A home deve introduzir o projeto com uma hierarquia clara: título e propósito, problema/oportunidade/pessoas, apresentação do cliente Lucas Cordeiro com a fotografia existente, equipe com os seis arquivos de imagem já mapeados e atalhos para os artefatos principais. O motivo gráfico reúne linhas de quadra e uma órbita/estrelas discretas; é decorativo, não substitui informação nem deve competir com as fotografias. A página deve ter respiro e leitura confortável em desktop, sem excesso de cartões ou um hero que consuma toda a primeira tela.

As páginas internas recebem a mesma linguagem por meio de tipografia, escala de títulos, largura de leitura, separações, links, tabelas e estados de foco consistentes. Não se criará um segundo design específico para Requisitos nesta etapa, porque essa página terá atualização de conteúdo em breve. Os estilos globais devem melhorar sua legibilidade sem depender da estrutura atual dos RFs/RNFs.

## Arquitetura e componentes

Manter MkDocs Material, a árvore de navegação de `mkdocs.yml`, o script de recolhimento do menu e os controles nativos de busca, alternância de tema e repositório. A prévia é uma referência de composição, não uma substituição literal do shell: a barra superior e o menu lateral implementados na versão local continuam funcionais.

- `docs/index.md`: reorganizar somente a apresentação da home em seções semânticas com classes próprias do Space Jam. Manter os destinos dos links existentes; qualquer novo atalho deve apontar para página já existente na navegação. Preservar os arquivos originais `space-jam-logo.svg`, `lucas-cordeiro.png` e `imagens/equipe/*`; não baixar nem inventar retratos. O avatar de Guilherme deve continuar identificado como avatar, não fotografia.
- `docs/stylesheets/extra.css`: substituir estilos da home que se tornarem obsoletos e ajustar regras globais de apresentação sem duplicar seletores conflitantes. Reaproveitar os tokens roxos e superfícies existentes para temas claro e escuro. Títulos principais e secundários podem receber uma serifada editorial; corpo, navegação, rótulos e tabelas permanecem em fonte sem serifa. O motivo espaço/quadra será feito em CSS/SVG próprio, sem nova dependência, imagem externa ou animação necessária para compreender o conteúdo.
- `docs/interacao_equipe_cliente.md`: permitir apenas correções editoriais ou de apresentação pertinentes à página 7, se forem identificadas durante a integração. Nenhuma responsabilidade da equipe pode ser atribuída sem decisão confirmada.
- Demais páginas Markdown: não alterar seu texto, tabelas, datas, autores, requisitos ou decisões. Melhorias visuais nelas devem vir de estilos compartilhados, não de reescrita de conteúdo.
- `mkdocs.yml` e templates de `overrides/`: alterar somente se necessário para carregar estilos ou manter integração acessível com o Material. Não reestruturar navegação nem trocar gerador.

## Comportamento, acessibilidade e falhas

A navegação e a busca devem conservar o comportamento atual mesmo se os elementos decorativos falharem. Imagens usam `alt` fiel, dimensões estáveis e `object-fit` sem distorção; quando uma imagem não carrega, nome e função da pessoa ainda aparecem em texto. O motivo espacial deve ser ignorado por leitores de tela. Links e botões precisam de foco visível, contraste suficiente nos dois temas e áreas clicáveis claras. Tabelas largas podem rolar no próprio contêiner, sem criar rolagem horizontal da página inteira.

Desktop é prioridade, com conferência em 1366×768 e 1920×1080. Em largura menor, as colunas devem empilhar e a navegação móvel nativa do Material deve continuar alcançando todas as páginas. Não haverá efeitos de movimento que exijam tratamento especial de preferência por movimento reduzido.

## Verificação e aceitação

1. Comparar home local anterior e nova para conferir logotipo, sete imagens, nomes, textos alternativos, links e seções; verificar que todos os retratos correspondem ao mapeamento existente.
2. Conferir visualmente a home, a página 7 e páginas internas representativas (incluindo uma tabela longa e um histórico recolhível) nos dois tamanhos desktop; fazer uma checagem básica da navegação móvel e dos temas claro/escuro.
3. Exercitar menu lateral, menus superiores, busca, página ativa, navegação por teclado e estados de foco. Nenhum painel deve cobrir conteúdo.
4. Executar os testes existentes e `mkdocs build --strict`; adicionar testes focados em estrutura da home, assets e links quando a implementação mudar esses elementos.
5. Revisar `git diff` para confirmar que o conteúdo acadêmico de páginas alheias não mudou e que a paleta/logotipo originais foram preservados.

O trabalho permanece somente na branch e na worktree locais. Não fazer push, PR, merge ou publicação sem nova solicitação de Luiz.

## Fora do escopo

Atualizar ou reescrever requisitos, decidir responsabilidades da equipe, trocar as cores adotadas, substituir o logotipo, migrar de gerador, copiar o visual/código de outro grupo ou publicar o Pages.
