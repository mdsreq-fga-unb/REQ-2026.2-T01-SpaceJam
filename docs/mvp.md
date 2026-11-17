<span id="minimo-produto-viavel-mvp-projeto-space-jam"></span>

# Mínimo Produto Viável — Space Jam

O MVP concentra o fluxo essencial entre treinador e atleta: autenticação e vínculo privado, biblioteca de exercícios, prescrição e acompanhamento de treinos, registro de execução/dificuldade, envio de vídeo e feedback bidirecional privado. O recorte consolidado reúne **49 Requisitos Funcionais** — distribuídos nas 5 iterações do [Plano de Execução](backlog.md#103-plano-de-execucao-por-iteracao-sincronizado-com-o-miro) — e os requisitos não funcionais aplicáveis mantidos em [requisitos_nao_funcionais.md](requisitos_nao_funcionais.md).

[Explorar requisitos do MVP](requisitos.md#indice-mvp) · [Catálogo funcional](requisitos.md) · [Backlog e iterações](backlog.md) · [Catálogo de RNFs](requisitos_nao_funcionais.md) · [DoR e DoD](dor_dod.md)

---

<span id="1-visao-geral-do-mvp"></span>

## 1. Objetivo do Incremento

Comprovar, em ambiente funcional e com isolamento de dados por vínculo treinador–atleta ([RN02](regras_negocio.md#rn02), [RN03](regras_negocio.md#rn03)), que:

1. O **treinador** consegue ativar sua conta única ([RN01](regras_negocio.md#rn01)), cadastrar exercícios com orientações e erros comuns ([RN14](regras_negocio.md#rn14), [RN22](regras_negocio.md#rn22)), estruturar planejamentos e treinos individualizados ([RN06](regras_negocio.md#rn06), [RN23](regras_negocio.md#rn23)), avaliar vídeos enviados e consultar os relatos escritos por seus atletas ([RN11](regras_negocio.md#rn11), [RN20](regras_negocio.md#rn20)).
2. O **atleta** consegue vincular-se ao treinador, consultar suas prescrições e orientações técnicas, registrar status, nível de dificuldade e feedback textual sobre os exercícios ([RN07](regras_negocio.md#rn07), [RN08](regras_negocio.md#rn08), [RN17](regras_negocio.md#rn17)–[RN21](regras_negocio.md#rn21)), enviar vídeos de execução ([RN09](regras_negocio.md#rn09), [RN10](regras_negocio.md#rn10)) e acompanhar as avaliações recebidas.

---

<span id="2-linha-de-corte-do-mvp"></span>

## 2. Linha de Corte e Critérios Consolidados

A seleção do MVP cruza **Valor de Negócio (VB / MoSCoW)** e **Complexidade Técnica (CT)** sobre os **65 Requisitos Funcionais** do catálogo ([requisitos.md](requisitos.md)).

### 2.1 Escala Determinística de Valor de Negócio e MoSCoW

Para eliminar ambiguidades entre faixas, cada requisito recebeu uma nota inteira de **Valor de Negócio (1 a 5)** mapeada de forma determinística na classificação **MoSCoW**:

| Nota VB | Classificação MoSCoW | Critério de Enquadramento |
| :---: | :---: | :--- |
| **5** | **Must Have** | Indispensável para o fluxo central de ponta a ponta (acesso, vínculo, prescrição, execução, vídeo, feedback bidirecional e conformidade LGPD). |
| **4** | **Should Have** | Alta relevância para acompanhamento e histórico do treino, mas o fluxo primário permanece operável caso entregue em ondas intermediárias. |
| **3** | **Could Have** | Melhorias desejáveis de usabilidade, filtros secundários, edição de perfil do treinador ou consulta de testes físicos. |
| **1 ou 2** | **Won't Have** | Exclusões definitivas com impacto em integridade histórica ([RN13](regras_negocio.md#rn13)), cadastro/edição de testes físicos e fluxos não aplicáveis ao público inicial ([RN16](regras_negocio.md#rn16)). |

### 2.2 Definição e Cálculo da Complexidade Técnica (CT)

Para evitar confundir esforço operacional com risco estrutural em uma única estimativa subjetiva, o eixo horizontal da matriz — denominado **Complexidade Técnica (CT)** — consolida **duas avaliações distintas** pontuadas individualmente pelos **6 integrantes da equipe** (escala de **1 a 5**), seguidas da **média aritmética entre ambas as rubricas**:

$$\text{CT} = \frac{\overline{\text{Critério Técnico}} + \overline{\text{Esforço}}}{2}$$

1. **Avaliação de Critério Técnico (arquitetura, dados e regras):**
   * **1 — Muito baixa:** Funcionalidade simples, com poucas regras e poucas informações envolvidas *(ex.: exibir lista de exercícios)*.
   * **2 — Baixa:** Funcionalidade simples envolvendo algumas informações relacionadas *(ex.: cadastrar exercício com nome, objetivo e fundamento)*.
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

Integram o MVP todos os requisitos **Must Have ($\text{VB} = 5$)** — independentemente da complexidade — e os requisitos **Should Have com baixa complexidade ($\text{VB} = 4$ e $\text{CT} < 3{,}00$)**, totalizando **49 RFs** (**40 itens em Q1** e **9 itens em Q2**), observadas quatro decisões explícitas de conciliação:

* **Inclusão por dependência estrutural — [RF3501 · Enviar vídeo de execução](requisitos.md#rf3501) ($\text{VB} = 4$, *Should Have*, $\text{CT} = 3{,}75$):** Mantido no MVP porque é pré-requisito funcional obrigatório para [RF3502 · Substituir vídeo enviado](requisitos.md#rf3502) e [RF3604 · Registrar feedback](requisitos.md#rf3604) (ambos *Must Have*).
* **Inclusão de requisitos *Must Have* de feedback do aluno — [RF3608 · Registrar feedback do aluno](requisitos.md#rf3608) ($\text{CT} = 2{,}37$), [RF3609 · Editar feedback do aluno](requisitos.md#rf3609) ($\text{CT} = 2{,}00$) e [RF3610 · Consultar feedback do aluno](requisitos.md#rf3610) ($\text{CT} = 1{,}60$):** Incorporados em refinamento posterior para viabilizar o relato escrito do atleta sobre dificuldades e desconfortos na execução ([RN17](regras_negocio.md#rn17)–[RN21](regras_negocio.md#rn21)). Por possuírem $\text{VB} = 5$ (*Must Have*) e $\text{CT} < 3{,}00$, os três itens enquadram-se diretamente no **Quadrante Q1** e foram alocados nas **Iterações 4 e 5** do [Plano de Execução](backlog.md#103-plano-de-execucao-por-iteracao-sincronizado-com-o-miro).
* **Exclusão de alta complexidade — [RF2305 · Comparar treinamentos](requisitos.md#rf2305) ($\text{VB} = 4$, *Should Have*, $\text{CT} = 3{,}08$):** Mantido no backlog posterior por ultrapassar o corte de complexidade ($\text{CT} \ge 3{,}00$) sem bloquear entregas essenciais.
* **Exclusão de fluxo parental e salvaguarda da [RN16](regras_negocio.md#rn16) — [RF4814 · Registrar consentimento de responsável por aluno menor](requisitos.md#rf4814) ($\text{VB} = 2$, *Won't Have*, $\text{CT} = 4{,}08$):** Mantido fora do MVP porque, conforme validado com o treinador titular ([RN01](regras_negocio.md#rn01)), a operação piloto inicial atenderá exclusivamente **atletas maiores de 18 anos**, não havendo demanda imediata pelo fluxo automatizado de validação documental de responsáveis legais (de alta complexidade, $\text{CT} = 4{,}08$). Para assegurar conformidade irrestrita com a [RN16](regras_negocio.md#rn16) e o art. 14 da LGPD sem implementar o módulo parental neste incremento, o cadastro de aluno ([RF1101](requisitos.md#rf1101), que exige data de nascimento conforme a [RN25](regras_negocio.md#rn25)) validará a maioridade e **bloqueará o cadastro de menores de 18 anos no MVP**, exibindo orientação de que o ingresso de menores aguarda a liberação do módulo de consentimento do responsável em onda evolutiva futura.

---

<span id="3-requisitos-funcionais-do-mvp"></span>

## 3. Composição Funcional e Decisões Conciliadas

A composição detalhada dos **49 RFs do MVP** (**40 em Q1** e **9 em Q2**) está centralizada no [Índice do MVP](requisitos.md#indice-mvp), enquanto o sequenciamento por sprint, responsáveis e o catálogo completo de itens adiados são mantidos no [Backlog](backlog.md#103-plano-de-execucao-por-iteracao-sincronizado-com-o-miro).

### 3.1 Registro de Decisão sobre Testes de Aptidão Física

Na reunião de elicitação de **08/10**, a consulta aos resultados de testes físicos pelo treinador ([RF4811](requisitos.md#rf4811)) recebeu avaliação inicial de alto valor ($\text{VB} = 5$). Contudo, na consolidação do escopo, a equipe decidiu **adiar integralmente o módulo de testes físicos** ([RF1216](requisitos.md#rf1216), [RF1217](requisitos.md#rf1217), [RF4803](requisitos.md#rf4803) e [RF4811](requisitos.md#rf4811)), substituindo os códigos obsoletos de versões preliminares (`RF01213`/`RF01214`):

* **Justificativa:** O cadastro e edição de testes ([RF1216](requisitos.md#rf1216) e [RF1217](requisitos.md#rf1217)) foram classificados como *Won't Have* ($\text{VB} = 2$) para priorizar o núcleo de prescrição e acompanhamento de treinos dentro do prazo. Como [RF4811](requisitos.md#rf4811) depende da existência de testes registrados no sistema, mantê-lo no MVP geraria uma consulta vazia sem entrada correspondente. Por isso, [RF4811](requisitos.md#rf4811) foi reclassificado para *Could Have* ($\text{VB} = 3$), permanecendo pronto para a primeira onda evolutiva após validação do formato de avaliação física com o cliente.

<span id="requisitos-fora-do-mvp"></span>

### 3.2 Confronto de Viabilidade: Capacidade, Dependências e Validação

Para assegurar que os **49 RFs** caibam no horizonte de **5 semanas** definido no [Plano de Execução](backlog.md#103-plano-de-execucao-por-iteracao-sincronizado-com-o-miro), o recorte foi confrontado com três restrições operacionais:

* **Capacidade recalculada da equipe:** Com **6 desenvolvedores** (2 Backend e 4 Frontend) ao longo de **5 iterações**, a carga média passa de 9,2 para **9,8 RFs por iteração** (~**1,63 RF por pessoa/semana**), concentrada majoritariamente em operações CRUD e fluxos textuais de baixa complexidade (**40 itens em Q1 com $\text{CT} < 3{,}00$**, distribuídos em 8 RFs + setup na Iteração 1, 13 RFs na Iteração 2, 9 RFs na Iteração 3, 9 RFs na Iteração 4 e 10 RFs na Iteração 5).
* **Revisão da conclusão de viabilidade e diluição de risco:** O acréscimo de 3 RFs (+6,5% de escopo) reduz a margem de folga nas **Iterações 2 (13 RFs)** e **5 (10 RFs, concentrando 4 itens de Q2)**. A entrega permanece **viável dentro do prazo** porque os três itens adicionados ([RF3608](requisitos.md#rf3608) com $\text{CT} = 2{,}37$, [RF3609](requisitos.md#rf3609) com $\text{CT} = 2{,}00$ e [RF3610](requisitos.md#rf3610) com $\text{CT} = 1{,}60$) são operações de baixa complexidade que reutilizam a mesma estrutura relacional de exercício/treino e padrões de interface textual já construídos para percepção de dificuldade ([RF1213](requisitos.md#rf1213)–[RF1214](requisitos.md#rf1214)) e feedback do treinador ([RF3604](requisitos.md#rf3604)–[RF3605](requisitos.md#rf3605)), sem exigir processamento de mídia. Contudo, a equipe estabeleceu **congelamento de escopo do MVP** (*scope freeze*) e priorização obrigatória dos itens bloqueadores nos dois primeiros dias de cada sprint para evitar gargalos de integração na entrega final.
* **Tempo de verificação e aceite:** Nenhum item é contabilizado como entregue apenas pela codificação; cada entrega passa por revisão de código por pares e validação contra os cenários individualizados de [criterios_aceitacao.md](criterios_aceitacao.md) e o [DoD](dor_dod.md) dentro da própria iteração.

---

<span id="4-requisitos-nao-funcionais-rnfs-essenciais-para-o-mvp"></span>

## 4. Condições Não Funcionais e Acessibilidade no MVP

<span id="obrigatorios-para-o-mvp"></span>
<span id="associados-a-rfs-do-mvp"></span>

A classificação vigente dos **17 Requisitos Não Funcionais** (`RNF01` a `RNF17` — divididos em *Obrigatório*, *Associado a RFs do MVP* e *Evolutivos*) é mantida exclusivamente em [requisitos_nao_funcionais.md](requisitos_nao_funcionais.md) para evitar divergências de atualização.

### 4.1 Patamar Inicial de Acessibilidade ([RNF04](requisitos_nao_funcionais.md#rnf04))

Embora [RNF04 · Acessibilidade Digital](requisitos_nao_funcionais.md#rnf04) esteja classificado como **Evolutivo** em [requisitos_nao_funcionais.md](requisitos_nao_funcionais.md#rnf04) após validação com o treinador titular, a equipe estabeleceu boas práticas básicas de construção desde o MVP, postergando os critérios formais de auditoria WCAG para a onda evolutiva:

1. **Diretrizes Básicas Adotadas na Construção do MVP:**
   * **Contraste visual:** Busca pela razão mínima de **4,5:1** entre texto/ícones essenciais e plano de fundo nos componentes principais (botões, formulários, status de treino e feedbacks).
   * **Independência de cor:** Estados de treino e mensagens de erro exibem rótulos textuais e ícones explícitos, sem depender exclusivamente de cor.
   * **Semântica básica:** Associação de `<label>` em formulários e ordem lógica de foco nos fluxos críticos de login, consulta de treino e envio de vídeo.
2. **Escopo Evolutivo Pós-MVP ([RNF04](requisitos_nao_funcionais.md#rnf04)):**
   * Adequação formal integral à **WCAG 2.1 nível AA**, auditorias automatizadas (Lighthouse / axe DevTools), testes assistivos com leitores de tela e ajustes específicos levantados após a rodada de validação com os atletas.

<span id="historico-de-revisao"></span>

<details class="sj-document-details" markdown="1"><summary>Histórico de revisão</summary>

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| 16/11/2026 | 1.2 | Atualização para 65 RFs no catálogo e 49 RFs no MVP (40 em Q1 e 9 em Q2) com registro dos CTs de RF3608 (2,37), RF3609 (2,00) e RF3610 (1,60); recálculo de capacidade para 9,8 RFs/iteração e revisão da conclusão de viabilidade (§3.2); registro formal da exclusão de RF4814 com bloqueio preventivo de menores conforme RN16 (§2.3); alinhamento com RN01–RN25 e RNF01–RNF17. | Equipe Space Jam |
| 14/11/2026 | 1.1 | Remoção de informações duplicadas com `backlog.md` e `requisitos_nao_funcionais.md`; consolidação do recorte em 46 RFs, registro da decisão sobre testes físicos (RF4811, RF1216, RF1217, RF4803), detalhamento das rubricas de Critério Técnico e Esforço no cálculo de CT, mapeamento determinístico VB/MoSCoW, confronto de capacidade/prazo e patamar mínimo de acessibilidade (RNF04). | Equipe Space Jam |
| 13/10/2026 | 0.2 | Ajuste da regra de corte (Must Have + Should Have com CT < 3) e conciliação inicial com o catálogo. | Guilherme Ferreira Mendes |
| 11/10/2026 | 0.1 | Criação inicial da especificação do Mínimo Produto Viável. | Guilherme Ferreira Mendes |

</details>