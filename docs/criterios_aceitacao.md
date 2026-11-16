# Critérios de aceitação

Os critérios também podem ser consultados dentro das fichas do catálogo. Esta página reúne seus registros por história; grupos compartilhados são mantidos uma única vez.

[Voltar ao catálogo](requisitos.md) · [Regras de negócio](regras_negocio.md)

<p class="sj-reference-status">Em revisão: critérios de acesso, desempenho e privacidade precisam ser complementados pelos cenários funcionais de cada consulta. Registro documental não comprova implementação.</p>

<details class="sj-document-details" markdown="1"><summary>Como ler os critérios e seus vínculos</summary>

## Uso das representações

A história expressa ator, intenção e valor. O cenário BDD delimita condições, ação e resultado verificável. Casos de uso poderão complementar fluxos e exceções quando houver necessidade; não foram criados casos de uso apenas para repetir as histórias.

<span id="referencias-conciliadas"></span>

</details>

## Consultar por história {#consultar-por-historia}

## US01a — Cadastrar perfil (Atleta) {#ca-us01a}

Histórias abrangidas: US01a.

<div id="ca-us01a-01" class="sj-criterion"><p><strong>CA01 (Vínculo Obrigatório):</strong> Dado que um novo atleta preenche o formulário de cadastro, Quando ele insere um Código Único de Treinador válido, Então o sistema cria a conta e o vincula automática e exclusivamente à carteira desse treinador (<a href="../regras_negocio/#rn11">RN11</a>).</p></div>

<div id="ca-us01a-02" class="sj-criterion"><p><strong>CA02 (Validação de Dados):</strong> Dado que o usuário tenta enviar o formulário, Quando faltam dados obrigatórios ou os formatos são inválidos (ex: e-mail incorreto), Então o sistema exibe alertas na interface e bloqueia a submissão (<a href="../requisitos_nao_funcionais/#rnf15">RNF15</a>).</p></div>



## US01b — Solicitar cadastro (Treinador) {#ca-us01b}

Histórias abrangidas: US01b.

<div id="ca-us01b-01" class="sj-criterion"><p><strong>CA01 (Aprovação Restrita):</strong> Dado que um treinador finaliza o seu cadastro, Quando ele tenta fazer o login inicial, Então o sistema exibe uma mensagem informando que a conta aguarda autorização da administração e bloqueia o acesso (<a href="../regras_negocio/#rn10">RN10</a>).</p></div>



## US02 — Logar com conta própria {#ca-us02}

Histórias abrangidas: US02.

<div id="ca-us02-01" class="sj-criterion"><p><strong>CA01 (RBAC):</strong> Dado que o usuário insere credenciais ativas e corretas, Quando aciona o login, Então o sistema o autentica e redireciona para a <em>dashboard</em> correspondente ao seu perfil de acesso (Treinador ou Atleta) (<a href="../regras_negocio/#rn01">RN01</a>, <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a>).</p></div>


## US03 — Deslogar da conta {#ca-us03}

Histórias abrangidas: US03.

<div id="ca-us03-01" class="sj-criterion"><p><strong>CA01 (Encerramento de Sessão):</strong> Dado que o usuário está autenticado, Quando clica em &quot;Sair&quot;, Então o sistema invalida o token de sessão e redireciona para a tela de login inicial (<a href="../regras_negocio/#rn01">RN01</a>).</p></div>


## US04a — Editar informações corporais (Atleta) {#ca-us04a}

Histórias abrangidas: US04a.

<div id="ca-us04a-01" class="sj-criterion"><p><strong>CA01 (Restrição de Escrita):</strong> Dado que o atleta acessa a edição de perfil, Quando visualiza os campos disponíveis, Então o sistema permite a alteração apenas de nome, contato, peso, altura e envergadura, mantendo o histórico de lesões e aptidão bloqueados em modo leitura (<a href="../regras_negocio/#rn02">RN02</a>).</p></div>



## US04b — Editar informações clínicas (Treinador) {#ca-us04b}

Histórias abrangidas: US04b.

<div id="ca-us04b-01" class="sj-criterion"><p><strong>CA01 (Privilégio Clínico):</strong> Dado que o treinador acessa o perfil de um aluno da sua carteira, Quando edita as informações, Então ele possui permissão exclusiva para alterar o histórico de lesões, objetivos e dados de aptidão física (<a href="../regras_negocio/#rn02">RN02</a>).</p></div>



