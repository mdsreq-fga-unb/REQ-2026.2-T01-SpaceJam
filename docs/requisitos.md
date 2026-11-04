<span id="requisitos-de-software"></span>

# Catálogo de requisitos

<div class="sj-catalog-intro"><p class="sj-catalog-kicker">REQUISITOS E ESCOPO</p><p class="sj-catalog-lead">Um registro por requisito. Uma consulta ao escopo.</p><p>Escolha uma característica e abra a ficha do requisito. Histórias, critérios e condições relacionados podem ser consultados a partir dela.</p><div class="sj-catalog-links"><a href="../requisitos_nao_funcionais/">RNFs</a><a href="../regras_negocio/">Regras</a><a href="../criterios_aceitacao/">Critérios por história</a></div></div>

<p class="sj-catalog-status"><strong>Escopo em revisão.</strong> O MVP reflete o recorte documentado. Confirmação e implementação precisam de evidências por item.</p>

<nav id="guia-do-catalogo" class="sj-cp-index" aria-label="Consultar por característica">
<p class="sj-cp-index-title">Escolha uma característica</p>
<div class="sj-cp-index-grid">
<a href="#cp1"><span>CP1</span><strong>Gestão das informações do atleta</strong><span aria-hidden="true">↓</span></a>
<a href="#cp2"><span>CP2</span><strong>Acompanhamento da evolução</strong><span aria-hidden="true">↓</span></a>
<a href="#cp3"><span>CP3</span><strong>Planejamento e acompanhamento dos treinos</strong><span aria-hidden="true">↓</span></a>
<a href="#cp4"><span>CP4</span><strong>Biblioteca de exercícios</strong><span aria-hidden="true">↓</span></a>
<a href="#cp5"><span>CP5</span><strong>Envio privado de vídeos</strong><span aria-hidden="true">↓</span></a>
<a href="#cp6"><span>CP6</span><strong>Feedback privado do treinador</strong><span aria-hidden="true">↓</span></a>
<a href="#cp7"><span>CP7</span><strong>Perfis distintos de acesso</strong><span aria-hidden="true">↓</span></a>
<a href="#cp8"><span>CP8</span><strong>Privacidade de dados, vídeos e feedbacks</strong><span aria-hidden="true">↓</span></a>
</div></nav>

<details id="indice-mvp" class="sj-mvp-index"><summary>Localizar os requisitos do MVP</summary><p>Índice de acesso às fichas identificadas com o selo MVP. O conteúdo e a seleção são mantidos nas próprias fichas.</p><div id="sj-mvp-links" class="sj-mvp-link-list" hidden></div><noscript><p>Consulte as características acima e o selo MVP nas fichas. Todos os requisitos continuam disponíveis sem JavaScript.</p></noscript></details>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp1">

## <span>CP1</span> Gestão das informações do atleta {#cp1}

<p class="sj-catalog-group-lead">Centralizar informações de perfil, objetivos, histórico de lesões e resultados de testes de cada atleta. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf01101">

<summary><span class="sj-requirement-id">RF01101</span><span class="sj-requirement-name">Cadastrar usuário</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o usuário se cadastre no sistema, com informações: dados do usuário como nome, sobrenome, apelido, contato, altura, peso, envergadura, foto de perfil, senha, frequencia da realização da atividade física, objetivos, histórico de lesões, histórico de aptidão física e resultado de treinos</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us01a" class="sj-story"><strong>US01a</strong> Como aluno/atleta, quero cadastrar um perfil validando o código do meu treinador, para ter acesso aos meus treinos e ingressar na carteira dele.</p>

<p id="us01b" class="sj-story"><strong>US01b</strong> Como treinador, quero solicitar o cadastro de uma conta de treinador na plataforma, para poder gerenciar meus atletas e prescrever treinos após a aprovação da administração.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Atleta / Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn10">RN10</a> · <a href="../regras_negocio/#rn11">RN11</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us01a">US01a</a> · <a href="../criterios_aceitacao/#ca-us01b">US01b</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,33</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01102">

