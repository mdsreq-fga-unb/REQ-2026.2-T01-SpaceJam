# Space Jam no Dia a Dia: Como a Aplicação Web Vai Funcionar na Prática

**Representação Informal dos Requisitos Operacionais, de Usabilidade e de Acompanhamento (Visão do Cliente)**

Este documento apresenta, de forma simples e visual, como as funcionalidades do dia a dia do aplicativo **Space Jam** vão ajudar na rotina de treinos em quadra e fora dela. Enquanto as regras mais sensíveis (como segurança, privacidade de menores e controle de acesso) exigem especificações técnicas rigorosas, as funcionalidades descritas aqui focam na facilidade de uso, na organização dos exercícios e na comunicação clara entre treinador e atleta — substituindo anotações soltas no caderno, no Samsung Notes, no Word e em conversas misturadas no WhatsApp.

---

## 1. Visão Geral por Áreas (Mapa de Afinidades) {#1-visao-geral-por-areas}

### Área A · Biblioteca de Exercícios (Seu Acervo Técnico Organizado)

* **Cadastro estruturado:** Inclusão de exercícios contendo vídeo demonstrativo, imagem de capa (*thumbnail*), descrição curta e alertas destacados sobre os principais erros comuns de execução.
* **Busca e filtros eficientes:** Localização rápida por objetivo do treino (ex.: arremesso, drible, defesa), fundamento técnico ou material necessário (ex.: bola, cones, escada de agilidade).
* **Consulta em quadra:** Acesso direto pelo atleta no celular para relembrar a execução correta do movimento antes ou durante o treino.

### Área B · Rotina e Prescrição de Treinos (Do Planejamento à Execução)

* **Montagem personalizada:** Criação de rotinas combinando exercícios da biblioteca, quantidade de séries, repetições e orientações específicas para cada atleta.
* **Painel do atleta:** Visualização clara no dispositivo móvel, organizando o que precisa ser feito no dia (*"A fazer"*) e o que já foi finalizado (*"Concluído"*).
* **Ajuste técnico:** Opção para o treinador devolver um exercício marcado como *"Corrigir / Refazer"* quando a execução necessitar de readequação técnica.

### Área C · Diário de Evolução e Percepção do Atleta (Comunicação sem Ruído)

* **Escala de percepção de esforço:** Ao concluir uma atividade, o atleta registra o nível de dificuldade em uma escala simples de $1$ (muito fácil) a $5$ (muito difícil).
* **Relato de treino:** Espaço dedicado para o atleta dar uma nota de $1$ a $5$ da dificuldade que sentiu ao realizar o treino e registrar observações sobre a execução.
* **Envio de mídia:** Envio de vídeo curto gravado pelo celular para tirar dúvidas de execução, com total liberdade para trocar ou excluir o arquivo antes do feedback do treinador, caso tenha enviado a gravação errada.

### Área D · Perfil do Atleta e Histórico Consolidado (Tudo em um Só Lugar)

* **Ficha unificada:** Cadastro completo contendo dados pessoais (nome, apelido, contato, altura, peso, envergadura e foto) e objetivos esportivos (ex.: preparação para atuar nas posições 3 ou 4).
* **Gestão compartilhada:** O atleta mantém seus dados básicos e medidas atualizadas, enquanto o treinador registra os objetivos táticos e observações de quadra.
* **Linha do tempo contínua:** Registro histórico centralizado de treinos concluídos, dificuldades relatadas e evolução técnica ao longo das semanas.

---

## 2. Histórias do Dia a Dia (Cenários Narrativos de Uso) {#2-historias-do-dia-a-dia}

### Cenário 1 · Preparando o treino da semana sem retrabalho

> *"Na segunda-feira à noite, o treinador Lucas abre o Space Jam no celular para montar o treino semanal de um de seus atletas. Em vez de procurar links antigos no YouTube ou reescrever explicações no WhatsApp, Lucas filtra sua Biblioteca de Exercícios pelo fundamento 'Arremesso após drible', seleciona três exercícios que já possuem vídeos-base e lista os erros comuns que o atleta deve evitar. Em poucos minutos, o treino está montado e disponível na tela do atleta."*

### Cenário 2 · Treinando na quadra e registrando como foi

> *"Na quarta-feira à tarde, o atleta vai à quadra treinar sozinho. Pelo celular, ele abre a lista de exercícios do dia, assiste ao vídeo curto de demonstração para confirmar a postura correta e executa as séries. Ao terminar, marca o treino como 'Concluído' e seleciona dificuldade 4 (pois exigiu bastante fôlego). Tudo fica salvo automaticamente no histórico."*

### Cenário 3 · Enviando um vídeo de dúvida e trocando antes da correção

> *"Em um exercício de controle de bola, o atleta pede para um amigo gravar sua execução. Ao anexar o vídeo no aplicativo, percebe que selecionou a gravação em que a bola escapou logo no início. Como o treinador Lucas ainda não avaliou aquele envio, o próprio atleta exclui o arquivo errado e sobe o vídeo certo. Mais tarde, Lucas assiste ao vídeo direto no exercício correspondente e deixa uma dica prática de ajuste de base, sem que a mensagem se perca no meio de outras conversas."*

---

## 3. Passo a Passo da Experiência (Storyboard Descritivo) {#3-passo-a-passo-da-experiencia}

