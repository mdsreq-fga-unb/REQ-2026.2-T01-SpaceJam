# Requisitos de Software

Os requisitos de software descrevem as funcionalidades e características que o sistema deve apresentar para atender às necessidades identificadas no projeto. Eles foram definidos a partir dos objetivos do produto (OE) e das características do produto (CP), permitindo estabelecer a rastreabilidade entre as necessidades do projeto e as funcionalidades especificadas.

Os requisitos estão organizados em **Requisitos Funcionais (RF)** e **Requisitos Não Funcionais (RNF)**. Os requisitos funcionais descrevem as funcionalidades e comportamentos que o sistema deve oferecer, enquanto os requisitos não funcionais especificam características, restrições e condições relacionadas à qualidade e ao funcionamento do sistema.

### Identificação dos requisitos

Para facilitar a organização e a rastreabilidade, os requisitos funcionais utilizam um código estruturado no formato:

$$
{\text{RF0[OE][CP][N]}}
$$

Em que:

- **RF**: identifica que se trata de um Requisito Funcional;
- **OE**: identifica o **Objetivo Específico** ao qual o requisito está relacionado;
- **CP**: identifica a **Característica do Produto** associada;
- **N**: identifica a ordem sequencial do requisito dentro da característica do produto.

Por exemplo, o requisito **RF01101** pode ser interpretado da seguinte forma:

| Parte | Significado |
|---|---|
| **RF** | Requisito Funcional |
| **01** | Objetivo Específico 1 (OE1) |
| **1** | Característica do Produto 1 (CP1) |
| **01** | Primeiro requisito dessa característica |

Dessa forma, a codificação permite identificar a origem e a relação de cada requisito dentro da estrutura do projeto, facilitando sua rastreabilidade ao longo do desenvolvimento.

Os requisitos não funcionais seguem uma identificação sequencial no formato **RNF01, RNF02, RNF03...**, sendo também associados às características do produto quando aplicável.

## Requisitos Funcionais

Os requisitos funcionais do sistema são apresentados na tabela abaixo. A coluna **Rastreabilidade** relaciona cada requisito ao seu respectivo Objetivo Específico (OE) e Característica do Produto (CP).

