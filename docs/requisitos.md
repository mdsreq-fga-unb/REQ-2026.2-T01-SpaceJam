<span id="requisitos-de-software"></span>

# Catálogo de requisitos

<div class="sj-catalog-intro"><p class="sj-catalog-kicker">REQUISITOS E ESCOPO</p><p class="sj-catalog-lead">Um registro por requisito. Uma consulta ao escopo.</p><p>Escolha uma característica e abra a ficha do requisito. Histórias, critérios e condições relacionados podem ser consultados a partir dela.</p><div class="sj-catalog-links"><a href="../requisitos_nao_funcionais/">RNFs</a><a href="../regras_negocio/">Regras</a><a href="../criterios_aceitacao/">Critérios por história</a></div></div>

<p class="sj-catalog-status"><strong>Escopo em revisão.</strong> O MVP reflete o recorte documentado. Confirmação e implementação precisam de evidências por item.</p><p><a href="../backlog/#102-priorizacao-do-backlog-geral-e-mvp">Consultar método e justificativa do recorte</a></p>

<nav id="guia-do-catalogo" class="sj-cp-index" aria-label="Consultar por característica">
<p class="sj-cp-index-title">Escolha uma característica</p>
<div class="sj-cp-index-grid">
<a href="#cp1"><span>CP1</span><strong>Gestão das informações do atleta</strong><span aria-hidden="true">↓</span></a>
<a href="#cp2"><span>CP2</span><strong>Acompanhamento da evolução</strong><span aria-hidden="true">↓</span></a>
<a href="#cp3"><span>CP3</span><strong>Planejamento e acompanhamento dos treinos</strong><span aria-hidden="true">↓</span></a>
<a href="#cp4"><span>CP4</span><strong>Biblioteca de exercícios</strong><span aria-hidden="true">↓</span></a>
<a href="#cp5"><span>CP5</span><strong>Envio privado de vídeos</strong><span aria-hidden="true">↓</span></a>
<a href="#cp6"><span>CP6</span><strong>Feedback privado entre treinador e aluno</strong><span aria-hidden="true">↓</span></a>
<a href="#cp7"><span>CP7</span><strong>Perfis distintos de acesso</strong><span aria-hidden="true">↓</span></a>
<a href="#cp8"><span>CP8</span><strong>Privacidade de dados, vídeos e feedbacks</strong><span aria-hidden="true">↓</span></a>
</div></nav>

<details id="indice-mvp" class="sj-mvp-index"><summary>Localizar os requisitos do MVP</summary><p>Índice de acesso às fichas identificadas com o selo MVP. O conteúdo e a seleção são mantidos nas próprias fichas.</p><div id="sj-mvp-links" class="sj-mvp-link-list" hidden></div><noscript><p>Consulte as características acima e o selo MVP nas fichas. Todos os requisitos continuam disponíveis sem JavaScript.</p></noscript></details>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp1">

## <span>CP1</span> Gestão das informações do atleta {#cp1}

