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

#### 10.1.3 Catálogo de Regras de Negócio (RN)

As Regras de Negócio definem as políticas, restrições e lógicas de domínio que o sistema deve obrigatoriamente respeitar e aplicar durante as suas operações.

| ID | Regra de Negócio |
| :--- | :--- |
| **RN01** | Um treinador tem permissão de acesso e avaliação restrita exclusivamente aos perfis, treinos e vídeos dos atletas que estejam formalmente vinculados à sua carteira de acompanhamento. |
| **RN02** | A edição de dados de análise clínica e esportiva (histórico de lesões, aptidão física, objetivos e resultados de treinos) é prerrogativa exclusiva do treinador. O atleta possui permissão para editar apenas seus dados cadastrais e métricas corporais primárias (nome, contato, peso, altura e envergadura). |
| **RN03** | O atleta só possui permissão para substituir ou excluir um vídeo de execução de exercício caso o treinador ainda não tenha registrado nenhum feedback avaliativo sobre aquela respectiva mídia. |
| **RN04** | **Exclusão de perfis de atletas:** A exclusão de um perfil de atleta somente pode ser realizada pelo treinador ao qual o atleta está formalmente vinculado. A operação deve respeitar as políticas de retenção de dados e preservar os registros históricos que precisem ser mantidos. |
| **RN05** | **Limite de vídeos por submissão:** Cada submissão de exercício pode conter exatamente um arquivo de vídeo. Não é permitido anexar mais de um vídeo à mesma submissão. Uma nova tentativa de execução poderá gerar uma nova submissão quando o exercício estiver disponível para correção ou refazimento, respeitando as demais regras do sistema. |
| **RN06** | **Ciclo de vida dos exercícios:** Todo exercício deve ser criado automaticamente com o status “A fazer”. O atleta pode alterar o status para “Concluído” após executar o exercício. Compete exclusivamente ao treinador responsável alterar o status para “Concluído” ou “Corrigir/Refazer”, conforme sua avaliação. Quando o exercício receber o status “Corrigir/Refazer”, o atleta poderá realizar uma nova tentativa e enviar uma nova submissão, conforme as condições estabelecidas pelo sistema. |
| **RN07** | O registro da percepção de dificuldade de um exercício pelo atleta deve obedecer obrigatoriamente a uma escala fixa de 1 a 5. |
| **RN08** | Um treinador possui permissão para editar ou excluir feedbacks de texto ou anotações em vídeo, desde que tenham sido registrados exclusivamente por ele mesmo. |
| **RN09** | O atleta possui permissão para alterar o registro de nível de dificuldade (1 a 5) que atribuiu a um exercício, desde que o treino correspondente ainda esteja com o status vigente/disponível. |
| **RN10** | **Aprovação de Treinadores:** O registro de contas com perfil "Treinador" é restrito e requer validação e autorização prévia por parte da equipe de administração da plataforma. |
| **RN11** | O registo de uma conta de 'Atleta' exige obrigatoriamente a introdução de um Código de Convite Privado (semelhante a uma senha de acesso) fornecido exclusivamente pelo treinador, servindo como credencial de autorização para a criação do perfil e vinculação imediata à respetiva carteira multi-tenant. |

#### 10.1.4 User Stories Derivadas dos Requisitos Funcionais

A tabela a seguir apresenta cada RF declarado utilizando a técnica de *User Story* no formato **"Como [ator], quero [objetivo], para [benefício]"**, adotado pela equipe como prática de Declaração de Requisitos.

A coluna **RNFs Relacionados** estabelece a rastreabilidade entre as histórias e os requisitos não funcionais aplicáveis. Os Critérios de Aceitação correspondentes a cada US e o mapeamento com as Regras de Negócio (RN) estão declarados na Matriz de Rastreabilidade.

