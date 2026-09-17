# 2. Solução Proposta


## 2.1 Objetivo Geral do Produto


O objetivo geral do produto é tornar mais eficiente o acompanhamento individual dos atletas de Lucas, por meio de uma aplicação web responsiva capaz de centralizar informações de perfil, resultados de testes, planejamento, exercícios, treinos e histórico de evolução.

A solução busca reduzir a dispersão das informações utilizadas no acompanhamento dos atletas, facilitando o acesso aos dados relevantes para o treinador e permitindo que cada atleta consulte seus exercícios, orientações e histórico de forma organizada.

Como recurso complementar aos encontros presenciais, a solução também permitirá o envio privado e opcional de vídeos vinculados aos exercícios, possibilitando que o treinador forneça feedback individualizado ao atleta. Esse recurso não tem como objetivo substituir a análise presencial do treinador, mas complementar o acompanhamento realizado durante os treinos.

Dessa forma, o produto pretende oferecer um ambiente único para organização, acompanhamento e comunicação entre treinador e atleta, respeitando as particularidades e necessidades individuais de cada usuário.


A figura a seguir representa exclusivamente o cenário futuro apoiado pela solução proposta,
mantendo a descrição do cenário atual restrita à Seção 1.


![Rich Picture do cenário futuro apoiado pela solução proposta](imagens/rich_picture_cenario_futuro.png)


*Figura 3 — Rich Picture do cenário futuro apoiado pela solução proposta.*


## 2.2 Objetivos Específicos (OE) do Produto


- **OE1 — Centralizar as informações dos atletas:** Reduzir a dispersão dos dados de perfil, testes, planejamento e treinos, tornando mais eficiente a consulta do histórico e a comparação da evolução de cada atleta.


- **OE2 — Apoiar a organização dos treinamentos:** disponibilizar de forma estruturada informações sobre objetivos, histórico de lesões, resultados de testes, exercícios e orientações específicas, auxiliando o treinador na organização e adaptação dos treinamentos. A decisão sobre a adaptação do treinamento permanecerá sob responsabilidade do treinador, não sendo objetivo do produto realizar recomendações ou decisões automatizadas.


- **OE3 — Apoiar a comunicação e o feedback individual:** Oferecer, como recurso complementar, um fluxo rastreável entre exercício, vídeo enviado e feedback privado.


- **OE4 — Preservar a privacidade das informações:** Preservar a privacidade dos dados, vídeos e orientações individuais de cada atleta.


## 2.3 Características do Produto

As características apresentadas a seguir foram definidas considerando os objetivos específicos do produto e as necessidades identificadas no contexto do cliente.

| OE principal | ID | Contribuição secundária | Característica do Produto | Descrição resumida | Valor de negócio principal |
|---|---|---|---|---|---|
| OE1 | CP1 | OE2 | Gestão das informações do atleta | Centralizar informações de perfil, objetivos, histórico de lesões e resultados de testes de cada atleta. | Facilitar o acesso, a organização e a consulta das informações individuais. |
| OE1 | CP2 | OE2 | Acompanhamento da evolução | Reunir informações históricas de testes e treinos para apoiar a consulta da evolução individual dos atletas. | Apoiar a análise da trajetória de desempenho ao longo do tempo. |
| OE2 | CP3 | OE1 | Planejamento e acompanhamento dos treinos | Apoiar o registro, a organização e a consulta do planejamento e dos treinos realizados pelos atletas. | Facilitar o acompanhamento da rotina e do planejamento de treinamento. |
| OE2 | CP4 | OE1 | Biblioteca de exercícios | Organizar exercícios por objetivos e fundamentos, incluindo orientações, erros comuns e materiais demonstrativos. | Facilitar a seleção, organização e compreensão dos exercícios. |
| OE3 | CP5 | OE4 | Envio privado de vídeos | Permitir que o atleta envie, de forma opcional, um vídeo relacionado à execução de um exercício. | Criar um canal complementar de acompanhamento remoto. |
| OE3 | CP6 | OE4 | Feedback privado do treinador | Permitir que o treinador registre um feedback vinculado ao vídeo e ao exercício enviado pelo atleta. | Melhorar a comunicação e o acompanhamento entre treinador e atleta. |
| OE4 | CP7 | OE3 | Perfis distintos de acesso | Diferenciar os acessos e permissões entre treinador e atleta. | Garantir que cada usuário visualize somente as informações pertinentes ao seu perfil. |
| OE4 | CP8 | OE1 | Privacidade de dados, vídeos e feedbacks | Restringir o acesso aos dados, vídeos e feedbacks individuais de cada atleta. | Proteger a confidencialidade das informações armazenadas. |

### Escopo inicial do produto

Nesta etapa do projeto, foram identificadas como capacidades prioritárias da solução a gestão das informações dos atletas, o planejamento e acompanhamento dos treinos, a biblioteca de exercícios, o acompanhamento da evolução e os mecanismos de comunicação e feedback individual.

