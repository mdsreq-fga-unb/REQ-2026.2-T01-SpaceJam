<span id="representacao-formal-dos-requisitos"></span>

# Modelagem Complementar: Representação Formal dos Requisitos Críticos

<div class="sj-catalog-intro">
<p class="sj-catalog-kicker">MODELAGEM COMPLEMENTAR · ESPECIFICAÇÃO MATEMÁTICA FORMAL</p>
<p class="sj-catalog-lead">Invariantes de segurança e contratos de estado dos requisitos críticos.</p>
<p>Em conformidade com a Seção 5.1 da Engenharia de Requisitos do projeto Space Jam (fase de <em>Design do Usuário</em> — atividade de <em>Declaração e Representação / Modelagem Complementar de Requisitos</em> do ciclo RAD), este documento consolida a formalização matemática seletiva dos requisitos críticos de segurança, controle de acesso baseado em funções (RBAC), isolamento multi-inquilino (<em>multi-tenant</em>), ciclo de vida e imutabilidade de mídias, segregação de edição clínica e conformidade com a LGPD. Para preservar a comunicabilidade com stakeholders técnicos e não técnicos, cada definição, invariante e contrato apresenta sua <strong>tradução lado a lado em linguagem natural</strong>.</p>
<div class="sj-catalog-links">
<a href="#legenda-simbolos">Legenda de símbolos</a>
<a href="../requisitos/">Catálogo de requisitos</a>
<a href="../requisitos_nao_funcionais/">RNFs</a>
<a href="../regras_negocio/">Regras de negócio</a>
<a href="../representacao_informal/">Representação informal</a>
</div>
</div>

<p class="sj-catalog-status"><strong>Especificação formal com fichas expansíveis.</strong> Cada invariante e contrato apresenta notação matemática e tradução direta em linguagem natural. Clique sobre a ficha correspondente para estender seus detalhes, fórmulas, garantias e rastreabilidade.</p>

<nav id="guia-da-formalizacao" class="sj-cp-index" aria-label="Consultar seções da especificação formal">
<p class="sj-cp-index-title">Escolha uma seção para consultar</p>
<div class="sj-cp-index-grid">
<a href="#dominios-e-estado"><span>DOM</span><strong>1. Domínios, Conjuntos e Relações de Estado</strong><span aria-hidden="true">↓</span></a>
<a href="#invariantes-globais"><span>INV</span><strong>2. Invariantes Globais do Sistema (INV-01 a INV-06)</strong><span aria-hidden="true">↓</span></a>
<a href="#contratos-operacoes"><span>OP</span><strong>3. Contratos de Operações Críticas (OP-01 a OP-04)</strong><span aria-hidden="true">↓</span></a>
<a href="#rastreabilidade-historico"><span>REV</span><strong>4. Rastreabilidade, Escopo e Histórico de Versão</strong><span aria-hidden="true">↓</span></a>
</div>
</nav>

<details class="sj-requirement" id="legenda-simbolos" markdown="1">

<summary><span class="sj-requirement-id">GUIA</span><span class="sj-requirement-name">Legenda de Símbolos Matemáticos e Lógica Formal</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">Guia de Leitura</span><span class="sj-tag">Notação</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Como interpretar a especificação formal</p>

<p>Para assegurar a comunicabilidade entre a equipe de desenvolvimento e os demais <em>stakeholders</em>, a tabela abaixo resume os símbolos matemáticos, operadores lógicos e notações de estado utilizados nas seções de domínios, invariantes e contratos:</p>

