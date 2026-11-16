# Registros de aplicação de DoR e DoD

Os registros distinguem preparação, execução, revisão e validação. Um critério sem comprovação permanece **Não atendido**; a justificativa de **Não se aplica** vale apenas para o tipo de entrega indicado.

[Definições e critérios](dor_dod.md){data-sj-nav-parent="true"} · [Análise documental de 08/11](analise_upload_desempenho.md)

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
| DoD05 | Não atendido no registro de 16/11: a entrega ainda não possui confirmação de disponibilização à equipe. Conferir o endereço e a versão efetivamente disponibilizados quando isso ocorrer. |
| DoD06 | Não se aplica à análise delimitada: ela não altera compromissos nem apresenta requisitos como validados. Qualquer decisão posterior de escopo exige o retorno pertinente. |

**Resultado:** entrega documental executada, com conclusão pelo DoD pendente de revisão e disponibilidade. A existência deste registro não comprova aprovação da equipe ou aceite do cliente.

## Conferência atual {#conferencia-atual}

**Data:** 16/11/2026. As fontes abaixo estão em revisão e não foram presumidas integradas à documentação publicada:

| Fonte | Versão examinada |
| --- | --- |
| RFs, histórias, regras e aceites | [Requisitos e regras](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/tree/f242d6b2ff6cde190934d38b238ba1ee7624f00b/docs), commit `f242d6b`. |
| RNFs | [Declarações e verificações](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/8548c55d7b88a4de0b7e7697b4c64db3da09942d/docs/requisitos_nao_funcionais.md), commit `8548c55`. |
| Backlog | [Plano consultado](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/56497c32cbe6d376ef5093123a666d477c744e29/docs/backlog.md), commit `56497c3`. |
| API disponível | [Rotas de contas](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/6e66cf4f9ac0f85296958039958478a5a8a006e1/backend/apps/contas/urls.py) e [modelo](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/6e66cf4f9ac0f85296958039958478a5a8a006e1/backend/apps/contas/models.py), commit `6e66cf4`. |

### Mudanças desde as conferências anteriores

- O cadastro do aluno agora declara e-mail e nascimento; RN24/RN25 definem senha mínima de seis caracteres e frequência semanal de 1 a 7.
- A aprovação administrativa de treinadores foi substituída por treinador único com código de ativação. Não repetir a aprovação administrativa como regra vigente nessa versão.
- Os aceites de US01–US05 foram ampliados. A divergência antiga entre nome e e-mail na declaração do treinador foi corrigida; a API disponível ainda aceita apelido.
- RNF07 e RNF11 passaram a ter métricas e checklists detalhados. Ambos continuam classificados como evolutivos; US42 exige barra percentual e US21/US51 exigem cinco segundos. A conciliação do compromisso do incremento permanece necessária.

### DoR de US01–US05

Avaliação das histórias completas, não apenas de seus formulários. **Encaminhamento da frente de interface:** Luiz, conforme divisão informada. **Decisão coletiva de início:** não registrada nesta conferência.

| Critério | US01 — aluno | US02 — treinador | US03 — saída | US04 — acesso aluno | US05 — acesso treinador |
| --- | --- | --- | --- | --- | --- |
| DoR01 | Atendido nas fontes | Atendido nas fontes | Atendido para saída do aluno | Atendido nas fontes | Atendido nas fontes |
| DoR02 | Atendido nas referências identificadas | Atendido nas referências identificadas | Atendido nas referências identificadas | Atendido nas referências identificadas | Atendido nas referências identificadas |
| DoR03 | Atendido para os cenários declarados | Atendido para os cenários declarados | Atendido para os cenários declarados | Atendido para os cenários declarados | Atendido para os cenários declarados |
| DoR04 | Não atendido: termos/versionamento e consentimento a vincular | Não atendido: termos/versionamento e fluxo de ativação a vincular | Atendido para o comportamento de saída declarado | Não atendido: fluxo de aceite dos termos a vincular | Não atendido: fluxo de aceite dos termos a vincular |
| DoR05 | Não atendido: API de cadastro e vínculo ausentes na versão consultada | Não atendido: API de cadastro, ativação e geração do código ausentes | Não atendido: invalidação de token no servidor sem contrato disponível | Não atendido: destino final e restrições integradas não comprovados | Não atendido: API de login por e-mail e destino final não disponíveis |
| DoR06 | Não atendido para a história completa | Não atendido para a história completa | Não atendido para a história completa | Não atendido para a história completa | Não atendido para a história completa |

DoR06 requer a estimativa das tarefas e a disponibilidade dos responsáveis. CT e nomes no plano não substituem essa comprovação. A avaliação não confirma o estado operacional do Miro nem libera as histórias por decisão dos responsáveis.

Uma tarefa delimitada de interface pode avançar com campos e validações definidos nas fontes, sem simular cadastro ou inventar contratos. Essa preparação não cumpre o DoR da funcionalidade integrada.

### RF3501 — envio de vídeo

RF3501/US42 conserva identificação, prioridade e aceites verificáveis nas fontes acima. O DoR completo continua não comprovado: conciliar CA02 com o tratamento evolutivo de RNF07, comprovar recursos e dependências de envio, confirmar responsáveis e estimativas. O Backlog consultado ainda registra dependências e bloqueio; isso não confirma a situação operacional atual.

### Estado de conclusão das histórias

Nenhuma das cinco histórias foi declarada concluída. Em US01/US02, faltam cadastro persistido, códigos verificados, unicidade e aceite dos termos. Em US03, a saída no navegador não comprova invalidação do token no servidor. US04/US05 exigem destinos, termos e permissões integrados; US05 exige acesso por e-mail.

A preparação da interface em 16/11 foi conferida por 38 testes, compilação e análise de código. Os testes usam requisições simuladas e não comprovam os fluxos completos. A [identificação da versão examinada](arquivos/verificacao-interface-2026-11-16.json) registra a base e os hashes dos arquivos, com revisão e integração pendentes.

Para o DoD das histórias, DoD01/DoD03/DoD04 estão parciais, DoD02 e DoD05 permanecem sem comprovação e DoD06 precisa ser avaliado conforme a validação exigida para cada entrega. Não foi registrado aceite de Lucas ou aprovação de outro integrante.
