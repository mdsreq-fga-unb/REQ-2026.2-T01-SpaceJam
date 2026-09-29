# Sincronização do Pages editorial com a `main`

## Objetivo e fontes

Atualizar localmente o Pages editorial roxo usado nas capturas para a Júlia, preservando sua identidade visual e usando a `main` publicada como fonte do conteúdo. A referência de conteúdo no início deste trabalho é `origin/main` em `6bd710769474b5b7c02c364de2c9e643408de46e`. A referência visual é a branch local `codex/pages-desktop-20260922` em `d9dc2d1`, cuja prévia antiga está em `tmp/prints-julia-site/`.

Nenhuma issue será citada dentro do Pages. A análise das issues para ajudar Heitor é trabalho separado no GitHub; esta sincronização não comenta, fecha ou altera issues.

## Estratégia escolhida

Usar o conteúdo completo da `main` como base e transportar para ele apenas os elementos de apresentação do Pages editorial. Não usar os textos antigos da branch visual para substituir revisões incorporadas à `main`.

Uma integração por merge automático não basta: a branch visual alterou páginas de conteúdo, reorganizou o menu e foi criada antes de `mvp.md`. A integração deve ser seletiva e revisada por arquivo.

## Conteúdo e navegação

- Preservar os documentos atuais da `main`, incluindo Engenharia de Requisitos, Intervenção Social, Lições Aprendidas, Requisitos, Unidade 2 e Priorização e MVP. Não corrigir nesta tarefa inconsistências acadêmicas já conhecidas; elas serão tratadas separadamente pela equipe.
- Manter títulos, códigos RF/RNF, números, tabelas, imagens existentes, autores, datas, referências e afirmações da `main`. Ajustes puramente de apresentação, como um histórico de revisão recolhível, só são aceitos se não removerem informação.
- Conservar todas as entradas de navegação da `main`, especialmente Unidade 2 → Requisitos e Priorização e MVP, Entregas, Reuniões e Arquivo. A organização visual da barra lateral pode seguir o Pages editorial, mas nenhum destino publicado pode desaparecer.
- Atualizar os cartões e links da página inicial editorial para refletir as páginas da `main` sem inserir um painel de issues ou afirmar que uma validação pendente foi concluída.

## Apresentação e componentes

- Reaproveitar o tema roxo-escuro, os títulos serifados, a composição da home, a fotografia do Lucas, as imagens da equipe, o logo, os estilos de leitura e os controles de navegação da referência visual.
- Levar `docs/stylesheets/extra.css`, `docs/javascripts/sj-navigation.js`, `docs/javascripts/sj-tables.js`, `overrides/main.html` e as imagens exclusivas do visual para uma base atualizada da `main`. Adaptar seletores e scripts somente onde a navegação e as tabelas novas exigirem.
- Configurar o MkDocs para conservar as extensões, o plugin de busca e as páginas da `main`, somando apenas as opções necessárias ao visual. A página de MVP contém tabelas longas e iframes do Miro; ambas devem continuar legíveis e funcionais.
- Manter o visual acessível em telas largas e estreitas, nos temas claro e escuro, sem esconder conteúdo para criar o efeito visual.

## Isolamento e publicação

Trabalhar em uma cópia local isolada, preservando tanto a branch visual original quanto a `main` remota. Não fazer push, abrir PR, alterar o Pages público ou mexer nas issues durante esta etapa. A publicação só será considerada após conferência de conteúdo, build, testes e aprovação visual do usuário.

## Verificação e critérios de aceite

1. Conferir o inventário de páginas e o menu contra a `main` atual: nenhuma página ou destino ausente, com destaque para `mvp.md`.
2. Comparar, página por página, o conteúdo textual e as tabelas da versão local com a `main`; registrar toda diferença intencional de marcação ou home.
3. Executar o build MkDocs em modo estrito e os testes existentes, verificando o código de saída e os avisos.
4. Inspecionar os arquivos gerados e os links internos, as imagens e os scripts; pedir ao usuário uma conferência visual do resultado local antes de qualquer publicação.
5. Se a inspeção automatizada por navegador local estiver impedida pela política do ambiente, não contornar a restrição. Declarar o limite e deixar a revisão visual para o usuário em um método permitido.

## Fora de escopo

Reclassificar o MVP, corrigir médias ou RNFs, alterar decisões da equipe, avaliar ou fechar issues, publicar o site, substituir a identidade visual por outro protótipo ou incorporar código de fonte externa.
