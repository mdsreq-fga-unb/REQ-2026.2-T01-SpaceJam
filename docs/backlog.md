## **10. Backlog**

A presente seção apresenta o Backlog do Produto da plataforma de acompanhamento esportivo, organizado a partir dos requisitos funcionais (RFs), requisitos não funcionais (RNFs) e regras de negócio (RN) elicitados e consolidados ao longo das atividades de Engenharia de Requisitos. Trata-se de uma lista sujeita a refinamentos durante o desenvolvimento, conforme o produto evolui e novos aprendizados emergem das interações com os usuários finais.

Esta versão da seção incorpora a priorização orientada a valor de negócio e risco técnico/esforço, alinhando a especificação às normativas de proteção de dados (LGPD) e à arquitetura baseada no isolamento rigoroso de informações (*multi-tenant*).

### **10.1 Backlog Geral**

#### 10.1.1 Catálogo Consolidado de Requisitos Funcionais

O catálogo a seguir consolida os requisitos funcionais (RFs) elicitados para a plataforma, organizados por Característica de Produto (CP) e com a respectiva classificação MoSCoW.

| ID | CP | Requisito Funcional (Nome / Descrição Resumida) | Ator Principal | MoSCoW |
| :--- | :--- | :--- | :--- | :--- |
| RF01101 | CP1 | **Cadastrar usuário:** Permitir o cadastro com dados pessoais, métricas físicas, objetivos e histórico clínico. | Treinador | Must Have |
| RF01102 | CP1 | **Logar usuário:** Permitir autenticação por apelido e senha, identificando o perfil (treinador/atleta). | Usuário | Must Have |
| RF01103 | CP1 | **Deslogar usuário:** Permitir o encerramento da sessão ativa do perfil. | Usuário | Must Have |
| RF01104 | CP1 | **Editar informações do perfil:** Permitir que o atleta edite dados pessoais básicos; dados clínicos restritos ao treinador. | Atleta / Trein. | Must Have |
| RF01105 | CP1 | **Excluir usuário:** Permitir a exclusão de um atleta desvinculado. | Treinador | Won't Have |
| RF01106 | CP1 | **Criar senha aleatória:** Gerar senha temporária automática para o primeiro acesso do usuário. | Sistema | Won't Have |
| RF01107 | CP1 | **Trocar senha:** Exigir e permitir a redefinição de senha com critérios de segurança (obrigatório no 1º acesso). | Usuário | Must Have |
| RF01208 | CP2 | **Consultar dificuldade:** Permitir que o treinador consulte as dificuldades registradas para os treinos. | Treinador | Should Have |
| RF01209 | CP2 | **Registrar dificuldade:** Permitir que o atleta avalie a dificuldade do exercício (escala 1 a 5). | Atleta | Must Have |
| RF01210 | CP2 | **Editar dificuldade:** Permitir que o atleta modifique a dificuldade registrada enquanto o treino estiver disponível. | Atleta | Must Have |
| RF01211 | CP2 | **Editar status exercícios:** Permitir ao treinador alterar o status ("Concluído", "A fazer", "Corrigir"). | Treinador | Should Have |
| RF01212 | CP2 | **Adicionar testes:** Acrescentar testes de aptidão física. | Treinador | Won't Have |
| RF01213 | CP2 | **Remover testes:** Excluir testes de aptidão física. | Treinador | Won't Have |
| RF02301 | CP3 | **Cadastrar planejamento:** Registrar o planejamento de treinamento de cada atleta. | Treinador | Must Have |
| RF02302 | CP3 | **Editar planejamento:** Alterar o planejamento de treinamento de cada atleta. | Treinador | Must Have |
| RF02303 | CP3 | **Associar treino a objetivo:** Vincular cada treino planejado aos objetivos macro do atleta. | Treinador | Could Have |
| RF02304 | CP3 | **Consultar histórico de planejamento:** Visualizar o histórico de alterações nos planejamentos de treinamento. | Treinador | Should Have |
| RF02305 | CP3 | **Comparar treinamentos:** Gerar relatório comparativo entre treinos planejados e realizados pelo atleta. | Treinador | Should Have |
| RF02306 | CP3 | **Consultar status de treino:** Identificar o estado do treino (não iniciado, em andamento, concluído). | Treinador | Must Have |
| RF02407 | CP4 | **Cadastrar exercício:** Cadastrar exercícios na biblioteca com objetivo, fundamento e orientações. | Treinador | Must Have |
| RF02408 | CP4 | **Filtrar exercícios por fundamento:** Filtrar a biblioteca de acordo com o fundamento esportivo. | Treinador | Could Have |
| RF02409 | CP4 | **Associar exercício a objetivo:** Vincular exercícios da biblioteca a objetivos de treinamento. | Treinador | Won't Have |
| RF02410 | CP4 | **Documentar erros e orientações:** Associar erros comuns e correções aos exercícios cadastrados. | Treinador | Must Have |
| RF02411 | CP4 | **Gerar thumbnail de vídeo base:** Fazer upload de miniatura personalizada ou gerar frame automático. | Treinador | Could Have |
| RF02412 | CP4 | **Cadastrar informações do vídeo:** Cadastrar título e descrição breve associados ao vídeo base do exercício. | Treinador | Must Have |
| RF03501 | CP5 | **Enviar vídeo de execução:** Gravar/selecionar vídeo e enviar vinculado a um exercício específico. | Atleta | Must Have |
| RF03502 | CP5 | **Substituir vídeo enviado:** Substituir vídeo antes do registro de feedback pelo treinador. | Atleta | Must Have |
| RF03503 | CP5 | **Excluir vídeo enviado:** Excluir vídeo antes do registro de feedback pelo treinador. | Atleta | Won't Have |
| RF03601 | CP6 | **Registrar feedback:** Registrar feedback textual vinculado ao vídeo e exercício do atleta. | Treinador | Must Have |
| RF03602 | CP6 | **Editar feedback:** Editar feedback registrado anteriormente pelo próprio treinador. | Treinador | Must Have |
| RF03603 | CP6 | **Excluir feedback:** Excluir feedback registrado anteriormente pelo próprio treinador. | Treinador | Won't Have |
| RF03604 | CP6 | **Notificar atleta sobre feedback:** Disparar notificação quando um feedback for registrado ou editado. | Sistema | Should Have |
| RF04701 | CP7 | **Consultar atletas acompanhados:** Listar atletas vinculados à carteira do treinador autenticado. | Treinador | Should Have |
| RF04802 | CP8 | **Consultar próprios dados cadastrais:** Consultar os dados da própria conta com isolamento estrito. | Atleta | Must Have |
| RF04803 | CP8 | **Consultar próprios resultados de testes:** Consultar resultados de testes associados à própria conta. | Atleta | Should Have |
| RF04804 | CP8 | **Consultar próprios vídeos enviados:** Visualizar os vídeos de execução enviados no histórico. | Atleta | Should Have |
| RF04805 | CP8 | **Consultar vídeos de atleta acompanhado:** Visualizar os vídeos de execução enviados pelos atletas vinculados. | Treinador | Must Have |
| RF04806 | CP8 | **Consultar feedback recebido:** Acessar feedbacks individuais registrados pelo treinador. | Atleta | Must Have |
| RF04807 | CP8 | **Consultar próprio histórico de treinos:** Visualizar histórico completo de treinos próprios. | Atleta | Should Have |
| RF04808 | CP8 | **Consultar próprios objetivos:** Visualizar objetivos macro definidos para o próprio atleta. | Atleta | Should Have |
| RF04809 | CP8 | **Consultar próprio planejamento de treinos:** Visualizar os treinos atualmente planejados e disponíveis. | Atleta | Should Have |
| RF04810 | CP8 | **Consultar perfil de atleta acompanhado:** Visualizar perfil e métricas clínicas dos atletas vinculados. | Treinador | Must Have |
| RF04811 | CP8 | **Consultar resultados de testes de atleta acompanhado:** Avaliar histórico de testes dos atletas vinculados. | Treinador | Must Have |

