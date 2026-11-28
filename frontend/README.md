# Frontend de acesso

Implementação de US01–US05 em React/Vite, preparada para o contrato de contas da branch `backend-acesso`, commit `8628d27886ff83152a68f53ca80f5409422bf4e1`.

## Configuração

Copie `.env.example` para `.env` dentro de `frontend/` e execute `npm install` e `npm run dev`. Reinicie o Vite ao mudar variáveis de ambiente.

- `VITE_API_URL`: base pública da API, incluindo `/api`. O padrão `/api` usa a mesma origem da aplicação.
- `VITE_PROXY_TARGET`: endereço do backend para o proxy de desenvolvimento; padrão `http://localhost:8000`.

Os Termos de Uso e a Política de Privacidade (US63) vêm do backend (`GET /auth/termos/vigentes/`), configurados por `TERMOS_USO_URL` e `POLITICA_PRIVACIDADE_URL` no `.env` da raiz. Sem os dois, o aceite fica indisponível. As rotas `/termos-de-uso` e `/politica-de-privacidade` exibem o texto da versão 1.0, mantido em `src/features/termos/documentosLegais.ts` (fonte única). Pontos pendentes de confirmação aparecem destacados e contados na página, e a página avisa se `VERSAO_DOCUMENTOS_LEGAIS` divergir da versão vigente do backend. Ao alterar o texto, atualize junto o espelho em `docs/legal/`. Não há aceitações automáticas.

Todas as variáveis `VITE_` ficam visíveis no navegador. Não coloque nelas senhas, chaves Django, credenciais do banco ou código de ativação. A configuração do treinador pertence ao backend. Em produção, providencie o encaminhamento de `/api` pelo servidor; o proxy do Vite só existe em desenvolvimento. Uma API em outra origem depende de configuração de CORS no backend, ausente na versão examinada.

## Contrato utilizado

| Fluxo | Método e rota após a base da API | Dados enviados |
| --- | --- | --- |
| Cadastro de aluno adulto | `POST /auth/cadastro/aluno/` | Identificação, `codigo_treinador`, `data_nascimento`, medidas, `frequencia_semanal`, objetivos, senha e aceite explícito |
| Cadastro de treinador | `POST /auth/cadastro/treinador/` | Identificação, telefone, `codigo_ativacao`, senha e aceite explícito |
| Login de aluno | `POST /auth/login/aluno/` | `apelido`, `senha` |
| Login de treinador | `POST /auth/login/treinador/` | `email`, `senha` |
| Consulta da sessão | `GET /auth/me/` | Access token no cabeçalho Bearer |
| Saída | `POST /auth/logout/` | Refresh token no corpo e access token no cabeçalho |
| Documentos vigentes | `GET /auth/termos/vigentes/` | Nenhum (rota pública) |
| Atualização de termos | `POST /auth/aceitar-termos/` | `aceite_termos: true` e `versao` exibida, somente após ação da pessoa |

A interface recebe altura e envergadura em centímetros e converte para metros, sem arredondamento silencioso. Peso continua em kg. O servidor decide intervalos e precisão válidos; erros de validação são exibidos junto aos campos. O cadastro não inicia sessão automaticamente. O código de convite retornado ao treinador é mostrado após o cadastro.

O login conserva os tokens access e refresh e confirma o perfil pelo servidor. A saída elimina a sessão local imediatamente e envia o refresh com o access no cabeçalho. O backend revoga o refresh, rejeita o access usado no logout e recusa refresh de outro usuário. Se o encerramento falhar, a interface informa que ele não foi confirmado no servidor. A restauração da sessão consulta `/auth/me/`; não foi acrescentada renovação automática do access token.

## Erros comuns e orientações corretivas (US37)

Telas do treinador para manter os pares **erro comum + orientação corretiva** de cada exercício da biblioteca. O acesso é pelo botão "Erros e orientações" no detalhe do exercício. Todas as rotas usam `RotaProtegida papel="TREINADOR"`; a proteção de verdade continua no backend (CA04).

| Rota | Tela | Chamada à API |
| --- | --- | --- |
| `/exercicios/:exercicioId/erros-orientacoes` | Lista do exercício, com estado vazio | `GET /exercicios/:id/` (campo `erros_orientacoes`) |
| `/exercicios/:exercicioId/erros-orientacoes/novo` | Adicionar nova orientação | `POST /exercicios/:id/erros-comuns/` |
| `/exercicios/:exercicioId/erros-orientacoes/:erroId/editar` | Editar orientação (CA01) | `PUT /exercicios/:id/erros-comuns/:erroId/` |
| `/exercicios/:exercicioId/erros-orientacoes/:erroId/remover` | Confirmar a remoção (CA02) | `DELETE /exercicios/:id/erros-comuns/:erroId/` |