<summary><span class="sj-requirement-id">RF01102</span><span class="sj-requirement-name">Logar usuário</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que usuários cadastrados se autentiquem por apelido e senha, identificando o perfil associado à conta autenticada (treinador ou atleta).</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us02" class="sj-story"><strong>US02</strong> Como usuário do site, quero logar com conta própria utilizando meu apelido e senha, para acessar a plataforma de forma segura.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1; OE4 - CP7</a><br>Usuário</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us02">US02</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 1,67</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01103">

<summary><span class="sj-requirement-id">RF01103</span><span class="sj-requirement-name">Deslogar usuário</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o usuário possa deslogar do seu perfil</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us03" class="sj-story"><strong>US03</strong> Como usuário autenticado, quero deslogar da minha conta, para encerrar a sessão de forma segura em dispositivos compartilhados.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Usuário</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us03">US03</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 1,17</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01104">

<summary><span class="sj-requirement-id">RF01104</span><span class="sj-requirement-name">Editar informações do perfil</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o aluno edite seus dados pessoais por exemplo nome, sobrenome, apelido, contato, altura, peso, envergadura e foto de perfil. Já as informações que envolvem análise do treinador como resultados dos treinos, objetivos, histórico de lesões, histórico de aptidão física, só poderão ser editadas pelo treinador</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us04a" class="sj-story"><strong>US04a</strong> Como aluno, quero editar as minhas informações pessoais e corporais básicas (nome, contato, peso, altura), para manter o meu cadastro atualizado.</p>

<p id="us04b" class="sj-story"><strong>US04b</strong> Como treinador, quero editar o histórico de lesões, objetivos e dados de aptidão física no perfil dos meus alunos, para manter a avaliação clínica deles atualizada e segura.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Atleta / Trein.</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn02">RN02</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us04a">US04a</a> · <a href="../criterios_aceitacao/#ca-us04b">US04b</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,25</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01105">

<summary><span class="sj-requirement-id">RF01105</span><span class="sj-requirement-name">Excluir usuário</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que apenas o treinador exclua usuário que não são mais atletas do treinador</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us05" class="sj-story"><strong>US05</strong> Como treinador, quero excluir o perfil de um atleta desvinculado, para manter a base de dados da minha carteira limpa e atualizada.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn04">RN04</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us05">US05</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Won&#x27;t Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01106">

<summary><span class="sj-requirement-id">RF01106</span><span class="sj-requirement-name">Criar senha aleatória</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve criar uma senha aleatória com letras, números e caracteres e mandar para o email vinculado ao usuário para primeiro acesso</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us06" class="sj-story"><strong>US06</strong> Como sistema, quero gerar uma senha temporária automática para o primeiro acesso do usuário, para garantir um processo de integração (<em>onboarding</em>) ágil e seguro.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Sistema</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us06">US06</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,17</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01107">

<summary><span class="sj-requirement-id">RF01107</span><span class="sj-requirement-name">Trocar senha</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir o usuário de mudar senha, sendo após o primeiro acesso de quesito obrigatório, seguindo os critérios de aceite: mínimo 6 caracteres, mínimo um caracter especial e mínimo um número</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us07" class="sj-story"><strong>US07</strong> Como aluno, quero trocar a senha após o primeiro acesso, para conseguir acessar o site novamente de forma segura e pessoal.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Usuário</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us07">US07</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 1,83</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>

<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf01106">RF01106</a></p></div>



<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp2">

## <span>CP2</span> Acompanhamento da evolução {#cp2}

<p class="sj-catalog-group-lead">Reunir informações históricas de testes e treinos para apoiar a consulta da evolução individual dos atletas. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf01208">

<summary><span class="sj-requirement-id">RF01208</span><span class="sj-requirement-name">Consultar dificuldade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador consulte as dificuldades dos respectivos treinos orientados</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us08" class="sj-story"><strong>US08</strong> Como treinador, quero consultar a dificuldade que os alunos registraram após o treino, para ser assertivo com as orientações e registro de treinos posteriores.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us08">US08</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 2,25</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01209">

