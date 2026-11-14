# 5. ENGENHARIA DE REQUISITOS

No projeto **Space Jam**, o processo de Engenharia de Requisitos (ER) está organizado de forma integrada às quatro fases do modelo *Rapid Application Development* (RAD): **Planejamento de Requisitos**, **Design do Usuário**, **Construção** e **Cutover**. Essas fases orientam as atividades de elicitação, análise, especificação, representação, verificação, validação e atualização dos requisitos. O processo considera a elaboração de protótipos navegáveis e a validação dos fluxos de treino junto ao treinador Lucas Cordeiro e aos atletas, conforme a disponibilidade dos envolvidos.

## 5.1 Atividades e Técnicas de ER

A seguir, são descritas as atividades e técnicas de Engenharia de Requisitos relacionadas às quatro fases do RAD, destacando os resultados produzidos, os vínculos com os registros em [Reuniões](reunioes.md) e o impacto sobre os requisitos. Durante o planejamento e o design, a equipe utiliza o Miro para organizar os artefatos de requisitos. Para acompanhar o desenvolvimento, utiliza o GitHub Projects, conforme descrito na [Seção 7](interacao_equipe_cliente.md). O quadro do Miro é um recurso de organização, sem adoção formal do framework Kanban.

### Planejamento de Requisitos

#### Elicitação e Descoberta

