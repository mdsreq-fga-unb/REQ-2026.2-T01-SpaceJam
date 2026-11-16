# Regras de negócio

Condições que orientam permissões e comportamentos do produto. Abra uma regra para ler sua declaração e consultar os requisitos relacionados. Cada regra é mantida em um único registro.

[Catálogo funcional](requisitos.md) · [Critérios de aceitação](criterios_aceitacao.md)

<p class="sj-reference-status">Em revisão: cadastro, aprovação administrativa e estados dos exercícios ainda precisam de confirmação.</p>

## Consultar regras

## RN01 · Treinador Único com Código de Ativação {#rn01}
 
A plataforma possui um único treinador. O cadastro com perfil "Treinador" exige o código de ativação definido pela equipe na implantação do sistema e entregue ao treinador. Após o primeiro cadastro realizado com esse código, o cadastro de novos treinadores fica indisponível.
 
## RN02 · Vínculo Obrigatório do Aluno pelo Código do Treinador {#rn02}
 
O cadastro de uma conta com perfil "Aluno" exige o código do treinador, gerado automaticamente no cadastro do treinador e exibido no perfil dele. O código vincula o aluno automaticamente à carteira do treinador no ato do registro.
 
## RN03 · Isolamento de Dados da Carteira do Treinador {#rn03}
 
Os dados, treinos e mídias dos alunos pertencem à carteira do treinador e só podem ser visualizados, planejados e avaliados por ele. Um aluno pode acessar exclusivamente os seus próprios registros, sem visibilidade sobre dados de outros alunos.
 
## RN04 · Segregação de Edição Cadastral e Clínica {#rn04}
 
Cada usuário possui permissão para editar apenas seus próprios dados pessoais básicos; no caso do atleta, isso inclui suas métricas corporais primárias (nome, apelido, contato, altura, peso, envergadura e foto) e seus objetivos. O treinador também pode registrar e editar os objetivos do atleta. O registro e a edição de histórico de lesões e testes de aptidão física são prerrogativas exclusivas do treinador.
 
## RN05 · Política de Exclusão de Conta e Dados (LGPD) {#rn05}
 
O treinador pode excluir o perfil de um atleta que não esteja mais sob seu acompanhamento. Adicionalmente, qualquer titular de dados (atleta ou treinador) pode solicitar a exclusão de sua própria conta, dados pessoais, vídeos e feedbacks, respeitando-se as obrigações legais de retenção ou anonimização de registros históricos.
 
## RN06 · Estrutura e Ciclo de Vida dos Exercícios {#rn06}
 
Um planejamento de treinamento é composto por treinos, os quais organizam exercícios selecionados da biblioteca com seus respectivos parâmetros de execução (séries, repetições ou duração). Todo exercício inicia com o estado **"A fazer"**; após a execução, o aluno pode alterá-lo para **"Feito"** (ou retorná-lo para **"A fazer"** enquanto não avaliado), cabendo exclusivamente ao treinador validá-lo como **"Concluído"** ou devolvê-lo como **"Corrigir/Refazer"** para nova tentativa.
 
## RN07 · Estados e Conclusão do Treino {#rn07}
 
Enquanto não estiver concluído, o treino permanece com o estado **"Em andamento"**. Após realizá-lo, o aluno pode marcá-lo como **"Feito"**, e cabe exclusivamente ao treinador registrar a conclusão formal do treino (**"Concluído"**) com base em análise presencial ou dos vídeos enviados.
 
## RN08 · Escala e Vigência da Percepção de Dificuldade {#rn08}
 
O registro da percepção de dificuldade de um exercício pelo aluno deve obedecer à escala inteira fixa de **1 a 5**. O aluno pode alterar a nota registrada apenas enquanto o treino correspondente não estiver com o estado **"Concluído"**.
 
## RN09 · Limite de Mídia por Submissão de Exercício {#rn09}
 
Cada submissão de execução permite exatamente **1 (um) arquivo de vídeo**, restrito aos formatos `.mp4` ou `.mov`, com duração máxima de **60 segundos** e tamanho máximo de **100 MB**. Uma nova tentativa só gera nova submissão caso o exercício seja devolvido para correção.
 
## RN10 · Imutabilidade de Vídeo Após Feedback {#rn10}
 
O aluno pode substituir ou excluir um vídeo de execução enviado exclusivamente enquanto o treinador ainda não tiver registrado nenhum feedback avaliativo vinculado àquela mídia.
 
## RN11 · Exclusividade do Treinador sobre o Feedback {#rn11}
 
