<span id="minimo-produto-viavel-mvp-projeto-space-jam"></span>

# Mínimo Produto Viável — Space Jam

O MVP concentra o fluxo essencial entre treinador e atleta: autenticação e vínculo privado, biblioteca de exercícios, prescrição e acompanhamento de treinos, registro de execução/dificuldade e envio de vídeo com feedback assíncrono. O recorte consolidado reúne **46 Requisitos Funcionais** — distribuídos nas 5 iterações do [Plano de Execução](backlog.md#103-plano-execucao) — e os requisitos não funcionais aplicáveis mantidos em [requisitos_nao_funcionais.md](requisitos_nao_funcionais.md).

[Explorar requisitos do MVP](requisitos.md#indice-mvp) · [Catálogo funcional](requisitos.md) · [Backlog e iterações](backlog.md) · [Catálogo de RNFs](requisitos_nao_funcionais.md) · [DoR e DoD](dor_dod.md)

---

## 1. Objetivo do Incremento {#1-visao-geral-do-mvp}

Comprovar, em ambiente funcional e com isolamento de dados por vínculo treinador–atleta, que:

1. O **treinador** consegue cadastrar exercícios com orientações e erros comuns, estruturar planejamentos e treinos individualizados e avaliar vídeos enviados por seus atletas por meio de feedback privado.
2. O **atleta** consegue consultar suas prescrições e orientações técnicas, registrar status e nível de dificuldade dos treinos, enviar vídeos de execução e acompanhar os feedbacks recebidos.

---

## 2. Linha de Corte e Critérios Consolidados {#2-linha-de-corte-do-mvp}

A seleção do MVP cruza **Valor de Negócio (VB / MoSCoW)** e **Complexidade Técnica (CT)** sobre os **62 Requisitos Funcionais** do catálogo.

### 2.1 Escala Determinística de Valor de Negócio e MoSCoW

Para eliminar ambiguidades entre faixas, cada requisito recebeu uma nota inteira de **Valor de Negócio (1 a 5)** mapeada de forma determinística na classificação **MoSCoW**:

| Nota VB | Classificação MoSCoW | Critério de Enquadramento |
| :---: | :---: | :--- |
| **5** | **Must Have** | Indispensável para o fluxo central de ponta a ponta (acesso, vínculo, prescrição, execução, vídeo/feedback e conformidade LGPD). |
| **4** | **Should Have** | Alta relevância para acompanhamento e histórico do treino, mas o fluxo primário permanece operável caso entregue em ondas intermediárias. |
| **3** | **Could Have** | Melhorias desejáveis de usabilidade, filtros secundários, edição de perfil do treinador ou consulta de testes físicos. |
| **1 ou 2** | **Won't Have** | Exclusões definitivas com impacto em integridade histórica ([RN13](regras_negocio.md#rn13)), cadastro/edição de testes físicos e fluxos não aplicáveis ao público atual ([RN16](regras_negocio.md#rn16)). |

### 2.2 Definição e Cálculo da Complexidade Técnica (CT)

Para evitar confundir esforço operacional com risco estrutural em uma única estimativa subjetiva, o eixo horizontal da matriz — denominado **Complexidade Técnica (CT)** — consolida **duas avaliações distintas** pontuadas individualmente pelos **6 integrantes da equipe** (escala de **1 a 5**), seguidas da **média aritmética entre ambas as rubricas**:

$$\text{CT} = \frac{\overline{\text{Critério Técnico}} + \overline{\text{Esforço}}}{2}$$

1. **Avaliação de Critério Técnico (arquitetura, dados e regras):**
   * **1 — Muito baixa:** Funcionalidade simples, com poucas regras e poucas informações envolvidas *(ex.: exibir lista de exercícios)*.
   * **2 — Baixa:** Funcionalidade simples envolvendo algumas informações relacionadas *(ex.: cadastrar exercício com nome, objetivo e descrição)*.
   * **3 — Média:** Envolve várias informações ou regras que precisam ser controladas *(ex.: criar planejamento relacionando atleta, exercícios e objetivos)*.
   * **4 — Alta:** Envolve várias partes do sistema e exige cuidados maiores para operar corretamente *(ex.: enviar vídeos e relacioná-los a exercícios e atletas)*.
   * **5 — Muito alta:** Envolve muitas partes do sistema, regras complexas ou cuidados especiais de proteção *(ex.: controle detalhado de acesso a dados, vídeos e feedbacks por atleta)*.
2. **Avaliação de Esforço (tempo de implementação, testes e integração):**
   * **1 — Muito baixo:** Feito rapidamente por uma pessoa *(ex.: exibir uma informação simples)*.
   * **2 — Baixo:** Exige pouco tempo e poucas alterações no sistema *(ex.: criar cadastro simples de exercício)*.
   * **3 — Médio:** Exige cerca de 2 dias de trabalho e envolve mais de uma parte do sistema *(ex.: cadastro e acompanhamento de planejamento)*.
   * **4 — Alto:** Exige de 3 a 5 dias de aplicação, testes e integração entre partes do sistema *(ex.: envio, armazenamento e visualização de vídeos)*.
   * **5 — Muito alto:** Exige trabalho da equipe por mais de 5 dias em várias etapas e módulos *(ex.: controle de acesso e proteção de dados e vídeos)*.

A partir da média final ($\text{CT}$), os requisitos são posicionados nos quadrantes:

* **Baixa Complexidade ($\text{CT} < 3{,}00$):** Quadrantes **Q1** ($\text{VB} > 3$) e **Q3** ($\text{VB} \le 3$).
* **Alta Complexidade ($\text{CT} \ge 3{,}00$):** Quadrantes **Q2** ($\text{VB} > 3$) e **Q4** ($\text{VB} \le 3$).

### 2.3 Regra de Corte e Exceções Justificadas

Integram o MVP todos os requisitos **Must Have ($\text{VB} = 5$)** e os requisitos **Should Have com baixa complexidade ($\text{VB} = 4$ e $\text{CT} < 3{,}00$)**, observadas duas decisões explícitas de conciliação:

* **Inclusão por dependência estrutural — [RF3501 · Enviar vídeo de execução](requisitos.md#rf3501) ($\text{VB} = 4$, *Should Have*, $\text{CT} = 3{,}75$):** Mantido no MVP porque é pré-requisito funcional obrigatório para [RF3502 · Substituir vídeo enviado](requisitos.md#rf3502) e [RF3604 · Registrar feedback](requisitos.md#rf3604) (ambos *Must Have*).
* **Exclusão de alta complexidade — [RF2305 · Comparar treinamentos](requisitos.md#rf2305) ($\text{VB} = 4$, *Should Have*, $\text{CT} = 3{,}08$):** Mantido no backlog posterior por ultrapassar o corte de complexidade ($\text{CT} \ge 3{,}00$) sem bloquear entregas essenciais.

---

## 3. Composição Funcional e Decisões Conciliadas {#3-requisitos-funcionais-do-mvp}

A composição detalhada dos **46 RFs do MVP** está centralizada no [Índice do MVP](requisitos.md#indice-mvp), enquanto o sequenciamento por sprint, responsáveis e o catálogo completo de itens adiados são mantidos no [Backlog](backlog.md#103-plano-execucao).

### 3.1 Registro de Decisão sobre Testes de Aptidão Física

Na reunião de elicitação de **08/10**, a consulta aos resultados de testes físicos pelo treinador ([RF4811](requisitos.md#rf4811)) recebeu avaliação inicial de alto valor ($\text{VB} = 5$). Contudo, na consolidação do escopo, a equipe decidiu **adiar integralmente o módulo de testes físicos** ([RF1216](requisitos.md#rf1216), [RF1217](requisitos.md#rf1217), [RF4803](requisitos.md#rf4803) e [RF4811](requisitos.md#rf4811)), substituindo os códigos obsoletos de versões preliminares (`RF01213`/`RF01214`):

* **Justificativa:** O cadastro e edição de testes ([RF1216](requisitos.md#rf1216) e [RF1217](requisitos.md#rf1217)) foram classificados como *Won't Have* ($\text{VB} = 2$) para priorizar o núcleo de prescrição e acompanhamento de treinos dentro do prazo. Como [RF4811](requisitos.md#rf4811) depende da existência de testes registrados no sistema, mantê-lo no MVP geraria uma consulta vazia sem entrada correspondente. Por isso, [RF4811](requisitos.md#rf4811) foi reclassificado para *Could Have* ($\text{VB} = 3$), permanecendo pronto para a primeira onda evolutiva após validação do formato de avaliação física com o cliente.

### 3.2 Confronto de Viabilidade: Capacidade, Dependências e Validação {#requisitos-fora-do-mvp}

Para assegurar que os **46 RFs** caibam no horizonte de **5 semanas** definido no [Plano de Execução](backlog.md#103-plano-execucao), o recorte foi confrontado com três restrições operacionais:

* **Capacidade da equipe:** Com **6 desenvolvedores** (2 Backend e 4 Frontend), a carga média é de **9,2 RFs por iteração** (~1,5 RF por pessoa/semana), concentrada majoritariamente em operações CRUD de baixa complexidade (37 itens em Q1 com $\text{CT} < 3{,}00$).
* **Diluição de risco técnico:** Os 9 itens de maior esforço (Q2) foram distribuídos entre as Iterações 2 a 5 e ordenados conforme a [Cadeia de Dependências Críticas](backlog.md#102-dependencias), evitando gargalos na sprint final.
* **Tempo de verificação e aceite:** Nenhum item é contabilizado como entregue apenas pela codificação; cada entrega passa por revisão de código por pares e validação contra os cenários de [criterios_aceitacao.md](criterios_aceitacao.md) e o [DoD](dor_dod.md) dentro da própria iteração.

---

## 4. Condições Não Funcionais e Acessibilidade no MVP {#4-requisitos-nao-funcionais-rnfs-essenciais-para-o-mvp}

<span id="obrigatorios-para-o-mvp"></span>
<span id="associados-a-rfs-do-mvp"></span>

A classificação vigente de cada RNF (*Obrigatórios para o MVP*, *Associados a RFs do MVP*, *Evolutivos* e *Não aplicáveis ao MVP*) é mantida exclusivamente em [requisitos_nao_funcionais.md](requisitos_nao_funcionais.md) para evitar divergências de atualização.

### 4.1 Patamar Inicial de Acessibilidade ([RNF04](requisitos_nao_funcionais.md#rnf04))

Embora as necessidades específicas dos atletas acompanhados ainda não tenham sido validadas em campo, a equipe revisou o adiamento integral de [RNF04 · Acessibilidade Digital](requisitos_nao_funcionais.md#rnf04) e estabeleceu um **patamar mínimo verificável já no MVP**, postergando apenas os critérios avançados:

1. **Patamar Mínimo Obrigatório no MVP:**
   * **Contraste visual:** Razão mínima de **4,5:1** entre texto/ícones essenciais e plano de fundo nos componentes principais (botões, formulários, status de treino e feedbacks).
   * **Independência de cor:** Estados de treino e mensagens de erro exibem rótulos textuais e ícones explícitos, sem depender exclusivamente de cor.
   * **Semântica e navegação por teclado:** Associação explícita de `<label>` em formulários, textos alternativos em controles e ordem lógica de foco (`Tab`) nos fluxos críticos de login, consulta de treino e envio de vídeo.
   * **Verificação:** Auditoria automatizada via **Lighthouse / axe DevTools** nas telas principais antes do aceite final do incremento.
2. **Escopo Evolutivo Pós-MVP:**
   * Adequação integral à **WCAG 2.1 nível AA**, testes assistivos com leitores de tela e ajustes específicos levantados após a rodada de validação com os atletas.

<span id="historico-de-revisao"></span>

<details class="sj-document-details" markdown="1"><summary>Histórico de revisão</summary>

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| 14/11/2026 | 1.1 | Remoção de informações duplicadas com `backlog.md` e `requisitos_nao_funcionais.md`; consolidação do recorte em 46 RFs, registro da decisão sobre testes físicos (RF4811, RF1216, RF1217, RF4803), detalhamento das rubricas de Critério Técnico e Esforço no cálculo de CT, mapeamento determinístico VB/MoSCoW, confronto de capacidade/prazo e patamar mínimo de acessibilidade (RNF04). | Equipe Space Jam |
| 13/10/2026 | 0.2 | Ajuste da regra de corte (Must Have + Should Have com CT < 3) e conciliação inicial com o catálogo. | Guilherme Ferreira Mendes |
| 11/10/2026 | 0.1 | Criação inicial da especificação do Mínimo Produto Viável. | Guilherme Ferreira Mendes |

</details>