| Símbolo | Nome e Leitura | Significado na Modelagem | Aplicação Prática no Space Jam |
| :---: | :--- | :--- | :--- |
| $\neg$ | **Negação lógica** ("Não") | Inverte o valor-verdade da proposição seguinte | $\neg\text{senha\_temporaria}(u)$ indica que a senha provisória de primeiro acesso já foi trocada |
| $\land$ | **Conjunção lógica** ("E", $\wedge$) | Exige que ambas as condições conectadas sejam verdadeiras | $\text{status}(u) = \text{Ativo} \land \dots$ exige conta ativa **e** aprovada |
| $\lor$ | **Disjunção lógica** ("OU") | Exige que ao menos uma das condições seja verdadeira | $u = a \lor (u, a) \in V$ concede acesso ao próprio atleta **ou** ao treinador vinculado |
| $\Rightarrow$ | **Implicação lógica** ("Se... então") | Se a premissa à esquerda for satisfeita, o lado direito é obrigatoriamente válido | $\text{sessao\_ativa}(u) \Rightarrow \text{status}(u) = \text{Ativo}$ |
| $\iff$ | **Bi-implicação** ("Se e somente se") | Estabelece equivalência estrita: um lado ocorre se, e apenas se, o outro ocorrer | $\text{pode\_ler}(u, r) \iff (\dots)$ delimita leitura exclusiva e fechada |
| $\in$ | **Pertinência** ("Pertence a", E) | Indica que um elemento integra determinado conjunto | $a \in U$ ($a$ é usuário do sistema); $(t, a) \in V$ (par vinculado na carteira) |
| $\notin$ | **Não pertinência** ("Não pertence") | Indica que o elemento não é membro do conjunto | $u \notin U$ (usuário não registrado na base de dados) |
| $\forall$ | **Quantificador universal** ("Para todo") | Afirma que a propriedade é obrigatória para todos os membros do domínio | $\forall u \in U$ (aplica-se a todo e qualquer usuário sem exceção) |
| $\exists$ | **Quantificador existencial** ("Existe") | Afirma que existe pelo menos um elemento que cumpre a condição | $\exists t \in U$ (existe ao menos um treinador emissor do convite privado) |
| $\neg\exists$ | **Inexistência** ("Não existe") | Afirma que nenhum elemento cumpre a condição especificada | $\neg\exists f \in F\; (\text{video}(f) = m)$ (não existe nenhum feedback avaliativo registrado) |
| $\subseteq$ | **Subconjunto** ("Contido em") | Todos os elementos do primeiro conjunto pertencem ao segundo | $V \subseteq \{\text{Treinador}\} \times \{\text{Atleta}\}$ (vínculos válidos de carteira) |
| $\mid$ | **Separador de condição** ("Tal que") | Delimita a propriedade que os elementos de um conjunto devem satisfazer | $\{t \in U \mid \text{perfil}(t) = \text{Treinador}\}$ (filtra usuários cujo perfil seja Treinador) |
| $\times$ | **Produto cartesiano** | Conjunto de todos os pares ordenados possíveis entre dois domínios | Vinculações possíveis entre o conjunto de treinadores e o conjunto de atletas |
| $\setminus$ | **Diferença de conjuntos** ("Menos", exclusão) | Remove elementos específicos de um conjunto | $M \setminus \{m\}$ representa o acervo de vídeos excluindo o vídeo $m$ |
| $\cup$ | **União de conjuntos** ("Mais", inclusão) | Adiciona ou combina elementos em um conjunto | $(M \setminus \{m\}) \cup \{m_{\text{novo}}\}$ substitui o arquivo no acervo |
| $\emptyset$ | **Conjunto vazio** | Conjunto desprovido de elementos (ausência de dados ou modificações) | $\Delta D_{\text{clinico}} = \emptyset$ (nenhum dado clínico foi alterado na operação) |
| $\{ \dots \}$ | **Delimitador de conjunto** | Representa uma coleção finita ou enumeração de elementos | $P = \{\text{Admin}, \text{Treinador}, \text{Atleta}\}$ (conjunto de perfis possíveis) |
| $(a, b)$ | **Par ordenado / Tupla** | Agrupamento ordenado de valores ou atributos | $(t, a) \in V$ (vínculo direcionado treinador-atleta) e tupla de atributos biométricos |
| $=$ | **Igualdade matemática e de estado** | Atribui ou compara a igualdade estrita entre valores ou estados | $\text{status}(u) = \text{Ativo}$, $\text{estado}_T(\tau) = \text{Concluido}$ |
| $<$, $>$ | **Menor que / Maior que** | Operadores relacionais de desigualdade estrita | $\text{idade}(a) < 18$ (atleta menor de idade), $0 < \text{duracao}(m)$ |
| $\le$ | **Menor ou igual a** | Limite superior inclusivo para valores numéricos | $\text{duracao}(m) \le 60\text{ s}$, $\text{tamanho}(m) \le 100\text{ MB}$ |
| $\to$ | **Função / Mapeamento** ("Leva a") | Relaciona cada elemento do domínio a um resultado no contradomínio | $\text{perfil}: U \to P$ mapeia cada usuário para exatamente um perfil |
| $\Sigma$ | **Estado global do sistema** | Representação formal da base de dados e relacionamentos válidos em um instante | O estado consistente preservado antes e após cada transição válida |
| $X'$ | **Pós-estado da transição** ("Novo estado") | Valor de uma entidade, atributo ou conjunto imediatamente após a operação | $D'_{\text{pessoal}}$, $M'$, $\text{status}'(a)$ representam os novos estados pós-operação |
| $\Delta$ | **Delta / Variação** | Bloco de campos e valores submetidos em uma requisição | $\Delta D_{\text{pessoal}}$ (novos dados cadastrais submetidos para atualização) |
| $\oplus$ | **Operador de atualização** (Sobrescrita) | Mescla e aplica as alterações parciais recebidas sobre os registros originais | $D_{\text{pessoal}}(a) \oplus \Delta D_{\text{pessoal}}$ |
| $\tau$ | **Treino prescrito** | Variável que referencia a instância do treino prescrito sob avaliação | $\text{estado}'_T(\tau) = \text{Corrigir\_Refazer}$ atualiza o treino $\tau$ do atleta |
| $\delta$ | **Decisão técnica / Parecer** | Variável que indica o parecer avaliativo registrado pelo treinador | $\delta \in \{\text{Devolvido}, \text{Aprovado}\}$ orienta a transição de estado de $\tau$ |

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<section markdown="1" class="sj-catalog-group" aria-labelledby="dominios-e-estado">

## <span>DOM</span> 1. Domínios, Conjuntos e Relações do Estado do Sistema {#dominios-e-estado}

<p class="sj-catalog-group-lead">Seja $\Sigma$ o estado válido da plataforma Space Jam em um instante qualquer. As estruturas fundamentais abaixo delimitam as entidades, conjuntos finitos e mapeamentos fundamentais da aplicação.</p>

<details class="sj-requirement" id="dom-01" markdown="1">

<summary><span class="sj-requirement-id">DOM-01</span><span class="sj-requirement-name">Usuários, perfis e contas (RBAC)</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Acesso</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Notação formal</p>

