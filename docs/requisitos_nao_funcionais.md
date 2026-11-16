# Requisitos não funcionais

Metas de qualidade e restrições técnicas do produto. Abra um item para consultar a declaração, sua aplicação no MVP e os requisitos relacionados.

[Catálogo funcional](requisitos.md) · [Método de priorização](backlog.md#1026-priorizacao-dos-requisitos-nao-funcionais)

## Condições gerais {#rnfs-gerais}

<p class="sj-reference-status">Metas documentadas, ainda sujeitas a confirmação e verificação. O atendimento de cada RNF precisa de método, ambiente e resultado registrados.</p>

Os itens de escopo Global se aplicam transversalmente. Vínculos específicos por história são consultáveis nas fichas. A aplicação por comportamento precisa ser confirmada durante o refinamento.

## Consultar condições {#consultar-condicoes}

## RNF01 · Responsividade Mobile {#rnf01}

A interface deve adaptar-se a telas a partir de 360px, priorizando o uso em smartphones.

**Categoria registrada:** Usabilidade. **Escopo:** Global.

**Tratamento registrado para o MVP:** Obrigatórios para o MVP.

## RNF02 · Arquitetura e Stack Tecnológica {#rnf02}

O sistema deve ser desenvolvido utilizando React (v18+) com TypeScript no frontend, Python (3.11+) com Django / Django REST Framework no backend e PostgreSQL (v15+) como SGBD relacional.

**Categoria registrada:** Requisitos de Implementação. **Escopo:** Global.

**Tratamento registrado para o MVP:** Obrigatórios para o MVP.

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

A interface web deve garantir acessibilidade visual focada em daltonismo e baixa visão, aplicando paleta de cores com contraste mínimo de 4.5:1 (conforme WCAG 2.1 AA - Critério 1.4.3) e independência de cor como único meio de transmitir informação.

**Categoria registrada:** Usabilidade. **Escopo:** Global.

**Tratamento registrado para o MVP:** Não aplicáveis ao MVP.

**Pendência de decisão:** a classificação anterior deixa acessibilidade fora do MVP. A classificação foi preservada para revisão, sem retirar as metas já declaradas nem afirmar que essa opção foi confirmada.

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

O sistema deve aceitar e processar submissões de ficheiros de vídeo nos formatos .mp4 e .mov.

**Categoria registrada:** Suportabilidade. **Escopo:** CP5, CP6.

**Tratamento registrado para o MVP:** Associados a RFs do MVP.

## RNF07 · Feedback Visual de Upload {#rnf07}

A aplicação web deve exibir um indicador visual de progresso dinâmico (com porcentagem de 1% a 99%) durante a submissão do vídeo, informando o estado em tempo real até ao término (100%).

**Categoria registrada:** Usabilidade. **Escopo:** CP5.

**Tratamento registrado para o MVP:** Evolutivos.

## RNF08 · Interface de Feedback Anotado {#rnf08}

A interface do treinador deve permitir a associação de notas e observações textuais diretamente vinculadas à linha do tempo dos vídeos enviados pelos atletas.

**Categoria registrada:** Usabilidade. **Escopo:** CP6.

**Tratamento registrado para o MVP:** Evolutivos.

**Pendência de escopo:** o requisito de feedback textual e a anotação vinculada à linha do tempo têm abrangências diferentes. Confirmar o comportamento que será exigido no incremento.

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

## RNF13 · Resiliência e Armazenamento Protegido de Mídias {#rnf13}

O upload dos vídeos enviados pelos atletas deve ser processado e persistido de forma isolada em armazenamento em nuvem com criptografia em repouso (AES-256).

**Categoria registrada:** Confiabilidade / Segurança. **Escopo:** CP5, CP8.

**Tratamento registrado para o MVP:** Evolutivos.

## RNF14 · Restrição de Duração e Tamanho de Mídias {#rnf14}

Os vídeos de execução enviados pelos atletas devem possuir duração máxima de 60 segundos e limite de tamanho de até 100 MB.

**Categoria registrada:** Suportabilidade / Usabilidade. **Escopo:** CP5.

**Tratamento registrado para o MVP:** Associados a RFs do MVP.

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

## RNF18 · Persistência de Dados {#rnf18}

O sistema deve garantir que as informações cadastradas e os vídeos dos treinadores permaneçam armazenadas após reinicializações ou atualizações do sistema.

**Categoria registrada:** Confiabilidade. **Escopo:** Global.

**Tratamento registrado para o MVP:** Evolutivos.
