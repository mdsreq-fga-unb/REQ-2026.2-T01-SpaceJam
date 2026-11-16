# Requisitos não funcionais

Metas de qualidade e restrições técnicas do produto. Abra um item para consultar a declaração, sua aplicação no MVP e os requisitos relacionados.

[Catálogo funcional](requisitos.md) · [Método de priorização](backlog.md#1026-priorizacao-dos-requisitos-nao-funcionais)

## Condições gerais {#rnfs-gerais}

<p class="sj-reference-status">Metas documentadas, ainda sujeitas a confirmação e verificação. O atendimento de cada RNF precisa de método, ambiente e resultado registrados.</p>

Os itens de escopo Global se aplicam transversalmente. Vínculos específicos por história são consultáveis nas fichas. A aplicação por comportamento precisa ser confirmada durante o refinamento.

## Consultar condições {#consultar-condicoes}

## RNF01 · Responsividade Mobile {#rnf01}

**Categoria:** Usabilidade

**MVP:** Obrigatório

**Descrição:** A interface deve adaptar-se a telas a partir de 360px, priorizando o uso em smartphones.

**Origem e perfis:**

- Global
- Todos os utilizadores (Visitante, Aluno e Professor)

**Verificação e validação:**

- **Verificação (Métrica):** Inspeção responsiva dos fluxos essenciais em viewports a partir de `360px` de largura (ex.: `360×800 px`, `390×844 px` e `1280×720 px`) com `0` barras de rolagem horizontal indesejadas, `0` sobreposições de elementos interativos e `100%` dos botões e formulários legíveis e acionáveis.
- **Validação (Justificativa):** Garante que atletas e treinadores consigam acessar treinos, enviar vídeos e registrar feedbacks diretamente pelo smartphone em quadra ou ginásio sem perda de usabilidade.

**Checklist estruturado:**

- [ ] Todas as telas principais renderizam sem rolagem horizontal em largura mínima de 360px
- [ ] Textos, formulários, botões e players de vídeo permanecem legíveis e clicáveis sem corte ou sobreposição em smartphones
- [ ] A navegação principal e ações críticas são facilmente acessíveis em telas móveis (mobile-first)
- [ ] O layout mantém proporção e funcionalidade adequadas também em telas maiores (tablets e desktops)

## RNF02 · Arquitetura e Stack Tecnológica {#rnf02}

**Categoria:** Requisitos de Implementação

**MVP:** Obrigatório

**Descrição:** O sistema deve ser desenvolvido utilizando React (v18+) com TypeScript no frontend, Python (3.11+) com Django / Django REST Framework no backend e PostgreSQL (v15+) como SGBD relacional.

**Origem e perfis:**

- Global
- Equipe de Desenvolvimento / Todos os utilizadores (Visitante, Aluno e Professor)

**Verificação e validação:**

- **Verificação (Métrica):** Inspeção dos manifestos de dependências e ambiente (`package.json`, `requirements.txt`/`pyproject.toml` e configuração do banco) confirmando `React >= 18` com `TypeScript`, `Python >= 3.11` com `Django` / `djangorestframework` e instância ativa de `PostgreSQL >= 15` (`100%` de aderência às versões mínimas declaradas).
- **Validação (Justificativa):** Padroniza a stack tecnológica do projeto, assegurando tipagem estática no frontend, produtividade e maturidade na API REST e integridade relacional na persistência dos dados.

**Checklist estruturado:**

- [ ] O frontend está estruturado em React (v18+) com TypeScript ativo no build e checagem de tipos
- [ ] O backend está implementado em Python (3.11+) utilizando Django e Django REST Framework
- [ ] A camada de persistência relacional opera sobre PostgreSQL (v15+)
- [ ] Os arquivos de configuração e dependências do repositório refletem as versões mínimas homologadas

## RNF03 · Suporte a Navegadores Web {#rnf03}

**Categoria:** Suportabilidade

**MVP:** Obrigatório

**Descrição:** A aplicação web deve operar sem falhas críticas todos os fluxos essenciais (autenticação, cadastro, prescrição, envio e visualização de vídeos e acompanhamento de métricas) sem erros bloqueantes de interface, layout ou persistência de dados nas versões mínimas de referência estabelecidas: em desktop (Windows, macOS e Linux), Google Chrome ≥ 130, Mozilla Firefox ≥ 131, Microsoft Edge ≥ 130, Apple Safari ≥ 17.5 (macOS) e Opera ≥ 114; em dispositivos móveis, Google Chrome ≥ 130 (Android) e Apple Safari ≥ 17.5 (iOS/iPadOS), bem como nas versões estáveis subsequentes lançadas durante o ciclo do projeto.

**Origem e perfis:**

- Global
- Todos os utilizadores (Visitante, Aluno e Professor)

**Verificação e validação:**

- **Verificação (Métrica):** Execução bem-sucedida de 100% da suíte E2E / checklist de fluxos críticos com 0 erros não tratados no console (`Uncaught Error` ou falhas de persistência) e 0 quebras de layout bloqueantes nas versões mínimas de referência desktop (Chrome 130+, Firefox 131+, Edge 130+, Safari 17.5+, Opera 114+) e mobile (Chrome 130+ Android, Safari 17.5+ iOS/iPadOS).
- **Validação (Justificativa):** Fixa uma linha de base reproduzível de navegadores, versões mínimas e sistemas operacionais para auditoria e testes de regressão, eliminando a ambiguidade de "versões mais atuais".

**Checklist estruturado:**

- [ ] Os fluxos críticos de autenticação, cadastro, treino e envio de vídeo operam sem bloqueios nas versões mínimas definidas em desktop e mobile
- [ ] Não ocorrem erros de JavaScript não tratados no console durante a navegação nos navegadores homologados
- [ ] Componentes visuais, formulários e players de vídeo mantêm legibilidade e funcionamento íntegro sem sobreposição ou corte
- [ ] A persistência de dados e o armazenamento de sessão funcionam corretamente em todas as plataformas de referência

## RNF04 · Acessibilidade Digital {#rnf04}

**Categoria:** Usabilidade

**MVP:** Não aplicáveis ao MVP

**Descrição:** A interface web deve garantir acessibilidade visual focada em daltonismo e baixa visão, aplicando paleta de cores com contraste mínimo de 4.5:1 (conforme WCAG 2.1 AA - Critério 1.4.3) e independência de cor como único meio de transmitir informação.

**Origem e perfis:**

- Global
- Todos os utilizadores (Visitante, Aluno e Professor)

**Pendência de decisão:**

- A classificação anterior deixa acessibilidade fora do MVP. A classificação foi preservada para revisão, sem retirar as metas já declaradas nem afirmar que essa opção foi confirmada.

**Verificação e validação:**

- **Verificação (Métrica):** Auditoria automatizada e inspeção visual das telas principais (via Lighthouse Accessibility / axe DevTools) comprovando relação de contraste `≥ 4.5:1` em `100%` dos textos normais (WCAG 2.1 AA - Critério 1.4.3) e `0` estados críticos (erros, status de treino ou alertas) comunicados exclusivamente por cor (sem ícone, rótulo ou padrão textual complementar).
- **Validação (Justificativa):** Assegura legibilidade e compreensão inequívoca da interface para usuários com daltonismo ou baixa visão, evitando barreiras visuais na leitura de métricas, feedbacks e status de exercícios.

**Checklist estruturado:**

- [ ] Todos os textos e componentes interativos atendem ao contraste mínimo de 4.5:1 conforme WCAG 2.1 AA (Critério 1.4.3)
- [ ] Mensagens de erro, validações de formulário e status de execução utilizam ícones ou textos descritivos além da diferenciação por cor
- [ ] Gráficos, indicadores de progresso e feedbacks visuais permanecem distinguíveis em simulação de daltonismo (protanopia, deuteranopia e tritanopia)
- [ ] A decisão de escopo (inclusão no MVP ou manutenção no pós-MVP) foi formalmente revisada e confirmada pela equipe

## RNF05 · Proteção de Dados Pessoais e Direitos do Titular (LGPD) {#rnf05}

**Categoria:** Segurança (Privacidade / LGPD)

**MVP:** Obrigatório

**Descrição:** O sistema deve garantir a privacidade e a proteção dos dados dos usuários em conformidade com a LGPD (Lei nº 13.709/2018), com foco nos artigos 5º, 14º, 18º e 46º, na qual esses dados devem ser restritos exclusivamente ao mínimo necessário para a finalidade explícita de acompanhamento esportivo (cadastro, métricas e vídeos de execução), com acesso limitado ao próprio titular e ao seu professor vinculado, retenção restrita ao período em que a conta permanecer ativa e eliminação definitiva e irreversível após a conclusão da análise pelo professor, mediante encerramento da conta ou solicitação do titular.

**Origem e perfis:**

- Global / CP8
- Aluno e Professor

**Regras de negócio associadas:**

- [RN02 · Vínculo Obrigatório de Atleta por Convite/Código](regras_negocio.md#rn02)
- [RN03 · Isolamento de Dados e Carteira (Multi-tenant)](regras_negocio.md#rn03)
- [RN04 · Segregação de Edição Cadastral e Clínica](regras_negocio.md#rn04)
- [RN05 · Política de Exclusão de Conta e Dados (LGPD)](regras_negocio.md#rn05)
- [RN16 · Consentimento Legal para Atletas Menores de Idade](regras_negocio.md#rn16)

**Verificação e validação:**

- **Verificação (Métrica):** 100% dos dados pessoais e vídeos trafegam criptografados (HTTPS/TLS) e retornam bloqueio (HTTP 403) para usuários sem vínculo; após a conclusão da análise pelo professor e solicitação do titular/encerramento, os registros e arquivos são removidos definitivamente do banco e do storage, com protocolo gerado em ≤ 500 ms.
- **Validação (Justificativa):** Traduz a conformidade com a LGPD em critérios verificáveis de minimização, finalidade explícita, controle de acesso, retenção e direitos do titular, respeitando a integridade do processo de avaliação pedagógica.

**Checklist estruturado:**

- [ ] A coleta restringe-se aos dados estritamente necessários ao acompanhamento esportivo, com finalidade explícita
- [ ] Apenas o aluno titular e o professor vinculado possuem acesso aos dados e vídeos de execução
- [ ] Os dados pessoais são mantidos apenas enquanto a conta do usuário permanecer ativa
- [ ] Após a conclusão da análise pelo professor, o encerramento da conta ou solicitação do titular resulta na eliminação definitiva dos registros e vídeos

## RNF06 · Compatibilidade de Vídeo {#rnf06}

**Categoria:** Suportabilidade

**MVP:** Associado a RFs do MVP

**Descrição:** O sistema deve aceitar e processar submissões de ficheiros de vídeo nos formatos .mp4 e .mov.

**Origem e perfis:**

- CP5, CP6
- Aluno (Atleta) e Professor

**Regras de negócio associadas:**

- [RN09 · Limite de Mídia por Submissão de Exercício](regras_negocio.md#rn09)

**Verificação e validação:**

- **Verificação (Métrica):** Testes automatizados e manuais de upload comprovando que `100%` dos arquivos válidos nos contêineres `.mp4` (H.264/HEVC) e `.mov` (QuickTime/iOS) dentro dos limites estabelecidos (RNF14) são aceitos e reproduzidos corretamente, enquanto `100%` dos formatos não suportados (ex.: `.avi`, `.mkv`, `.wmv`, `.exe`) são rejeitados antes do envio (RNF16).
- **Validação (Justificativa):** Garante compatibilidade nativa com os formatos padrão de gravação de smartphones Android (`.mp4`) e iOS/iPhone (`.mov`), evitando que o atleta precise converter o vídeo manualmente antes de enviá-lo.

**Checklist estruturado:**

- [ ] Vídeos gravados e exportados no formato `.mp4` são aceitos, armazenados e reproduzidos corretamente na plataforma
- [ ] Vídeos gravados nativamente em dispositivos iOS no formato `.mov` são aceitos, armazenados e reproduzidos corretamente
- [ ] Arquivos com extensões ou MIME types fora da lista permitida (`.mp4` e `.mov`) são bloqueados com feedback claro antes do upload (RNF16)
- [ ] Os players web de avaliação do professor reproduzem ambos os formatos sem exigir plugins externos

## RNF07 · Feedback Visual de Upload {#rnf07}

**Categoria:** Usabilidade

**MVP:** Evolutivos

**Descrição:** A aplicação web deve exibir um indicador visual de progresso dinâmico (com porcentagem de 1% a 99%) durante a submissão do vídeo, informando o estado em tempo real até ao término (100%).

**Origem e perfis:**

- CP5
- Aluno (Atleta)

**Verificação e validação:**

- **Verificação (Métrica):** Testes funcionais e de simulação de rede (throttling 3G/4G) no envio de vídeos válidos (até 100 MB), comprovando a atualização contínua da barra/percentual de progresso de `1%` a `99%` durante a transferência e transição para `100%` (confirmação de conclusão) em `≤ 1,0 s` após o término do upload.
- **Validação (Justificativa):** Evita que o atleta feche a aba, recarregue a página ou reenvie o vídeo duplicado por falta de retorno visual durante o envio de arquivos maiores em conexões móveis.

**Checklist estruturado:**

- [ ] Um indicador visual de progresso é exibido logo após iniciar o upload do vídeo
- [ ] O percentual é atualizado dinamicamente de 1% a 99% acompanhando os bytes transferidos (eventos de progresso da requisição)
- [ ] Ao concluir o envio e persistência, o indicador atinge 100% e exibe confirmação clara de sucesso
- [ ] Em caso de queda de conexão ou falha durante o upload, o progresso é interrompido e uma mensagem de erro clara é exibida

## RNF08 · Interface de Feedback Anotado {#rnf08}

**Categoria:** Usabilidade

**MVP:** Evolutivos

**Descrição:** A interface do treinador deve permitir a associação de notas e observações textuais diretamente vinculadas à linha do tempo dos vídeos enviados pelos atletas.

**Origem e perfis:**

- CP6
- Professor (Treinador)

**Regras de negócio associadas:**

- [RN10 · Imutabilidade de Vídeo Após Feedback](regras_negocio.md#rn10)
- [RN11 · Autoria Exclusiva de Feedback](regras_negocio.md#rn11)

**Pendência de escopo:**

- O MVP entrega o feedback textual do [RF3604](requisitos.md#rf3604), vinculado ao vídeo e ao exercício, sem exigência de marcação por timestamp.
- A anotação diretamente vinculada à linha do tempo descrita neste RNF permanece como evolução pós-MVP e depende de confirmação do cliente sobre a forma de apresentação (ver [ata de 08/10/2026](../atas/2026-10-08-lucas/#pontos-a-esclarecer)).

**Verificação e validação:**

- **Verificação (Métrica):** `100%` das anotações salvas com timestamp válido dentro da duração do vídeo (`0 s` até o fim), `0` anotações órfãs ou fora do intervalo e edição/exclusão restrita ao autor original (RN11), com persistência e reexibição correta após recarregar o vídeo.
- **Validação (Justificativa):** Permite ao treinador apontar erros e acertos em momentos específicos da execução, complementando o feedback textual geral do RF3604 sem alterar o escopo já entregue no MVP.

**Checklist estruturado:**

- [ ] O treinador consegue criar notas textuais associadas a um timestamp válido do vídeo
- [ ] As anotações são persistidas e reexibidas nos pontos corretos após recarregar o vídeo
- [ ] Apenas o autor original pode editar ou excluir a anotação (RN11)
- [ ] Anotações sem timestamp ou fora da duração do vídeo são bloqueadas
- [ ] A implementação da linha do tempo foi formalmente confirmada com o cliente antes do incremento

## RNF09 · Controle de Acesso Baseado em Funções (RBAC) {#rnf09}

O sistema deve aplicar controle de acesso rígido (Role-Based Access Control), garantindo que endpoints e visões referentes ao perfil Treinador não sejam acessíveis por Atletas.

**Categoria registrada:** Confiabilidade / Segurança. **Escopo:** CP7.

**Tratamento registrado para o MVP:** Obrigatórios para o MVP.

## RNF10 · Isolamento Multi-inquilino de Dados {#rnf10}

O acesso aos vídeos, dados de histórico e feedbacks de um atleta deve ser restrito exclusivamente ao próprio atleta e aos treinadores devidamente vinculados a ele.

**Categoria registrada:** Confiabilidade / Segurança. **Escopo:** CP8.

**Tratamento registrado para o MVP:** Obrigatórios para o MVP.

## RNF11 · Desempenho no Carregamento do Histórico {#rnf11}

As telas de consulta de histórico, perfil e gráficos de evolução do atleta devem carregar completamente em até 5 segundos sob simulação de limitação de rede (throttling em perfil Fast 4G no DevTools dos navegadores homologados) e sob carga nominal de até 50 requisições simultâneas ao servidor.

**Categoria registrada:** Desempenho. **Escopo:** CP1, CP2.

**Tratamento registrado para o MVP:** Evolutivos.

## RNF12 · Integridade e Consistência na Catalogação de Exercícios {#rnf12}

**Categoria:** Confiabilidade (Integridade de Dados)

**MVP:** Associado a RFs do MVP

**Descrição:** O sistema deve manter os resultados de busca e filtragem da biblioteca de exercícios (por nome e por fundamento) sempre atualizados após cadastros, edições ou exclusões, evitando que exercícios removidos ou dados desatualizados apareçam nas consultas.

**Origem e perfis:**

- CP4
- Aluno e Professor

**Regras de negócio associadas:**

- [RN13 · Integridade Referencial na Exclusão de Planejamentos e Exercícios](regras_negocio.md#rn13)
- [RN14 · Gestão da Biblioteca de Exercícios](regras_negocio.md#rn14)

**Verificação e validação:**

- **Verificação (Métrica):** 0 exercícios removidos ou dados desatualizados exibidos nas buscas por nome e filtros por fundamento imediatamente após operações de cadastro, edição ou exclusão (100% de consistência dos resultados em ≤ 1,0 s).
- **Validação (Justificativa):** Elimina a divergência com os Requisitos Funcionais (que não contemplam filtros combinados nem o atributo de materiais) e garante que professores e alunos consultem apenas exercícios ativos e atualizados.

**Checklist estruturado:**

- [ ] Após cadastrar ou editar um exercício, os dados atualizados (nome, objetivo e fundamento) refletem imediatamente nas consultas
- [ ] A exclusão de um exercício remove-o imediatamente das listagens de busca e filtro sem gerar erros ou referências quebradas
- [ ] Consultas por nome e filtragem por fundamento retornam exatamente os registros ativos correspondentes sem duplicidades

## RNF13 · Armazenamento Isolado e Proteção de Mídias {#rnf13}

**Categoria:** Confiabilidade / Segurança

**MVP:** Obrigatório

**Descrição:** Os vídeos enviados pelos atletas devem ser armazenados de forma isolada em armazenamento de objetos em nuvem (externo ao contêiner da aplicação), com criptografia em repouso (AES-256 / SSE) e controle de acesso restrito aos usuários vinculados ao treino. No **MVP (piso mínimo obrigatório)**, toda mídia trafega via HTTPS/TLS, é persistida em bucket privado sem URLs públicas permanentes e acessada apenas mediante requisição autenticada ou URL assinada de curta duração; recursos avançados como chaves gerenciadas pelo cliente (KMS/CMK), marca d'água (watermark) e transcodificação adaptativa permanecem como **escopo evolutivo pós-MVP**.

**Origem e perfis:**

- CP5, CP8
- Aluno (Atleta) e Professor

**Regras de negócio associadas:**

- [RN03 · Isolamento de Dados e Carteira (Multi-tenant)](regras_negocio.md#rn03)
- [RN05 · Política de Exclusão de Conta e Dados (LGPD)](regras_negocio.md#rn05)
- [RN09 · Limite de Mídia por Submissão de Exercício](regras_negocio.md#rn09)

**Verificação e validação:**

- **Verificação (Métrica):** 100% dos vídeos enviados são gravados em object storage externo com criptografia AES-256 habilitada; 0 URLs públicas permanentes expostas; 100% das tentativas de acesso por usuários sem vínculo retornam HTTP 403; e 0 bytes permanecem recuperáveis após solicitação de exclusão (RN05).
- **Validação (Justificativa):** Garante o piso obrigatório de confidencialidade e isolamento das mídias desde a primeira versão do MVP, separando-o claramente de evoluções futuras de criptografia avançada e processamento de vídeo.

**Checklist estruturado:**

- [ ] Os vídeos enviados são armazenados em object storage externo ao contêiner da aplicação, com criptografia em repouso (AES-256) ativa
- [ ] Nenhum arquivo de vídeo é acessível por URL pública estática (somente via endpoint autenticado ou URL assinada temporária)
- [ ] Requisições de acesso feitas por usuários sem vínculo ativo aluno-professor são bloqueadas com HTTP 403
- [ ] A exclusão da conta ou solicitação do titular remove definitivamente o arquivo do storage em nuvem

## RNF14 · Limites de Duração e Tamanho no Envio de Vídeos {#rnf14}

**Categoria:** Suportabilidade / Usabilidade

**MVP:** Associado a RFs do MVP

**Descrição:** Os vídeos de execução técnica enviados pelos atletas devem respeitar o teto máximo global de 60 segundos de duração e 100 MB de tamanho por arquivo, garantindo estabilidade no upload em redes móveis, previsibilidade de armazenamento e reprodução fluida para avaliação pelo professor.

**Origem e perfis:**

- CP5
- Aluno (Atleta)

**Regras de negócio associadas:**

- [RN09 · Limite de Mídia por Submissão de Exercício](regras_negocio.md#rn09)

**Decisão de projeto (Justificativa técnica):**

- **Dimensionamento do teto (60 s / 100 MB):** Adotou-se como referência de gravação móvel o padrão Full HD (`1080p` a `30 fps`, codecs H.264/HEVC), cuja taxa média de bits varia entre `8 e 12 Mbps` (`~60 a 90 MB` por minuto). O limite de **100 MB** acomoda uma gravação completa de **60 segundos** nesse padrão com margem de segurança, dispensando compressão prévia pelo atleta e evitando estouros de memória ou timeout em conexões móveis. Gravações acima desse teto (como `4K` ou `60 fps` prolongados) devem ser rejeitadas antes do envio (ver RNF16).
- **Adoção de limite único no MVP:** Embora o domínio admita execuções de durações distintas conforme o exercício (conforme esclarecido por Lucas / ata de 26/09), decidiu-se manter um **teto único global de 60 s no MVP** — suficiente para cobrir a execução completa de qualquer exercício individual sem adicionar complexidade de configuração por exercício no cadastro da biblioteca —, deixando a parametrização de duração máxima por exercício como evolução futura pós-MVP.

**Verificação e validação:**

- **Verificação (Métrica):** 100% dos arquivos com duração `> 60 s` ou tamanho `> 100 MB` são bloqueados antes da conclusão do upload, enquanto 100% dos vídeos válidos em `1080p @ 30 fps` (`≤ 60 s` e `≤ 100 MB`) são aceitos e persistidos sem necessidade de reprocessamento manual.
- **Validação (Justificativa):** Documenta formalmente o critério técnico por trás dos parâmetros numéricos e registra a decisão de escopo do MVP, tornando o requisito reproduzível e auditável.

**Checklist estruturado:**

- [ ] Vídeos com duração superior a 60 segundos são rejeitados com feedback claro ao aluno
- [ ] Arquivos com tamanho superior a 100 MB são bloqueados antes de consumir banda completa de upload
- [ ] Vídeos gravados em dispositivos móveis no padrão 1080p a 30 fps com até 60 segundos (≤ 100 MB) são enviados e reproduzidos sem falhas
- [ ] A decisão técnica sobre o teto único (60 s / 100 MB) e o adiamento da duração variável por exercício pós-MVP está registrada e vinculada à RN09

## RNF15 · Assistência e Validação no Preenchimento de Dados {#rnf15}

O sistema deve aplicar máscaras de entrada em tempo real, destacar campos obrigatórios e validar formatos antes do envio do formulário, prevenindo erros de digitação.

**Categoria registrada:** Usabilidade. **Escopo:** CP1, CP3.

**Tratamento registrado para o MVP:** Evolutivos.

## RNF16 · Feedback e Prevenção de Erros no Pré-Envio de Mídia {#rnf16}

**Categoria:** Usabilidade

**MVP:** Obrigatório

**Descrição:** O processamento da prévia e a manipulação da mídia (vídeo) selecionada devem ocorrer no navegador (lado do cliente), garantindo feedback visual para o usuário e impedindo qualquer transmissão de dados ao servidor antes da confirmação explícita de envio feita pelo utilizador.

**Origem e perfis:**

- OE3 - CP5
- Aluno

**Regras de negócio associadas:**

- [RN09 · Limite de Mídia por Submissão de Exercício](regras_negocio.md#rn09)
- [RN10 · Imutabilidade de Vídeo Após Feedback](regras_negocio.md#rn10)

**Verificação e validação:**

- **Verificação (Métrica):** Prévia/troca local em ≤ 1,0s (até 100 MB) e 0 bytes enviados ao servidor antes da confirmação final.
- **Validação (Justificativa):** Evita envio acidental de vídeo errado, poupa dados móveis e reduz custo de armazenamento temporário.

**Checklist estruturado:**

- [ ] A prévia local do arquivo é exibida em até 1,0s após a seleção
- [ ] Nenhuma requisição de upload é disparada antes da confirmação
- [ ] A troca ou remoção limpa o estado anterior sem recarregar a tela
- [ ] Arquivos inválidos exibem feedback imediato antes do envio

## RNF17 · Conformidade de Privacidade e Consentimento de Cookies {#rnf17}

**Categoria:** Segurança (Privacidade / LGPD)

**MVP:** Obrigatório

**Descrição:** A aplicação web não deve salvar nem enviar cookies opcionais (como os usados para estatísticas ou monitoramento) antes que o usuário autorize expressamente. Além disso, o sistema deve guardar um histórico da escolha feita e permitir que o usuário mude ou cancele essa permissão a qualquer momento, respeitando a LGPD (Arts. 7º e 8º).

**Origem e perfis:**

- Global / CP8
- Todos os utilizadores (Visitante, Aluno e Professor)

**Regras de negócio associadas:**

- [RN15 · Obrigatoriedade de Aceite dos Termos e Privacidade](regras_negocio.md#rn15)

**Verificação e validação:**

- **Verificação (Métrica):** 0 cookies opcionais gravados no navegador e 0 requisições a scripts de monitoramento disparadas antes da autorização explícita, com registro da escolha salvo em ≤ 500 ms.
- **Validação (Justificativa):** Garante conformidade com a LGPD (Arts. 7º e 8º), evita coleta indevida de dados pessoais sem consentimento e protege o projeto contra riscos jurídicos.

**Checklist estruturado:**

- [ ] Nenhum cookie opcional é salvo no primeiro acesso antes da escolha do usuário
- [ ] A opção "Apenas Essenciais" bloqueia o carregamento de scripts de estatísticas e monitoramento
- [ ] O histórico da escolha (data, hora e o que foi autorizado) fica registrado no sistema
- [ ] O usuário consegue alterar ou cancelar sua permissão posteriormente a qualquer momento

## RNF18 · Persistência Durável de Dados e Mídias {#rnf18}

**Categoria:** Confiabilidade

**MVP:** Obrigatório

**Descrição:** O sistema deve garantir a persistência durável de todos os dados estruturados (cadastros, exercícios, planejamentos, treinos e feedbacks) em banco de dados relacional (PostgreSQL) e dos arquivos de mídia (vídeos-base da biblioteca do professor e vídeos de execução dos atletas) em armazenamento de objetos externo à imagem dos contêineres da aplicação. No **MVP (piso mínimo obrigatório)**, os dados e vídeos devem sobreviver integralmente a reinicializações, atualizações e redeploys do ambiente sem perda ou quebra de integridade referencial; mecanismos avançados como backups automáticos *point-in-time* (PITR), replicação multi-região e plano formal de recuperação de desastres (DR) ficam como **escopo evolutivo pós-MVP**.

**Origem e perfis:**

- Global
- Todos os utilizadores (Visitante, Aluno e Professor)

**Regras de negócio associadas:**

- [RN13 · Integridade Referencial na Exclusão de Planejamentos e Exercícios](regras_negocio.md#rn13)
- [RN14 · Gestão da Biblioteca de Exercícios](regras_negocio.md#rn14)

**Verificação e validação:**

- **Verificação (Métrica):** Após ciclo controlado de reinicialização e redeploy dos serviços da aplicação, 0 registros estruturados são perdidos no PostgreSQL (`100%` de retenção), `100%` dos vídeos-base e de execução permanecem acessíveis no storage e 0 referências quebradas ocorrem após operações de exclusão (RN13).
- **Validação (Justificativa):** Elimina o risco de perda de estado em ambientes containerizados no MVP, formalizando o requisito mínimo de continuidade operacional e conectando-o aos fluxos de biblioteca e execução.

**Checklist estruturado:**

- [ ] Dados estruturados (usuários, treinos, feedbacks e catálogo) permanecem íntegros no PostgreSQL após reinicialização ou redeploy dos contêineres
- [ ] Vídeos-base cadastrados pelo professor na biblioteca (RN14) e vídeos enviados pelos atletas permanecem recuperáveis após reinicializações
- [ ] A aplicação de migrações de banco de dados preserva os registros existentes sem perda de dados
- [ ] Operações de exclusão mantêm a integridade referencial do histórico conforme a RN13