<p class="sj-catalog-group-lead">Centralizar informações de perfil, objetivos, histórico de lesões e resultados de testes de cada atleta. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf1101">
<summary><span class="sj-requirement-id">RF1101</span><span class="sj-requirement-name">Cadastrar aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno se cadastre no sistema, com informações: dados pessoais como nome, sobrenome, apelido, contato, altura, peso, envergadura, senha, frequência da realização da atividade física e objetivos do aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us01" class="sj-story"><strong>US01</strong> Como aluno, quero cadastrar um perfil validando o código do meu treinador, para ter acesso aos meus treinos e ingressar na carteira dele.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn02">RN02</a> · <a href="../regras_negocio/#rn15">RN15</a> · <a href="../regras_negocio/#rn16">RN16</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us01">US01</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,33</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1102">
<summary><span class="sj-requirement-id">RF1102</span><span class="sj-requirement-name">Cadastrar treinador</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador se cadastre no sistema com informações: nome, sobrenome, apelido, telefone, senha e email, mediante o código de ativação definido na implantação. Ao concluir o cadastro, o sistema gera o código do treinador, exibido no perfil dele, que os alunos usam para se cadastrar.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us02" class="sj-story"><strong>US02</strong> Como treinador, quero cadastrar minha conta de treinador na plataforma, para poder gerenciar meus alunos, prescrever treinos e avaliar os desempenhos dos alunos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn01">RN01</a> · <a href="../regras_negocio/#rn02">RN02</a> · <a href="../regras_negocio/#rn15">RN15</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us02">US02</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,33</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1103">
<summary><span class="sj-requirement-id">RF1103</span><span class="sj-requirement-name">Deslogar aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o usuário possa deslogar do seu perfil.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us03" class="sj-story"><strong>US03</strong> Como aluno autenticado, quero deslogar da minha conta, para encerrar a sessão de forma segura em dispositivos compartilhados.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br>Regra específica a confirmar.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us03">US03</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,17</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1104">
<summary><span class="sj-requirement-id">RF1104</span><span class="sj-requirement-name">Logar aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que os alunos cadastrados se autentiquem por apelido e senha, identificando o perfil associado à conta autenticada.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us04" class="sj-story"><strong>US04</strong> Como aluno, quero logar com conta própria utilizando meu apelido e senha, para acessar a plataforma de forma segura.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn15">RN15</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us04">US04</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1105">
<summary><span class="sj-requirement-id">RF1105</span><span class="sj-requirement-name">Logar treinador</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador cadastrado se autentique por email e senha, identificando o perfil associado à conta autenticada.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us05" class="sj-story"><strong>US05</strong> Como treinador, quero logar com conta própria utilizando meu email e senha, para acessar a plataforma de forma segura.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn01">RN01</a> · <a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn15">RN15</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us05">US05</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1106">
<summary><span class="sj-requirement-id">RF1106</span><span class="sj-requirement-name">Excluir perfil do aluno</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que apenas o treinador exclua perfis de alunos que não estão mais em acompanhamento. Com isso, os dados e registros do aluno são excluídos da aplicação.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us06" class="sj-story"><strong>US06</strong> Como treinador, quero excluir o perfil de um aluno que não estou mais acompanhando, para manter a lista de alunos limpa e atualizada.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn05">RN05</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us06">US06</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,00</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1107">
<summary><span class="sj-requirement-id">RF1107</span><span class="sj-requirement-name">Editar informações do perfil do aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno edite seus dados pessoais por exemplo nome, sobrenome, apelido, contato, altura, peso, envergadura, foto de perfil e objetivos do aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us07" class="sj-story"><strong>US07</strong> Como aluno, quero editar as minhas informações pessoais e corporais básicas (nome, contato, peso, altura), para manter o meu cadastro atualizado.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn04">RN04</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us07">US07</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,25</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1108">
<summary><span class="sj-requirement-id">RF1108</span><span class="sj-requirement-name">Trocar senha</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o usuário mude sua senha de autenticação.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us08" class="sj-story"><strong>US08</strong> Como aluno, quero trocar a senha de autenticação, para conseguir acessar o site novamente de forma segura e pessoal.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Usuário</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn12">RN12</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us08">US08</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,83</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1109">
<summary><span class="sj-requirement-id">RF1109</span><span class="sj-requirement-name">Editar informações do perfil do treinador</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador edite suas informações no perfil.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us09" class="sj-story"><strong>US09</strong> Como treinador, quero editar as minhas informações pessoais (nome, contato, telefone, altura), para manter o meu cadastro atualizado.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn04">RN04</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us09">US09</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,10</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1110">
<summary><span class="sj-requirement-id">RF1110</span><span class="sj-requirement-name">Recuperar senha</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o usuário que esqueceu a senha solicite a redefinição por e-mail, por meio de link ou código temporário com prazo de validade, seguindo os critérios de senha do <a href="../requisitos/#rf1108">RF1108</a>.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us10" class="sj-story"><strong>US10</strong> Como usuário do sistema, quero recuperar minha senha caso eu esqueça, para continuar autenticando meu perfil e utilizando os recursos do sistema.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Usuário</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn12">RN12</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us10">US10</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 4,02</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1111">
<summary><span class="sj-requirement-id">RF1111</span><span class="sj-requirement-name">Registrar histórico de lesões</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador registre o histórico de lesões do aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us11" class="sj-story"><strong>US11</strong> Como treinador, quero editar o histórico de lesões, objetivos e dados de aptidão física no perfil dos meus alunos, para manter a avaliação clínica deles atualizada e segura.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP1</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn04">RN04</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us11">US11</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,57</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp2">

## <span>CP2</span> Acompanhamento da evolução {#cp2}

<p class="sj-catalog-group-lead">Reunir informações históricas de testes e treinos para apoiar a consulta da evolução individual dos alunos. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf1212">
<summary><span class="sj-requirement-id">RF1212</span><span class="sj-requirement-name">Consultar dificuldade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte a qualquer momento as dificuldades dos respectivos treinos orientados.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us12" class="sj-story"><strong>US12</strong> Como treinador, quero consultar a dificuldade que os alunos registraram após o treino, para ser assertivo com as orientações e registro de treinos posteriores.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn08">RN08</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us12">US12</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,25</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1213">
<summary><span class="sj-requirement-id">RF1213</span><span class="sj-requirement-name">Registrar dificuldade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno registre o nível de dificuldade em uma escala de 1 a 5 que sentiu ao realizar o exercício.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us13" class="sj-story"><strong>US13</strong> Como aluno, quero registrar a dificuldade que senti na execução do exercício, para o treinador entender em quais momentos e cargas tive mais dificuldade.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn08">RN08</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us13">US13</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,50</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1214">
<summary><span class="sj-requirement-id">RF1214</span><span class="sj-requirement-name">Editar dificuldade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno modifique o nível de dificuldade da escala de 1 a 5 que sentiu ao realizar o exercício, até o momento em que o treino passado não estiver como concluído para o aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us14" class="sj-story"><strong>US14</strong> Como aluno, quero modificar a dificuldade que registrei enquanto o treino estiver vigente, para ser assertivo e corrigir avaliações precipitadas.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn07">RN07</a> · <a href="../regras_negocio/#rn08">RN08</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us14">US14</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,75</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1215">
<summary><span class="sj-requirement-id">RF1215</span><span class="sj-requirement-name">Registrar conclusão de treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador registre a conclusão do treino de acordo com a análise presencial do treinador ou vídeo enviado pelo aluno, quando houver.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us15" class="sj-story"><strong>US15</strong> Como treinador, quero registrar conclusão dos treinos dos meus alunos para &quot;Concluído&quot;, para auditar e validar o progresso deles após analisar a execução.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn06">RN06</a> · <a href="../regras_negocio/#rn07">RN07</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us15">US15</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,17</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1216">
<summary><span class="sj-requirement-id">RF1216</span><span class="sj-requirement-name">Registrar teste de aptidão física</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador registre o teste de aptidão física do aluno para acompanhamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us16" class="sj-story"><strong>US16</strong> Como treinador, quero adicionar testes de aptidão física, para avaliar formalmente o desempenho e a evolução esportiva dos meus alunos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn04">RN04</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us16">US16</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf1217">
<summary><span class="sj-requirement-id">RF1217</span><span class="sj-requirement-name">Editar teste de aptidão física</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador edite testes de aptidão física dos alunos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us17" class="sj-story"><strong>US17</strong> Como treinador, quero editar testes de aptidão física previamente cadastrados, para corrigir equívocos ou atualizar a matriz de avaliação.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE1 - CP2</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn04">RN04</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us17">US17</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,08</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp3">