| RF | User Story Derivada | RNFs Relacionados |
| :--- | :--- | :--- |
| **RF01101** | **US01a** — Como aluno/atleta, quero cadastrar um perfil validando o código do meu treinador, para ter acesso aos meus treinos e ingressar na carteira dele. | RNF15 |
| **RF01101** | **US01b** — Como treinador, quero solicitar o cadastro de uma conta de treinador na plataforma, para poder gerenciar meus atletas e prescrever treinos após a aprovação da administração. | RNF15 |
| **RF01102** | **US02** — Como usuário do site, quero logar com conta própria utilizando meu apelido e senha, para acessar a plataforma de forma segura. | RNF09 |
| **RF01103** | **US03** — Como usuário autenticado, quero deslogar da minha conta, para encerrar a sessão de forma segura em dispositivos compartilhados. | RNF09 |
| **RF01104** | **US04a** — Como aluno, quero editar as minhas informações pessoais e corporais básicas (nome, contato, peso, altura), para manter o meu cadastro atualizado. | RNF15 |
| **RF01104** | **US04b** — Como treinador, quero editar o histórico de lesões, objetivos e dados de aptidão física no perfil dos meus alunos, para manter a avaliação clínica deles atualizada e segura. | RNF15 |
| **RF01105** | **US05** — Como treinador, quero excluir o perfil de um atleta desvinculado, para manter a base de dados da minha carteira limpa e atualizada. | RNF15 |
| **RF01106** | **US06** — Como sistema, quero gerar uma senha temporária automática para o primeiro acesso do usuário, para garantir um processo de integração (*onboarding*) ágil e seguro. | RNF15 |
| **RF01107** | **US07** — Como aluno, quero trocar a senha após o primeiro acesso, para conseguir acessar o site novamente de forma segura e pessoal. | RNF15 |
| **RF01208** | **US08** — Como treinador, quero consultar a dificuldade que os alunos registraram após o treino, para ser assertivo com as orientações e registro de treinos posteriores. | RNF11 |
| **RF01209** | **US09** — Como aluno, quero registrar a dificuldade que senti na execução do exercício, para o treinador entender em quais momentos e cargas tive mais dificuldade. | RNF15 |
| **RF01210** | **US10** — Como aluno, quero modificar a dificuldade que registrei enquanto o treino estiver vigente, para ser assertivo e corrigir avaliações precipitadas. | RNF15 |
| **RF01211** | **US11a** — Como aluno, quero modificar o status do meu próprio exercício para "Concluído" ou "A fazer", para registrar e sinalizar o meu progresso durante a execução do treino. | RNF11 |
| **RF01211** | **US11b** — Como treinador, quero modificar o status dos exercícios dos meus alunos para "Concluído" ou "Corrigir", para auditar e validar o progresso deles após analisar a execução. | RNF11 |
**RF01212** | **US12** — Como treinador, quero adicionar testes de aptidão física, para avaliar formalmente o desempenho e a evolução atlética dos meus alunos. | RNF15 |
| **RF01213** | **US13** — Como treinador, quero remover testes de aptidão física previamente cadastrados, para corrigir equívocos ou atualizar a matriz de avaliação da carteira. | RNF15 |
| **RF02301** | **US14** — Como treinador, quero registrar o planejamento de cada aluno na minha carteira, para que eles possam acompanhar e executar as rotinas de treino propostas. | RNF15 |
| **RF02302** | **US15** — Como treinador, quero modificar o planejamento de treino já cadastrado, para corrigir possíveis erros ou realizar ajustes de carga. | RNF15 |
| **RF02303** | **US16** — Como treinador, quero vincular um treino planejado aos macro-objetivos do atleta, para manter a coerência da prescrição a longo prazo. | RNF15 |
| **RF02304** | **US17** — Como treinador, quero consultar o histórico de planejamentos de treinos de cada aluno, para aprimorar e embasar o acompanhamento longitudinal do atleta. | RNF11 |
| **RF02305** | **US18** — Como treinador, quero gerar um relatório comparativo entre o treino planejado e o efetivamente realizado, para analisar a adesão e o rendimento do atleta. | RNF11 |
| **RF02306** | **US19** — Como treinador, quero consultar o andamento e status do treino em tempo real, para aprimorar o acompanhamento da execução diária de cada aluno. | RNF11 |
| **RF02407** | **US20** — Como treinador, quero cadastrar um exercício na biblioteca, para que o aluno saiba exatamente quais movimentos precisa realizar no seu treino. | RNF12, RNF15 |
| **RF02408** | **US21** — Como treinador, quero filtrar a biblioteca de exercícios por fundamento esportivo, para encontrar rapidamente os movimentos adequados na hora de montar o treino. | RNF12 |
| **RF02409** | **US22** — Como treinador, quero vincular exercícios da biblioteca a objetivos específicos, para padronizar e agilizar futuras prescrições. | RNF15 |
| **RF02410** | **US23** — Como treinador, quero documentar erros comuns e orientações aos exercícios cadastrados, para alertar o aluno e evitar que ele cometa as falhas frequentes relacionadas àquele movimento. | RNF15 |
| **RF02411** | **US24** — Como treinador, quero gerar uma miniatura (*thumbnail*) para o vídeo base, para facilitar a identificação visual do exercício na biblioteca pelo atleta. | RNF06 |
| **RF02412** | **US25** — Como treinador, quero cadastrar título e/ou descrições detalhadas nos vídeos base do exercício, para que o aluno entenda completamente a forma e a execução correta. | RNF15 |
| **RF03501** | **US26** — Como aluno, quero mandar um vídeo da execução do exercício, para que o treinador veja como está a minha forma e consiga dar um feedback mais assertivo. | RNF06, RNF07, RNF13, RNF14, RNF16 |
| **RF03502** | **US27** — Como aluno, quero trocar o vídeo da execução do exercício que foi enviado, para corrigir o envio de um arquivo errado antes que o treinador avalie a mídia. | RNF06, RNF07, RNF13, RNF14, RNF16 |
| **RF03503** | **US28** — Como aluno, quero excluir um vídeo de execução enviado, para cancelar uma submissão feita por engano antes da avaliação do treinador. | RNF15 |
| **RF03601** | **US29** — Como treinador, quero registrar um feedback textual na mídia do exercício analisado, para que o aluno compreenda os seus erros e acertos de execução. | RNF08, RNF15 |
| **RF03602** | **US30** — Como treinador, quero modificar um feedback previamente analisado e registrado, para corrigir ou complementar a orientação dada ao aluno. | RNF15 |
| **RF03603** | **US31** — Como treinador, quero excluir um feedback previamente registrado, para remover anotações indevidas ou equivocadas da plataforma. | RNF15 |
| **RF03604** | **US32** — Como aluno, quero ser notificado no sistema quando o treinador registrar ou editar um feedback, para saber exatamente quando o meu vídeo foi avaliado e visualizá-lo. | RNF11 |
| **RF04701** | **US33** — Como treinador, quero acessar a lista de dados exclusivamente dos alunos da minha carteira, para aprimorar o acompanhamento e gerenciar o volume de treinos. | RNF09 |
| **RF04802** | **US34** — Como aluno, quero consultar unicamente os meus próprios dados cadastrais, para ter ciência dos dados armazenados e saber se necessitam de correção. | RNF05, RNF10, RNF11 |
| **RF04803** | **US35** — Como aluno, quero consultar exclusivamente os resultados dos meus próprios testes de aptidão, para monitorar a minha performance sem acessar dados de terceiros. | RNF05, RNF10, RNF11 |
| **RF04804** | **US36** — Como aluno, quero consultar unicamente os vídeos de execução que eu mesmo enviei, para rever a minha forma e garantir que a mídia submetida foi a correta. | RNF05, RNF10, RNF11 |
| **RF04805** | **US37** — Como treinador, quero consultar os vídeos de execução enviados pelos alunos sob meu acompanhamento, para avaliar tecnicamente a execução de cada exercício de forma assíncrona. | RNF09, RNF10, RNF11 |
| **RF04806** | **US38** — Como aluno, quero consultar exclusivamente o feedback que o treinador registrou nos meus exercícios realizados, para compreensão de erros e correção de postura. | RNF05, RNF10, RNF11 |
| **RF04807** | **US39** — Como aluno, quero consultar o meu próprio histórico de treinos já realizados, para acessar rotinas antigas e acompanhar a progressão de cargas. | RNF05, RNF10, RNF11 |
| **RF04808** | **US40** — Como aluno, quero consultar exclusivamente os meus próprios objetivos definidos pelo treinador, para ter ciência de que as rotinas de treino são coerentes com as minhas metas. | RNF05, RNF10, RNF11 |
| **RF04809** | **US41** — Como aluno, quero consultar exclusivamente o meu próprio planejamento de treino diário/semanal, para entender a organização e a sequência dos exercícios prescritos. | RNF05, RNF10, RNF11 |
| **RF04810** | **US42** — Como treinador, quero consultar o perfil completo dos alunos sob minha responsabilidade, para analisar dados pessoais atualizados e embasar avaliações clínicas. | RNF09, RNF10, RNF11 |
| **RF04811** | **US43** — Como treinador, quero consultar o histórico de resultados dos testes de aptidão física da minha carteira de alunos, para analisar a evolução atlética e definir quais os treinos adequados para os próximos ciclos. | RNF09, RNF10, RNF11 |

