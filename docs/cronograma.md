# 6. Cronograma e Entregas

O cronograma do **Space Jam** organiza a evolução do produto em ciclos curtos. A equipe adotou uma **abordagem híbrida**, com ciclo de vida **iterativo e incremental** e processo **RAD**. O planejamento considera o período de **07/09/2026 a 08/12/2026**.

Os ciclos representam períodos de trabalho, e não sprints do Scrum. Em cada período, a equipe pode trabalhar com requisitos, protótipos, construção e validação em intensidades diferentes.

!!! note "Fonte única do escopo"
    O escopo do MVP é o definido na página do MVP (matriz MoSCoW, com a linha de corte). A distribuição dos RFs por iteração é a do **backlog por iterações**, e este cronograma a reproduz sem alterá-la. As iterações do backlog correspondem aos ciclos C8 a C12 (It1 = C8, It2 = C9, It3 = C10, It4 = C11, It5 = C12), com as mesmas datas, e o projeto termina em **08/12/2026**. Quando o escopo mudar, a alteração é feita primeiro na página do MVP, depois no backlog e por fim aqui, sem apagar o histórico das decisões anteriores.

## 6.1 Ciclos realizados e em andamento

Os ciclos abaixo registram o trabalho que de fato ocorreu, em vez de apresentar funcionalidades ainda não implementadas. Quando não há ata ou registro anexado, o retorno do cliente aparece como **a confirmar**.