## <span>CP3</span> Planejamento e acompanhamento dos treinos {#cp3}

<p class="sj-catalog-group-lead">Apoiar o registro, a organização e a consulta do planejamento e dos treinos realizados pelos alunos. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf2301">
<summary><span class="sj-requirement-id">RF2301</span><span class="sj-requirement-name">Cadastrar planejamento de treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador registre o planejamento de treino de cada aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us18" class="sj-story"><strong>US18</strong> Como treinador, quero registrar o planejamento de treinos de cada aluno, para que eles possam acompanhar e executar as rotinas de treino propostas.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn06">RN06</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us18">US18</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2302">
<summary><span class="sj-requirement-id">RF2302</span><span class="sj-requirement-name">Editar planejamento de treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador edite o planejamento de treino de cada aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us19" class="sj-story"><strong>US19</strong> Como treinador, quero modificar o planejamento de treino já cadastrado, para corrigir possíveis erros ou realizar ajustes de volume de exercícios.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn06">RN06</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us19">US19</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,75</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2303">
<summary><span class="sj-requirement-id">RF2303</span><span class="sj-requirement-name">Associar planejamento de treino a objetivo do aluno</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador associe cada treino planejado aos respectivos objetivos do aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us20" class="sj-story"><strong>US20</strong> Como treinador, quero vincular um treino planejado aos objetivos do aluno, para manter a coerência da prescrição a longo prazo.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn04">RN04</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us20">US20</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,42</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2304">
<summary><span class="sj-requirement-id">RF2304</span><span class="sj-requirement-name">Consultar histórico de planejamentos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte o histórico dos planejamentos de treinos passados para cada aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us21" class="sj-story"><strong>US21</strong> Como treinador, quero consultar o histórico de planejamentos de treinos de cada aluno, para aprimorar e embasar o acompanhamento longitudinal do aluno.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn13">RN13</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us21">US21</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,83</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2305">
<summary><span class="sj-requirement-id">RF2305</span><span class="sj-requirement-name">Comparar treinamentos</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador visualize um relatório comparativo entre os treinos planejados e os realizados por cada aluno, para que seja analisado os resultados do treinamento do aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us22" class="sj-story"><strong>US22</strong> Como treinador, quero gerar um relatório comparativo entre o treino planejado e o efetivamente realizado, para analisar a adesão e o rendimento do aluno.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn07">RN07</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us22">US22</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,08</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2306">
<summary><span class="sj-requirement-id">RF2306</span><span class="sj-requirement-name">Consultar status de treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador identifique o estado de cada treino planejado, como em andamento ou concluído.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us23" class="sj-story"><strong>US23</strong> Como treinador, quero consultar o andamento e status do treino, para aprimorar o acompanhamento da execução diária de cada aluno.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn07">RN07</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us23">US23</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,50</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2307">
<summary><span class="sj-requirement-id">RF2307</span><span class="sj-requirement-name">Criar treino com exercícios</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador crie um treino dentro de um planejamento, selecionando exercícios da biblioteca e definindo a organização da execução (como séries, repetições ou duração).</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us24" class="sj-story"><strong>US24</strong> Como treinador, quero criar um treino dentro de um planejamento, para estruturar a rotina de exercícios do aluno.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn06">RN06</a> · <a href="../regras_negocio/#rn14">RN14</a> · <a href="../regras_negocio/#rn23">RN23</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us24">US24</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,00</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2308">
<summary><span class="sj-requirement-id">RF2308</span><span class="sj-requirement-name">Editar treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador altere os exercícios e as informações de um treino já criado.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us25" class="sj-story"><strong>US25</strong> Como treinador, quero editar um treino já criado, para corrigir eventuais erros, caso tenha, e tornar mais assertivo.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn06">RN06</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us25">US25</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,73</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2309">
<summary><span class="sj-requirement-id">RF2309</span><span class="sj-requirement-name">Excluir planejamento</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador exclua um planejamento de treinamento de um aluno, mantendo o registro dos treinos já realizados.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us26" class="sj-story"><strong>US26</strong> Como treinador, quero excluir um planejamento de treino de um aluno acompanhado, para não passar um planejamento inadequado ao aluno.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn13">RN13</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us26">US26</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,73</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2310">
<summary><span class="sj-requirement-id">RF2310</span><span class="sj-requirement-name">Consultar planejamento de aluno acompanhado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte o planejamento de treinos vigente de cada aluno sob seu acompanhamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us27" class="sj-story"><strong>US27</strong> Como treinador, quero consultar o planejamento de treinos vigente de um aluno acompanhado, para monitorar a rotina prescrita a ele.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us27">US27</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2311">
<summary><span class="sj-requirement-id">RF2311</span><span class="sj-requirement-name">Consultar histórico de treinos de aluno acompanhado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte o histórico de treinos realizados pelos alunos sob seu acompanhamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us28" class="sj-story"><strong>US28</strong> Como treinador, quero consultar o histórico de treinos realizados por um aluno acompanhado, para acompanhar sua evolução e planejar os próximos treinos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP3</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn13">RN13</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us28">US28</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,55</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2312">
<summary><span class="sj-requirement-id">RF2312</span><span class="sj-requirement-name">Registrar status do treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno registre o status do treino indicando como &quot;Feito&quot;. Enquanto não estiver &quot;Feito&quot;, constará como &quot;Em andamento&quot;. A conclusão formal (&quot;Concluído&quot;) é registrada pelo treinador.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us29" class="sj-story"><strong>US29</strong> Como aluno, quero marcar um treino como feito, para que o treinador acompanhe meu progresso e valide a conclusão.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP3</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p>RNF a confirmar.<br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn06">RN06</a> · <a href="../regras_negocio/#rn07">RN07</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us29">US29</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,18</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp4">