<summary><span class="sj-requirement-id">RF01209</span><span class="sj-requirement-name">Registrar dificuldade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta registre o nível de dificuldade em uma escala de 1 a 5 que sentiu ao realizar o exercício</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us09" class="sj-story"><strong>US09</strong> Como aluno, quero registrar a dificuldade que senti na execução do exercício, para o treinador entender em quais momentos e cargas tive mais dificuldade.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn07">RN07</a> · <a href="../regras_negocio/#rn09">RN09</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us09-us10">US09 / US10</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,50</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01210">

<summary><span class="sj-requirement-id">RF01210</span><span class="sj-requirement-name">Editar dificuldade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta modifique o nível de dificuldade da escala de 1 a 5 que sentiu ao realizar o exercício, enquanto o treino passado estiver disponível para o atleta</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us10" class="sj-story"><strong>US10</strong> Como aluno, quero modificar a dificuldade que registrei enquanto o treino estiver vigente, para ser assertivo e corrigir avaliações precipitadas.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn07">RN07</a> · <a href="../regras_negocio/#rn09">RN09</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us09-us10">US09 / US10</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,75</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01211">

<summary><span class="sj-requirement-id">RF01211</span><span class="sj-requirement-name">Editar status exercícios</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador modifique os status dos exercícios (&quot;Concluído&quot;, &quot;A fazer&quot;, &quot;Corrigir&quot;) de acordo com a análise presencial do treinador ou vídeo enviado pelo atleta, quando houver, o atleta também poderá modificar o status do próprio exercício para &quot;Concluído&quot; ou &quot;A Fazer&quot;.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us11a" class="sj-story"><strong>US11a</strong> Como aluno, quero modificar o status do meu próprio exercício para &quot;Concluído&quot; ou &quot;A fazer&quot;, para registrar e sinalizar o meu progresso durante a execução do treino.</p>

<p id="us11b" class="sj-story"><strong>US11b</strong> Como treinador, quero modificar o status dos exercícios dos meus alunos para &quot;Concluído&quot; ou &quot;Corrigir&quot;, para auditar e validar o progresso deles após analisar a execução.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Atleta / Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn06">RN06</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us11a-us11b">US11a / US11b</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 2,17</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01212">

<summary><span class="sj-requirement-id">RF01212</span><span class="sj-requirement-name">Adicionar testes</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador acrescente testes de aptidão física</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us12" class="sj-story"><strong>US12</strong> Como treinador, quero adicionar testes de aptidão física, para avaliar formalmente o desempenho e a evolução atlética dos meus alunos.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us12">US12</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Won&#x27;t Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf01213">

<summary><span class="sj-requirement-id">RF01213</span><span class="sj-requirement-name">Remover testes</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador exclua testes de aptidão física</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us13" class="sj-story"><strong>US13</strong> Como treinador, quero remover testes de aptidão física previamente cadastrados, para corrigir equívocos ou atualizar a matriz de avaliação da carteira.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us13">US13</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Won&#x27;t Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp3">

## <span>CP3</span> Planejamento e acompanhamento dos treinos {#cp3}

<p class="sj-catalog-group-lead">Apoiar o registro, a organização e a consulta do planejamento e dos treinos realizados pelos atletas. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf02301">

<summary><span class="sj-requirement-id">RF02301</span><span class="sj-requirement-name">Cadastrar planejamento</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador registre o planejamento de treinamento de cada atleta.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us14" class="sj-story"><strong>US14</strong> Como treinador, quero registrar o planejamento de cada aluno na minha carteira, para que eles possam acompanhar e executar as rotinas de treino propostas.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us14-us15">US14 / US15</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,67</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02302">

<summary><span class="sj-requirement-id">RF02302</span><span class="sj-requirement-name">Editar planejamento</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador altere o planejamento de treinamento de cada atleta.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us15" class="sj-story"><strong>US15</strong> Como treinador, quero modificar o planejamento de treino já cadastrado, para corrigir possíveis erros ou realizar ajustes de carga.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us14-us15">US14 / US15</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,75</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02303">

