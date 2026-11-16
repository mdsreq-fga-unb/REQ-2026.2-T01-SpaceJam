# Regras de negócio

Condições que orientam permissões e comportamentos do produto. Abra uma regra para ler sua declaração e consultar os requisitos relacionados. Cada regra é mantida em um único registro.

[Catálogo funcional](requisitos.md) · [Critérios de aceitação](criterios_aceitacao.md)

<p class="sj-reference-status">Em revisão: cadastro, aprovação administrativa e estados dos exercícios ainda precisam de confirmação.</p>

## Consultar regras {#consultar-regras}

## RN01 · Autorização e Aprovação de Treinadores {#rn01}

O cadastro de contas com perfil "Treinador" não possui ativação automática; a habilitação do acesso depende obrigatoriamente de análise e aprovação prévia pela administração da plataforma.

## RN02 · Vínculo Obrigatório de Atleta por Convite/Código {#rn02}

O cadastro de uma conta com perfil "Atleta" exige uma credencial privada (código ou convite) emitida por um treinador ativo, vinculando o atleta automática e exclusivamente à carteira desse treinador no ato do registro.

## RN03 · Isolamento de Dados e Carteira (Multi-tenant) {#rn03}

Um treinador pode visualizar, planejar e avaliar exclusivamente os dados, treinos e mídias dos atletas formalmente vinculados à sua carteira. Um atleta pode acessar exclusivamente os seus próprios registros, sem visibilidade sobre dados de outros atletas.

## RN04 · Segregação de Edição Cadastral e Clínica {#rn04}

Cada usuário possui permissão para editar apenas seus próprios dados pessoais básicos; no caso do atleta, isso inclui suas métricas corporais primárias (nome, apelido, contato, altura, peso, envergadura e foto). O registro e a edição de histórico de lesões, objetivos e testes de aptidão física são prerrogativas exclusivas do treinador vinculado.

## RN05 · Política de Exclusão de Conta e Dados (LGPD) {#rn05}

O treinador vinculado pode excluir o perfil de um atleta que não esteja mais sob seu acompanhamento. Adicionalmente, qualquer titular de dados (atleta ou treinador) pode solicitar a exclusão de sua própria conta, dados pessoais, vídeos e feedbacks, respeitando-se as obrigações legais de retenção ou anonimização de registros históricos.

## RN06 · Estrutura e Ciclo de Vida dos Exercícios {#rn06}

Um planejamento de treinamento é composto por treinos, os quais organizam exercícios selecionados da biblioteca com seus respectivos parâmetros de execução (séries, repetições ou duração). Todo exercício inicia com o estado **"A fazer"**; após a execução, o atleta pode alterá-lo para **"Feito"** (ou retorná-lo para **"A fazer"** enquanto não avaliado), cabendo exclusivamente ao treinador validá-lo como **"Concluído"** ou devolvê-lo como **"Corrigir/Refazer"** para nova tentativa.

## RN07 · Estados e Conclusão do Treino {#rn07}

Enquanto não estiver concluído, o treino permanece com o estado **"Em andamento"**. O atleta pode registrar a conclusão do treino após realizá-lo, e o treinador pode registrar ou confirmar a conclusão formal do treino com base em análise presencial ou dos vídeos enviados.

## RN08 · Escala e Vigência da Percepção de Dificuldade {#rn08}

O registro da percepção de dificuldade de um exercício pelo atleta deve obedecer à escala inteira fixa de **1 a 5**. O atleta pode alterar a nota registrada apenas enquanto o treino correspondente não estiver com o estado **"Concluído"**.

## RN09 · Limite de Mídia por Submissão de Exercício {#rn09}

Cada submissão de execução permite exatamente **1 (um) arquivo de vídeo**, restrito aos formatos `.mp4` ou `.mov`, com duração máxima de **60 segundos** e tamanho máximo de **100 MB**. Uma nova tentativa só gera nova submissão caso o exercício seja devolvido para correção.

## RN10 · Imutabilidade de Vídeo Após Feedback {#rn10}

O atleta pode substituir ou excluir um vídeo de execução enviado exclusivamente enquanto o treinador ainda não tiver registrado nenhum feedback avaliativo vinculado àquela mídia.

## RN11 · Autoria Exclusiva de Feedback {#rn11}

Apenas o treinador que registrou originalmente um feedback (textual ou anotado na linha do tempo do vídeo) possui permissão para editá-lo ou excluí-lo.

## RN12 · Política de Recuperação de Senha {#rn12}

A redefinição de senha esquecida ocorre mediante envio de código ou link temporário ao e-mail cadastrado, com prazo de validade limitado e uso único, exigindo que a nova credencial atenda aos critérios mínimos de segurança da plataforma.

## RN13 · Integridade Referencial na Exclusão de Planejamentos e Exercícios {#rn13}

A exclusão de um exercício da biblioteca ou de um planejamento de treino deve preservar intactos o histórico e os registros de treinos já realizados pelos atletas, impedindo apenas sua utilização em novas prescrições.

## RN14 · Gestão da Biblioteca de Exercícios {#rn14}

A catalogação e edição de exercícios, vídeos-base, erros comuns e orientações corretivas na biblioteca são restritas a treinadores, assegurando a consistência das orientações exibidas aos atletas nos treinos prescritos.

## RN15 · Obrigatoriedade de Aceite dos Termos e Privacidade {#rn15}

O acesso às funcionalidades da plataforma é condicionado ao aceite expresso dos Termos de Uso e da Política de Privacidade vigentes no cadastro ou primeiro acesso (com registro de data e versão), sendo exigido novo aceite sempre que houver atualização dos termos.

## RN16 · Consentimento Legal para Atletas Menores de Idade {#rn16}

Para atletas com idade inferior a 18 anos, o tratamento de dados pessoais, clínicos e mídias de execução exige o registro prévio do consentimento específico de pelo menos um responsável legal, em conformidade com o art. 14 da LGPD.