| Ciclo | Período | Situação | Atividade RAD predominante | Trabalho realizado | Evidência ou resultado | Retorno do cliente e revisão |
|---|---|---|---|---|---|---|
| C1 | 07/09 a 13/09 | Concluído | Planejamento de Requisitos | Revisão da visão inicial do produto e análise dos pontos que precisavam de correção ou confirmação com o cliente | Artefatos da visão revisados no Pages, com histórico registrado em [Cenário Atual](cenario_atual.md), [Solução Proposta](solucao.md) e [Intervenção Social](intervencao_social.md) | Os pontos que precisavam de correção ou confirmação com o cliente levaram à conversa de diagnóstico com Lucas, realizada no C2 |
| C2 | 14/09 a 20/09 | Concluído | Planejamento de Requisitos | Alinhamento do processo RAD, preparação e realização da conversa de diagnóstico com Lucas (17/09, pelo Teams) e início do levantamento dos requisitos | Tópico de [Engenharia de Requisitos](engenharia_requisitos.md) reorganizado; ata de 17/09 registrada na página de [Reuniões](reunioes.md); lista inicial de RFs e RNFs | Lucas reconheceu o valor de centralizar as informações dos atletas, descreveu o fluxo que liga exercício, vídeo-base, vídeo de execução e feedback e recomendou começar pelo funcionamento básico. A equipe passou a priorizar o básico e a manter essa associação. Os pontos a esclarecer (campos de cadastro, permissões, formato das correções e cuidados com dados e vídeos) seguiram para o C3 |
| C3 | 21/09 a 27/09 | Concluído com pendências | Planejamento de Requisitos | Apresentação dos requisitos a Lucas, avaliação do valor de negócio em escala de 1 a 5 e esclarecimento dos fluxos de cadastro, treinos, vídeos e feedback (reunião de 26/09) | Ata de 26/09, com notas de valor de negócio revisadas e encaminhamentos | Lucas pediu que o atleta possa fazer o próprio cadastro, com autorização do treinador, e que o perfil inclua a frequência de atividade física. Esclareceu que os testes físicos são presenciais e apenas têm os resultados registrados no sistema, que o atleta pode registrar conclusão ou dificuldades sem enviar vídeo e que a duração do vídeo depende do exercício (30 segundos foi só um exemplo). As observações entram na revisão dos requisitos. Pendências: avaliação dos RNFs, fluxo de autorização do cadastro e recorte do MVP |
| C4 | 12/10 a 18/10 | Concluído (retorno do cliente a confirmar) | Design do Usuário | Protótipo de baixa fidelidade do fluxo principal e apresentação ao Lucas, na semana de 11/10 | Protótipo de baixa fidelidade [Protótipo de baixa fidelidade](https://www.figma.com/design/HJ5ukxYtbpQDmzD2OO7Jw3/Space-Jam?node-id=31-864) | A equipe relata que Lucas aprovou o protótipo, mas a ata da demonstração de 11/10 ainda não foi registrada. O resultado só será considerado fechado quando a ata ou outro registro for anexado |
| C5 | 19/10 a 25/10 | Não executado conforme o planejado | Planejamento de Requisitos | A base técnica prevista (ambiente, modelo de dados e acesso) não foi iniciada. O período foi usado para ajustar a documentação a partir dos feedbacks recebidos | Ajustes na documentação | Sem validação com o cliente neste ciclo. A base técnica foi replanejada para o C8 |
| C6 | 26/10 a 01/11 | Concluído (retorno do cliente a confirmar) | Design do Usuário | Protótipo de alta fidelidade e apresentação ao Lucas em 29/10; correção das issues abertas no repositório | Protótipo de alta fidelidade e issues corrigidas [Protótipo de alta fidelidade](https://www.figma.com/design/HJ5ukxYtbpQDmzD2OO7Jw3/Space-Jam?node-id=168-1123) | A equipe relata que Lucas aprovou o protótipo como imaginava, mas não há ata de 29/10 registrada. Os testes físicos saíram do MVP (matriz MoSCoW), e o cadastro previsto para este ciclo foi replanejado para o C8 |
| C7 | 02/11 a 08/11 | Concluído | Planejamento de Requisitos | Melhoria da documentação e da rastreabilidade: hiperlinks, tabelas de requisitos mais enxutas, consulta de entregas e condições dos requisitos, evidências rastreáveis, evolução com justificativa, reorganização do menu do Pages e correção das issues abertas no repositório | Páginas de requisitos, RNFs e backlog atualizadas [Requisitos](requisitos.md) [RNFs](requisitos_nao_funcionais.md) [RNFs](backlog.md) | Sem validação com o cliente neste ciclo. A revisão veio do acompanhamento da disciplina e foi tratada por issues |
| C8 | 09/11 a 15/11 | Em andamento | Construção | Ambiente de desenvolvimento do back-end e do front-end (Docker, Django, ReactJS e Postgres), escrita das user stories e organização dos RFs em iterações | Ambiente configurado e quadro de iterações | A registrar ao fim do ciclo |

Retorno de Lucas na reunião de 08/10 (ata registrada na página de Reuniões):

- destacou o uso pelo celular durante os exercícios (Chrome e Safari);
- considerou a explicação do exercício e seus pontos de atenção mais importante do que um título para cada vídeo;
- apontou o envio de vídeos e a correção do treinador como diferencial do produto;
- discutiu cuidados com a imagem e os vídeos dos atletas;
- aceitou o esquema visual apresentado como possibilidade, citando vermelho escuro e preto como alternativa;
- discutiu a priorização, registrada na [ata de 08/10](atas/2026-10-08-lucas.md#priorizacao-discutida): consulta de resultados de testes físicos pelo treinador (RF4811) com valor 5; status do treino (RF2306) e próprios testes (RF4803) com valor 3; propostas de reduzir a comparação de treinos (RF2305) para 3 e retirar a edição de dificuldade (RF1214) do recorte inicial.

A priorização foi depois consolidada na matriz MoSCoW da página do MVP, que prevalece sobre os valores dessa ata. Por exemplo, os testes físicos ficaram fora do MVP e a edição de dificuldade ficou dentro.

## 6.2 Planejamento dos ciclos C8 a C12 {#62-planejamento-dos-proximos-ciclos}

!!! note "Leitura do planejamento"
    Os RFs previstos nos ciclos abaixo são os do MVP definido na página do MVP e distribuídos no backlog por iterações. Os testes físicos (RF1216, RF1217, RF4803 e RF4811) estão fora do MVP. O vínculo entre atleta e treinador é feito por **código de convite** (US01a). Os períodos encerrados só contam como ciclos concluídos quando houver evidência registrada em 6.1.

Em cada ciclo, a equipe percorre as quatro etapas do RAD. O que muda de um ciclo para outro é a intensidade de cada etapa: o texto em **negrito** indica a atividade predominante do ciclo.

| Ciclo | Período | Objetivo | Planejamento de Requisitos | Design do Usuário | Construção | Cutover | Resultado esperado |
|---|---|---|---|---|---|---|---|
| C8 | 09/11 a 15/11 | Preparar a base técnica, o acesso e a biblioteca de exercícios | Escrita das user stories e organização dos RFs do MVP em iterações | Reaproveitamento do protótipo de alta fidelidade (aprovação de 29/10 a confirmar) | **Ambiente integrado, cadastro e login, e biblioteca de exercícios (cadastro, edição e consulta)** | Definição do ambiente de homologação usado a partir do C9 | Ambiente funcionando, acesso ao sistema e biblioteca de exercícios, funcionando no celular (Chrome e Safari) |
| C9 | 16/11 a 22/11 | Construir perfil, acompanhamento dos alunos e início do planejamento de treinos | **Fechamento das decisões de privacidade, consentimento e acesso aos vídeos e dos critérios de aceitação dos RFs do ciclo** | Telas de termos de uso, política de privacidade e aviso de cookies, conforme o protótipo | **Perfil do aluno, consulta de alunos acompanhados, planejamento e criação de treino com exercícios** | Liberação em homologação para o Lucas validar o fluxo de acompanhamento e de criação de treino | Perfil, acompanhamento e criação de treinos funcionando, com aceite dos termos e decisões de privacidade registradas |
| C10 | 23/11 a 29/11 | Disponibilizar o treino ao atleta e construir o fluxo de vídeo e feedback | Revisão dos critérios de aceitação do fluxo de vídeo e feedback com as decisões fechadas no C9 | Ajustes de usabilidade no celular das telas de treino e de envio de vídeo | **Execução do treino pelo atleta, envio e consulta de vídeos, registro e edição de feedback do treinador** | Liberação em homologação para validação do fluxo completo (vídeo e feedback) com o Lucas | Fluxo exercício, vídeo e feedback privado funcionando, com status e conclusão do treino |
| C11 | 30/11 a 06/12 | Concluir os complementos do MVP e tratar as correções | Detalhamento dos itens restantes e priorização das correções registradas nos ciclos anteriores | Ajustes finais de tela | **Dificuldade do treino, históricos, feedback recebido pelo atleta, notificação, substituição de vídeo, recuperação de senha, exclusão de dados e correções** | Liberação do MVP completo em homologação, para teste de usabilidade treinador e atleta, com a opinião dos atletas colhida por Lucas | MVP completo em homologação, com correções dos ciclos anteriores |
| C12 | 07/12 a 08/12 | Homologar e implantar a versão acordada | Registro das limitações conhecidas e das evoluções futuras (como ranking, destaques e recompensas, citados por Lucas) | Ajustes finais de tela, se necessário | Correções críticas encontradas na homologação | **Homologação assistida com o treinador, implantação, documentação mínima de uso e monitoramento inicial** | Versão implantada, documentação mínima de uso e registro das limitações conhecidas |

### 6.2.1 RFs por ciclo (reprodução do backlog por iterações)

| Ciclo (iteração) | Período | RFs previstos |
|---|---|---|
| C8 (It1), em andamento | 09/11 a 15/11 | Setup (Docker, Django, ReactJS e Postgres), RF1101, RF1102, RF1103, RF1104, RF1105, RF2413, RF2418, RF2421, RF2422 |
| C9 (It2) | 16/11 a 22/11 | RF1107 (editar perfil do aluno), RF1108 (trocar senha), RF4701 (consultar alunos acompanhados), RF4810 (consultar perfil de aluno acompanhado), RF2301 (cadastrar planejamento de treino), RF2307 (criar treino com exercícios), RF2310 (consultar planejamento de aluno acompanhado), RF4802 (consultar próprios dados cadastrais), RF4812 (aceitar termos de uso e política de privacidade), RF1111 (registrar histórico de lesões), RF2419 (documentar erros e orientações), RF2420 (editar erros e orientações) |
| C10 (It3) | 23/11 a 29/11 | RF4809 (consultar próprio planejamento de treinos), RF4808 (consultar próprios objetivos do aluno), RF2308 (editar treino), RF2302 (editar planejamento de treino), RF2312 (registrar status do treino), RF2306 (consultar status de treino), RF1215 (registrar conclusão de treino), RF3501 (enviar vídeo de execução), RF4804 (consultar próprios vídeos enviados), RF4805 (consultar vídeos de alunos), RF3604 (registrar feedback), RF3605 (editar feedback) |
| C11 (It4) | 30/11 a 06/12 | RF1110 (recuperar senha), RF4813 (solicitar exclusão dos próprios dados), RF2416 (associar erros e orientações), RF2424 (pesquisar exercício por nome), RF2304 (consultar histórico de planejamentos), RF2311 (consultar histórico de treinos de aluno acompanhado), RF4807 (consultar próprio histórico de treinos), RF1212 (consultar dificuldade), RF1213 (registrar dificuldade), RF1214 (editar dificuldade), RF3502 (substituir vídeo enviado), RF4806 (consultar feedback recebido), RF3607 (notificar aluno sobre feedback) |
| C12 (It5) | 07/12 a 08/12 | Sem RFs novos: homologação assistida com o Lucas, correções críticas encontradas e deploy |

### 6.2.2 RNFs, executores e revisores por ciclo

Os RNFs de cada ciclo seguem a rastreabilidade das páginas de requisitos e de RNFs. Executores e revisores são os responsáveis pela entrega do ciclo (um executor pode ser mais de uma pessoa; o revisor não deve ser o executor do mesmo item).

| Ciclo | RNFs de referência | Executores | Revisores |
|---|---|---|---|
| C8 | RNF01 (responsividade), RNF02 (stack), RNF03 (navegadores), RNF04 (acessibilidade), RNF09 (RBAC no login e nas permissões), RNF12 (biblioteca de exercícios), RNF15 (máscaras e validação nos formulários), RNF18 (persistência) | Julia Amanda, Guilherme Mendes, Paulo Sérgio, Anderson Fernandes | Luiz Henrique, Thiago Oliveira |
| C9 | RNF05 (LGPD), RNF17 (cookies), RNF10 (isolamento de dados entre atletas), RNF09 (endpoints do treinador), RNF15 (campos do perfil e do treino); RNF11 já verificado no carregamento do perfil | Luiz Henrique, Guilherme Mendes, Paulo Sérgio, Thiago Oliveira | Julia Amanda, Anderson Fernandes |
| C10 | RNF06 (formato .mp4 e .mov), RNF07 (progresso do upload), RNF14 (duração e tamanho), RNF16 (um arquivo por envio), RNF13 (armazenamento protegido), RNF10 e RNF09 (acesso a vídeos e feedback); RNF08 (feedback anotado na linha do tempo) depende de decisão de escopo | Julia Amanda, Luiz Henrique, Anderson Fernandes, Thiago Oliveira | Guilherme Mendes, Paulo Sérgio |
| C11 | RNF11 (desempenho dos históricos), RNF05 (LGPD na exclusão de dados), RNF13 (substituição de vídeo), RNF18 (persistência após correções) | Julia Amanda, Paulo Sérgio, Anderson Fernandes, Thiago Oliveira | Luiz Henrique, Guilherme Mendes |
| C12 | RNF01 a RNF18 na homologação, com atenção a RNF03, RNF04 e RNF11 | Julia Amanda, Luiz Henrique, Guilherme Mendes, Thiago Oliveira | Anderson Fernandes, Paulo Sérgio |

A distribuição é rotativa: em cada ciclo, os seis integrantes atuam, quatro como executores e dois como revisores, e ninguém revisa o próprio ciclo. Ao longo de C8 a C12, todos revisam ao menos uma vez.

### 6.2.3 Capacidade e risco por ciclo

O número de RFs por ciclo mostra onde a carga se concentra. A premissa de capacidade é de 6 pessoas, em média 2 horas por dia cada, em todos os dias do período (inclusive fins de semana), o que dá 84 horas por ciclo de uma semana. Essas horas cobrem tudo o que o ciclo exige (requisitos, protótipo, construção, testes, reuniões e documentação), e não só a codificação.

| Ciclo | RFs previstos | Capacidade disponível (pessoas e horas) | Risco e como será absorvido |
|---|---|---|---|
| C8 | 9 mais o setup | 84 h (6 pessoas × 2 h × 7 dias), cerca de 9 h por RF | Setup técnico ainda em curso; o que não fechar hoje vira o primeiro item do C9 |
| C9 | 12 | 84 h, cerca de 7 h por RF | Decisões de privacidade precisam fechar antes do fluxo de vídeo; atrasos empurram o C10 |
| C10 | 12 | 84 h, cerca de 7 h por RF | Ciclo com o fluxo de vídeo e feedback, o diferencial do produto; itens não críticos (por exemplo RF4808 e RF3605) podem passar ao C11 |
| C11 | 13 | 84 h, cerca de 6,5 h por RF | Maior carga do cronograma, com apenas dois dias de folga no C12; correções críticas têm prioridade sobre RF2424, RF2304 e RF2311 |
| C12 | 0 | 24 h (6 pessoas × 2 h × 2 dias) | Apenas dois dias; itens não críticos viram evoluções futuras |

Total: 46 RFs distribuídos de C8 a C11, com 336 h de capacidade nesses quatro ciclos (cerca de 7 h por RF) e mais 24 h no C12 para a homologação. Se a capacidade somada dos ciclos for menor que a carga prevista, a regra é replanejar pela linha de corte da matriz MoSCoW, e não estender a data final.

### 6.2.4 Registro do replanejamento

A previsão registrada em 12/10 foi atualizada com o que de fato ocorreu e com a redistribuição dos RFs. A data final do projeto (08/12/2026) foi mantida, e o cronograma passou a ter 12 ciclos (C12 é a homologação e implantação).

| Previsão de 12/10 | O que aconteceu ou novo plano | Motivo |
|---|---|---|
| C4 (12/10 a 18/10): protótipo navegável do fluxo principal | Concluído com protótipo de baixa fidelidade; aprovação do Lucas a confirmar | Ciclo executado |
| C5 (19/10 a 25/10): base técnica e acesso | Não executado; período usado para ajustar a documentação. A base técnica passou para o C8 | A equipe priorizou a documentação a partir dos feedbacks recebidos |
| C6 (26/10 a 01/11): cadastro, perfil e testes físicos | Protótipo de alta fidelidade apresentado em 29/10; cadastro passou para o C8; testes físicos saíram do MVP | Matriz MoSCoW da página do MVP |
| C7 (02/11 a 08/11): exercícios e planos de treino | Ciclo de documentação e rastreabilidade; exercícios passaram para os C8 e C9; planos de treino para o C9 | Correção das issues e melhoria da rastreabilidade |
| C8 (09/11 a 15/11): treino disponibilizado ao atleta | Ambiente, acesso e biblioteca de exercícios; o treino do atleta passou para o C10 | A base técnica ainda não existia |
| C9 (16/11 a 22/11): vídeo e feedback técnico | Perfil, acompanhamento, planejamento e decisões de privacidade; vídeo e feedback passaram para o C10 | As decisões de privacidade e consentimento precisam preceder o fluxo de vídeo |
| C10 (23/11 a 29/11): integração e homologação | Vídeo e feedback, execução do treino | Redistribuição dos RFs |
| C11 (30/11 a 08/12): implantação | Complementos do MVP e correções (30/11 a 06/12) | Redistribuição dos RFs |
| (não previsto) | C12 (07/12 a 08/12): homologação assistida e implantação | Manter a data final do projeto |

### 6.2.5 Verificação, validação e retorno do cliente por ciclo

Cada ciclo termina com uma avaliação. O retorno do cliente pode gerar uma revisão que volta ao Planejamento de Requisitos ou ao Design do Usuário do ciclo seguinte.

| Ciclo | Verificação e validação | Retorno esperado do cliente | Revisão que o retorno pode gerar |
|---|---|---|---|
| C8 | Testes de cadastro, login e permissões, inclusive pelo celular em Chrome e Safari; verificação do ambiente e dos RNF01, RNF02, RNF03, RNF04, RNF09, RNF12, RNF15 e RNF18 | Avaliação do fluxo de acesso e da biblioteca de exercícios | Correção no próprio ciclo ou replanejamento no C9 |
| C9 | Verificação dos campos, regras e permissões (RNF05, RNF10, RNF15 e RNF17); revisão das decisões de privacidade e consentimento com o cliente e demais stakeholders; validação do fluxo de criação de treino com o treinador | Avaliação do treinador sobre perfil, acompanhamento e treinos, e validação das regras de privacidade | Ajuste dos campos, regras e telas de termos; itens não concluídos voltam ao Planejamento do C10 |
| C10 | Verificação de formato, duração, tamanho, acesso e associação do vídeo (RNF06, RNF07, RNF13, RNF14 e RNF16); testes de permissões e privacidade (RNF09 e RNF10); validação do fluxo completo de vídeo e feedback com o cliente | Validação do fluxo de vídeo e feedback e da execução do treino pelo atleta | Ajuste de formato, acesso, associação e regras de visibilidade; pendências críticas seguem para o C11 |
| C11 | Testes dos critérios de aceitação, usabilidade treinador e atleta, permissões e RNFs (em especial RNF11, RNF05 e RNF18); MVP completo em homologação | Resultado do teste de usabilidade e opinião dos atletas, colhida por Lucas | Ajustes registrados e priorizados para a homologação final |
| C12 | Testes ponta a ponta, usabilidade, permissões e todos os RNFs (RNF01 a RNF18); homologação assistida com o treinador | Resultado da homologação assistida e feedback sobre o uso inicial | Correções críticas antes da implantação; itens não críticos viram evoluções futuras |

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
- registros das demonstrações e do retorno do cliente (atas);
- decisões de manter, corrigir ou replanejar uma funcionalidade.

Um retorno do cliente só é tratado como registrado quando há ata ou registro equivalente anexado; até lá, aparece como **a confirmar**.

## 6.5 Cuidados contínuos

Algumas atividades acompanharão todo o desenvolvimento:

- manter a ligação entre características do produto, RFs, RNFs e funcionalidades;
- manter a associação entre exercício, vídeo-base, vídeo de execução e feedback;
- testar cada incremento antes de integrá-lo ao produto;
- considerar o uso pelo celular (Chrome e Safari) nos fluxos usados durante os exercícios;
- considerar permissões e proteção dos dados desde o cadastro dos atletas;
- definir o acesso aos vídeos e às informações de acompanhamento antes da implementação desses fluxos;
- atualizar o cronograma quando a página do MVP ou o backlog mudar, quando houver indisponibilidade do cliente ou dificuldade técnica.

Quando um item precisar mudar de ciclo, a equipe registrará o motivo, a decisão tomada e o novo período previsto.

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor(es) |
    | :---: | :---: | --- | --- |
    | 16/11/2026 | 0.6 | Alinhamento ao backlog por iterações (fonte única, término em 08/12), inclusão dos RFs e RNFs por ciclo, executores e revisores, análise de capacidade, marcação de retornos sem ata como a confirmar e remoção de trecho inadequado ao documento público | A preencher |
    | 15/11/2026 | 0.5 | Alinhamento do cronograma ao escopo da página do MVP, registro do realizado nos ciclos C4 a C8 e redistribuição do planejamento nos ciclos C8 a C12 | Paulo Sérgio Rabelo Santana Rios |
    | 12/10/2026 | 0.4 | Atualização das fases RAD por ciclo, retorno do cliente e replanejamento do cronograma | Paulo Sérgio Rabelo Santana Rios |
    | 19/09/2026 | 0.3 | Complementação do cronograma com o trabalho realizado nos ciclos iniciais, forma de validação, evidências e regra de atualização | Luiz Henrique Pessato da Mota |
    | 18/09/2026 | 0.2 | Ajuste dos ciclos e alinhamento do cronograma ao processo RAD | Paulo Sérgio Rabelo Santana Rios |
    | 08/09/2026 | 0.1 | Estruturação inicial do cronograma | Anderson Fernandes da Silva |