#### 10.1.2 Catálogo Consolidado de Requisitos Não Funcionais

O catálogo a seguir consolida os 18 requisitos não funcionais (RNFs) declarados para a plataforma, classificados segundo o modelo URPS+ (*Usability, Reliability, Performance, Supportability* e restrições).

| ID | Categoria | Descrição / Regra Mensurável | Escopo |
| :--- | :--- | :--- | :--- |
| **RNF01** | Usabilidade | **Responsividade Mobile:** A interface deve adaptar-se a telas a partir de 360px, priorizando o uso em smartphones. | Global |
| **RNF02** | Restrições | **Arquitetura e Stack Tecnológica:** React (v18+) com TypeScript no frontend, Python (3.11+) com Django/DRF no backend e PostgreSQL (v15+) como SGBD relacional. | Global |
| **RNF03** | Suportabilidade | **Estabilidade em Navegadores Padrão:** O sistema deve operar sem falhas críticas (erros bloqueantes) nas versões mais atuais do Chrome, Firefox, Edge, Safari e Opera. | Global |
| **RNF04** | Usabilidade | **Acessibilidade Digital:** Garantir acessibilidade visual (foco em daltonismo/baixa visão) com contraste mínimo de 4.5:1 (WCAG 2.1 AA) e independência de cor para transmissão de informação. | Global |
| **RNF05** | Confiabilidade | **Proteção e Privacidade de Dados (LGPD):** Garantir conformidade parcial com a LGPD (Lei nº 13.709/2018), focando nos artigos 5º, 14º, 18º e 46º (isolamento, segurança e transparência). | Global / CP8 |
| **RNF06** | Suportabilidade | **Compatibilidade de Vídeo:** O sistema deve aceitar e processar exclusivamente submissões de arquivos nos formatos `.mp4` e `.mov`. | CP5, CP6 |
| **RNF07** | Usabilidade | **Feedback Visual de Upload:** Exibir indicador visual dinâmico de progresso (1% a 99%) durante a submissão de vídeos em tempo real. | CP5 |
| **RNF08** | Usabilidade | **Interface de Feedback Anotado:** A interface do treinador deve permitir notas e observações textuais vinculadas diretamente à linha do tempo do vídeo do atleta. | CP6 |
| **RNF09** | Segurança | **Controle de Acesso (RBAC):** Aplicar *Role-Based Access Control* rigoroso, garantindo que endpoints e visões de Treinador sejam absolutamente inacessíveis a Atletas. | CP7 |
| **RNF10** | Segurança | **Isolamento Multi-inquilino (*Multi-tenant*):** O acesso a vídeos, histórico e feedbacks deve ser restrito exclusivamente ao dono do dado (atleta) e ao treinador formalmente vinculado. | CP8 |
| **RNF11** | Desempenho | **Desempenho no Carregamento:** Telas de histórico, perfil e gráficos devem carregar em até 5 segundos (sob simulação Fast 4G e 50 requisições simultâneas). | CP1, CP2 |
| **RNF12** | Confiabilidade | **Integridade na Catalogação:** A base de exercícios deve suportar consultas por filtros combinados (objetivos, fundamentos, materiais) sem inconsistência de índices. | CP4 |
| **RNF13** | Segurança | **Armazenamento Protegido de Mídias:** Uploads de vídeo devem ser persistidos isoladamente em armazenamento em nuvem com criptografia em repouso (AES-256). | CP5, CP8 |
| **RNF14** | Usabilidade | **Restrição de Mídias:** Os vídeos enviados pelos atletas possuem limite rígido de duração (60 segundos) e tamanho de arquivo (100 MB). | CP5 |
| **RNF15** | Usabilidade | **Validação no Preenchimento:** Aplicar máscaras de entrada em tempo real, destacar campos obrigatórios e validar formatos antes do envio (prevenção de erros). | CP1, CP3 |
| **RNF16** | Usabilidade | **Gerenciamento Pré-Envio de Mídia:** Limitar a seleção a 1 arquivo por vez no *upload*, exibindo botão de remoção/substituição antes da confirmação final. | CP5 |
| **RNF17** | Confiabilidade | **Consentimento de Cookies:** Apresentar aviso obrigatório de consentimento no primeiro acesso ("Aceitar Todos" vs "Apenas Essenciais" - LGPD Art. 7º e 8º). | Global / CP8 |
| **RNF18** | Confiabilidade | **Persistência de Dados:** Garantir que informações e vídeos cadastrados não se percam após reinicializações, manutenções ou atualizações de infraestrutura do sistema. | Global |

