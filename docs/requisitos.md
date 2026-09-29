# Requisitos

## Requisitos Funcionais

Os requisitos funcionais do sistema são apresentados na tabela abaixo. A coluna **Rastreabilidade** relaciona cada requisito ao seu respectivo Objetivo Específico (OE) e Característica do Produto (CP).

| Rastreabilidade | Código | Nome | Descrição |
|---|---|---|---|
| OE1 - CP1 | RF01101 | Cadastrar usuário | O sistema deve permitir que apenas o treinador cadastre um usuário novo, com as informações necessárias: dados do usuário, objetivos, histórico de lesões, histórico de aptidão física e resultado de treinos. |
| OE1 - CP1 | RF01102 | Logar usuário | O sistema deve permitir o login de todos os usuários devidamente cadastrados na aplicação, solicitando apelido e senha. |
| OE1 - CP1 | RF01103 | Deslogar usuário | O sistema deve permitir que o usuário possa deslogar do seu perfil. |
| OE1 - CP1 | RF01104 | Editar informações do perfil | O sistema deve permitir que o atleta edite seus dados pessoais, sendo as outras informações do perfil editadas apenas pelo treinador. |
| OE1 - CP1 | RF01105 | Trocar foto de perfil | O sistema deve permitir que o atleta altere a foto do seu perfil. |
| OE1 - CP1 | RF01106 | Excluir usuário | O sistema deve permitir que apenas o treinador exclua usuários inativos. |
| OE1 - CP1 | RF01107 | Criar senha aleatória | O sistema deve criar uma senha aleatória com letras, números e caracteres e enviá-la para o e-mail vinculado ao usuário para primeiro acesso. |
| OE1 - CP1 | RF01108 | Trocar senha | O sistema deve permitir que o usuário altere sua senha, sendo a troca obrigatória após o primeiro acesso, seguindo os critérios: mínimo de 6 caracteres, mínimo de um caractere especial e mínimo de um número. |
| OE1 - CP2 | RF01209 | Consultar orientações e erros | O sistema deve permitir que o treinador e o atleta consultem as orientações e erros dos exercícios associados ao atleta. |
| OE1 - CP2 | RF01210 | Consultar dificuldade | O sistema deve permitir que o treinador consulte as dificuldades dos respectivos treinos orientados. |
| OE1 - CP2 | RF01211 | Registrar dificuldade | O sistema deve permitir que o atleta registre o nível de dificuldade que sentiu ao realizar o treino. |
| OE1 - CP2 | RF01212 | Editar dificuldade | O sistema deve permitir que o atleta modifique o nível de dificuldade do treino. |
| OE1 - CP2 | RF01213 | Editar status exercícios | O sistema deve permitir que o treinador modifique os status dos exercícios ("Concluído", "A fazer", "Corrigir") de acordo com a análise do vídeo do atleta realizando o treino e suas orientações. |
| OE1 - CP2 | RF01214 | Consultar histórico de testes | O sistema deve permitir que o treinador consulte o histórico de testes de aptidão física de cada jogador e os atletas consultem seu próprio histórico. |
| OE1 - CP2 | RF01215 | Adicionar testes | O sistema deve permitir que o treinador acrescente testes de aptidão física. |
| OE1 - CP2 | RF01216 | Remover testes | O sistema deve permitir que o treinador exclua testes de aptidão física. |
| OE2 - CP3 | RF02301 | Planejar o treinamento | O sistema deve permitir que o treinador registre, organize e altere o planejamento de treinamento de cada atleta, associando os treinos aos respectivos objetivos e mantendo o histórico dessas informações. |
| OE2 - CP3 | RF02302 | Acompanhar histórico | O sistema deve permitir que o treinador acompanhe o histórico de treinamentos de cada atleta, possibilitando a comparação entre o que foi planejado e o que foi realizado. |
| OE2 - CP3 | RF02303 | Acompanhar status de treino | O sistema deve permitir que o treinador identifique o estado de cada treino planejado, como não iniciado, em andamento ou concluído. |
| OE2 - CP3 | RF02304 | Registrar adaptação de treino | O sistema deve permitir que o treinador registre alterações realizadas em um treino planejado, incluindo a justificativa ou observação relacionada à alteração. |
| OE2 - CP4 | RF02405 | Cadastrar exercício | O sistema deve permitir que o treinador cadastre um exercício informando seu objetivo, fundamento e orientações para sua execução. |
| OE2 - CP4 | RF02406 | Documentar erros e orientações | O sistema deve permitir que o treinador associe erros comuns e respectivas orientações corretivas aos exercícios cadastrados. |
| OE2 - CP4 | RF02407 | Associar exercício a objetivo | O sistema deve permitir que o treinador associe um exercício a um ou mais objetivos de treinamento. |
| OE2 - CP4 | RF02408 | Filtrar exercícios por fundamento | O sistema deve permitir que o treinador filtre os exercícios da biblioteca de acordo com o fundamento esportivo associado. |
| OE3 - CP5 | RF03501 | Enviar vídeo de execução | O sistema deve permitir que o atleta grave ou selecione um vídeo do dispositivo e o envie vinculado a um exercício específico do seu treino. |
| OE3 - CP5 | RF03502 | Substituir vídeo enviado | O sistema deve permitir que o atleta substitua o vídeo vinculado a um exercício, desde que o treinador ainda não tenha registrado feedback sobre ele. |
| OE3 - CP5 | RF03503 | Excluir vídeo enviado | O sistema deve permitir que o atleta exclua um vídeo já enviado, desde que o treinador ainda não tenha registrado feedback sobre ele. |
| OE3 - CP6 | RF03601 | Registrar feedback | O sistema deve permitir que o treinador registre um feedback textual vinculado ao vídeo e ao exercício enviado por um atleta sob seu acompanhamento. |
| OE3 - CP6 | RF03602 | Editar feedback | O sistema deve permitir que o treinador edite um feedback que ele mesmo registrou anteriormente. |
| OE3 - CP6 | RF03603 | Excluir feedback | O sistema deve permitir que o treinador exclua um feedback que ele mesmo registrou anteriormente. |
| OE3 - CP6 | RF03604 | Notificar atleta sobre feedback | O sistema deve notificar o atleta quando um feedback for registrado ou editado pelo treinador para um vídeo enviado por ele. |
| OE4 - CP7 | RF04701 | Autenticar usuário | O sistema deve permitir que treinador e atleta acessem suas respectivas contas por meio de credenciais individuais, identificando o perfil do usuário autenticado. |
| OE4 - CP7 | RF04702 | Consultar atletas acompanhados | O sistema deve permitir que o treinador autenticado consulte a relação dos atletas sob seu acompanhamento. |
| OE4 - CP8 | RF04803 | Consultar próprios dados cadastrais | O sistema deve permitir que o atleta autenticado consulte seus próprios dados cadastrais, sem acessar os dados cadastrais de outro atleta. |
| OE4 - CP8 | RF04804 | Consultar próprios resultados de testes | O sistema deve permitir que o atleta autenticado consulte os resultados de testes associados à sua conta, sem acessar resultados de outros atletas. |
| OE4 - CP8 | RF04805 | Consultar próprios vídeos enviados | O sistema deve permitir que o atleta autenticado consulte os vídeos de execução que enviou, vinculados aos respectivos exercícios, sem acessar vídeos enviados por outros atletas. |
| OE4 - CP8 | RF04806 | Consultar vídeos de atleta acompanhado | O sistema deve permitir que o treinador autenticado consulte os vídeos de execução enviados pelos atletas sob seu acompanhamento, no contexto dos respectivos exercícios. |
| OE4 - CP8 | RF04807 | Consultar feedback recebido | O sistema deve permitir que o atleta autenticado consulte os feedbacks que o treinador registrou para seus vídeos e exercícios, sem acessar feedbacks destinados a outros atletas. |
| OE4 - CP8 | RF04808 | Consultar próprio histórico de treinos | O sistema deve permitir que o atleta autenticado consulte seu histórico de treinos, sem acessar o histórico de outros atletas. |
| OE4 - CP8 | RF04809 | Consultar próprios objetivos | O sistema deve permitir que o atleta autenticado consulte os objetivos registrados para ele, sem acessar os objetivos de outros atletas. |
| OE4 - CP8 | RF04810 | Consultar próprio planejamento de treinos | O sistema deve permitir que o atleta autenticado consulte os treinos planejados para ele, sem acessar o planejamento de outros atletas. |
| OE4 - CP8 | RF04811 | Consultar perfil de atleta acompanhado | O sistema deve permitir que o treinador autenticado consulte as informações de perfil dos atletas sob seu acompanhamento. |
| OE4 - CP8 | RF04812 | Consultar resultados de testes de atleta acompanhado | O sistema deve permitir que o treinador autenticado consulte os resultados de testes dos atletas sob seu acompanhamento. |

