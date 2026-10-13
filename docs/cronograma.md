# 6. Cronograma e Entregas

O cronograma do **Space Jam** organiza a evolução do produto em ciclos curtos. A equipe adotou uma **abordagem híbrida**, com ciclo de vida **iterativo e incremental** e processo **RAD**. O planejamento considera o período de **07/09/2026 a 08/12/2026**.

Os ciclos representam períodos de trabalho, e não sprints do Scrum. Em cada período, a equipe pode trabalhar com requisitos, protótipos, construção e validação em intensidades diferentes. A ordem das funcionalidades futuras ainda poderá mudar depois da definição e priorização do MVP.

## 6.1 Ciclos realizados e em andamento

Os primeiros ciclos registram o trabalho que de fato ocorreu, em vez de apresentar funcionalidades ainda não implementadas.

| Ciclo | Período | Situação | Atividade RAD predominante | Trabalho realizado | Evidência ou resultado | Retorno do cliente e revisão |
|---|---|---|---|---|---|---|
| C1 | 07/09 a 13/09 | Concluído | Planejamento de Requisitos | Revisão da visão inicial do produto e análise dos pontos que precisavam de correção ou confirmação com o cliente | Artefatos da visão revisados no Pages, com histórico registrado em [Cenário Atual](cenario_atual.md), [Solução Proposta](solucao.md) e [Intervenção Social](intervencao_social.md) | Os pontos que precisavam de correção ou confirmação com o cliente levaram à conversa de diagnóstico com Lucas, realizada no C2 |
| C2 | 14/09 a 20/09 | Concluído | Planejamento de Requisitos | Alinhamento do processo RAD, preparação e realização da conversa de diagnóstico com Lucas (17/09, pelo Teams) e início do levantamento dos requisitos | Tópico de [Engenharia de Requisitos](engenharia_requisitos.md) reorganizado; ata de 17/09 registrada na página de [Reuniões](reunioes.md); lista inicial de RFs e RNFs | Lucas reconheceu o valor de centralizar as informações dos atletas, descreveu o fluxo que liga exercício, vídeo-base, vídeo de execução e feedback e recomendou começar pelo funcionamento básico. A equipe passou a priorizar o básico e a manter essa associação. Os pontos a esclarecer (campos de cadastro, permissões, formato das correções e cuidados com dados e vídeos) seguiram para o C3 |
| C3 | 21/09 a 27/09 | Concluído com pendências | Planejamento de Requisitos | Apresentação dos requisitos a Lucas, avaliação do valor de negócio em escala de 1 a 5 e esclarecimento dos fluxos de cadastro, treinos, vídeos e feedback (reunião de 26/09) | Ata de 26/09, com notas de valor de negócio revisadas e encaminhamentos | Lucas pediu que o atleta possa fazer o próprio cadastro, com autorização do treinador, e que o perfil inclua a frequência de atividade física. Esclareceu que os testes físicos são presenciais e apenas têm os resultados registrados no sistema, que o atleta pode registrar conclusão ou dificuldades sem enviar vídeo e que a duração do vídeo depende do exercício (30 segundos foi só um exemplo). As observações entram na revisão dos requisitos. Pendências: avaliação dos RNFs, fluxo de autorização do cadastro e recorte do MVP |

Os ciclos C4 e C5, previstos para 28/09 a 11/10, não chegaram a ser executados nessas datas e foram replanejados para as semanas seguintes (veja o registro do replanejamento no item 6.2). Nesse intervalo, a equipe revisou a priorização com Lucas na reunião de 08/10 (ata registrada na página de Reuniões) e planejou a demonstração inicial do protótipo, prevista para 11/10, com horário a combinar.

Retorno de Lucas na reunião de 08/10, que alimenta o C4:

- destacou o uso pelo celular durante os exercícios (Chrome e Safari);
- considerou a explicação do exercício e seus pontos de atenção mais importante do que um título para cada vídeo;
- apontou o envio de vídeos e a correção do treinador como diferencial do produto;
- discutiu cuidados com a imagem e os vídeos dos atletas;
- aceitou o esquema visual apresentado como possibilidade, citando vermelho escuro e preto como alternativa;
- priorização discutida: RF04812 com valor 5; RF02306 e RF04804 com valor 3; proposta de reduzir RF02305 para 3 e de retirar RF01211 do recorte inicial, ainda a confirmar.

Pendências desta reunião: consolidar a priorização, definir critérios de aceitação de status, feedback e vínculo entre contas, e esclarecer regras de acesso, visibilidade e consentimento.

## 6.2 Planejamento dos próximos ciclos

Os ciclos seguintes representam uma previsão inicial. A sequência poderá ser ajustada depois da revisão dos RFs, RNFs, dependências e prioridades do MVP.

Em cada ciclo, a equipe percorre as quatro etapas do RAD. O que muda de um ciclo para outro é a intensidade de cada etapa: o texto em **negrito** indica a atividade predominante do ciclo.

| Ciclo | Período | Objetivo | Planejamento de Requisitos | Design do Usuário | Construção | Cutover | Resultado esperado |
|---|---|---|---|---|---|---|---|
| C4 | 12/10 a 18/10 | Projetar o fluxo principal entre treinador e atleta e refiná-lo com o retorno do cliente | Registro do retorno da demonstração inicial, consolidação da priorização do MVP, esclarecimento das ambiguidades dos requisitos e revisão dos requisitos ligados ao fluxo treinador–atleta | **Protótipo navegável do acompanhamento do atleta, da organização do treino e da consulta das orientações, refinado com o retorno de Lucas (apresentação do feedback e esquema visual)** | Preparação técnica para o C5 (ambiente e modelo de dados) | Definição do ambiente de homologação que será usado a partir do C5 | Protótipo navegável do acompanhamento do atleta, organização do treino e consulta das orientações, ajustado conforme o retorno do cliente |
| C5 | 19/10 a 25/10 | Preparar a base técnica e o acesso ao sistema | Revisão dos requisitos de acesso e permissões | Ajuste do fluxo de acesso conforme o protótipo avaliado | **Ambiente integrado, modelo inicial de dados e primeiro fluxo de acesso, funcionando no celular (Chrome e Safari)** | Primeira disponibilização do acesso em homologação | Ambiente integrado, modelo inicial de dados e primeiro fluxo de acesso necessário ao MVP |
| C6 | 26/10 a 01/11 | Implementar o cadastro e o acompanhamento básico dos atletas | Detalhamento do fluxo de autorização do cadastro, das permissões de edição e dos campos do perfil, incluindo a frequência de atividade física | **Protótipo do cadastro pelo atleta com autorização do treinador, do perfil e do registro dos testes físicos** | **Cadastro e consulta dos dados esportivos, vínculo entre atleta e treinador (por aceite ou código, a definir) e registro dos resultados dos testes físicos feitos presencialmente** | Liberação em homologação para validação do fluxo com o treinador | Cadastro e consulta dos dados esportivos, perfil com frequência de atividade física e registro dos testes físicos, com consulta dos resultados pelo treinador, conforme o recorte do MVP |
| C7 | 02/11 a 08/11 | Organizar exercícios e planos de treino | Definição dos dados do exercício (explicação e pontos de atenção) e dos planos de treino | **Protótipo do cadastro de exercícios e da montagem de treinos** | **Fluxo para cadastrar exercícios com explicação e pontos de atenção, montar treinos e associá-los aos atletas** | Liberação em homologação para demonstração da rotina de montagem de treino | Fluxo para cadastrar exercícios, montar treinos e associá-los aos atletas |
| C8 | 09/11 a 15/11 | Disponibilizar o treino para o atleta | Definição do registro de execução (conclusão, dificuldades e relato do atleta, distinto do feedback do treinador) e dos estados do treino | **Protótipo da interface do atleta para uso pelo celular durante o exercício** | **Interface para consultar as orientações do exercício, registrar a conclusão ou as dificuldades e acompanhar o status do treino** | Liberação em homologação para teste de usabilidade treinador–atleta, com a opinião dos atletas colhida por Lucas | Interface para consultar as orientações e registrar a execução do treino, com status e relato do atleta, conforme o recorte do MVP |
| C9 | 16/11 a 22/11 | Construir o fluxo de vídeo e feedback técnico, com privacidade das mídias | Definição da duração dos vídeos por exercício, do formato e das regras de acesso, visibilidade e consentimento para imagem e vídeos | **Protótipo do envio do vídeo de execução e do retorno do treinador (correções ou repetições), com as telas de consentimento** | **Vídeo-base e vídeo de execução (envio opcional) associados ao exercício, feedback do treinador e controles de acesso e visibilidade dos vídeos** | Liberação em homologação para validação do fluxo completo com o cliente | Vídeos associados ao exercício, feedback do treinador, controles de acesso e visibilidade, termos de consentimento e revisão dos RNFs de segurança e LGPD relacionados às mídias |
| C10 | 23/11 a 29/11 | Integrar e homologar o MVP | Fechamento dos critérios de aceitação, revisão final dos RNFs (incluindo segurança e LGPD) e das correções prioritárias | Ajustes de usabilidade a partir dos testes, inclusive no celular | **Integração dos fluxos do MVP, consolidação da privacidade e correções prioritárias** | **Preparação do ambiente e homologação assistida com o treinador** | Fluxos do MVP integrados, privacidade e permissões consolidadas, correções prioritárias, ambiente de homologação e resultados dos testes |
| C11 | 30/11 a 08/12 | Disponibilizar a versão acordada e acompanhar o uso inicial | Registro das limitações conhecidas e das evoluções futuras (como ranking, destaques e recompensas, citados por Lucas) | Ajustes finais de tela, se necessário | Correções críticas encontradas na homologação | **Implantação, documentação mínima de uso e monitoramento** | Implantação, documentação mínima de uso, monitoramento e registro das limitações conhecidas |