#### 10.1.3 Catálogo de Regras de Negócio

As Regras de Negócio (RN) representam restrições e políticas do domínio esportivo e operacional da plataforma, estabelecendo o que é permitido, obrigatório ou vedado, independentemente da implementação tecnológica.

| ID | Regra de Negócio |
| :--- | :--- |
| **RN01** | Apenas usuários devidamente autenticados (treinadores e atletas) possuem permissão de acesso à plataforma, sob controle rígido de perfis (RBAC). |
| **RN02** | O isolamento de dados (*multi-tenant*) é estrito: um atleta tem permissão para visualizar única e exclusivamente seus próprios dados cadastrais, objetivos, treinos planejados, vídeos enviados e feedbacks recebidos. |
| **RN03** | Um treinador tem permissão de acesso e avaliação restrita exclusivamente aos perfis, treinos e vídeos dos atletas que estejam formalmente vinculados à sua carteira de acompanhamento. |
| **RN04** | A edição de dados de análise clínica e esportiva (histórico de lesões, aptidão física, objetivos e resultados de treinos) é prerrogativa exclusiva do treinador. O atleta possui permissão para editar apenas seus dados cadastrais e métricas corporais primárias (nome, contato, peso, altura e envergadura). |
| **RN05** | O atleta só possui permissão para substituir ou excluir um vídeo de execução de exercício caso o treinador ainda não tenha registrado nenhum feedback avaliativo sobre aquela respectiva mídia. |
| **RN06** | É obrigatória a redefinição da senha provisória no primeiro acesso do usuário à plataforma, exigindo o cumprimento imediato dos critérios de segurança estabelecidos (mínimo de 6 caracteres, contendo ao menos um número e um caractere especial). |
| **RN07** | A exclusão de um perfil de usuário (atleta) do sistema só pode ser executada mediante ação direta do treinador ao qual ele estava previamente vinculado. |
| **RN08** | O envio de evidências práticas é restrito a exatamente 1 (um) arquivo de vídeo por submissão de exercício, devendo obrigatoriamente respeitar os formatos `.mp4` ou `.mov`, com teto máximo de 60 segundos de duração e 100 MB de tamanho por arquivo. |
| **RN09** | O ciclo de vida do *status* de um exercício inicia-se automaticamente como "A fazer". O atleta possui permissão para alterá-lo para "Feito" (sinalizando a execução e/ou envio do vídeo). A validação final, com a alteração para os *status* "Concluído" ou "Corrigir/Refazer", é de competência exclusiva do treinador, baseada na sua análise. |
| **RN10** | A validação das combinações de filtros na biblioteca de exercícios (fundamentos, objetivos e materiais) deve operar exclusivamente sobre as entidades previamente cadastradas e validadas pelo treinador no catálogo do sistema. |
| **RN11** | O registro ou alteração do nível de dificuldade de um exercício pelo atleta deve obedecer obrigatoriamente a uma escala fixa de 1 a 5, e só é permitido enquanto o treino correspondente estiver vigente/disponível para ele. |
| **RN12** | Um treinador possui permissão para editar ou excluir feedbacks de texto ou anotações em vídeo, desde que tenham sido registrados exclusivamente por ele mesmo ou por alunos do mesmo. |
| **RN13** | Em conformidade com a LGPD, o início da coleta de rastreamento de sessão e uso de dados não essenciais está estritamente bloqueado até que o usuário registre seu consentimento explícito no primeiro acesso. |
| **RN14** | Somente o treinador que registrou um feedback pode editar ou excluir esse feedback. |
| **RN15** | Aprovação de Treinadores: O registro de contas com perfil "Treinador" é restrito e requer validação e autorização prévia por parte da equipe de administração da plataforma. |
| **RN16** | Vínculo Obrigatório via Código: O cadastro de uma nova conta de "Atleta" só pode ser efetivado mediante a validação de um Código Único de Treinador no formulário de registro. Este código garante que o atleta seja vinculado automática e exclusivamente à carteira daquele treinador no instante da criação da conta. |