> **Nota de rastreabilidade:** O desmembramento de requisitos complexos (como Cadastro de Usuário e Edição de Perfil) em *User Stories* atômicas (ex: US01a e US01b) foi realizado para garantir a cobertura individual de testes e regras de negócio para as visões e permissões específicas de Treinador e Atleta.

#### 10.1.5 Critérios de Aceitação

Os critérios de aceitação definem as condições exatas que cada funcionalidade deve satisfazer para ser homologada e considerada concluída pela equipe de desenvolvimento. Para garantir a padronização e a rastreabilidade com as Regras de Negócio (RN) e Requisitos Não Funcionais (RNF), os critérios foram redigidos utilizando a sintaxe BDD (*Behavior-Driven Development*).

---

##### CP1: Gestão das Informações do Atleta (Controle de Acesso)

**US01a — Cadastrar perfil (Atleta)**
*   **CA01 (Vínculo Obrigatório):** Dado que um novo atleta preenche o formulário de cadastro, Quando ele insere um Código Único de Treinador válido, Então o sistema cria a conta e o vincula automática e exclusivamente à carteira desse treinador (RN15).
*   **CA02 (Validação de Dados):** Dado que o usuário tenta enviar o formulário, Quando faltam dados obrigatórios ou os formatos são inválidos (ex: e-mail incorreto), Então o sistema exibe alertas na interface e bloqueia a submissão (RNF15).