$$\begin{aligned}
U &: \text{conjunto finito de contas de usuários}; \\
P &= \{\text{Admin}, \text{Treinador}, \text{Atleta}\}; \\
S_{\text{conta}} &= \{\text{Pendente}, \text{Ativo}, \text{Inativo}\}; \\
\text{perfil} &: U \to P; \\
\text{status} &: U \to S_{\text{conta}}
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Todo usuário registrado em $U$ possui obrigatoriamente um único perfil de acesso ($P$) e uma única situação cadastral ($S_{\text{conta}}$) em qualquer instante de tempo no sistema.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Garantir que toda conta criada em $U$ receba exatamente um perfil em $P$ e um estado inicial em $S_{\text{conta}}$ sem valores nulos ou ambíguos
- [ ] Validar no <em>backend</em> e na interface que o papel do usuário e o status da conta sejam verificados antes de liberar operações restritas

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e origem</p>

<p><a href="../requisitos/#cp1">CP1</a> · <a href="../requisitos/#cp7">CP7</a><br><a href="../requisitos/#rf1101">RF1101</a> · <a href="../requisitos/#rf1102">RF1102</a> · <a href="../requisitos/#rf1104">RF1104</a> · <a href="../requisitos/#rf1105">RF1105</a><br><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> (Controle de Acesso Baseado em Funções - RBAC)<br><a href="../regras_negocio/#rn01">RN01</a> · <a href="../regras_negocio/#rn24">RN24</a> · <a href="../regras_negocio/#rn25">RN25</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Garantia no estado $\Sigma$</p>

<p>Inexistência de contas sem perfil ou com permissões ambíguas, estabelecendo a base para o modelo de autorização rígido.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="dom-02" markdown="1">

<summary><span class="sj-requirement-id">DOM-02</span><span class="sj-requirement-name">Carteira e vínculo privado treinador-atleta</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Multi-tenant</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Notação formal</p>

$$V \subseteq \{t \in U \mid \text{perfil}(t) = \text{Treinador}\} \times \{a \in U \mid \text{perfil}(a) = \text{Atleta}\}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>$V$ representa o conjunto de pares $(t, a)$ em que um treinador $t$ e um atleta $a$ possuem vínculo ativo estabelecido exclusivamente via Código de Convite Privado válido emitido pelo respectivo treinador.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Exigir código válido do treinador no cadastro do atleta para registrar o par $(t, a) \in V$ automaticamente
- [ ] Impedir que atletas sejam cadastrados ou consultados fora da carteira $V$ de um treinador válido

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e origem</p>

<p><a href="../requisitos/#cp1">CP1</a> · <a href="../requisitos/#cp7">CP7</a><br><a href="../requisitos/#rf1101">RF1101</a> · <a href="../requisitos/#rf1102">RF1102</a><br><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> (Isolamento Multi-inquilino de Dados)<br><a href="../regras_negocio/#rn02">RN02</a> · <a href="../regras_negocio/#rn03">RN03</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Garantia no estado $\Sigma$</p>

<p>Fundamento da arquitetura multi-inquilino: o atleta só é visível e acessível pelo treinador que detém seu vínculo formal na carteira.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="dom-03" markdown="1">

<summary><span class="sj-requirement-id">DOM-03</span><span class="sj-requirement-name">Dados do atleta e segregação clínica</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Privacidade</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Notação formal</p>

$$\begin{aligned}
D_{\text{pessoal}}(a) &= (\text{nome}, \text{sobrenome}, \text{apelido}, \text{contato}, \text{altura}, \text{peso}, \text{envergadura}, \text{foto}) \\
D_{\text{clinico}}(a) &= (\text{historico\_lesoes}, \text{aptidao\_fisica}, \text{objetivos\_taticos}, \text{resultados\_treinos})
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Os dados de cada atleta $a$ são rigorosamente particionados em dois grupos disjuntos: dados cadastrais e biométricos primários ($D_{\text{pessoal}}$) e dados técnicos e clínicos sensíveis ($D_{\text{clinico}}$).</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Separar claramente os campos de $D_{\text{pessoal}}(a)$ e $D_{\text{clinico}}(a)$ nos modelos, rotas/endpoints e telas de edição
- [ ] Bloquear tentativas de alterar dados clínicos pelo atleta ou dados cadastrais básicos pelo treinador

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e origem</p>

<p><a href="../requisitos/#rf1107">RF1107</a> · <a href="../requisitos/#rf1111">RF1111</a><br><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a><br><a href="../regras_negocio/#rn04">RN04</a> · <a href="../regras_negocio/#rn25">RN25</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Garantia no estado $\Sigma$</p>

<p>Segregação estrita de competências: impede que atletas alterem avaliações de lesões, e que treinadores alterem identificações cadastrais básicas.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="dom-04" markdown="1">

<summary><span class="sj-requirement-id">DOM-04</span><span class="sj-requirement-name">Biblioteca e ciclo de treinos</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Operação</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Notação formal</p>