<summary><span class="sj-requirement-id">RF02303</span><span class="sj-requirement-name">Associar treino a objetivo</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador associe cada treino planejado aos respectivos objetivos do atleta.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us16" class="sj-story"><strong>US16</strong> Como treinador, quero vincular um treino planejado aos macro-objetivos do atleta, para manter a coerência da prescrição a longo prazo.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us16">US16</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Could Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02304">

<summary><span class="sj-requirement-id">RF02304</span><span class="sj-requirement-name">Consultar histórico de planejamento</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador consulte o histórico das alterações realizadas nos planejamentos de treinamento.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us17" class="sj-story"><strong>US17</strong> Como treinador, quero consultar o histórico de planejamentos de treinos de cada aluno, para aprimorar e embasar o acompanhamento longitudinal do atleta.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us17-us18-us19">US17 / US18 / US19</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 1,83</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02305">

<summary><span class="sj-requirement-id">RF02305</span><span class="sj-requirement-name">Comparar treinamentos</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador visualize um relatório comparativo entre os treinos planejados e os realizados por cada atleta, para que seja analisado os resultados do treinamento do atleta.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us18" class="sj-story"><strong>US18</strong> Como treinador, quero gerar um relatório comparativo entre o treino planejado e o efetivamente realizado, para analisar a adesão e o rendimento do atleta.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us17-us18-us19">US17 / US18 / US19</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Fora do MVP documentado<br>CT registrada: 3,08</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02306">

<summary><span class="sj-requirement-id">RF02306</span><span class="sj-requirement-name">Consultar status de treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador identifique o estado de cada treino planejado, como não iniciado, em andamento ou concluído.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us19" class="sj-story"><strong>US19</strong> Como treinador, quero consultar o andamento e status do treino em tempo real, para aprimorar o acompanhamento da execução diária de cada aluno.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us17-us18-us19">US17 / US18 / US19</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,50</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp4">

## <span>CP4</span> Biblioteca de exercícios {#cp4}

<p class="sj-catalog-group-lead">Organizar exercícios por objetivos e fundamentos, incluindo orientações, erros comuns e materiais demonstrativos. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf02407">

<summary><span class="sj-requirement-id">RF02407</span><span class="sj-requirement-name">Cadastrar exercício</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador cadastre um exercício informando seu objetivo, fundamento e orientações para sua execução.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us20" class="sj-story"><strong>US20</strong> Como treinador, quero cadastrar um exercício na biblioteca, para que o aluno saiba exatamente quais movimentos precisa realizar no seu treino.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf12">RNF12</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us20-us21-us22">US20 / US21 / US22</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 1,75</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02408">

<summary><span class="sj-requirement-id">RF02408</span><span class="sj-requirement-name">Filtrar exercícios por fundamento</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador filtre os exercícios da biblioteca de acordo com o fundamento esportivo associado.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us21" class="sj-story"><strong>US21</strong> Como treinador, quero filtrar a biblioteca de exercícios por fundamento esportivo, para encontrar rapidamente os movimentos adequados na hora de montar o treino.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf12">RNF12</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us20-us21-us22">US20 / US21 / US22</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Could Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02409">

<summary><span class="sj-requirement-id">RF02409</span><span class="sj-requirement-name">Associar exercício a objetivo</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador associe um exercício a um ou mais objetivos de treinamento.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us22" class="sj-story"><strong>US22</strong> Como treinador, quero vincular exercícios da biblioteca a objetivos específicos, para padronizar e agilizar futuras prescrições.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us20-us21-us22">US20 / US21 / US22</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Won&#x27;t Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02410">

<summary><span class="sj-requirement-id">RF02410</span><span class="sj-requirement-name">Documentar erros e orientações</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador associe erros comuns e respectivas orientações corretivas aos exercícios cadastrados.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us23" class="sj-story"><strong>US23</strong> Como treinador, quero documentar erros comuns e orientações aos exercícios cadastrados, para alertar o aluno e evitar que ele cometa as falhas frequentes relacionadas àquele movimento.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us23-us24-us25">US23 / US24 / US25</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 3,00</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02411">