### Registro do replanejamento (reuniões de 17/09, 26/09 e 08/10)

Os ciclos C4 e C5 não foram executados nas datas previstas (28/09 a 11/10): o período foi ocupado pela revisão da priorização e pelo planejamento da demonstração ao cliente. A equipe manteve o conteúdo dos ciclos e deslocou o calendário, preservando a data final do projeto (08/12/2026). Para isso, o cronograma passou de 12 para 11 ciclos: a privacidade deixou de ter ciclo próprio e foi incorporada ao fluxo de vídeo e à homologação.

| Item | Ciclo e período anteriores | Novo ciclo e período | Motivo |
|---|---|---|---|
| Protótipo navegável do fluxo principal | C4 (28/09 a 04/10) | C4 (12/10 a 18/10) | Ciclo não executado na data prevista; o período foi dedicado à priorização e ao planejamento da demonstração ao cliente |
| Base técnica e acesso | C5 (05/10 a 11/10) | C5 (19/10 a 25/10) | Ciclo não executado na data prevista, pelo mesmo motivo |
| Cadastro e acompanhamento básico dos atletas | C6 (12/10 a 18/10) | C6 (26/10 a 01/11) | Deslocamento de duas semanas; inclui os pedidos de 26/09 (cadastro com autorização do treinador e frequência de atividade física) |
| Exercícios e planos de treino | C7 (19/10 a 25/10) | C7 (02/11 a 08/11) | Deslocamento de duas semanas |
| Treino disponibilizado ao atleta | C8 (26/10 a 01/11) | C8 (09/11 a 15/11) | Deslocamento de duas semanas; inclui o relato e o registro de dificuldades sem vídeo |
| Vídeo e feedback técnico | C9 (02/11 a 08/11) | C9 (16/11 a 22/11) | Deslocamento de duas semanas; passa a incluir a privacidade das mídias |
| Privacidade, consentimento e proteção dos dados | C10 (09/11 a 15/11) | C9 (mídias) e C10 (consolidação) | O calendário restante comporta oito ciclos para nove itens. As regras de acesso aos vídeos devem ser definidas junto com o fluxo de vídeo (Lucas indicou cuidado com a imagem dos atletas), e a revisão geral fica junto da homologação |
| Integração e homologação do MVP | C11 (16/11 a 22/11) | C10 (23/11 a 29/11) | Deslocamento de uma semana |
| Implantação e acompanhamento inicial | C12 (23/11 a 08/12) | C11 (30/11 a 08/12) | Último ciclo, mantendo a data final do projeto |