## <span>CP4</span> Biblioteca de exercícios {#cp4}

<p class="sj-catalog-group-lead">Organizar exercícios por objetivos e fundamentos, incluindo orientações, erros comuns e materiais demonstrativos. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf2413">
<summary><span class="sj-requirement-id">RF2413</span><span class="sj-requirement-name">Cadastrar exercício</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador cadastre um exercício na biblioteca de exercícios informando o nome, objetivo do exercício, fundamento (obrigatórios) e orientações para sua execução(opcional).</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us30" class="sj-story"><strong>US30</strong> Como treinador, quero cadastrar um exercício na biblioteca, para usá-los para montar os treinos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf12">RNF12</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn14">RN14</a> · <a href="../regras_negocio/#rn22">RN22</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us30">US30</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,75</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2414">
<summary><span class="sj-requirement-id">RF2414</span><span class="sj-requirement-name">Filtrar exercícios por fundamento</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador filtre os exercícios da biblioteca de acordo com o fundamento esportivo associado.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us31" class="sj-story"><strong>US31</strong> Como treinador, quero filtrar a biblioteca de exercícios por fundamento esportivo, para encontrar rapidamente os movimentos adequados na hora de montar o treino.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf12">RNF12</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us31">US31</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,92</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2415">
<summary><span class="sj-requirement-id">RF2415</span><span class="sj-requirement-name">Associar exercício ao objetivo do treino</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador associe um exercício a um ou mais objetivos de treinamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us32" class="sj-story"><strong>US32</strong> Como treinador, quero vincular exercícios da biblioteca a objetivos dos treinos específicos, para padronizar e agilizar futuras prescrições.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf12">RNF12</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us32">US32</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,08</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2416">
<summary><span class="sj-requirement-id">RF2416</span><span class="sj-requirement-name">Associar erros e orientações</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador associe erros comuns e respectivas orientações corretivas aos exercícios cadastrados.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us33" class="sj-story"><strong>US33</strong> Como treinador, quero associar erros comuns e orientações aos exercícios cadastrados, para alertar o aluno e evitar que ele cometa as falhas frequentes relacionadas àquele movimento.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE 2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us33">US33</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,00</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2417">
<summary><span class="sj-requirement-id">RF2417</span><span class="sj-requirement-name">Linkar thumbnail de vídeo base</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador faça o upload de uma imagem em miniatura (<em>thumbnail</em>) personalizada para o vídeo base do exercício ou, caso não seja enviada, deve gerar e exibir uma miniatura automaticamente a partir de um <em>frame</em> do arquivo de vídeo cadastrado.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us34" class="sj-story"><strong>US34</strong> Como treinador, quero gerar uma pequena imagem (<em>thumbnail</em>) para o vídeo base, para facilitar a identificação visual do exercício na biblioteca pelo aluno.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p>RNF a confirmar.<br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us34">US34</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,33</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2418">
<summary><span class="sj-requirement-id">RF2418</span><span class="sj-requirement-name">Cadastrar informações complementares do vídeo base</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve disponibilizar campos de texto para que o treinador cadastre um título e uma descrição breve associados a cada vídeo base da biblioteca, permitindo que alunos e treinadores visualizem essas informações durante a consulta.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us35" class="sj-story"><strong>US35</strong> Como treinador, quero cadastrar título e/ou descrições detalhadas nos vídeos base do exercício, para que o aluno entenda completamente a forma e a execução correta.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us35">US35</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,00</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2419">
<summary><span class="sj-requirement-id">RF2419</span><span class="sj-requirement-name">Documentar erros e orientações</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador documente os erros comuns dos exercícios e orientações sobre eles.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us36" class="sj-story"><strong>US36</strong> Como treinador, quero documentar erros comuns e orientações sobre um exercício, para que o aluno compreenda a execução adequada.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us36">US36</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,73</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2420">
<summary><span class="sj-requirement-id">RF2420</span><span class="sj-requirement-name">Editar erros e orientações</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador edite os erros comuns dos exercícios e orientações sobre eles.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us37" class="sj-story"><strong>US37</strong> Como treinador, quero editar os erros comuns e as orientações de um exercício, para corrigir ou atualizar as instruções de execução.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us37">US37</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,00</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2421">
<summary><span class="sj-requirement-id">RF2421</span><span class="sj-requirement-name">Consultar exercício da biblioteca</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte os detalhes de um exercício da biblioteca: nome, objetivo do exercício, fundamento, orientações, erros comuns e vídeo base, se possuir.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us38" class="sj-story"><strong>US38</strong> Como treinador, quero consultar os detalhes de um exercício da biblioteca, para revisar suas especificações técnicas e orientações.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us38">US38</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,52</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf2413">RF2413</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2422">
<summary><span class="sj-requirement-id">RF2422</span><span class="sj-requirement-name">Editar exercício</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador edite as informações de um exercício cadastrado na biblioteca. Treinos já prescritos mantêm a versão do exercício vigente no momento da prescrição.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us39" class="sj-story"><strong>US39</strong> Como treinador, quero editar as informações de um exercício cadastrado na biblioteca, para corrigir eventuais erros ou atualizar seus dados.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn14">RN14</a> · <a href="../regras_negocio/#rn22">RN22</a> · <a href="../regras_negocio/#rn23">RN23</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us39">US39</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,37</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf2413">RF2413</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2423">
<summary><span class="sj-requirement-id">RF2423</span><span class="sj-requirement-name">Excluir exercício</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador exclua um exercício da biblioteca, preservando a integridade dos treinos e planejamentos que já o utilizaram.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us40" class="sj-story"><strong>US40</strong> Como treinador, quero excluir um exercício cadastrado na biblioteca, para mantê-la organizada e sem itens inutilizáveis.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p>RNF a confirmar.<br><a href="../regras_negocio/#rn13">RN13</a> · <a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us40">US40</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,13</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf2424">
<summary><span class="sj-requirement-id">RF2424</span><span class="sj-requirement-name">Pesquisar exercício por nome</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador pesquise exercícios da biblioteca pelo nome.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us41" class="sj-story"><strong>US41</strong> Como treinador, quero pesquisar um exercício específico pelo nome, para encontrá-los rapidamente.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE2 - CP4</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf12">RNF12</a><br><a href="../regras_negocio/#rn14">RN14</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us41">US41</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,27</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp5">

