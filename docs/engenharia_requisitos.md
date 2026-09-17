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
* **Matriz Valor x Esforço e Análise de Custo-Benefício:** Avaliação conjunta do valor de negócio gerado para o treinador em relação ao esforço técnico de implementação.
* **Priorização MoSCoW:** Técnica de priorização qualitativa para classificar as necessidades em *Must have*, *Should have*, *Could have* e *Won't have*, delimitando o escopo inicial do MVP.
* **Negociação de Escopo com o Cliente:** Sessões de pactuação entre a equipe e o treinador para alinhamento de expectativas e limites operacionais.

#### Declaração de Requisitos
* **Documento de Visão:** Registro formal dos Objetivos Específicos (OEs), restrições de negócio, requisitos macro e características gerais do produto Space Jam.
* **Especificação de Requisitos Funcionais e Não-Funcionais:** Declaração explícita dos RFs e RNFs (privacidade, LGPD e segurança de dados de menores).

#### Verificação e Validação
* **Validação do Escopo com o Cliente:** Apresentação do escopo de alto nível junto ao treinador para confirmação de alinhamento antes do avanço para a fase de design.
* **Revisão em Pares:** Inspeção técnica interna realizada pela equipe para identificar ambiguidades, redundâncias ou inconsistências na documentação de requisitos.

#### Organização e Atualização
* **Construção da Matriz de Rastreabilidade Inicial:** Consolidação do escopo inicial de forma versionada e rastreável no GitHub Projects, vinculando os problemas mapeados aos Objetivos Específicos e RFs/RNFs.

---

### Design do Usuário

#### Elicitação e Descoberta
* **Análise de Tarefas:** Mapeamento de como o treinador e os atletas realizam atualmente suas atividades práticas, examinando seus objetivos, decisões e dificuldades.
* **Entrevista e Co-criação:** Encontros frequentes com o treinador para definir fluxos operacionais, visualizar telas e descobrir exceções à medida que a interface toma forma.

#### Declaração e Representação
* **Prototipação no Figma:** Concepção e evolução de telas e componentes interativos de alta e baixa fidelidade no Figma.
* **Modelagem Complementar de Requisitos:** Diagramação de modelos de fluxos de interação, matriz de permissões/acesso e modelo conceitual de dados.
* **Histórias de Usuário e Critérios de Aceitação:** Especificação formal do comportamento do sistema através de Histórias de Usuário (INVEST) acompanhadas de critérios de aceitação no formato *Dado/Quando/Então*.

#### Análise e Consenso
* **Repriorização MoSCoW:** Ajuste dinâmico das prioridades do escopo conforme o feedback visual do cliente nas sessões de design.

#### Verificação e Validação
* **Validação dos Protótipos e Fluxos:** Homologação visual e funcional conduzida junto ao treinador (visão de negócio) e atletas (usabilidade e clareza visual), servindo os protótipos como especificação validada.

#### Organização e Atualização
* **Refinamento Contínuo e Rastreabilidade:** Atualização constante do backlog e manutenção dos vínculos entre as telas do Figma, modelos e os itens no GitHub Projects.

---

### Construção

#### Representação
* **Evolução dos Protótipos Validados:** Evolução dos protótipos e especificações aprovadas na fase de design em código e incrementos funcionais.

#### Verificação e Validação
* **Verificação Interna (Checklists e Testes):** Inspeção técnica conduzida pela equipe por meio de checklists (DoR/DoD), revisão por pares (Pull Requests) e testes unitários automatizados aplicados prioritariamente aos módulos críticos (regras de negócio sensíveis, LGPD e permissões de acesso). As demais funcionalidades são verificadas através de testes funcionais manuais orientados aos critérios de aceitação.
* **Validação com o Cliente (Demonstração do Incremento):** Demonstrações periódicas dos incrementos funcionais para o treinador Lucas Cordeiro, validando a aplicação frente à rotina real.

#### Organização e Atualização
* **Gestão Visual e Rastreabilidade de Código:** Acompanhamento dinâmico no quadro do GitHub Projects, mantendo a rastreabilidade entre requisitos, branches de código, testes e commits.

---

### Cutover

#### Verificação e Validação
* **Homologação Final com o Cliente e Testes de Aceitação:** Utilização do sistema em ambiente real pelo treinador e seus atletas, atestando a aderência plena da solução às atividades de treino.

#### Declaração de Requisitos
* **Notas de Versão e Documentação de Entrega:** Elaboração de documentação técnica (*release notes*) e orientações de uso para o treinador.

