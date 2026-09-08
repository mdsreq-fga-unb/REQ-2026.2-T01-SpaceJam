# 5. ENGENHARIA DE REQUISITOS

## 5.1 Atividades e Técnicas de ER

### Elicitação e Descoberta
* **Entrevistas com Cliente:** Conversas semiestruturadas com o treinador para mapear a rotina de treinos, fichas de avaliação física e dores no acompanhamento dos atletas.
* **Brainstorming:** Sessões entre a equipe de desenvolvimento para discutir ideias sobre a biblioteca de exercícios, visualização de progresso e envio de vídeos.
* **Análise Documental:** Avaliação dos documentos do Samsung Notes, Word e manuscritos que o treinador usa para fazer o histórico dos alunos.
* **Análise de Tarefas:** Mapeamento do fluxo de navegação para identificar como o treinador e os atletas realizarão suas ações no aplicativo.

### Análise e Consenso
* **Matriz Valor x Esforço:** Avaliação do valor de negócio para o treinador frente ao esforço técnico de implementação.
* **Priorização MoSCoW:** Técnica aplicada em conjunto com a Matriz Valor x Esforço para categorizar os requisitos em *Must have*, *Should have*, *Could have* e *Won't have*, delimitando a linha de corte do MVP.
* **Análise de Custo/Benefício:** Avaliação do impacto de funcionalidades complexas frente ao prazo semestral do projeto.
* **Discussões em Equipe e Estimativa de Viabilidade:** Reuniões técnicas para analisar dependências de arquitetura e validar a capacidade de entrega.

### Declaração de Requisitos
* **Documento de Visão:** Registro formal dos Objetivos Específicos (OEs) e da proposta do produto.
* **Temas e Épicos:** Estruturação dos requisitos em grandes blocos funcionais usando a linguagem do basquete e do treinamento esportivo.
* **User Stories (INVEST):** Decomposição estruturada dos requisitos em Histórias de Usuário descritas no formato de valor.
* **Critérios de Aceitação:** Especificação detalhada das regras de negócio de cada história usando formatos verificáveis (*Dado/Quando/Então*).

### Representação de Requisitos
* **Prototipagem no Figma:** Criação de wireframes e mockups de alta e baixa fidelidade para validar os fluxos das telas antes da implementação do código.

### Verificação e Validação de Requisitos
* **Checklists de Qualidade de Requisitos (DoR):** Verificação técnica aplicada para inspecionar clareza, testabilidade e completude das histórias antes da admissão na Sprint.
* **Demonstração e Teste com Usuário Real (Prototype Walkthrough):** Apresentação do incremento funcional diretamente ao treinador Lucas Cordeiro para navegação e coleta de feedback imediato.
* **Análise de Causas e Discussões em Grupo:** Identificação de falhas de comunicação, ambiguidades ou gargalos na definição e validação dos requisitos durante a Retrospectiva.

### Organização e Atualização de Requisitos
* **Grooming do Backlog:** Refinamento e reordenamento contínuo do Product Backlog antes e durante os ciclos.
* **Gestão Visual no GitHub Projects:** Acompanhamento diário da movimentação de histórias e tarefas técnicas para mitigar bloqueios e manter a rastreabilidade.
* **Ajuste no Processo de ER:** Atualização das práticas da equipe para melhorar a escrita de critérios de aceite e o alinhamento de expectativas a partir do feedback.

---

## 5.2 Engenharia de Requisitos no Processo Scrum + RAD

| Fases do Processo | Atividades da ER | Prática | Técnica | Resultados Esperados |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento da Release** | Elicitação e Descoberta | Levantamento de Requisitos | Entrevistas, Brainstorming, Análise Documental | Compreensão da rotina do treinador e identificação dos requisitos de alto nível. |
| | Análise e Consenso | Priorização de Requisitos | Matriz Valor x Esforço, Priorização MoSCoW | Escopo do MVP definido e aprovado com o cliente. |
| | Declaração | Registro de Requisitos | Documento de Visão, Temas e Épicos | Visão macro e estrutura do Backlog Geral alinhadas. |
| **Planejamento da Sprint** | Elicitação e Descoberta | Refinamento de Requisitos | Entrevistas de Detalhamento, Análise de Tarefas | Regras de negócio e fluxos detalhados para a Sprint. |
| | Análise e Consenso | Análise de Viabilidade | Discussões em Equipe | Consenso sobre dependências técnicas e capacidade da Sprint. |
| | Declaração | Definição de Histórias | User Stories (INVEST), Critérios de Aceitação | Histórias prontas para desenvolvimento com aceite claro. |
| | Organização e Atualização | Refinamento | Grooming do Backlog | Backlog da Sprint preparado e alinhado. |
| **Execução da Sprint** | Representação | Criação de Protótipos | Prototipagem no Figma (Wireframes/Mockups) | Telas e fluxos visuais validados antes da implementação. |
| | Verificação e Validação | Verificação Técnica | Checklists de Qualidade (DoR) | Garantia de clareza, testabilidade e aderência aos critérios de aceite. |
| | Organização e Atualização | Rastreabilidade | Gestão Visual no GitHub Projects | Fluxo de trabalho transparente e sem bloqueios. |
| **Revisão da Sprint** | Verificação e Validação | Demonstração ao Cliente | Prototype Walkthrough, Teste com Usuário | Incremento testado pelo treinador e feedback coletado. |
| | Análise e Consenso | Negociação de Escopo | Análise do Feedback | Definição de alterações a serem incorporadas ou reallocadas. |
| | Organização e Atualização | Atualização de Requisitos | Ajuste de User Stories e Backlog | Backlog Geral reordenado com base no uso real. |
| **Retrospectiva** | Análise e Consenso | Análise do Processo | Discussões em Grupo, Análise de Causas | Melhorias identificadas na condução da ER. |
| | Organização e Atualização | Evolução Metodológica | Ajustes no Workflow de ER | Processo de requisitos ajustado para o próximo ciclo. |

## Histórico de Versão

| Data | Versão | Descrição | Autor |
| --- | --- | --- | --- |
| 08/09/2026 | 0.3 | Reestruturação da Seção 5.1 agrupando técnicas pelas 6 Atividades da ER para eliminar duplicidade com o fluxo do Scrum. | Guilherme Ferreira Mendes |
| 07/09/2026 | 0.2 | Correção do histórico de versão. | Guilherme Ferreira Mendes |
| 07/09/2026 | 0.1 | Estruturação inicial do Tópico 5 (Engenharia de Requisitos) e mapeamento das 6 atividades da ER. | Guilherme Ferreira Mendes |