## <span>CP5</span> Envio privado de vídeos {#cp5}

<p class="sj-catalog-group-lead">Permitir que o aluno envie, de forma opcional, um vídeo relacionado à execução de um exercício. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf3501">
<summary><span class="sj-requirement-id">RF3501</span><span class="sj-requirement-name">Enviar vídeo de execução</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno adicione um vídeo do dispositivo e o envie vinculado a um exercício específico do seu treino.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us42" class="sj-story"><strong>US42</strong> Como aluno, quero mandar um vídeo da execução do exercício, para que o treinador veja como está a minha performance e consiga dar um feedback mais assertivo.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP5</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf06">RNF06</a> · <a href="../requisitos_nao_funcionais/#rnf07">RNF07</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a> · <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a> · <a href="../requisitos_nao_funcionais/#rnf16">RNF16</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn06">RN06</a> · <a href="../regras_negocio/#rn09">RN09</a> · <a href="../regras_negocio/#rn16">RN16</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us42">US42</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,75</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3502">
<summary><span class="sj-requirement-id">RF3502</span><span class="sj-requirement-name">Substituir vídeo enviado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno substitua o vídeo vinculado a um exercício, desde que o treinador ainda não tenha registrado feedback sobre ele.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us43" class="sj-story"><strong>US43</strong> Como aluno, quero trocar o vídeo da execução do exercício que foi enviado, para corrigir o envio de um arquivo errado antes que o treinador avalie a mídia.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP5</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf06">RNF06</a> · <a href="../requisitos_nao_funcionais/#rnf07">RNF07</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a> · <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a> · <a href="../requisitos_nao_funcionais/#rnf16">RNF16</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn09">RN09</a> · <a href="../regras_negocio/#rn10">RN10</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us43">US43</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,75</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf3501">RF3501</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3503">
<summary><span class="sj-requirement-id">RF3503</span><span class="sj-requirement-name">Excluir vídeo enviado</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno exclua um vídeo já enviado, desde que o treinador ainda não tenha registrado feedback sobre ele.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us44" class="sj-story"><strong>US44</strong> Como aluno, quero excluir um vídeo de execução enviado, para cancelar uma submissão feita por engano antes da avaliação do treinador.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP5</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn10">RN10</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us44">US44</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,42</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf3501">RF3501</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp6">

## <span>CP6</span> Feedback privado entre treinador e aluno {#cp6}

<p class="sj-catalog-group-lead">Permitir que o treinador e o aluno registre um feedback vinculado ao vídeo e ao exercício enviado pelo aluno. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf3604">
<summary><span class="sj-requirement-id">RF3604</span><span class="sj-requirement-name">Registrar feedback</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador registre um feedback textual vinculado ao vídeo e ao exercício enviado por um aluno sob seu acompanhamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us45" class="sj-story"><strong>US45</strong> Como treinador, quero registrar um feedback textual na mídia do exercício analisado, para que o aluno compreenda os seus erros e acertos de execução.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn10">RN10</a> · <a href="../regras_negocio/#rn11">RN11</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us45">US45</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3605">
<summary><span class="sj-requirement-id">RF3605</span><span class="sj-requirement-name">Editar feedback</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador edite um feedback que ele mesmo registrou anteriormente.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us46" class="sj-story"><strong>US46</strong> Como treinador, quero modificar um feedback previamente analisado e registrado, para corrigir ou complementar a orientação dada ao aluno.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn11">RN11</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us46">US46</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,67</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf3604">RF3604</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3606">
<summary><span class="sj-requirement-id">RF3606</span><span class="sj-requirement-name">Excluir feedback</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador exclua um feedback que ele mesmo registrou anteriormente.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us47" class="sj-story"><strong>US47</strong> Como treinador, quero excluir um feedback previamente registrado, para remover anotações indevidas ou equivocadas da plataforma.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn11">RN11</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us47">US47</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,17</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf3604">RF3604</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3607">
<summary><span class="sj-requirement-id">RF3607</span><span class="sj-requirement-name">Notificar aluno sobre feedback</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve notificar o aluno quando um feedback for registrado ou editado pelo treinador para um vídeo enviado por ele.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us48" class="sj-story"><strong>US48</strong> Como aluno, quero ser notificado no sistema quando o treinador registrar ou editar um feedback, para saber exatamente quando o meu vídeo foi avaliado e visualizá-lo.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Sistema</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf10">RNF10</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us48">US48</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,00</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf3604">RF3604</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3608">
<summary><span class="sj-requirement-id">RF3608</span><span class="sj-requirement-name">Registrar feedback do aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno autenticado registre um feedback em texto livre ligado a um exercício do seu treino, para relatar ao treinador percepções, dúvidas ou desconfortos sentidos na execução. Só o próprio aluno e o treinador podem ver esse feedback.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us49" class="sj-story"><strong>US49</strong> Como aluno, quero escrever um feedback em texto sobre um exercício do meu treino, para contar ao treinador como foi a execução, minhas dúvidas e desconfortos e receber orientações mais adequadas.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn17">RN17</a> · <a href="../regras_negocio/#rn18">RN18</a> · <a href="../regras_negocio/#rn19">RN19</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us49">US49</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT a registrar</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf2307">RF2307</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3609">
<summary><span class="sj-requirement-id">RF3609</span><span class="sj-requirement-name">Editar feedback do aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno autenticado edite um feedback que ele mesmo registrou, enquanto o treino ligado a esse feedback não estiver com o estado &quot;Concluído&quot;.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us50" class="sj-story"><strong>US50</strong> Como aluno, quero editar o feedback que registrei num exercício enquanto o treino não estiver concluído, para corrigir ou completar o que relatei ao treinador.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn19">RN19</a> · <a href="../regras_negocio/#rn20">RN20</a> · <a href="../regras_negocio/#rn21">RN21</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us50">US50</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT a registrar</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf3608">RF3608</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf3610">
<summary><span class="sj-requirement-id">RF3610</span><span class="sj-requirement-name">Consultar feedback do aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador autenticado consulte, somente para leitura, os feedbacks que os alunos da sua carteira escreveram, ligados aos respectivos exercícios e treinos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us51" class="sj-story"><strong>US51</strong> Como treinador, quero consultar os feedbacks que meus alunos escreveram sobre os exercícios, para ajustar as orientações e o planejamento dos próximos treinos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE3 - CP6</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn18">RN18</a> · <a href="../regras_negocio/#rn20">RN20</a> · <a href="../regras_negocio/#rn21">RN21</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us51">US51</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT a registrar</p></div>
<div><p class="sj-record-label">Dependências</p><p>Depende de: <a href="../requisitos/#rf3608">RF3608</a></p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp7">