## US05 — Excluir perfil de atleta (Treinador) {#ca-us05}

Histórias abrangidas: US05.

<div id="ca-us05-01" class="sj-criterion"><p><strong>CA01 (Exclusão por Vínculo):</strong> Dado que o treinador gerencia a sua carteira, Quando seleciona um atleta e confirma a exclusão, Então o sistema inativa a conta do atleta, sendo esta ação permitida apenas ao treinador que o acompanha (<a href="../regras_negocio/#rn04">RN04</a>).</p></div>



## US06 — Gerar senha automática (Sistema) {#ca-us06}

Histórias abrangidas: US06.

<div id="ca-us06-01" class="sj-criterion"><p><strong>CA01 (Onboarding):</strong> Dado que uma conta de atleta é criada com sucesso, Quando o processo finaliza, Então o sistema gera uma senha provisória criptografada e envia para o e-mail cadastrado.</p></div>


<p class="sj-record-note">Revisão pendente do fluxo de primeiro acesso. O RNF15 trata de validação de formulários e não fundamenta a geração ou o envio de senha.</p>

## US07 — Trocar senha (Atleta/Treinador) {#ca-us07}

Histórias abrangidas: US07.

<div id="ca-us07-01" class="sj-criterion"><p><strong>CA01 (Obrigatoriedade no 1º Acesso):</strong> Dado que o usuário realiza o login com uma senha provisória, Quando a autenticação ocorre, Então o sistema redireciona obrigatoriamente para a tela de troca de senha .</p></div>

<div id="ca-us07-02" class="sj-criterion"><p><strong>CA02 (Políticas de Segurança):</strong> Dado que o usuário define uma nova senha, Quando o texto possui menos de 6 caracteres, não contém números ou caracteres especiais, Então o sistema recusa a alteração e exibe as regras de formatação .</p></div>


<p class="sj-record-note">Cenários funcionais deste grupo e condições sem regra própria: detalhamento pendente.</p>


## US08 — Consultar dificuldade dos alunos {#ca-us08}

Histórias abrangidas: US08.

<div id="ca-us08-01" class="sj-criterion"><p><strong>CA01 (Restrição de Visualização):</strong> Dado que o treinador consulta as métricas de treino, Quando os gráficos de dificuldade (1 a 5) são gerados, Então os dados refletem exclusivamente os atletas da sua carteira (<a href="../regras_negocio/#rn01">RN01</a>).</p></div>



## US09 e US10 — Registrar e Modificar dificuldade {#ca-us09-us10}

Histórias abrangidas: US09, US10.

<div id="ca-us09-us10-01" class="sj-criterion"><p><strong>CA01 (Escala Fixa):</strong> Dado que o atleta avalia a dificuldade de um exercício, Quando interage com o seletor, Então o sistema restringe a nota a valores inteiros entre 1 e 5 (<a href="../regras_negocio/#rn07">RN07</a>).</p></div>

<div id="ca-us09-us10-02" class="sj-criterion"><p><strong>CA02 (Vigência):</strong> Dado que o atleta tenta alterar uma dificuldade previamente registrada, Quando o status do planejamento já estiver como &quot;Expirado/Indisponível&quot;, Então o sistema bloqueia a edição da nota (<a href="../regras_negocio/#rn09">RN09</a>).</p></div>



## US11a e US11b — Modificar status dos exercícios {#ca-us11a-us11b}

Histórias abrangidas: US11a, US11b.

<div id="ca-us11a-us11b-01" class="sj-criterion"><p><strong>CA01 (Autonomia do Atleta):</strong> Dado que o atleta está executando o treino, Quando interage com o botão de status, Então ele só possui permissão para alternar entre &quot;A fazer&quot; e &quot;Concluído&quot; (<a href="../regras_negocio/#rn06">RN06</a>).</p></div>

<div id="ca-us11a-us11b-02" class="sj-criterion"><p><strong>CA02 (Auditoria do Treinador):</strong> Dado que o atleta marcou um exercício como &quot;Concluído&quot;, Quando o treinador analisa o vídeo e identifica falhas, Então o treinador tem a prerrogativa de sobrepor esse status e alterá-lo para &quot;Corrigir/Refazer&quot; (<a href="../regras_negocio/#rn06">RN06</a>).</p></div>



