# 5. ENGENHARIA DE REQUISITOS

No projeto **Space Jam**, o ciclo da Engenharia de Requisitos (ER) foi operacionalizado de forma integrada às quatro etapas do modelo *Rapid Application Development* (RAD): **Planejamento de Requisitos**, **Design do Usuário**, **Construção** e **Transição (Cutover)**. Essa abordagem assegura a execução contínua e iterativa das seis atividades fundamentais da ER — **Elicitação e Descoberta**, **Análise e Consenso**, **Declaração**, **Representação**, **Verificação e Validação** e **Organização e Atualização**. O eixo central desse fluxo baseia-se na criação ágil de protótipos e na validação constante dos fluxos de treino junto ao treinador Lucas Cordeiro e aos atletas.

---

## 5.1 Atividades e Técnicas de ER

Abaixo estão detalhadas as atividades e técnicas de Engenharia de Requisitos adotadas pela equipe, categorizadas pelas quatro fases do processo RAD.

---

### Planejamento de Requisitos

#### Elicitação e Descoberta
* **Entrevista com o Stakeholder:** Entrevista aberta e semiestruturada com o treinador Lucas Cordeiro para compreender o funcionamento do acompanhamento de quadra, a rotina de treinos e levantar dores e oportunidades de melhoria.
* **Brainstorming Interno:** Reuniões com a equipe de desenvolvimento para levantar hipóteses de solução para a biblioteca de exercícios e acompanhamento de métricas, cujas ideias passam por validação posterior com o cliente.
* **Análise Documental:** Avaliação minuciosa dos artefatos em uso pelo treinador (fichas manuais, anotações no Samsung Notes e planilhas).

#### Análise e Consenso
* **Matriz Valor x Esforço e Análise de Custo-Benefício:** Avaliação conjunta do valor de negócio gerado para o treinador e para os atletas em relação ao esforço técnico de implementação.
* **Priorização MoSCoW:** Técnica de priorização qualitativa para classificar as necessidades em *Must have*, *Should have*, *Could have* e *Won't have*, delimitando o escopo inicial do MVP.
* **Negociação de Escopo com o Cliente:** Sessões de pactuação entre a equipe, o treinador e os atletas para alinhamento de expectativas, usabilidade e limites operacionais.

#### Declaração de Requisitos
* **Documento de Visão:** Registro formal dos Objetivos Específicos (OEs), restrições de negócio, requisitos macro e características gerais do produto Space Jam.
* **Especificação de Requisitos Funcionais e Não-Funcionais:** Declaração explícita dos RFs e RNFs (privacidade, LGPD e segurança de dados de menores).

#### Verificação e Validação
* **Validação do Escopo com o Cliente:** Apresentação do escopo de alto nível junto ao treinador e atletas para confirmação de alinhamento antes do avanço para a fase de design.
* **Revisão em Pares:** Inspeção técnica interna realizada pela equipe para identificar ambiguidades, redundâncias ou inconsistências na documentação de requisitos.

#### Organização e Atualização
* **Construção da Matriz de Rastreabilidade Inicial:** Consolidação do escopo inicial de forma versionada no GitHub Projects, estabelecendo o elo primário entre problemas, Objetivos Específicos e RFs/RNFs.

---

### Design do Usuário

#### Elicitação e Descoberta
* **Análise de Tarefas:** Mapeamento de como o treinador e os atletas realizam atualmente suas atividades práticas, examinando seus objetivos, decisões e dificuldades.
* **Entrevista e Co-criação:** Encontros frequentes com o treinador e atletas para definir fluxos operacionais, visualizar telas e descobrir exceções à medida que a interface toma forma.

#### Declaração e Representação
* **Prototipação no Figma:** Concepção e evolução de telas e componentes interativos de alta e baixa fidelidade no Figma.
* **Modelagem Complementar de Requisitos:** Diagramação de modelos de fluxos de interação, matriz de permissões/acesso e modelo conceitual de dados.
* **Histórias de Usuário e Critérios de Aceitação:** Especificação formal do comportamento do sistema através de Histórias de Usuário (INVEST) acompanhadas de critérios de aceitação no formato *Dado/Quando/Então*.
* **Definição do Definition of Ready (DoR):** Estabelecimento do DoR como critério de entrada e acordo de prontidão. O DoR garante que uma História de Usuário possui requisitos declarados, modelos e critérios de aceite suficientes para iniciar a fase de Construção, não devendo ser confundido com a atividade de verificação interna.