$$\begin{aligned}
E &: \text{conjunto finito de exercícios disponíveis na biblioteca}; \\
T &: \text{conjunto de treinos prescritos aos atletas}; \\
\text{estado}_T &: T \to \{\text{A\_fazer}, \text{Concluido}, \text{Corrigir\_Refazer}\}
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Cada item de treino prescrito em $T$ (montado a partir da biblioteca $E$) encontra-se sempre e exclusivamente em um dos três estados possíveis: <em>A fazer</em>, <em>Concluído</em> ou <em>Corrigir/Refazer</em>.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Restringir os estados de cada treino/exercício em $T$ aos valores previstos na máquina de estados e impedir transições inválidas
- [ ] Garantir que exercícios da biblioteca $E$ possam ser incluídos em novas prescrições sem quebrar treinos já registrados

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e origem</p>

<p><a href="../requisitos/#cp2">CP2</a> · <a href="../requisitos/#cp3">CP3</a> · <a href="../requisitos/#cp4">CP4</a><br><a href="../requisitos/#rf2301">RF2301</a> · <a href="../requisitos/#rf2307">RF2307</a> · <a href="../requisitos/#rf2413">RF2413</a><br><a href="../requisitos_nao_funcionais/#rnf04">RNF04</a> · <a href="../requisitos_nao_funcionais/#rnf11">RNF11</a><br><a href="../regras_negocio/#rn06">RN06</a> · <a href="../regras_negocio/#rn07">RN07</a> · <a href="../regras_negocio/#rn14">RN14</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Garantia no estado $\Sigma$</p>

<p>Máquina de estados determinística para a rotina de exercícios, impedindo inconsistência no acompanhamento do atleta.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="dom-05" markdown="1">

<summary><span class="sj-requirement-id">DOM-05</span><span class="sj-requirement-name">Vídeos de execução e feedbacks vinculados</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Mídia</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Notação formal</p>

$$\begin{aligned}
M &: \text{conjunto de vídeos de execução submetidos}; \\
F &: \text{conjunto de feedbacks avaliativos registrados}; \\
\text{video} &: F \to M
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Todo feedback avaliativo registrado por um treinador em $F$ está obrigatoriamente associado a um vídeo de execução específico enviado em $M$. Não são permitidos feedbacks desvinculados de mídia.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Exigir referência obrigatória a um vídeo válido $m \in M$ ao criar ou persistir qualquer feedback avaliativo em $F$
- [ ] Impedir feedbacks órfãos ou apontando para vídeos inexistentes ou removidos

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e origem</p>

<p><a href="../requisitos/#cp5">CP5</a> · <a href="../requisitos/#cp6">CP6</a><br><a href="../requisitos/#rf3501">RF3501</a> · <a href="../requisitos/#rf3604">RF3604</a><br><a href="../requisitos_nao_funcionais/#rnf06">RNF06</a> · <a href="../requisitos_nao_funcionais/#rnf12">RNF12</a><br><a href="../regras_negocio/#rn09">RN09</a> · <a href="../regras_negocio/#rn10">RN10</a> · <a href="../regras_negocio/#rn11">RN11</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Garantia no estado $\Sigma$</p>

<p>Integridade referencial contínua entre submissão do atleta e orientação técnica do treinador.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="invariantes-globais">

## <span>INV</span> 2. Invariantes Globais do Sistema (INV) {#invariantes-globais}

<p class="sj-catalog-group-lead">As propriedades abaixo devem permanecer estritamente verdadeiras antes e após qualquer transição de estado válida em $\Sigma$. Qualquer tentativa de operação que viole um invariante é sumariamente rejeitada pelo sistema.</p>

<details class="sj-requirement" id="inv-01" markdown="1">

<summary><span class="sj-requirement-id">INV-01</span><span class="sj-requirement-name">Autenticação, aprovação administrativa e RBAC</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Segurança</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Especificação matemática formal</p>

$$\begin{aligned}
\forall u \in U:\; \text{sessao\_ativa}(u) \Rightarrow \Big(& \text{status}(u) = \text{Ativo} \\
&\land\; \neg\text{senha\_temporaria}(u) \\
&\land\; (\text{perfil}(u) = \text{Treinador} \Rightarrow \text{aprovado\_admin}(u)) \Big)
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Para qualquer usuário $u$, se ele possui uma sessão autenticada ativa, então sua conta está obrigatoriamente <strong>Ativa</strong>, sua <strong>senha temporária de primeiro acesso já foi trocada</strong> e, caso seu perfil seja <strong>Treinador</strong>, seu cadastro já recebeu <strong>aprovação prévia formal do Administrador</strong>.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Bloquear autenticação/sessão ativa para contas com <code>status</code> diferente de <code>Ativo</code>
- [ ] Exigir troca de senha quando <code>senha_temporaria</code> for verdadeira antes de liberar o uso completo
- [ ] Impedir que contas com perfil <code>Treinador</code> atuem sem aprovação prévia válida (<code>aprovado_admin</code>)

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf1101">RF1101</a> · <a href="../requisitos/#rf1102">RF1102</a> · <a href="../requisitos/#rf1104">RF1104</a> · <a href="../requisitos/#rf1105">RF1105</a> · <a href="../requisitos/#rf1108">RF1108</a><br><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a><br><a href="../regras_negocio/#rn01">RN01</a> · <a href="../regras_negocio/#rn24">RN24</a> · <a href="../regras_negocio/#rn25">RN25</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Aplicação no produto</p>

<p>Bloqueia a atuação de treinadores antes da auditoria administrativa e força a definição de senha pessoal no <em>onboarding</em>.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="inv-02" markdown="1">

