# Cronograma do Projeto Space Jam

Este documento apresenta o cronograma operacional do projeto **Space Jam**, fundamentado nos conceitos de Engenharia de Requisitos descritos na obra 
*Requisitos de Software - Comunicação é tudo!* 

*OBS - O seguinte cronograma está sujeito a alterações, devido as necessidades do projeto* 

---

## 1. Identificação Metodológica

* **Projeto:** Space Jam
* **Período de Execução:** 07/09/2026 a 08/12/2026
* **Abordagem:** Híbrida / Ágil (equilíbrio entre prototipagem participativa e adaptabilidade contínua às mudanças)
* **Ciclo de Vida:** Iterativo e Incremental (desenvolvimento em ciclos sucessivos com entregas parciais de software funcional)
* **Processo:** RAD (*Rapid Application Development* - conduzido pelas etapas de Planejamento de Requisitos, Design com o Usuário, Construção e Cutover)
* **Framework de Gerenciamento:** SCRUM (governança em ciclos semanais com cerimônias de Planning, Daily, Review e Retrospective)

---

## 2. Cronograma de Sprints e Fases RAD (07/09/2026 a 08/12/2026)

| Sprint | Início | Fim | Macrofase RAD | Objetivo Principal | Entregas Esperadas (Incremento Funcional) | Validação com o Cliente (Treinador) |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **S1** | 07/09/2026 | 13/09/2026 | *Requirements Planning* | Fundação e Autenticação | Setup do ambiente, modelagem inicial do banco de dados e fluxo de autenticação (login para Treinador e Atleta). | Validação do fluxo de telas e testes nos wireframes navegáveis de login. |
| **S2** | 14/09/2026 | 20/09/2026 | *User Design & Construction* | Gestão e Cadastro de Atletas | Módulo de cadastro e perfil esportivo/clínico dos atletas da equipe. | Demonstração do fluxo de cadastro e listagem de atletas com o treinador. |
| **S3** | 21/09/2026 | 27/09/2026 | *User Design & Construction* | Avaliação e Testes Físicos | Registro, histórico de métricas corporais e desempenho em testes físicos. | Validação das fichas e relatórios de avaliação física preenchidos. |
| **S4** | 28/09/2026 | 04/10/2026 | *User Design & Construction* | Catálogo de Exercícios | Biblioteca central de exercícios categorizada por grupo muscular e instruções técnicas. | Teste de busca, filtros e usabilidade do catálogo de exercícios. |
| **S5** | 05/10/2026 | 11/10/2026 | *User Design & Construction* | Prescrição de Treinos | Montagem de fichas e rotinas de treino associando atletas aos exercícios da biblioteca. | Simulação de montagem e atribuição de rotina de treino pelo treinador. |
| **S6** | 12/10/2026 | 18/10/2026 | *User Design & Construction* | Execução pelo Atleta | Interface do atleta para visualização das rotinas prescritas e marcação de exercícios/séries concluídos. | Validação da experiência de uso do atleta no registro de execução de treinos. |
| **S7** | 19/10/2026 | 25/10/2026 | *User Design & Construction* | Upload de Vídeos de Execução | Módulo para upload e processamento de vídeos curtos de movimentos esportivos para análise técnica. | Teste de gravação/envio de vídeo pelo atleta e reprodução na visão do treinador. |
| **S8** | 26/10/2026 | 01/11/2026 | *User Design & Construction* | Módulo de Feedback Técnico | Painel do treinador com ferramentas para registrar notas, comentários e correções posturais nos vídeos. | Validação do fluxo completo: gravação enviada pelo atleta com retorno técnico do treinador. |
| **S9** | 02/11/2026 | 08/11/2026 | *User Design & Construction* | Dashboard de Evolução | Gráficos e indicadores visuais consolidando assiduidade, evolução nos testes e histórico de treinos. | Avaliação do painel analítico para suporte à tomada de decisão do treinador. |
| **S10** | 09/11/2026 | 15/11/2026 | *User Design & Construction* | Privacidade e LGPD | Mecanismos de consentimento, segurança de dados sensíveis e controle de visibilidade das mídias. | Revisão das diretrizes regulatórias e termos de privacidade com os stakeholders. |
| **S11** | 16/11/2026 | 22/11/2026 | *Cutover (Homologação)* | Testes Integrados e Aceite | Testes ponta a ponta, carga e usabilidade em ambiente de homologação (staging). | Homologação formal assistida com o treinador simulando rotinas reais de uso. |
| **S12** | 23/11/2026 | 08/12/2026 | *Cutover (Deploy & Release)* | Lançamento Final e Apresentação | Deploy em produção do MVP, monitoramento pós-deploy e validação dos resultados com a banca/cliente. | Avaliação da operação real em produção, coleta de feedback e encerramento do semestre. |

---

## 3. Dinâmica de Validação e Envolvimento do Stakeholder

* **Validação Antecipada via Prototipagem (RAD):** No início de cada Sprint, são apresentados wireframes e protótipos de tela diretamente ao treinador (cliente) para garantir o atendimento às expectativas de negócio antes do esforço de codificação (Validação Externa: "construir o produto correto").
* **Inspeção e Adaptação em Cerimônias (Scrum):** Demonstração do incremento potencialmente utilizável nas reuniões de *Sprint Review* ao final de cada ciclo, permitindo retroalimentar o *Product Backlog* com base no feedback real do usuário.