**US01b — Solicitar cadastro (Treinador)**
*   **CA01 (Aprovação Restrita):** Dado que um treinador finaliza o seu cadastro, Quando ele tenta fazer o login inicial, Então o sistema exibe uma mensagem informando que a conta aguarda autorização da administração e bloqueia o acesso (RN14).

**US02 — Logar com conta própria**
*   **CA01 (RBAC):** Dado que o usuário insere credenciais ativas e corretas, Quando aciona o login, Então o sistema o autentica e redireciona para a *dashboard* correspondente ao seu perfil de acesso (Treinador ou Atleta) (RN01, RNF09).

**US03 — Deslogar da conta**
*   **CA01 (Encerramento de Sessão):** Dado que o usuário está autenticado, Quando clica em "Sair", Então o sistema invalida o token de sessão e redireciona para a tela de login inicial (RN01).

**US04a — Editar informações corporais (Atleta)**
*   **CA01 (Restrição de Escrita):** Dado que o atleta acessa a edição de perfil, Quando visualiza os campos disponíveis, Então o sistema permite a alteração apenas de nome, contato, peso, altura e envergadura, mantendo o histórico de lesões e aptidão bloqueados em modo leitura (RN04).

**US04b — Editar informações clínicas (Treinador)**
*   **CA01 (Privilégio Clínico):** Dado que o treinador acessa o perfil de um aluno da sua carteira, Quando edita as informações, Então ele possui permissão exclusiva para alterar o histórico de lesões, objetivos e dados de aptidão física (RN04).