#### Análise e Consenso
* **Repriorização MoSCoW:** Ajuste dinâmico das prioridades do escopo conforme o feedback visual e de usabilidade fornecido pelo treinador e pelos atletas nas sessões de design.

#### Verificação e Validação
* **Validação dos Protótipos e Fluxos:** Homologação visual e funcional conduzida junto ao treinador (visão de negócio) e atletas (usabilidade e clareza visual), servindo os protótipos como especificação validada.

#### Organização e Atualização
* **Refinamento Contínuo e Rastreabilidade:** Atualização constante do backlog e manutenção dos vínculos entre as telas do Figma, modelos e os itens no GitHub Projects.

---

### Construção

#### Representação
* **Evolução dos Protótipos Validados:** Evolução dos protótipos e especificações aprovadas na fase de design em código e incrementos funcionais.

#### Verificação e Validação
* **Verificação Interna (Revisão Técnica, Checklists e Testes):** Inspeção técnica conduzida pela equipe por meio de revisão por pares (*Pull Requests*), auditoria de código contra os critérios de aceitação da história (DoD) e testes unitários automatizados aplicados aos módulos críticos (LGPD e regras de negócio). As demais funcionalidades são verificadas através de testes funcionais manuais orientados aos critérios de aceite.
* **Validação com o Cliente (Demonstração do Incremento):** Demonstrações periódicas dos incrementos funcionais para o treinador Lucas Cordeiro e atletas, validando a aplicação frente à rotina real.

#### Organização e Atualização
* **Gestão Visual e Rastreabilidade de Código:** Acompanhamento dinâmico no quadro do GitHub Projects, mantendo a rastreabilidade entre requisitos, branches de código, testes e commits.

---

### Cutover

#### Verificação e Validação
* **Homologação Final com o Cliente e Testes de Aceitação:** Utilização do sistema em ambiente real pelo treinador e seus atletas, atestando a aderência plena da solução às atividades de treino.

#### Declaração de Requisitos
* **Notas de Versão e Documentação de Entrega:** Elaboração de documentação técnica (*release notes*) e orientações de uso para o treinador e atletas.

#### Organização e Atualização
* **Encerramento da Linha de Base:** Fechamento do escopo final implementado no GitHub Projects, formalizando a versão entregue e registrando demandas futuras.

---

## 5.2 Estrutura do Processo de ER (Dimensão Temporal e Atividades)

O processo de Engenharia de Requisitos no Space Jam é estruturado em duas dimensões complementares: a **dimensão temporal (fases do ciclo de vida RAD)** e a **dimensão funcional (atividades fundamentais de ER)**. 

### Cadeia Integrada de Rastreabilidade
A governança dos requisitos assegura a rastreabilidade ponta a ponta ao longo de todo o ciclo de desenvolvimento através da seguinte cadeia contínua:

$$\text{Problema} \longrightarrow \text{Objetivo Específico (OE)} \longrightarrow \text{Cenário do Problema (CP)} \longrightarrow \text{RF / RNF} \longrightarrow \text{História de Usuário (US)} \longrightarrow \text{Protótipo (Figma)} \longrightarrow \text{Código (PR)} \longrightarrow \text{Teste} \longrightarrow \text{Feedback}$$

### Mapeamento ER x Processo RAD

