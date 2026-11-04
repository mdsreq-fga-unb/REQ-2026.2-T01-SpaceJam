<span id="10-backlog"></span>

# Backlog e priorização

O backlog reúne o escopo a refinar e selecionar para construção. Os requisitos, histórias, condições, prioridades e recorte do MVP são mantidos no [catálogo integrado](requisitos.md). Esta página explica a organização e o método, preservando os artefatos de origem e o histórico.

## 10.1 Organização e consulta {#101-backlog-geral}

Cada ficha funcional é um item consultável do backlog. Histórias por ator explicitam intenções e permissões; critérios compartilhados têm registros próprios e links nas fichas. A seleção de trabalho exige revisar critérios, dependências, capacidade e [DoR/DoD](dor_dod.md), sem confundir prioridade com estado de execução.

<div class="sj-catalog-links"><a href="../requisitos/">Consultar todo o catálogo</a><a href="../requisitos/#indice-mvp">Consultar recorte do MVP</a><a href="#atualizacao-do-backlog">Como atualizar o backlog</a></div>

### 10.1.1 Requisitos funcionais {#1011-catalogo-consolidado-de-requisitos-funcionais}

<span id="cp1-gestao-das-informacoes-do-atleta-controle-de-acesso"></span>
<span id="cp2-administracao-de-conteudo-avaliacoes-e-status"></span>
<span id="cp3-espaco-de-construcao-planejamento"></span>
<span id="cp4-validador-de-estruturas-biblioteca-de-exercicios"></span>
<span id="cp5-portfolio-de-progresso-envio-de-videos"></span>
<span id="cp6-painel-de-monitoramento-feedback"></span>
<span id="cp7-e-cp8-controle-de-atletas-e-isolamento-de-dados-multi-tenant"></span>

[Abrir as fichas dos RFs](requisitos.md). Declaração, história, atributos e condições são mantidos ali.

### 10.1.2 Requisitos não funcionais {#1012-catalogo-consolidado-de-requisitos-nao-funcionais}

[Consultar os registros dos RNFs](requisitos_nao_funcionais.md).

### 10.1.3 Regras de negócio {#1013-catalogo-de-regras-de-negocio-rn}

[Consultar as regras](regras_negocio.md).

### 10.1.4 Histórias de usuário {#1014-user-stories-derivadas-dos-requisitos-funcionais}

As histórias estão vinculadas a cada [ficha do catálogo](requisitos.md). Os desdobramentos por ator foram preservados.

### 10.1.5 Critérios de aceitação {#1015-criterios-de-aceitacao}

[Consultar os critérios por história](criterios_aceitacao.md). Os grupos compartilhados indicam sua abrangência; cenários funcionais ainda ausentes precisam ser refinados.

### 10.1.6 Rastreabilidade {#1016-matriz-de-rastreabilidade}

