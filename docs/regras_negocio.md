# Regras de negócio

Condições que orientam permissões e comportamentos do produto. Abra uma regra para ler sua declaração e consultar os requisitos relacionados. Cada regra é mantida em um único registro.

[Catálogo funcional](requisitos.md) · [Critérios de aceitação](criterios_aceitacao.md)

<p class="sj-reference-status">Catálogo consolidado de regras de negócio (RN01 a RN27) alinhado aos requisitos funcionais, não funcionais e critérios de aceitação vigentes.</p>

## Consultar regras {#consultar-regras}

## RN01 · Treinador Único com Código de Ativação {#rn01}

A plataforma possui um único treinador. O cadastro com perfil "Treinador" exige o código de ativação definido pela equipe na implantação do sistema e entregue ao treinador. Após o primeiro cadastro realizado com esse código, o cadastro de novos treinadores fica indisponível.

## RN02 · Vínculo Obrigatório de Aluno por Convite/Código {#rn02}

O cadastro de uma conta com perfil "Aluno" exige uma credencial privada (código ou convite) emitida por um treinador ativo, vinculando o aluno automática e exclusivamente à carteira desse treinador no ato do registro.

## RN03 · Isolamento de Dados e Carteira (Multi-tenant) {#rn03}

Um treinador pode visualizar, planejar e avaliar exclusivamente os dados, treinos e mídias dos alunos formalmente vinculados à sua carteira. Um aluno pode acessar exclusivamente os seus próprios registros, sem visibilidade sobre dados de outros alunos.

## RN04 · Segregação de Edição Cadastral e Clínica {#rn04}

