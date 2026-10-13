# 5. ENGENHARIA DE REQUISITOS

No projeto **Space Jam**, o processo de Engenharia de Requisitos (ER) está organizado de forma integrada às quatro fases do modelo *Rapid Application Development* (RAD): **Planejamento de Requisitos**, **Design do Usuário**, **Construção** e **Cutover**. Essas fases orientam as atividades de elicitação, análise, especificação, representação, verificação, validação e atualização dos requisitos. O processo considera a elaboração de protótipos e a validação dos fluxos de treino junto ao treinador Lucas Cordeiro e aos atletas, conforme a disponibilidade dos envolvidos.

## 5.1 Atividades e Técnicas de ER

A seguir, são descritas as atividades e técnicas de Engenharia de Requisitos relacionadas às quatro fases do RAD. Durante o planejamento e o design, a equipe utiliza o Miro para organizar os artefatos de requisitos. Para acompanhar o desenvolvimento, utiliza o GitHub Projects, conforme descrito na [Seção 7](interacao_equipe_cliente.md). O quadro do Miro é um recurso de organização, sem adoção formal do framework Kanban.

### Planejamento de Requisitos

#### Elicitação e Descoberta

- **Entrevista com o stakeholder:** entrevista aberta e semiestruturada com o treinador Lucas Cordeiro para compreender o acompanhamento em quadra, a rotina de treinos e as principais dificuldades e oportunidades de melhoria.
- **Brainstorming interno:** reuniões da equipe de desenvolvimento para levantar hipóteses de solução para a biblioteca de exercícios e o acompanhamento de métricas, cujas ideias são posteriormente avaliadas.
- **Análise documental:** análise dos artefatos utilizados pelo treinador, como fichas manuais, anotações no Samsung Notes e planilhas.

#### Análise e Consenso

- **Matriz Valor × Esforço e análise de custo-benefício:** avaliação do valor esperado para o treinador e os atletas em relação ao esforço técnico de implementação, com os requisitos distribuídos em quatro quadrantes (Q1 a Q4), conforme a [Seção 10](backlog.md).
- **Priorização MoSCoW:** classificação das necessidades em *Must have*, *Should have*, *Could have* e *Won't have*, apoiando a definição do escopo do Produto Mínimo Viável (MVP).
- **Negociação de escopo com o cliente:** alinhamento entre a equipe, o treinador e os atletas sobre expectativas, usabilidade e limites operacionais, conforme a disponibilidade dos participantes.

#### Declaração de Requisitos

- **Documento de Visão:** registro dos Objetivos Específicos (OEs), das restrições de negócio, dos requisitos de alto nível e das características gerais do Space Jam.
- **Especificação de requisitos funcionais e não funcionais:** documentação dos RFs e RNFs, incluindo requisitos relacionados à privacidade, à LGPD e à segurança dos dados de menores, quando aplicável.

#### Verificação e Validação

- **Validação do escopo:** apresentação do escopo de alto nível ao treinador e aos atletas para confirmar o alinhamento com as necessidades identificadas.
- **Revisão por pares:** inspeção interna da documentação para identificar ambiguidades, redundâncias e inconsistências nos requisitos.

#### Organização e Atualização

- **Organização do escopo e rastreabilidade:** a equipe elaborou o MVP, a priorização MoSCoW, a matriz Valor × Esforço, a matriz de rastreabilidade e um quadro visual no **Miro**. Esses artefatos apoiam a organização do escopo e os vínculos entre os problemas identificados, os Objetivos Específicos (OE), as Características do Produto (CP), os Requisitos Funcionais (RF), os Requisitos Não Funcionais (RNF) e as Regras de Negócio (RN).

### Design do Usuário

#### Elicitação e Descoberta

- **Análise de tarefas:** mapeamento de como o treinador e os atletas realizam suas atividades, considerando objetivos, decisões e dificuldades.
- **Entrevistas e cocriação:** conversas com o treinador e os atletas para discutir fluxos operacionais, avaliar telas e identificar exceções relevantes para a interface.

#### Declaração e Representação

- **Prototipação no Figma:** criação e evolução de telas e componentes interativos de baixa e alta fidelidade.
- **Modelagem complementar de requisitos:** elaboração de modelos de fluxos de interação, matriz de permissões e acessos e modelo conceitual de dados.
- **Histórias de usuário e critérios de aceitação:** descrição do comportamento esperado por meio de histórias de usuário, considerando os princípios INVEST, acompanhadas de critérios de aceitação no formato *Dado/Quando/Então*.
- **Definition of Ready (DoR):** definição de critérios de prontidão para que uma história de usuário tenha requisitos, modelos e critérios de aceitação suficientes para iniciar a construção. O DoR é um acordo de trabalho da equipe e não substitui a verificação dos requisitos.

