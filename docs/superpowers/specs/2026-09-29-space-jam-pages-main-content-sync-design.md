# Sincronização do Pages editorial com a `main`

## Objetivo e fontes

Atualizar localmente o conteúdo do Pages editorial roxo usado nas capturas para a Júlia, sem alterar o visual já aprovado. A referência de conteúdo, conferida novamente em 29/09/2026, é `origin/main` em `6bd710769474b5b7c02c364de2c9e643408de46e`. A base visual é a branch local `codex/pages-desktop-20260922` em `d9dc2d1`, cuja prévia antiga está em `tmp/prints-julia-site/`.

Nenhuma issue será citada dentro do Pages. A análise das issues para ajudar Heitor é trabalho separado no GitHub; esta sincronização não comenta, fecha ou altera issues.

## Estratégia escolhida

Manter a branch visual como base de trabalho e trazer para ela o conteúdo completo da `main`. Não usar os textos antigos da branch visual para substituir revisões incorporadas à `main`. Não redesenhar, reestilizar ou substituir a home, o tema, as fotos, as imagens, os controles ou os componentes existentes.

Uma integração por merge automático não basta: a branch visual alterou páginas de conteúdo, reorganizou o menu e foi criada antes de `mvp.md`. A integração deve ser seletiva e revisada por arquivo. Se uma página nova ou um texto atualizado exigir mudança no desenho para funcionar, interromper e apresentar o conflito ao usuário; não alterar o visual por conta própria.

## Conteúdo e navegação

- Auditar todas as páginas publicadas na `main`, não apenas os exemplos apontados nas capturas. Transferir o conteúdo atualizado de Engenharia de Requisitos, Intervenção Social, Lições Aprendidas, Solução Proposta, Estratégias, Interação, Entregas e demais páginas divergentes. Incluir Priorização e MVP, ausente na versão local. Não corrigir nesta tarefa inconsistências acadêmicas já conhecidas; elas serão tratadas separadamente pela equipe.
- Manter títulos, códigos RF/RNF, números, tabelas, imagens existentes, autores, datas, referências e afirmações da `main`. Preservar a apresentação já construída para as páginas locais quando ela puder envolver o texto atual sem mudar seu significado; se não puder, priorizar fidelidade ao conteúdo e pedir revisão visual.
- Manter a organização do menu local em “Visão do Produto e Projeto”, “Entregas” e “Reuniões”; não trazer os agrupamentos “Unidade 1”, “Unidade 2” ou “Arquivo” da `main`. Acrescentar apenas a entrada necessária para alcançar “Priorização e MVP”. Não alterar cores, tipografia, espaçamentos ou comportamento da barra lateral.
- Atualizar a página principal `docs/licoes-aprendidas.md` com as lições atuais da `main`, no lugar já existente no menu. Manter `docs/licoes_aprendidas.md` como encaminhamento legado, sem incluí-lo na navegação; o conteúdo antigo do “Arquivo” não deve reaparecer.
- Manter `docs/unidade-2.md` excluído do site: na `main`, essa página é apenas um aviso de espaço reservado e não contém artefato novo. A tabela de `docs/requisitos.md` já é idêntica nas duas branches; conferir novamente antes da entrega e não editá-la sem diferença real.
- Não redesenhar a página inicial nem modificar seus cartões, fotos ou composição. Corrigir nela somente links ou referências textuais que fiquem comprovadamente desatualizados após a transferência, mantendo a marcação e as classes existentes.

## Visual intocável

- Não modificar `docs/stylesheets/extra.css`, `docs/javascripts/sj-navigation.js`, `docs/javascripts/sj-tables.js`, `overrides/main.html`, fotografias, logo ou demais assets visuais nesta etapa.
- Manter a configuração visual do MkDocs. Alterar `mkdocs.yml` apenas para tornar acessíveis as páginas que existem na `main` e para preservar as extensões necessárias ao conteúdo; sem trocar tema, paleta, fontes ou recursos de navegação.
- A página de MVP contém tabelas longas e iframes do Miro. Verificar que continuam presentes no conteúdo local. Se sua exibição for inadequada no tema atual, registrar a limitação e consultar o usuário antes de qualquer ajuste visual.

## Isolamento e publicação

Trabalhar na branch visual local já identificada, preservando a `main` remota e os arquivos visuais existentes. Não fazer push, abrir PR, alterar o Pages público ou mexer nas issues durante esta etapa. A publicação só será considerada após conferência de conteúdo, build, testes e aprovação visual do usuário.

## Verificação e critérios de aceite

1. Conferir o inventário completo de páginas, menu, links, imagens e anexos contra a `main` atual: nenhuma página de conteúdo ou destino ausente, com destaque para `mvp.md`; a única exceção deliberada é o aviso vazio de `unidade-2.md`.
2. Comparar, página por página, o conteúdo textual e as tabelas da versão local com a `main`; registrar toda diferença intencional de marcação e comprovar que os arquivos visuais não mudaram.
3. Executar o build MkDocs em modo estrito e os testes existentes, verificando o código de saída e os avisos.
4. Inspecionar os arquivos gerados e os links internos, as imagens e os scripts; pedir ao usuário uma conferência visual do resultado local antes de qualquer publicação. Qualquer necessidade de ajuste visual será apresentada separadamente.
5. Se a inspeção automatizada por navegador local estiver impedida pela política do ambiente, não contornar a restrição. Declarar o limite e deixar a revisão visual para o usuário em um método permitido.

## Fora de escopo

Reclassificar o MVP, corrigir médias ou RNFs, alterar decisões da equipe, avaliar ou fechar issues, publicar o site, substituir a identidade visual por outro protótipo ou incorporar código de fonte externa.
