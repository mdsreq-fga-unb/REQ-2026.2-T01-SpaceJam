# DoR e DoD

Versão 1.0, consolidada em 11/10/2026. Os critérios podem ser ajustados conforme a evolução do projeto, mantendo o histórico de revisão.

O **DoR (Definition of Ready)** define as condições para iniciar um item de trabalho. O **DoD (Definition of Done)** define as condições para concluir e entregar esse item. Os critérios seguem a abordagem híbrida do Space Jam e seu processo RAD (Rapid Application Development), com ciclo iterativo e incremental, considerando o objetivo e o tipo de entrega.

A equipe usa o DoR como **critério de entrada e acordo de prontidão**, antes de iniciar a atividade. No DoD, confere a entrega concluída com revisão, testes e evidências. A conferência do DoR não substitui a verificação interna do resultado nem a validação com o cliente.

Este documento complementa as [Estratégias de Engenharia de Software](estrategia.md), o [Processo de Engenharia de Requisitos](engenharia_requisitos.md) e a [Priorização e MVP](mvp.md).

Os critérios de aceitação descrevem as condições de satisfação de cada item. O DoR e o DoD estabelecem as condições comuns de preparação e qualidade. A equipe deriva testes dos critérios de aceitação e também verifica fluxos alternativos, exceções e limites pertinentes.

Na rastreabilidade, **RF** significa requisito funcional; **RNF**, requisito não funcional; **OE**, objetivo específico; e **CP**, característica do produto.

## DoR - Condições para iniciar

| ID | Critério | Como conferir |
|---|---|---|
| DoR01 | O item possui identificação, objetivo, escopo e resultado esperado claros. | A descrição informa o que será entregue, a necessidade atendida e quem se beneficia, permitindo distinguir o item de outros trabalhos. |
| DoR02 | O item tem prioridade definida e referências aos requisitos e objetivos relacionados, quando aplicáveis. | Conferir a prioridade e o recorte da iteração ou do MVP no backlog. Para requisitos, conferir os códigos vigentes de RFs/RNFs e os vínculos aos OEs e CPs que justificam seu valor. |
| DoR03 | O item possui critérios de aceitação verificáveis e uma forma de avaliá-los. Para funcionalidades, uma história de usuário ou declaração equivalente descreve o comportamento esperado. | Conferir o perfil, a ação e o benefício, os resultados observáveis e os cenários de aceitação. Registrar as decisões das conversas e vincular a interface quando necessária à atividade. |
| DoR04 | A equipe dispõe das regras, dados, permissões, fluxos e RNFs necessários à atividade que vai iniciar. | Conferir as informações e decisões vinculadas ao item, inclusive limites mensuráveis dos RNFs afetados. Esclarecer com os envolvidos as dúvidas que impedem essa atividade. |
| DoR05 | A equipe identificou dependências e riscos e dispõe dos recursos necessários para começar. | Conferir acessos, ferramentas e pré-requisitos. Dependências posteriores têm encaminhamento registrado; as que bloqueiam o início precisam ser atendidas. |
| DoR06 | O item tem responsável pela execução e estimativa de esforço compatível com a disponibilidade na iteração. | Conferir o responsável e a estimativa no item. Dividir o trabalho quando ele não couber no ciclo previsto. |

No **Design do Usuário**, um protótipo exploratório pode investigar dúvidas de regras ou interação. Seu DoR exige perguntas, fluxos a explorar e resultado esperado definidos, sem exigir que essas dúvidas já estejam resolvidas. Antes da **Construção**, a equipe esclarece o comportamento a implementar e vincula o protótipo ao item quando ele orientar a interface ou o fluxo.

A equipe refina os itens conforme a prioridade; o backlog inteiro não precisa cumprir o DoR de uma vez. Os RNFs que afetam todo o produto precisam de definição antecipada, pois orientam decisões de arquitetura e implementação.

## DoD - Condições para concluir

