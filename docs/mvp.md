# Mínimo Produto Viável (MVP) — Projeto Space Jam

Este documento define o escopo do **Mínimo Produto Viável (MVP)** para o sistema *Space Jam*, estabelecendo o núcleo essencial de funcionalidades necessárias para disponibilizar a primeira versão funcional da plataforma aos utilizadores (atletas e treinadores).

---

## 1. Visão Geral do MVP

O MVP do Space Jam concentra-se em resolver a dor principal da prescrição e acompanhamento de treinos desportivos de forma remota e assíncrona, garantindo:
1. **Controle de Acesso e Isolamento:** Autenticação segura via perfis (RBAC) e proteção estrita de dados por carteira de alunos (*multi-tenant*).
2. **Ciclo de Treino Essencial:** Cadastro de exercícios, criação de planejamentos de treino, execução pelo atleta com feedback de dificuldade, e submissão/avaliação de vídeos de execução.
3. **Conformidade Básica:** Adequação aos requisitos essenciais de segurança, usabilidade mobile e LGPD.

---

## 2. Requisitos Funcionais do MVP (Classificação MoSCoW)

A seleção dos Requisitos Funcionais (RFs) que compõem o núcleo do MVP foi baseada na priorização **MoSCoW**, focando em itens classificados como **Must Have** (indispensáveis para o funcionamento do produto) e incluindo estrategicamente o item de substituição de mídia como essencial para a experiência inicial.

| **MoSCoW** | **Código** | **Nome** |
| :--- | :--- | :--- |
| Must Have | **RF01101** | Cadastrar usuário |
| Must Have | **RF01102** | Logar usuário |
| Must Have | **RF01104** | Editar informações do perfil |
| Must Have | **RF01107** | Trocar senha |
| Should Have | **RF01208** | Consultar dificuldade |
| Must Have | **RF01209** | Registrar dificuldade |
| Must Have | **RF01210** | Editar dificuldade |
| Should Have | **RF01211** | Editar status exercícios |
| Must Have | **RF02301** | Cadastrar planejamento |
| Must Have | **RF02302** | Editar planejamento |
| Should Have | **RF02304** | Consultar histórico de planejamento |
| Must Have | **RF02306** | Consultar status de treino |
| Must Have | **RF02407** | Cadastrar exercício |
| Must Have | **RF02410** | Documentar erros e orientações |
| Must Have | **RF02412** | Cadastrar informações complementares do vídeo base |
| Must Have | **RF03501** | Enviar vídeo de execução |
| Must Have | **RF03502** | Substituir vídeo enviado |
| Must Have | **RF03601** | Registrar feedback |
| Must Have | **RF03602** | Editar feedback |
| Should Have | **RF04701** | Consultar atletas acompanhados |
| Must Have | **RF04802** | Consultar próprios dados cadastrais |
| Should Have | **RF04803** | Consultar próprios resultados de testes |
| Should Have | **RF04804** | Consultar próprios vídeos enviados |
| Must Have | **RF04805** | Consultar vídeos de atleta acompanhado |
| Must Have | **RF04806** | Consultar feedback recebido |
| Should Have | **RF04807** | Consultar próprio histórico de treinos |
| Should Have | **RF04808** | Consultar próprios objetivos |
| Should Have | **RF04809** | Consultar próprio planejamento de treinos |
| Must Have | **RF04810** | Consultar perfil de atleta acompanhado |
| Must Have | **RF04811** | Consultar resultados de testes de atleta acompanhado |

---

## 3. Requisitos Não Funcionais (RNFs) Essenciais para o MVP

Para que o MVP entregue uma experiência estável, segura e em conformidade legal, os seguintes Requisitos Não Funcionais são mandatórios nesta primeira versão:

### Obrigatórios para o MVP
* **RNF01:** Responsividade Mobile
* **RNF02:** Arquitetura e Stack Tecnológica (React, Django, PostgreSQL)
* **RNF03:** Estabilidade em Navegadores Padrão
* **RNF05:** Proteção e Privacidade de Dados (LGPD)
* **RNF09:** Controle de Acesso Baseado em Funções (RBAC)
* **RNF10:** Isolamento Multi-inquilino de Dados
* **RNF17:** Consentimento de Cookies
### Associados a RFs do MVP

* **RNF06:** Compatibilidade de Vídeo
* **RNF12:** Integridade na Catalogação de Exercícios
* **RNF14:** Restrição de Duração (60s) e Tamanho (100MB) de Mídias  
* **RNF16:** Gerenciamento Pré-Envio de Mídia
---

