# Modelagem Complementar: Representação Formal dos Requisitos Críticos e Matriz Consolidada de Permissões e Acessos por Perfil

**Projeto Space Jam**

Em conformidade com a Seção 5.1 da documentação de Engenharia de Requisitos do projeto Space Jam (fase de Design do Usuário — atividade de Declaração e Representação / Modelagem Complementar de Requisitos do ciclo RAD) e com o referencial metodológico de representações formais, este documento consolida a formalização matemática dos requisitos críticos e a matriz tabular de permissões e acessos por perfil. A formalização é aplicada seletivamente aos requisitos críticos de segurança, controle de acesso baseado em funções (RBAC), isolamento multi-inquilino (*multi-tenant*), ciclo de vida e imutabilidade de mídias, segregação de edição clínica e conformidade com a Lei Geral de Proteção de Dados (LGPD).

---

## 1. Representação Formal dos Requisitos Críticos {#1-representacao-formal-dos-requisitos-criticos}

A especificação abaixo adota teoria dos conjuntos, lógica de predicados de primeira ordem, invariantes de estado e contratos de pré e pós-condição para eliminar ambiguidades semânticas nas regras de domínio mais críticas do sistema.

### 1.1 Domínios, Conjuntos e Relações do Estado do Sistema {#11-dominios-conjuntos-e-relacoes}

Seja $\Sigma$ o estado válido da plataforma Space Jam em um instante qualquer, definido pelas seguintes estruturas fundamentais:

