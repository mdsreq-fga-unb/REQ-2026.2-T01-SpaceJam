# Registros de aplicação de DoR e DoD

Os registros distinguem preparação, execução, revisão e validação. Um critério sem comprovação permanece **Não atendido**; a justificativa de **Não se aplica** vale apenas para o tipo de entrega indicado.

[Definições e critérios](dor_dod.md) · [Análise documental de 08/11](analise_upload_desempenho.md)

## Aplicação ao Backlog e ao MVP {#aplicacao-backlog-mvp}

**Artefatos:** [Backlog](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/56497c32cbe6d376ef5093123a666d477c744e29/docs/backlog.md) e [MVP](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/56497c32cbe6d376ef5093123a666d477c744e29/docs/mvp.md), commit `56497c32cbe6d376ef5093123a666d477c744e29`, no [PR #68](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/68). **Revisor identificado:** Heitor (`HeitorM50`). **Conferência deste registro:** 16/11/2026.

A [revisão formal](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/68#pullrequestreview-5914462128) foi registrada como `COMMENTED` em 15/11, às 23h44 de Brasília (16/11, às 02h44 UTC). Os [achados publicados](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/68#issuecomment-6906143763) e a [correção posterior sobre RN01](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/68#issuecomment-6926603105) não constituem aprovação da entrega.

| Critério | Resultado e evidência |
| --- | --- |
| DoD01 | Não atendido: o documento registra 62 RFs/46 no MVP; o catálogo comparado tem 65/49. Faltam RF3608–RF3610 no planejamento e a revisão da capacidade do recorte. |
| DoD02 | Não atendido: há revisão pública identificada, mas as correções bloqueantes e sua verificação continuam pendentes. Confirmar com Heitor/equipe se a revisão do monitor satisfaz o requisito de revisão por outro integrante. |
| DoD03 | Não atendido integralmente: há verificação documental executada e registrada nos achados sobre contagens, requisitos ausentes, capacidade e consentimento. A cobertura das demais verificações de regras, RNFs e vínculos da entrega não está comprovada; a revisão publicada não foi tratada como prova de todas elas. |
| DoD04 | Não atendido: conciliar códigos, responsáveis, escopo, consentimento de menores e a regra de treinador único com as versões dos requisitos. |
| DoD05 | Não atendido nesta conferência: a versão está disponível no PR para consulta, mas o local previsto para a entrega documental final precisa ser confirmado; não foi presumida publicação no Pages. |
| DoD06 | Não atendido para apresentar este recorte como validado pelo cliente: os comentários apontam decisões de escopo sem retorno da versão examinada vinculado. As atas anteriores não confirmam automaticamente as mudanças posteriores. |

**Resultado:** artefatos avaliados com revisão e achados verificáveis, ainda pendentes pelo DoD. Guilherme precisa tratar os ajustes do Backlog/MVP com os responsáveis pelos requisitos; a análise abaixo de 08/11 permanece como caso histórico complementar.

## Caso histórico: análise documental de 08/11

**Item:** DOC-ANALISE-01. **Encaminhamento:** Luiz. **Resultado esperado:** localizar os compromissos de RNF07/RNF11, comparar seus aceites e registrar divergências e decisões necessárias, sem alterar exigências.

O registro de preparação datado de 08/11 informa que antecedeu o levantamento. A análise e sua conferência foram preservadas com fontes identificadas. Não foi reconstruído um DoR anterior ao trabalho de 04/11, nem atribuída uma decisão coletiva à preparação individual.

| Critério | Resultado na preparação registrada |
| --- | --- |
| DoR01 | Atendido: item, objetivo, saída e limites definidos. |
| DoR02 | Atendido para a análise: prioridade de examinar a inconsistência apontada na revisão e fontes identificadas. Não reclassifica a prioridade dos RFs. |
| DoR03 | Atendido: relatório com trechos verificáveis, vínculos e separação entre constatação e proposta. |
| DoR04 | Atendido para analisar documentos; insuficiente para escolher um novo compromisso de produto. |
| DoR05 | Atendido: documentos e recursos disponíveis para o levantamento. |
| DoR06 | Atendido no registro original para a tarefa delimitada, com encaminhamento de Luiz e três etapas previstas na sessão. Não contém estimativa numérica nem comprova capacidade para implementar os RFs. |

**Decisão registrada em 08/11:** iniciar o levantamento documental delimitado e manter pendente qualquer escolha de nova regra ou meta. A estimativa limitada não foi completada retroativamente.

## DoD da entrega documental

**Entrega avaliada:** análise de 08/11 nas fontes do commit `89afb0e`. **Reavaliação documental:** 16/11/2026. **Revisor de outro integrante:** pendente.

| Critério | Resultado e evidência |
| --- | --- |
| DoD01 | Atendido no recorte de identificar e descrever as divergências: [relatório e fontes](analise_upload_desempenho.md). Não corresponde a resolver os compromissos dos RFs. |
| DoD02 | Não atendido: falta outro integrante conferir a versão, registrar achados e verificar as correções bloqueantes. |
| DoD03 | Atendido para a análise: trechos, códigos e vínculos confrontados com as fontes preservadas. A integridade das 16 fontes e do diff foi reconferida em 16/11. Não houve teste do produto. |
| DoD04 | Atendido no recorte histórico: fontes por versão e códigos da época preservados. A consolidação dos demais documentos continua separada. |
| DoD05 | Não atendido nesta conferência: o [PR #74](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/74) disponibiliza o material, e o [comentário do Heitor](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/74#issuecomment-6926601650) comprova sua consulta. Falta confirmar se o PR é o local previsto para esta entrega ou se a publicação no Pages é necessária. |
| DoD06 | Não se aplica à análise delimitada: ela não altera compromissos nem apresenta requisitos como validados. Qualquer decisão posterior de escopo exige o retorno pertinente. |

**Resultado:** entrega documental executada, com conclusão pelo DoD pendente de revisão e disponibilidade. A existência deste registro não comprova aprovação da equipe ou aceite do cliente.

## Conferência atual {#conferencia-atual}

**Data:** 16/11/2026. As versões examinadas abaixo não foram presumidas integradas entre si ou publicadas no Pages.

| Fonte | Versão examinada |
| --- | --- |
| RFs, histórias, regras e aceites | [Documentação de requisitos](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/tree/36dce72a771daabce8cb5017d2431baac97568b4/docs), commit `36dce72`. |
| RNFs e aceites do PR #70 | [RNFs](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/c0c98224dc7adf17f7cd17a302506718284c0843/docs/requisitos_nao_funcionais.md) e [aceites](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/c0c98224dc7adf17f7cd17a302506718284c0843/docs/criterios_aceitacao.md), commit `c0c9822`. |
| Backlog e MVP | [Versão do PR #68](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/tree/56497c32cbe6d376ef5093123a666d477c744e29/docs), commit `56497c3`. |
| API disponível | [Rotas de contas](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/6e66cf4f9ac0f85296958039958478a5a8a006e1/backend/apps/contas/urls.py) e [modelo](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/6e66cf4f9ac0f85296958039958478a5a8a006e1/backend/apps/contas/models.py), commit `6e66cf4`, integrado em `develop` pelo PR #76. |
| Frontend de acesso | [Código publicado](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/tree/29397ddd21f181020f4cb58e11c74f77df4acc3c/frontend), commit `29397dd`, no Draft PR #77. |

### Conferência técnica anterior de US01–US05

A [conferência encaminhada por Thiago em 16/11](arquivos/conferencia-dor-iteracao1-2026-11-16.pdf) foi localizada após a leitura técnica abaixo. Ela cobre DoR01–DoR05 de US01–US05, US30, US38 e US39 e exclui expressamente DoR06. Seus resultados e ressalvas estão preservados na [complementação da Iteração 1](#conferencia-iteracao1). A tabela abaixo mantém a leitura técnica anterior, focada nas dependências da implementação; não substitui a avaliação documental do PDF. Implementação ausente não comprova, por si só, falta de prontidão para começar a construção.

**Executor do frontend:** Luiz, identificado nos commits e no escopo do [PR #77](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/77), para US01–US05. Isso comprova contribuição executada, não atribuição formal anterior. A transcrição da reunião de 16/11 contém um encaminhamento de continuidade para Luiz/Guilherme, descrito abaixo com seus limites; não foi localizada uma decisão coletiva anterior de liberar as oito histórias com os seis critérios conferidos.

<details class="sj-document-details" markdown="1"><summary>Consultar a leitura técnica anterior à conferência do Thiago</summary>

| Critério | US01 — aluno | US02 — treinador | US03 — saída | US04 — acesso aluno | US05 — acesso treinador |
| --- | --- | --- | --- | --- | --- |
| DoR01 | Atendido nas fontes | Atendido nas fontes | Atendido para saída do aluno | Atendido nas fontes | Atendido nas fontes |
| DoR02 | Atendido nas referências identificadas | Atendido nas referências identificadas | Atendido nas referências identificadas | Atendido nas referências identificadas | Atendido nas referências identificadas |
| DoR03 | Atendido para os cenários declarados | Atendido para os cenários declarados | Atendido para os cenários declarados | Atendido para os cenários declarados | Atendido para os cenários declarados |
| DoR04 | Não atendido: termos/versionamento e consentimento de menores a conciliar | Não atendido: termos/versionamento e fluxo de ativação a vincular | Atendido para a saída declarada | Não atendido: fluxo de aceite dos termos a vincular | Não atendido: fluxo de aceite dos termos a vincular |
| DoR05 | Não atendido: API de cadastro e vínculo ausentes | Não atendido: API de cadastro, ativação e geração do código ausentes | Não atendido: revogação do token sem contrato | Não atendido: destino final e restrições integradas não comprovados | Não atendido: API por e-mail e destino final ausentes |
| DoR06 | Não atendido: frontend identificado; esforço e demais executores a confirmar | Não atendido: frontend identificado; esforço e demais executores a confirmar | Não atendido: frontend identificado; esforço e demais executores a confirmar | Não atendido: frontend identificado; esforço e demais executores a confirmar | Não atendido: frontend identificado; esforço e demais executores a confirmar |

DoR06 exige responsável e estimativa de esforço do item compatível com a disponibilidade na iteração; não exige uma unidade específica nem necessariamente horas. O [Backlog consultado](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/56497c32cbe6d376ef5093123a666d477c744e29/docs/backlog.md) contém responsáveis previstos que precisam ser conciliados com a divisão atual. A [planilha de avaliações](https://docs.google.com/spreadsheets/d/1NsXu36v7VtNlYdEkkLuny1TRThPGN5gy7tsmaVyjv-Y/edit#gid=0) possui notas de esforço e de critério técnico, mas ainda usa requisitos antigos: por exemplo, RF01102 significa login genérico, não o cadastro de treinador do RF1102 atual. Não transferir as notas automaticamente; confirmar item, versão, executor e capacidade. CT não substitui a estimativa de esforço.

Na [área de DoR/DoD do Miro](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764686745506649), o exemplo consultado continua identificado como ilustrativo. A consulta somente leitura de 16/11 foi ampliada às oito histórias da Iteração 1, às tabelas de histórias, esforço e MVP e aos quadros de tarefas, conforme as fontes e limites da complementação abaixo. O PDF original agora está disponível; continuam faltando dados atuais de esforço e capacidade por item.

Uma tarefa delimitada de interface pode avançar com campos e validações definidos, sem inventar contratos. Essa preparação não cumpre o DoR da história integrada nem cria uma decisão coletiva de início.

</details>

### Complementação da Iteração 1 {#conferencia-iteracao1}

**Conferência documental:** Luiz, em 16/11/2026. **Finalidade:** vincular a avaliação existente e procurar os elementos de DoR06 e da decisão de início, sem refazer DoR01–DoR05.

#### Avaliação original localizada

O [PDF original, com nove páginas](arquivos/conferencia-dor-iteracao1-2026-11-16.pdf), foi fornecido nesta revisão como a conferência do Thiago. Em consulta somente leitura, foi confirmado o envio por ele de um documento com esse título e nove páginas ao grupo de evidências em 16/11, às 17h02 de Brasília. A cópia foi preservada integralmente, com SHA-256 `0d78163df7f6a93ba943b0fdf283a457c813033b09968e7f16760da3c0995272`. O documento informa consulta nessa data a requisitos, aceites, regras, DoR/DoD v1.0 e RNFs no Miro; não identifica os commits dessas fontes. Não foi atribuída retroativamente a ele a versão `36dce72`.

| US / RF | Resultado registrado no PDF para DoR01–DoR05 |
| --- | --- |
| US01 / RF1101 | Não pronta: DoR04 não atendido pelo comportamento indefinido do consentimento de menores, RN16. |
| US02 / RF1102 | Pronta. |
| US03 / RF1103 | Pronta, com observações de escopo e regra específica no corpo do documento. |
| US04 / RF1104 | Pronta após registro: dependência de termos/versionamento, RF4812. |
| US05 / RF1105 | Pronta após registro: dependência de RF4812 e autenticação do treinador por e-mail. |
| US30 / RF2413 | Pronta. |
| US38 / RF2421 | Pronta. |
| US39 / RF2422 | Pronta após registro: dependência do CA02 com RF2307/US24. O checklist da página 8 já assinala esse registro como realizado. |

As ressalvas e marcações das páginas 8–9 permanecem no original. A marcação de uma providência no PDF não comprova sua integração nas branches atuais. A expressão “pronta” acima reproduz o alcance da conferência de cinco critérios: **não atesta atendimento do DoR06 nem dos seis critérios em conjunto**. A exclusão de DoR06, atribuída pelo PDF à equipe, não modifica o acordo oficial.

#### Fontes para complementar DoR06

- **F1 — Proposta de planejamento em revisão:** [Backlog do PR #68, linhas 53–67](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/56497c32cbe6d376ef5093123a666d477c744e29/docs/backlog.md#L53-L67). Há nomes por RF e frente, mas não estimativa por item; a distribuição diverge da divisão atual informada para o frontend.
- **F2 — Miro, consulta somente leitura em 16/11:** [Iteração 1, 09 a 16/nov](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764690472698622), com setup e oito cartões de US; [histórias](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764690194521193), com código, descrição e RNFs; [escala de esforço](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764685043486898), com níveis 1–5; [entregas](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764686839425108), com responsáveis por documentos e estimativas vazias nos registros examinados. Os cartões da iteração não exibiram executor ou estimativa. A escala sozinha não atribui uma nota a cada US. Não foram localizados dados de disponibilidade por executor nesses recortes; isso não afirma que inexistam em toda a conta.
- **F3 — Reunião de 16/11, transcrição automática fornecida à equipe:** em 34:50–35:44, Júlia identifica Luiz no frontend de US01–US05 e Guilherme fala do backend; em 44:17–45:28, Guilherme identifica cadastro/login como sua parte e Thiago orienta Luiz a revisar e Guilherme a prosseguir. O documento original foi conferido pelo SHA-256 `759a33f7983810ba7f3c3f2728d0f4f486512931a04e3416b10e666c9a092550`. Fonte disponível para conferência local, sem link público e sem confirmação pelo áudio nesta análise: comprovação parcial, sem publicar transcrição ou gravação. Não individualiza todas as tarefas de backend.
- **F4 — Execução disponível:** [PR #77, frontend de US01–US05](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/77), em `29397dd`, e [commit de Thiago na branch de US30](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/commit/ac1c207ea8cde6d5981649e23bcca7f67e1ad1f4), com alterações no backend. Identificam contribuição e versão, não a atribuição formal no planejamento nem o atendimento do DoD.

A divisão comunicada entre Luiz, no acesso, e Júlia, na biblioteca, precisa ser conciliada com F1. O relato posterior de Thiago sobre uma divisão anterior de back/front não localiza seu registro original, a estimativa ou a capacidade. Não foi convertido em decisão formal por US.

#### Resultado por história

**Classificação das fontes:** Comprovada quando o registro sustenta a informação delimitada; Parcialmente comprovada quando faltam elementos ou consulta pública; Desatualizada quando a distribuição diverge da comunicada; Não localizada quando o dado não apareceu nas fontes examinadas. A situação do critério exige os três elementos juntos: responsável, esforço e compatibilidade com a disponibilidade.

| US | Responsável: registro e alcance | Estimativa | Disponibilidade | Evidência | Situação do DoR06 |
| --- | --- | --- | --- | --- | --- |
| US01 | F1: Thiago (Back) / Anderson (Front), distribuição a conciliar. Luiz identificado no Front por F3/F4; backend de cadastro relatado por Guilherme, sem atribuição individual conciliada. | Não localizada para a versão atual. | Janela da iteração registrada; capacidade individual não localizada. | F1–F4. | Parcialmente comprovada; não atendido integralmente. |
| US02 | F1: Guilherme (Back) / Júlia (Front), distribuição a conciliar. Luiz identificado no Front por F3/F4; relato de Guilherme abrange cadastro/login. | Não localizada para a versão atual. | Capacidade individual não localizada. | F1–F4. | Parcialmente comprovada; não atendido integralmente. |
| US03 | F1: Guilherme (Back) / Júlia (Front), distribuição a conciliar. Luiz identificado no Front por F3/F4; responsável atual da revogação a confirmar. | Não localizada para a versão atual. | Capacidade individual não localizada. | F1–F4. | Parcialmente comprovada; não atendido integralmente. |
| US04 | F1: Guilherme (Back) / Paulo (Front), distribuição a conciliar. Luiz identificado no Front por F3/F4; relato de Guilherme abrange cadastro/login. | Não localizada para a versão atual. | Capacidade individual não localizada. | F1–F4. | Parcialmente comprovada; não atendido integralmente. |
| US05 | F1: Thiago (Back) / Luiz (Front). Front de Luiz identificado; backend a conciliar com o relato de Guilherme sobre cadastro/login. | Não localizada para a versão atual. | Capacidade individual não localizada. | F1–F4. | Parcialmente comprovada; não atendido integralmente. |
| US30 | F1: Thiago (Back) / Anderson (Front). Há atividade de Thiago no Back em F4; Júlia foi indicada para a biblioteca na divisão comunicada, a vincular ao item. | Não localizada para a versão atual. | Capacidade individual não localizada. | F1/F2/F4; divisão comunicada. | Parcialmente comprovada; não atendido integralmente. |
| US38 | F1: Guilherme (Back) / Paulo (Front). Distribuição a conciliar com Júlia no Front da biblioteca; atribuição atual por item não localizada. | Não localizada para a versão atual. | Capacidade individual não localizada. | F1/F2; divisão comunicada. | Parcialmente comprovada; não atendido integralmente. |
| US39 | F1: Thiago (Back) / Luiz (Front). Distribuição a conciliar com Júlia no Front da biblioteca; atribuição atual por item não localizada. | Não localizada para a versão atual. | Capacidade individual não localizada. | F1/F2; divisão comunicada. | Parcialmente comprovada; não atendido integralmente. |

Os nomes previstos em F1 são comprovados como conteúdo daquela versão; sua vigência atual não foi presumida. CT e quadrante de priorização não substituem a estimativa. Notas dos RFs antigos dependem de correspondência de código e escopo antes de serem usadas. Não se exige unidade em horas. O calendário de 09–16/nov e o relato de que as atividades caberiam no prazo não demonstram a capacidade individual nem a compatibilidade da soma dos itens com o ciclo.

#### Decisão de início e encaminhamento localizado

A transcrição F3 contém um encaminhamento identificável de **continuidade**: em 45:28, Thiago orienta a revisão de Luiz e a continuidade de Guilherme, no contexto de cadastro/login. Há data, interlocutor e recorte, mas faltam versão específica, confirmação por item e elementos do DoR06. A fonte é automática e ainda sem consulta pública; o encaminhamento fica parcialmente comprovado, sujeito à conferência do registro.

Esse trecho não é a decisão inicial de liberar coletivamente as oito histórias. O PDF comprova uma avaliação documental existente; a divisão de tarefas e o código publicado comprovam outros fatos. Nenhuma dessas fontes foi tratada isoladamente como aprovação coletiva ou como dispensa do DoR06. Falta vincular a decisão original, se existente, com data, participantes, itens e tratamento dos bloqueios; uma confirmação feita agora deve manter sua data real.

### RF3501 — conciliação de upload e desempenho

RF3501/US42 possui aceites na versão consultada, mas a conciliação de seus compromissos continua pendente, inclusive no [comentário de revisão do PR #70](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/70#issuecomment-6926600139).

| Relação nas fontes identificadas | Divergência e encaminhamento |
| --- | --- |
| RNF07 / US42 CA02, em `c0c9822` | RNF07 é evolutivo e exige progresso de 1% a 99%, término em 100% e confirmação em até 1 s. O aceite já exige barra de 1% a 99%. Definir o piso obrigatório do incremento e a conclusão do indicador; alinhar classificação e aceite. |
| RNF11 / US21 CA01 e US51 CA04, em `c0c9822` | Os aceites exigem cinco segundos; RNF11 é evolutivo e especifica Fast 4G, até 50 requisições simultâneas, p95 e zero erros 5xx. Conciliar obrigatoriedade, abrangência e condições de medição. |
| Condição de carga de RNF11 | A declaração usa 50 requisições simultâneas; o último item do checklist menciona 50 req/s. São condições diferentes, a corrigir pelo responsável. |
| Correspondência de versões | O desempenho é RNF11 no PR #70, mas RNF10 na branch `36dce72`, onde RNF11 trata da integridade da biblioteca. Conciliar os vínculos; manter RNF11 nas fontes históricas de 08/11. |

**Responsáveis a consultar:** Anderson, Thiago e Guilherme, nas frentes de RNFs, requisitos e planejamento. Quando a decisão mudar o comportamento ou o nível de serviço combinado, confirmar com Lucas. Não foi escolhida unilateralmente uma meta, retirado um aceite ou executado teste de upload/carga. O DoR completo de RF3501 também depende de recursos, contratos, responsáveis e esforço identificados.

### Retornos do cliente e DoD06

As atas preservam retornos do cliente nas datas registradas. A correspondência abaixo é por significado; não constitui aceite de todas as condições das fichas atuais.

| Item relacionado | Retorno documentado | Alcance e pendência |
| --- | --- | --- |
| RF1101 — cadastro do aluno | [26/09](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/atas/2026-09-26-lucas.md): autocadastro sujeito à autorização do treinador e frequência de atividade física. | Confirma a demanda discutida, não automaticamente o código de vínculo, todos os campos e os aceites posteriores. |
| RF3501 — vídeo e RF3608 — relato do aluno | [26/09](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/atas/2026-09-26-lucas.md): vídeo opcional e utilidade do relato textual do aluno. [08/10](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/atas/2026-10-08-lucas.md): avaliação e correção pelo treinador. | Não comprova os limites de mídia, o percentual de progresso ou todas as regras posteriores do feedback do aluno. |
| RNF01/RNF03 — uso móvel e navegadores | [08/10](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/atas/2026-10-08-lucas.md): uso pelo celular e menção a Chrome/Safari. | Não confirma automaticamente 360 px nem a baseline completa de versões e sistemas do PR #70. |
| RN01/US02 — treinador único e ativação | Regra definida nas versões consultadas; o [PR #70](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/70#issuecomment-6926600139) pede o registro do cliente ou identificação como proposta. | Confirmação específica da versão atual por Lucas não localizada nas atas examinadas. |
| RNF07 e desempenho — RNF11 histórico/RNF10 na branch RF | Metas identificadas nos documentos e aceites, com divergências acima. | Retorno de Lucas sobre os compromissos atuais não localizado nas fontes vinculadas. |

Não foi localizada uma relação completa de requisitos atuais confirmados por Lucas, com versões e decisões. A confirmação interna dos 65 RFs não a substitui. Quem acompanhou as validações precisa vincular os registros existentes; mudanças ainda não confirmadas permanecem pendentes. Não classificar todos como aprovados nem todos como rejeitados por ausência desse vínculo.

### Disponibilidade e estado das histórias

O [PR #74](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/74) disponibiliza esta contribuição desde 16/11, às 12h59 de Brasília; o [comentário do Heitor](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/74#issuecomment-6926601650), às 16h20, comprova a consulta. Isso não representa aprovação ou publicação no Pages. Confirmar com Heitor/equipe se o PR satisfaz o local previsto para esta entrega documental ou se é necessária sua integração no site.

Nenhuma das cinco histórias foi declarada concluída. Em US01/US02 faltam persistência, códigos, unicidade e termos; o consentimento de menores em RN16 precisa ser conciliado com RF4814, atualmente fora do MVP. US03 não comprova revogação no servidor. US04/US05 precisam de destinos, termos e permissões integrados; US05 ainda depende da API por e-mail.

O frontend foi disponibilizado para revisão no [Draft PR #77](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/pull/77), commit `29397ddd21f181020f4cb58e11c74f77df4acc3c`. A execução local dessa versão em 16/11, às 16h51 de Brasília, aprovou 54 testes Vitest, lint e build. Os testes usam requisições simuladas e não comprovam integração com API e banco. A [identificação da versão examinada](arquivos/verificacao-interface-2026-11-16.json) contém os 22 hashes, comandos, ambiente e trechos das saídas reais. A execução anterior de 38 testes pertence a um registro histórico local, sem commit público correspondente, e não é usada como evidência desta versão.

Para o DoD das histórias, DoD01/DoD03/DoD04 têm comprovação parcial; DoD02 e DoD05 não estão atendidos, e DoD06 depende da validação pertinente ao objetivo da entrega. O PR #77 comprova disponibilidade para revisão do código, não integração nem conclusão. A revisão independente das USs continua pendente.

### Pendências para concluir as issues

| Pendência | Encaminhamento |
| --- | --- |
| Avaliação e decisão de início da Iteração 1 | PDF original localizado e vinculado, preservando DoR01–DoR05. Falta identificar os commits das fontes dele e o registro da decisão inicial; a continuidade encontrada na transcrição não comprova liberação coletiva. Thiago/equipe: conferir esses vínculos. |
| DoR06 dos oito itens | Conferência parcial acima: conciliar nomes do Backlog com a divisão atual, vincular estimativa por US e demonstrar compatibilidade com a capacidade. Thiago/executores: fornecer o registro existente ou completar o planejamento com a data real. |
| DoD02 e correções do Backlog/MVP | Guilherme e revisor: corrigir os achados e registrar sua conferência; Heitor/equipe: confirmar o enquadramento da revisão externa. |
| Confirmações de requisitos | Lucas e participantes: vincular retornos por versão; confirmar mudanças não abrangidas pelas atas anteriores. |
| Upload e desempenho | Anderson, Thiago e Guilherme: conciliar RNFs, aceites e recorte, com decisão registrada. |
| DoD05 da entrega documental | Heitor/equipe: confirmar o local previsto e a disponibilidade exigida; não presumir que abrir PR conclui o critério. |

As issues #59 e #60 continuam abertas enquanto faltarem essas comprovações. As pendências não impedem publicar correções factuais já verificadas, mas impedem declarar o DoR/DoD integralmente cumprido.