Somente o treinador pode registrar, editar ou excluir o feedback (textual ou anotado na linha do tempo do vídeo) dado a um aluno. O aluno pode apenas consultá-lo.
 
## RN12 · Política de Recuperação de Senha {#rn12}

A redefinição de senha esquecida ocorre mediante envio de código ou link temporário ao e-mail cadastrado, com prazo de validade limitado e uso único, exigindo que a nova senha atenda à política de senha da [RN24](#rn24).

## RN13 · Integridade Referencial na Exclusão de Planejamentos e Exercícios {#rn13}
 
A exclusão de um exercício da biblioteca ou de um planejamento de treino deve preservar intactos o histórico e os registros de treinos já realizados pelos atletas, impedindo apenas sua utilização em novas prescrições.
 
## RN14 · Gestão da Biblioteca de Exercícios {#rn14}
 
A catalogação e edição de exercícios, vídeos-base, erros comuns e orientações corretivas na biblioteca são restritas ao treinador, assegurando a consistência das orientações exibidas aos atletas nos treinos prescritos.
 
## RN15 · Obrigatoriedade de Aceite dos Termos e Privacidade {#rn15}
 
O acesso às funcionalidades da plataforma é condicionado ao aceite expresso dos Termos de Uso e da Política de Privacidade vigentes no cadastro ou primeiro acesso (com registro de data e versão), sendo exigido novo aceite sempre que houver atualização dos termos.
 
## RN16 · Consentimento Legal para Atletas Menores de Idade {#rn16}
 
Para atletas com idade inferior a 18 anos, o tratamento de dados pessoais, clínicos e mídias de execução exige o registro prévio do consentimento específico de pelo menos um responsável legal, em conformidade com o art. 14 da LGPD.
 
## RN17 · Unicidade do Feedback do Aluno por Exercício {#rn17}
 
Cada aluno pode ter no máximo **1 (um)** feedback textual por exercício em cada treino. Para alterar o que escreveu, o aluno edita esse feedback em vez de criar um novo.
 
## RN18 · Visibilidade do Feedback do Aluno {#rn18}
 
O feedback do aluno só pode ser visto pelo próprio aluno e pelo treinador.
 
## RN19 · Obrigatoriedade e Limite do Feedback do Aluno {#rn19}
 
O feedback do aluno não pode estar vazio nem ter só espaços em branco, e tem no máximo **1.000 caracteres**.
 
## RN20 · Autoria e Vigência da Edição do Feedback do Aluno {#rn20}
 
Só o aluno que escreveu o feedback pode editá-lo, e apenas enquanto o treino correspondente não estiver com o estado **"Concluído"**. O treinador pode consultar o feedback do aluno, mas nunca editá-lo ou excluí-lo.
 
## RN21 · Preservação do Feedback do Aluno no Histórico {#rn21}
 
O feedback do aluno faz parte do histórico do treino. Depois que o treino é concluído, o feedback fica somente para leitura e continua disponível para consulta do treinador, respeitando o direito de exclusão previsto na [RN05](#rn05).

## RN22 · Dados Obrigatórios do Exercício {#rn22}
 
Todo exercício da biblioteca deve ter nome, fundamento e objetivo preenchidos. Já orientações, erros comuns e vídeo base são opcionais. O fundamento é escolhido de uma lista fechada: Arremesso, Drible, Passe, Defesa, Rebote e Condicionamento físico.
 
## RN23 · Preservação do Exercício Prescrito {#rn23}
 
Ao ser incluído em um treino, o exercício é registrado no treino com os dados vigentes naquele momento. A edição posterior do exercício na biblioteca vale apenas para novas prescrições e não altera treinos já prescritos, em andamento ou concluídos.

## RN24 · Credenciais e Unicidade de Identificadores {#rn24}

A senha de qualquer usuário deve ter no mínimo 6 caracteres. O aluno entra com apelido e senha; o treinador entra com e-mail e senha. O apelido e o e-mail são únicos no sistema. Em caso de falha no login, a mensagem não informa qual dos dois dados está incorreto.

## RN25 · Dados Obrigatórios de Cadastro {#rn25}

O cadastro do aluno exige código do treinador, nome, sobrenome, apelido, e-mail, data de nascimento, altura (cm), peso (kg), envergadura (cm), frequência de atividade física (dias por semana, de 1 a 7), objetivos e senha. O cadastro do treinador exige código de ativação, nome, sobrenome, apelido, telefone, e-mail e senha. Em ambos, o aceite dos termos ([RN15](#rn15)) é obrigatório.