## <span>CP7</span> Perfis distintos de acesso {#cp7}

<p class="sj-catalog-group-lead">Diferenciar os acessos e permissões entre treinador e aluno. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf4701">
<summary><span class="sj-requirement-id">RF4701</span><span class="sj-requirement-name">Consultar alunos acompanhados</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte a lista dos alunos em acompanhamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us52" class="sj-story"><strong>US52</strong> Como treinador, quero acessar a lista dos alunos acompanhados, para ter ciência de quais alunos estão em acompanhamento.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP7</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us52">US52</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,42</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="cp8">

## <span>CP8</span> Privacidade de dados, vídeos e feedbacks {#cp8}

<p class="sj-catalog-group-lead">Restringir o acesso aos dados, vídeos e feedbacks individuais de cada aluno. <a href="../solucao/#23-caracteristicas-do-produto">Consultar origem na solução</a>.</p>

<details class="sj-requirement" id="rf4802">
<summary><span class="sj-requirement-id">RF4802</span><span class="sj-requirement-name">Consultar próprios dados cadastrais</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno autenticado consulte seus próprios dados cadastrais, sem acessar os dados cadastrais de outro aluno.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us53" class="sj-story"><strong>US53</strong> Como aluno, quero consultar unicamente os meus próprios dados cadastrais, para ter ciência dos dados armazenados e saber se necessitam de correção.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us53">US53</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,83</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4803">
<summary><span class="sj-requirement-id">RF4803</span><span class="sj-requirement-name">Consultar próprios testes de aptidão física</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno autenticado consulte os testes de aptidão física associados à sua conta, sem acessar os testes de outros alunos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us54" class="sj-story"><strong>US54</strong> Como aluno, quero consultar exclusivamente os resultados dos meus próprios testes de aptidão, para monitorar a minha performance sem acessar dados de terceiros.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us54">US54</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 1,75</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4804">
<summary><span class="sj-requirement-id">RF4804</span><span class="sj-requirement-name">Consultar próprios vídeos enviados</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno consulte os vídeos de execução que enviou, vinculados aos respectivos exercícios, sem acessar vídeos enviados por outros alunos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us55" class="sj-story"><strong>US55</strong> Como aluno, quero consultar unicamente os vídeos de execução que eu mesmo enviei, para rever a minha performance e garantir que a mídia submetida foi a correta.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us55">US55</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4805">
<summary><span class="sj-requirement-id">RF4805</span><span class="sj-requirement-name">Consultar vídeos de alunos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte os vídeos de execução enviados pelos alunos, no contexto dos respectivos exercícios.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us56" class="sj-story"><strong>US56</strong> Como treinador, quero consultar os vídeos de execução enviados pelos alunos sob meu acompanhamento, para avaliar tecnicamente a execução de cada exercício de forma assíncrona.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us56">US56</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,75</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4806">
<summary><span class="sj-requirement-id">RF4806</span><span class="sj-requirement-name">Consultar feedback recebido</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno consulte os feedbacks individuais registrados pelo treinador para seus vídeos e exercícios, mantendo a associação ao conteúdo avaliado e sem acessar feedbacks destinados a outros alunos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us57" class="sj-story"><strong>US57</strong> Como aluno, quero consultar exclusivamente o feedback que o treinador registrou nos meus exercícios realizados, para compreensão de erros e correção de postura.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us57">US57</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,67</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4807">
<summary><span class="sj-requirement-id">RF4807</span><span class="sj-requirement-name">Consultar próprio histórico de treinos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno consulte seu histórico de treinos, sem acessar o histórico de outros alunos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us58" class="sj-story"><strong>US58</strong> Como aluno, quero consultar o meu próprio histórico de treinos já realizados, para acessar rotinas antigas e acompanhar a progressão de cargas.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn13">RN13</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us58">US58</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,58</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4808">
<summary><span class="sj-requirement-id">RF4808</span><span class="sj-requirement-name">Consultar próprios objetivos do aluno</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno consulte os objetivos registrados para ele, sem acessar os objetivos de outros alunos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us59" class="sj-story"><strong>US59</strong> Como aluno, quero consultar exclusivamente os meus próprios objetivos definidos pelo treinador, para ter ciência de que as rotinas de treino são coerentes com as minhas metas.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn04">RN04</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us59">US59</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,42</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4809">
<summary><span class="sj-requirement-id">RF4809</span><span class="sj-requirement-name">Consultar próprio planejamento de treinos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Should Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno consulte os treinos planejados para ele, sem acessar o planejamento de outros alunos.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us60" class="sj-story"><strong>US60</strong> Como aluno, quero consultar exclusivamente o meu próprio planejamento de treino diário/semanal, para entender a organização e a sequência dos exercícios prescritos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us60">US60</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,33</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4810">
<summary><span class="sj-requirement-id">RF4810</span><span class="sj-requirement-name">Consultar perfil de aluno acompanhado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte as informações de perfil de um aluno em acompanhamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us61" class="sj-story"><strong>US61</strong> Como treinador, quero consultar o perfil completo dos alunos sob minha responsabilidade, para analisar dados pessoais atualizados e embasar prescrição de treinos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us61">US61</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,42</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4811">
<summary><span class="sj-requirement-id">RF4811</span><span class="sj-requirement-name">Consultar resultados de testes físicos de aluno</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Could Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o treinador consulte os resultados de testes de aptidão física dos alunos sob seu acompanhamento.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us62" class="sj-story"><strong>US62</strong> Como treinador, quero consultar o histórico de resultados dos testes de aptidão física de alunos acompanhados, para analisar a evolução esportiva e definir quais os treinos adequados para os próximos ciclos.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Treinador</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf10">RNF10</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn03">RN03</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us62">US62</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,25</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4812">
<summary><span class="sj-requirement-id">RF4812</span><span class="sj-requirement-name">Aceitar termos de uso e política de privacidade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve exigir que o usuário aceite os termos de uso e a política de privacidade no cadastro ou no primeiro acesso, registrando a data e a versão aceitas.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us63" class="sj-story"><strong>US63</strong> Como usuário, quero aceitar os termos de uso e a política de privacidade no meu cadastro ou primeiro acesso, para utilizar a plataforma ciente das condições de uso e tratamento de dados.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Usuário</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf17">RNF17</a><br><a href="../regras_negocio/#rn15">RN15</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us63">US63</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 2,42</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4813">
<summary><span class="sj-requirement-id">RF4813</span><span class="sj-requirement-name">Solicitar exclusão dos próprios dados</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Must Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir que o aluno solicite a exclusão de sua conta e de seus dados pessoais, vídeos e feedbacks, conforme os direitos do titular previstos na LGPD (art. 18).</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us64" class="sj-story"><strong>US64</strong> Como aluno, quero solicitar a exclusão da minha conta e dos meus dados pessoais, para encerrar meu vínculo e remover minhas informações da plataforma.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a><br><a href="../regras_negocio/#rn05">RN05</a> · <a href="../regras_negocio/#rn21">RN21</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us64">US64</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 3,37</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