A definição definitiva do MVP, incluindo as funcionalidades que serão efetivamente implementadas na primeira versão, será realizada nas etapas posteriores do projeto, após o detalhamento dos requisitos, a validação com o cliente e a definição dos critérios de aceitação e validação.

Entre as possibilidades consideradas para a solução estão o gerenciamento do perfil dos atletas, registro de testes, planejamento individual, organização de exercícios, histórico de treinos e comunicação entre treinador e atleta.

Funcionalidades mais complexas, como análise automática de vídeo, ranking por frequência ou qualidade observada, métricas avançadas, suporte a turmas e expansão para outras modalidades esportivas, não fazem parte da definição inicial  da solução e poderão ser avaliadas posteriormente, caso sejam identificadas como necessidades relevantes e viáveis.


## 2.4 Tecnologias a Serem Utilizadas

A solução será desenvolvida como uma aplicação web responsiva, acessível por computadores, smartphones e tablets. A interface deverá se adaptar a diferentes tamanhos de tela, considerando os diferentes contextos de utilização dos usuários.

O treinador poderá utilizar computadores e smartphones para gerenciamento dos atletas, consulta das informações, organização do planejamento, acompanhamento dos treinos e comunicação com os atletas. Para os atletas, o smartphone será considerado o principal dispositivo de acesso, especialmente para consulta de exercícios, orientações, planejamento e, caso a funcionalidade seja validada, envio de vídeos relacionados aos exercícios.

Para o desenvolvimento da interface, propõe-se a utilização do **React**, permitindo a construção de componentes reutilizáveis e de uma interface organizada e responsiva.

No desenvolvimento do back-end, será utilizada a linguagem **Python**, responsável pela implementação das regras de negócio, gerenciamento das requisições, autenticação dos usuários e comunicação com o banco de dados. A definição do framework a ser utilizado em Python poderá ser realizada durante a etapa de implementação, considerando as necessidades do projeto e o conhecimento técnico da equipe.

Para o armazenamento dos dados, será utilizado o **PostgreSQL**, um banco de dados relacional que permitirá estruturar informações referentes aos atletas, testes, exercícios, planejamentos, treinos, vídeos e feedbacks.

Caso o compartilhamento de vídeos seja validado e incorporado à solução, os arquivos de mídia deverão ser armazenados separadamente dos dados estruturados da aplicação, utilizando uma solução apropriada de armazenamento de arquivos. A definição da tecnologia específica deverá considerar fatores como custo, capacidade disponível, segurança, integração com a aplicação e facilidade de gerenciamento.

Também deverão ser definidos, antes da implementação definitiva desse recurso, aspectos relacionados a:

- tamanho máximo dos arquivos;
- duração máxima dos vídeos;
- formatos de arquivo aceitos;
- mecanismos de autenticação e controle de acesso;
- políticas de exclusão dos arquivos;
- período de retenção dos vídeos;
- custos de armazenamento;
- regras de acesso aos conteúdos individuais;
- necessidade de consentimento para o armazenamento e compartilhamento dos vídeos;
- procedimentos aplicáveis ao acesso de responsáveis, quando houver atletas menores de idade.

O controle de versão do projeto será realizado utilizando **Git**, possibilitando o desenvolvimento colaborativo, o acompanhamento das alterações e a organização do código produzido pela equipe.

A aplicação também contará com mecanismos de **autenticação e controle de acesso**, diferenciando as permissões entre treinador e atleta. Dessa forma, cada atleta poderá acessar suas próprias informações, enquanto o treinador terá acesso aos dados dos atletas sob seu acompanhamento.

A escolha das tecnologias considera a necessidade de desenvolver uma solução funcional dentro do prazo da disciplina, utilizando ferramentas compatíveis com o conhecimento técnico da equipe e que permitam futuras evoluções do produto.






## 2.5 Pesquisa de Mercado e Análise Competitiva


Foram analisadas plataformas voltadas para treinamento esportivo, basquete, acompanhamento de atletas e feedback por vídeo. A análise tem como objetivo identificar capacidades presentes em soluções existentes e comparar essas capacidades com as características previstas para o produto proposto.

As plataformas analisadas foram **HomeCourt**, **Onform** e **TrainHeroic**.

A comparação deverá considerar critérios comuns às soluções analisadas, evitando comparar funcionalidades isoladas ou utilizar características presentes em apenas uma plataforma como único parâmetro de avaliação.



| Critério | HomeCourt | Onform | TrainHeroic | Produto proposto |
|---|---|---|---|---|
| Foco em basquete | Sim | Não | Não | Sim |
| Acompanhamento individual | Sim | Sim | Sim | Sim |
| Organização de treinos | Sim | Parcial | Sim | Sim |
| Biblioteca de exercícios | Sim | Não é o foco | Sim | Sim |
| Vídeos demonstrativos | Sim | Sim | Sim | Sim |
| Compartilhamento/análise de vídeos | Sim | Sim | Sim | A validar |
| Feedback individual | Sim | Sim | Sim | A validar |
| Histórico e acompanhamento | Sim | Sim | Sim | Sim |
| Personalização segundo o método do treinador | Não é o foco principal | Não é o foco principal | Não é o foco principal | Sim |
| Integração entre perfil, testes, planejamento e histórico | Parcial | Parcial | Parcial | Sim |