<summary><span class="sj-requirement-id">RF02411</span><span class="sj-requirement-name">Gerar thumbnail de vídeo base</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador faça o upload de uma imagem em miniatura (thumbnail) personalizada para o vídeo base do exercício ou, caso não seja enviada, deve gerar e exibir uma miniatura automaticamente a partir de um frame do arquivo de vídeo cadastrado.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us24" class="sj-story"><strong>US24</strong> Como treinador, quero gerar uma miniatura (<em>thumbnail</em>) para o vídeo base, para facilitar a identificação visual do exercício na biblioteca pelo atleta.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf06">RNF06</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us23-us24-us25">US23 / US24 / US25</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Could Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf02412">

<summary><span class="sj-requirement-id">RF02412</span><span class="sj-requirement-name">Cadastrar informações complementares do vídeo base</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve disponibilizar campos de texto para que o treinador cadastre um título e uma descrição breve associados a cada vídeo base da biblioteca, permitindo que atletas e treinadores visualizem essas informações durante a consulta.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us25" class="sj-story"><strong>US25</strong> Como treinador, quero cadastrar título e/ou descrições detalhadas nos vídeos base do exercício, para que o aluno entenda completamente a forma e a execução correta.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us23-us24-us25">US23 / US24 / US25</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,00</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp5">

## <span>CP5</span> Envio privado de vídeos {#cp5}

<p class="sj-catalog-group-lead">Permitir que o atleta envie, de forma opcional, um vídeo relacionado à execução de um exercício. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf03501">

<summary><span class="sj-requirement-id">RF03501</span><span class="sj-requirement-name">Enviar vídeo de execução</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>Permitir que o atleta grave ou selecione um vídeo do dispositivo e o envie vinculado a um exercício específico do seu treino</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us26" class="sj-story"><strong>US26</strong> Como aluno, quero mandar um vídeo da execução do exercício, para que o treinador veja como está a minha forma e consiga dar um feedback mais assertivo.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP5</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf06">RNF06</a> · <a href="../requisitos_nao_funcionais/#rnf07">RNF07</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a> · <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a> · <a href="../requisitos_nao_funcionais/#rnf16">RNF16</a><br><a href="../regras_negocio/#rn05">RN05</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us26">US26</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 3,75</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf03502">

<summary><span class="sj-requirement-id">RF03502</span><span class="sj-requirement-name">Substituir vídeo enviado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>Permitir que o atleta substitua o vídeo vinculado a um exercício, desde que o treinador ainda não tenha registrado feedback sobre ele.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us27" class="sj-story"><strong>US27</strong> Como aluno, quero trocar o vídeo da execução do exercício que foi enviado, para corrigir o envio de um arquivo errado antes que o treinador avalie a mídia.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP5</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf06">RNF06</a> · <a href="../requisitos_nao_funcionais/#rnf07">RNF07</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a> · <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a> · <a href="../requisitos_nao_funcionais/#rnf16">RNF16</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn05">RN05</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us27-us28">US27 / US28</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 3,75</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>

<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf03501">RF03501</a></p></div>



<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf03503">

<summary><span class="sj-requirement-id">RF03503</span><span class="sj-requirement-name">Excluir vídeo enviado</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>Permitir que o atleta exclua um vídeo já enviado, desde que o treinador ainda não tenha registrado feedback sobre ele.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us28" class="sj-story"><strong>US28</strong> Como aluno, quero excluir um vídeo de execução enviado, para cancelar uma submissão feita por engano antes da avaliação do treinador.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP5</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us27-us28">US27 / US28</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Won&#x27;t Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>

<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf03501">RF03501</a></p></div>



<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp6">

## <span>CP6</span> Feedback privado do treinador {#cp6}

<p class="sj-catalog-group-lead">Permitir que o treinador registre um feedback vinculado ao vídeo e ao exercício enviado pelo atleta. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf03601">

