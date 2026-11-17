# Modelagem Complementar: Representação Formal dos Requisitos Críticos

**Projeto Space Jam**

Em conformidade com a Seção 5.1 da documentação de Engenharia de Requisitos do projeto Space Jam (fase de *Design do Usuário* — atividade de *Declaração e Representação / Modelagem Complementar de Requisitos* do ciclo RAD) e com o referencial metodológico de representações formais, este documento consolida a formalização matemática seletiva dos requisitos críticos do sistema.

A formalização é aplicada especificamente aos requisitos críticos de segurança, controle de acesso baseado em funções (RBAC), isolamento multi-inquilino (*multi-tenant*), ciclo de vida e imutabilidade de mídias, segregação de edição clínica e conformidade com a Lei Geral de Proteção de Dados (LGPD).

Para preservar a comunicabilidade com stakeholders técnicos e não técnicos, cada definição, invariante e contrato apresenta sua **tradução em linguagem natural**, logo após a respectiva representação formal.

---

## 1. Domínios, Conjuntos e Relações do Estado do Sistema

Seja \(\Sigma\) o estado válido da plataforma Space Jam em um instante qualquer, definido pelas estruturas fundamentais abaixo.

### 1.1 Usuários e perfis

**Rastreabilidade:** [CP1](requisitos.md#cp1), [CP7](requisitos.md#cp7), [RNF09](requisitos_nao_funcionais.md#rnf09).

- \(U\): conjunto finito de contas;
- \(P = \{\text{Admin}, \text{Treinador}, \text{Atleta}\}\);
- \(S_{\text{conta}} = \{\text{Pendente}, \text{Ativo}, \text{Inativo}\}\);
- \(\text{perfil}: U \to P\);
- \(\text{status}: U \to S_{\text{conta}}\).

Todo usuário registrado em \(U\) possui obrigatoriamente um único perfil de acesso (\(P\)) e uma única situação cadastral (\(S_{\text{conta}}\)) em determinado instante.

### 1.2 Carteira e vínculo privado

**Rastreabilidade:** [RF1101](requisitos.md#rf1101), [RNF10](requisitos_nao_funcionais.md#rnf10), [RN03](regras_negocio.md#rn03), [RN11](regras_negocio.md#rn11).

\[
V \subseteq
\{t \in U \mid \text{perfil}(t)=\text{Treinador}\}
\times
\{a \in U \mid \text{perfil}(a)=\text{Atleta}\}
\]

\(V\) representa o conjunto de pares \((t,a)\) em que um treinador \(t\) e um atleta \(a\) possuem vínculo ativo estabelecido exclusivamente via Código de Convite Privado válido.

### 1.3 Dados do atleta

**Rastreabilidade:** [RF1104](requisitos.md#rf1104), [RN01](regras_negocio.md#rn01), [RN02](regras_negocio.md#rn02).

\[
\begin{aligned}
D_{\text{pessoal}}(a) = (&\text{nome}, \text{sobrenome}, \text{apelido}, \text{contato},\\
&\text{altura}, \text{peso}, \text{envergadura}, \text{foto})
\end{aligned}
\]

\[
\begin{aligned}
D_{\text{clinico}}(a) = (&\text{historico\_lesoes}, \text{aptidao\_fisica},\\
&\text{objetivos\_taticos}, \text{resultados\_treinos})
\end{aligned}
\]

Os dados de cada atleta \(a\) são particionados em dois grupos: dados cadastrais/biométricos primários (\(D_{\text{pessoal}}\)) e dados técnicos/clínicos sensíveis (\(D_{\text{clinico}}\)).

### 1.4 Biblioteca e treinos

**Rastreabilidade:** [CP2](requisitos.md#cp2)–[CP4](requisitos.md#cp4), [RF2307](requisitos.md#rf2307), [RN06](regras_negocio.md#rn06), [RN07](regras_negocio.md#rn07), [RNF04](requisitos_nao_funcionais.md#rnf04).

- \(E\): conjunto de exercícios;
- \(T\): conjunto de treinos prescritos;
- \(\text{estado}_T: T \to \{\text{A\_fazer}, \text{Concluido}, \text{Corrigir\_Refazer}\}\).

Cada item de treino prescrito em \(T\) (montado a partir da biblioteca \(E\)) encontra-se sempre em um dos três estados: *A fazer*, *Concluído* ou *Corrigir/Refazer*.

### 1.5 Vídeos e feedbacks

**Rastreabilidade:** [RF3501](requisitos.md#rf3501), [RF3604](requisitos.md#rf3604).

- \(M\): conjunto de vídeos enviados;
- \(F\): conjunto de feedbacks;
- \(\text{video}: F \to M\).

Todo feedback avaliativo registrado por um treinador em \(F\) está obrigatoriamente vinculado a um vídeo de execução específico enviado em \(M\).

---

## 2. Invariantes Globais do Sistema (INV)

As propriedades abaixo devem permanecer verdadeiras antes e após qualquer transição de estado válida em \(\Sigma\).

### INV-01 — Autenticação, Aprovação Administrativa e RBAC

**Rastreabilidade:** [RF1101](requisitos.md#rf1101), [RF1102](requisitos.md#rf1102), [RF1107](requisitos.md#rf1107), [RNF09](requisitos_nao_funcionais.md#rnf09), [RN10](regras_negocio.md#rn10).

**Especificação formal:**

\[
\begin{aligned}
\forall u \in U:\quad
\text{sessao\_ativa}(u) \Rightarrow \Big(&
\text{status}(u)=\text{Ativo}\\
&\land \neg\text{senha\_temporaria}(u)\\
&\land (\text{perfil}(u)=\text{Treinador}\\
&\qquad\Rightarrow \text{aprovado\_admin}(u))
\Big)
\end{aligned}
\]

**Tradução em linguagem natural:** Para qualquer usuário \(u\), se ele possui uma sessão autenticada ativa, então sua conta está obrigatoriamente **Ativa**, sua **senha temporária já foi trocada** e, caso seja **Treinador**, seu cadastro já recebeu **aprovação do Administrador**.

### INV-02 — Vínculo Obrigatório do Atleta por Convite Privado

**Rastreabilidade:** [RF1101](requisitos.md#rf1101), [RN11](regras_negocio.md#rn11).

**Especificação formal:**

\[
\begin{aligned}
\forall a \in U:\quad
\text{perfil}(a)=\text{Atleta} \Rightarrow
\exists t \in U:\quad \Big(&
\text{perfil}(t)=\text{Treinador}\\
&\land (t,a)\in V\\
&\land \text{codigo\_convite\_valido}(t,a)
\Big)
\end{aligned}
\]

**Tradução em linguagem natural:** Todo usuário com perfil **Atleta** cadastrado no sistema está obrigatoriamente vinculado a pelo menos um **Treinador** válido por meio de um **código de convite privado** emitido por esse treinador.

### INV-03 — Isolamento Multi-inquilino de Dados

**Rastreabilidade:** [RNF10](requisitos_nao_funcionais.md#rnf10), [RNF12](requisitos_nao_funcionais.md#rnf12), [RN03](regras_negocio.md#rn03).

**Especificação formal:**

\[
\begin{aligned}
&\forall u \in U,\ \forall a \in U\ 
(\text{perfil}(a)=\text{Atleta}),\\
&\forall r \in \text{Recursos}(a):\\
&\quad \text{pode\_ler}(u,r) \iff
\Big(u=a \lor
(\text{perfil}(u)=\text{Treinador}\land (u,a)\in V)\Big)
\end{aligned}
\]

**Tradução em linguagem natural:** Um usuário \(u\) só pode ler os recursos privados de um atleta \(a\) (ficha clínica, treinos, vídeos e feedbacks) **se e somente se** \(u\) for o próprio atleta ou um treinador ativamente vinculado a ele na carteira \(V\).

### INV-04 — Conformidade LGPD e Proteção de Menores de Idade

**Rastreabilidade:** [RNF05](requisitos_nao_funcionais.md#rnf05), [RNF17](requisitos_nao_funcionais.md#rnf17), [RF4813](requisitos.md#rf4813), [RN15](regras_negocio.md).

**Especificação formal:**

\[
\begin{aligned}
\forall a \in U:\quad
(&\text{perfil}(a)=\text{Atleta}\land \text{idade}(a)<18)\\
&\Rightarrow \Big(
\text{aceite\_termos}(a)\\
&\qquad\land \text{consentimento\_responsavel}(a)
\Big)
\end{aligned}
\]

**Tradução em linguagem natural:** Nenhum atleta **menor de 18 anos** (como os atletas de 15 anos do escopo) pode ter dados pessoais ou vídeos processados sem que haja o **aceite formal dos termos** e o **consentimento registrado do responsável legal**.

### INV-05 — Restrições Técnicas de Mídia no Upload

**Rastreabilidade:** [RNF06](requisitos_nao_funcionais.md#rnf06), [RNF14](requisitos_nao_funcionais.md#rnf14), [RN09](regras_negocio.md#rn09).

**Especificação formal:**

\[
\begin{aligned}
\forall m \in M:\quad
&\text{formato}(m)\in\{\texttt{.mp4},\texttt{.mov}\}\\
&\land 0<\text{duracao}(m)\leq 60\\
&\land 0<\text{tamanho}(m)\leq 100
\end{aligned}
\]

**Tradução em linguagem natural:** Todo vídeo armazenado no sistema deve ter extensão `.mp4` ou `.mov`, duração maior que \(0\) e **no máximo 60 segundos**, e tamanho maior que \(0\) e **no máximo 100 MB**.

### INV-06 — Imutabilidade do Vídeo Após Feedback Avaliativo

**Rastreabilidade:** [RF3502](requisitos.md#rf3502), [RF3604](requisitos.md#rf3604), [RNF16](requisitos_nao_funcionais.md#rnf16), [RN10](regras_negocio.md#rn10).

**Especificação formal:**

\[
\begin{aligned}
\forall m \in M:\quad
(\exists f \in F:\ \text{video}(f)=m)
\Rightarrow \Big(&
\neg\text{pode\_substituir}(m)\\
&\land \neg\text{pode\_excluir}(m)
\Big)
\end{aligned}
\]

**Tradução em linguagem natural:** Assim que existir pelo menos um feedback \(f\) associado a um vídeo \(m\), esse arquivo torna-se **imutável**, ficando bloqueadas tanto a sua **substituição** quanto a sua **exclusão**.

---

## 3. Contratos Formais de Operações Críticas (Pré e Pós-Condições)

### OP-01 — Edição Segregada de Perfil do Atleta

**Operação:** \(\text{EditarPerfil}(u,a,\Delta D_{\text{pessoal}},\Delta D_{\text{clinico}})\).

**Rastreabilidade:** [RF1104](requisitos.md#rf1104), [RN01](regras_negocio.md#rn01), [RN02](regras_negocio.md#rn02).

**Pré-condição:**

\[
\begin{aligned}
\text{sessao\_ativa}(u)\land \Big(&
(u=a\land \Delta D_{\text{clinico}}=\emptyset)\\
&\lor (\text{perfil}(u)=\text{Treinador}\land (u,a)\in V\\
&\qquad\land \Delta D_{\text{pessoal}}=\emptyset)
\Big)
\end{aligned}
\]

**Pós-condição:**

\[
\begin{aligned}
&\Big(u=a \Rightarrow
D'_{\text{pessoal}}(a)=D_{\text{pessoal}}(a)\oplus\Delta D_{\text{pessoal}}\\
&\qquad\land D'_{\text{clinico}}(a)=D_{\text{clinico}}(a)\Big)\\
&\land\\
&\Big((u,a)\in V \Rightarrow
D'_{\text{clinico}}(a)=D_{\text{clinico}}(a)\oplus\Delta D_{\text{clinico}}\\
&\qquad\land D'_{\text{pessoal}}(a)=D_{\text{pessoal}}(a)\Big)
\end{aligned}
\]

**Tradução em linguagem natural:**

- **Antes:** O solicitante \(u\) deve estar logado; se for o próprio atleta (\(u=a\)), não pode alterar dados clínicos; se for o treinador vinculado, não pode alterar dados pessoais.
- **Depois:** Apenas o bloco autorizado ao perfil é atualizado, mantendo o outro bloco intacto.

### OP-02 — Substituição ou Exclusão de Vídeo Antes da Avaliação

**Rastreabilidade:** [RF3501](requisitos.md#rf3501), [RF3502](requisitos.md#rf3502), [RNF16](requisitos_nao_funcionais.md#rnf16).

**Pré-condição:**

\[
\begin{aligned}
&\text{sessao\_ativa}(a)\land \text{autor}(m)=a\\
&\land \neg\exists f\in F\ (\text{video}(f)=m)\\
&\land \text{satisfaz\_INV05}(m_{\text{novo}})
\end{aligned}
\]

**Pós-condição — substituição:**

\[
M'=(M\setminus\{m\})\cup\{m_{\text{novo}}\}
\]

**Pós-condição — exclusão:**

\[
M'=M\setminus\{m\}
\]

**Tradução em linguagem natural:**

- **Antes:** O atleta logado deve ser o autor do vídeo \(m\), não pode existir nenhum feedback vinculado a \(m\) e, em caso de troca, o novo vídeo deve cumprir os limites de formato, duração e tamanho definidos em `INV-05`.
- **Depois:** O vídeo antigo é removido e, na substituição, o novo passa a integrar o acervo \(M'\).

### OP-03 — Registro de Feedback e Transição de Estado do Treino

**Rastreabilidade:** [RF3604](requisitos.md#rf3604), [RN06](regras_negocio.md#rn06), [RN07](regras_negocio.md#rn07).

**Pré-condição:**

\[
\begin{aligned}
&\text{sessao\_ativa}(t)\land \text{perfil}(t)=\text{Treinador}\\
&\land (t,\text{autor}(m))\in V\land m\in M
\end{aligned}
\]

**Pós-condição:**

\[
\begin{aligned}
&F'=F\cup\{f_{\text{novo}}\}
\land \text{video}(f_{\text{novo}})=m\\
&\land (\delta=\text{Devolvido}\Rightarrow
\text{estado}'_T(\tau)=\text{Corrigir\_Refazer})\\
&\land (\delta=\text{Aprovado}\Rightarrow
\text{estado}'_T(\tau)=\text{Concluido})
\end{aligned}
\]

**Tradução em linguagem natural:**

- **Antes:** O treinador logado deve estar vinculado ao atleta autor do vídeo existente \(m\).
- **Depois:** O feedback é salvo vinculado ao vídeo; se a decisão \(\delta\) for *Devolvido*, o treino \(\tau\) muda para **Corrigir/Refazer**; se for *Aprovado*, passa para **Concluído**.

### OP-04 — Inativação/Exclusão de Atleta com Retenção Histórica

**Rastreabilidade:** [RF1105](requisitos.md#rf1105), [RN01](regras_negocio.md#rn01), [RN04](regras_negocio.md#rn04), [RN13](regras_negocio.md).

**Pré-condição:**

\[
\text{sessao\_ativa}(t)\land
\text{perfil}(t)=\text{Treinador}\land (t,a)\in V
\]

**Pós-condição:**

\[
\begin{aligned}
&\text{status}'(a)=\text{Inativo}
\land \neg\text{sessao\_ativa}'(a)\\
&\land \text{Historico}'(a)=\text{Historico}(a)
\end{aligned}
\]

**Tradução em linguagem natural:**

- **Antes:** O treinador logado deve possuir vínculo ativo com o atleta \(a\).
- **Depois:** A conta do atleta torna-se **Inativa**, sua sessão é encerrada, mas todo o seu histórico de treinos e evoluções é preservado integralmente.

---

!!! note "Nota de Escopo (Módulo de Testes Físicos)"

    As operações de cadastro, edição e consulta de testes de aptidão física ([RF1216](requisitos.md#rf1216), [RF1217](requisitos.md#rf1217), [RF4803](requisitos.md#cp8) e [RF4811](requisitos.md#cp8)) foram adiadas integralmente para o backlog evolutivo pós-MVP e, portanto, não possuem propriedades formalizadas no recorte atual.

---

## 4. Rastreabilidade e Registro como Evidência

Para incorporação direta na documentação do projeto (`engenharia_requisitos.md` e `reunioes.md`), este artefato conclui os entregáveis pendentes registrados na Seção 5.1 (*Design do Usuário — Modelagem complementar de requisitos*), referentes à formalização das regras críticas de controle de acesso, isolamento multi-inquilino e ciclo de vida de mídias.

| Data | Versão | Descrição | Autor |
|:---|:---:|:---|:---|
| 15/11/2026 | 1.0 | Elaboração da Representação Formal dos Requisitos Críticos (domínios, invariantes `INV-01` a `INV-06` e contratos `OP-01` a `OP-04` com tradução em linguagem natural) conforme Seção 5.1. | Equipe Space Jam |
