# Critérios de aceitação

Os critérios também podem ser consultados dentro das fichas do catálogo. Esta página reúne seus registros de forma individualizada por história de usuário, eliminando agrupamentos e garantindo rastreabilidade BDD dedicada.

[Voltar ao catálogo](requisitos.md) · [Regras de negócio](regras_negocio.md)

<p class="sj-reference-status">Em revisão: critérios de acesso, desempenho e privacidade complementados pelos cenários funcionais de cada consulta.</p>

<details class="sj-document-details" markdown="1"><summary>Como ler os critérios e seus vínculos</summary>

## Uso das representações

A história expressa ator, intenção e valor. O cenário BDD delimita condições, ação e resultado verificável. Casos de uso complementam fluxos e exceções quando necessário, sem duplicação desnecessária.

<span id="referencias-conciliadas"></span>

</details>

## Consultar por história {#consultar-por-historia}

---

## US01 — Cadastrar perfil (Atleta) {#ca-us01}
<div id="ca-us01-01" class="sj-criterion"><p><strong>CA01 (Vínculo Obrigatório):</strong> Dado que um novo atleta preenche o formulário de cadastro, Quando ele insere um Código Único de Treinador válido, Então o sistema cria a conta e o vincula automática e exclusivamente à carteira desse treinador (<a href="../regras_negocio/#rn02">RN02</a>).</p></div>
<div id="ca-us01-02" class="sj-criterion"><p><strong>CA02 (Validação de Dados):</strong> Dado que o usuário tenta enviar o formulário, Quando faltam dados obrigatórios ou os formatos são inválidos, Então o sistema exibe alertas na interface e bloqueia a submissão (<a href="../requisitos_nao_funcionais/#rnf15">RNF15</a>).</p></div>

## US02 — Cadastrar conta (Treinador) {#ca-us02}
<div id="ca-us02-01" class="sj-criterion"><p><strong>CA01 (Aprovação Restrita):</strong> Dado que um treinador finaliza o seu cadastro, Quando ele tenta fazer o login inicial, Então o sistema exibe uma mensagem informando que a conta aguarda autorização da administração e bloqueia o acesso (<a href="../regras_negocio/#rn01">RN01</a>).</p></div>

## US03 — Deslogar da conta {#ca-us03}
<div id="ca-us03-01" class="sj-criterion"><p><strong>CA01 (Encerramento de Sessão):</strong> Dado que o usuário está autenticado, Quando clica em "Sair", Então o sistema invalida o token de sessão e redireciona para a tela de login inicial (<a href="../requisitos_nao_funcionais/#rnf09">RNF09</a>).</p></div>