- **Entrevista com o stakeholder:** entrevista aberta e semiestruturada com o treinador Lucas Cordeiro (registrada na [ata de 17/09/2026](atas/2026-09-17-lucas.md) e aprofundada nos encontros de [26/09/2026](atas/2026-09-26-lucas.md) e [08/10/2026](atas/2026-10-08-lucas.md)) para compreender o acompanhamento em quadra, a rotina de treinos e as principais dificuldades e oportunidades de melhoria.
- **Brainstorming interno:** reuniões da equipe de desenvolvimento (evidenciadas em [Reunião de alinhamento com o brainstorm](reunioes.md#reuniao-de-alinhamento-com-o-brainstorm) e nas atas de [14/09/2026](atas/2026-09-14-equipe.md) e [21/09/2026](atas/2026-09-21-equipe.md)) para levantar hipóteses de solução para a biblioteca de exercícios e o acompanhamento de métricas, cujas ideias são posteriormente avaliadas.
- **Análise documental:** exame dos artefatos reais utilizados pelo treinador em sua rotina — especificamente anotações pessoais no **Samsung Notes**, documentos no **Word**, anotações em **caderno físico** e **planilhas**, conforme a evidência e análise registradas em [Análise documental: registro pessoal de atleta](reunioes.md#analise-documental-ficha-atleta).
  - *Síntese e impacto nos requisitos:* o exame das fichas individuais demonstrou que o treinador registra dados cadastrais, antropométricos (altura, peso, altura do salto), clínicos (histórico e recuperação de lesões) e táticos (objetivos por posição em quadra) de forma não estruturada e dispersa. Essa análise fundamentou: (i) a estruturação dos campos do perfil e dos testes físicos; (ii) a segregação de permissões entre dados biométricos básicos (editáveis pelo atleta) e dados clínicos/táticos (restritos ao treinador); e (iii) a necessidade de fluxo de consentimento legal para atletas menores de idade.

#### Análise e Consenso

- **Matriz Valor × Esforço e análise de custo-benefício:** avaliação do valor esperado para o treinador e os atletas em relação ao esforço técnico de implementação, com os requisitos distribuídos em quatro quadrantes (Q1 a Q4), conforme a [Seção 10](backlog.md).
- **Priorização MoSCoW:** classificação das necessidades em *Must have*, *Should have*, *Could have* e *Won't have*, apoiando a definição do escopo do Produto Mínimo Viável (MVP).
- **Negociação de escopo com o cliente:** alinhamento entre a equipe e o treinador (atas de [17/09/2026](atas/2026-09-17-lucas.md), [26/09/2026](atas/2026-09-26-lucas.md) e [08/10/2026](atas/2026-10-08-lucas.md)) sobre expectativas, usabilidade e limites operacionais, conforme a disponibilidade dos participantes.

#### Declaração de Requisitos

- **Documento de Visão:** registro dos Objetivos Específicos (OEs), das restrições de negócio, dos requisitos de alto nível e das características gerais do Space Jam.
- **Especificação de requisitos funcionais, não funcionais e regras de negócio:** documentação dos RFs, RNFs e RNs no [catálogo de requisitos](requisitos.md), incluindo regras de acesso, visibilidade de mídias e conformidade com a LGPD para dados de menores.

#### Verificação e Validação

- **Validação do escopo:** apresentação do escopo de alto nível ao treinador para confirmar o alinhamento com as necessidades identificadas ([ata de 17/09/2026](atas/2026-09-17-lucas.md) e [ata de 26/09/2026](atas/2026-09-26-lucas.md)).
- **Revisão por pares:** inspeção interna da documentação nas reuniões de equipe ([28/09/2026](atas/2026-09-28-equipe.md) e [05/10/2026](atas/2026-10-05-equipe.md)) e alinhamento metodológico com monitoria ([21/09/2026](atas/2026-09-21-monitor.md)) para identificar ambiguidades, redundâncias e inconsistências entre requisitos, regras de negócio e histórias de usuário.
  - *Consolidação das revisões:* as inspeções internas identificaram conflitos entre declarações de cadastro genérico, divergências nas transições de status dos exercícios e repetições de descrições no backlog. Como decisão corretiva, o cadastro foi separado por perfil (atleta por código de convite e treinador sujeito à aprovação), os estados dos exercícios e treinos foram unificados nas Regras de Negócio e o [catálogo de requisitos](requisitos.md) está sendo revisado para atuar como fonte única sem conflitos.
- **Validação dos RNFs:** após as pendências registradas nas reuniões de [26/09/2026](atas/2026-09-26-lucas.md) e [08/10/2026](atas/2026-10-08-lucas.md), a equipe realizou uma reunião posterior de validação com o treinador para encerrar as definições sobre controle de acesso, visibilidade de mídias e consentimento de dados/imagem (LGPD). O registro formal dessa validação será incorporado à página [Reuniões](reunioes.md) junto às demais atas pendentes de publicação.

#### Organização e Atualização

- **Organização do escopo e rastreabilidade:** a equipe elaborou o MVP, a priorização MoSCoW, a matriz Valor × Esforço, a matriz de rastreabilidade e um quadro visual no **Miro**. Esses artefatos apoiam a organização do escopo e os vínculos entre os problemas identificados, os Objetivos Específicos (OE), as Características do Produto (CP), os Requisitos Funcionais (RF), os Requisitos Não Funcionais (RNF) e as Regras de Negócio (RN).

---

### Design do Usuário

#### Elicitação e Descoberta

- **Análise de tarefas:** mapeamento operacional de como o treinador e os atletas executam suas atividades no cenário atual (registrado em [Análise de tarefas: rotina atual do treinador e dos atletas](reunioes.md#analise-de-tarefas-cenario-atual)) e no fluxo proposto, identificando passos, decisões, dificuldades e exceções:
  - *Fluxo do Treinador:* (1) avalia o atleta presencialmente e anota métricas/lesões em canais dispersos (caderno, Word, Samsung Notes); (2) decide a prescrição com base no objetivo tático e no histórico clínico; (3) demonstra exercícios em quadra ou recebe vídeos avulsos via WhatsApp. **Dificuldades e exceções:** perda de vínculo entre vídeos recebidos e feedbacks enviados, retrabalho para consolidar evolução histórica e dependência de espaço físico, equipamentos ou auxílio de terceiros para aplicar testes padronizados. **Impacto nos requisitos:** originou a biblioteca centralizada com vídeos-base e erros comuns, o vínculo direto entre vídeo de execução e feedback avaliativo e a separação entre relato do atleta e validação do treinador.
  - *Fluxo do Atleta:* (1) recebe orientações verbais ou por mensagens; (2) executa os exercícios prescritos; (3) opcionalmente grava e envia vídeos de execução para correção técnica. **Dificuldades e exceções:** dificuldade de lembrar detalhes de execução após o treino presencial, envio de vídeos errados ou fora de contexto e ausência de canal estruturado para relatar dificuldades específicas sem misturar com a avaliação do treinador. **Impacto nos requisitos:** definiu o registro de percepção de dificuldade (escala de 1 a 5), o relato textual do atleta, a permissão de substituir/excluir vídeo antes do feedback e a devolução de exercício para "Corrigir/Refazer".
- **Entrevistas e cocriação:** conversas com o treinador ([26/09/2026](atas/2026-09-26-lucas.md) e [08/10/2026](atas/2026-10-08-lucas.md)) para discutir fluxos operacionais, avaliar telas e identificar exceções relevantes para a interface.

#### Declaração e Representação

- **Prototipação no Figma:** criação e evolução de telas de baixa e **alta fidelidade com botões navegáveis** ([protótipo no Figma](https://www.figma.com/design/HJ5ukxYtbpQDmzD2OO7Jw3/Space-Jam?node-id=31-864)), simulando os fluxos principais de cadastro, acompanhamento do atleta, montagem de treinos, envio de vídeos e registro de feedback.
- **Modelagem complementar de requisitos:** acompanhamento dos artefatos estruturais previstos para complementar a especificação:
  - *Artefatos já existentes:* **fluxos de interação** cobertos pela navegação interativa entre telas e estados no protótipo de alta fidelidade no [Figma](https://www.figma.com/design/HJ5ukxYtbpQDmzD2OO7Jw3/Space-Jam?node-id=31-864), mapa de stakeholders/fluxos do cenário atual e regras de permissão e isolamento de dados formalizadas no [catálogo de RNs e RNFs](requisitos.md).
  - *Artefatos em elaboração / atrasados:* a **matriz tabular de permissões por perfil** encontra-se em elaboração (vinculada à revisão final dos RFs e RNs), enquanto o **modelo conceitual de dados** sofreu atraso no cronograma da equipe e ainda não foi concluído.
- **Histórias de usuário e critérios de aceitação:** descrição do comportamento esperado por meio de histórias de usuário, considerando os princípios INVEST, acompanhadas de critérios de aceitação no formato *Dado/Quando/Então*.
- **Definition of Ready (DoR):** definição de critérios de prontidão para que uma história de usuário tenha requisitos, modelos e critérios de aceitação suficientes para iniciar a construção. O DoR é um acordo de trabalho da equipe e não substitui a verificação dos requisitos.

#### Análise e Consenso

- **Revisão das prioridades MoSCoW:** ajuste das prioridades conforme o feedback sobre os protótipos, a usabilidade e as necessidades do negócio.

#### Verificação e Validação

- **Validação dos protótipos e fluxos:** apresentação inicial dos protótipos navegáveis e vídeo explicativo ao treinador (registrada em [Apresentação do protótipo inicial](reunioes.md#validacao-do-prototipo-inicial) e na [ata de 08/10/2026](atas/2026-10-08-lucas.md)) para verificar aderência às necessidades de negócio, bem como planejamento da avaliação de usabilidade com os atletas.
  - *Nota sobre o registro da validação inicial:* conforme sinalizado em [Reuniões](reunioes.md#validacao-do-prototipo-inicial), os metadados complementares das reuniões posteriores serão adicionados à página de reuniões.
  - *Situação da participação dos atletas:* a validação direta com os atletas ainda não foi executada, constituindo uma pendência reconhecida pela equipe. Embora o treinador Lucas tenha manifestado disponibilidade para intermediar a coleta de opiniões via grupo, essa disponibilidade não substitui a evidência de uso. A sessão de validação com os atletas está programada para ocorrer na **próxima semana**, com posterior registro dos resultados em [Reuniões](reunioes.md).

#### Organização e Atualização

- **Atualização dos artefatos no Miro:** manutenção dos vínculos entre requisitos, histórias de usuário e elementos de interface, utilizando o quadro visual como apoio à organização e à rastreabilidade.

---

### Construção

#### Representação

- **Refinamento de modelos para construção:** atualização dos protótipos navegáveis, critérios de aceitação e modelos de dados que orientam e esclarecem os detalhes de cada incremento antes e durante o desenvolvimento, mantendo a representação dos requisitos distinta da codificação do produto.

#### Construção do Produto

- **Desenvolvimento incremental:** codificação das funcionalidades no frontend e backend a partir das histórias de usuário, critérios de aceitação e protótipos validados.

#### Verificação e Validação

- **Verificação interna:** revisão por pares por meio de *Pull Requests* (PRs), conferência dos critérios de aceitação e aplicação de testes. A equipe prevê testes unitários automatizados para módulos críticos e testes funcionais manuais para as demais funcionalidades, conforme o plano de testes.
- **Validação com o cliente:** apresentação de funcionalidades ou incrementos ao treinador e, quando pertinente, aos atletas, para avaliar a aderência à rotina de treino. As sessões de validação devem ser combinadas de acordo com a disponibilidade dos participantes e registradas em [Reuniões](reunioes.md).

#### Organização e Atualização

- **Acompanhamento do desenvolvimento no GitHub Projects:** durante a construção, as histórias de usuário e tarefas são registradas como Issues e organizadas no GitHub Projects, que apoia o acompanhamento de status, responsáveis, prioridades e impedimentos. Quando aplicável, as Issues são vinculadas a branches, PRs e testes por meio de referências e links, mantendo a rastreabilidade entre requisitos e implementação.

---

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

A rastreabilidade proposta relaciona as necessidades do negócio aos artefatos de especificação, construção e validação:

**Problema → Objetivo Específico (OE) → Característica do Produto (CP) → RF/RNF e Regra de Negócio (RN) → História de Usuário (US) → Protótipo Navegável (Figma) → Issue no GitHub Projects → Código/PR → Teste → Feedback/Evidência ([Reuniões](reunioes.md))**

Essa cadeia depende da manutenção dos vínculos entre os artefatos, por meio de referências e links. A ferramenta, por si só, não garante rastreabilidade automática.

### Mapeamento das atividades de ER às fases do RAD

| Fase do RAD | Momento do ciclo | Atividade de ER / Processo | Técnica ou prática | Resultado esperado / Evidência |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento de Requisitos** | Início do projeto e definição do escopo | Elicitação e Descoberta | Entrevista com o stakeholder ([17/09](atas/2026-09-17-lucas.md)), [brainstorming](reunioes.md#reuniao-de-alinhamento-com-o-brainstorm) e [análise documental](reunioes.md#analise-documental-ficha-atleta) (Samsung Notes, Word, caderno e planilhas) | Rotina de treino compreendida, regras extraídas dos registros reais e dificuldades identificadas. |
| **Planejamento de Requisitos** | Definição do escopo | Análise e Consenso | Matriz Valor × Esforço, análise de custo-benefício, MoSCoW e negociação de escopo ([26/09](atas/2026-09-26-lucas.md)) | MVP e prioridades definidos com base nas necessidades identificadas. |
| **Planejamento de Requisitos** | Definição do escopo | Declaração de Requisitos | Documento de Visão e especificação de RFs, RNFs e RNs ([catálogo](requisitos.md)) | Objetivos, restrições, regras de domínio e requisitos documentados. |
| **Planejamento de Requisitos** | Definição do escopo | Verificação e Validação | Validação do escopo com treinador, revisão por pares ([28/09](atas/2026-09-28-equipe.md), [05/10](atas/2026-10-05-equipe.md)) e validação dos RNFs com o cliente | Escopo alinhado, conflitos em revisão e RNFs validados com o cliente (ata a ser vinculada em [Reuniões](reunioes.md)). |
| **Planejamento de Requisitos** | Organização dos artefatos | Organização e Atualização | MVP, MoSCoW, matriz Valor × Esforço, matriz de rastreabilidade e quadro visual no Miro | Escopo organizado visualmente e relações entre problemas, objetivos e requisitos registradas. |
| **Design do Usuário** | Refinamento antes e durante a construção | Elicitação e Descoberta | [Análise de tarefas](reunioes.md#analise-de-tarefas-cenario-atual) (passos, decisões, dificuldades e exceções), entrevistas e cocriação ([08/10](atas/2026-10-08-lucas.md)) | Fluxos operacionais de treinador e atletas mapeados e necessidades de interface identificadas. |
| **Design do Usuário** | Especificação da solução | Declaração e Representação | [Protótipo navegável de alta fidelidade no Figma](https://www.figma.com/design/HJ5ukxYtbpQDmzD2OO7Jw3/Space-Jam?node-id=168-1123&t=A0Cp6Y2IzX1Yzgec-0) (adotado em substituição ao diagrama formal de interação, ver [evidência](reunioes.md#prototipo-alta-fidelidade-navegavel)), matriz de permissões (em elaboração), modelo conceitual de dados (atrasado), US, critérios de aceitação e DoR | Fluxos de navegação interativos concluídos e especificações de histórias prontas; matriz de permissões e modelo de dados em conclusão. |
| **Design do Usuário** | Refinamento do escopo | Análise e Consenso | Revisão das prioridades MoSCoW | Prioridades revistas de acordo com as necessidades e o feedback recebido. |
| **Design do Usuário** | Avaliação da solução proposta | Verificação e Validação | Avaliação dos [protótipos navegáveis](reunioes.md#validacao-do-prototipo-inicial) com treinador e validação com atletas programada para a próxima semana | Ajustes identificados com o treinador e validação de usabilidade agendada com os atletas. |
| **Design do Usuário** | Organização dos artefatos | Organização e Atualização | Atualização da matriz de rastreabilidade e do quadro visual no Miro | Relações entre requisitos, histórias e protótipos mantidas nos artefatos. |
| **Construção** | Ciclos de desenvolvimento | Representação | Refinamento de modelos de dados, critérios de aceitação e telas navegáveis para o incremento | Modelos e especificações detalhados para orientar a codificação do incremento. |
| **Construção** | Ciclos de desenvolvimento | Construção do Produto *(atividade RAD)* | Desenvolvimento incremental de frontend e backend a partir dos artefatos especificados | Funcionalidades implementadas de forma incremental. |
| **Construção** | Revisão e testes | Verificação e Validação | Revisão por pares, PRs, conferência dos critérios de aceitação e testes automatizados ou manuais | Implementação verificada em relação aos requisitos e critérios de aceitação. |
| **Construção** | Avaliação dos incrementos | Verificação e Validação | Demonstração e coleta de feedback do treinador e dos atletas, conforme disponibilidade ([Reuniões](reunioes.md)) | Necessidades de ajuste identificadas a partir da avaliação das funcionalidades. |
| **Construção** | Acompanhamento das tarefas | Organização e Atualização | GitHub Projects, Issues e links para PRs e testes | Status, responsáveis e relações entre requisitos e implementação acompanhados. |
| **Cutover** | Preparação da versão para entrega | Verificação e Validação | Testes de aceitação e homologação com o cliente e atletas | Evidências de aceitação e validação de usabilidade registradas em [Reuniões](reunioes.md). |
| **Cutover** | Preparação da entrega | Declaração de Requisitos | Notas de versão e orientações de uso | Documentação correspondente à versão disponibilizada. |
| **Cutover** | Fechamento e planejamento futuro | Organização e Atualização | Atualização do GitHub Projects e registro de demandas futuras | Itens concluídos e melhorias pendentes identificados. |

---

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | :---: | :---: | :--- | :--- |
    | 14/11/2026 | 1.4 | Atualização do link do protótipo navegável de alta fidelidade (node 168-1123) e explicitação da justificativa de substituição do diagrama formal de interação pelo fluxo navegável em `reunioes.md` e na Seção 5. | Guilherme Ferreira Mendes |
    | 14/11/2026 | 1.3 | Separação conceitual entre Representação (modelos) e Construção do Produto na fase de Construção; vinculação das evidências de Análise Documental e Análise de Tarefas em `reunioes.md`; atualização do status dos fluxos de interação (cobertos pelo protótipo navegável no Figma), matriz de permissões (em elaboração), modelo conceitual de dados (atrasado), validação dos RNFs e agendamento da validação com atletas. | Guilherme Ferreira Mendes |
    | 12/10/2026 | 1.2 | Atualização da seção 5 com a organização dos artefatos de requisitos no Miro e o acompanhamento do desenvolvimento no GitHub Projects, sem adoção formal do framework Kanban; padronização de "Cutover" e de CP (Característica do Produto); inclusão da Issue na cadeia de rastreabilidade; descrição da matriz Valor × Esforço conforme a Seção 10. | Guilherme Ferreira Mendes |
    | 06/10/2026 | 1.1 | Ajuste conceitual do DoR, inclusão da dimensão temporal na tabela e explicitação da cadeia de rastreabilidade. | Guilherme Ferreira Mendes |
    | 17/09/2026 | 1.0 | Reestruturação do tópico 5 alinhada às quatro fases do RAD. | Guilherme Ferreira Mendes |
    | 08/09/2026 | 0.3 | Reorganização da seção 5.1 conforme as atividades de Engenharia de Requisitos. | Guilherme Ferreira Mendes |
    | 07/09/2026 | 0.2 | Correção do histórico de versões. | Guilherme Ferreira Mendes |
    | 07/09/2026 | 0.1 | Estruturação inicial do tópico 5 — Engenharia de Requisitos. | Guilherme Ferreira Mendes |