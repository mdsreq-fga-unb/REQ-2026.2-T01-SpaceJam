# 5. Engenharia de Requisitos {#5-engenharia-de-requisitos}

No projeto **Space Jam**, o processo de Engenharia de Requisitos (ER) está organizado de forma integrada às quatro fases do modelo *Rapid Application Development* (RAD): **Planejamento de Requisitos**, **Design do Usuário**, **Construção** e **Cutover**. Essas fases orientam as atividades de elicitação, análise, declaração, representação, verificação, validação e organização/atualização dos requisitos. O processo contempla a elaboração de protótipos e a validação dos fluxos junto ao treinador Lucas Cordeiro e, futuramente, junto aos atletas, conforme a disponibilidade dos envolvidos.

## 5.1 Atividades e Técnicas de ER

A seguir, são descritas as atividades e técnicas de Engenharia de Requisitos aplicadas ao longo das quatro fases do RAD, bem como suas respectivas evidências e situação atual no projeto. A manutenção do escopo textual está centralizada no [catálogo](requisitos.md), com as [orientações de atualização do backlog](backlog.md#atualizacao-do-backlog). Para organizar as interações da equipe, visualizar o fluxo de trabalho e acompanhar o andamento das entregas, a equipe utiliza exclusivamente um **quadro Kanban no [Miro](https://miro.com/app/board/uXjVHrFoSVo=/)**, descontinuando o uso previsto anteriormente do GitHub Projects.

### Planejamento de Requisitos

#### Elicitação e Descoberta

- **Entrevista com o stakeholder:** entrevistas semiestruturadas com o treinador Lucas Cordeiro para compreender o acompanhamento em quadra, a rotina de treinos e as oportunidades de melhoria, registradas nas atas de [17/09/2026](atas/2026-09-17-lucas.md), [26/09/2026](atas/2026-09-26-lucas.md) e [08/10/2026](atas/2026-10-08-lucas.md).
- **Brainstorming interno:** reuniões da equipe de desenvolvimento para levantar hipóteses de solução para a biblioteca de exercícios e o acompanhamento de métricas, evidenciada na [reunião de alinhamento com o brainstorm](reunioes.md#reuniao-de-alinhamento-com-o-brainstorm).
- **Análise documental:** exame dos artefatos reais utilizados pelo treinador — fichas individuais no **Samsung Notes**, planejamentos no **Microsoft Word** e anotações em **caderno físico** — cuja síntese e regras extraídas estão documentadas na [evidência de análise documental](reunioes.md#analise-documental).

#### Análise e Consenso

- **Matriz Valor × Esforço e análise de custo-benefício:** avaliação do valor esperado para o treinador e os atletas em relação ao esforço técnico de implementação, com os requisitos distribuídos em quatro quadrantes (Q1 a Q4), conforme a [Seção 10](backlog.md).
- **Priorização MoSCoW:** classificação das necessidades em *Must have*, *Should have*, *Could have* e *Won't have*, apoiando a definição do escopo do Produto Mínimo Viável (MVP).
- **Negociação de escopo com o cliente:** alinhamento entre a equipe e o treinador Lucas sobre expectativas, usabilidade e limites operacionais, conforme registrado na ata de [08/10/2026](atas/2026-10-08-lucas.md).

#### Declaração de Requisitos

- **Documento de Visão:** registro dos Objetivos Específicos (OEs), das restrições de negócio, dos requisitos de alto nível e das características gerais do Space Jam.
- **Especificação de requisitos funcionais e não funcionais:** documentação estruturada dos RFs, RNFs e Regras de Negócio (RNs) no [catálogo de requisitos](requisitos.md), incluindo requisitos voltados à privacidade, à LGPD e à proteção de dados de menores.

#### Verificação e Validação

- **Validação do escopo:** apresentação do escopo de alto nível ao treinador Lucas para confirmar o alinhamento com as necessidades identificadas. **Situação da participação dos atletas:** até o momento, não houve sessão direta de elicitação ou validação com os atletas; as necessidades atribuídas ao perfil de aluno foram derivadas da perspectiva operacional do treinador e permanecem sinalizadas como pendentes de validação direta.
- **Revisão por pares e encerramento dos RNFs:** inspeção interna da documentação para eliminar ambiguidades, redundâncias e inconsistências. As pendências de acesso, visibilidade e consentimento levantadas nas reuniões de [26/09](atas/2026-09-26-lucas.md) e [08/10](atas/2026-10-08-lucas.md) foram tratadas na [Matriz Consolidada de Permissões e Acessos](https://docs.google.com/document/d/1_6J8LWkFLCoRqjBAPhsyps4IfjCPU20Rf6IHtn7pYzM/edit?tab=t.0#heading=h.scqgboim3nm1), e a consolidação completa da revisão por pares encontra-se em execução na [seção de revisão por pares](reunioes.md#revisao-por-pares).

#### Organização e Atualização

- **Organização do escopo e rastreabilidade:** elaboração do recorte do MVP, da priorização MoSCoW, da matriz Valor × Esforço, da matriz de rastreabilidade e do **quadro Kanban no [Miro](https://miro.com/app/board/uXjVHrFoSVo=/)**, utilizado para organizar as iterações, o fluxo de trabalho e as interações da equipe.

---

### Design do Usuário

#### Elicitação e Descoberta

- **Análise de tarefas:** mapeamento comparativo de como o treinador e os atletas executam suas atividades no **cenário atual** e no **cenário futuro** (aplicação Web), detalhando passos, decisões, dificuldades e exceções na [evidência de análise de tarefas](reunioes.md#analise-de-tarefas).
- **Entrevistas e cocriação:** conversas com o treinador para discutir fluxos operacionais, avaliar telas e identificar exceções relevantes para a interface.

#### Declaração e Representação

- **Prototipação navegável no Figma:** criação e evolução de telas de baixa e [alta fidelidade com navegação interativa](https://www.figma.com/design/HJ5ukxYtbpQDmzD2OO7Jw3/Space-Jam?node-id=168-1123&t=A0Cp6Y2IzX1Yzgec-0), simulando ponta a ponta os fluxos de cadastro, acompanhamento do atleta, montagem de treinos, envio de vídeos e registro de feedback.
- **Modelagem complementar de requisitos:**
  - *Artefatos já produzidos:* **fluxos de interação** cobertos pelo [protótipo navegável de alta fidelidade no Figma](reunioes.md#prototipo-alta-fidelidade-navegavel) (adotado em substituição a diagramas estáticos de interação, conforme a abordagem iterativa do RAD), [Matriz Consolidada de Permissões e Acessos por Perfil (RBAC e Data Isolation)](https://docs.google.com/document/d/1_6J8LWkFLCoRqjBAPhsyps4IfjCPU20Rf6IHtn7pYzM/edit?tab=t.0#heading=h.scqgboim3nm1) e diagramas de contexto (Rich Picture, Ishikawa e Mapa de Stakeholders no [Cenário Atual](cenario_atual.md)).
  - *Artefato em elaboração:* **modelo conceitual de dados** para formalizar as entidades e relacionamentos do banco de dados.
- **Histórias de usuário e critérios de aceitação:** descrição do comportamento esperado por meio de histórias de usuário (INVEST), acompanhadas de critérios de aceitação no formato *Dado/Quando/Então*.
- **Definition of Ready (DoR):** definição de critérios de prontidão para que uma história de usuário tenha requisitos, modelos e critérios de aceitação suficientes antes de iniciar o desenvolvimento. O DoR atua como acordo de trabalho da equipe e não substitui a verificação dos requisitos.

#### Análise e Consenso

- **Revisão das prioridades MoSCoW:** ajuste das prioridades conforme o feedback sobre os protótipos, a usabilidade e as necessidades do negócio.

#### Verificação e Validação

- **Validação dos protótipos e fluxos:** avaliação dos protótipos com o treinador Lucas (confirmando aderência à rotina de treino) e validação futura com os atletas (para verificar clareza e usabilidade da interface antes ou durante os ciclos incrementais).

#### Organização e Atualização

- **Atualização dos registros e do quadro Kanban:** manutenção dos vínculos entre requisitos, histórias, modelos e interfaces no [catálogo](requisitos.md) e atualização contínua dos cards no **quadro Kanban do [Miro](https://miro.com/app/board/uXjVHrFoSVo=/)**.

---

### Construção

> **Delimitação conceitual:** Nesta fase do RAD, o desenvolvimento do código-fonte corresponde à atividade de *Construção de Software*, orientada pelos artefatos de requisitos. As atividades de Engenharia de Requisitos na Construção concentram-se em manter as representações e critérios atualizados, verificar a conformidade dos incrementos, validar entregas com o cliente e gerenciar mudanças no escopo.

#### Declaração e Representação

- **Refinamento de modelos e especificações de suporte à construção:** atualização das histórias de usuário, critérios de aceitação, regras de permissão e protótipos quando surgem dúvidas técnicas ou ajustes de fluxo durante o desenvolvimento incremental, garantindo que as representações continuem orientando corretamente a implementação.

#### Verificação e Validação

- **Verificação interna:** revisão por pares por meio de *Pull Requests* (PRs), conferência dos critérios de aceitação e aplicação de testes unitários automatizados para módulos críticos e testes funcionais manuais para as demais funcionalidades.
- **Validação incremental com o cliente:** demonstração de funcionalidades prontas ao treinador Lucas (e aos atletas, conforme disponibilidade) para validar a aderência à rotina real de treino e retroalimentar o backlog.

#### Organização e Atualização

- **Gestão do fluxo no quadro Kanban (Miro):** acompanhamento visual das tarefas, responsáveis, prioridades, dependências e estados de execução nas iterações do **quadro Kanban do [Miro](https://miro.com/app/board/uXjVHrFoSVo=/)**, refletindo mudanças e replanejamentos no [backlog](backlog.md).

---

### Cutover

#### Verificação e Validação

- **Homologação e testes de aceitação:** execução de testes de aceitação e validação final do MVP com o treinador Lucas e os atletas (conforme disponibilidade) antes da disponibilização em produção.

#### Declaração de Requisitos

- **Documentação da entrega:** elaboração ou atualização das notas de versão (*release notes*) e das orientações de uso correspondentes à versão entregue.

#### Organização e Atualização

- **Fechamento do ciclo e backlog evolutivo:** atualização final do **quadro Kanban no [Miro](https://miro.com/app/board/uXjVHrFoSVo=/)** e do [backlog](backlog.md) para registrar os itens concluídos, homologados e as demandas adiadas para versões futuras (como o módulo de testes físicos).

---

## 5.2 Estrutura do Processo de ER: Dimensão Temporal e Atividades

O processo de Engenharia de Requisitos do Space Jam articula a **dimensão temporal**, representada pelas quatro fases do ciclo de vida RAD, e a **dimensão funcional**, formada pelas atividades de Engenharia de Requisitos. O [catálogo](requisitos.md) centraliza a especificação textual, enquanto o **quadro Kanban no [Miro](https://miro.com/app/board/uXjVHrFoSVo=/)** organiza o fluxo de trabalho, as iterações e os artefatos visuais da equipe.

### Cadeia de Rastreabilidade

A rastreabilidade do projeto conecta as necessidades identificadas no negócio aos artefatos de especificação, modelagem, acompanhamento e verificação:

**Problema → Objetivo Específico (OE) → Característica do Produto (CP) → RF/RNF e Regra de Negócio (RN) → História de Usuário (US) → Modelos e Protótipos (Figma / Matriz de Permissões) → Card no Kanban (Miro) → Código/PR → Teste → Feedback**

Essa cadeia depende da manutenção explícita de links e identificadores entre os documentos do repositório e o quadro visual no Miro.

### Mapeamento das atividades de ER às fases do RAD

<details class="sj-document-details" markdown="1">
<summary>Consultar o mapeamento completo das atividades de ER</summary>

| Fase do RAD | Momento do ciclo | Atividade de ER | Técnica ou prática | Resultado / Evidência no Projeto |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento de Requisitos** | Início do projeto e descoberta | Elicitação e Descoberta | Entrevistas com o treinador, brainstorming e análise documental (Samsung Notes, Word e caderno) | Rotina compreendida; atas de [17/09](atas/2026-09-17-lucas.md), [26/09](atas/2026-09-26-lucas.md) e [08/10](atas/2026-10-08-lucas.md) e [análise documental](reunioes.md#analise-documental) registradas. |
| **Planejamento de Requisitos** | Definição de escopo | Análise e Consenso | Matriz Valor × Esforço (Q1–Q4), priorização MoSCoW e negociação de escopo | Recorte do MVP e prioridades definidos na [Seção 10](backlog.md). |
| **Planejamento de Requisitos** | Definição de escopo | Declaração de Requisitos | Documento de Visão e especificação de RFs, RNFs e RNs | Objetivos, restrições e requisitos documentados no [catálogo](requisitos.md). |
| **Planejamento de Requisitos** | Qualidade e alinhamento | Verificação e Validação | Validação de escopo com o treinador e revisão por pares | Escopo validado com Lucas; pendências de RNFs tratadas na [Matriz de Permissões](https://docs.google.com/document/d/1_6J8LWkFLCoRqjBAPhsyps4IfjCPU20Rf6IHtn7pYzM/edit?tab=t.0#heading=h.scqgboim3nm1) e [revisão por pares](reunioes.md#revisao-por-pares) em consolidação. Participação de atletas pendente. |
| **Planejamento de Requisitos** | Organização dos artefatos | Organização e Atualização | Matriz de rastreabilidade, backlog e quadro Kanban no Miro | Escopo e iterações organizados no [quadro Kanban do Miro](https://miro.com/app/board/uXjVHrFoSVo=/). |
| **Design do Usuário** | Refinamento operacional | Elicitação e Descoberta | Análise de tarefas (cenário atual e futuro) e cocriação de fluxos | Passos, decisões, dificuldades e exceções documentados na [análise de tarefas](reunioes.md#analise-de-tarefas). |
| **Design do Usuário** | Especificação e modelagem | Declaração e Representação | [Protótipo navegável de alta fidelidade no Figma](reunioes.md#prototipo-alta-fidelidade-navegavel) (fluxos de interação), [Matriz de Permissões](https://docs.google.com/document/d/1_6J8LWkFLCoRqjBAPhsyps4IfjCPU20Rf6IHtn7pYzM/edit?tab=t.0#heading=h.scqgboim3nm1), US (INVEST), critérios de aceitação e DoR | Fluxos de interação navegáveis e regras de permissão concluídos; modelo conceitual de dados em elaboração. |
| **Design do Usuário** | Refinamento de prioridades | Análise e Consenso | Revisão das prioridades MoSCoW após feedback de protótipo | Ajustes de prioridade registrados na reunião de [08/10/2026](atas/2026-10-08-lucas.md). |
| **Design do Usuário** | Avaliação da solução | Verificação e Validação | Validação dos protótipos e fluxos com o treinador (e futuramente com atletas) | Retorno inicial de Lucas registrado em [reunioes.md](reunioes.md#validacao-do-prototipo-inicial); validação de usabilidade com atletas pendente. |
| **Design do Usuário** | Organização dos artefatos | Organização e Atualização | Atualização do catálogo e do quadro Kanban no Miro | Vínculos entre requisitos, histórias e telas mantidos nos artefatos. |
| **Construção** | Ciclos de desenvolvimento | Declaração e Representação | Refinamento de critérios de aceitação, regras e modelos para orientar o desenvolvimento | Especificações e modelos atualizados para suportar a implementação incremental do produto. |
| **Construção** | Revisão técnica e testes | Verificação e Validação | Revisão de PRs, conferência de critérios de aceitação e testes automatizados/manuais | Incrementos verificados em relação aos requisitos e critérios de aceitação. |
| **Construção** | Avaliação de incrementos | Verificação e Validação | Demonstração funcional ao treinador e coleta de feedback | Ajustes e novos aprendizados incorporados ao backlog e ao Kanban. |
| **Construção** | Gestão do fluxo | Organização e Atualização | Quadro Kanban no Miro (iterações, responsáveis e estados) | Acompanhamento visual do progresso e impedimentos no [Miro](https://miro.com/app/board/uXjVHrFoSVo=/). |
| **Cutover** | Preparação para entrega | Verificação e Validação | Testes de aceitação e homologação com o cliente | Evidências de aceitação registradas antes da entrega final. |
| **Cutover** | Documentação final | Declaração de Requisitos | Notas de versão (*release notes*) e orientações de uso | Documentação de apoio à operação da versão entregue. |
| **Cutover** | Encerramento de ciclo | Organização e Atualização | Atualização final do quadro Kanban no Miro e do backlog | Itens concluídos e demandas evolutivas pós-MVP consolidados. |

</details>

---

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | --- | --- | :--- | :--- |
    | 16/11/2026 | 1.3 | Substituição do GitHub Projects pelo quadro Kanban no Miro; separação conceitual entre Construção do produto e atividades de Representação de ER; vinculação das evidências de análise documental, análise de tarefas, Matriz Consolidada de Permissões e protótipo navegável de alta fidelidade (em substituição aos diagramas estáticos de fluxo de interação); registro do status da revisão por pares e da participação dos atletas. | Guilherme Ferreira Mendes |
    | 12/10/2026 | 1.2 | Atualização da seção 5 com a organização dos artefatos de requisitos no Miro e o acompanhamento do desenvolvimento no GitHub Projects, sem adoção formal do framework Kanban; padronização de "Cutover" e de CP (Característica do Produto); inclusão da Issue na cadeia de rastreabilidade; descrição da matriz Valor × Esforço conforme a Seção 10. | Guilherme Ferreira Mendes |
    | 06/10/2026 | 1.1 | Ajuste conceitual do DoR, inclusão da dimensão temporal na tabela e explicitação da cadeia de rastreabilidade. | Guilherme Ferreira Mendes |
    | 17/09/2026 | 1.0 | Reestruturação do tópico 5 alinhada às quatro fases do RAD. | Guilherme Ferreira Mendes |
    | 08/09/2026 | 0.3 | Reorganização da seção 5.1 conforme as atividades de Engenharia de Requisitos. | Guilherme Ferreira Mendes |
    | 07/09/2026 | 0.2 | Correção do histórico de versões. | Guilherme Ferreira Mendes |
    | 07/09/2026 | 0.1 | Estruturação inicial do tópico 5 — Engenharia de Requisitos. | Guilherme Ferreira Mendes |