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

## RNF03 · Estabilidade em Navegadores Padrão {#rnf03}

O sistema deve operar sem falhas críticas (erros bloqueantes de navegação ou persistência) nas versões mais atuais dos navegadores ao longo do desenvolvimento: Chrome, Firefox, Edge, Safari e Opera.

**Categoria registrada:** Suportabilidade. **Escopo:** Global.

**Tratamento registrado para o MVP:** Obrigatórios para o MVP.

## RNF04 · Acessibilidade Digital {#rnf04}

A interface web deve garantir acessibilidade visual focada em daltonismo e baixa visão, aplicando paleta de cores com contraste mínimo de 4.5:1 (conforme WCAG 2.1 AA - Critério 1.4.3) e independência de cor como único meio de transmitir informação.

**Categoria registrada:** Usabilidade. **Escopo:** Global.

**Tratamento registrado para o MVP:** Não aplicáveis ao MVP.

**Pendência de decisão:** a classificação anterior deixa acessibilidade fora do MVP. A classificação foi preservada para revisão, sem retirar as metas já declaradas nem afirmar que essa opção foi confirmada.

## RNF05 · Proteção e Privacidade de Dados - Conformidade parcial com LGPD {#rnf05}

O sistema deve garantir a privacidade e proteção dos dados dos usuários em conformidade parcial com a LGPD (Lei nº 13.709/2018), com foco nos artigos 5º, 14º, 18º e 46º.

**Categoria registrada:** Confiabilidade. **Escopo:** Global / CP8.

**Tratamento registrado para o MVP:** Obrigatórios para o MVP.

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

## RNF12 · Integridade na Catalogação de Exercícios {#rnf12}

A base da biblioteca de exercícios deve suportar consultas por filtros combinados (objetivos, fundamentos e materiais) sem inconsistência de índices.

**Categoria registrada:** Confiabilidade. **Escopo:** CP4.

**Tratamento registrado para o MVP:** Associados a RFs do MVP.

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

## RNF16 · Gerenciamento Pré-Envio de Mídia {#rnf16}

A interface deve limitar a seleção de arquivos a 1 único arquivo por vez no campo de upload, apresentando botão de remoção/substituição antes da confirmação do envio.

**Categoria registrada:** Usabilidade. **Escopo:** CP5.

**Tratamento registrado para o MVP:** Associados a RFs do MVP.

## RNF17 · Consentimento de Cookies {#rnf17}

A aplicação web deve apresentar um aviso de consentimento de cookies no primeiro acesso, permitindo ao utilizador escolher entre "Aceitar Todos" ou "Apenas Essenciais" (LGPD Art. 7º e 8º).

**Categoria registrada:** Confiabilidade. **Escopo:** Global / CP8.

**Tratamento registrado para o MVP:** Obrigatórios para o MVP.

## RNF18 · Persistência de Dados {#rnf18}

O sistema deve garantir que as informações cadastradas e os vídeos dos treinadores permaneçam armazenadas após reinicializações ou atualizações do sistema.

**Categoria registrada:** Confiabilidade. **Escopo:** Global.

**Tratamento registrado para o MVP:** Evolutivos.