| Rastreabilidade | Código | Nome | Descrição |
|---|---|---|---|
| OE1 - CP1 | **RF01101** | Cadastrar usuário | O sistema deve permitir que o usuário se cadastre no sistema, com informações: dados do usuário como nome, sobrenome, apelido, contato, altura, peso, envergadura, foto de perfil, senha, frequencia da realização da atividade física, objetivos, histórico de lesões, histórico de aptidão física e resultado de treinos. |
| OE1 - CP1; OE4 - CP7 | **RF01102** | Logar usuário | O sistema deve permitir que usuários cadastrados se autentiquem por apelido e senha, identificando o perfil associado à conta autenticada (treinador ou atleta). |
| OE1 - CP1 | **RF01103** | Deslogar usuário | O sistema deve permitir que o usuário possa deslogar do seu perfil. |
| OE1 - CP1 | **RF01104** | Editar informações do perfil | O sistema deve permitir que o atleta edite seus dados pessoais por exemplo nome, sobrenome, apelido, contato, altura, peso, envergadura e foto de perfil. Já as informações que envolvem análise do treinador como resultados dos treinos, objetivos, histórico de lesões, histórico de aptidão física, só poderão ser editadas pelo treinador. |
| OE1 - CP1 | **RF01105** | Excluir usuário | O sistema deve permitir que apenas o treinador exclua usuário que não são mais atletas do treinador. |
| OE1 - CP1 | **RF01106** | Criar senha aleatória | O sistema deve criar uma senha aleatória com letras, números e caracteres e mandar para o email vinculado ao usuário para primeiro acesso. |
| OE1 - CP1 | **RF01107** | Trocar senha | O sistema deve permitir o usuário de mudar senha, sendo após o primeiro acesso de quesito obrigatório, seguindo os critérios de aceite: mínimo 6 caracteres, mínimo um caracter especial e mínimo um número. |
| OE1 - CP2 | **RF01208** | Consultar orientações e erros | O sistema deve permitir que o treinador e o atleta consultem as orientações e erros dos exercícios associados ao atleta. |
| OE1 - CP2 | **RF01209** | Consultar dificuldade | O sistema deve permitir que o treinador consulte as dificuldades dos respectivos treinos orientados. |
| OE1 - CP2 | **RF01210** | Registrar dificuldade | O sistema deve permitir que o atleta registre o nível de dificuldade em uma escala de 1 a 5 que sentiu ao realizar o exercício. |
| OE1 - CP2 | **RF01211** | Editar dificuldade | O sistema deve permitir que o atleta modifique o nível de dificuldade da escala de 1 a 5 que sentiu ao realizar o exercício, enquanto o treino passado estiver disponível para o atleta. |
| OE1 - CP2 | **RF01212** | Editar status exercícios | O sistema deve permitir que o treinador modifique os status dos exercícios ("Concluído", "A fazer", "Corrigir") de acordo com a análise presencial do treinador ou vídeo enviado pelo atleta, quando houver. |
| OE1 - CP2 | **RF01213** | Adicionar testes | O sistema deve permitir que o treinador acrescente testes de aptidão física. |
| OE1 - CP2 | **RF01214** | Remover testes | O sistema deve permitir que o treinador exclua testes de aptidão física. |
| OE 2 - CP3 | **RF02301** | Cadastrar planejamento | O sistema deve permitir que o treinador registre o planejamento de treinamento de cada atleta. |
| OE 2 - CP3 | **RF02302** | Editar planejamento | O sistema deve permitir que o treinador altere o planejamento de treinamento de cada atleta. |
| OE 2 - CP3 | **RF02303** | Associar treino a objetivo | O sistema deve permitir que o treinador associe cada treino planejado aos respectivos objetivos do atleta. |
| OE 2 - CP3 | **RF02304** | Consultar histórico de planejamento | O sistema deve permitir que o treinador consulte o histórico das alterações realizadas nos planejamentos de treinamento. |
| OE 2 - CP3 | **RF02305** | Comparar treinamentos | O sistema deve permitir que o treinador visualize um relatório comparativo entre os treinos planejados e os realizados por cada atleta, para que seja analisado os resultados do treinamento do atleta. |
| OE 2 - CP3 | **RF02306** | Consultar status de treino | O sistema deve permitir que o treinador identifique o estado de cada treino planejado, como não iniciado, em andamento ou concluído. |
| OE 2 - CP3 | **RF02307** | Registrar adaptação de treino | O sistema deve permitir que o treinador registre alterações realizadas em um treino planejado, podendo informar uma justificativa ou observação relacionada à alteração. |
| OE 2 - CP4 | **RF02408** | Cadastrar exercício | O sistema deve permitir que o treinador cadastre um exercício informando seu objetivo, fundamento e orientações para sua execução. |
| OE 2 - CP4 | **RF02409** | Filtrar exercícios por fundamento | O sistema deve permitir que o treinador filtre os exercícios da biblioteca de acordo com o fundamento esportivo associado. |
| OE 2 - CP4 | **RF02410** | Associar exercício a objetivo | O sistema deve permitir que o treinador associe um exercício a um ou mais objetivos de treinamento. |
| OE 2 - CP4 | **RF02411** | Documentar erros e orientações | O sistema deve permitir que o treinador associe erros comuns e respectivas orientações corretivas aos exercícios cadastrados. |
| OE2 - CP4 | **RF02412** | Gerar thumbnail de vídeo base | O sistema deve permitir que o treinador faça o upload de uma imagem em miniatura (thumbnail) personalizada para o vídeo base do exercício ou, caso não seja enviada, deve gerar e exibir uma miniatura automaticamente a partir de um frame do arquivo de vídeo cadastrado. |
| OE2 - CP4 | **RF02413** | Cadastrar descrição breve de vídeo base | O sistema deve disponibilizar um campo de texto resumido (descrição breve) associado a cada vídeo base da biblioteca de exercícios, permitindo que o treinador cadastre e edite essa informação e que atletas e treinadores a visualizem durante a consulta. |
| OE3 - CP5 | **RF03501** | Enviar vídeo de execução | Permitir que o atleta grave ou selecione um vídeo do dispositivo e o envie vinculado a um exercício específico do seu treino. |
| OE3 - CP5 | **RF03502** | Substituir vídeo enviado | Permitir que o atleta substitua o vídeo vinculado a um exercício, desde que o treinador ainda não tenha registrado feedback sobre ele. |
| OE3 - CP5 | **RF03503** | Excluir vídeo enviado | Permitir que o atleta exclua um vídeo já enviado, desde que o treinador ainda não tenha registrado feedback sobre ele. |
| OE3 - CP6 | **RF03601** | Registrar feedback | Permitir que o treinador registre um feedback textual vinculado ao vídeo e ao exercício enviado por um atleta sob seu acompanhamento. |
| OE3 - CP6 | **RF03602** | Editar feedback | Permitir que o treinador edite um feedback que ele mesmo registrou anteriormente. |
| OE3 - CP6 | **RF03603** | Excluir feedback | Permitir que o treinador exclua um feedback que ele mesmo registrou anteriormente. |
| OE3 - CP6 | **RF03604** | Notificar atleta sobre feedback | O sistema deve notificar o atleta quando um feedback for registrado ou editado pelo treinador para um vídeo enviado por ele. |
| OE4 - CP7 | **RF04702** | Consultar atletas acompanhados | O sistema deve permitir que o treinador autenticado consulte a lista dos atletas vinculados ao seu acompanhamento, sem listar atletas sem vínculo autorizado. A consulta às informações de perfil de um atleta selecionado é descrita em RF04811. |
| OE4 - CP8 | **RF04803** | Consultar próprios dados cadastrais | O sistema deve permitir que o atleta autenticado consulte seus próprios dados cadastrais, sem acessar os dados cadastrais de outro atleta. |
| OE4 - CP8 | **RF04804** | Consultar próprios resultados de testes | O sistema deve permitir que o atleta autenticado consulte os resultados de testes associados à sua conta, sem acessar resultados de outros atletas. |
| OE4 - CP8 | **RF04805** | Consultar próprios vídeos enviados | O sistema deve permitir que o atleta autenticado consulte os vídeos de execução que enviou, vinculados aos respectivos exercícios, sem acessar vídeos enviados por outros atletas. |
| OE4 - CP8 | **RF04806** | Consultar vídeos de atleta acompanhado | O sistema deve permitir que o treinador autenticado consulte os vídeos de execução enviados pelos atletas sob seu acompanhamento, no contexto dos respectivos exercícios. |
| OE4 - CP8 | **RF04807** | Consultar feedback recebido | O sistema deve permitir que o atleta autenticado consulte os feedbacks individuais registrados pelo treinador para seus vídeos e exercícios, mantendo a associação ao conteúdo avaliado e sem acessar feedbacks destinados a outros atletas. |
| OE4 - CP8 | **RF04808** | Consultar próprio histórico de treinos | O sistema deve permitir que o atleta autenticado consulte seu histórico de treinos, sem acessar o histórico de outros atletas. |
| OE4 - CP8 | **RF04809** | Consultar próprios objetivos | O sistema deve permitir que o atleta autenticado consulte os objetivos registrados para ele, sem acessar os objetivos de outros atletas. |
| OE4 - CP8 | **RF04810** | Consultar próprio planejamento de treinos | O sistema deve permitir que o atleta autenticado consulte os treinos planejados para ele, sem acessar o planejamento de outros atletas. |
| OE4 - CP8 | **RF04811** | Consultar perfil de atleta acompanhado | O sistema deve permitir que o treinador autenticado consulte as informações de perfil de um atleta selecionado entre os que estão vinculados ao seu acompanhamento, sem acessar o perfil de atletas sem vínculo autorizado. |
| OE4 - CP8 | **RF04812** | Consultar resultados de testes de atleta acompanhado | O sistema deve permitir que o treinador autenticado consulte os resultados de testes dos atletas sob seu acompanhamento. |