* **Usuários e Perfis ([CP1](requisitos.md#cp1), [CP7](requisitos.md#cp7), [RNF09](requisitos_nao_funcionais.md#rnf09)):**
  * $U$: conjunto finito de contas de usuário registradas no sistema.
  * $P = \{\text{Admin}, \text{Treinador}, \text{Atleta}\}$: conjunto de perfis de acesso do modelo RBAC.
  * $S_{\text{conta}} = \{\text{Pendente}, \text{Ativo}, \text{Inativo}\}$: conjunto de estados possíveis de uma conta.
  * $\text{perfil}: U \rightarrow P$ e $\text{status}: U \rightarrow S_{\text{conta}}$: funções totais que associam cada usuário ao seu perfil e situação cadastral.

* **Carteira e Vínculo Privado ([RF01101](requisitos.md#rf01101), [RNF10](requisitos_nao_funcionais.md#rnf10), [RN03](regras_negocio.md#rn03), [RN11](regras_negocio.md#rn11)):**
  * $V \subseteq \{t \in U \mid \text{perfil}(t) = \text{Treinador}\} \times \{a \in U \mid \text{perfil}(a) = \text{Atleta}\}$: relação de vínculo ativo estabelecida exclusivamente mediante Código de Convite Privado válido.

* **Dados do Atleta ([RF01104](requisitos.md#rf01104), [RN01](regras_negocio.md#rn01), [RN02](regras_negocio.md#rn02)):**
  * $D_{\text{pessoal}}(a)$: tupla de dados cadastrais e biométricos primários de $a$ ($\text{nome}, \text{sobrenome}, \text{apelido}, \text{contato}, \text{altura}, \text{peso}, \text{envergadura}, \text{foto}$).
  * $D_{\text{clinico}}(a)$: tupla de dados sensíveis e técnicos de $a$ ($\text{historico\_lesoes}, \text{aptidao\_fisica}, \text{objetivos\_taticos}, \text{resultados\_treinos}$).

* **Biblioteca, Treinos, Vídeos e Feedbacks ([CP2](requisitos.md#cp2)–[CP6](requisitos.md#cp6)):**
  * $E$: conjunto de exercícios catalogados na biblioteca ([CP4](requisitos.md#cp4)).
  * $T$: conjunto de itens de treino prescritos ([RF02301](requisitos.md#rf02301)), com função de estado $\text{estado\_T}: T \rightarrow \{\text{A\_fazer}, \text{Concluido}, \text{Corrigir\_Refazer}\}$ ([RN06](regras_negocio.md#rn06), [RN07](regras_negocio.md#rn07), [RNF04](requisitos_nao_funcionais.md#rnf04)).
  * $M$: conjunto de vídeos de execução submetidos pelos atletas ([RF03501](requisitos.md#rf03501)).
  * $F$: conjunto de feedbacks avaliativos registrados pelos treinadores ([RF03601](requisitos.md#rf03601)), relacionados aos vídeos pela função $\text{video}: F \rightarrow M$.

---

## 1.2 Invariantes Globais do Sistema (INV)

As propriedades abaixo devem permanecer verdadeiras antes e após qualquer transição de estado válida em $\Sigma$:

- **INV-01 · Autenticação, Aprovação Administrativa e RBAC** ([RF01101](requisitos.md#rf01101), [RF01102](requisitos.md#rf01102), [RF01107](requisitos.md#rf01107), [RNF09](requisitos_nao_funcionais.md#rnf09), [RN10](regras_negocio.md#rn10)):  
  Um usuário só pode operar rotas autenticadas se sua conta estiver ativa, com senha definitiva redefinida após o primeiro acesso e, no caso de treinador, após autorização administrativa:

$$
\begin{aligned}
\forall u \in U:\; \text{sessao\_ativa}(u) \Rightarrow \Big(& \text{status}(u) = \text{Ativo} \;\land\; \neg\text{senha\_temporaria}(u) \\
&\land\; (\text{perfil}(u) = \text{Treinador} \Rightarrow \text{aprovado\_admin}(u)) \Big)
\end{aligned}
$$

- **INV-02 · Vínculo Obrigatório do Atleta por Convite Privado** ([RF01101](requisitos.md#rf01101), [RN11](regras_negocio.md#rn11)):  
  Todo atleta cadastrado no sistema está obrigatoriamente vinculado a pelo menos um treinador válido que emitiu o código de convite:

$$
\begin{aligned}
\forall a \in U:\; \text{perfil}(a) = \text{Atleta} \Rightarrow \exists t \in U:\; \Big(& \text{perfil}(t) = \text{Treinador} \;\land\; (t, a) \in V \\
&\land\; \text{codigo\_convite\_valido}(t, a) \Big)
\end{aligned}
$$

- **INV-03 · Isolamento Multi-inquilino de Dados** ([RNF10](requisitos_nao_funcionais.md#rnf10), [RNF12](requisitos_nao_funcionais.md#rnf12), [RN03](regras_negocio.md#rn03)):  
  Para qualquer recurso privado $r \in \text{Recursos}(a)$ pertencente a um atleta $a$ (perfil clínico, histórico de treinos, vídeos $M_a$ e feedbacks $F_a$), o acesso de leitura é restrito estritamente ao próprio atleta e aos treinadores vinculados à sua carteira:

$$
\begin{aligned}
\forall u \in U,\; \forall a \in U\; (\text{perfil}(a) = \text{Atleta}),\; \forall r \in \text{Recursos}(a):& \\
\text{pode\_ler}(u, r) \iff \Big( u = a \;\lor\; (\text{perfil}(u) = \text{Treinador} \;\land\; (u, a) \in V) \Big)&
\end{aligned}
$$

- **INV-04 · Conformidade LGPD e Proteção de Menores de Idade** ([RNF05](requisitos_nao_funcionais.md#rnf05), [RNF17](requisitos_nao_funcionais.md#rnf17), [RF4813](requisitos.md#rf4813), [RN15](regras_negocio.md)):  
  Nenhum atleta menor de 18 anos pode ter dados pessoais ou vídeos processados sem o aceite formal dos termos e o registro de consentimento do responsável legal:

$$
\begin{aligned}
\forall a \in U:\; (\text{perfil}(a) = \text{Atleta} \;\land\; \text{idade}(a) < 18) \Rightarrow \Big(& \text{aceite\_termos}(a) \\
&\land\; \text{consentimento\_responsavel}(a) \Big)
\end{aligned}
$$

- **INV-05 · Restrições Técnicas de Mídia no Upload** ([RNF06](requisitos_nao_funcionais.md#rnf06), [RNF14](requisitos_nao_funcionais.md#rnf14), [RN09](regras_negocio.md#rn09)):  
  Todo vídeo persistido no repositório deve obedecer aos limites de formato, duração (máximo de $60\text{ s}$) e tamanho (máximo de $100\text{ MB}$):

$$
\forall m \in M:\; \text{formato}(m) \in \{\texttt{.mp4}, \texttt{.mov}\} \;\land\; 0 < \text{duracao}(m) \le 60 \;\land\; 0 < \text{tamanho}(m) \le 100
$$

- **INV-06 · Imutabilidade do Vídeo Após Feedback Avaliativo** ([RF3502](requisitos.md#rf3502), [RF3604](requisitos.md#rf3604), [RNF16](requisitos_nao_funcionais.md#rnf16), [RN10](regras_negocio.md#rn10)):  
  A partir do momento em que existe um feedback avaliativo associado a um vídeo de execução, o arquivo torna-se imutável, bloqueando substituição ou exclusão:

$$
\forall m \in M:\; (\exists f \in F:\; \text{video}(f) = m) \Rightarrow \Big(\neg\text{pode\_substituir}(m) \;\land\; \neg\text{pode\_excluir}(m)\Big)
$$

---

## 1.3 Contratos Formais de Operações Críticas (Pré e Pós-Condições)

- **OP-01 · Edição Segregada de Perfil do Atleta** ([RF01104](requisitos.md#rf01104), [RN01](regras_negocio.md#rn01), [RN02](regras_negocio.md#rn02)):  
  Dado um usuário solicitante $u \in U$ e um atleta alvo $a \in U$, a operação $\text{EditarPerfil}(u, a, \Delta D_{\text{pessoal}}, \Delta D_{\text{clinico}})$ obedece ao contrato:
  - **Pré-condição:**

$$
\begin{aligned}
\text{sessao\_ativa}(u) \;\land\; \Big(& (u = a \;\land\; \Delta D_{\text{clinico}} = \emptyset) \\
&\lor\; (\text{perfil}(u) = \text{Treinador} \;\land\; (u, a) \in V \;\land\; \Delta D_{\text{pessoal}} = \emptyset) \Big)
\end{aligned}
$$

  - **Pós-condição:**

$$
\begin{aligned}
&\Big( u = a \Rightarrow D'_{\text{pessoal}}(a) = D_{\text{pessoal}}(a) \oplus \Delta D_{\text{pessoal}} \;\land\; D'_{\text{clinico}}(a) = D_{\text{clinico}}(a) \Big) \\
\land\; &\Big( (u, a) \in V \Rightarrow D'_{\text{clinico}}(a) = D_{\text{clinico}}(a) \oplus \Delta D_{\text{clinico}} \;\land\; D'_{\text{pessoal}}(a) = D_{\text{pessoal}}(a) \Big)
\end{aligned}
$$

- **OP-02 · Substituição ou Exclusão de Vídeo Antes da Avaliação** ([RF3501](requisitos.md#rf3501), [RF3502](requisitos.md#rf3502), [RNF16](requisitos_nao_funcionais.md#rnf16)):  
  Dado um atleta $a \in U$, um vídeo existente $m \in M$ e (no caso de substituição) um novo arquivo $m_{\text{novo}}$:
  - **Pré-condição:**

$$
\text{sessao\_ativa}(a) \;\land\; \text{autor}(m) = a \;\land\; \neg\exists f \in F\; (\text{video}(f) = m) \;\land\; \text{satisfaz\_INV05}(m_{\text{novo}})
$$

  - **Pós-condição:**

$$
M' = (M \setminus \{m\}) \cup \{m_{\text{novo}}\} \quad \text{(ou } M' = M \setminus \{m\} \text{ na exclusão)}
$$

- **OP-03 · Registro de Feedback e Transição de Estado do Treino** ([RF3604](requisitos.md#rf3604), [RN06](regras_negocio.md#rn06), [RN07](regras_negocio.md#rn07)):  
  Dado um treinador $t \in U$, um vídeo $m \in M$ vinculado ao item de treino $\tau \in T$ e uma decisão avaliativa $\delta \in \{\text{Aprovado}, \text{Devolvido}\}$:
  - **Pré-condição:**

$$
\text{sessao\_ativa}(t) \;\land\; \text{perfil}(t) = \text{Treinador} \;\land\; (t, \text{autor}(m)) \in V \;\land\; m \in M
$$

  - **Pós-condição:**

$$
\begin{aligned}
F' = F \cup \{f_{\text{novo}}\} \;\land\; \text{video}(f_{\text{novo}}) = m &\;\land\; (\delta = \text{Devolvido} \Rightarrow \text{estado}'_T(\tau) = \text{Corrigir\_Refazer}) \\
&\;\land\; (\delta = \text{Aprovado} \Rightarrow \text{estado}'_T(\tau) = \text{Concluido})
\end{aligned}
$$

- **OP-04 · Inativação/Exclusão de Atleta com Retenção Histórica** ([RF01105](requisitos.md#rf01105), [RN01](regras_negocio.md#rn01), [RN04](regras_negocio.md#rn04), [RN13](regras_negocio.md)):  
  Dado um treinador $t \in U$ e um atleta $a \in U$:
  - **Pré-condição:**

$$
\text{sessao\_ativa}(t) \;\land\; \text{perfil}(t) = \text{Treinador} \;\land\; (t, a) \in V
$$

  - **Pós-condição:**

$$
\text{status}'(a) = \text{Inativo} \;\land\; \neg\text{sessao\_ativa}'(a) \;\land\; \text{Historico}'(a) = \text{Historico}(a)
$$


---

## 2. Matriz Consolidada de Permissões e Acessos por Perfil {#2-matriz-consolidada-de-permissoes-e-acessos-por-perfil}

A matriz abaixo consolida o modelo de autorização baseado em funções (RBAC — [RNF09](requisitos_nao_funcionais.md#rnf09)/[RNF11](requisitos_nao_funcionais.md#rnf11)) e isolamento multi-inquilino (*Data Isolation* — [RNF10](requisitos_nao_funcionais.md#rnf10)/[RNF12](requisitos_nao_funcionais.md#rnf12)) para todos os perfis e recursos da plataforma.

**Legenda de permissões:**

* **P (Permitido):** Acesso irrestrito ao recurso ou operação dentro do escopo do perfil.
* **V (Permitido sob Vínculo):** Acesso permitido exclusivamente quando existe vínculo ativo $(t, a) \in V$ entre o treinador e o atleta.
* **C (Permitido sob Condição):** Acesso sujeito à verificação de pré-condição de estado ou regra de negócio (ex.: código de convite válido, conta aprovada, vídeo sem feedback avaliativo, consentimento legal para menor de 18 anos).
* **N (Negado):** Operação bloqueada pelo sistema (retorno HTTP `403 Forbidden` ou `404 Not Found` na API).

| Módulo / Característica | Recurso / Operação | Atleta (Próprio) | Atleta (Terceiros) | Treinador (Vinculado) | Treinador (Não Vinculado) | Administrador | Rastreabilidade (RF / RNF / RN) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Autenticação e Contas (CP1)** | Solicitar cadastro como Atleta (via Código de Convite Privado) | C (com código válido) | N | P (gera convite) | N | N | RF01101, RN11, RNF15 |
| **Autenticação e Contas (CP1)** | Solicitar cadastro como Treinador (cria conta pendente) | N | N | C (pendente) | C (pendente) | P (aprova) | RF01101, RN10, RNF15 |
| **Autenticação e Contas (CP1)** | Autenticar (Login) e encerrar sessão (Logout) | P | N | C (se aprovado) | C (se aprovado) | P | RF01102, RF01103, RNF09, RN10 |
| **Autenticação e Contas (CP1)** | Trocar senha temporária obrigatória no 1º acesso | P | N | P | P | P | RF01106, RF01107, RNF15 |
| **Autenticação e Contas (CP1)** | Excluir / inativar conta de atleta (preservando histórico) | N | N | V | N | N | RF01105, RN01, RN04, RN13 |
| **Perfil do Atleta (CP1)** | Visualizar dados cadastrais, biométricos e clínicos do atleta | P | N | V | N | N | RF01104, RNF10, RNF12, RN03 |
| **Perfil do Atleta (CP1)** | Editar dados pessoais e biométricos básicos (nome, apelido, contato, altura, peso, envergadura, foto) | P | N | N | N | N | RF01104, RN02, RNF15 |
| **Perfil do Atleta (CP1)** | Editar dados clínicos e técnicos (histórico de lesões, aptidão física, objetivos táticos, resultados) | N (somente leitura) | N | V | N | N | RF01104, RN01, RN02, RNF15 |
| **Biblioteca de Exercícios (CP4)** | Cadastrar, editar e gerenciar exercícios (vídeo-base, thumbnail, descrição breve, erros comuns) | N | N | P | P | N | RF02407, RF02410, RF02412, RNF09 |
| **Biblioteca de Exercícios (CP4)** | Consultar e filtrar exercícios (objetivos, fundamentos, materiais) | P | N | P | P | N | CP4, RNF12, RNF15 |
| **Planejamento e Treinos (CP2, CP3)** | Criar, estruturar e editar planejamentos e treinos individualizados | N | N | V | N | N | RF02301, RF02302, RNF09, RNF10, RN03 |
| **Planejamento e Treinos (CP2, CP3)** | Consultar treinos prescritos e histórico de evolução | P | N | V | N | N | RNF10, RNF11, RNF12, RN03 |
| **Planejamento e Treinos (CP2, CP3)** | Marcar status de execução (A fazer → Concluído), registrar dificuldade (1–5) e relato textual | P | N | N | N | N | RF01209, RF01211, RN06, RN07, RNF04 |
| **Vídeos de Execução (CP5)** | Enviar vídeo de execução (`.mp4`/`.mov`, $\le 60\text{s}$, $\le 100\text{MB}$) | P | N | N | N | N | RF03501, RNF06, RNF14, RN09 |
| **Vídeos de Execução (CP5)** | Visualizar vídeo de execução enviado | P | N | V | N | N | RNF10, RNF12, RNF13, RN03 |
| **Vídeos de Execução (CP5)** | Substituir ou excluir vídeo enviado antes do registro de feedback | C (sem feedback) | N | N | N | N | RF03502, RF03503, RNF16 |
| **Vídeos de Execução (CP5)** | Substituir ou excluir vídeo enviado após o registro de feedback | N (imutável) | N | N (imutável) | N | N | RF03502, RF03601, RN10 |
| **Feedback Avaliativo (CP6)** | Registrar feedback privado vinculado ao vídeo e definir devolução (Corrigir/Refazer) | N | N | V | N | N | RF03601, RNF09, RN06, RN07 |
| **Feedback Avaliativo (CP6)** | Visualizar feedback avaliativo privado | P | N | V | N | N | RNF10, RNF12, RN03 |
| **Privacidade e LGPD (CP8)** | Aceitar termos de uso, política de privacidade e consentimento de cookies | P | N | P | P | N | RNF05, RNF17, RN15 |
| **Privacidade e LGPD (CP8)** | Registrar/validar consentimento legal para tratamento de dados e imagem de atleta menor ($< 18$ anos) | C (via responsável) | N | V (verifica) | N | N | RNF05, RN15, RN16 |

> **Nota de Escopo (Módulo de Testes Físicos):** As operações de cadastro, edição e consulta de testes de aptidão física ([RF01212](requisitos.md#rf01212), [RF01213](requisitos.md#rf01213), [RF04803](requisitos.md#rf04803) e [RF04811](requisitos.md#rf04811)) foram adiadas integralmente para o backlog evolutivo pós-MVP e, portanto, não possuem rotas ativas no recorte atual.

---

## 3. Rastreabilidade e Registro como Evidência {#3-rastreabilidade-e-registro-como-evidencia}

Para incorporação direta na documentação do projeto ([Engenharia de Requisitos](engenharia_requisitos.md) e [Reuniões](reunioes.md)), este artefato conclui os entregáveis pendentes registrados na Seção 5.1 (*Design do Usuário — Modelagem complementar de requisitos*) referentes à matriz tabular consolidada de permissões por perfil e à formalização das regras de controle de acesso, isolamento multi-inquilino e ciclo de vida de mídias.

| Data | Versão | Descrição | Autor |
| :--- | :---: | :--- | :--- |
| 15/11/2026 | 1.0 | Elaboração da Representação Formal dos Requisitos Críticos (invariantes e contratos de pré/pós-condição) e da Matriz Consolidada de Permissões e Acessos por Perfil (RBAC e isolamento *multi-tenant*) conforme Seção 5.1. | Equipe Space Jam |