A origem OE/CP, as histórias, condições e critérios são consultáveis na ficha. RNFs e regras possuem registros próprios. As [orientações de atualização](#atualizacao-do-backlog) indicam como revisar os efeitos de uma alteração.

O Miro é um artefato de origem. A data/versão da sua correspondência com o catálogo ainda precisa ser confirmada; ele não substitui o registro textual vigente.

[Acessar a Matriz de Rastreabilidade no Miro](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764686792804852&cot=14)

<details class="sj-delivery-video-details sj-artifact-preview">
  <summary>Ver matriz de rastreabilidade nesta página</summary>
  <p class="sj-artifact-caption">Artefato de origem no Miro. Correspondência com esta versão documental ainda não confirmada; consulte os registros textuais vinculados.</p>
  <div class="sj-artifact-frame">
    <iframe title="Matriz de rastreabilidade do Space Jam" loading="lazy" width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?focusWidget=3458764686792804852&embedMode=view_only_without_ui&embedId=190867808159" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>
  </div>
</details>


### 10.1.7 Atualização do backlog {#atualizacao-do-backlog}

Quando um requisito mudar, registrar a origem e a razão da decisão, atualizar sua ficha no [catálogo](requisitos.md) e conferir os vínculos com histórias, RNFs, regras, critérios, protótipos e planejamento. Manter o ID estável e registrar a revisão no histórico correspondente.

Comunicar a mudança à equipe e ao cliente quando pertinente, distinguindo proposta, decisão e resultado comprovado. A prioridade e a participação no MVP não demonstram, por si só, que um requisito foi implementado ou validado.

## 10.2 Priorização do Backlog Geral e MVP

A priorização do backlog foi conduzida combinando duas técnicas complementares: a Priorização MoSCoW e a Matriz Avaliação Técnica × Valor de Negócio (operacionalizada como Matriz de Valor de Negócio × Complexidade e Esforço Técnico).

### 10.2.1 Critérios Objetivos para a Classificação MoSCoW

O valor de negócio representa o impacto do requisito nos fluxos principais da plataforma e na capacidade do sistema atender aos objetivos definidos para o MVP. A partir desses critérios, cada requisito foi classificado segundo o modelo MoSCoW:

| Classificação | Critério |
| :--- | :--- |
| **Must Have** | O requisito participa diretamente de um fluxo essencial do MVP. Sem ele, o sistema não executa o caso de uso principal ou perde sua função central. |
| **Should Have** | O requisito apoia um fluxo essencial ou amplia um fluxo principal com suporte pedagógico, operacional ou de acompanhamento. O MVP continua funcionando sem ele, mas com perda de cobertura, automação ou qualidade. |
| **Could Have** | O requisito complementa o uso do sistema, mas não altera a execução dos fluxos principais do MVP. |
| **Won't Have** | O requisito não entra na primeira versão do MVP. Foi postergado por baixo impacto no fluxo principal ou por custo técnico incompatível com a versão inicial. |
 
<span id="1022-criterios-objetivos-para-o-valor-de-negocio-vb_1"></span>

### 10.2.2 Critérios Objetivos para o Valor de Negócio (VB)

Para permitir o posicionamento quantitativo dos requisitos na Matriz de Priorização, as classificações MoSCoW foram convertidas em uma escala numérica de Valor de Negócio (VB), variando de 1 a 5.

| Classificação MoSCoW | Valor de Negócio (VB) |
| :--- | :---: |
| Must Have | 4 ou 5 |
| Should Have | 4 |
| Could Have | 3 |
| Won't Have | 1 ou 2 |

[Acessar a Matriz Moscow](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764685315069399&cot=14)

<details class="sj-delivery-video-details sj-artifact-preview">
  <summary>Ver priorização MoSCoW nesta página</summary>
  <p class="sj-artifact-caption">Artefato de origem no Miro. Correspondência com esta versão documental ainda não confirmada; consulte os registros textuais vinculados.</p>
  <div class="sj-artifact-frame">
    <iframe title="Priorização MoSCoW do Space Jam" loading="lazy" width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?embedMode=view_only_without_ui&moveToViewport=1026%2C11267%2C2291%2C2023&embedId=336465475640" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>
  </div>
</details>

### 10.2.3 Critérios Objetivos para a Complexidade Técnica (CT)

A Complexidade Técnica dimensiona o impacto arquitetural, a quantidade de regras de negócio envolvidas e o volume de integrações necessárias para a implementação de cada requisito.

| Score | Classificação | Descrição da Complexidade e Regras Envolvidas | Exemplo Prático na Plataforma |
| :---: | :--- | :--- | :--- |
| **1** | **Muito baixa** | Funcionalidade simples, com poucas regras e poucas informações envolvidas. | Exibir uma lista de exercícios. |
| **2** | **Baixa** | Funcionalidade simples, mas que envolve algumas informações relacionadas. | Cadastrar um exercício com nome, objetivo e descrição. |
| **3** | **Média** | Envolve várias informações ou algumas regras que precisam ser controladas. | Criar um planejamento de treino relacionando atleta, exercícios e objetivos. |
| **4** | **Alta** | Envolve várias partes do sistema e exige cuidados maiores para funcionar corretamente. | Enviar vídeos e relacioná-los a exercícios e atletas. |
| **5** | **Muito alta** | Envolve muitas partes do sistema, regras complexas, algoritmos avançados ou exige cuidados especiais. | Controlar de forma detalhada quem pode acessar dados, vídeos e feedbacks de cada atleta. |

### 10.2.4 Critérios Objetivos para o Esforço

O Esforço representa o custo em tempo e alocação de equipe necessário para concluir o desenvolvimento, testes e integração da funcionalidade. 

| Nível | Classificação | Critério de Esforço (Tempo e Alocação) | Exemplo Prático na Plataforma |
| :---: | :--- | :--- | :--- |
| **1** | **Muito baixo** | Pode ser feito rapidamente por uma pessoa. | Alterar um texto ou exibir uma informação simples. |
| **2** | **Baixo** | Exige pouco tempo e poucas alterações no sistema. | Criar um cadastro simples de exercício. |
| **3** | **Médio** | Exige cerca de 2 dias de trabalho e envolve mais de uma parte do sistema. | Criar o cadastro e acompanhamento de um planejamento de treino. |
| **4** | **Alto** | Exige de 3 a 5 dias de aplicação, testes e integração entre diferentes partes do sistema. | Implementar o envio, armazenamento e visualização de vídeos. |
| **5** | **Muito alto** | Exige muito trabalho da equipe por mais de 5 dias e pode envolver várias etapas e partes do sistema. | Implementar todo o controle de acesso e proteção dos dados e vídeos dos atletas. |

### 10.2.5 Regra de Decisão da Matriz

O posicionamento de cada requisito na Matriz de Priorização é determinado pelo cruzamento entre o **Valor de Negócio (VB)** e a **Complexidade Técnica/Esforço (CT)**, seguindo regras estritas de agregação:

*   **Eixo de Valor (VB):** Requisitos com valor 4 ou 5 (*Must Have* e *Should Have*) são considerados de **Alto Valor de Negócio**. Requisitos com valor igual ou inferior a 3 (*Could Have* e *Won't Have*) são classificados como **Baixo Valor de Negócio**.
*   **Eixo de Esforço/Complexidade (CT):** Requisitos com pontuação técnica inferior a 3.0 (CT < 3) são enquadrados como **Baixo Esforço**. Requisitos com pontuação 3.0 ou superior (CT >= 3) representam **Alto Esforço**, sinalizando a necessidade de planejamento avançado.

A partir desse cruzamento, os itens do backlog são distribuídos nos quadrantes estratégicos:

*   **Q1 — Alto Valor + Baixo Esforço:** Prioridade máxima. São as funcionalidades essenciais (*core*) que a equipe consegue entregar com rapidez.
*   **Q2 — Alto Valor + Alto Esforço:** Planejar com atenção. Requisitos indispensáveis para a proposta de valor, mas que consomem alto recurso técnico.
*   **Q3 — Baixo Valor + Baixo Esforço:** Baixa prioridade (*Quick Wins*). Funcionalidades fáceis de implementar, mas que não comprometem o MVP se ficarem para depois.
*   **Q4 — Baixo Valor + Alto Esforço:** Adiar para o futuro. Itens caros tecnicamente que agregam pouco à hipótese principal nesta versão inicial.

[Acessar a Matriz de Priorização no Miro](https://miro.com/app/board/uXjVHrFoSVo=/?moveToWidget=3458764685315496941&cot=14)

<details class="sj-delivery-video-details sj-artifact-preview">
  <summary>Ver matriz de priorização nesta página</summary>
  <p class="sj-artifact-caption">Artefato de origem no Miro. Correspondência com esta versão documental ainda não confirmada; consulte os registros textuais vinculados.</p>
  <div class="sj-artifact-frame">
    <iframe title="Matriz de priorização do Space Jam" loading="lazy" width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?embedMode=view_only_without_ui&moveToViewport=1162%2C8496%2C1930%2C2082&embedId=290614433109" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>
  </div>
</details>


### 10.2.6 Priorização dos Requisitos Não Funcionais
 
Os 18 requisitos não funcionais do catálogo (10.1.2) foram classificados em quatro grupos, de acordo com o papel de cada um na primeira versão do produto. A classificação indica quais RNFs precisam estar atendidos e verificados no MVP, quais acompanham os requisitos funcionais do MVP, quais evoluem nas versões seguintes e quais ficam fora do escopo inicial.
 
**Critérios de classificação**
 
| Grupo | Critério | Tratamento no MVP |
| :--- | :--- | :--- |
| **Obrigatórios para o MVP** | RNF de escopo global ou de proteção de dados e controle de acesso, que orienta decisões de arquitetura e precisa estar atendido desde a primeira versão. | Verificado no produto como um todo, conforme o DoD. |
| **Associados a RFs do MVP** | RNF que restringe diretamente um ou mais RFs do MVP e entra na versão junto com eles. | Verificado nos critérios de aceitação dos RFs relacionados. |
| **Evolutivos** | RNF que o MVP atende de forma básica, com meta completa e verificação mensurável nas versões seguintes. | Sem verificação formal da meta no MVP; a evolução é registrada no backlog. |
| **Não aplicáveis ao MVP** | RNF cujo atendimento não é exigido na primeira versão. | Não verificado no MVP; permanece no catálogo para versões futuras. |
 

A classificação de cada RNF é mantida no seu [registro](requisitos_nao_funcionais.md), sem outra lista de manutenção nesta página.

[Acessar a priorização dos RNFs no Miro](https://miro.com/app/board/uXjVHrFoSVo=/)

<details class="sj-delivery-video-details sj-artifact-preview">
  <summary>Ver priorização dos requisitos não funcionais nesta página</summary>
  <p class="sj-artifact-caption">Artefato de origem no Miro. Correspondência com esta versão documental ainda não confirmada; consulte os registros textuais vinculados.</p>
  <div class="sj-artifact-frame">
    <iframe title="Priorização dos requisitos não funcionais do Space Jam" loading="lazy" width="100%" height="600" src="https://miro.com/app/live-embed/uXjVHrFoSVo=/?embedMode=view_only_without_ui&moveToViewport=5521%2C9626%2C2251%2C1870&embedId=972933933673" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>
  </div>
</details>


### 10.2.7 Definição do MVP

A [página do MVP](mvp.md) explica objetivo, limite e critério do recorte. A seleção de itens é consultada diretamente no [índice de acesso do catálogo](requisitos.md#indice-mvp).

<span id="historico-de-revisao"></span>

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | :---: | :---: | :--- | :--- |
    | 13/10/2026 | 0.4 | Ajuste da priorização MoSCoW (RF01106, RF04803, RF04811), definição da linha de corte do MVP (Must + Should com CT < 3) e unificação do MVP com o mvp.md | Guilherme Ferreira Mendes |
    | 12/10/2026 |0.3| Refinamento das Regras de Negócio. | Guilherme Ferreira Mendes |
    | 12/10/2026 |0.2| Adição dos US(histórias de usuário) e CA(critérios de aceitação), mais as tabelas do Miro. | Guilherme Ferreira Mendes |
    | 11/10/2026 |0.1| Criação e consolidação inicial do Backlog do Produto (RFs, RNFs e RNs). | Guilherme Ferreira Mendes |