<details class="sj-requirement" id="rf4814">
<summary><span class="sj-requirement-id">RF4814</span><span class="sj-requirement-name">Registrar consentimento de responsável por aluno menor</span><span class="sj-requirement-tags"><span class="sj-tag ">Posterior</span><span class="sj-tag">Won&#x27;t Have</span></span></summary>

<div class="sj-requirement-body">
<div class="sj-record-full"><p class="sj-record-label">Descrição do requisito</p><p>O sistema deve permitir registrar o consentimento do responsável legal quando o aluno for menor de 18 anos, conforme o art. 14 da LGPD. Aplicável se houver alunos menores de idade.</p></div>
<div class="sj-record-full"><p class="sj-record-label">Descrição da história de usuário </p>
<p id="us65" class="sj-story"><strong>US65</strong> Como aluno, quero registrar o consentimento do meu responsável legal, para concluir meu cadastro e utilizar a plataforma.</p>
</div>

<div><p class="sj-record-label">Origem e perfis</p><p><a href="../solucao/#22-objetivos-especificos-oe-do-produto">OE4 - CP8</a><br>Aluno</p></div>
<div><p class="sj-record-label">Condições relacionadas</p><p><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a><br><a href="../regras_negocio/#rn16">RN16</a></p></div>
<div class="sj-record-full"><p class="sj-record-label">Critérios de aceitação</p><p><a href="../criterios_aceitacao/#ca-us65">US65</a></p></div>
<div><p class="sj-record-label">Recorte</p><p>CT registrado: 4,08</p></div>
<div class="sj-record-full sj-record-return"><a href="#guia-do-catalogo">Voltar ao índice de características ↑</a></div>
</div></details>

</section>

## Identificação e correspondências {#identificacao-dos-requisitos}

Cada requisito mantém seu identificador ao mudar de prioridade ou associação. Os identificadores não usam zero à esquerda (ex.: RF01208 → RF1212) e cada requisito possui uma história de usuário (US01 a US65). A correspondência histórica pode ser consultada abaixo.

<details class="sj-document-details" markdown="1"><summary>Consultar histórico dos identificadores</summary>
### Identificadores anteriores