Cada usuário possui permissão para editar apenas seus próprios dados pessoais básicos; no caso do aluno, a edição do próprio perfil ([RF1107](requisitos.md#rf1107)) é restrita aos campos **nome, sobrenome, apelido, e-mail, altura, peso, envergadura e objetivos**, aplicando as mesmas regras de unicidade ([RN24](#rn24)) e os mesmos formatos, unidades e limites definidos para o cadastro ([RN25](#rn25)), desconsiderando o próprio usuário na verificação de duplicidade de apelido e e-mail. Campos protegidos ou de vínculo (`data de nascimento`, `frequência semanal`, `telefone`, `código do treinador`, `papel` e `aceite de termos`) não são alteráveis por essa operação. O treinador também pode registrar e editar os objetivos do aluno, mas não possui permissão para editar os dados pessoais e corporais básicos dele. O registro e a edição de histórico de lesões e testes de aptidão física são prerrogativas exclusivas do treinador.

## RN05 · Política de Exclusão de Conta e Dados (LGPD) {#rn05}

O treinador vinculado pode excluir o perfil de um aluno que não esteja mais sob seu acompanhamento. Adicionalmente, qualquer titular de dados (aluno ou treinador) pode solicitar a exclusão de sua própria conta, dados pessoais, vídeos e feedbacks, respeitando-se as obrigações legais de retenção ou anonimização de registros históricos.

## RN06 · Estrutura dos Treinos e Escopo de Estados no MVP {#rn06}

Um planejamento de treinamento é composto por treinos, os quais organizam exercícios selecionados da biblioteca com seus respectivos parâmetros de execução (séries, repetições ou duração). No MVP, o controle de ciclo de vida, devolução e conclusão aplica-se exclusivamente ao nível do **treino** (conforme a [RN07](#rn07)); estados granulares por exercício individual ("A fazer", "Feito", "Concluído" ou "Corrigir/Refazer") ficam fora do escopo do MVP.

## RN07 · Estados, Devolução e Conclusão do Treino {#rn07}

Cada treino prescrito representa uma instância única de execução no MVP e possui quatro estados possíveis: **"Em andamento"**, **"Feito"**, **"Corrigir/Refazer"** e **"Concluído"**. O treino inicia com o estado **"Em andamento"**. Após realizá-lo, o aluno pode marcá-lo como **"Feito"** (registrando data e hora em `realizado_em`) ou desfazer a marcação retornando para **"Em andamento"** enquanto o treino não estiver concluído. Cabe exclusivamente ao treinador, por meio do seletor de status na área de treino do aluno, validar e registrar a conclusão formal (**"Concluído"**) ou devolver o treino para correção (**"Corrigir/Refazer"**) após análise presencial ou dos vídeos enviados. Quando devolvido como **"Corrigir/Refazer"**, o treino permanece aberto para nova execução, nova submissão de vídeo ([RN09](#rn09)) e nova marcação de **"Feito"** pelo aluno. Uma vez registrado como **"Concluído"**, o estado é irreversível no MVP e bloqueia alterações de status, dificuldade e feedbacks do aluno.

## RN08 · Escala e Vigência da Percepção de Dificuldade {#rn08}

O registro da percepção de dificuldade de um exercício pelo aluno deve obedecer à escala inteira fixa de **1 a 5**. O aluno pode alterar a nota registrada apenas enquanto o treino correspondente não estiver com o estado **"Concluído"**.

## RN09 · Limite de Mídia por Submissão de Exercício {#rn09}

Cada submissão de execução permite exatamente **1 (um) arquivo de vídeo**, restrito aos formatos `.mp4` ou `.mov`, com duração máxima de **60 segundos** e tamanho máximo de **100 MB**. Uma nova tentativa só gera nova submissão caso o treino seja devolvido para correção pelo treinador (**"Corrigir/Refazer"**, conforme a [RN07](#rn07)).

## RN10 · Imutabilidade de Vídeo Após Feedback {#rn10}

O aluno pode substituir ou excluir um vídeo de execução enviado exclusivamente enquanto o treinador ainda não tiver registrado nenhum feedback avaliativo vinculado àquela mídia.

## RN11 · Autoria Exclusiva de Feedback do Treinador {#rn11}

Apenas o treinador que registrou originalmente um feedback (textual ou anotado na linha do tempo do vídeo) possui permissão para editá-lo ou excluí-lo.

## RN12 · Política de Recuperação de Senha {#rn12}

A redefinição de senha esquecida ocorre mediante envio de código ou link temporário ao e-mail cadastrado, com prazo de validade limitado e uso único, exigindo que a nova senha atenda à política de senha da [RN24](#rn24).

## RN13 · Integridade Referencial na Exclusão de Planejamentos e Exercícios {#rn13}

A exclusão de um exercício da biblioteca ou de um planejamento de treino deve preservar intactos o histórico e os registros de treinos já realizados pelos alunos, impedindo apenas sua utilização em novas prescrições.

## RN14 · Gestão da Biblioteca Compartilhada de Exercícios {#rn14}

A biblioteca de exercícios é única e compartilhada entre os treinadores aprovados. A catalogação e edição de exercícios, vídeos-base, erros comuns e orientações corretivas são restritas a treinadores, assegurando a consistência das orientações exibidas aos alunos nos treinos prescritos.

## RN15 · Obrigatoriedade de Aceite dos Termos e Privacidade {#rn15}

O acesso às funcionalidades da plataforma é condicionado ao aceite expresso dos Termos de Uso e da Política de Privacidade vigentes no cadastro ou primeiro acesso (com registro de data e versão), sendo exigido novo aceite sempre que houver atualização dos termos.

## RN16 · Consentimento Legal para Alunos Menores de Idade {#rn16}

Para alunos com idade inferior a 18 anos, o tratamento de dados pessoais, clínicos e mídias de execução exige o registro prévio do consentimento específico de pelo menos um responsável legal, em conformidade com o art. 14 da LGPD. No recorte inicial do MVP, o cadastro exige idade mínima de 18 anos.

## RN17 · Unicidade de Feedback do Aluno por Exercício {#rn17}

Cada aluno pode registrar no máximo **1 (um) feedback** em texto livre por item de exercício dentro de um treino prescrito, armazenando a data e hora de criação (`criado_em`).

## RN18 · Privacidade do Feedback do Aluno {#rn18}

O feedback registrado pelo aluno sobre um exercício do seu treino é estritamente privado, sendo acessível exclusivamente pelo próprio aluno autor e pelo treinador responsável por sua carteira ([RN03](#rn03)).

## RN19 · Obrigatoriedade, Limite e Vigência de Criação do Feedback do Aluno {#rn19}

O feedback do aluno não pode estar vazio nem ter só espaços em branco, e tem no máximo **1.000 caracteres**. O registro de um novo feedback só é permitido enquanto o treino correspondente não estiver com o estado **"Concluído"** (conforme a [RN21](#rn21)).

## RN20 · Autoria, Edição e Imutabilidade do Feedback do Aluno {#rn20}

Só o aluno que escreveu o feedback pode editá-lo, e apenas enquanto o treino correspondente não estiver com o estado **"Concluído"**. A edição substitui o conteúdo anterior (sem histórico de versões) e atualiza a marcação de edição (`editado_em`). Nem o aluno nem o treinador podem excluir feedbacks pelo fluxo operacional do MVP (exclusão apenas via direito ao esquecimento na [RN05](#rn05)). O treinador pode consultar o feedback do aluno, mas nunca registrá-lo, editá-lo ou excluí-lo.

## RN21 · Preservação do Feedback do Aluno no Histórico {#rn21}

O feedback do aluno faz parte do histórico do treino. Depois que o treino é concluído, o registro de novos feedbacks e a edição dos existentes ficam bloqueados, tornando o conteúdo somente para leitura e disponível para consulta do treinador, respeitando o direito de exclusão previsto na [RN05](#rn05).

## RN22 · Classificação de Fundamentos dos Exercícios {#rn22}

Todo exercício cadastrado na biblioteca deve ser associado a um fundamento técnico válido da modalidade (como passe, controle/recepção, condução, finalização, cabeceio, marcação ou agilidade/coordenação), permitindo a filtragem e organização das prescrições.

## RN23 · Preservação de Snapshot do Exercício no Treino Prescrito {#rn23}

Ao incluir um exercício da biblioteca em um treino prescrito, o sistema preserva uma cópia dos dados técnicos e orientações vigentes no momento da prescrição, garantindo que edições ou exclusões posteriores na biblioteca ([RN13](#rn13)) não alterem retroativamente os treinos já prescritos ou concluídos.

## RN24 · Credenciais e Unicidade de Identificadores {#rn24}

A senha de qualquer usuário deve ter no mínimo **6 caracteres**. Na troca de senha ([RF1108](requisitos.md#rf1108)), a nova senha deve ser diferente da senha atual e passar pelas validações de confirmação e credencial atual; o aluno entra com apelido e senha, o treinador entra com e-mail e senha, o apelido e o e-mail são únicos no sistema, e em caso de falha no login a mensagem não informa qual dos dois dados está incorreto.

## RN25 · Dados Obrigatórios e Limites Cadastrais {#rn25}

O cadastro do aluno exige código do treinador, nome, sobrenome, apelido, e-mail, data de nascimento, altura, peso, envergadura, frequência de atividade física (dias por semana, inteiro de `1` a `7`), objetivos e senha, sendo o telefone opcional. Na camada de persistência e no contrato da API — tanto no cadastro ([RF1101](requisitos.md#rf1101)) quanto na edição de perfil ([RF1107](requisitos.md#rf1107)) —, altura e envergadura são armazenadas e trafegadas em metros (`Decimal(4,2)`, entre `0.50` e `2.60`, ex.: `1.85`), peso em quilogramas (`Decimal(5,2)`, entre `20.00` e `300.00`), e o texto de objetivos possui limite máximo de `500` caracteres, cabendo à interface realizar a conversão de unidade na exibição quando necessário. O cadastro do treinador exige código de ativação, nome, sobrenome, apelido, telefone, e-mail e senha. Em ambos, o aceite dos termos ([RN15](#rn15)) é obrigatório.

## RN26 · Consulta Cadastral do Aluno {#rn26}

Na consulta de dados cadastrais do aluno — seja pelo próprio aluno ([RF4802](requisitos.md#rf4802)) ou pelo treinador responsável pela sua carteira ([RF4810](requisitos.md#rf4810)) —, o retorno apresenta exclusivamente os dados vinculados à conta do aluno consultado, podendo expor o `historico_lesoes` em modo somente leitura, permanecendo sua criação e edição restritas ao treinador ([RN04](#rn04)). Credenciais de acesso (como senha) nunca são retornadas na consulta.

## RN27 · Padrão de Códigos de Erro e Bloqueio por Estado na API {#rn27}

As operações protegidas da API retornam **HTTP 401** para requisições sem autenticação válida, **HTTP 403** para falta de permissão por papel, acesso fora da carteira do treinador ou aceite de termos pendentes ([RN15](#rn15)), **HTTP 404** para recurso inexistente e **HTTP 409 (Conflict)** quando a operação é recusada devido ao estado atual do recurso (como tentar alterar dados ou estado de um treino já **"Concluído"**, ou tentar duplicar registro único).