- O corpo leva só `erro` e `orientacao_corretiva`; o exercício vem sempre da URL. Os dois campos são obrigatórios e têm limite de 1000 caracteres, os mesmos do backend. Os espaços nas pontas são removidos antes do envio.
- Os erros 400 do backend aparecem no campo correspondente; 403, 404 e falhas de rede aparecem em `role="alert"`, sem perder o que foi digitado.
- Depois de salvar ou remover, a lista mostra um aviso em `role="status"`. O aviso sai do histórico do navegador e não reaparece ao recarregar.
- A remoção é definitiva e vale só para o exercício. Treinos já prescritos devem manter a cópia das orientações (RN23); essa parte depende da prescrição (RF2307).
- O formulário do exercício (US39) não envia a lista, portanto editar o exercício não apaga os itens. O campo de texto antigo "Erros comuns" saiu da consulta e do formulário do exercício; o valor já salvo é preservado ao editar, e os erros passam a ser mantidos só em "Erros e orientações".
- Código: `src/features/exercicios/` (`ErrosOrientacoesExercicio.tsx`, `ErroOrientacaoPage.tsx`, `RemoverErroOrientacaoPage.tsx`, `components/ErroOrientacaoForm.tsx` e `ErrosOrientacoes.module.css`). Testes: `tests/us37-erros-orientacoes-*.test.ts(x)`.

## Pendências para o incremento

- Validar com o responsável pela plataforma os pontos destacados nos documentos legais (DoD06) e publicar com zero pendências, mantendo `VERSAO_DOCUMENTOS_LEGAIS` igual a `TERMOS_VERSAO_ATUAL`. Configurar uma URL não comprova conteúdo, disponibilidade ou validação do documento.
- Definir com os responsáveis o fluxo comprovável de consentimento de menores (RN16/US65). Até lá, frontend e backend recusam o cadastro de menores de 18 anos, como preveem os Termos v1.0.
- Garantir a preservação das revogações de access no ambiente de entrega. O backend usa `LocMemCache`, restrito ao processo: perda ou remoção da entrada permite reutilizar o access ainda não expirado; outros processos não compartilham essas revogações. A revogação do refresh é registrada no banco.
- Confirmar ativação/treinador único no ambiente de entrega, destinos finais após login e executar os fluxos no PostgreSQL/Docker previsto pela equipe. A tela de conta existente foi mantida; a biblioteca de exercícios não foi incorporada.

## Verificações

`npm test -- --pool=threads`, `npm run lint` e `npm run build` executam a suíte padrão e as verificações estáticas. Os testes de contrato isolam a rede com respostas simuladas.

`tests/acesso-api-real.test.tsx` é opcional e usa HTTP real. Só execute contra uma cópia descartável do backend, com banco vazio, migrações aplicadas e proxy do Vite ativo. Defina `SPACE_JAM_API_TEST_URL` com a base local (por exemplo `http://127.0.0.1:5173/api`) e `SPACE_JAM_TEST_ACTIVATION_CODE` com o código desse backend de teste, apenas no processo de testes. Execute `npm test -- --pool=threads tests/acesso-api-real.test.tsx`. Não use banco da equipe: a suíte cria contas fictícias e o backend permite apenas um treinador. Na execução padrão esses testes ficam ignorados por falta das variáveis explícitas.

A suíte renderiza os componentes React em jsdom e usa a API real pelo proxy do Vite. Além dos fluxos de acesso, ela verifica edição e consulta de cadastro, perfil de aluno vinculado e troca de senha com rejeição das credenciais da sessão anterior.

Para incluir a recuperação de senha no teste HTTP, aponte `SPACE_JAM_TEST_MAIL_DIR` para um diretório vazio em que as mensagens serão gravadas. Use o backend de e-mail em arquivo do Django com `EMAIL_FILE_PATH` ou um SMTP de teste que grave as mensagens recebidas nesse diretório. Configure `FRONTEND_URL` com a origem do frontend local. O teste lê o link gerado, redefine a senha e verifica que o link não pode ser reutilizado.

Os resultados registram o comportamento no ambiente de teste. A revisão independente, os documentos de termos vigentes e a validação pelo cliente seguem o fluxo da equipe.

### Integração da Iteração 2

- US07 e US53 permitem que o aluno atualize e consulte seus dados cadastrais. O telefone é opcional e pode ser removido ao limpar o campo.
- US08 e US10 conectam a troca de senha e a recuperação com link de uso único à API de contas. Para validar o fluxo com a configuração de entrega, use PostgreSQL 16 e configure o backend SMTP do Django.
- US52 carrega a carteira do treinador de `GET /api/alunos-acompanhados/`. A ação **Ver perfil** usa o identificador devolvido na lista para abrir o perfil real da US61.
- US61 também funciona pela rota direta. A exibição de lesões registradas depende da persistência pela US11.
- US11 permite ao treinador abrir **Registrar lesão** no perfil de um aluno acompanhado. O formulário envia a descrição de até 300 caracteres para `POST /api/contas/alunos/{aluno_id}/lesoes/` e mostra o registro salvo no histórico. A rota exige o backend da US11 com as migrações de contas aplicadas.

## Status de treino e feedback na Iteração 3