### Verificação, validação e retorno do cliente por ciclo

Cada ciclo termina com uma avaliação. O retorno do cliente pode gerar uma revisão que volta ao Planejamento de Requisitos ou ao Design do Usuário do ciclo seguinte.

| Ciclo | Verificação e validação | Retorno esperado do cliente | Revisão que o retorno pode gerar |
|---|---|---|---|
| C4 | Avaliação do protótipo com Lucas antes da implementação e registro dos ajustes solicitados | Ajustes solicitados por Lucas no protótipo | Protótipo revisado antes de seguir para a construção |
| C5 | Testes de acesso e permissões, inclusive pelo celular em Chrome e Safari; demonstração do fluxo conforme os critérios de aceitação | Avaliação da demonstração do fluxo de acesso | Correção no próprio ciclo ou replanejamento no C6 |
| C6 | Verificação dos campos, regras e permissões; validação do fluxo com o treinador | Avaliação do treinador sobre o cadastro, a autorização, os campos e as permissões | Ajuste dos campos e das regras; itens não concluídos voltam ao Planejamento do C7 |
| C7 | Testes dos critérios de aceitação e demonstração de uma rotina de montagem de treino | Avaliação da rotina de montagem de treino | Ajuste do fluxo de montagem; pendências seguem para o C8 |
| C8 | Teste de usabilidade do fluxo treinador–atleta e registro dos ajustes necessários | Resultado do teste de usabilidade e opinião dos atletas, colhida por Lucas | Ajustes registrados e priorizados para o ciclo seguinte |
| C9 | Verificação de formato, acesso e associação do vídeo; testes de permissões e privacidade; validação do fluxo completo com o cliente; revisão das regras com o cliente e demais stakeholders envolvidos | Validação do fluxo de vídeo e feedback e revisão das regras de privacidade | Ajuste de formato, acesso, associação e regras de visibilidade e consentimento; pendências críticas seguem para o C10 |
| C10 | Testes ponta a ponta, usabilidade, permissões e RNFs; homologação assistida com o treinador | Resultado da homologação assistida | Correções antes da implantação; itens não críticos viram evoluções futuras |
| C11 | Validação do funcionamento com o cliente, coleta de feedback e registro das evoluções futuras | Feedback sobre o uso inicial | Registro das evoluções futuras e das limitações conhecidas |

!!! note "Planejamento em evolução"
    A partir do C4, os objetivos e resultados representam uma previsão inicial. Eles deverão ser atualizados quando a equipe concluir a priorização dos requisitos e do MVP, sem apagar o histórico das decisões anteriores.

## 6.3 Como os ciclos serão conduzidos

Antes de implementar uma funcionalidade, a equipe deverá compreender a necessidade, revisar os requisitos relacionados e, quando necessário, preparar um protótipo. Depois da avaliação do fluxo, o incremento poderá ser construído, testado e apresentado.

As etapas do RAD não precisam ter a mesma duração em todos os ciclos. Nos ciclos iniciais, o trabalho está mais concentrado no Planejamento de Requisitos e no Design do Usuário. A Construção ganha espaço conforme os requisitos ficam prontos, enquanto o Cutover concentra a homologação, a implantação e o acompanhamento inicial da versão entregue.