## US04 — Logar com conta própria (Atleta) {#ca-us04}
<div id="ca-us04-01" class="sj-criterion"><p><strong>CA01 (Autenticação do Atleta):</strong> Dado que o atleta insere apelido e senha corretos, Quando aciona o login, Então o sistema o autentica e redireciona para a dashboard do aluno (<a href="../requisitos_nao_funcionais/#rnf09">RNF09</a>, <a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US05 — Logar com conta própria (Treinador) {#ca-us05}
<div id="ca-us05-01" class="sj-criterion"><p><strong>CA01 (Autenticação do Treinador):</strong> Dado que o treinador insere e-mail e senha corretos, Quando aciona o login, Então o sistema o autentica e redireciona para a dashboard do treinador (<a href="../requisitos_nao_funcionais/#rnf09">RNF09</a>, <a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US06 — Excluir perfil de atleta {#ca-us06}
<div id="ca-us06-01" class="sj-criterion"><p><strong>CA01 (Exclusão por Vínculo):</strong> Dado que o treinador gerencia sua carteira, Quando seleciona um atleta e confirma a exclusão, Então o sistema inativa a conta e remove os dados (<a href="../regras_negocio/#rn05">RN05</a>).</p></div>

## US07 — Editar informações corporais e básicas (Atleta) {#ca-us07}
<div id="ca-us07-01" class="sj-criterion"><p><strong>CA01 (Restrição de Escrita do Atleta):</strong> Dado que o atleta acessa a edição de perfil, Quando altera nome, contato, peso, altura ou envergadura, Então o sistema salva as alterações permitidas mantendo dados clínicos bloqueados (<a href="../regras_negocio/#rn04">RN04</a>).</p></div>

## US08 — Trocar senha {#ca-us08}
<div id="ca-us08-01" class="sj-criterion"><p><strong>CA01 (Políticas de Segurança):</strong> Dado que o usuário define uma nova senha, Quando o texto atende aos requisitos mínimos de complexidade, Então o sistema atualiza a credencial com sucesso (<a href="../regras_negocio/#rn12">RN12</a>).</p></div>

## US09 — Editar informações do perfil (Treinador) {#ca-us09}
<div id="ca-us09-01" class="sj-criterion"><p><strong>CA01 (Atualização do Treinador):</strong> Dado que o treinador edita seus dados pessoais e de contato, Quando submete as alterações, Então o sistema atualiza o perfil cadastrado.</p></div>

## US10 — Recuperar senha {#ca-us10}
<div id="ca-us10-01" class="sj-criterion"><p><strong>CA01 (Envio de Token):</strong> Dado que o usuário solicita recuperação de senha por e-mail, Quando o endereço é válido, Então o sistema envia um link ou código temporário de uso único (<a href="../regras_negocio/#rn12">RN12</a>).</p></div>

## US11 — Registrar histórico de lesões e aptidão {#ca-us11}
<div id="ca-us11-01" class="sj-criterion"><p><strong>CA01 (Prerrogativa Clínica):</strong> Dado que o treinador acessa o perfil de um aluno da sua carteira, Quando edita o histórico de lesões ou objetivos, Então o sistema persiste as alterações (<a href="../regras_negocio/#rn04">RN04</a>).</p></div>

## US12 — Consultar dificuldade {#ca-us12}
<div id="ca-us12-01" class="sj-criterion"><p><strong>CA01 (Isolamento de Consulta):</strong> Dado que o treinador consulta as métricas de dificuldade, Quando os dados são gerados, Então refletem estritamente os atletas da sua carteira (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US13 — Registrar dificuldade {#ca-us13}
<div id="ca-us13-01" class="sj-criterion"><p><strong>CA01 (Escala Fixa):</strong> Dado que o atleta avalia a dificuldade do exercício, Quando interage com o seletor, Então a nota é restrita a valores inteiros entre 1 e 5 (<a href="../regras_negocio/#rn08">RN08</a>).</p></div>

## US14 — Editar dificuldade {#ca-us14}
<div id="ca-us14-01" class="sj-criterion"><p><strong>CA01 (Vigência da Edição):</strong> Dado que o atleta tenta alterar a dificuldade, Quando o treino ainda não está concluído, Então o sistema permite a alteração (<a href="../regras_negocio/#rn08">RN08</a>).</p></div>

## US15 — Registrar conclusão de treino {#ca-us15}
<div id="ca-us15-01" class="sj-criterion"><p><strong>CA01 (Auditoria do Treinador):</strong> Dado que o treinador analisa o desempenho ou vídeo, Quando valida a execução, Então o status do treino é alterado para "Concluído" (<a href="../regras_negocio/#rn06">RN06</a>, <a href="../regras_negocio/#rn07">RN07</a>).</p></div>

## US16 — Registrar teste de aptidão física {#ca-us16}
<div id="ca-us16-01" class="sj-criterion"><p><strong>CA01 (Vínculo de Avaliação):</strong> Dado que o treinador preenche os dados de um teste físico, Quando salva, Então o sistema vincula o resultado ao histórico do atleta (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US17 — Editar teste de aptidão física {#ca-us17}
<div id="ca-us17-01" class="sj-criterion"><p><strong>CA01 (Correção de Teste):</strong> Dado que o treinador seleciona um teste pré-existente, Quando altera os valores e salva, Então o histórico é atualizado.</p></div>

## US18 — Cadastrar planejamento de treino {#ca-us18}
<div id="ca-us18-01" class="sj-criterion"><p><strong>CA01 (Filtro de Carteira):</strong> Dado que o treinador cria um planejamento, Quando seleciona o aluno, Então a lista exibe apenas atletas da sua carteira (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US19 — Editar planejamento de treino {#ca-us19}
<div id="ca-us19-01" class="sj-criterion"><p><strong>CA01 (Modificação de Rotina):</strong> Dado que o treinador edita um planejamento vigente, Quando salva as alterações, Então o sistema atualiza a prescrição do aluno.</p></div>

## US20 — Associar planejamento a objetivo do aluno {#ca-us20}
<div id="ca-us20-01" class="sj-criterion"><p><strong>CA01 (Rastreabilidade de Metas):</strong> Dado que o treinador finaliza um planejamento, Quando associa a um objetivo de longo prazo, Então o sistema registra o vínculo.</p></div>

## US21 — Consultar histórico de planejamentos {#ca-us21}
<div id="ca-us21-01" class="sj-criterion"><p><strong>CA01 (Desempenho de Carga):</strong> Dado que o treinador consulta planejamentos passados, Quando requisita os dados, Então o carregamento ocorre em até 5 segundos (<a href="../requisitos_nao_funcionais/#rnf11">RNF11</a>).</p></div>

## US22 — Comparar treinamentos {#ca-us22}
<div id="ca-us22-01" class="sj-criterion"><p><strong>CA01 (Relatório Comparativo):</strong> Dado que o treinador solicita a comparação, Quando o sistema processa, Então exibe o comparativo entre treino planejado e realizado (<a href="../regras_negocio/#rn07">RN07</a>).</p></div>

## US23 — Consultar status de treino {#ca-us23}
<div id="ca-us23-01" class="sj-criterion"><p><strong>CA01 (Monitoramento de Estado):</strong> Dado que o treinador visualiza o treino, Quando verifica o progresso, Então o sistema exibe corretamente se está em andamento ou concluído (<a href="../regras_negocio/#rn07">RN07</a>).</p></div>

## US24 — Criar treino com exercícios {#ca-us24}
<div id="ca-us24-01" class="sj-criterion"><p><strong>CA01 (Prescrição de Séries):</strong> Dado que o treinador monta um treino, Quando seleciona exercícios da biblioteca e define parâmetros (séries/repetições), Então o treino é estruturado.</p></div>

## US25 — Editar treino {#ca-us25}
<div id="ca-us25-01" class="sj-criterion"><p><strong>CA01 (Ajuste de Parâmetros):</strong> Dado que o treinador edita um treino criado, Quando altera exercícios ou cargas, Então o sistema salva a nova configuração.</p></div>

## US26 — Excluir planejamento {#ca-us26}
<div id="ca-us26-01" class="sj-criterion"><p><strong>CA01 (Preservação Histórica):</strong> Dado que o treinador exclui um planejamento, Quando há execuções passadas, Então o histórico de treinos realizados é preservado (<a href="../regras_negocio/#rn13">RN13</a>).</p></div>

## US27 — Consultar planejamento de aluno acompanhado {#ca-us27}
<div id="ca-us27-01" class="sj-criterion"><p><strong>CA01 (Acesso Restrito do Treinador):</strong> Dado que o treinador acessa o planejamento de um aluno, Quando consulta os dados, Então visualiza estritamente os treinos da sua carteira (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US28 — Consultar histórico de treinos de aluno acompanhado {#ca-us28}
<div id="ca-us28-01" class="sj-criterion"><p><strong>CA01 (Evolução Longitudinal):</strong> Dado que o treinador consulta o histórico de treinos do aluno, Quando a listagem é gerada, Então exibe todas as execuções passadas validadas.</p></div>

## US29 — Registrar status do treino {#ca-us29}
<div id="ca-us29-01" class="sj-criterion"><p><strong>CA01 (Autonomia de Conclusão):</strong> Dado que o atleta finaliza o treino, Quando marca o status como concluído, Então o sistema atualiza o registro para acompanhamento do treinador (<a href="../regras_negocio/#rn07">RN07</a>).</p></div>

## US30 — Cadastrar exercício {#ca-us30}
<div id="ca-us30-01" class="sj-criterion"><p><strong>CA01 (Integridade do Catálogo):</strong> Dado que o treinador cadastra um exercício na biblioteca, Quando informa objetivo, fundamento e orientações, Então o item fica disponível para prescrição (<a href="../regras_negocio/#rn14">RN14</a>).</p></div>

## US31 — Filtrar exercícios por fundamento {#ca-us31}
<div id="ca-us31-01" class="sj-criterion"><p><strong>CA01 (Busca Específica):</strong> Dado que o treinador aplica filtros na biblioteca, Quando seleciona um fundamento, Então o sistema exibe apenas os exercícios correspondentes (<a href="../requisitos_nao_funcionais/#rnf12">RNF12</a>).</p></div>

## US32 — Associar exercício ao objetivo do treino {#ca-us32}
<div id="ca-us32-01" class="sj-criterion"><p><strong>CA01 (Padronização de Prescrição):</strong> Dado que o treinador vincula o exercício ao objetivo, Quando salva, Então o sistema cataloga a relação.</p></div>

## US33 — Associar erros e orientações {#ca-us33}
<div id="ca-us33-01" class="sj-criterion"><p><strong>CA01 (Alerta Preventivo):</strong> Dado que o treinador cadastra orientações de falhas, Quando o exercício é prescrito, Então os alertas ficam visíveis ao aluno.</p></div>

## US34 — Linkar thumbnail de vídeo base {#ca-us34}
<div id="ca-us34-01" class="sj-criterion"><p><strong>CA01 (Miniatura Visual):</strong> Dado que o treinador envia uma thumbnail ou o sistema gera um frame automático, Quando processado, Então a imagem ilustra o vídeo base.</p></div>

## US35 — Cadastrar informações complementares do vídeo base {#ca-us35}
<div id="ca-us35-01" class="sj-criterion"><p><strong>CA01 (Suporte Visual):</strong> Dado que o treinador cadastra um vídeo base, Quando preenche título e descrição, Então os metadados são exibidos na consulta.</p></div>

## US36 — Documentar erros e orientações {#ca-us36}
<div id="ca-us36-01" class="sj-criterion"><p><strong>CA01 (Instrução Correta):</strong> Dado que o treinador documenta os erros comuns, Quando o aluno visualiza o exercício, Então lê as orientações adequadas.</p></div>

## US37 — Editar erros e orientações {#ca-us37}
<div id="ca-us37-01" class="sj-criterion"><p><strong>CA01 (Atualização de Instruções):</strong> Dado que o treinador edita os erros comuns de um exercício, Quando salva, Então as novas orientações substituem as anteriores.</p></div>

## US38 — Consultar exercício da biblioteca {#ca-us38}
<div id="ca-us38-01" class="sj-criterion"><p><strong>CA01 (Revisão Técnica):</strong> Dado que o treinador consulta os detalhes do exercício, Quando abre o registro, Então visualiza objetivo, fundamento, orientações e vídeo base.</p></div>

## US39 — Editar exercício {#ca-us39}
<div id="ca-us39-01" class="sj-criterion"><p><strong>CA01 (Manutenção do Catálogo):</strong> Dado que o treinador edita um exercício cadastrado, Quando submete as alterações, Então os dados são atualizados globalmente.</p></div>

## US40 — Excluir exercício {#ca-us40}
<div id="ca-us40-01" class="sj-criterion"><p><strong>CA01 (Exclusão Segura):</strong> Dado que o treinador remove um exercício, Quando ele já foi utilizado em treinos anteriores, Então o sistema preserva o histórico mantendo a integridade referencial (<a href="../regras_negocio/#rn13">RN13</a>).</p></div>

## US41 — Pesquisar exercício por nome {#ca-us41}
<div id="ca-us41-01" class="sj-criterion"><p><strong>CA01 (Busca Textual):</strong> Dado que o treinador digita o nome do exercício na barra de pesquisa, Quando aciona a busca, Então o sistema retorna os itens correspondentes.</p></div>

## US42 — Enviar vídeo de execução {#ca-us42}
<div id="ca-us42-01" class="sj-criterion"><p><strong>CA01 (Restrições de Submissão):</strong> Dado que o atleta faz upload de vídeo, Quando o arquivo excede 100MB, 60 segundos ou formato inválido, Então o sistema bloqueia e exibe erro (<a href="../requisitos_nao_funcionais/#rnf06">RNF06</a>, <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a>).</p></div>
<div id="ca-us42-02" class="sj-criterion"><p><strong>CA02 (Progresso Visual):</strong> Dado que o arquivo cumpre as regras, Quando o upload é realizado, Então exibe barra de progresso de 1% a 99% (<a href="../requisitos_nao_funcionais/#rnf07">RNF07</a>, <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a>).</p></div>

## US43 — Substituir vídeo enviado {#ca-us43}
<div id="ca-us43-01" class="sj-criterion"><p><strong>CA01 (Bloqueio por Avaliação):</strong> Dado que o atleta deseja substituir o vídeo enviado, Quando o treinador já registrou feedback, Então o botão fica inativo (<a href="../regras_negocio/#rn10">RN10</a>).</p></div>

## US44 — Excluir vídeo enviado {#ca-us44}
<div id="ca-us44-01" class="sj-criterion"><p><strong>CA01 (Remoção Pré-Avaliação):</strong> Dado que o atleta quer excluir o vídeo, Quando nenhum feedback foi emitido, Então o sistema permite a exclusão (<a href="../regras_negocio/#rn10">RN10</a>).</p></div>

## US45 — Registrar feedback {#ca-us45}
<div id="ca-us45-01" class="sj-criterion"><p><strong>CA01 (Vínculo de Mídia):</strong> Dado que o treinador avalia o vídeo do aluno, Quando salva suas anotações, Então o feedback fica permanentemente anexado ao exercício (<a href="../regras_negocio/#rn11">RN11</a>).</p></div>

## US46 — Editar feedback {#ca-us46}
<div id="ca-us46-01" class="sj-criterion"><p><strong>CA01 (Autoria Exclusiva):</strong> Dado que o treinador edita uma avaliação, Quando ele é o autor original, Então o sistema permite a alteração (<a href="../regras_negocio/#rn11">RN11</a>).</p></div>

## US47 — Excluir feedback {#ca-us47}
<div id="ca-us47-01" class="sj-criterion"><p><strong>CA01 (Remoção por Autor):</strong> Dado que o treinador exclui um feedback, Quando validada a autoria, Então a anotação é removida (<a href="../regras_negocio/#rn11">RN11</a>).</p></div>

## US48 — Notificar atleta sobre feedback {#ca-us48}
<div id="ca-us48-01" class="sj-criterion"><p><strong>CA01 (Gatilho de Alerta):</strong> Dado que o treinador publica um feedback, Quando a ação é salva, Então o sistema envia imediatamente um alerta visual ao atleta.</p></div>

## US49 — Consultar alunos acompanhados {#ca-us49}
<div id="ca-us49-01" class="sj-criterion"><p><strong>CA01 (Lista de Alunos):</strong> Dado que o treinador acessa sua carteira, Quando a tela carrega, Então visualiza estritamente os alunos vinculados (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US50 — Consultar próprios dados cadastrais {#ca-us50}
<div id="ca-us50-01" class="sj-criterion"><p><strong>CA01 (Privacidade do Atleta):</strong> Dado que o atleta consulta seus dados, Quando tenta forçar ID de outro usuário na URL, Então a API retorna Erro 403 (<a href="../requisitos_nao_funcionais/#rnf05">RNF05</a>, <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a>).</p></div>

## US51 — Consultar próprios testes de aptidão física {#ca-us51}
<div id="ca-us51-01" class="sj-criterion"><p><strong>CA01 (Isolamento de Testes):</strong> Dado que o atleta consulta seus testes físicos, Quando a listagem abre, Então visualiza apenas seus próprios resultados.</p></div>

## US52 — Consultar próprios vídeos enviados {#ca-us52}
<div id="ca-us52-01" class="sj-criterion"><p><strong>CA01 (Acesso Restrito a Mídias):</strong> Dado que o atleta consulta seus vídeos, Quando a requisição é feita, Então exibe apenas as mídias enviadas por sua conta.</p></div>

## US53 — Consultar vídeos de alunos {#ca-us53}
<div id="ca-us53-01" class="sj-criterion"><p><strong>CA01 (Visão do Treinador):</strong> Dado que o treinador consulta vídeos, Quando abre o exercício do aluno, Então acessa a mídia enviada pelos atletas da sua carteira (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US54 — Consultar feedback recebido {#ca-us54}
<div id="ca-us54-01" class="sj-criterion"><p><strong>CA01 (Visualização de Avaliações):</strong> Dado que o atleta consulta feedbacks, Quando abre o exercício, Então visualiza exclusivamente as notas e orientações do seu treinador.</p></div>

## US55 — Consultar próprio histórico de treinos {#ca-us55}
<div id="ca-us55-01" class="sj-criterion"><p><strong>CA01 (Histórico Individual):</strong> Dado que o atleta consulta seu histórico, Quando a página carrega, Então exibe suas execuções anteriores sem exposição a terceiros.</p></div>

## US56 — Consultar próprios objetivos do aluno {#ca-us56}
<div id="ca-us56-01" class="sj-criterion"><p><strong>CA01 (Metas Pessoais):</strong> Dado que o atleta consulta seus objetivos, Quando acessa o painel, Então visualiza as metas definidas pelo seu treinador.</p></div>

## US57 — Consultar próprio planejamento de treinos {#ca-us57}
<div id="ca-us57-01" class="sj-criterion"><p><strong>CA01 (Rotina Vigente):</strong> Dado que o atleta consulta seu planejamento, Quando abre a agenda, Então visualiza apenas os treinos prescritos para si.</p></div>

## US58 — Consultar perfil de aluno acompanhado {#ca-us58}
<div id="ca-us58-01" class="sj-criterion"><p><strong>CA01 (Dados Clínicos e Corporais):</strong> Dado que o treinador consulta o perfil do aluno, Quando o painel abre, Então visualiza dados completos do atleta vinculado (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>

## US59 — Consultar resultados de testes físicos de aluno {#ca-us59}
<div id="ca-us59-01" class="sj-criterion"><p><strong>CA01 (Evolução Esportiva):</strong> Dado que o treinador consulta os testes do aluno, Quando a tabela é gerada, Então exibe o histórico de avaliações físicas.</p></div>

## US60 — Aceitar termos de uso e política de privacidade {#ca-us60}
<div id="ca-us60-01" class="sj-criterion"><p><strong>CA01 (Consentimento Obrigatório):</strong> Dado que o usuário realiza o primeiro acesso, Quando visualiza os termos, Então o sistema exige aceite explícito registrando data e versão (<a href="../regras_negocio/#rn15">RN15</a>).</p></div>

## US61 — Solicitar exclusão dos próprios dados {#ca-us61}
<div id="ca-us61-01" class="sj-criterion"><p><strong>CA01 (Direito ao Esquecimento - LGPD):</strong> Dado que o titular solicita exclusão, Quando aciona o comando, Então o sistema processa a remoção ou anonimização de dados conforme art. 18 da LGPD (<a href="../regras_negocio/#rn05">RN05</a>).</p></div>

## US62 — Registrar consentimento de responsável por aluno menor {#ca-us62}
<div id="ca-us62-01" class="sj-criterion"><p><strong>CA01 (Proteção de Menores):</strong> Dado que o aluno possui menos de 18 anos, Quando realiza o cadastro, Então o sistema exige o registro prévio do consentimento do responsável legal (<a href="../regras_negocio/#rn16">RN16</a>).</p></div>