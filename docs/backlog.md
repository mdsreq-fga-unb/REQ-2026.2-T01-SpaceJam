<span id="10-backlog"></span>

# Backlog e Organização da Execução

Este documento organiza a **sequência de execução por iteração, dependências, responsáveis e estados** do trabalho da equipe, espelhando o planejamento visual no <a href="https://miro.com/app/board/uXjVHrFoSVo=/" target="_blank" rel="noopener">Miro</a> e apontando diretamente para o registro único da especificação:

[Catálogo de RFs e USs](requisitos.md) · [Recorte do MVP](requisitos.md#indice-mvp) · [Catálogo de RNFs](requisitos_nao_funcionais.md) · [Regras de Negócio](regras_negocio.md) · [Critérios de Aceitação](criterios_aceitacao.md) · [DoR e DoD](dor_dod.md)

---

## 10.1 Visão Geral de Prontidão e Resolução de Conflitos

Os **62 requisitos funcionais** do catálogo e a tarefa estrutural de ambiente estão distribuídos em **5 iterações de entrega do MVP** (09/nov a 14/dez) mais o **backlog posterior** de evolução, com a equipe organizada em revezamento entre **Backend** (**Guilherme** e **Thiago**) e **Frontend** (**Anderson**, **Júlia**, **Luiz** e **Paulo**):

| Situação no Backlog | Quantidade | Enquadramento |
| :--- | :---: | :--- |
| **Pronto para iniciar (`A fazer`)** | **1 item** | Tarefa técnica de fundação (`SETUP-01`) que destrava a Iteração 1. |
| **Em andamento / Planejado nas Iterações 1 a 5 (MVP)** | **46 RFs** | 37 itens de **Q1** (Alto Valor + Baixo Esforço) e 9 itens de **Q2** (Alto Valor + Alto Esforço), distribuídos entre 09/nov e 14/dez. |
| **Adiado (`Posterior`)** | **16 RFs** | Itens de **Q3** (*Could Have* / *Won't Have* com baixo esforço) e **Q4** (*Could Have* / *Won't Have* com alto esforço), fora do recorte atual do MVP. |

### Conciliação de Conflitos entre Catálogo, Miro e MVP

Os conflitos apontados entre versões anteriores da documentação e a lista final do MVP foram conciliados tendo o [Catálogo de requisitos](requisitos.md) como fonte única de verdade:

* **`RF01106` (Criar senha aleatória):** Descontinuado na renumeração do catálogo. O fluxo vigente adotou autocadastro com senha definida pelo usuário ([RF1101](requisitos.md#rf1101) e [RF1102](requisitos.md#rf1102)), complementado por troca e recuperação de senha ([RF1108](requisitos.md#rf1108) e [RF1110](requisitos.md#rf1110)). *(No catálogo atual, [RF1106](requisitos.md#rf1106) refere-se a "Excluir perfil do aluno", classificado como Won't Have / Posterior).*
* **`RF4803` e `RF4811` (Consulta de testes físicos):** Conciliados como **Posterior (Fora do MVP)** — *Won't Have* (Q3) e *Could Have* (Q3), respectivamente — em coerência com o adiamento do cadastro e edição de testes físicos ([RF1216](requisitos.md#rf1216) e [RF1217](requisitos.md#rf1217)).
* **`RF2423` (Excluir exercício):** Mantido fora do MVP (**Posterior — Q3 / Won't Have**), exigindo regras futuras de integridade histórica ([RN13](regras_negocio.md#rn13)).
* **`RF3501` (Enviar vídeo de execução):** Embora classificado como *Should Have* com CT 3,75, integra o [Recorte do MVP](requisitos.md#indice-mvp) na **Iteração 4**, viabilizando a substituição de mídia ([RF3502](requisitos.md#rf3502)) e o fluxo de feedback ([RF3604](requisitos.md#rf3604)) na Iteração 5.
* **Padronização de código no Miro (`RF3501` / `US42`):** No quadro de iterações do Miro, o post-it azul de *Enviar vídeo de execução* (Iteração 4) exibe o rótulo histórico `US31`; na rastreabilidade vigente do catálogo, esse item corresponde a [RF3501](requisitos.md#rf3501) ([US42](requisitos.md#us42)).

---

## 10.2 Cadeia de Dependências Críticas

A distribuição dos itens entre as iterações obedece a três cadeias de dependência estrutural:

1. **Aprovação de Treinador, Vínculo e Isolamento (Iterações 1 e 2):**
   * O setup da arquitetura ([RNF02](requisitos_nao_funcionais.md#rnf02)) e o cadastro de treinador ([RF1102](requisitos.md#rf1102)) com fluxo de aprovação administrativa ([RN01](regras_negocio.md#rn01)) antecedem o login ([RF1105](requisitos.md#rf1105)) e a geração de código de vínculo para cadastro de alunos ([RF1101](requisitos.md#rf1101), [RN02](regras_negocio.md#rn02)).
   * A consulta da carteira de alunos ([RF4701](requisitos.md#rf4701)), a visualização/edição de perfis ([RF4802](requisitos.md#rf4802), [RF4810](requisitos.md#rf4810), [RF1107](requisitos.md#rf1107), [RF1111](requisitos.md#rf1111)) e o aceite de termos ([RF4812](requisitos.md#rf4812)) na Iteração 2 dependem das contas ativas e das camadas de RBAC ([RNF08](requisitos_nao_funcionais.md#rnf08)) e isolamento multi-tenant ([RN03](regras_negocio.md#rn03), [RNF09](requisitos_nao_funcionais.md#rnf09)).
2. **Biblioteca, Planejamento e Execução (Iterações 1 a 4):**
   * O cadastro, edição e consulta básica de exercícios na biblioteca ([RF2413](requisitos.md#rf2413), [RF2422](requisitos.md#rf2422), [RF2421](requisitos.md#rf2421)) ocorrem na Iteração 1 e são complementados na Iteração 2 pelos metadados de vídeo-base, erros comuns, orientações e pesquisa ([RF2418](requisitos.md#rf2418), [RF2419](requisitos.md#rf2419), [RF2420](requisitos.md#rf2420), [RF2416](requisitos.md#rf2416), [RF2424](requisitos.md#rf2424)).
   * A estruturação de planejamentos e treinos ([RF2301](requisitos.md#rf2301), [RF2302](requisitos.md#rf2302), [RF2307](requisitos.md#rf2307)) e o acompanhamento de status ([RF2306](requisitos.md#rf2306), [RF2312](requisitos.md#rf2312), [RF1215](requisitos.md#rf1215)) na Iteração 3 dependem da biblioteca ativa e da carteira vinculada, destravando o registro e consulta de dificuldade ([RF1213](requisitos.md#rf1213), [RF1214](requisitos.md#rf1214), [RF1212](requisitos.md#rf1212)) na Iteração 4.
3. **Armazenamento de Mídia e Feedback Assíncrono (Iterações 4 e 5):**
   * O envio de vídeo de execução ([RF3501](requisitos.md#rf3501)) entra na Iteração 4 condicionado ao armazenamento isolado e às validações de formato, duração e tamanho ([RN09](regras_negocio.md#rn09), [RNF06](requisitos_nao_funcionais.md#rnf06), [RNF12](requisitos_nao_funcionais.md#rnf12), [RNF13](requisitos_nao_funcionais.md#rnf13), [RNF15](requisitos_nao_funcionais.md#rnf15)).
   * A visualização de vídeos ([RF4804](requisitos.md#rf4804), [RF4805](requisitos.md#rf4805)), a substituição pré-avaliação ([RF3502](requisitos.md#rf3502), [RN10](regras_negocio.md#rn10)), o ciclo completo de feedback ([RF3604](requisitos.md#rf3604), [RF3605](requisitos.md#rf3605), [RF4806](requisitos.md#rf4806), [RF3607](requisitos.md#rf3607)) e a exclusão de dados LGPD ([RF4813](requisitos.md#rf4813), [RN05](regras_negocio.md#rn05)) fecham o MVP na Iteração 5.

---

## 10.3 Plano de Execução por Iteração (Sincronizado com o Miro)

Cada item utiliza os estados operacionais do fluxo da equipe: **`A fazer`**, **`Em andamento`**, **`Em revisão`**, **`Em validação`**, **`Bloqueado`** e **`Concluído`**.

### Iteração 1 — Fundação Técnica, Acesso Básico e Núcleo da Biblioteca (09/nov a 16/nov)

*9 RFs (todos Q1) + 1 tarefa técnica de infraestrutura.*

| Ordem | Item (Ficha) | Quadrante / MoSCoW | Dependências | Responsáveis (Back / Front) | Estado |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **1.01** | `SETUP-01` · Setup Docker, Django, React e PostgreSQL | Infra ([RNF02](requisitos_nao_funcionais.md#rnf02)) | Nenhuma | Luiz e Guilherme | `A fazer` |
| **1.02** | [RF1102 · Cadastrar treinador](requisitos.md#rf1102) | Q1 · Must Have | `SETUP-01`, aprovação admin ([RN01](regras_negocio.md#rn01)) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda 1.01)* |
| **1.03** | [RF1101 · Cadastrar aluno](requisitos.md#rf1101) | Q1 · Must Have | [RF1102](requisitos.md#rf1102), código de vínculo ([RN02](regras_negocio.md#rn02)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 1.02)* |
| **1.04** | [RF1104 · Logar aluno](requisitos.md#rf1104) | Q1 · Must Have | [RF1101](requisitos.md#rf1101), RBAC ([RNF08](requisitos_nao_funcionais.md#rnf08)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda 1.03)* |
| **1.05** | [RF1105 · Logar treinador](requisitos.md#rf1105) | Q1 · Must Have | [RF1102](requisitos.md#rf1102), aprovação ativa ([RN01](regras_negocio.md#rn01)) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 1.02)* |
| **1.06** | [RF1103 · Deslogar aluno](requisitos.md#rf1103) | Q1 · Must Have | [RF1104](requisitos.md#rf1104), [RF1105](requisitos.md#rf1105) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda 1.04/1.05)* |
| **1.07** | [RF2413 · Cadastrar exercício](requisitos.md#rf2413) | Q1 · Must Have | [RF1105](requisitos.md#rf1105) ([RN14](regras_negocio.md#rn14), [RNF11](requisitos_nao_funcionais.md#rnf11)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 1.05)* |
| **1.08** | [RF2421 · Consultar exercício da biblioteca](requisitos.md#rf2421) | Q1 · Should Have | [RF2413](requisitos.md#rf2413) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda 1.07)* |
| **1.09** | [RF2422 · Editar exercício](requisitos.md#rf2422) | Q1 · Must Have | [RF2421](requisitos.md#rf2421) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 1.08)* |

### Iteração 2 — Gestão de Perfis, Carteira, Credenciais e Metadados da Biblioteca (16/nov a 23/nov)

*12 RFs (9 Q1 + 3 Q2).*

| Ordem | Item (Ficha) | Quadrante / MoSCoW | Dependências | Responsáveis (Back / Front) | Estado |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **2.01** | [RF4701 · Consultar alunos acompanhados](requisitos.md#rf4701) | Q1 · Should Have | [RF1105](requisitos.md#rf1105), [RF1101](requisitos.md#rf1101) ([RN03](regras_negocio.md#rn03), [RNF09](requisitos_nao_funcionais.md#rnf09)) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda It. 1)* |
| **2.02** | [RF4810 · Consultar perfil de aluno acompanhado](requisitos.md#rf4810) | Q1 · Must Have | [RF4701](requisitos.md#rf4701) ([RN03](regras_negocio.md#rn03)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 2.01)* |
| **2.03** | [RF4802 · Consultar próprios dados cadastrais](requisitos.md#rf4802) | Q1 · Must Have | [RF1104](requisitos.md#rf1104) ([RN03](regras_negocio.md#rn03)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda It. 1)* |
| **2.04** | [RF1107 · Editar informações do perfil do aluno](requisitos.md#rf1107) | Q1 · Must Have | [RF4802](requisitos.md#rf4802) ([RN04](regras_negocio.md#rn04)) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 2.03)* |
| **2.05** | [RF1108 · Trocar senha](requisitos.md#rf1108) | Q1 · Must Have | [RF1104](requisitos.md#rf1104), [RF1105](requisitos.md#rf1105) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda It. 1)* |
| **2.06** | [RF1110 · Recuperar senha](requisitos.md#rf1110) | Q2 · Must Have | [RF1108](requisitos.md#rf1108), serviço de e-mail ([RN12](regras_negocio.md#rn12)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 2.05)* |
| **2.07** | [RF4812 · Aceitar termos de uso e privacidade](requisitos.md#rf4812) | Q1 · Must Have | [RF1101](requisitos.md#rf1101), [RF1102](requisitos.md#rf1102) ([RN15](regras_negocio.md#rn15)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda It. 1)* |
| **2.08** | [RF1111 · Registrar histórico de lesões](requisitos.md#rf1111) | Q1 · Must Have | [RF4810](requisitos.md#rf4810) ([RN04](regras_negocio.md#rn04)) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 2.02)* |
| **2.09** | [RF2418 · Cadastrar info complementares do vídeo base](requisitos.md#rf2418) | Q1 · Must Have | [RF2413](requisitos.md#rf2413) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda It. 1)* |
| **2.10** | [RF2419 · Documentar erros e orientações](requisitos.md#rf2419) | Q1 · Must Have | [RF2413](requisitos.md#rf2413) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda It. 1)* |
| **2.11** | [RF2420 · Editar erros e orientações](requisitos.md#rf2420) | Q1 · Must Have | [RF2419](requisitos.md#rf2419) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda 2.10)* |
| **2.12** | [RF2416 · Associar erros e orientações](requisitos.md#rf2416) | Q2 · Must Have | [RF2419](requisitos.md#rf2419) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 2.10)* |
| **2.13** | [RF2424 · Pesquisar exercício por nome](requisitos.md#rf2424) | Q2 · Must Have | [RF2421](requisitos.md#rf2421) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda It. 1)* |

### Iteração 3 — Planejamento, Prescrição de Treinos e Controle de Status (23/nov a 29/nov)

*9 RFs (8 Q1 + 1 Q2).*

| Ordem | Item (Ficha) | Quadrante / MoSCoW | Dependências | Responsáveis (Back / Front) | Estado |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **3.01** | [RF2301 · Cadastrar planejamento de treino](requisitos.md#rf2301) | Q1 · Must Have | [RF4701](requisitos.md#rf4701) ([RN03](regras_negocio.md#rn03)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda It. 2)* |
| **3.02** | [RF2307 · Criar treino com exercícios](requisitos.md#rf2307) | Q2 · Must Have | [RF2301](requisitos.md#rf2301), [RF2413](requisitos.md#rf2413) ([RN06](regras_negocio.md#rn06)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda 3.01)* |
| **3.03** | [RF2302 · Editar planejamento de treino](requisitos.md#rf2302) | Q1 · Must Have | [RF2301](requisitos.md#rf2301) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 3.01)* |
| **3.04** | [RF2310 · Consultar planejamento de aluno acompanhado](requisitos.md#rf2310) | Q1 · Must Have | [RF2307](requisitos.md#rf2307) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda 3.02)* |
| **3.05** | [RF2306 · Consultar status de treino](requisitos.md#rf2306) | Q1 · Must Have | [RF2307](requisitos.md#rf2307) ([RN07](regras_negocio.md#rn07)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 3.02)* |
| **3.06** | [RF2312 · Registrar status do treino](requisitos.md#rf2312) | Q1 · Must Have | [RF4809](requisitos.md#rf4809) ([RN06](regras_negocio.md#rn06), [RN07](regras_negocio.md#rn07)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda 3.09)* |
| **3.07** | [RF1215 · Registrar conclusão de treino](requisitos.md#rf1215) | Q1 · Should Have | [RF2306](requisitos.md#rf2306) ([RN06](regras_negocio.md#rn06), [RN07](regras_negocio.md#rn07)) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 3.05)* |
| **3.08** | [RF4808 · Consultar próprios objetivos do aluno](requisitos.md#rf4808) | Q1 · Should Have | [RF4802](requisitos.md#rf4802) ([RN03](regras_negocio.md#rn03)) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda It. 2)* |
| **3.09** | [RF4809 · Consultar próprio planejamento de treinos](requisitos.md#rf4809) | Q1 · Should Have | [RF2307](requisitos.md#rf2307) ([RN03](regras_negocio.md#rn03)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 3.02)* |

### Iteração 4 — Ajustes de Treino, Dificuldade, Histórico e Envio de Vídeo (29/nov a 06/dez)

*7 RFs (6 Q1 + 1 Q2).*

| Ordem | Item (Ficha) | Quadrante / MoSCoW | Dependências | Responsáveis (Back / Front) | Estado |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **4.01** | [RF2304 · Consultar histórico de planejamentos](requisitos.md#rf2304) | Q1 · Should Have | [RF2301](requisitos.md#rf2301) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda It. 3)* |
| **4.02** | [RF2308 · Editar treino](requisitos.md#rf2308) | Q1 · Must Have | [RF2307](requisitos.md#rf2307) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda It. 3)* |
| **4.03** | [RF1213 · Registrar dificuldade](requisitos.md#rf1213) | Q1 · Must Have | [RF4809](requisitos.md#rf4809) ([RN08](regras_negocio.md#rn08)) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda It. 3)* |
| **4.04** | [RF1214 · Editar dificuldade](requisitos.md#rf1214) | Q1 · Must Have | [RF1213](requisitos.md#rf1213) ([RN08](regras_negocio.md#rn08)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 4.03)* |
| **4.05** | [RF3501 · Enviar vídeo de execução](requisitos.md#rf3501) | Q2 · Should Have (MVP) | [RF4809](requisitos.md#rf4809), storage mídia ([RN09](regras_negocio.md#rn09), [RNF06](requisitos_nao_funcionais.md#rnf06), [RNF12](requisitos_nao_funcionais.md#rnf12), [RNF13](requisitos_nao_funcionais.md#rnf13), [RNF15](requisitos_nao_funcionais.md#rnf15)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda It. 3)* |
| **4.06** | [RF4807 · Consultar próprio histórico de treinos](requisitos.md#rf4807) | Q1 · Should Have | [RF2312](requisitos.md#rf2312) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda It. 3)* |
| **4.07** | [RF1212 · Consultar dificuldade](requisitos.md#rf1212) | Q1 · Should Have | [RF1213](requisitos.md#rf1213) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda 4.03)* |

### Iteração 5 — Avaliação de Vídeos, Feedback Assíncrono e Conformidade LGPD (09/dez a 14/dez)

*9 RFs (5 Q1 + 4 Q2).*

| Ordem | Item (Ficha) | Quadrante / MoSCoW | Dependências | Responsáveis (Back / Front) | Estado |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **5.01** | [RF4805 · Consultar vídeos de alunos](requisitos.md#rf4805) | Q1 · Must Have | [RF3501](requisitos.md#rf3501) ([RN03](regras_negocio.md#rn03)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 4.05)* |
| **5.02** | [RF3604 · Registrar feedback](requisitos.md#rf3604) | Q1 · Must Have | [RF4805](requisitos.md#rf4805) ([RN10](regras_negocio.md#rn10), [RN11](regras_negocio.md#rn11)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda 5.01)* |
| **5.03** | [RF3605 · Editar feedback](requisitos.md#rf3605) | Q1 · Must Have | [RF3604](requisitos.md#rf3604) ([RN11](regras_negocio.md#rn11)) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 5.02)* |
| **5.04** | [RF4806 · Consultar feedback recebido](requisitos.md#rf4806) | Q1 · Must Have | [RF3604](requisitos.md#rf3604) ([RN03](regras_negocio.md#rn03)) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda 5.02)* |
| **5.05** | [RF3502 · Substituir vídeo enviado](requisitos.md#rf3502) | Q2 · Must Have | [RF3501](requisitos.md#rf3501), trava pós-feedback ([RN10](regras_negocio.md#rn10)) | Thiago (Back) / Anderson (Front) | `Bloqueado` *(aguarda 5.02)* |
| **5.06** | [RF4804 · Consultar próprios vídeos enviados](requisitos.md#rf4804) | Q1 · Should Have | [RF3501](requisitos.md#rf3501) ([RN03](regras_negocio.md#rn03)) | Guilherme (Back) / Paulo (Front) | `Bloqueado` *(aguarda 4.05)* |
| **5.07** | [RF3607 · Notificar aluno sobre feedback](requisitos.md#rf3607) | Q2 · Must Have | [RF3604](requisitos.md#rf3604), [RF3605](requisitos.md#rf3605) | Thiago (Back) / Luiz (Front) | `Bloqueado` *(aguarda 5.03)* |
| **5.08** | [RF2311 · Consultar histórico de treinos de aluno](requisitos.md#rf2311) | Q2 · Must Have | [RF1215](requisitos.md#rf1215) | Guilherme (Back) / Júlia (Front) | `Bloqueado` *(aguarda It. 3)* |
| **5.09** | [RF4813 · Solicitar exclusão dos próprios dados](requisitos.md#rf4813) | Q2 · Must Have | [RF1104](requisitos.md#rf1104), [RF3501](requisitos.md#rf3501), [RF3604](requisitos.md#rf3604) ([RN05](regras_negocio.md#rn05)) | Guilherme (Back) / Anderson (Front) | `Bloqueado` *(aguarda 5.02)* |

### Backlog Posterior — Evolução Futura (Fora do MVP / Adiados)

*16 RFs situados nos quadrantes **Q3** e **Q4** (classificados como Could Have, Won't Have ou Should Have com CT ≥ 3,00).*

| Item (Ficha) | Quadrante / Classificação | Motivo do Adiamento / Dependência | Estado |
| :--- | :---: | :--- | :---: |
| [RF2305 · Comparar treinamentos](requisitos.md#rf2305) | Q2/Posterior · Should Have (CT 3,08) | Excede o corte de complexidade (CT < 3) do MVP; depende de [RF2311](requisitos.md#rf2311). | `Adiado` |
| [RF1109 · Editar info do perfil do treinador](requisitos.md#rf1109) | Q3 · Could Have (CT 2,10) | Complementar; depende de [RF1105](requisitos.md#rf1105). | `Adiado` |
| [RF2303 · Associar planejamento a objetivo](requisitos.md#rf2303) | Q3 · Could Have (CT 2,42) | Complementar; depende de [RF2301](requisitos.md#rf2301). | `Adiado` |
| [RF2414 · Filtrar exercícios por fundamento](requisitos.md#rf2414) | Q3 · Could Have (CT 1,92) | Complementar à pesquisa por nome ([RF2424](requisitos.md#rf2424)). | `Adiado` |
| [RF4811 · Consultar resultados de testes de aluno](requisitos.md#rf4811) | Q3 · Could Have (CT 2,25) | Depende do módulo de testes físicos ([RF1216](requisitos.md#rf1216)). | `Adiado` |
| [RF2417 · Linkar thumbnail de vídeo base](requisitos.md#rf2417) | Q4 · Could Have (CT 3,33) | Processamento de mídia adicional; depende de [RF2413](requisitos.md#rf2413). | `Adiado` |
| [RF1106 · Excluir perfil do aluno](requisitos.md#rf1106) | Q3 · Won't Have (CT 2,00) | Gestão avançada de carteira ([RN05](regras_negocio.md#rn05)). | `Adiado` |
| [RF1216 · Registrar teste de aptidão física](requisitos.md#rf1216) | Q3 · Won't Have (CT 2,67) | Módulo de avaliação física fora do incremento inicial. | `Adiado` |
| [RF1217 · Editar teste de aptidão física](requisitos.md#rf1217) | Q3 · Won't Have (CT 2,08) | Depende de [RF1216](requisitos.md#rf1216). | `Adiado` |
| [RF2309 · Excluir planejamento](requisitos.md#rf2309) | Q3 · Won't Have (CT 1,73) | Exige regras de integridade histórica ([RN13](regras_negocio.md#rn13)). | `Adiado` |
| [RF2415 · Associar exercício ao objetivo](requisitos.md#rf2415) | Q4 · Won't Have (CT 3,08) | Taxonomia avançada da biblioteca. | `Adiado` |
| [RF2423 · Excluir exercício](requisitos.md#rf2423) | Q3 · Won't Have (CT 2,13) | Exige regras de integridade histórica ([RN13](regras_negocio.md#rn13)). | `Adiado` |
| [RF3503 · Excluir vídeo enviado](requisitos.md#rf3503) | Q3 · Won't Have (CT 2,42) | Substituição ([RF3502](requisitos.md#rf3502)) atende o MVP. | `Adiado` |
| [RF3606 · Excluir feedback](requisitos.md#rf3606) | Q3 · Won't Have (CT 2,17) | Edição ([RF3605](requisitos.md#rf3605)) atende o MVP. | `Adiado` |
| [RF4803 · Consultar próprios testes físicos](requisitos.md#rf4803) | Q3 · Won't Have (CT 1,75) | Depende de [RF1216](requisitos.md#rf1216). | `Adiado` |
| [RF4814 · Consentimento de responsável (menor)](requisitos.md#rf4814) | Q4 · Won't Have (CT 4,08) | Aplicável apenas quando houver operação com menores ([RN16](regras_negocio.md#rn16)). | `Adiado` |

---

<span id="102-priorizacao-do-backlog-geral-e-mvp"></span>

## 10.4 Critérios de Priorização e Governança

### Regra de Corte do MVP

A seleção de escopo combina **MoSCoW** e **Complexidade Técnica (CT, escala 1 a 5)**:

* **Incluídos no MVP (Iterações 1 a 5):** Todos os requisitos **Must Have** e os requisitos **Should Have com CT < 3,00**, além da exceção funcional de [RF3501](requisitos.md#rf3501).
* **Fora do MVP (`Posterior`):** Requisitos **Should Have com CT ≥ 3,00**, **Could Have** e **Won't Have**.
* **Requisitos Não Funcionais:** Os 18 RNFs seguem a classificação em *Obrigatórios para o MVP*, *Associados a RFs do MVP*, *Evolutivos* e *Não aplicáveis ao MVP*, mantida diretamente em [requisitos_nao_funcionais.md](requisitos_nao_funcionais.md).

### Fluxo de Atualização e Rastreabilidade

1. **Fonte única:** Qualquer alteração de declaração, prioridade ou critério é feita exclusivamente na ficha correspondente em [requisitos.md](requisitos.md), [regras_negocio.md](regras_negocio.md), [requisitos_nao_funcionais.md](requisitos_nao_funcionais.md) ou [criterios_aceitacao.md](criterios_aceitacao.md).
2. **Reflexo na execução:** Ao concluir um item bloqueador, atualizar o estado dos itens dependentes nesta página de `Bloqueado` para `A fazer`.
3. **Validação:** A inclusão em uma iteração indica planejamento de entrega, mas a conclusão efetiva exige atendimento aos critérios de aceitação e ao [DoD](dor_dod.md).

<span id="historico-de-revisao"></span>

<details class="sj-document-details" markdown="1"><summary>Histórico de revisão</summary>

| Data | Versão | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| 14/11/2026 | 1.0 | Reestruturação do backlog sincronizada com as 5 iterações do Miro (09/nov a 14/dez), explicitando dependências, responsáveis nominais por frente (Backend e Frontend), estados operacionais, remoção de duplicações com os catálogos e conciliação de RF01106, RF4803, RF4811 e RF2423 com o MVP. | Equipe Space Jam |
| 13/10/2026 | 0.4 | Ajuste da priorização MoSCoW (RF01106, RF04803, RF04811), definição da linha de corte do MVP (Must + Should com CT < 3) e unificação do MVP com o mvp.md | Guilherme Ferreira Mendes |
| 12/10/2026 | 0.3 | Refinamento das Regras de Negócio. | Guilherme Ferreira Mendes |
| 12/10/2026 | 0.2 | Adição dos US (histórias de usuário) e CA (critérios de aceitação), mais as tabelas do Miro. | Guilherme Ferreira Mendes |
| 11/10/2026 | 0.1 | Criação e consolidação inicial do Backlog do Produto (RFs, RNFs e RNs). | Guilherme Ferreira Mendes |

</details>