- **US23** — A rota autenticada `/treinos/:treinoId` carrega o detalhe e o status pela API. O treinador abre o treino pelo planejamento de um aluno acompanhado.
- **US29** — O aluno pode marcar um treino como feito, inclusive depois de devolvido, e desfazer a marcação enquanto o treino aguarda avaliação.
- **US15** — O treinador pode devolver o treino para correção ou confirmar a conclusão. A tela usa o estado retornado pelo servidor e atualiza a consulta ao receber HTTP 409.
- **US49 e US50** — Na tela do exercício do treino, o aluno registra seu feedback com `POST` e edita o mesmo registro com `PATCH`, em `/api/treinos/exercicios/:itemId/feedback-aluno/`. O detalhe do treino já inclui o feedback salvo e sua marca de edição. Após a conclusão o formulário fica indisponível.

A navegação do aluno pelo próprio planejamento é a US60. A prescrição, a execução e o feedback usam os mesmos identificadores de treino e exercício. Os testes da rota e do formulário ficam em `tests/TreinoPage.test.tsx`.

## Iteração 4 · biblioteca e histórico

| US | Acesso na aplicação | Integração |
| --- | --- | --- |
| US33 | Biblioteca → Consultar exercício → Erros e orientações → Associar erros e orientações | A API lista pares disponíveis em `GET /api/exercicios/:exercicioId/erros-comuns/candidatos/` e copia os selecionados pelo `POST /api/exercicios/:exercicioId/erros-comuns/associar/`. Cada cópia pertence ao exercício de destino. A prescrição preserva os pares conforme a RN23. |
| US41 | Campo “Buscar por nome” na biblioteca, em `/exercicios` | A busca aceita parte do nome e ignora maiúsculas e minúsculas. Cadastro e edição atualizam a lista pela resposta da API. |
| US28 | Perfil do aluno acompanhado → Ver histórico de treinos | `GET /api/treinos/alunos/:alunoId/historico/` traz os treinos concluídos do aluno da carteira, com paginação. |
| US58 | Menu Histórico na conta do aluno | `GET /api/treinos/meu-historico/` traz os treinos do próprio aluno em todos os estados, com paginação. |

Os detalhes dos dois históricos usam `GET /api/treinos/:treinoId/`, com os dados preservados da prescrição e os feedbacks do aluno. Dificuldade e feedback do treinador ainda dependem das respectivas histórias. O detalhe da US28 também depende da integração de vídeos de execução. Na US41, falta validar o efeito da exclusão na busca quando essa operação estiver disponível.

A rota `/previa/iteracao-4` usa dados fictícios para revisar os estados da interface em desenvolvimento. O build de produção exclui essa rota. Os testes das rotas integradas ficam em `tests/IntegracaoBibliotecaHistoricos.test.tsx`.

## Iteração 4 · dificuldades, feedback do aluno e exclusão de dados

Acesse `/previa/iteracao-4/registros` no Vite para revisar o registro e a
edição de dificuldade, a consulta pelo treinador, o bloqueio após conclusão
e a confirmação de exclusão. A prévia usa dados fictícios em memória. A
alteração de nota fica visível ao trocar de perfil na mesma visita e some
quando a página é recarregada. A rota fica fora do build de produção.

| História | Frontend | Integração com Guilherme |
| --- | --- | --- |
| US12 | O treinador consegue conferir a nota por exercício ou ver “Não registrada” na prévia. | Confirmar o campo de dificuldade no detalhe do treino e validar que só a carteira do treinador é consultável. |
| US13 e US14 | Seletor inteiro de 1 a 5, edição, reenvio após erro e bloqueio quando o treino é concluído. | Confirmar os métodos e a resposta de criação e edição por exercício prescrito, e como a API indica execução. Validar autoria, persistência e bloqueio após conclusão. |
| US51 | O fluxo de treino da develop já consulta texto e marca de edição do feedback por exercício em `GET /api/treinos/:treinoId/`. A prévia também mostra a consulta somente para leitura. | Reaproveitar o campo `feedback` da Iteração 3. Validar o acesso pelo histórico de treinos da US28 com Thiago, a preservação após conclusão e o carregamento em até 5 segundos. |
| US64 | Aviso, confirmação explícita, estado de envio, erro e confirmação simulada. | Confirmar contrato e resposta da solicitação autenticada. Conectar o encerramento de sessão após aceite e validar a revogação do acesso e o processamento dos dados e das mídias. |

Os critérios oficiais permanecem em `docs/criterios_aceitacao.md`. Os testes
`IteracaoQuatro.test.tsx` e `PreviaRegistrosIteracao4.test.tsx` verificam
o comportamento da interface. A integração real e a validação no ambiente
de entrega ainda precisam ser registradas no DoD.

Na verificação local em Chrome, a alteração simulada de dificuldade ficou
visível na consulta do treinador, o treino concluído manteve a nota somente
para leitura e a exclusão exigiu confirmação. Um teste separado com a API
local de treinos exibiu ao treinador o feedback editado de um treino
concluído, sem ação de edição. A US51 ainda precisa passar pelos critérios
de acesso via histórico e tempo de resposta no ambiente de entrega.