<summary><span class="sj-requirement-id">INV-02</span><span class="sj-requirement-name">Vínculo obrigatório do atleta por convite privado</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Multi-tenant</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Especificação matemática formal</p>

$$\begin{aligned}
\forall a \in U:\; \text{perfil}(a) = \text{Atleta} \Rightarrow \exists t \in U:\; \Big(& \text{perfil}(t) = \text{Treinador} \\
&\land\; (t, a) \in V \\
&\land\; \text{codigo\_convite\_valido}(t, a) \Big)
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Todo usuário com perfil <strong>Atleta</strong> cadastrado na plataforma está obrigatoriamente vinculado a pelo menos um <strong>Treinador</strong> válido por meio de um <strong>código de convite privado</strong> emitido por esse treinador.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Validar o código de convite privado no cadastro do atleta e rejeitar códigos inválidos, expirados ou inexistentes
- [ ] Registrar o vínculo $(t, a) \in V$ de forma atômica no momento da criação da conta do atleta

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf1101">RF1101</a> · <a href="../requisitos/#rf1102">RF1102</a><br><a href="../requisitos_nao_funcionais/#rnf09">RNF09</a><br><a href="../regras_negocio/#rn02">RN02</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Aplicação no produto</p>

<p>Elimina o risco de atletas sem acompanhamento técnico e garante a adesão à carteira privada desde o momento do cadastro.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="inv-03" markdown="1">

<summary><span class="sj-requirement-id">INV-03</span><span class="sj-requirement-name">Isolamento multi-inquilino de dados</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Privacidade</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Especificação matemática formal</p>

$$\begin{aligned}
\forall u \in U,\; \forall a \in U\; (\text{perfil}(a) = \text{Atleta}),\; \forall r \in \text{Recursos}(a): \\
\text{pode\_ler}(u, r) \iff \Big( u = a \;\lor\; (\text{perfil}(u) = \text{Treinador} \;\land\; (u, a) \in V) \Big)
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Um usuário $u$ só pode ler os recursos privados de um atleta $a$ (ficha clínica, treinos, vídeos e feedbacks) <strong>se e somente se</strong> $u$ for o próprio atleta ou um treinador ativamente vinculado a ele na carteira $V$.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Filtrar leituras de ficha clínica, treinos, vídeos e feedbacks pelo próprio atleta $a$ ou por treinador com $(u, a) \in V$
- [ ] Cobrir com testes de autorização (IDOR / acesso cruzado) que outros atletas ou treinadores sem vínculo tenham o acesso negado

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf4802">RF4802</a> · <a href="../requisitos/#rf4805">RF4805</a> · <a href="../requisitos/#rf4810">RF4810</a><br><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf09">RNF09</a> · <a href="../requisitos_nao_funcionais/#rnf12">RNF12</a><br><a href="../regras_negocio/#rn03">RN03</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Aplicação no produto</p>

<p>Segurança multi-inquilino: impede vazamento de treinos, vídeos e feedbacks para outros treinadores ou atletas de outras carteiras.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="inv-04" markdown="1">

<summary><span class="sj-requirement-id">INV-04</span><span class="sj-requirement-name">Conformidade LGPD e proteção de menores de idade</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">LGPD</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Especificação matemática formal</p>

$$\begin{aligned}
\forall a \in U:\; (\text{perfil}(a) = \text{Atleta} \;\land\; \text{idade}(a) < 18) \Rightarrow \Big(& \text{aceite\_termos}(a) \\
&\land\; \text{consentimento\_responsavel}(a) \Big)
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Nenhum atleta <strong>menor de 18 anos</strong> (como os atletas de 15 anos do escopo do projeto) pode ter dados pessoais ou vídeos processados sem que haja o <strong>aceite formal dos termos</strong> e o <strong>consentimento registrado do responsável legal</strong>.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Calcular/validar a idade do atleta no cadastro e exigir aceite dos termos e consentimento do responsável legal quando $\text{idade}(a) < 18$
- [ ] Bloquear o processamento de dados pessoais e mídias de menores de 18 anos caso o consentimento exigido não esteja registrado

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf4812">RF4812</a> · <a href="../requisitos/#rf4814">RF4814</a><br><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf16">RNF16</a><br><a href="../regras_negocio/#rn15">RN15</a> · <a href="../regras_negocio/#rn16">RN16</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Aplicação no produto</p>

<p>Conformidade jurídica com o art. 14 da LGPD para tratamento de dados pessoais e de imagem de crianças e adolescentes.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="inv-05" markdown="1">

<summary><span class="sj-requirement-id">INV-05</span><span class="sj-requirement-name">Restrições técnicas de mídia no upload</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Mídia</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Especificação matemática formal</p>

$$\begin{aligned}
\forall m \in M:\; &\text{formato}(m) \in \{\texttt{.mp4}, \texttt{.mov}\} \\
&\land\; 0 < \text{duracao}(m) \le 60 \\
&\land\; 0 < \text{tamanho}(m) \le 100
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Todo vídeo armazenado no sistema deve obrigatoriamente possuir formato <code>.mp4</code> ou <code>.mov</code>, duração maior que zero e <strong>no máximo 60 segundos</strong>, e tamanho maior que zero e <strong>no máximo 100 MB</strong>.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Validar no <em>frontend</em> e no <em>backend</em> que o formato seja <code>.mp4</code> ou <code>.mov</code>
- [ ] Validar que a duração esteja no intervalo $0 < \text{duracao}(m) \le 60\text{ s}$ e o tamanho em $0 < \text{tamanho}(m) \le 100\text{ MB}$

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf3501">RF3501</a> · <a href="../requisitos/#rf3502">RF3502</a><br><a href="../requisitos_nao_funcionais/#rnf06">RNF06</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn09">RN09</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Aplicação no produto</p>