<summary><span class="sj-requirement-id">RF03601</span><span class="sj-requirement-name">Registrar feedback</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>Permitir que o treinador registre um feedback textual vinculado ao vídeo e ao exercício enviado por um atleta sob seu acompanhamento.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us29" class="sj-story"><strong>US29</strong> Como treinador, quero registrar um feedback textual na mídia do exercício analisado, para que o aluno compreenda os seus erros e acertos de execução.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us29">US29</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,67</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf03602">

<summary><span class="sj-requirement-id">RF03602</span><span class="sj-requirement-name">Editar feedback</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>Permitir que o treinador edite um feedback que ele mesmo registrou anteriormente.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us30" class="sj-story"><strong>US30</strong> Como treinador, quero modificar um feedback previamente analisado e registrado, para corrigir ou complementar a orientação dada ao aluno.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn08">RN08</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us30-us31">US30 / US31</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,67</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>

<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf03601">RF03601</a></p></div>



<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf03603">

<summary><span class="sj-requirement-id">RF03603</span><span class="sj-requirement-name">Excluir feedback</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>Permitir que o treinador exclua um feedback que ele mesmo registrou anteriormente.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us31" class="sj-story"><strong>US31</strong> Como treinador, quero excluir um feedback previamente registrado, para remover anotações indevidas ou equivocadas da plataforma.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn08">RN08</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us30-us31">US30 / US31</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Won&#x27;t Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>

<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf03601">RF03601</a></p></div>



<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf03604">

<summary><span class="sj-requirement-id">RF03604</span><span class="sj-requirement-name">Notificar atleta sobre feedback</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve notificar o atleta quando um feedback for registrado ou editado pelo treinador para um vídeo enviado por ele.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us32" class="sj-story"><strong>US32</strong> Como aluno, quero ser notificado no sistema quando o treinador registrar ou editar um feedback, para saber exatamente quando o meu vídeo foi avaliado e visualizá-lo.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Sistema</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us32">US32</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Fora do MVP documentado<br>CT registrada: 3,00</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>

<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf03601">RF03601</a></p></div>



<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp7">

## <span>CP7</span> Perfis distintos de acesso {#cp7}

<p class="sj-catalog-group-lead">Diferenciar os acessos e permissões entre treinador e atleta. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf04701">

<summary><span class="sj-requirement-id">RF04701</span><span class="sj-requirement-name">Consultar atletas acompanhados</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador autenticado consulte a lista dos atletas vinculados ao seu acompanhamento, sem listar atletas sem vínculo autorizado. A consulta às informações de perfil de um atleta selecionado é descrita em <a href="../requisitos/#rf04810">RF04810</a>.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us33" class="sj-story"><strong>US33</strong> Como treinador, quero acessar a lista de dados exclusivamente dos alunos da minha carteira, para aprimorar o acompanhamento e gerenciar o volume de treinos.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP7</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us33-us37-us42-us43">US33 / US37 / US42 / US43</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 2,42</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp8">

## <span>CP8</span> Privacidade de dados, vídeos e feedbacks {#cp8}

<p class="sj-catalog-group-lead">Restringir o acesso aos dados, vídeos e feedbacks individuais de cada atleta. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf04802">

<summary><span class="sj-requirement-id">RF04802</span><span class="sj-requirement-name">Consultar próprios dados cadastrais</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta autenticado consulte seus próprios dados cadastrais, sem acessar os dados cadastrais de outro atleta.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us34" class="sj-story"><strong>US34</strong> Como aluno, quero consultar unicamente os meus próprios dados cadastrais, para ter ciência dos dados armazenados e saber se necessitam de correção.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34-us35-us36-us38-us39-us40-us41">US34 / US35 / US36 / US38 / US39 / US40 / US41</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 1,83</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04803">

<summary><span class="sj-requirement-id">RF04803</span><span class="sj-requirement-name">Consultar próprios resultados de testes</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta autenticado consulte os resultados de testes associados à sua conta, sem acessar resultados de outros atletas.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us35" class="sj-story"><strong>US35</strong> Como aluno, quero consultar exclusivamente os resultados dos meus próprios testes de aptidão, para monitorar a minha performance sem acessar dados de terceiros.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34-us35-us36-us38-us39-us40-us41">US34 / US35 / US36 / US38 / US39 / US40 / US41</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Won&#x27;t Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04804">

