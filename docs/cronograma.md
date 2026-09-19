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

---

## 2. Cronograma de Sprints e Fases RAD (07/09/2026 a 08/12/2026)

| Ciclo | Início | Fim | Fases RAD do Ciclo | Objetivo Principal | Entregas Esperadas (Incremento Funcional) | Validação com o Cliente (Treinador) |
|---|---|---|---|---|---|---|
| C1 | 07/09/2026 | 13/09/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Fundação e Autenticação | Setup do ambiente, modelagem inicial do banco de dados e fluxo de autenticação (login para Treinador e Atleta). | Validação do fluxo de telas e testes nos wireframes navegáveis de login. |
| C2 | 14/09/2026 | 20/09/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Gestão e Cadastro de Atletas | Módulo de cadastro e perfil esportivo/clínico dos atletas da equipe. | Demonstração do fluxo de cadastro e listagem de atletas com o treinador. |
| C3 | 21/09/2026 | 27/09/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Avaliação e Testes Físicos | Registro, histórico de métricas corporais e desempenho em testes físicos. | Validação das fichas e relatórios de avaliação física preenchidos. |
| C4 | 28/09/2026 | 04/10/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Catálogo de Exercícios | Biblioteca central de exercícios categorizada por grupo muscular e instruções técnicas. | Teste de busca, filtros e usabilidade do catálogo de exercícios. |
| C5 | 05/10/2026 | 11/10/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Prescrição de Treinos | Montagem de fichas e rotinas de treino associando atletas aos exercícios da biblioteca. | Simulação de montagem e atribuição de rotina de treino pelo treinador. |
| C6 | 12/10/2026 | 18/10/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Execução pelo Atleta | Interface do atleta para visualização das rotinas prescritas e marcação de exercícios/séries concluídos. | Validação da experiência de uso do atleta no registro de execução de treinos. |
| C7 | 19/10/2026 | 25/10/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Upload de Vídeos de Execução | Módulo para upload de vídeos curtos de movimentos esportivos para análise técnica. | Teste de gravação/envio de vídeo pelo atleta e reprodução na visão do treinador. |
| C8 | 26/10/2026 | 01/11/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Módulo de Feedback Técnico | Painel do treinador com ferramentas para registrar notas, comentários e correções nos vídeos. | Validação do fluxo completo: vídeo enviado pelo atleta com retorno do treinador. |
| C9 | 02/11/2026 | 08/11/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Dashboard de Evolução | Gráficos e indicadores visuais consolidando assiduidade, evolução nos testes e histórico de treinos. | Avaliação do painel analítico para suporte à tomada de decisão do treinador. |
| C10 | 09/11/2026 | 15/11/2026 | Planejamento de Requisitos → Design com o Usuário → Construção | Privacidade e LGPD | Mecanismos de consentimento, segurança de dados sensíveis e controle de visibilidade das mídias. | Revisão das diretrizes regulatórias e termos de privacidade com os stakeholders. |
| C11 | 16/11/2026 | 22/11/2026 | Design com o Usuário → Construção → Cutover (Homologação) | Testes Integrados e Aceite | Testes ponta a ponta, carga e usabilidade em ambiente de homologação (staging). | Homologação formal assistida com o treinador simulando rotinas reais de uso. |
| C12 | 23/11/2026 | 08/12/2026 | Cutover (Deploy & Release) | Lançamento Final e Apresentação | Deploy em produção do MVP, monitoramento pós-deploy e validação dos resultados com a banca/cliente. | Avaliação da operação real em produção, coleta de feedback e encerramento do semestre. |

Observação: a partir do C11, a fase de Cutover passa a se sobrepor às demais, já que a homologação e o deploy final são preparados de forma incremental a partir dos ciclos anteriores — não como um bloco isolado e desconectado do restante do cronograma

---

## 3. Dinâmica de Validação e Envolvimento do Stakeholder

* **Validação Antecipada via Prototipagem (RAD):** No início de cada Sprint, são apresentados wireframes e protótipos de tela diretamente ao treinador (cliente) para garantir o atendimento às expectativas de negócio antes do esforço de codificação (Validação Externa: "construir o produto correto").
* **Sessões de Design com o Usuário:** ao final de cada ciclo, é realizada uma sessão de demonstração do incremento funcional construído, com participação direta do treinador, permitindo ajustar o escopo do próximo ciclo com base no feedback real de uso — sem depender de um framework de gerenciamento externo ao próprio RAD.