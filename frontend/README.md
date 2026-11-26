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

A suíte real verifica cadastro/persistência/vínculo pelo cliente HTTP, login e saída pelos componentes React, consulta e restauração do perfil, rejeição de credenciais/duplicidade e aceite pelo endpoint. Usa DOM de teste (jsdom), não automatiza um navegador real e não comprova a revisão dos documentos de termos. Testes aprovados não substituem revisão independente nem validação do cliente.