<summary><span class="sj-requirement-id">RF04804</span><span class="sj-requirement-name">Consultar próprios vídeos enviados</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta autenticado consulte os vídeos de execução que enviou, vinculados aos respectivos exercícios, sem acessar vídeos enviados por outros atletas.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us36" class="sj-story"><strong>US36</strong> Como aluno, quero consultar unicamente os vídeos de execução que eu mesmo enviei, para rever a minha forma e garantir que a mídia submetida foi a correta.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34-us35-us36-us38-us39-us40-us41">US34 / US35 / US36 / US38 / US39 / US40 / US41</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 2,67</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04805">

<summary><span class="sj-requirement-id">RF04805</span><span class="sj-requirement-name">Consultar vídeos de atleta acompanhado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador autenticado consulte os vídeos de execução enviados pelos atletas sob seu acompanhamento, no contexto dos respectivos exercícios.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us37" class="sj-story"><strong>US37</strong> Como treinador, quero consultar os vídeos de execução enviados pelos alunos sob meu acompanhamento, para avaliar tecnicamente a execução de cada exercício de forma assíncrona.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us33-us37-us42-us43">US33 / US37 / US42 / US43</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,75</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04806">

<summary><span class="sj-requirement-id">RF04806</span><span class="sj-requirement-name">Consultar feedback recebido</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta autenticado consulte os feedbacks individuais registrados pelo treinador para seus vídeos e exercícios, mantendo a associação ao conteúdo avaliado e sem acessar feedbacks destinados a outros atletas.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us38" class="sj-story"><strong>US38</strong> Como aluno, quero consultar exclusivamente o feedback que o treinador registrou nos meus exercícios realizados, para compreensão de erros e correção de postura.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34-us35-us36-us38-us39-us40-us41">US34 / US35 / US36 / US38 / US39 / US40 / US41</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,67</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04807">

<summary><span class="sj-requirement-id">RF04807</span><span class="sj-requirement-name">Consultar próprio histórico de treinos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta autenticado consulte seu histórico de treinos, sem acessar o histórico de outros atletas.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us39" class="sj-story"><strong>US39</strong> Como aluno, quero consultar o meu próprio histórico de treinos já realizados, para acessar rotinas antigas e acompanhar a progressão de cargas.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34-us35-us36-us38-us39-us40-us41">US34 / US35 / US36 / US38 / US39 / US40 / US41</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 2,58</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04808">

<summary><span class="sj-requirement-id">RF04808</span><span class="sj-requirement-name">Consultar próprios objetivos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta autenticado consulte os objetivos registrados para ele, sem acessar os objetivos de outros atletas.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us40" class="sj-story"><strong>US40</strong> Como aluno, quero consultar exclusivamente os meus próprios objetivos definidos pelo treinador, para ter ciência de que as rotinas de treino são coerentes com as minhas metas.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34-us35-us36-us38-us39-us40-us41">US34 / US35 / US36 / US38 / US39 / US40 / US41</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 2,42</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04809">

<summary><span class="sj-requirement-id">RF04809</span><span class="sj-requirement-name">Consultar próprio planejamento de treinos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o atleta autenticado consulte os treinos planejados para ele, sem acessar o planejamento de outros atletas.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us41" class="sj-story"><strong>US41</strong> Como aluno, quero consultar exclusivamente o meu próprio planejamento de treino diário/semanal, para entender a organização e a sequência dos exercícios prescritos.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Atleta</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br>Regra específica a confirmar.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34-us35-us36-us38-us39-us40-us41">US34 / US35 / US36 / US38 / US39 / US40 / US41</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Should Have · Incluído no MVP documentado<br>CT registrada: 2,33</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04810">