<p>Validação rigorosa em frontend e backend para prevenir sobrecarga de infraestrutura e garantir foco em treinos curtos.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="inv-06" markdown="1">

<summary><span class="sj-requirement-id">INV-06</span><span class="sj-requirement-name">Imutabilidade do vídeo após feedback avaliativo</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Integridade</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Especificação matemática formal</p>

$$\begin{aligned}
\forall m \in M:\; (\exists f \in F:\; \text{video}(f) = m) \Rightarrow \Big(& \neg\text{pode\_substituir}(m) \\
&\land\; \neg\text{pode\_excluir}(m) \Big)
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p>Assim que existir pelo menos um feedback avaliativo $f$ associado a um vídeo $m$, esse arquivo torna-se <strong>estritamente imutável</strong>, ficando bloqueadas tanto a sua <strong>substituição</strong> quanto a sua <strong>exclusão</strong>.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Verificar na API e na interface se já existe algum feedback $f \in F$ com $\text{video}(f) = m$ antes de permitir troca ou exclusão
- [ ] Retornar bloqueio explícito caso o atleta tente substituir ou excluir um vídeo já avaliado

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf3502">RF3502</a> · <a href="../requisitos/#rf3503">RF3503</a> · <a href="../requisitos/#rf3604">RF3604</a><br><a href="../requisitos_nao_funcionais/#rnf12">RNF12</a> · <a href="../requisitos_nao_funcionais/#rnf17">RNF17</a><br><a href="../regras_negocio/#rn10">RN10</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Aplicação no produto</p>

<p>Preserva a consistência pedagógica e a rastreabilidade da avaliação técnica dada pelo treinador.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="contratos-operacoes">

## <span>OP</span> 3. Contratos Formais de Operações Críticas (Pré e Pós-Condições) {#contratos-operacoes}

<p class="sj-catalog-group-lead">Contratos rigorosos que especificam as pré-condições exigidas para executar operações nucleares e as pós-condições garantidas sobre as estruturas de dados após a execução.</p>

<details class="sj-requirement" id="op-01" markdown="1">

<summary><span class="sj-requirement-id">OP-01</span><span class="sj-requirement-name">Edição segregada de perfil do atleta</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Contrato</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Assinatura da operação</p>

$$\text{EditarPerfil}(u, a, \Delta D_{\text{pessoal}}, \Delta D_{\text{clinico}})$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Contrato formal (Pré e pós-condições)</p>

$$\begin{aligned}
\textbf{Pré-condição:} \quad &\text{sessao\_ativa}(u) \;\land\; \Big( (u = a \;\land\; \Delta D_{\text{clinico}} = \emptyset) \\
&\lor\; (\text{perfil}(u) = \text{Treinador} \;\land\; (u, a) \in V \;\land\; \Delta D_{\text{pessoal}} = \emptyset) \Big) \\[1em]
\textbf{Pós-condição:} \quad &\Big( u = a \Rightarrow D'_{\text{pessoal}}(a) = D_{\text{pessoal}}(a) \oplus \Delta D_{\text{pessoal}} \;\land\; D'_{\text{clinico}}(a) = D_{\text{clinico}}(a) \Big) \\
\land\; &\Big( (u, a) \in V \Rightarrow D'_{\text{clinico}}(a) = D_{\text{clinico}}(a) \oplus \Delta D_{\text{clinico}} \;\land\; D'_{\text{pessoal}}(a) = D_{\text{pessoal}}(a) \Big)
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p><strong>Antes da operação:</strong> O solicitante $u$ deve estar autenticado com sessão ativa. Se for o próprio atleta ($u = a$), não tem permissão para alterar dados clínicos sensíveis ($\Delta D_{\text{clinico}} = \emptyset$). Se for o treinador vinculado na carteira, não tem permissão para alterar dados pessoais primários ($\Delta D_{\text{pessoal}} = \emptyset$).<br><strong>Depois da operação:</strong> Apenas o bloco expressamente autorizado ao respectivo perfil é modificado no novo estado $D'$, mantendo o outro bloco estritamente preservado e intacto.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Garantir que na edição feita pelo atleta ($\Delta D_{\text{clinico}} = \emptyset$) apenas $D_{\text{pessoal}}(a)$ seja alterado
- [ ] Garantir que na edição feita pelo treinador vinculado ($\Delta D_{\text{pessoal}} = \emptyset$) apenas $D_{\text{clinico}}(a)$ seja alterado

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf1107">RF1107</a> · <a href="../requisitos/#rf1111">RF1111</a><br><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf14">RNF14</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn04">RN04</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Segregação de responsabilidade</p>

<p>Garante integridade médica e técnica: dados de aptidão e lesões permanecem sob responsabilidade exclusiva do treinador.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="op-02" markdown="1">

<summary><span class="sj-requirement-id">OP-02</span><span class="sj-requirement-name">Substituição ou exclusão de vídeo antes da avaliação</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Contrato</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Assinatura da operação</p>

