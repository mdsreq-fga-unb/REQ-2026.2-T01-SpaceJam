# Regras de negócio

Condições que orientam permissões e comportamentos do produto. Abra uma regra para ler sua declaração e consultar os requisitos relacionados. Cada regra é mantida em um único registro.

[Catálogo funcional](requisitos.md) · [Critérios de aceitação](criterios_aceitacao.md)

<p class="sj-reference-status">Em revisão: cadastro, aprovação administrativa e estados dos exercícios ainda precisam de confirmação.</p>

## Consultar regras {#consultar-regras}

## RN01 · Acesso aos atletas vinculados {#rn01}

Um treinador tem permissão de acesso e avaliação restrita exclusivamente aos perfis, treinos e vídeos dos atletas que estejam formalmente vinculados à sua carteira de acompanhamento.

## RN02 · Permissões para editar dados do atleta {#rn02}

A edição de dados de análise clínica e esportiva (histórico de lesões, aptidão física, objetivos e resultados de treinos) é prerrogativa exclusiva do treinador. O atleta possui permissão para editar apenas seus dados cadastrais e métricas corporais primárias (nome, contato, peso, altura e envergadura).

## RN03 · Alteração de vídeos antes do feedback {#rn03}

O atleta só possui permissão para substituir ou excluir um vídeo de execução de exercício caso o treinador ainda não tenha registrado nenhum feedback avaliativo sobre aquela respectiva mídia.

## RN04 · Exclusão de perfis de atletas {#rn04}

**Exclusão de perfis de atletas:** A exclusão de um perfil de atleta somente pode ser realizada pelo treinador ao qual o atleta está formalmente vinculado. A operação deve respeitar as políticas de retenção de dados e preservar os registros históricos que precisem ser mantidos.

## RN05 · Um vídeo por submissão {#rn05}

**Limite de vídeos por submissão:** Cada submissão de exercício pode conter exatamente um arquivo de vídeo. Não é permitido anexar mais de um vídeo à mesma submissão. Uma nova tentativa de execução poderá gerar uma nova submissão quando o exercício estiver disponível para correção ou refazimento, respeitando as demais regras do sistema.

## RN06 · Estados e refazimento dos exercícios {#rn06}

**Ciclo de vida dos exercícios:** Todo exercício deve ser criado automaticamente com o status “A fazer”. O atleta pode alterar o status para “Concluído” após executar o exercício. Compete exclusivamente ao treinador responsável alterar o status para “Concluído” ou “Corrigir/Refazer”, conforme sua avaliação. Quando o exercício receber o status “Corrigir/Refazer”, o atleta poderá realizar uma nova tentativa e enviar uma nova submissão, conforme as condições estabelecidas pelo sistema.

## RN07 · Escala de dificuldade de 1 a 5 {#rn07}

O registro da percepção de dificuldade de um exercício pelo atleta deve obedecer obrigatoriamente a uma escala fixa de 1 a 5.

## RN08 · Edição e exclusão do próprio feedback {#rn08}

Um treinador possui permissão para editar ou excluir feedbacks de texto ou anotações em vídeo, desde que tenham sido registrados exclusivamente por ele mesmo.

## RN09 · Alteração de dificuldade em treino disponível {#rn09}

O atleta possui permissão para alterar o registro de nível de dificuldade (1 a 5) que atribuiu a um exercício, desde que o treino correspondente ainda esteja com o status vigente/disponível.

## RN10 · Aprovação de contas de treinador {#rn10}

**Aprovação de Treinadores:** O registro de contas com perfil "Treinador" é restrito e requer validação e autorização prévia por parte da equipe de administração da plataforma.

## RN11 · Cadastro de atleta por convite do treinador {#rn11}

O registo de uma conta de 'Atleta' exige obrigatoriamente a introdução de um Código de Convite Privado (semelhante a uma senha de acesso) fornecido exclusivamente pelo treinador, servindo como credencial de autorização para a criação do perfil e vinculação imediata à respetiva carteira multi-tenant.