<summary><span class="sj-requirement-id">RF04810</span><span class="sj-requirement-name">Consultar perfil de atleta acompanhado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador autenticado consulte as informações de perfil de um atleta selecionado entre os que estão vinculados ao seu acompanhamento, sem acessar o perfil de atletas sem vínculo autorizado.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us42" class="sj-story"><strong>US42</strong> Como treinador, quero consultar o perfil completo dos alunos sob minha responsabilidade, para analisar dados pessoais atualizados e embasar avaliações clínicas.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us33-us37-us42-us43">US33 / US37 / US42 / US43</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Must Have · Incluído no MVP documentado<br>CT registrada: 2,42</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

<details class="sj-requirement" id="rf04811">

<summary><span class="sj-requirement-id">RF04811</span><span class="sj-requirement-name">Consultar resultados de testes de atleta acompanhado</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">

<div class="sj-record-full"><p class="sj-record-label">Comportamento esperado</p><p>O sistema deve permitir que o treinador autenticado consulte os resultados de testes dos atletas sob seu acompanhamento.</p></div>

<div class="sj-record-full"><p class="sj-record-label">Intenção e valor</p>

<p id="us43" class="sj-story"><strong>US43</strong> Como treinador, quero consultar o histórico de resultados dos testes de aptidão física da minha carteira de alunos, para analisar a evolução atlética e definir quais os treinos adequados para os próximos ciclos.</p>

</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Treinador</p></div>

<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn01">RN01</a></p></div>

<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us33-us37-us42-us43">US33 / US37 / US42 / US43</a></p></div>

<div><p class="sj-record-label">Prioridade e recorte</p><p>Could Have · Fora do MVP documentado</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p></div>





<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>

</div></details>

</section>


## Identificação e correspondências {#identificacao-dos-requisitos}

Cada requisito mantém seu identificador ao mudar de prioridade ou associação. A correspondência histórica pode ser consultada abaixo.

<details class="sj-document-details" markdown="1"><summary>Consultar histórico dos identificadores</summary>

| Código na antiga página Requisitos | Identificador atual |
|---|---|
| RF01201 | [RF01208 · Consultar dificuldade](#rf01208) |
| RF01202 | [RF01209 · Registrar dificuldade](#rf01209) |
| RF01203 | [RF01210 · Editar dificuldade](#rf01210) |
| RF01204 | [RF01211 · Editar status exercícios](#rf01211) |
| RF01205 | [RF01212 · Adicionar testes](#rf01212) |
| RF01206 | [RF01213 · Remover testes](#rf01213) |
| RF02401 | [RF02407 · Cadastrar exercício](#rf02407) |
| RF02402 | [RF02408 · Filtrar exercícios por fundamento](#rf02408) |
| RF02403 | [RF02409 · Associar exercício a objetivo](#rf02409) |
| RF02404 | [RF02410 · Documentar erros e orientações](#rf02410) |
| RF02405 | [RF02411 · Gerar thumbnail de vídeo base](#rf02411) |
| RF02406 | [RF02412 · Cadastrar informações complementares do vídeo base](#rf02412) |
| RF04801 | [RF04802 · Consultar próprios dados cadastrais](#rf04802) |
| RF04802 | [RF04803 · Consultar próprios resultados de testes](#rf04803) |
| RF04803 | [RF04804 · Consultar próprios vídeos enviados](#rf04804) |
| RF04804 | [RF04805 · Consultar vídeos de atleta acompanhado](#rf04805) |
| RF04805 | [RF04806 · Consultar feedback recebido](#rf04806) |
| RF04806 | [RF04807 · Consultar próprio histórico de treinos](#rf04807) |
| RF04807 | [RF04808 · Consultar próprios objetivos](#rf04808) |
| RF04808 | [RF04809 · Consultar próprio planejamento de treinos](#rf04809) |
| RF04809 | [RF04810 · Consultar perfil de atleta acompanhado](#rf04810) |
| RF04810 | [RF04811 · Consultar resultados de testes de atleta acompanhado](#rf04811) |


<span id="requisitos-funcionais"></span>
<span id="requisitos-nao-funcionais"></span>

Os [RNFs](requisitos_nao_funcionais.md) possuem registros próprios. A classificação de MVP de cada RF é mantida em sua ficha; as páginas de consulta não mantêm cópias das listas.

</details>

<span id="referencia-da-consolidacao"></span>