#### Análise e Consenso

- **Revisão das prioridades MoSCoW:** ajuste das prioridades conforme o feedback sobre os protótipos, a usabilidade e as necessidades do negócio.

#### Verificação e Validação

- **Validação dos protótipos e fluxos:** avaliação dos protótipos com o treinador, considerando as necessidades de negócio, e com os atletas, considerando a usabilidade e a clareza da interface. O resultado dessa avaliação orienta os ajustes antes da implementação.

#### Organização e Atualização

- **Atualização dos artefatos no Miro:** manutenção dos vínculos entre requisitos, histórias de usuário e elementos de interface, utilizando o quadro visual como apoio à organização e à rastreabilidade.

### Construção

#### Representação

- **Implementação dos requisitos especificados:** transformação das histórias de usuário e dos protótipos avaliados em funcionalidades do sistema, com desenvolvimento incremental.

#### Verificação e Validação

- **Verificação interna:** revisão por pares por meio de *Pull Requests* (PRs), conferência dos critérios de aceitação e aplicação de testes. A equipe prevê testes unitários automatizados para módulos críticos e testes funcionais manuais para as demais funcionalidades, conforme o plano de testes.
- **Validação com o cliente:** apresentação de funcionalidades ou incrementos ao treinador e, quando pertinente, aos atletas, para avaliar a aderência à rotina de treino. As sessões de validação devem ser combinadas de acordo com a disponibilidade dos participantes.

#### Organização e Atualização

- **Acompanhamento do desenvolvimento no GitHub Projects:** durante a construção, as histórias de usuário e tarefas são registradas como Issues e organizadas no GitHub Projects, que apoia o acompanhamento de status, responsáveis, prioridades e impedimentos. Quando aplicável, as Issues são vinculadas a branches, PRs e testes por meio de referências e links, mantendo a rastreabilidade entre requisitos e implementação.

### Cutover

#### Verificação e Validação

- **Homologação e testes de aceitação:** ao preparar uma versão para entrega, são realizados testes de aceitação e validação com o treinador e os atletas, conforme a disponibilidade e o estágio de implantação.

#### Declaração de Requisitos

- **Documentação da entrega:** elaboração ou atualização das notas de versão (*release notes*) e das orientações de uso correspondentes à versão disponibilizada.

#### Organização e Atualização

- **Registro da versão e das melhorias futuras:** atualização do GitHub Projects para identificar os itens concluídos, os itens não implementados e as demandas que poderão ser consideradas em versões futuras. A conclusão do desenvolvimento e a homologação pelo cliente são registradas como situações distintas.

---

## 5.2 Estrutura do Processo de ER: Dimensão Temporal e Atividades

O processo de Engenharia de Requisitos do Space Jam considera duas dimensões complementares: a **dimensão temporal**, representada pelas fases do ciclo de vida RAD, e a **dimensão funcional**, formada pelas atividades de Engenharia de Requisitos. O Miro organiza os artefatos elaborados durante o planejamento e o design; o GitHub Projects acompanha as tarefas de desenvolvimento.

### Cadeia de Rastreabilidade

A rastreabilidade proposta relaciona as necessidades do negócio aos artefatos de especificação e implementação:

**Problema → Objetivo Específico (OE) → Característica do Produto (CP) → RF/RNF e Regra de Negócio (RN) → História de Usuário (US) → Protótipo (Figma) → Issue no GitHub Projects → Código/PR → Teste → Feedback**

Essa cadeia depende da manutenção dos vínculos entre os artefatos, por meio de referências e links. A ferramenta, por si só, não garante rastreabilidade automática.

### Mapeamento das atividades de ER às fases do RAD