### 10.2 Priorização do Backlog Geral e MVP

A priorização do backlog foi conduzida combinando duas técnicas complementares: a Priorização MoSCoW e a Matriz Avaliação Técnica × Valor de Negócio (operacionalizada como Matriz de Valor de Negócio × Complexidade e Esforço Técnico).

#### 10.2.1 Critérios Objetivos para a Classificação MoSCoW

O valor de negócio representa o impacto do requisito nos fluxos principais da plataforma e na capacidade do sistema atender aos objetivos definidos para o MVP. A partir desses critérios, cada requisito foi classificado segundo o modelo MoSCoW:

| Classificação | Critério |
| :--- | :--- |
| **Must Have** | O requisito participa diretamente de um fluxo essencial do MVP. Sem ele, o sistema não executa o caso de uso principal ou perde sua função central. |
| **Should Have** | O requisito apoia um fluxo essencial ou amplia um fluxo principal com suporte pedagógico, operacional ou de acompanhamento. O MVP continua funcionando sem ele, mas com perda de cobertura, automação ou qualidade. |
| **Could Have** | O requisito complementa o uso do sistema, mas não altera a execução dos fluxos principais do MVP. |
| **Won't Have** | O requisito não entra na primeira versão do MVP. Foi postergado por baixo impacto no fluxo principal ou por custo técnico incompatível com a versão inicial. |