| Identificador anterior | Identificador atual | Observação |
|---|---|---|
| RF01208 | [RF1212 · Consultar dificuldade](#rf1212) |  |
| RF01209 | [RF1213 · Registrar dificuldade](#rf1213) |  |
| RF01210 | [RF1214 · Editar dificuldade](#rf1214) |  |
| RF01211 | [RF1215 · Registrar conclusão de treino](#rf1215) | Antes &quot;Editar status exercícios&quot; |
| RF01212 | [RF1216 · Registrar teste de aptidão física](#rf1216) |  |
| RF01213 | [RF1217 · Editar teste de aptidão física](#rf1217) | Antes &quot;Remover testes&quot; |
| RF02301 | [RF2301 · Cadastrar planejamento de treino](#rf2301) |  |
| RF02302 | [RF2302 · Editar planejamento de treino](#rf2302) |  |
| RF02303 | [RF2303 · Associar planejamento de treino a objetivo do aluno](#rf2303) |  |
| RF02304 | [RF2304 · Consultar histórico de planejamentos](#rf2304) |  |
| RF02305 | [RF2305 · Comparar treinamentos](#rf2305) |  |
| RF02306 | [RF2306 · Consultar status de treino](#rf2306) |  |
| RF02407 | [RF2413 · Cadastrar exercício](#rf2413) |  |
| RF02408 | [RF2414 · Filtrar exercícios por fundamento](#rf2414) |  |
| RF02409 | [RF2415 · Associar exercício ao objetivo do treino](#rf2415) |  |
| RF02410 | [RF2416 · Associar erros e orientações](#rf2416) | Antes &quot;Documentar erros e orientações&quot; |
| RF02411 | [RF2417 · Linkar thumbnail de vídeo base](#rf2417) |  |
| RF02412 | [RF2418 · Cadastrar informações complementares do vídeo base](#rf2418) |  |
| RF03501 | [RF3501 · Enviar vídeo de execução](#rf3501) |  |
| RF03502 | [RF3502 · Substituir vídeo enviado](#rf3502) |  |
| RF03503 | [RF3503 · Excluir vídeo enviado](#rf3503) |  |
| RF03601 | [RF3604 · Registrar feedback](#rf3604) |  |
| RF03602 | [RF3605 · Editar feedback](#rf3605) |  |
| RF03603 | [RF3606 · Excluir feedback](#rf3606) |  |
| RF03604 | [RF3607 · Notificar aluno sobre feedback](#rf3607) |  |
| RF04701 | [RF4701 · Consultar alunos acompanhados](#rf4701) |  |
| RF04802 | [RF4802 · Consultar próprios dados cadastrais](#rf4802) |  |
| RF04803 | [RF4803 · Consultar próprios testes de aptidão física](#rf4803) |  |
| RF04804 | [RF4804 · Consultar próprios vídeos enviados](#rf4804) |  |
| RF04805 | [RF4805 · Consultar vídeos de alunos](#rf4805) |  |
| RF04806 | [RF4806 · Consultar feedback recebido](#rf4806) |  |
| RF04807 | [RF4807 · Consultar próprio histórico de treinos](#rf4807) |  |
| RF04808 | [RF4808 · Consultar próprios objetivos do aluno](#rf4808) |  |
| RF04809 | [RF4809 · Consultar próprio planejamento de treinos](#rf4809) |  |
| RF04810 | [RF4810 · Consultar perfil de aluno acompanhado](#rf4810) |  |
| RF04811 | [RF4811 · Consultar resultados de testes físicos de aluno](#rf4811) |  |

### Antiga página Requisitos

| Código na antiga página Requisitos | Identificador atual |
|---|---|
| RF01201 | [RF1212 · Consultar dificuldade](#rf1212) |
| RF01202 | [RF1213 · Registrar dificuldade](#rf1213) |
| RF01203 | [RF1214 · Editar dificuldade](#rf1214) |
| RF01204 | [RF1215 · Registrar conclusão de treino](#rf1215) |
| RF01205 | [RF1216 · Registrar teste de aptidão física](#rf1216) |
| RF01206 | [RF1217 · Editar teste de aptidão física](#rf1217) |
| RF02401 | [RF2413 · Cadastrar exercício](#rf2413) |
| RF02402 | [RF2414 · Filtrar exercícios por fundamento](#rf2414) |
| RF02403 | [RF2415 · Associar exercício ao objetivo do treino](#rf2415) |
| RF02404 | [RF2416 · Associar erros e orientações](#rf2416) |
| RF02405 | [RF2417 · Linkar thumbnail de vídeo base](#rf2417) |
| RF02406 | [RF2418 · Cadastrar informações complementares do vídeo base](#rf2418) |
| RF04801 | [RF4802 · Consultar próprios dados cadastrais](#rf4802) |
| RF04802 | [RF4803 · Consultar próprios testes de aptidão física](#rf4803) |
| RF04803 | [RF4804 · Consultar próprios vídeos enviados](#rf4804) |
| RF04804 | [RF4805 · Consultar vídeos de alunos](#rf4805) |
| RF04805 | [RF4806 · Consultar feedback recebido](#rf4806) |
| RF04806 | [RF4807 · Consultar próprio histórico de treinos](#rf4807) |
| RF04807 | [RF4808 · Consultar próprios objetivos do aluno](#rf4808) |
| RF04808 | [RF4809 · Consultar próprio planejamento de treinos](#rf4809) |
| RF04809 | [RF4810 · Consultar perfil de aluno acompanhado](#rf4810) |
| RF04810 | [RF4811 · Consultar resultados de testes físicos de aluno](#rf4811) |


<span id="requisitos-funcionais"></span>
<span id="requisitos-nao-funcionais"></span>

Os [RNFs](requisitos_nao_funcionais.md) possuem registros próprios. A classificação de MVP de cada RF é mantida em sua ficha; as páginas de consulta não mantêm cópias das listas.

</details>
<span id="referencia-da-consolidacao"></span>