$$\text{SubstituirOuExcluirVideo}(a, m, m_{\text{novo}})$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Contrato formal (Pré e pós-condições)</p>

$$\begin{aligned}
\textbf{Pré-condição:} \quad &\text{sessao\_ativa}(a) \;\land\; \text{autor}(m) = a \\
&\land\; \neg\exists f \in F\; (\text{video}(f) = m) \\
&\land\; \text{satisfaz\_INV05}(m_{\text{novo}}) \\[1em]
\textbf{Pós-condição:} \quad &M' = (M \setminus \{m\}) \cup \{m_{\text{novo}}\} \quad \text{(ou } M' = M \setminus \{m\} \text{ na exclusão)}
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p><strong>Antes da operação:</strong> O atleta autenticado deve ser o autor do vídeo $m$, não pode existir nenhum feedback avaliativo registrado para $m$, e, em caso de substituição, o novo arquivo deve cumprir todas as restrições técnicas de formato, duração e tamanho estabelecidas em <code>INV-05</code>.<br><strong>Depois da operação:</strong> O arquivo original $m$ é removido do repositório $M$, e o novo vídeo (caso seja operação de troca) passa a integrar o conjunto $M'$.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Confirmar autoria do vídeo ($\text{autor}(m) = a$) e ausência de feedback vinculado antes de substituir ou excluir
- [ ] Validar <code>INV-05</code> no novo arquivo $m_{\text{novo}}$ quando houver substituição

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf3501">RF3501</a> · <a href="../requisitos/#rf3502">RF3502</a> · <a href="../requisitos/#rf3503">RF3503</a><br><a href="../requisitos_nao_funcionais/#rnf06">RNF06</a> · <a href="../requisitos_nao_funcionais/#rnf13">RNF13</a> · <a href="../requisitos_nao_funcionais/#rnf15">RNF15</a><br><a href="../regras_negocio/#rn09">RN09</a> · <a href="../regras_negocio/#rn10">RN10</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Garantia ao atleta</p>

<p>Permite corrigir envios acidentais ou vídeos errados antes que o treinador despenda tempo avaliando o material.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="op-03" markdown="1">

<summary><span class="sj-requirement-id">OP-03</span><span class="sj-requirement-name">Registro de feedback e transição de estado do treino</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">MVP</span><span class="sj-tag">Contrato</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Assinatura da operação</p>

$$\text{RegistrarFeedback}(t, m, \tau, \delta, f_{\text{novo}})$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Contrato formal (Pré e pós-condições)</p>

