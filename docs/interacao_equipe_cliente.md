# 7. Interação entre Equipe e Cliente

Esta seção apresenta como a equipe organiza o trabalho, mantém a comunicação com o cliente e registra as decisões e validações do projeto. A organização acompanha a abordagem híbrida adotada pela equipe, com ciclo de vida iterativo e incremental e processo RAD, preservando a autoria das contribuições e a rastreabilidade entre atividades, artefatos e feedbacks.

## 7.1 Composição e Responsabilidades

A equipe **Stakeholders Anônimos** é composta por seis integrantes:

| Integrante |
| --- |
| Anderson Fernandes da Silva |
| Guilherme Ferreira Mendes |
| Júlia Amanda Silva Lima |
| Luiz Henrique Pessato da Mota |
| Paulo Sergio Rabelo Santana Rios |
| Thiago Alencar de Oliveira |

A distribuição inicial das frentes de trabalho é:

| Frente | Referência | Apoio inicial (rotativo) | Responsabilidade concreta |
| --- | --- | --- | --- |
| Comunicação com o cliente | Júlia | Paulo | Preparar pautas e perguntas, apresentar os artefatos ao cliente e registrar respostas, decisões e pendências. |
| Backlog, prioridades e rastreabilidade | Guilherme | Anderson | Organizar itens, prioridades, dependências e impedimentos; manter as ligações entre objetivos, requisitos, itens do backlog, protótipos, testes e feedbacks. |
| Declaração e revisão de requisitos | Thiago | Guilherme | Revisar as declarações de requisitos, esclarecer ambiguidades e sobreposições e preparar critérios de aceitação com a equipe. |
| Prototipação e design com usuários | Júlia | Luiz | Preparar telas e fluxos, apresentar ao cliente e aos usuários envolvidos e registrar os ajustes decorrentes da validação. |
| Arquitetura | Luiz | Anderson | Propor e documentar componentes, dados, integrações, permissões e decisões técnicas; revisar a proposta com a equipe antes da implementação. |
| Qualidade | Anderson | Thiago | Preparar testes e checklists a partir dos critérios de aceitação, revisar as entregas e registrar problemas e correções. |
| Privacidade | Guilherme | Luiz | Revisar permissões de acesso, dados e vídeos utilizados pelo sistema e requisitos de consentimento e proteção das informações. |
| Integração e entrega | Paulo | Júlia | Consolidar as mudanças e conferir testes, navegação, documentação e funcionamento integrado antes de preparar cada entrega. |

A pessoa de referência acompanha e organiza a frente; o trabalho permanece compartilhado. O responsável por executar cada atividade pode ser outro integrante e deve constar no item do GitHub Projects, com data prevista, estado e artefatos relacionados.

No início de cada iteração, a equipe revisará a distribuição e trocará os apoios conforme a disponibilidade e o trabalho previsto. O apoio anterior repassará atividades em andamento, evidências e pendências ao novo apoio. As referências também poderão mudar mediante ajuste registrado no quadro e na ata do planejamento.

## 7.2 Organização do Trabalho e Acompanhamento

O trabalho será organizado em ciclos iterativos e incrementais, seguindo as fases do RAD aplicáveis a cada período: planejamento de requisitos, design do usuário, construção e cutover. O GitHub Projects será utilizado para tornar visível o andamento das atividades e apoiar sua distribuição. Os itens serão acompanhados pelos seguintes estados:

1. **A fazer:** atividade priorizada e ainda não iniciada;
2. **Em andamento:** atividade em execução por um responsável identificado;
3. **Em revisão:** conteúdo submetido à análise de outro integrante;
4. **Em validação:** artefato que depende da avaliação do cliente, de atletas ou da orientação da disciplina;
5. **Bloqueado:** item que não pode avançar, acompanhado do motivo do impedimento;
6. **Concluído:** atividade revisada, validada quando necessário e registrada no repositório.

O quadro deve permitir identificar responsáveis, prazos, dependências e impedimentos. A equipe revisará o fluxo semanalmente e poderá ajustar prioridades conforme o feedback recebido e a capacidade disponível.

A equipe utiliza o **RAD**, conforme a [estratégia de desenvolvimento](estrategia.md), e organiza o trabalho por iterações. As frentes acima não correspondem a cargos de Product Owner ou Scrum Master; a equipe não adota os eventos obrigatórios do Scrum.