#### Organização e Atualização
* **Encerramento da Linha de Base:** Fechamento do escopo final implementado no GitHub Projects, formalizando a versão entregue e registrando demandas futuras.

---

## 5.2 Mapeamento ER x Processo

O quadro a seguir relaciona cada fase do processo RAD adotado à atividade de Engenharia de Requisitos correspondente, à técnica aplicada e ao resultado esperado. O mapeamento diferencia explicitamente a **verificação interna** (feita pela equipe contra os critérios de aceitação e testes) da **validação com o cliente** (homologação junto ao treinador e atletas).

| Fase do Processo (RAD) | Atividade de ER | Técnica | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **Planejamento de Requisitos** | Elicitação e Descoberta | Entrevista com o stakeholder, Brainstorming interno e Análise Documental | Rotina de treino e acompanhamento atual compreendidos; dores e oportunidades levantadas. |
| **Planejamento de Requisitos** | Análise e Consenso | Matriz Valor x Esforço, Custo-Benefício, Priorização MoSCoW e Negociação | Escopo inicial do MVP delimitado e funcionalidades de maior valor pactuadas. |
| **Planejamento de Requisitos** | Declaração de Requisitos | Documento de Visão e Especificação de RFs/RNFs | OEs, restrições e requisitos macro (incluindo LGPD) formalizados. |
| **Planejamento de Requisitos** | Verificação e Validação | Validação do escopo com o cliente e Revisão em Pares | Escopo de alto nível validado e documentação sem ambiguidades. |
| **Planejamento de Requisitos** | Organização e Atualização | Matriz de Rastreabilidade inicial e estruturação no GitHub Projects | Escopo inicial versionado e rastreável. |
| **Design do Usuário** | Elicitação e Descoberta | Análise de Tarefas e Entrevistas de Co-criação | Fluxos atuais mapeados e regras de negócio descobertas com a interface. |
| **Design do Usuário** | Declaração e Representação | Prototipação no Figma, Modelos (Permissões, Dados, Estados) e User Stories com Critérios de Aceitação | Interface e arquitetura de informação especificadas com critérios verificáveis. |
| **Design do Usuário** | Análise e Consenso | Repriorização MoSCoW | Escopo ajustado conforme o feedback visual do cliente. |
| **Design do Usuário** | Verificação e Validação | Validação dos protótipos e fluxos com treinador e atletas | Protótipos validados que servem como especificação funcional. |
| **Design do Usuário** | Organização e Atualização | Refinamento contínuo e Rastreabilidade no GitHub Projects | Rastreabilidade entre telas do Figma, modelos e requisitos mantida. |
| **Construção** | Representação | Evolução dos protótipos validados em código | Funcionalidades construídas a partir das telas aprovadas. |
| **Construção** | Verificação e Validação |Verificação interna: checklists (DoR/DoD), testes unitários prioritários (módulos críticos/LGPD), testes funcionais manuais e revisão por pares | Incrementos verificados internamente contra os critérios de aceitação e integridade das regras de negócio/privacidade. |
| **Construção** | Verificação e Validação | Validação com o cliente: demonstração do incremento | Incrementos validados pelo treinador frente à rotina real de treinos. |
| **Construção** | Organização e Atualização | Gestão visual e rastreabilidade no GitHub Projects | Impedimentos mitigados e código rastreado até o requisito correspondente. |
| **Cutover** | Verificação e Validação | Homologação final com o cliente e testes de aceitação | MVP homologado e testado em uso real. |
| **Cutover** | Declaração de Requisitos | Notas de versão (*release notes*) e manual de uso | Documentação técnica e guia de entrega consolidados. |
| **Cutover** | Organização e Atualização | Encerramento do backlog e consolidação da linha de base no GitHub Projects | Linha de base entregue formalizada e demandas futuras registradas. |

---

## Histórico de Revisão

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| 17/09/2026 | 1.0 | Reestruturação completa do Tópico 5 alinhado às 4 Macrofases do RAD (Ref #6). | Guilherme Ferreira Mendes |
| 08/09/2026 | 0.3 | Reestruturação da Seção 5.1 agrupando técnicas pelas 6 Atividades da ER. | Guilherme Ferreira Mendes |
| 07/09/2026 | 0.2 | Correção do histórico de versão. | Guilherme Ferreira Mendes |
| 07/09/2026 | 0.1 | Estruturação inicial do Tópico 5 (Engenharia de Requisitos). | Guilherme Ferreira Mendes |