| ID | Critério | Como conferir |
|---|---|---|
| DoD01 | A entrega atende ao escopo e aos critérios de aceitação, sem pendências que impeçam o resultado previsto. Para funcionalidades do produto, entrega um incremento utilizável. | Conferir cada critério de aceitação com sua evidência. Para funcionalidades do produto, demonstrar o uso da funcionalidade integrada. |
| DoD02 | Outro integrante revisou a entrega e as correções necessárias à conclusão foram verificadas. | Registrar o revisor, a versão avaliada, o resultado da revisão e a resolução dos apontamentos bloqueantes. Para código, conferir os padrões de codificação adotados no projeto. |
| DoD03 | A equipe executou e registrou as verificações aplicáveis, incluindo regras de negócio e RNFs relacionados à entrega. | Identificar no item os RNFs afetados, o método de verificação e os resultados. Para código destinado ao produto, testar fluxos principais, alternativos, exceções, limites, integrações e regressões pertinentes. Aplicar automação conforme requisitos e riscos, priorizando regras, permissões e proteção de dados; justificar os casos de verificação manual e registrar os passos e resultados. |
| DoD04 | A documentação e os vínculos aos artefatos produzidos ou alterados estão atualizados, incluindo as orientações de uso e manutenção pertinentes à entrega. | Conferir versões, códigos, orientações e referências entre o item, requisitos, protótipos, código e testes, conforme a entrega. |
| DoD05 | A entrega e suas evidências estão disponíveis no local previsto para o projeto. Para código destinado ao produto, a alteração está integrada sem falhas bloqueantes nos fluxos afetados. | Conferir os links, arquivos e a versão integrada. Melhorias fora do escopo ficam no backlog; critérios de aceitação pendentes impedem a conclusão. |
| DoD06 | Para entregar RFs/RNFs como validados, a equipe obteve e registrou o retorno e a decisão do cliente. Nas demais entregas, aplica-se quando o objetivo inclui validação com cliente ou usuários. Os ajustes necessários ao aceite foram concluídos. | Vincular data, participantes, versão avaliada, requisitos abrangidos, retorno, decisões e ajustes. Validação necessária ainda não realizada permanece pendente; revisão interna ou ausência de resposta não a substitui. |

## Aplicação por tipo de entrega

| Entrega | Verificações específicas |
|---|---|
| Requisitos, backlog e documentação | Clareza, consistência, necessidade, viabilidade, ausência de duplicações, verificabilidade, códigos e rastreabilidade. Nas histórias, conferir cartão, conversas registradas e condições de confirmação. Para alterações publicadas no Pages, geração do site e links afetados. |
| Protótipo | Telas e fluxos previstos, coerência com os requisitos e permissões dos perfis. Conferir a fidelidade necessária ao objetivo; um esboço de baixa fidelidade não exige aparência final. Em exploração, registrar resultados e dúvidas remanescentes; quando houver validação no objetivo, registrar o retorno dos participantes. |
| Funcionalidade | Comportamento, regras, testes e integração. Verificar acesso, isolamento de dados, responsividade e demais RNFs que afetem a funcionalidade, conforme os requisitos vigentes. |

Um protótipo concluído não comprova implementação da funcionalidade. Uma revisão interna não comprova validação pelo cliente. Na Unidade 2, os critérios de código orientam as próximas entregas e não significam que a implementação já ocorreu.

Para histórias de usuário, a equipe usa **INVEST** como apoio à revisão: independência possível, negociação, valor, possibilidade de estimar, tamanho compatível com a iteração e possibilidade de testar. Dependências inevitáveis têm encaminhamento registrado. RFs e RNFs precisam de declaração adequada ao contexto; a equipe não precisa transformar todo requisito em história de usuário.

Na validação de RFs/RNFs, o cliente confirma a necessidade e o comportamento esperado, inclusive restrições e níveis de qualidade que afetem o uso. A equipe complementa esse retorno com a verificação técnica. Pode concluir uma tarefa delimitada de elaboração de rascunho, mas mantém os requisitos identificados como **pendentes de validação** até registrar o retorno do cliente.

Um protótipo exploratório com código, feito para investigar uma hipótese e não destinado à versão do produto, não exige integração nem a suíte de testes da funcionalidade. A equipe registra as verificações necessárias ao objetivo e aos riscos da exploração. Se utilizar dados reais, os RNFs de proteção e acesso continuam aplicáveis. Para incorporar esse código ao produto, precisa cumprir as verificações de código e integração do DoD.