**US05 — Excluir perfil de atleta (Treinador)**
*   **CA01 (Exclusão por Vínculo):** Dado que o treinador gerencia a sua carteira, Quando seleciona um atleta e confirma a exclusão, Então o sistema inativa a conta do atleta, sendo esta ação permitida apenas ao treinador que o acompanha (RN07).

**US06 — Gerar senha automática (Sistema)**
*   **CA01 (Onboarding):** Dado que uma conta de atleta é criada com sucesso, Quando o processo finaliza, Então o sistema gera uma senha provisória criptografada e envia para o e-mail cadastrado (RNF15).

**US07 — Trocar senha (Atleta/Treinador)**
*   **CA01 (Obrigatoriedade no 1º Acesso):** Dado que o usuário realiza o login com uma senha provisória, Quando a autenticação ocorre, Então o sistema redireciona obrigatoriamente para a tela de troca de senha (RN06).
*   **CA02 (Políticas de Segurança):** Dado que o usuário define uma nova senha, Quando o texto possui menos de 6 caracteres, não contém números ou caracteres especiais, Então o sistema recusa a alteração e exibe as regras de formatação (RN06).

---

##### CP2: Administração de Conteúdo (Avaliações e Status)

**US08 — Consultar dificuldade dos alunos**
*   **CA01 (Restrição de Visualização):** Dado que o treinador consulta as métricas de treino, Quando os gráficos de dificuldade (1 a 5) são gerados, Então os dados refletem exclusivamente os atletas da sua carteira (RN03).

**US09 e US10 — Registrar e Modificar dificuldade**
*   **CA01 (Escala Fixa):** Dado que o atleta avalia a dificuldade de um exercício, Quando interage com o seletor, Então o sistema restringe a nota a valores inteiros entre 1 e 5 (RN11).
*   **CA02 (Vigência):** Dado que o atleta tenta alterar uma dificuldade previamente registrada, Quando o status do planejamento já estiver como "Expirado/Indisponível", Então o sistema bloqueia a edição da nota (RN13).

**US11a e US11b — Modificar status dos exercícios**
*   **CA01 (Autonomia do Atleta):** Dado que o atleta está executando o treino, Quando interage com o botão de status, Então ele só possui permissão para alternar entre "A fazer" e "Concluído" (RN09).
*   **CA02 (Auditoria do Treinador):** Dado que o atleta marcou um exercício como "Concluído", Quando o treinador analisa o vídeo e identifica falhas, Então o treinador tem a prerrogativa de sobrepor esse status e alterá-lo para "Corrigir/Refazer" (RN09).

**US12 — Adicionar testes de aptidão física (Treinador)**
*   **CA01 (Prerrogativa de Gestão):** Dado que o treinador acessa a aba de testes do perfil de um aluno da sua carteira, Quando ele preenche os dados de uma nova avaliação física e salva, Então o sistema registra o teste e o vincula permanentemente ao histórico daquele atleta (RN04).

**US13 — Remover testes de aptidão física (Treinador)**
*   **CA01 (Controle de Erros):** Dado que o treinador visualiza os testes registados no perfil do aluno, Quando ele seleciona um registo incorreto e aciona a exclusão, Então o sistema remove o teste do histórico, sendo esta uma ação restrita exclusivamente ao treinador vinculado (RN04).

---

##### CP3: Espaço de Construção (Planejamento)

**US14 e US15 — Registrar e Modificar planejamento**
*   **CA01 (Filtro de Destinatários):** Dado que o treinador cria um treino, Quando abre a lista de seleção de alunos, Então o sistema exibe estritamente os atletas vinculados à sua carteira (RN03).

**US16 — Vincular treino a macro-objetivos**
*   **CA01 (Rastreabilidade de Metas):** Dado que o treinador finaliza um planejamento, Quando ele seleciona a opção de vínculo, Então o sistema permite associar aquele conjunto de exercícios a um objetivo de longo prazo previamente definido no perfil do aluno.

**US17, US18 e US19 — Consultas e Relatórios de Treino**
*   **CA01 (Performance de Carregamento):** Dado que o treinador solicita o histórico ou status de treinos de um aluno, Quando a requisição é feita, Então o sistema compila e exibe a interface de dados em no máximo 5 segundos (RNF11).

