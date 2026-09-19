# 6. Cronograma e Entregas

O cronograma do **Space Jam** organiza a evolução do produto em ciclos curtos. A equipe adotou uma **abordagem híbrida**, com ciclo de vida **iterativo e incremental** e processo **RAD**. O planejamento considera o período de **07/09/2026 a 08/12/2026**.

Os ciclos representam períodos de trabalho, e não sprints do Scrum. Em cada período, a equipe pode trabalhar com requisitos, protótipos, construção e validação em intensidades diferentes. A ordem das funcionalidades futuras ainda poderá mudar depois da definição e priorização do MVP.

## 6.1 Ciclos realizados e em andamento

Os primeiros ciclos registram o trabalho que de fato ocorreu, em vez de apresentar funcionalidades ainda não implementadas.

| Ciclo | Período | Situação | Atividade RAD predominante | Trabalho realizado | Evidência ou resultado |
| --- | --- | --- | --- | --- | --- |
| **C1** | 07/09 a 13/09 | Concluído | Planejamento de Requisitos | Revisão da visão inicial do produto e análise dos pontos que precisavam de correção ou confirmação com o cliente | Artefatos da visão revisados no Pages, com histórico registrado em [Cenário Atual](cenario_atual.md), [Solução Proposta](solucao.md) e [Intervenção Social](intervencao_social.md) |
| **C2** | 14/09 a 20/09 | Em andamento | Planejamento de Requisitos | Alinhamento do processo RAD, preparação e realização da conversa de diagnóstico com Lucas e início do levantamento dos requisitos | Tópico de [Engenharia de Requisitos](engenharia_requisitos.md) reorganizado; informações da conversa com Lucas e lista inicial de RFs e RNFs em consolidação. A publicação do registro da reunião ainda está pendente na página de [Reuniões](reunioes.md) |

## 6.2 Planejamento dos próximos ciclos

Os ciclos seguintes representam uma previsão inicial. A sequência poderá ser ajustada depois da revisão dos RFs, RNFs, dependências e prioridades do MVP.

| Ciclo | Período | Atividade RAD predominante | Objetivo | Resultado esperado | Verificação e validação |
| --- | --- | --- | --- | --- | --- |
| **C3** | 21/09 a 27/09 | Planejamento de Requisitos | Consolidar os requisitos e definir o primeiro recorte do produto | RFs e RNFs revisados, rastreabilidade com as características do produto e proposta de MVP priorizada | Revisão em pares e esclarecimento com o cliente dos pontos ainda duvidosos |
| **C4** | 28/09 a 04/10 | Design do Usuário | Projetar o fluxo principal entre treinador e atleta | Protótipo navegável do acompanhamento do atleta, organização do treino e consulta das orientações | Avaliação do protótipo com Lucas antes da implementação e registro dos ajustes solicitados |
| **C5** | 05/10 a 11/10 | Design do Usuário e Construção | Preparar a base técnica e o acesso ao sistema | Ambiente integrado, modelo inicial de dados e primeiro fluxo de acesso necessário ao MVP | Testes de acesso e permissões; demonstração do fluxo conforme os critérios de aceitação |
| **C6** | 12/10 a 18/10 | Design do Usuário e Construção | Implementar o acompanhamento básico dos atletas | Cadastro e consulta dos dados esportivos e testes de acompanhamento que forem priorizados | Verificação dos campos, regras e permissões; validação do fluxo com o treinador |
| **C7** | 19/10 a 25/10 | Design do Usuário e Construção | Organizar exercícios e planos de treino | Fluxo para cadastrar exercícios, montar treinos e associá-los aos atletas | Testes dos critérios de aceitação e demonstração de uma rotina de montagem de treino |
| **C8** | 26/10 a 01/11 | Design do Usuário e Construção | Disponibilizar o treino para o atleta | Interface para consultar as orientações e registrar a execução do treino, conforme o recorte do MVP | Teste de usabilidade do fluxo treinador–atleta e registro dos ajustes necessários |
| **C9** | 02/11 a 08/11 | Design do Usuário e Construção | Construir o fluxo de vídeo e feedback técnico | Envio de vídeo ligado ao atleta, treino ou exercício e retorno do treinador | Verificação de formato, acesso e associação do vídeo; validação do fluxo completo com o cliente |
| **C10** | 09/11 a 15/11 | Design do Usuário e Construção | Consolidar privacidade, consentimento e proteção dos dados | Controles de acesso e visibilidade dos dados e vídeos, termos necessários e revisão dos RNFs relacionados à segurança e à LGPD | Testes de permissões e privacidade; revisão das regras com o cliente e demais stakeholders envolvidos |
| **C11** | 16/11 a 22/11 | Construção e preparação para Cutover | Integrar e homologar o MVP | Fluxos do MVP integrados, correções prioritárias, ambiente de homologação e resultados dos testes | Testes ponta a ponta, usabilidade, permissões e RNFs; homologação assistida com o treinador |
| **C12** | 23/11 a 08/12 | Cutover | Disponibilizar a versão acordada e acompanhar o uso inicial | Implantação, documentação mínima de uso, monitoramento e registro das limitações conhecidas | Validação do funcionamento com o cliente, coleta de feedback e registro das evoluções futuras |