## 7.3 Comunicação

### Comunicação interna

A equipe realiza uma reunião fixa às **segundas-feiras, às 10h**, pelo Microsoft Teams. Questões pontuais e avisos são tratados de forma assíncrona pelo WhatsApp. A organização dos encontros distingue os seguintes objetivos:

| Atividade | Momento | Objetivo e registro |
| --- | --- | --- |
| Planejamento | Início da iteração, em bloco da reunião da equipe | Escolher o recorte do backlog, definir critérios de aceitação, executores, revisores, apoios e datas previstas. |
| Acompanhamento | Reunião semanal e atualizações assíncronas durante a execução | Conferir progresso, dependências e impedimentos; atualizar o estado das atividades no quadro. |
| Revisão interna | Quando o artefato estiver pronto para revisão, antes de apresentá-lo ou entregá-lo | Conferir escopo, consistência e critérios de aceitação; registrar correções e evidências. |
| Validação | Encontro semanal com Lucas ou retorno pelo WhatsApp, com atletas nos fluxos que lhes dizem respeito | Avaliar se o artefato atende à necessidade do usuário; registrar feedback e decisão vinculados ao item avaliado. |

Planejamento, acompanhamento e revisão poderão ocupar blocos separados do mesmo encontro. A avaliação do cliente e dos atletas terá seu próprio registro de validação.