---

##### CP4: Validador de Estruturas (Biblioteca de Exercícios)

**US20, US21 e US22 — Cadastrar e Filtrar Exercícios**
*   **CA01 (Integridade Referencial):** Dado que o treinador preenche os metadados de um novo exercício, Quando tenta adicionar fundamentos ou objetivos, Então ele só pode escolher opções já validadas e existentes no catálogo global da plataforma (RN10).

**US23, US24 e US25 — Orientação e Metadados Visuais**
*   **CA01 (Suporte Visual):** Dado que o treinador cadastra um vídeo base de demonstração, Quando o arquivo é anexado, Então o sistema disponibiliza campos obrigatórios para título, descrição textual da execução e registro de erros comuns.

---

##### CP5: Portfólio de Progresso (Envio de Vídeos)

**US26 — Mandar vídeo de execução**
*   **CA01 (Restrições de Submissão):** Dado que o atleta tenta realizar o *upload*, Quando o arquivo ultrapassa 100MB, excede 60 segundos ou possui extensão diferente de .mp4/.mov, Então o sistema barra a ação e exibe um erro de formato (RN08, RNF06, RNF14).
*   **CA02 (Progresso Visual):** Dado que o arquivo cumpre as regras técnicas, Quando o upload é iniciado rumo à nuvem criptografada, Então uma barra de progresso numérica (1% a 99%) é exibida na interface (RNF07, RNF13).

**US27 e US28 — Trocar e Excluir vídeo enviado**
*   **CA01 (Bloqueio por Avaliação):** Dado que o atleta deseja excluir ou substituir um vídeo submetido, Quando o treinador já tiver publicado um *feedback* atrelado àquela mídia, Então os botões de exclusão e substituição ficam inativos (RN05).

---

##### CP6: Painel de Monitoramento (Feedback)

**US29 — Registrar feedback**
*   **CA01 (Vínculo de Mídia):** Dado que o treinador assiste à evidência do aluno, Quando ele salva suas anotações, Então o texto fica permanentemente anexado àquele exercício específico do planejamento.

**US30 e US31 — Modificar e Excluir feedback**
*   **CA01 (Autoria):** Dado que o treinador tenta editar uma avaliação passada, Quando a requisição é validada, Então o sistema só permite a modificação se o autor original do *feedback* for o próprio usuário logado (RN12).

**US32 — Notificar atleta**
*   **CA01 (Gatilho de Notificação):** Dado que o treinador publica ou altera um feedback, Quando a ação é salva, Então o sistema envia imediatamente um alerta visual para o painel do atleta correspondente.

---

##### CP7 e CP8: Controle de Atletas e Isolamento de Dados (Multi-tenant)

**US34, US35, US36, US38, US39, US40 e US41 — Consultas Exclusivas do Atleta**
*   **CA01 (Privacidade e LGPD - Atleta):** Dado que o atleta navega pelas seções de histórico, vídeos, objetivos e testes, Quando ele tentar forçar na URL o ID de um recurso pertencente a outro utilizador, Então a API deve recusar o pedido (Erro 403 - *Forbidden*) e exibir apenas os dados da própria sessão (RN02, RNF05, RNF10).

**US33, US37, US42 e US43 — Consultas Exclusivas do Treinador**
*   **CA01 (Isolamento de Carteira - Treinador):** Dado que o treinador visualiza listas de alunos, perfis clínicos, vídeos submetidos ou resultados de aptidão, Quando a interface é carregada, Então o sistema injeta um filtro de banco de dados que retorna rigorosamente os atletas que possuam o seu ID de vínculo, ocultando totalmente o resto da base de utilizadores (RN03, RNF09, RNF10).

#### 10.1.6 Matriz de Rastreabilidade

A Matriz de Rastreabilidade visualiza as dependências e o fluxo de valor desde os Objetivos Específicos (OE) e Características de Produto (CP) até aos Requisitos Funcionais (RF). 