#### 10.2.2 Critérios Objetivos para o Valor de Negócio (VB)

Para permitir o posicionamento quantitativo dos requisitos na Matriz de Priorização, as classificações MoSCoW foram convertidas em uma escala numérica de Valor de Negócio (VB), variando de 1 a 5.

| Classificação MoSCoW | Valor de Negócio (VB) |
| :--- | :---: |
| Must Have | 4 ou 5 |
| Should Have | 4 |
| Could Have | 3 |
| Won't Have | 1 ou 2 |

#### 10.2.3 Critérios Objetivos para a Complexidade Técnica (CT)

A Complexidade Técnica dimensiona o impacto arquitetural, a quantidade de regras de negócio envolvidas e o volume de integrações necessárias para a implementação de cada requisito.

| Score | Classificação | Descrição da Complexidade e Regras Envolvidas | Exemplo Prático na Plataforma |
| :---: | :--- | :--- | :--- |
| **1** | **Muito baixa** | Funcionalidade simples, com poucas regras e poucas informações envolvidas. | Exibir uma lista de exercícios. |
| **2** | **Baixa** | Funcionalidade simples, mas que envolve algumas informações relacionadas. | Cadastrar um exercício com nome, objetivo e descrição. |
| **3** | **Média** | Envolve várias informações ou algumas regras que precisam ser controladas. | Criar um planejamento de treino relacionando atleta, exercícios e objetivos. |
| **4** | **Alta** | Envolve várias partes do sistema e exige cuidados maiores para funcionar corretamente. | Enviar vídeos e relacioná-los a exercícios e atletas. |
| **5** | **Muito alta** | Envolve muitas partes do sistema, regras complexas, algoritmos avançados ou exige cuidados especiais. | Controlar de forma detalhada quem pode acessar dados, vídeos e feedbacks de cada atleta. |

#### 10.2.4 Critérios Objetivos para o Esforço

O Esforço representa o custo em tempo e alocação de equipe necessário para concluir o desenvolvimento, testes e integração da funcionalidade. 

| Nível | Classificação | Critério de Esforço (Tempo e Alocação) | Exemplo Prático na Plataforma |
| :---: | :--- | :--- | :--- |
| **1** | **Muito baixo** | Pode ser feito rapidamente por uma pessoa. | Alterar um texto ou exibir uma informação simples. |
| **2** | **Baixo** | Exige pouco tempo e poucas alterações no sistema. | Criar um cadastro simples de exercício. |
| **3** | **Médio** | Exige alguns 2 dias de trabalho e envolve mais de uma parte do sistema. | Criar o cadastro e acompanhamento de um planejamento de treino. |
| **4** | **Alto** | Exige de 3 a 5 dias de aplicação, testes e integração entre diferentes partes do sistema. | Implementar o envio, armazenamento e visualização de vídeos. |
| **5** | **Muito alto** | Exige muito trabalho da equipe por mais de 5 dias e pode envolver várias etapas e partes do sistema. | Implementar todo o controle de acesso e proteção dos dados e vídeos dos atletas. |

