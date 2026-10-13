# Mínimo Produto Viável (MVP) — Projeto Space Jam

Este documento é a **definição única do escopo do MVP** do sistema *Space Jam*: o núcleo de funcionalidades necessárias para disponibilizar a primeira versão funcional da plataforma aos utilizadores (atletas e treinadores). O item 10.2.7 do [Backlog](backlog.md) apenas resume a linha de corte e aponta para esta página.

---

## 1. Visão Geral do MVP

O MVP do Space Jam concentra-se em resolver a dor principal da prescrição e acompanhamento de treinos desportivos de forma remota e assíncrona, garantindo:
1. **Controle de Acesso e Isolamento:** Autenticação segura via perfis (RBAC), com criação de senha provisória no primeiro acesso, troca obrigatória de senha e encerramento de sessão (*logout*), e proteção estrita de dados por carteira de alunos (*multi-tenant*).
2. **Ciclo de Treino Essencial:** Cadastro de exercícios, criação de planejamentos de treino, execução pelo atleta com feedback de dificuldade, e submissão/avaliação de vídeos de execução.
3. **Conformidade Básica:** Adequação aos requisitos essenciais de segurança, usabilidade mobile e LGPD.

---

## 2. Linha de Corte do MVP

Os requisitos funcionais foram priorizados pela técnica **MoSCoW** (valor de negócio) e pela **Complexidade Técnica (CT)**, calculada como a média das avaliações de esforço técnico da equipe. A linha de corte do MVP é:

> **MVP = todos os requisitos *Must Have* + os requisitos *Should Have* com CT menor que 3.**

| MoSCoW | Entra no MVP? | Critério |
| :--- | :--- | :--- |
| **Must Have** | Sim, todos | Indispensáveis ao funcionamento do produto, independentemente do esforço. |
| **Should Have** | Somente com CT < 3 | Alto valor com baixo esforço (quadrante Q1 da matriz 2×2). |
| **Should Have** | Não, com CT ≥ 3 | RF02305 (Comparar treinamentos, CT 3,08) e RF03604 (Notificar atleta sobre feedback, CT 3,00) ficam para a versão seguinte. |
| **Could Have** | Não | Desejáveis, entram se houver capacidade nas versões seguintes. |
| **Won't Have** | Não | Fora do escopo desta fase. |

**Decisões de escopo registradas:**
* **Logout (RF01103) e criação de senha aleatória (RF01106)** são *Must Have*. O RF01107 (trocar senha no primeiro acesso) depende do RF01106, portanto ambos entram juntos.
* **Resultados de testes:** a consulta dos próprios resultados (RF04803) é *Won't Have*, pois o registro de testes (RF01213 e RF01214) também está fora do escopo. A consulta de resultados de atleta acompanhado (RF04811) é *Could Have* pelo mesmo motivo.
* **Vídeo de execução e feedback** (RF03501, RF03502, RF03601, RF03602, RF04805 e RF04806) são *Must Have*: fazem parte do ciclo essencial do MVP.

---

## 3. Requisitos Funcionais do MVP

São **30 requisitos** (22 *Must Have* e 8 *Should Have*), agrupados por Característica de Produto (CP). A coluna CT traz a complexidade técnica usada na linha de corte.

| **CP** | **MoSCoW** | **Código** | **Nome** | **CT** |
| :--- | :--- | :--- | :--- | :--- |
| CP1 | Must Have | **RF01101** | Cadastrar usuário | 2,33 |
| CP1 | Must Have | **RF01102** | Logar usuário | 1,67 |
| CP1 | Must Have | **RF01103** | Deslogar usuário | 1,17 |
| CP1 | Must Have | **RF01104** | Editar informações do perfil | 2,25 |
| CP1 | Must Have | **RF01106** | Criar senha aleatória | 2,17 |
| CP1 | Must Have | **RF01107** | Trocar senha | 1,83 |
| CP2 | Should Have | **RF01208** | Consultar dificuldade | 2,25 |
| CP2 | Must Have | **RF01209** | Registrar dificuldade | 2,50 |
| CP2 | Must Have | **RF01210** | Editar dificuldade | 2,75 |
| CP2 | Should Have | **RF01211** | Editar status exercícios | 2,17 |
| CP3 | Must Have | **RF02301** | Cadastrar planejamento | 2,67 |
| CP3 | Must Have | **RF02302** | Editar planejamento | 2,75 |
| CP3 | Should Have | **RF02304** | Consultar histórico de planejamento | 1,83 |
| CP3 | Must Have | **RF02306** | Consultar status de treino | 2,50 |
| CP4 | Must Have | **RF02407** | Cadastrar exercício | 1,75 |
| CP4 | Must Have | **RF02410** | Documentar erros e orientações | 3,00 |
| CP4 | Must Have | **RF02412** | Cadastrar informações complementares do vídeo base | 2,00 |
| CP5 | Must Have | **RF03501** | Enviar vídeo de execução | 3,75 |
| CP5 | Must Have | **RF03502** | Substituir vídeo enviado | 3,75 |
| CP6 | Must Have | **RF03601** | Registrar feedback | 2,67 |
| CP6 | Must Have | **RF03602** | Editar feedback | 2,67 |
| CP7 | Should Have | **RF04701** | Consultar atletas acompanhados | 2,42 |
| CP8 | Must Have | **RF04802** | Consultar próprios dados cadastrais | 1,83 |
| CP8 | Should Have | **RF04804** | Consultar próprios vídeos enviados | 2,67 |
| CP8 | Must Have | **RF04805** | Consultar vídeos de atleta acompanhado | 2,75 |
| CP8 | Must Have | **RF04806** | Consultar feedback recebido | 2,67 |
| CP8 | Should Have | **RF04807** | Consultar próprio histórico de treinos | 2,58 |
| CP8 | Should Have | **RF04808** | Consultar próprios objetivos | 2,42 |
| CP8 | Should Have | **RF04809** | Consultar próprio planejamento de treinos | 2,33 |
| CP8 | Must Have | **RF04810** | Consultar perfil de atleta acompanhado | 2,42 |

### Requisitos fora do MVP

| **MoSCoW** | **Código** | **Nome** | **Motivo** |
| :--- | :--- | :--- | :--- |
| Should Have | **RF02305** | Comparar treinamentos | CT 3,08 (≥ 3) |
| Should Have | **RF03604** | Notificar atleta sobre feedback | CT 3,00 (≥ 3) |

Os demais requisitos *Could Have* e *Won't Have* do catálogo (10.1.1 do [Backlog](backlog.md)) também ficam fora desta versão.

---

## 4. Requisitos Não Funcionais (RNFs) Essenciais para o MVP

Para que o MVP entregue uma experiência estável, segura e em conformidade legal, os seguintes Requisitos Não Funcionais são mandatórios nesta primeira versão. A classificação completa dos 18 RNFs está no item 10.2.6 do [Backlog](backlog.md).

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