A análise das plataformas indica que existem soluções que oferecem recursos relacionados ao treinamento esportivo, exercícios, acompanhamento individual e vídeo. Entretanto, a proposta deste produto está direcionada ao contexto específico do acompanhamento realizado por Lucas, buscando centralizar informações de perfil, testes, planejamento, exercícios e histórico em um mesmo ambiente.


## 2.6 Viabilidade da Proposta

A proposta é considerada viável no contexto da disciplina, principalmente devido à possibilidade de delimitação do escopo e priorização das funcionalidades essenciais para a construção de um MVP funcional.

O produto possui uma estrutura que pode ser dividida em módulos relativamente independentes, como cadastro de atletas, exercícios, testes, planejamento, histórico e comunicação por vídeo. Essa divisão permite que a equipe desenvolva e valide as funcionalidades de maneira incremental.

As tecnologias propostas são amplamente utilizadas no desenvolvimento de aplicações web, o que reduz os riscos relacionados à implementação. Além disso, a arquitetura proposta permite que funcionalidades mais complexas sejam deixadas para etapas futuras sem comprometer o funcionamento do MVP.

Outro fator favorável é a possibilidade de contato com o cliente durante o desenvolvimento. A participação do treinador permitirá validar se as funcionalidades desenvolvidas correspondem ao seu método de trabalho e às necessidades dos atletas.

O principal risco está relacionado ao prazo da disciplina, especialmente no desenvolvimento do fluxo de vídeos e no gerenciamento adequado dos dados. Por esse motivo, funcionalidades de maior complexidade, como análise automática de vídeos, métricas avançadas, rankings e suporte a múltiplas turmas, foram explicitamente mantidas fora do MVP.

Considerando o escopo definido, as tecnologias propostas, a possibilidade de contato com o cliente e a priorização das funcionalidades essenciais, a equipe considera possível entregar um MVP funcional ao final do semestre.


## 2.7 Benefícios Esperados

### 2.7.1 Benefícios para o cliente

A implementação da solução deverá proporcionar ao treinador os seguintes benefícios:

- **Centralização das informações:** reunir perfil, testes, planejamento, exercícios e histórico dos atletas em um único ambiente.

- **Redução da dispersão dos dados:** diminuir a necessidade de consultar diferentes meios para localizar informações relacionadas a cada atleta.

- **Maior eficiência no acompanhamento:** facilitar a consulta do histórico e dos resultados obtidos ao longo do tempo.

- **Apoio à tomada de decisão:** disponibilizar informações organizadas que auxiliem na adaptação dos treinamentos às necessidades individuais.

- **Melhor organização dos exercícios:** permitir a criação e manutenção de uma biblioteca estruturada de exercícios, instruções e vídeos demonstrativos.

- **Maior rastreabilidade:** relacionar exercícios, vídeos enviados e feedbacks realizados pelo treinador.

- **Melhoria na comunicação com os atletas:** disponibilizar orientações e feedbacks individuais de forma organizada e privada.

- **Possibilidade de evolução futura:** estabelecer uma base que poderá receber novas funcionalidades conforme as necessidades do treinador e dos atletas.

### 2.7.2 Benefícios para os usuários

Para os **atletas**, espera-se que o produto proporcione:

- acesso facilitado aos exercícios e orientações;
- consulta do planejamento individual;
- visualização do próprio histórico de treinos e resultados;
- maior compreensão dos exercícios por meio de vídeos demonstrativos;
- possibilidade de enviar vídeos para avaliação do treinador;
- recebimento de feedback individualizado;
- maior organização das informações relacionadas ao próprio treinamento;
- maior privacidade dos dados, vídeos e feedbacks.

Para o treinador, além dos benefícios relacionados à organização das informações, espera-se uma redução do esforço necessário para localizar dados individuais e acompanhar a evolução dos atletas.

De maneira geral, o produto deverá contribuir para um acompanhamento mais organizado, individualizado e rastreável, funcionando como uma ferramenta de apoio ao trabalho presencial do treinador, sem substituir sua avaliação profissional durante os treinos.


## Histórico de Versão

| Data | Versão | Descrição | Autor |
| --- | --- | --- | --- |
| 07/09/2026 | 0.2 | Adequação da comunicação e da validação às decisões registradas na reunião da equipe. | Paulo Sergio Rabelo Santana Rios |
| 07/09/2026 | 0.1 | Elaboração inicial da seção de solução proposta. | Júlia Amanda Silva Lima |


