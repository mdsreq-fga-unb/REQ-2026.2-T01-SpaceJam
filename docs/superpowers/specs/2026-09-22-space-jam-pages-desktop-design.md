# Navegação e revisão visual desktop do Pages Space Jam

## Contexto e limites

O ponto de partida é o Pages presente na `main` em 22/09/2026 (`2e85a7d`), construído com MkDocs Material. O site Crianex é referência para a organização da navegação e para os comportamentos de menus, não para marca, cores, textos, imagens ou código. A implementação ficará local: sem push, PR, merge ou publicação.

A identidade atual do Space Jam permanece: logotipo, paleta, tipografia e conteúdo. As cinco edições de conteúdo já existentes na cópia local (`cronograma.md`, `engenharia_requisitos.md`, `estrategia.md`, `interacao_equipe_cliente.md` e `solucao.md`) devem ser preservadas sem reescrita incidental.

## Resultado esperado

No desktop, o leitor encontra a navegação completa já aberta à esquerda, pode recolhê-la pelo botão ☰ e vê o conteúdo ocupar o espaço liberado. A barra superior oferece acesso rápido às páginas e grupos principais, com menus expansíveis quando houver páginas-filhas. Os dois caminhos de navegação apontam para as mesmas páginas canônicas. Nenhum painel deve cobrir o texto no desktop.

O escopo inclui também a revisão dos problemas visuais globais do Pages: títulos longos na navegação, densidade e recorte de tabelas, consistência de espaçamentos, duplicação de Lições Aprendidas e apresentação dos históricos de revisão. Desktop é a prioridade; o comportamento móvel deve continuar funcional, sem tentativa de reproduzir integralmente o Crianex no celular.

## Arquitetura e navegação

Manter MkDocs Material. A árvore de navegação em `mkdocs.yml` é a fonte das páginas. O menu lateral preserva a estrutura de Início, Unidade 1, Unidade 2 e Reuniões, com subgrupos recolhíveis. Ao carregar em desktop pela primeira vez na sessão, começa aberto; o botão ☰ alterna entre aberto e recolhido. Quando aberto, reserva espaço próprio; quando fechado, o conteúdo se expande. Guardar a preferência de aberto/fechado em `sessionStorage` durante a sessão, sem depender de conta, serviço externo ou nova biblioteca.

A barra superior expõe Início, Unidade 1, Unidade 2, Cronograma e Reuniões. Unidade 1 e Unidade 2 abrem menus de suas páginas-filhas; Cronograma é um atalho para a página existente `cronograma.md`, não uma página nova. Entregas permanece encontrável na Unidade 1, sem atalho superior nesta etapa. Os rótulos devem ser derivados ou validados contra a navegação existente, evitando páginas inexistentes e divergência de URLs.

Usar uma extensão localizada do tema para os controles que o Material não fornece nesse formato: template/partial para a barra superior e botão acessível, CSS para o encaixe do painel e um script pequeno para alternância de estado e menus. Preservar os controles nativos de busca, tema e repositório. Não migrar para Docusaurus nem copiar CSS, assets ou componentes do Crianex.

Botões e menus devem funcionar por clique e teclado: foco visível, `aria-expanded` refletindo o estado, fechamento por Escape e retorno de foco ao acionador. O item da página atual deve ser identificável nos dois caminhos. Com JavaScript indisponível, a navegação nativa do Material deve continuar utilizável.

## Conteúdo e revisão visual

Lições Aprendidas terá uma página canônica: `docs/licoes-aprendidas.md`. Migrar para ela somente o material exclusivo e pertinente de `docs/licoes_aprendidas.md`, sem repetir parágrafos ou tabelas já presentes. Retirar o grupo “Arquivo / Lições Aprendidas (versão anterior)” da navegação. Não apagar a versão antiga sem conferência; após a migração, mantê-la apenas como página curta que aponta para a canônica, preservando o histórico Git do texto anterior.

Nas páginas com histórico de versão/revisão existente, usar o bloco recolhível já suportado por `pymdownx.details`. Preservar todas as linhas, datas, autores e descrições originais. Não criar histórico onde não há um. Usar o rótulo consistente “Histórico de revisão”, sem contador de versões nesta etapa para evitar um número desatualizado.

Auditar todas as páginas publicadas na `main`, não apenas a inicial. Ajustar de modo global alinhamentos, quebras, contraste, largura e bordas de tabelas quando houver defeito observável, sem alterar dados acadêmicos nem a paleta. Nas tabelas extensas — especialmente Requisitos, Solução, Engenharia de Requisitos e Cronograma — priorizar leitura no desktop e rolagem horizontal contida quando necessária, sem cortar texto ou produzir overflow da página inteira.

Adicionar as fotos autorizadas da equipe e do cliente quando os arquivos forem fornecidos. Na página inicial, os integrantes devem aparecer na seção Equipe, associados aos nomes já existentes; Lucas deve aparecer identificado como cliente/treinador, preferencialmente na seção de perspectivas de uso ou na página de cenário atual. Fotografias devem ter proporção preservada, texto alternativo e legenda/crédito quando aplicável. Não buscar retratos na internet, não inventar imagens e não publicar fotos de pessoas sem confirmação de que a equipe pode usá-las. A ausência de arquivos não impede a implementação e validação da navegação; a etapa de fotos fica pendente até o recebimento dos materiais.

## Verificação e limites de aceitação

- A compilação do MkDocs termina sem links internos quebrados introduzidos pela mudança.
- Conferir navegação, menus, busca, página ativa, claro/escuro e recolhimento do painel em pelo menos 1366×768 e 1920×1080; o conteúdo não fica encoberto ou comprimido indevidamente.
- Conferir páginas representativas de cada grupo e todas as páginas com tabelas/histórico. Não deve haver transbordamento horizontal da página; tabelas largas podem rolar dentro de seu contêiner.
- Conferir que a navegação móvel do Material ainda permite alcançar as páginas, embora a composição desktop tenha prioridade.
- Comparar antes/depois a lista de páginas, links e alterações de conteúdo; preservar as cinco edições locais existentes e não modificar cores ou logotipo.
- Validar que cada foto adicionada corresponde à pessoa identificada, tem texto alternativo e veio de arquivo indicado ou fornecido pelo usuário.
- Revisar `git diff` e manter tudo local, sem envio ao GitHub.

## Fora do escopo

Reescrever requisitos, mudar responsabilidades da equipe, buscar fotos sem autorização, redesenhar a identidade visual, resolver PRs ou publicar o Pages.