O quadro abaixo mostra o caminho de um ciclo e onde entra o retorno do cliente:

| Passo | O que acontece | Etapa do RAD | Resultado |
|---|---|---|---|
| 1 | Compreensão da necessidade e revisão dos requisitos relacionados | Planejamento de Requisitos | Requisitos e critérios de aceitação revisados |
| 2 | Preparação do protótipo, quando necessário | Design do Usuário | Protótipo ou fluxo de telas |
| 3 | Validação do protótipo com Lucas | Design do Usuário | Ajustes solicitados registrados |
| 4 | Construção do incremento e verificação interna com base nos critérios de aceitação | Construção | Incremento testado |
| 5 | Disponibilização do incremento em homologação e apresentação ao cliente | Cutover | Incremento apresentado |
| 6 | Validação do incremento e coleta do retorno do cliente | Cutover | Retorno registrado |
| 7 | Decisão sobre o retorno: manter, corrigir ou replanejar | Planejamento de Requisitos do ciclo seguinte | Backlog e cronograma atualizados |

Quando o retorno do cliente altera um fluxo, a equipe volta ao protótipo (passos 2 e 3) antes de reconstruir a funcionalidade.

## 6.4 Verificação, validação e evidências

A equipe utilizará dois momentos diferentes de avaliação:

- **Validação do protótipo:** confirma com Lucas se a ideia e o fluxo representam a necessidade antes da implementação.
- **Validação do incremento:** apresenta uma parte funcional do produto para confirmar se ela atende à rotina esperada.

Antes da validação com o cliente, a equipe fará a verificação interna com base nos requisitos e critérios de aceitação. Caso Lucas não possa participar de uma reunião, a equipe combinará outra forma de receber e registrar o retorno.

Os encontros com Lucas são combinados com cerca de uma semana de antecedência, de preferência às quintas-feiras por volta das 20h ou em fins de semana, com aviso em caso de indisponibilidade. Lucas também se dispôs a colher a opinião dos atletas por meio de um grupo, o que pode apoiar a validação das interfaces voltadas ao atleta.

Dependendo do ciclo, poderão ser utilizadas como evidências:

- requisitos ou critérios de aceitação revisados;
- protótipos e fluxos de telas;
- testes executados;
- issues, commits ou pull requests relacionados ao incremento;
- registros das demonstrações e do retorno do cliente;
- decisões de manter, corrigir ou replanejar uma funcionalidade.

## 6.5 Cuidados contínuos

Algumas atividades acompanharão todo o desenvolvimento:

- manter a ligação entre características do produto, RFs, RNFs e funcionalidades;
- manter a associação entre exercício, vídeo-base, vídeo de execução e feedback;
- testar cada incremento antes de integrá-lo ao produto;
- considerar o uso pelo celular (Chrome e Safari) nos fluxos usados durante os exercícios;
- considerar permissões e proteção dos dados desde o cadastro dos atletas;
- definir o acesso aos vídeos e às informações de acompanhamento antes da implementação desses fluxos;
- atualizar o MVP e o cronograma quando houver mudança de prioridade, indisponibilidade do cliente ou dificuldade técnica.

Quando um item precisar mudar de ciclo, a equipe registrará o motivo, a decisão tomada e o novo período previsto.

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor(es) |
    | :---: | :---: | --- | --- |
    | 12/10/2026 | 0.4 | Atualização das fases RAD por ciclo, retorno do cliente e replanejamento do cronograma | Paulo Sérgio Rabelo Santana Rios |
    | 19/09/2026 | 0.3 | Complementação do cronograma com o trabalho realizado nos ciclos iniciais, forma de validação, evidências e regra de atualização | Luiz Henrique Pessato da Mota |
    | 18/09/2026 | 0.2 | Ajuste dos ciclos e alinhamento do cronograma ao processo RAD | Paulo Sérgio Rabelo Santana Rios |
    | 08/09/2026 | 0.1 | Estruturação inicial do cronograma | Anderson Fernandes da Silva |