## US12 — Adicionar testes de aptidão física (Treinador) {#ca-us12}

Histórias abrangidas: US12.

<div id="ca-us12-01" class="sj-criterion"><p><strong>CA01 (Prerrogativa de Gestão):</strong> Dado que o treinador acessa a aba de testes do perfil de um aluno da sua carteira, Quando ele preenche os dados de uma nova avaliação física e salva, Então o sistema registra o teste e o vincula permanentemente ao histórico daquele atleta (<a href="../regras_negocio/#rn01">RN01</a>).</p></div>


<p class="sj-record-note">Cenários funcionais deste grupo e condições sem regra própria: detalhamento pendente.</p>


## US13 — Remover testes de aptidão física (Treinador) {#ca-us13}

Histórias abrangidas: US13.

<div id="ca-us13-01" class="sj-criterion"><p><strong>CA01 (Controle de Erros):</strong> Dado que o treinador visualiza os testes registados no perfil do aluno, Quando ele seleciona um registo incorreto e aciona a exclusão, Então o sistema remove o teste do histórico, sendo esta uma ação restrita exclusivamente ao treinador vinculado (<a href="../regras_negocio/#rn01">RN01</a>).</p></div>


<p class="sj-record-note">Cenários funcionais deste grupo e condições sem regra própria: detalhamento pendente.</p>


## US14 e US15 — Registrar e Modificar planejamento {#ca-us14-us15}

Histórias abrangidas: US14, US15.

<div id="ca-us14-us15-01" class="sj-criterion"><p><strong>CA01 (Filtro de Destinatários):</strong> Dado que o treinador cria um treino, Quando abre a lista de seleção de alunos, Então o sistema exibe estritamente os atletas vinculados à sua carteira (<a href="../regras_negocio/#rn01">RN01</a>).</p></div>



## US16 — Vincular treino a macro-objetivos {#ca-us16}

Histórias abrangidas: US16.

<div id="ca-us16-01" class="sj-criterion"><p><strong>CA01 (Rastreabilidade de Metas):</strong> Dado que o treinador finaliza um planejamento, Quando ele seleciona a opção de vínculo, Então o sistema permite associar aquele conjunto de exercícios a um objetivo de longo prazo previamente definido no perfil do aluno.</p></div>


## US17, US18 e US19 — Consultas e Relatórios de Treino {#ca-us17-us18-us19}

Histórias abrangidas: US17, US18, US19.

<div id="ca-us17-us18-us19-01" class="sj-criterion"><p><strong>CA01 (Performance de Carregamento):</strong> Dado que o treinador solicita o histórico ou status de treinos de um aluno, Quando a requisição é feita, Então o sistema compila e exibe a interface de dados em no máximo 5 segundos (<a href="../requisitos_nao_funcionais/#rnf11">RNF11</a>).</p></div>


## US20, US21 e US22 — Cadastrar e Filtrar Exercícios {#ca-us20-us21-us22}

Histórias abrangidas: US20, US21, US22.

<div id="ca-us20-us21-us22-01" class="sj-criterion"><p><strong>CA01 (Integridade Referencial):</strong> Dado que o treinador preenche os metadados de um novo exercício, Quando tenta adicionar fundamentos ou objetivos, Então ele só pode escolher opções já validadas e existentes no catálogo global da plataforma .</p></div>


<p class="sj-record-note">Cenários funcionais deste grupo e condições sem regra própria: detalhamento pendente.</p>


## US23, US24 e US25 — Orientação e Metadados Visuais {#ca-us23-us24-us25}

Histórias abrangidas: US23, US24, US25.

<div id="ca-us23-us24-us25-01" class="sj-criterion"><p><strong>CA01 (Suporte Visual):</strong> Dado que o treinador cadastra um vídeo base de demonstração, Quando o arquivo é anexado, Então o sistema disponibiliza campos obrigatórios para título, descrição textual da execução e registro de erros comuns.</p></div>


## US26 — Mandar vídeo de execução {#ca-us26}

Histórias abrangidas: US26.