## Requisitos Não-Funcionais


| ID do RNF | Nome | Categoria URPS+ | Descrição | Característica de Produto Associada |
|---|---|---|---|---|
| **RNF01** | Responsividade Mobile | Usabilidade | A interface deve adaptar-se a telas a partir de 360px, priorizando o uso em smartphones. | Global |
| **RNF02** | Arquitetura e Stack Tecnológica | Requisitos de Implementação | O sistema deve ser desenvolvido utilizando React (v18+) com TypeScript no frontend, Python (3.11+) com Django / Django REST Framework no backend e PostgreSQL (v15+) como SGBD relacional. | Global |
| **RNF03** | Estabilidade em Navegadores Padrão | Suportabilidade | O sistema deve operar sem falhas críticas (erros bloqueantes de navegação ou persistência) nas versões mais atuais dos navegadores ao longo do desenvolvimento: Chrome, Firefox, Edge, Safari e Opera. | Global |
| **RNF04** | Acessibilidade Digital | Usabilidade | A interface web deve garantir acessibilidade visual focada em daltonismo e baixa visão, aplicando paleta de cores com contraste mínimo de 4.5:1 (conforme WCAG 2.1 AA - Critério 1.4.3) e independência de cor como único meio de transmitir informação. | Global |
| **RNF05** | Proteção e Privacidade de Dados - Conformidade parcial com LGPD | Confiabilidade | O sistema deve garantir a privacidade e proteção dos dados dos usuários em conformidade parcial com a LGPD (Lei nº 13.709/2018), com foco nos artigos 5º, 14º, 18º e 46º. | Global / CP8 |
| **RNF06** | Compatibilidade de Vídeo | Suportabilidade | O sistema deve aceitar e processar submissões de ficheiros de vídeo nos formatos .mp4 e .mov. | CP5, CP6 |
| **RNF07** | Feedback Visual de Upload | Usabilidade | A aplicação web deve exibir um indicador visual de progresso dinâmico (com porcentagem de 1% a 99%) durante a submissão do vídeo, informando o estado em tempo real até ao término (100%). | CP5 |
| **RNF08** | Interface de Feedback Anotado | Usabilidade | A interface do treinador deve permitir a associação de notas e observações textuais diretamente vinculadas à linha do tempo dos vídeos enviados pelos atletas. | CP6 |
| **RNF09** | Controle de Acesso Baseado em Funções (RBAC) | Confiabilidade / Segurança | O sistema deve aplicar controle de acesso rígido (Role-Based Access Control), garantindo que endpoints e visões referentes ao perfil Treinador não sejam acessíveis por Atletas. | CP7 |
| **RNF10** | Isolamento Multi-inquilino de Dados | Confiabilidade / Segurança | O acesso aos vídeos, dados de histórico e feedbacks de um atleta deve ser restrito exclusivamente ao próprio atleta e aos treinadores devidamente vinculados a ele. | CP8 |
| **RNF11** | Desempenho no Carregamento do Histórico | Desempenho | As telas de consulta de histórico, perfil e gráficos de evolução do atleta devem carregar completamente em até 5 segundos sob simulação de limitação de rede (throttling em perfil Fast 4G no DevTools dos navegadores homologados) e sob carga nominal de até 50 requisições simultâneas ao servidor. | CP1, CP2 |
| **RNF12** | Integridade na Catalogação de Exercícios | Confiabilidade | A base da biblioteca de exercícios deve suportar consultas por filtros combinados (objetivos, fundamentos e materiais) sem inconsistência de índices. | CP4 |
| **RNF13** | Resiliência e Armazenamento Protegido de Mídias | Confiabilidade / Segurança | O upload dos vídeos enviados pelos atletas deve ser processado e persistido de forma isolada em armazenamento em nuvem com criptografia em repouso (AES-256). | CP5, CP8 |
| **RNF14** | Restrição de Duração e Tamanho de Mídias | Suportabilidade / Usabilidade | Os vídeos de execução enviados pelos atletas devem possuir duração máxima de 60 segundos e limite de tamanho de até 100 MB. | CP5 |
| **RNF15** | Assistência e Validação no Preenchimento de Dados | Usabilidade | O sistema deve aplicar máscaras de entrada em tempo real, destacar campos obrigatórios e validar formatos antes do envio do formulário, prevenindo erros de digitação. | CP1, CP3 |
| **RNF16** | Gerenciamento Pré-Envio de Mídia | Usabilidade | A interface deve limitar a seleção de arquivos a 1 único arquivo por vez no campo de upload, apresentando botão de remoção/substituição antes da confirmação do envio. | CP5 |
| **RNF17** | Consentimento de Cookies | Confiabilidade | A aplicação web deve apresentar um aviso de consentimento de cookies no primeiro acesso, permitindo ao utilizador escolher entre "Aceitar Todos" ou "Apenas Essenciais" (LGPD Art. 7º e 8º). | Global / CP8 |
| **RNF18** | Persistência de Dados | Confiabilidade | O sistema deve garantir que as informações cadastradas e os vídeos dos treinadores permaneçam armazenadas após reinicializações ou atualizações do sistema. | Global |