## Exemplo de aplicação

Exemplo ilustrativo de um protótipo para **consultar o perfil de um atleta acompanhado**, sem código funcional:

- **Escopo e aceite:** navegar da seleção do atleta até o perfil previsto e registrar as respostas às perguntas de exploração.
- **Antes de iniciar (DoR):** identificar requisitos e prioridade, definir o responsável, estimar o esforço e registrar as perguntas e dependências.
- **Antes de concluir (DoD):** conferir o fluxo e o aceite, registrar os resultados e a revisão por outro integrante e disponibilizar o link do protótipo.
- **Se o objetivo incluir validação:** registrar o retorno do Lucas e concluir os ajustes exigidos pelo aceite.

O exemplo não registra execução ou aprovação. Concluir esse protótipo não comprova implementação da funcionalidade.

## Registro e mudança de estado

O responsável registra a conferência no item do backlog, na issue ou em evidência vinculada, identificando a versão, o tipo de entrega e a etapa do RAD. Usa **Atendido**, **Não atendido** ou **Não se aplica** para cada critério. Registra também a data, as evidências e, no DoD, o revisor. Os casos não aplicáveis exigem justificativa pela natureza da entrega; falta de tempo ou de resposta não dispensa critério aplicável.

A equipe inicia o item quando atende ao DoR aplicável e o conclui quando atende ao DoD aplicável. Se houver bloqueio, registra a pendência e seu encaminhamento. A equipe combina mudanças de escopo e aceite; quando alteram necessidades, regras ou resultados esperados do produto, confirma a decisão com o cliente. Registra os participantes, a decisão e os artefatos afetados. Esclarecimentos que preservam o comportamento previsto são refinamentos e ficam registrados junto ao item. Uma pendência não deve ser retirada apenas para marcar o item como concluído.

A equipe revisa estes critérios quando o processo ou o contexto mudar e registra a versão adotada. Para usá-los como acordo de trabalho, os integrantes precisam conhecer os critérios e combinar sua aplicação. A publicação do documento não comprova aprovação coletiva nem cumprimento do DoR/DoD pelos itens do backlog.

A [área de DoR/DoD no Miro](https://miro.com/app/board/uXjVHrFoSVo=/) apresenta o resumo visual destes critérios. A documentação reúne as orientações detalhadas; atualizações devem manter os dois registros coerentes.

## Referências

- Template da disciplina: *Visão do Produto e Projeto*, versão 8, seção 9 e exemplo do Anexo I, páginas 6, 9 e 29-30. O conteúdo de DoR/DoD foi adaptado ao RAD e aos tipos de entrega do Space Jam.
- George Marsicano. Materiais da Unidade 2: *Verificação e Validação - Técnicas*, páginas 10-12, 33-52 e 55; *Declaração de Requisitos - Temas, Épicos e US*, páginas 5-13; *Organização e Atualização - Backlog de Requisitos*, páginas 15-18, 30, 34-36 e 52-54. Paginação do PDF.
- Agile Alliance: [Definition of Ready](https://agilealliance.org/glossary/definition-of-ready/) e [Definition of Done](https://agilealliance.org/glossary/definition-of-done/).
- IBM: [Rapid application development](https://www.ibm.com/think/topics/rapid-application-development).
- Referências de organização consultadas: [WaveON — DoR e DoD](https://mdsreq-fga-unb.github.io/2025.2-T01-WaveOn/visao_produto/dod_dor/) e NutriPlanner — [DoR](https://mdsreq-fga-unb.github.io/2023.2-NutriPlanner/produto/dor/dor/) e [DoD](https://mdsreq-fga-unb.github.io/2023.2-NutriPlanner/produto/dod/dod/). A estrutura foi adaptada ao Space Jam, sem importar ferramentas ou exigências específicas desses projetos.

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | :---: | :---: | :--- | :--- |
    | 11/10/2026 | 1.0 | Consolidação do DoR/DoD e conferência com o template de Visão do Produto e Projeto e os materiais da Unidade 2. | Equipe Space Jam |