<div id="ca-us26-01" class="sj-criterion"><p><strong>CA01 (Restrições de Submissão):</strong> Dado que o atleta tenta realizar o <em>upload</em>, Quando o arquivo ultrapassa 100MB, excede 60 segundos ou possui extensão diferente de .mp4/.mov, Então o sistema barra a ação e exibe um erro de formato (<a href="../requisitos_nao_funcionais/#rnf06">RNF06</a>, <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a>).</p></div>

<div id="ca-us26-02" class="sj-criterion"><p><strong>CA02 (Progresso Visual):</strong> Dado que o arquivo cumpre as regras técnicas, Quando o upload é iniciado rumo à nuvem criptografada, Então uma barra de progresso numérica (1% a 99%) é exibida na interface (<a href="../requisitos_nao_funcionais/#rnf07">RNF07</a>, <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a>).</p></div>



## US27 e US28 — Trocar e Excluir vídeo enviado {#ca-us27-us28}

Histórias abrangidas: US27, US28.

<div id="ca-us27-us28-01" class="sj-criterion"><p><strong>CA01 (Bloqueio por Avaliação):</strong> Dado que o atleta deseja excluir ou substituir um vídeo submetido, Quando o treinador já tiver publicado um <em>feedback</em> atrelado àquela mídia, Então os botões de exclusão e substituição ficam inativos (<a href="../regras_negocio/#rn03">RN03</a>).</p></div>



## US29 — Registrar feedback {#ca-us29}

Histórias abrangidas: US29.

<div id="ca-us29-01" class="sj-criterion"><p><strong>CA01 (Vínculo de Mídia):</strong> Dado que o treinador assiste à evidência do aluno, Quando ele salva suas anotações, Então o texto fica permanentemente anexado àquele exercício específico do planejamento.</p></div>


## US30 e US31 — Modificar e Excluir feedback {#ca-us30-us31}

Histórias abrangidas: US30, US31.

<div id="ca-us30-us31-01" class="sj-criterion"><p><strong>CA01 (Autoria):</strong> Dado que o treinador tenta editar uma avaliação passada, Quando a requisição é validada, Então o sistema só permite a modificação se o autor original do <em>feedback</em> for o próprio usuário logado (<a href="../regras_negocio/#rn08">RN08</a>).</p></div>



## US32 — Notificar atleta {#ca-us32}

Histórias abrangidas: US32.

<div id="ca-us32-01" class="sj-criterion"><p><strong>CA01 (Gatilho de Notificação):</strong> Dado que o treinador publica ou altera um feedback, Quando a ação é salva, Então o sistema envia imediatamente um alerta visual para o painel do atleta correspondente.</p></div>


## US34, US35, US36, US38, US39, US40 e US41 — Consultas Exclusivas do Atleta {#ca-us34-us35-us36-us38-us39-us40-us41}

Histórias abrangidas: US34, US35, US36, US38, US39, US40, US41.

<div id="ca-us34-us35-us36-us38-us39-us40-us41-01" class="sj-criterion"><p><strong>CA01 (Privacidade e LGPD - Atleta):</strong> Dado que o atleta navega pelas seções de histórico, vídeos, objetivos e testes, Quando ele tentar forçar na URL o ID de um recurso pertencente a outro utilizador, Então a API deve recusar o pedido (Erro 403 - <em>Forbidden</em>) e exibir apenas os dados da própria sessão (<a href="../requisitos_nao_funcionais/#rnf05">RNF05</a>, <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a>).</p></div>


<p class="sj-record-note">Cenários funcionais deste grupo e condições sem regra própria: detalhamento pendente.</p>


## US33, US37, US42 e US43 — Consultas Exclusivas do Treinador {#ca-us33-us37-us42-us43}

Histórias abrangidas: US33, US37, US42, US43.

<div id="ca-us33-us37-us42-us43-01" class="sj-criterion"><p><strong>CA01 (Isolamento de Carteira - Treinador):</strong> Dado que o treinador visualiza listas de alunos, perfis clínicos, vídeos submetidos ou resultados de aptidão, Quando a interface é carregada, Então o sistema injeta um filtro de banco de dados que retorna rigorosamente os atletas que possuam o seu ID de vínculo, ocultando totalmente o resto da base de utilizadores (<a href="../regras_negocio/#rn01">RN01</a>, <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a>, <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a>).</p></div>


<p class="sj-record-note">Cenários funcionais deste grupo e condições sem regra própria: detalhamento pendente.</p>