$$\begin{aligned}
\textbf{Pré-condição:} \quad &\text{sessao\_ativa}(t) \;\land\; \text{perfil}(t) = \text{Treinador} \\
&\land\; (t, \text{autor}(m)) \in V \;\land\; m \in M \\[1em]
\textbf{Pós-condição:} \quad &F' = F \cup \{f_{\text{novo}}\} \;\land\; \text{video}(f_{\text{novo}}) = m \\
&\land\; (\delta = \text{Devolvido} \Rightarrow \text{estado}'_T(\tau) = \text{Corrigir\_Refazer}) \\
&\land\; (\delta = \text{Aprovado} \Rightarrow \text{estado}'_T(\tau) = \text{Concluido})
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p><strong>Antes da operação:</strong> O solicitante $t$ deve estar autenticado com perfil Treinador e manter vínculo ativo na carteira com o atleta autor do vídeo $m$.<br><strong>Depois da operação:</strong> O feedback $f_{\text{novo}}$ é gravado e vinculado permanentemente ao vídeo $m$. Se o parecer técnico $\delta$ for <em>Devolvido</em>, o status do treino $\tau$ transita para <strong>Corrigir/Refazer</strong>; se for <em>Aprovado</em>, transita para <strong>Concluído</strong>.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Confirmar que $t$ é treinador vinculado ao autor de $m$ e que $m \in M$
- [ ] Vincular $f_{\text{novo}}$ a $m$ e atualizar $\text{estado}_T(\tau)$ para <code>Corrigir_Refazer</code> ($\delta = \text{Devolvido}$) ou <code>Concluido</code> ($\delta = \text{Aprovado}$)

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf2312">RF2312</a> · <a href="../requisitos/#rf3604">RF3604</a><br><a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf12">RNF12</a><br><a href="../regras_negocio/#rn06">RN06</a> · <a href="../regras_negocio/#rn07">RN07</a> · <a href="../regras_negocio/#rn10">RN10</a> · <a href="../regras_negocio/#rn11">RN11</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Impacto no ciclo esportivo</p>

<p>Fecha o ciclo de feedback em quadra, bloqueando alterações posteriores no vídeo (ativação de <code>INV-06</code>) e orientando os próximos passos do atleta.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="op-04" markdown="1">

<summary><span class="sj-requirement-id">OP-04</span><span class="sj-requirement-name">Inativação/exclusão de atleta com retenção histórica</span><span class="sj-requirement-tags"><span class="sj-tag">Posterior</span><span class="sj-tag">Contrato</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Assinatura da operação</p>

$$\text{InativarAtleta}(t, a)$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Contrato formal (Pré e pós-condições)</p>

$$\begin{aligned}
\textbf{Pré-condição:} \quad &\text{sessao\_ativa}(t) \;\land\; \text{perfil}(t) = \text{Treinador} \;\land\; (t, a) \in V \\[1em]
\textbf{Pós-condição:} \quad &\text{status}'(a) = \text{Inativo} \;\land\; \neg\text{sessao\_ativa}'(a) \\
&\land\; \text{Historico}'(a) = \text{Historico}(a)
\end{aligned}$$

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Tradução em linguagem natural (Como ler)</p>

<p><strong>Antes da operação:</strong> O treinador logado deve possuir vínculo ativo com o atleta $a$ na carteira $V$.<br><strong>Depois da operação:</strong> A conta do atleta transita para o status <strong>Inativo</strong>, sua sessão é encerrada de imediato, mas todo o seu histórico de treinos, vídeos e evoluções é preservado integralmente na base de dados.</p>

</div>

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Checklist de aplicação na construção</p>

- [ ] Exigir treinador autenticado com vínculo ativo $(t, a) \in V$ para inativar o atleta
- [ ] Marcar <code>status</code> como <code>Inativo</code>, encerrar sessões ativas do atleta e manter <code>Historico(a)</code> preservado

</div>

<div markdown="1">
<p class="sj-record-label">Rastreabilidade e requisitos</p>

<p><a href="../requisitos/#rf1106">RF1106</a> · <a href="../requisitos/#rf4813">RF4813</a><br><a href="../requisitos_nao_funcionais/#rnf05">RNF05</a> · <a href="../requisitos_nao_funcionais/#rnf08">RNF08</a> · <a href="../requisitos_nao_funcionais/#rnf17">RNF17</a><br><a href="../regras_negocio/#rn03">RN03</a> · <a href="../regras_negocio/#rn05">RN05</a> · <a href="../regras_negocio/#rn13">RN13</a></p>

</div>

<div markdown="1">
<p class="sj-record-label">Conformidade e segurança</p>

<p>Preservação histórica para fins comprobatórios e prevenção de perda involuntária de métricas de evolução.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

</section>

<section markdown="1" class="sj-catalog-group" aria-labelledby="rastreabilidade-historico">

## <span>REV</span> 4. Rastreabilidade, Escopo e Histórico de Versão {#rastreabilidade-historico}

<p class="sj-catalog-group-lead">Vinculação formal aos entregáveis da Engenharia de Requisitos e registro de controle de versões deste artefato.</p>

<details class="sj-requirement" id="escopo-testes" markdown="1">

<summary><span class="sj-requirement-id">NOTA</span><span class="sj-requirement-name">Nota de escopo: Módulo de testes físicos</span><span class="sj-requirement-tags"><span class="sj-tag">Backlog evolutivo</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Delimitação de escopo formal para o MVP</p>

<p>As operações de cadastro, edição e consulta de testes de aptidão física (<a href="../requisitos/#rf1216">RF1216</a>, <a href="../requisitos/#rf1217">RF1217</a>, <a href="../requisitos/#rf4803">RF4803</a> e <a href="../requisitos/#rf4811">RF4811</a>) foram adiadas integralmente para o backlog evolutivo pós-MVP. Por esse motivo, não possuem propriedades formalizadas no recorte atual do sistema.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="evidencia-metodologica" markdown="1">

<summary><span class="sj-requirement-id">RAD</span><span class="sj-requirement-name">Rastreabilidade e registro como evidência</span><span class="sj-requirement-tags"><span class="sj-tag sj-tag-mvp">Seção 5.1</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Contexto metodológico no ciclo RAD</p>

<p>Para incorporação direta na documentação do projeto (<a href="../engenharia_requisitos/">engenharia_requisitos.md</a> e <a href="../reunioes/">reunioes.md</a>), este artefato conclui os entregáveis registrados na Seção 5.1 (<em>Design do Usuário — Modelagem complementar de requisitos</em>) referentes à formalização das regras críticas de controle de acesso (RBAC), isolamento multi-inquilino, ciclo de vida de mídias e proteção de menores conforme a LGPD.</p>

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

<details class="sj-requirement" id="historico-versoes" markdown="1">

<summary><span class="sj-requirement-id">HIST</span><span class="sj-requirement-name">Histórico de versões da representação formal</span><span class="sj-requirement-tags"><span class="sj-tag">Versão 1.2</span></span></summary>

<div class="sj-requirement-body" markdown="1">

<div class="sj-record-full" markdown="1">
<p class="sj-record-label">Registro de alterações</p>

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| 15/11/2026 | 1.0 | Elaboração inicial da Representação Formal dos Requisitos Críticos (domínios, invariantes INV-01 a INV-06 e contratos OP-01 a OP-04 em tabelas estáticas) conforme Seção 5.1. | Equipe Space Jam |
| 20/11/2026 | 1.1 | Refatoração arquitetural para o padrão do Catálogo de Requisitos, convertendo tabelas em fichas interativas expansíveis (`<details class="sj-requirement">`), índice de navegação com âncoras diretas e legenda de símbolos. | Equipe Space Jam |
| 20/11/2026 | 1.2 | Sincronização integral de todos os links de rastreabilidade com a numeração vigente dos Requisitos Funcionais (RFs de 4 dígitos), Regras de Negócio (RN01 a RN25) e RNFs (RNF01 a RNF17), remoção do atalho `GUIA` no índice superior e inclusão de checklists por ficha. | Equipe Space Jam |

</div>

<div class="sj-record-full sj-record-return"><a href="#guia-da-formalizacao">Voltar ao índice da especificação ↑</a></div>

</div></details>

</section>