| Etapa | O que acontece na prática | Quem participa |
| :--- | :--- | :--- |
| **Quadro 1: Prescrição do Treino** | O treinador escolhe exercícios da biblioteca e monta a sessão personalizada do atleta. | Treinador |
| **Quadro 2: Consulta na Quadra** | O atleta abre o celular, vê os exercícios do dia, lê as dicas de erros comuns e assiste ao vídeo-base. | Atleta |
| **Quadro 3: Execução e Relato** | Após treinar, o atleta marca o exercício como concluído, dá uma nota de dificuldade ($1$ a $5$) e escreve como se sentiu. | Atleta |
| **Quadro 4: Envio de Vídeo** | O atleta grava sua execução e anexa o vídeo no exercício; se errar o arquivo antes da avaliação, pode substituir. | Atleta |
| **Quadro 5: Dica e Retorno Técnico** | O treinador assiste ao vídeo, lê o relato do atleta e envia um comentário orientando ajustes (ou pede para refazer). | Treinador |
| **Quadro 6: Histórico de Evolução** | Treinos concluídos, notas de dificuldade e orientações ficam organizados em linha do tempo. | Treinador e Atleta |

---

## 4. Como as Telas Vão se Organizar (Esboços Conceituais) {#4-como-as-telas-vao-se-organizar}

### Tela 1 · Visão do Treinador (Painel de Acompanhamento do Atleta)

* **Cabeçalho:** Foto do atleta | Nome / Apelido | Idade | Objetivo Técnico: *"Atuar nas posições 3 ou 4"*
* **Navegação Principal:** `[Treinos Prescritos]` | `[Biblioteca de Exercícios]` | `[Vídeos para Avaliar]` | `[Ficha do Atleta]`
* **Bloco Central:**
  * Lista de Treinos Recentes (Ex.: *Treino A — Controle de Bola e Arremesso*)
  * Status Visual: `[Concluído]` | Dificuldade Informada: $4/5$
  * Botão de Ação Rápida: `[+ Novo Treino]`

### Tela 2 · Visão do Atleta (Meu Treino do Dia)

* **Cabeçalho:** *"Olá, Atleta! Você concluiu 3 de 4 treinos esta semana."*
* **Cartão do Exercício:**
  * **Nome:** Arremesso após drible com mudança de direção
  * **Recursos:** `[Ver vídeo de demonstração]`
  * **Alerta de Erros Comuns:** *"Evite projetar o cotovelo para fora durante a elevação."*
  * **Prescrição:** 4 séries de 12 repetições
* **Área de Ações do Atleta:**
  * `[ Marcar como Concluído ]`
  * Seletor de Dificuldade: `(1) (2) (3) [4] (5)`
  * Campo de Texto: *"Como foi o treino?"*
  * Anexo: `[ Enviar vídeo da minha execução ]`

---

## 5. O Que Fica para a Próxima Etapa (Evolução Após o Lançamento Inicial) {#5-o-que-fica-para-a-proxima-etapa}

### Foco da Primeira Entrega (MVP)

Garantir que todo o ciclo essencial funcione perfeitamente no celular e no computador: biblioteca de exercícios, prescrição de treinos, registro de conclusão e dificuldade, envio de vídeos e dicas privadas do treinador.

### Melhorias Planejadas para a Próxima Fase

* **Módulo de Testes Físicos Periódicos:** Espaço dedicado para registrar e comparar avaliações físicas ao longo do tempo (como altura do salto vertical / *jump height*, agilidade e resistência), substituindo as anotações manuais em fichas físicas.
* **Comparação Avançada de Treinos:** Painéis comparativos e gráficos de evolução entre diferentes períodos de treinamento.
* **Recursos Avançados de Acessibilidade:** Ajustes complementares na interface com base no retorno direto dos atletas após os primeiros testes reais de uso em quadra.

---

## 6. Rastreabilidade Interna (Para Evidência de Engenharia de Requisitos) {#6-rastreabilidade-interna}

| Seção deste Documento | Técnicas de Representação Informal Utilizadas | Grupos de Requisitos Relacionados |
| :--- | :--- | :--- |
| **1. Visão Geral por Áreas** | Mapa de Afinidades e Agrupamento Conceitual | [CP1](requisitos.md#cp1) (Perfil Básico), [CP2](requisitos.md#cp2) (Evolução), [CP3](requisitos.md#cp3) (Treinos), [CP4](requisitos.md#cp4) (Biblioteca), [CP5](requisitos.md#cp5)/[CP6](requisitos.md#cp6) (Vídeos e Feedback) |
| **2. Histórias do Dia a Dia** | Narrativas Descritivas e Cenários de Uso | [RF1104](requisitos.md#RF1104), [RF2410](requisitos.md#RF2410), [RF2412](requisitos.md#RF2412), [RF2301](requisitos.md#RF2301), [RF3501](requisitos.md#RF3501), [RF3502](requisitos.md#RF3502), [RF3601](requisitos.md#RF3601) |
| **3. Passo a Passo da Experiência** | Storyboard Descritivo | Fluxo operacional completo do MVP ([RN06](regras_negocio.md#rn06), [RN07](regras_negocio.md#rn07), [RNF04](requisitos_nao_funcionais.md#rnf04)) |
| **4. Como as Telas Vão se Organizar** | Mockups Conceituais Estruturados | Responsividade Mobile ([RNF02](requisitos_nao_funcionais.md#rnf02)) e Usabilidade |
| **5. O Que Fica para a Próxima Etapa** | Alinhamento de Escopo e Roadmap | Módulo de Testes Físicos ([RF1212](requisitos.md#RF1212), [RF1213](requisitos.md#RF1213), [RF4803](requisitos.md#RF4803), [RF4811](requisitos.md#RF4811)) e [RF2305](requisitos.md#RF2305) |

---

## Histórico de Revisão {#historico-de-revisao}

| Data | Versão | Descrição |
| :--- | :---: | :--- |
| 15/11/2026 | 1.0 | Criação da Representação Informal dos Requisitos Operacionais e de Usabilidade (Mapa de Afinidades, Cenários Narrativos, Storyboard Descritivo e Mockups Conceituais) voltada para validação e entendimento do cliente Lucas Cordeiro. |