!!! note "Planejamento em evolução"
    A partir do C3, os objetivos e resultados representam uma previsão inicial. Eles deverão ser atualizados quando a equipe concluir a priorização dos requisitos e do MVP, sem apagar o histórico das decisões anteriores.

## 6.3 Como os ciclos serão conduzidos

Antes de implementar uma funcionalidade, a equipe deverá compreender a necessidade, revisar os requisitos relacionados e, quando necessário, preparar um protótipo. Depois da avaliação do fluxo, o incremento poderá ser construído, testado e apresentado.

As etapas do RAD não precisam ter a mesma duração em todos os ciclos. Nos ciclos iniciais, o trabalho está mais concentrado no Planejamento de Requisitos e no Design do Usuário. A Construção ganha espaço conforme os requisitos ficam prontos, enquanto o Cutover concentra a homologação, a implantação e o acompanhamento inicial da versão entregue.

## 6.4 Verificação, validação e evidências

A equipe utilizará dois momentos diferentes de avaliação:

- **Validação do protótipo:** confirma com Lucas se a ideia e o fluxo representam a necessidade antes da implementação.
- **Validação do incremento:** apresenta uma parte funcional do produto para confirmar se ela atende à rotina esperada.

Antes da validação com o cliente, a equipe fará a verificação interna com base nos requisitos e critérios de aceitação. Caso Lucas não possa participar de uma reunião, a equipe combinará outra forma de receber e registrar o retorno.

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
- testar cada incremento antes de integrá-lo ao produto;
- considerar permissões e proteção dos dados desde o cadastro dos atletas;
- definir o acesso aos vídeos e às informações de acompanhamento antes da implementação desses fluxos;
- atualizar o MVP e o cronograma quando houver mudança de prioridade, indisponibilidade do cliente ou dificuldade técnica.

Quando um item precisar mudar de ciclo, a equipe registrará o motivo, a decisão tomada e o novo período previsto.

## 6.6 Referências de organização

Para complementar a estrutura do cronograma, foram observados projetos anteriores da disciplina com características próximas. Esses projetos serviram apenas como exemplos de organização; as decisões do Space Jam continuam baseadas em seu próprio contexto e nos materiais da disciplina.

- [LF Bag Your Dreams — Estratégias de Engenharia de Software](https://mdsreq-fga-unb.github.io/2025.1-T01-LFBagYourDreams/documento-visao/estrategias/) e [Cronogramas e Entregas](https://mdsreq-fga-unb.github.io/2025.1-T01-LFBagYourDreams/documento-visao/cronograma/): projeto que também declarou abordagem híbrida, ciclo iterativo e incremental e processo RAD, separando levantamento, prototipação, construção, MVP e entrega final.
- [ArtPlace — Processo de Desenvolvimento](https://mdsreq-fga-unb.github.io/2023.2-ArtPlace/processo/): exemplo de aplicação do RAD em ciclos semanais com registro das fases trabalhadas.

## Histórico de Revisão

| Data | Versão | Descrição | Autor(es) |
| :---: | :---: | --- | --- |
| 19/09/2026 | 0.3 | Complementação do cronograma com o trabalho realizado nos ciclos iniciais, forma de validação, evidências e regra de atualização | Luiz Henrique Pessato da Mota |
| 18/09/2026 | 0.2 | Ajuste dos ciclos e alinhamento do cronograma ao processo RAD | Paulo Sérgio Rabelo Santana Rios |
| 08/09/2026 | 0.1 | Estruturação inicial do cronograma | Anderson Fernandes da Silva |
