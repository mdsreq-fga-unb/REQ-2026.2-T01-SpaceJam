# Análise de upload e desempenho

Síntese organizada em **16/11/2026** a partir da análise documental realizada em **08/11/2026**, item **DOC-ANALISE-01**, para identificar diferenças entre critérios de aceitação e tratamento dos RNFs no MVP. As conclusões abaixo pertencem à versão histórica examinada, anterior à reformulação dos requisitos. Não registram testes do produto ou decisão de alterar o escopo.

[Consultar a aplicação do DoR e DoD](aplicacao_dor_dod.md)

## Fontes da análise

Os links usam o commit `89afb0ef6ebb58d1a7a12bba042ddc671d5bf302`. RFs, RNFs e critérios correspondem às fontes preservadas daquela análise, normalizando as quebras de linha. O Backlog possuía ajustes locais em outros trechos; a definição de evolutivo usada aqui tem a mesma redação no trecho público indicado.

| Fonte | Registro examinado |
| --- | --- |
| [RNF07](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/requisitos_nao_funcionais.md#L65-L71) e [CA02 de US26](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/criterios_aceitacao.md#L191) | Progresso percentual e seu aceite. |
| [Tratamento dos RNFs no Backlog](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/backlog.md#L151-L162) | Grupo evolutivo: atendimento básico no MVP, meta completa e verificação nas versões seguintes. |
| [RF03501](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/requisitos.md#L818-L847) | Envio de vídeo incluído no MVP e ligado a US26. |
| [RNF11](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/requisitos_nao_funcionais.md#L99-L105) e [CA01 de US17/US18/US19](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/criterios_aceitacao.md#L165) | Meta de cinco segundos e condições de medição. |
| [RF02304 a RF02306](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/requisitos.md#L532-L621) | Histórico e status no MVP; comparação fora do recorte. |

## Progresso do envio

RNF07 exige progresso de 1% a 99% durante o envio e término em 100%, mas está classificado como evolutivo. O aceite de US26 já exige barra percentual. Essa combinação deixa indefinido se a meta completa impede concluir o envio no MVP ou foi adiada.

A decisão necessária é conciliar o compromisso do incremento, seu aceite e o tratamento do RNF. Manter a exigência implica planejar sua verificação; adiá-la exige definir o comportamento mínimo e registrar a decisão pertinente. A análise não escolheu uma alternativa nem retirou condições de aceite.

A [substituição de vídeo](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/requisitos.md#L848-L877) também vincula RNF07. Seu [aceite](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/criterios_aceitacao.md#L195-L199) trata de bloqueio após feedback; a reutilização das condições de progresso precisa ser esclarecida. O CA02 de US26 menciona nuvem criptografada e [RNF13](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/requisitos_nao_funcionais.md#L115-L121), também evolutivo. Não foi proposta redução da proteção dos vídeos.

## Tempo de carregamento

RNF11 exige carregamento completo em até cinco segundos, sob Fast 4G simulado e até 50 requisições simultâneas, com tratamento evolutivo. O aceite de US17/US18/US19 já exige cinco segundos e não repete as condições de rede e carga.

É necessário conciliar o compromisso da primeira versão e o método de medição. Também cabe rever a abrangência: RNF11 declara CP1/CP2, mas aparece ligado a registros de CP3 e CP8, como [RF04802](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/blob/89afb0ef6ebb58d1a7a12bba042ddc671d5bf302/docs/requisitos.md#L1082-L1111).

## Resultado e limites

O levantamento identificou duas fichas ligadas a RNF07 e dezesseis a RNF11. São vínculos a conferir, não dezoito conflitos comprovados. As divergências explícitas foram localizadas em US26 e US17/US18/US19.

O levantamento foi executado. Revisão por outro integrante e decisões sobre os compromissos do produto permanecem pendentes. Não houve teste de upload, carga ou validação do cliente. Os códigos antigos foram preservados; a [conferência de 16/11](aplicacao_dor_dod.md#conferencia-atual) identifica separadamente as versões posteriores.