Para garantir a rastreabilidade completa sem poluição visual, as restrições técnicas e políticas do sistema estão representadas através de *Tags* visuais (indicando as Regras de Negócio - RN e Requisitos Não Funcionais - RNF) aplicadas diretamente nos cartões de cada funcionalidade.

[Acessar a Matriz de Rastreabilidade no Miro](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764686792804852&cot=14)

<iframe width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?focusWidget=3458764686792804852&embedMode=view_only_without_ui&embedId=190867808159" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

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

#### 10.2.2 Critérios Objetivos para o Valor de Negócio (VB)

Para permitir o posicionamento quantitativo dos requisitos na Matriz de Priorização, as classificações MoSCoW foram convertidas em uma escala numérica de Valor de Negócio (VB), variando de 1 a 5.

| Classificação MoSCoW | Valor de Negócio (VB) |
| :--- | :---: |
| Must Have | 4 ou 5 |
| Should Have | 4 |
| Could Have | 3 |
| Won't Have | 1 ou 2 |

[Acessar a Matriz Moscow](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764685315069399&cot=14)

<iframe width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?embedMode=view_only_without_ui&moveToViewport=1026%2C11267%2C2291%2C2023&embedId=336465475640" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

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

[Acessar a Matriz de Priorização no Miro](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764685315496941&cot=14)

<iframe width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?embedMode=view_only_without_ui&moveToViewport=1162%2C8496%2C1930%2C2082&embedId=290614433109" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

#### 10.2.6 Priorização dos Requisitos Não Funcionais
 
Os 18 requisitos não funcionais do catálogo (10.1.2) foram classificados em quatro grupos, de acordo com o papel de cada um na primeira versão do produto. A classificação indica quais RNFs precisam estar atendidos e verificados no MVP, quais acompanham os requisitos funcionais do MVP, quais evoluem nas versões seguintes e quais ficam fora do escopo inicial.
 
**Critérios de classificação**
 
| Grupo | Critério | Tratamento no MVP |
| :--- | :--- | :--- |
| **Obrigatórios para o MVP** | RNF de escopo global ou de proteção de dados e controle de acesso, que orienta decisões de arquitetura e precisa estar atendido desde a primeira versão. | Verificado no produto como um todo, conforme o DoD. |
| **Associados a RFs do MVP** | RNF que restringe diretamente um ou mais RFs do MVP e entra na versão junto com eles. | Verificado nos critérios de aceitação dos RFs relacionados. |
| **Evolutivos** | RNF que o MVP atende de forma básica, com meta completa e verificação mensurável nas versões seguintes. | Sem verificação formal da meta no MVP; a evolução é registrada no backlog. |
| **Não aplicáveis ao MVP** | RNF cujo atendimento não é exigido na primeira versão. | Não verificado no MVP; permanece no catálogo para versões futuras. |
 
**Classificação dos RNFs**
 
| Grupo | ID | Requisito não funcional | Categoria | Escopo |
| :--- | :--- | :--- | :--- | :--- |
| **Obrigatórios para o MVP** | RNF01 | Responsividade Mobile | Usabilidade | Global |
| **Obrigatórios para o MVP** | RNF02 | Arquitetura e Stack Tecnológica | Restrições | Global |
| **Obrigatórios para o MVP** | RNF03 | Estabilidade em Navegadores Padrão | Suportabilidade | Global |
| **Obrigatórios para o MVP** | RNF05 | Proteção e Privacidade de Dados (LGPD) | Confiabilidade | Global / CP8 |
| **Obrigatórios para o MVP** | RNF09 | Controle de Acesso (RBAC) | Segurança | CP7 |
| **Obrigatórios para o MVP** | RNF10 | Isolamento Multi-inquilino (*Multi-tenant*) | Segurança | CP8 |
| **Obrigatórios para o MVP** | RNF17 | Consentimento de Cookies | Confiabilidade | Global / CP8 |
| **Associados a RFs do MVP** | RNF06 | Compatibilidade de Vídeo | Suportabilidade | CP5, CP6 |
| **Associados a RFs do MVP** | RNF12 | Integridade na Catalogação | Confiabilidade | CP4 |
| **Associados a RFs do MVP** | RNF14 | Restrição de Mídias | Usabilidade | CP5 |
| **Associados a RFs do MVP** | RNF16 | Gerenciamento Pré-Envio de Mídia | Usabilidade | CP5 |
| **Evolutivos** | RNF07 | Feedback Visual de Upload | Usabilidade | CP5 |
| **Evolutivos** | RNF08 | Interface de Feedback Anotado | Usabilidade | CP6 |
| **Evolutivos** | RNF11 | Desempenho no Carregamento | Desempenho | CP1, CP2 |
| **Evolutivos** | RNF13 | Armazenamento Protegido de Mídias | Segurança | CP5, CP8 |
| **Evolutivos** | RNF15 | Validação no Preenchimento | Usabilidade | CP1, CP3 |
| **Evolutivos** | RNF18 | Persistência de Dados | Confiabilidade | Global |
| **Não aplicáveis ao MVP** | RNF04 | Acessibilidade Digital | Usabilidade | Global |
 