| Ferramenta | Utilização no projeto |
| --- | --- |
| WhatsApp | Comunicação assíncrona, avisos, agendamentos e alinhamentos rápidos. |
| Microsoft Teams | Reuniões da equipe e encontros síncronos com o cliente. |
| GitHub | Versionamento dos artefatos e registro das contribuições. |
| GitHub Projects | Acompanhamento das atividades, responsáveis, prazos e estados. |
| GitHub Pages | Publicação e atualização da documentação do projeto. |
| [Miro](https://miro.com/app/board/uXjVHrFoSVo=/) | Construção e discussão colaborativa de modelos e artefatos visuais. |

As decisões relevantes devem ser sintetizadas na seção de [Reuniões](reunioes.md), informando decisão, responsáveis, prazos e artefatos afetados. Registros brutos podem apoiar a elaboração da ata, mas não substituem a síntese das decisões.

### Comunicação com o cliente

A equipe mantém reuniões com Lucas Cordeiro às **quintas-feiras à noite**, pelo **Microsoft Teams**, combinando a data e o horário com o cliente alguns dias antes. Entre os encontros, todos os integrantes e Lucas participam de um **grupo de WhatsApp**, onde a equipe envia o trabalho em andamento para que ele avalie, opine e indique ajustes.

Júlia, com o apoio de Paulo, organizará a pauta, os materiais e o registro do retorno. Se o encontro não puder ocorrer, a equipe enviará os artefatos e as perguntas pelo grupo e combinará com Lucas outra data. Os itens que dependem desse retorno permanecerão pendentes de validação.

Em **17/09/2026**, a equipe realizou uma reunião pelo Microsoft Teams com Lucas para aprofundar o diagnóstico do contexto atual e discutir o direcionamento inicial da solução. As atas de [17/09](atas/2026-09-17-lucas.md) e [08/10](atas/2026-10-08-lucas.md), disponíveis em [Reuniões](reunioes.md), registram os assuntos e encaminhamentos desses encontros.

As perguntas devem ser contextualizadas e, quando possível, acompanhadas de protótipos, imagens, fluxos ou exemplos. As respostas relevantes serão associadas ao requisito ou artefato correspondente.

Quando uma decisão afetar diretamente a experiência dos atletas, a validação não ficará restrita ao treinador. A equipe buscará a participação de atletas indicados por Lucas, respeitando privacidade, consentimento para uso de imagem e, no caso de menores de idade, autorização do responsável.

Júlia organizará essa participação com Lucas e com a referência da frente avaliada. A equipe incluirá os atletas na avaliação de navegação móvel, consulta do planejamento e histórico, envio de vídeos, privacidade, linguagem das orientações e acessibilidade. Para avaliar telas e fluxos, utilizará dados fictícios sempre que possível.

### Comunicação com professor e monitor

O monitor Heitor é o principal contato para dúvidas sobre o projeto, orientação das atividades e feedback sobre os artefatos. A equipe solicitará sua revisão **antes de cada entrega** e poderá consultá-lo durante a execução quando houver dúvidas ou impedimentos. Júlia reunirá e encaminhará as questões, com apoio de Paulo e dos responsáveis pelos artefatos envolvidos.

O professor George Marsicano avalia o projeto e o repositório nas **apresentações previstas no calendário da disciplina**. A equipe tratará dúvidas que precisem de sua orientação durante as aulas, quando necessário. Essa rotina não prevê reuniões extras periódicas com o professor.

Na reunião semanal, a equipe verificará os feedbacks recebidos e as questões ainda sem resposta. Guilherme registrará os encaminhamentos nos itens do backlog; a referência de cada frente acompanhará os ajustes correspondentes. Solicitar revisão não garante retorno antes do prazo e não equivale a aprovação.

## 7.4 Processo de Validação

A validação será contínua e acompanhará a evolução dos itens de trabalho. O processo adotado é:

Júlia coordenará a apresentação ao cliente e aos atletas e o registro das decisões. A referência da frente avaliada preparará o material e os critérios de aceitação; Anderson acompanhará a revisão interna. Guilherme manterá os vínculos com o backlog e a rastreabilidade. A equipe identificará no item quem executa os ajustes e quem os revisa.

1. **Preparação:** selecionar o item do backlog, seus RFs/RNFs, fluxo, protótipo ou incremento; identificar o usuário afetado, a versão e os critérios de aceitação que precisam ser avaliados;
2. **Revisão interna:** verificar clareza, consistência e prontidão do material antes de apresentá-lo;
3. **Apresentação:** realizar a validação com Lucas e, quando aplicável, com atletas, de forma síncrona ou assíncrona;
4. **Registro:** documentar data, canal, participantes, item do backlog, versão do artefato, critérios avaliados, feedback e estado da decisão como aprovado, rejeitado ou pendente;
5. **Atualização:** registrar os ajustes, executores e prazos no GitHub Projects e atualizar os vínculos entre objetivos, CPs, RFs/RNFs, declarações de requisitos, protótipos, código, testes e feedbacks que a alteração afetar;
6. **Confirmação:** reapresentar alterações relevantes antes de considerar o item concluído.

A equipe não interpretará ausência de resposta como aprovação. O item permanecerá em validação ou bloqueado, com o motivo registrado, até que o cliente ou o perfil de usuário previsto avalie os critérios. A revisão interna não substitui essa avaliação.

### Evidências de validação

Para cada validação relevante, devem ser preservados, sempre que aplicável:

- data, canal e participantes;
- usuário afetado;
- item do backlog e RFs/RNFs relacionados;
- versão e link do artefato avaliado;
- critérios de aceitação utilizados e resultado de cada critério;
- feedback recebido;
- estado da decisão;
- alteração decorrente;
- responsável pela validação, executor dos ajustes, revisor e prazo;
- referência à ata ou mensagem e ao artefato atualizado.

Júlia registrará o resultado na ata ou na evidência vinculada ao item. Guilherme atualizará o backlog e os vínculos afetados; a referência da frente e Anderson verificarão os ajustes antes da conclusão.

??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | --- | --- | --- | --- |
    | 11/10/2026 | 0.6 | Definição das frentes e apoios rotativos, das rotinas de comunicação e dos responsáveis e registros de validação. | Equipe Space Jam |
    | 19/09/2026 | 0.5 | Alinhamento da organização ao ciclo iterativo e incremental e ao RAD, inclusão do GitHub Projects e registro da reunião com o cliente. | Equipe Space Jam |
    | 14/09/2026 | 0.4 | Adequação da organização do trabalho e da validação, com inclusão da participação de atletas quando aplicável. | Equipe Space Jam |
    | 07/09/2026 | 0.3 | Inclusão do Microsoft Teams como meio para reuniões com o cliente. | Equipe Space Jam |
    | 07/09/2026 | 0.2 | Adequação da comunicação e da validação às decisões registradas na reunião da equipe. | Equipe Space Jam |
    | 07/09/2026 | 0.1 | Elaboração inicial da seção de interação entre equipe e cliente. | Equipe Space Jam |