## Requisitos Não-Funcionais


| Característica do Produto | Código | Nome | Descrição |
|---|---|---|---|
| Global | RNF01 | Responsividade Mobile | A interface deve adaptar-se a telas a partir de 360px, priorizando o uso em smartphones. |
| Global | RNF02 | Arquitetura e Stack Tecnológica | O sistema deve ser desenvolvido utilizando React (v18+) com TypeScript no frontend, Python (3.11+) com Django / Django REST Framework no backend e PostgreSQL (v15+) como SGBD relacional. |
| Global | RNF03 | Estabilidade em Navegadores Padrão | O sistema deve operar sem falhas críticas na última versão estável dos navegadores mais utilizados: Chrome, Firefox, Edge, Safari e Opera/Opera GX. |
| Global | RNF04 | Acessibilidade Digital | A plataforma deve seguir as diretrizes WCAG 2.1 (nível AA), garantindo uso por daltônicos e compatibilidade com leitores de tela. |
| Global / CP8 | RNF05 | Proteção e Privacidade de Dados - Conformidade parcial com LGPD | O sistema deve garantir a privacidade e proteção dos dados dos usuários em conformidade parcial com a LGPD (Lei nº 13.709/2018), com foco nos artigos 5º, 14º, 18º e 46º. |
| CP5 / CP6 | RNF06 | Compatibilidade de Vídeo | O sistema deve aceitar e processar submissões de ficheiros de vídeo nos formatos .mp4 e .mov. |
| CP5 | RNF07 | Feedback Visual de Upload | A aplicação web deve exibir um indicador visual de progresso dinâmico (com porcentagem de 1% a 99%) durante a submissão do vídeo, informando o estado em tempo real até ao término (100%). |
| CP6 | RNF08 | Interface de Feedback Anotado | A interface do professor deve permitir a associação de notas e observações textuais diretamente vinculadas aos vídeos de execução enviados pelos atletas. |
| CP7 | RNF09 | Controle de Acesso Baseado em Funções (RBAC) | O sistema deve aplicar controle de acesso rígido (Role-Based Access Control), garantindo que endpoints e visões referentes ao perfil Treinador não sejam acessíveis por Atletas. |
| CP8 | RNF10 | Isolamento Multi-inquilino de Dados | O acesso aos vídeos, dados de histórico e feedbacks de um atleta deve ser restrito exclusivamente ao próprio atleta e aos treinadores devidamente vinculados a ele. |
| CP1 / CP2 | RNF11 | Desempenho no Carregamento do Histórico | As telas de consulta de histórico, perfil e gráficos de evolução do atleta devem carregar completamente em até 5 segundos sob carga normal de rede. |
| CP4 | RNF12 | Integridade na Catalogação de Exercícios | A base da biblioteca de exercícios deve suportar consultas por filtros combinados (objetivos, fundamentos e materiais) sem inconsistência de índices. |
| CP5 / CP8 | RNF13 | Resiliência e Armazenamento Protegido de Mídias | O upload dos vídeos enviados pelos atletas deve ser processado e persistido de forma isolada em armazenamento em nuvem com criptografia em repouso (AES-256). |
| CP5 | RNF14 | Restrição de Duração e Tamanho de Mídias | Os vídeos de execução enviados pelos atletas devem possuir duração máxima de 60 segundos e limite de tamanho de até 100 MB. |
| CP1 / CP3 | RNF15 | Assistência e Validação no Preenchimento de Dados | O sistema deve possuir funcionalidades de autopreenchimento e validação capazes de prevenir erros na inserção de dados pelo utilizador. |
| CP4 | RNF16 | Exibição de Thumbnail nos Vídeos Base | O sistema deve permitir que o professor faça o envio (upload) de uma imagem em miniatura (thumbnail) própria para o vídeo base ou, caso ele opte por não enviar, deve gerar e exibir uma miniatura automaticamente a partir do arquivo de vídeo cadastrado. |
| CP5 | RNF17 | Gerenciamento Pré-Envio de Mídia | A interface deve limitar a seleção de arquivos a 1 único arquivo por vez no campo de upload, apresentando botão de remoção/substituição antes da confirmação do envio. |
| Global / CP8 | RNF18 | Consentimento de Cookies | A aplicação web deve apresentar um aviso de consentimento de cookies no primeiro acesso, permitindo ao utilizador/responsável optar de forma simples entre "Aceitar Todos" ou "Apenas Essenciais", em conformidade parcial com a LGPD (Lei nº 13.709/2018), com foco maior nos artigos 7º, 8º, 5º e 6º. |
| CP4 | RNF19 | Descrição Breve do Vídeo Base | A interface da biblioteca de treinos deve exibir um campo de descrição breve (texto resumido) associado a cada vídeo base do professor. |
| Global | RNF20 | Persistência de Dados | O sistema deve garantir que as informações cadastradas e os vídeos dos treinadores permaneçam armazenadas após reinicializações ou atualizações do sistema. |