| Fase do RAD | Momento do ciclo | Atividade de ER | Técnica ou prática | Resultado esperado |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento de Requisitos** | Início do projeto e definição do escopo | Elicitação e Descoberta | Entrevista com o stakeholder, brainstorming e análise documental | Rotina de treino compreendida e dificuldades identificadas. |
| **Planejamento de Requisitos** | Definição do escopo | Análise e Consenso | Matriz Valor × Esforço, análise de custo-benefício, MoSCoW e negociação de escopo | MVP e prioridades definidos com base nas necessidades identificadas. |
| **Planejamento de Requisitos** | Definição do escopo | Declaração de Requisitos | Documento de Visão e especificação de RFs/RNFs | Objetivos, restrições e requisitos de alto nível documentados. |
| **Planejamento de Requisitos** | Definição do escopo | Verificação e Validação | Validação do escopo e revisão por pares | Escopo revisado e alinhado às necessidades levantadas. |
| **Planejamento de Requisitos** | Organização dos artefatos | Organização e Atualização | MVP, MoSCoW, matriz Valor × Esforço, matriz de rastreabilidade e quadro visual no Miro | Escopo organizado visualmente e relações entre problemas, objetivos e requisitos registradas. |
| **Design do Usuário** | Refinamento antes e durante a construção | Elicitação e Descoberta | Análise de tarefas, entrevistas e cocriação | Fluxos operacionais e necessidades de interface identificados. |
| **Design do Usuário** | Especificação da solução | Declaração e Representação | Figma, modelos de permissões e dados, histórias de usuário, critérios de aceitação e DoR | Protótipos e histórias de usuário suficientemente especificados para orientar a implementação. |
| **Design do Usuário** | Refinamento do escopo | Análise e Consenso | Revisão das prioridades MoSCoW | Prioridades revistas de acordo com as necessidades e o feedback recebido. |
| **Design do Usuário** | Avaliação da solução proposta | Verificação e Validação | Avaliação dos protótipos e fluxos com treinador e atletas | Ajustes identificados antes da implementação. |
| **Design do Usuário** | Organização dos artefatos | Organização e Atualização | Atualização da matriz de rastreabilidade e do quadro visual no Miro | Relações entre requisitos, histórias e protótipos mantidas nos artefatos. |
| **Construção** | Ciclos de desenvolvimento | Representação | Implementação das histórias e dos protótipos especificados | Funcionalidades implementadas de forma incremental. |
| **Construção** | Revisão e testes | Verificação e Validação | Revisão por pares, PRs, conferência dos critérios de aceitação e testes automatizados ou manuais | Implementação verificada em relação aos requisitos e critérios de aceitação. |
| **Construção** | Avaliação dos incrementos | Verificação e Validação | Demonstração e coleta de feedback do treinador e dos atletas, conforme disponibilidade | Necessidades de ajuste identificadas a partir da avaliação das funcionalidades. |
| **Construção** | Acompanhamento das tarefas | Organização e Atualização | GitHub Projects, Issues e links para PRs e testes | Status, responsáveis e relações entre requisitos e implementação acompanhados. |
| **Cutover** | Preparação da versão para entrega | Verificação e Validação | Testes de aceitação e homologação com o cliente | Evidências de aceitação registradas, quando a validação tiver sido realizada. |
| **Cutover** | Preparação da entrega | Declaração de Requisitos | Notas de versão e orientações de uso | Documentação correspondente à versão disponibilizada. |
| **Cutover** | Fechamento e planejamento futuro | Organização e Atualização | Atualização do GitHub Projects e registro de demandas futuras | Itens concluídos e melhorias pendentes identificados. |

---

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | :---: | :---: | :--- | :--- |
    | 12/10/2026 | 1.2 | Atualização da seção 5 com a organização dos artefatos de requisitos no Miro e o acompanhamento do desenvolvimento no GitHub Projects, sem adoção formal do framework Kanban; padronização de "Cutover" e de CP (Característica do Produto); inclusão da Issue na cadeia de rastreabilidade; descrição da matriz Valor × Esforço conforme a Seção 10. | Guilherme Ferreira Mendes |
    | 06/10/2026 | 1.1 | Ajuste conceitual do DoR, inclusão da dimensão temporal na tabela e explicitação da cadeia de rastreabilidade. | Guilherme Ferreira Mendes |
    | 17/09/2026 | 1.0 | Reestruturação do tópico 5 alinhada às quatro fases do RAD. | Guilherme Ferreira Mendes |
    | 08/09/2026 | 0.3 | Reorganização da seção 5.1 conforme as atividades de Engenharia de Requisitos. | Guilherme Ferreira Mendes |
    | 07/09/2026 | 0.2 | Correção do histórico de versões. | Guilherme Ferreira Mendes |
    | 07/09/2026 | 0.1 | Estruturação inicial do tópico 5 — Engenharia de Requisitos. | Guilherme Ferreira Mendes |