#### 10.2.5 Regra de Decisão da Matriz

O posicionamento de cada requisito na Matriz de Priorização é determinado pelo cruzamento entre o **Valor de Negócio (VB)** e a **Complexidade Técnica/Esforço (CT)**, seguindo regras estritas de agregação:

*   **Eixo de Valor (VB):** Requisitos com valor 4 ou 5 (*Must Have* e *Should Have*) são considerados de **Alto Valor de Negócio**. Requisitos com valor igual ou inferior a 3 (*Could Have* e *Won't Have*) são classificados como **Baixo Valor de Negócio**.
*   **Eixo de Esforço/Complexidade (CT):** Requisitos com pontuação técnica inferior a 3.0 (CT < 3) são enquadrados como **Baixo Esforço**. Requisitos com pontuação 3.0 ou superior (CT >= 3) representam **Alto Esforço**, sinalizando a necessidade de planejamento avançado.

A partir desse cruzamento, os itens do backlog são distribuídos nos quadrantes estratégicos:

*   **Q1 — Alto Valor + Baixo Esforço:** Prioridade máxima. São as funcionalidades essenciais (*core*) que a equipe consegue entregar com rapidez.
*   **Q2 — Alto Valor + Alto Esforço:** Planejar com atenção. Requisitos indispensáveis para a proposta de valor, mas que consomem alto recurso técnico.
*   **Q3 — Baixo Valor + Baixo Esforço:** Baixa prioridade (*Quick Wins*). Funcionalidades fáceis de implementar, mas que não comprometem o MVP se ficarem para depois.
*   **Q4 — Baixo Valor + Alto Esforço:** Adiar para o futuro. Itens caros tecnicamente que agregam pouco à hipótese principal nesta versão inicial.

#### 10.2.6 Definição do MVP

O Produto Mínimo Viável (MVP) da plataforma esportiva foi definido como o menor conjunto de funcionalidades viável capaz de demonstrar, em ambiente real, a hipótese de valor central do projeto:

> *Um treinador consegue estruturar bibliotecas de exercícios e planejar rotinas de treino para a sua carteira de atletas sob um controle de acesso rigoroso; enquanto os atletas conseguem acessar essas prescrições, registrar sua percepção de esforço e enviar evidências em vídeo de sua execução, permitindo ao treinador o registro de feedback avaliativo de forma assíncrona, segura e isolada.*

Aplicando a regra de decisão da matriz e a priorização MoSCoW, o escopo do MVP é composto pelos seguintes Requisitos Funcionais, abrangendo a totalidade dos itens classificados como *Must Have* e *Should Have* (incluindo o requisito essencial de *Logout*, vital para conformidade de segurança e encerramento de sessão).

**Distribuição do MVP por Característica de Produto**:

| CP | Característica de Produto | RFs no MVP |
| :--- | :--- | :--- |
| CP1 | Controle de Acesso | RF01101, RF01102, RF01103, RF01104, RF01107 |
| CP2 | Administração de Conteúdo | RF01208, RF01209, RF01210, RF01211 |
| CP3 | Espaço de Construção | RF02301, RF02302, RF02304, RF02306 |
| CP4 | Validador de Estruturas | RF02407, RF02410, RF02412 |
| CP5 | Portfólio de Progresso | RF03501, RF03502 |
| CP6 | Painel de Monitoramento | RF03601, RF03602, RF03604 |
| CP7 | Controle de Atletas | RF04701 |
| CP8 | Isolamento de Dados | RF04802, RF04803, RF04804, RF04805, RF04806, RF04807, RF04808, RF04809, RF04810, RF04811 |

---

### **Histórico de Versões**

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| 11/10/2026 |0.1| Criação e consolidação inicial do Backlog do Produto (RFs, RNFs e RNs). | Guilherme Ferreira Mendes |