| Fase do Processo (RAD) | Momento do Ciclo | Atividade de ER | Técnica / Prática | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento de Requisitos** | Início do Projeto / Definição de Escopo | Elicitação e Descoberta | Entrevista com o stakeholder, Brainstorming interno e Análise Documental | Rotina de treino e acompanhamento atual compreendidos; dores e oportunidades levantadas. |
| **Planejamento de Requisitos** | Início do Projeto / Definição de Escopo | Análise e Consenso | Matriz Valor x Esforço, Custo-Benefício, Priorização MoSCoW e Negociação com Treinador e Atletas | Escopo inicial do MVP delimitado e funcionalidades de maior valor pactuadas com todas as partes. |
| **Planejamento de Requisitos** | Início do Projeto / Definição de Escopo | Declaração de Requisitos | Documento de Visão e Especificação de RFs/RNFs | OEs, restrições e requisitos macro (incluindo LGPD) formalizados. |
| **Planejamento de Requisitos** | Início do Projeto / Definição de Escopo | Verificação e Validação | Validação do escopo com o cliente (treinador e atletas) e Revisão em Pares | Escopo de alto nível validado e documentação inicial sem ambiguidades. |
| **Planejamento de Requisitos** | Início do Projeto / Definição de Escopo | Organização e Atualização | Matriz de Rastreabilidade inicial e estruturação no GitHub Projects | Escopo inicial versionado e elo inicial (Problema $\rightarrow$ OE $\rightarrow$ RF) estabelecido. |
| **Design do Usuário** | Iterativo / Pré-Desenvolvimento | Elicitação e Descoberta | Análise de Tarefas e Entrevistas de Co-criação com Treinador e Atletas | Fluxos operacionais mapeados e regras de negócio descobertas com a interface. |
| **Design do Usuário** | Iterativo / Pré-Desenvolvimento | Declaração e Representação | Prototipação no Figma, Modelos (Permissões, Dados, Estados), User Stories e Definição do DoR | Interface especificada, histórias refinadas com critérios de aceite e DoR configurado como critério de entrada. |
| **Design do Usuário** | Iterativo / Pré-Desenvolvimento | Análise e Consenso | Repriorização MoSCoW com Treinador e Atletas | Escopo ajustado conforme o feedback de usabilidade e visão de negócio. |
| **Design do Usuário** | Iterativo / Pré-Desenvolvimento | Verificação e Validação | Validação dos protótipos e fluxos com treinador e atletas | Protótipos validados que servem como especificação funcional aprovada. |
| **Design do Usuário** | Iterativo / Pré-Desenvolvimento | Organização e Atualização | Refinamento contínuo e Rastreabilidade no GitHub Projects | Rastreabilidade entre telas do Figma, histórias e requisitos mantida. |
| **Construção** | Iterativo / Sprints de Desenvolvimento | Representação | Evolução dos protótipos validados em código | Funcionalidades construídas no repositório a partir das especificações aprovadas. |
| **Construção** | Iterativo / Sprints de Desenvolvimento | Verificação e Validação | Verificação interna: revisão por pares (*Pull Requests*), checklists de DoD, testes unitários críticos e testes manuais | Incrementos de código verificados internamente contra os critérios de aceitação e regras de negócio/LGPD. |
| **Construção** | Iterativo / Sprints de Desenvolvimento | Verificação e Validação | Validação com o cliente: demonstração do incremento para treinador e atletas | Incrementos validados pelo treinador e atletas frente à rotina real de treinos. |
| **Construção** | Iterativo / Sprints de Desenvolvimento | Organização e Atualização | Gestão visual e rastreabilidade no GitHub Projects | Código, PRs, testes e commits rastreados até a história e requisito correspondentes. |
| **Cutover** | Final de Ciclo / Preparação para Release | Verificação e Validação | Homologação final com o cliente (treinador e atletas) e testes de aceitação | MVP homologado e testado em uso real de quadra. |
| **Cutover** | Final de Ciclo / Preparação para Release | Declaração de Requisitos | Notas de versão (*release notes*) e manual de uso | Documentação técnica e guia de entrega consolidados. |
| **Cutover** | Final de Ciclo / Preparação para Release | Organização e Atualização | Encerramento do backlog e consolidação da linha de base no GitHub Projects | Linha de base entregue formalizada, rastreabilidade completa auditável e demandas futuras registradas. |

---

??? abstract "Histórico de revisão"

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| 06/10/2026 | 1.1 | Ajuste conceitual do DoR (critério de entrada), inclusão da 2ª dimensão temporal na Tabela 5.2, formalização dos atletas em Análise e Consenso e inclusão da cadeia explícita de rastreabilidade (Issue #6). | Guilherme Ferreira Mendes |
| 17/09/2026 | 1.0 | Reestruturação completa do Tópico 5 alinhado às 4 Macrofases do RAD (Ref #6). | Guilherme Ferreira Mendes |
| 08/09/2026 | 0.3 | Reestruturação da Seção 5.1 agrupando técnicas pelas 6 Atividades da ER. | Guilherme Ferreira Mendes |
| 07/09/2026 | 0.2 | Correção do histórico de versão. | Guilherme Ferreira Mendes |
| 07/09/2026 | 0.1 | Estruturação inicial do Tópico 5 (Engenharia de Requisitos). | Guilherme Ferreira Mendes |