Dos 18 RNFs, 7 são obrigatórios, 4 estão associados a RFs do MVP, 6 são evolutivos e 1 não se aplica à primeira versão. Os grupos *Obrigatórios* e *Associados* formam o conjunto de RNFs do MVP.

[Acessar a priorização dos RNFs no Miro](https://miro.com/app/board/uXjVHrFoSVo=/)

<iframe width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?embedMode=view_only_without_ui&moveToViewport=5521%2C9626%2C2251%2C1870&embedId=972933933673" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

#### 10.2.7 Definição do MVP


O Produto Mínimo Viável (MVP) da plataforma esportiva foi definido como o menor conjunto de funcionalidades viável capaz de demonstrar, em ambiente real, a hipótese de valor central do projeto:

> *Um treinador consegue estruturar bibliotecas de exercícios e planejar rotinas de treino para a sua carteira de atletas sob um controle de acesso rigoroso; enquanto os atletas conseguem acessar essas prescrições, registrar sua percepção de esforço e enviar evidências em vídeo de sua execução, permitindo ao treinador o registro de feedback avaliativo de forma assíncrona, segura e isolada.*

A linha de corte do MVP, definida no quadro de priorização MoSCoW (Miro), considera o valor de negócio e a complexidade técnica (CT) de cada requisito:
 
> **MVP = todos os requisitos *Must Have* + os requisitos *Should Have* com CT < 3.**

Os RFS 01103 e RF01106 estão como *Must Have* pois são necessários para completar o fluxo do MVP.

**Distribuição do MVP por Característica de Produto**:

| CP | Requisitos no MVP | Qtd. |
| :--- | :--- | :---: |
| CP1 | RF01101, RF01102, RF01103, RF01104, RF01106, RF01107 | 6 |
| CP2 | RF01208, RF01209, RF01210, RF01211 | 4 |
| CP3 | RF02301, RF02302, RF02304, RF02306 | 4 |
| CP4 | RF02407, RF02410, RF02412 | 3 |
| CP5 | RF03501, RF03502 | 2 |
| CP6 | RF03601, RF03602 | 2 |
| CP7 | RF04701 | 1 |
| CP8 | RF04802, RF04804, RF04805, RF04806, RF04807, RF04808, RF04809, RF04810 | 8 |
| **Total** | | **30** |

---

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | :---: | :---: | :--- | :--- |
    | 13/10/2026 | 0.4 | Ajuste da priorização MoSCoW (RF01106, RF04803, RF04811), definição da linha de corte do MVP (Must + Should com CT < 3) e unificação do MVP com o mvp.md | Guilherme Ferreira Mendes |
    | 12/10/2026 |0.3| Refinamento das Regras de Negócio. | Guilherme Ferreira Mendes |
    | 12/10/2026 |0.2| Adição dos US(histórias de usuário) e CA(critérios de aceitação), mais as tabelas do Miro. | Guilherme Ferreira Mendes |
    | 11/10/2026 |0.1| Criação e consolidação inicial do Backlog do Produto (RFs, RNFs e RNs). | Guilherme Ferreira Mendes |