# Backend — Space Jam

API em Django + Django REST Framework, com PostgreSQL e autenticação JWT.

> Documentação técnica para a equipe. Este arquivo fica no repositório e **não entra na publicação do MkDocs**, que publica apenas o conteúdo de `docs/`.

## Como executar

A partir da raiz do repositório, com o arquivo `.env` criado a partir do `.env.example`:

```bash
docker compose up -d
```

- API: `http://localhost:8000/api/` (health check em `/api/health/`)
- Django Admin: `http://localhost:8000/admin/`

Verificações:

```bash
docker compose exec backend python manage.py check
docker compose exec backend python manage.py makemigrations --check --dry-run
docker compose exec backend python manage.py test
```

## API: Termos de Uso e Política de Privacidade (US63)

O aceite da versão vigente dos documentos é obrigatório (RN15). A regra fica centralizada em `apps/contas/termos.py`, e o bloqueio é a permissão global `TermosVigentesAceitos` (`DEFAULT_PERMISSION_CLASSES`).

Usuários autenticados com termos pendentes recebem `403` em todas as rotas protegidas. Ficam liberadas as rotas públicas (cadastros, logins, refresh, health e `auth/termos/vigentes/`) e as rotas autenticadas `auth/me/`, `auth/aceitar-termos/` e `auth/logout/`. Sem autenticação, a resposta continua sendo `401`.

### Rotas

| Rota | Acesso | Corpo / resposta |
| --- | --- | --- |
| `GET /api/auth/termos/vigentes/` | Pública | `{ "versao", "termos_uso_url", "politica_privacidade_url", "disponivel" }`. As URLs vêm `null` quando os documentos estão indisponíveis. |
| `POST /api/auth/aceitar-termos/` | Autenticada | Corpo `{ "aceite_termos": true, "versao": "1.0" }` (`versao` é opcional). Resposta com os dados do usuário. |

### Respostas

Os erros seguem o formato `{ "detail": "...", "code": "..." }`.

| Status | `code` | Quando |
| --- | --- | --- |
| `200` | — | Aceite de uma versão já aceita. Nenhum registro novo é criado (idempotente). |
| `201` | — | Aceite registrado no histórico (`HistoricoAceiteTermos`) e no cache do usuário. |
| `400` | `ACEITE_OBRIGATORIO` | `aceite_termos` ausente ou falso. Vale também para os cadastros de aluno e treinador. |
| `403` | `TERMOS_PENDENTES` | Rota protegida acessada com termos pendentes. Inclui `versao_atual`. |
| `409` | `TERMOS_VERSAO_DIVERGENTE` | `versao` enviada difere da vigente. Inclui `versao_atual`. |
| `503` | `TERMOS_INDISPONIVEIS` | Documentos não configurados. Vale também para os cadastros de aluno e treinador. |

### Variáveis de ambiente

Definidas no `.env` da raiz (modelo em `.env.example`):

| Variável | Uso |
| --- | --- |
| `TERMOS_VERSAO_ATUAL` | Versão vigente dos documentos. Ao alterá-la, todos os usuários precisam aceitar de novo. |
| `TERMOS_USO_URL` | Endereço dos Termos de Uso (`http(s)://…` ou caminho iniciado por `/`). |
| `POLITICA_PRIVACIDADE_URL` | Endereço da Política de Privacidade, no mesmo formato. |

Sem as duas URLs válidas, o aceite e os cadastros respondem `503`. O frontend lê esses valores pela rota `GET /api/auth/termos/vigentes/`.

### Documentos

O texto da versão 1.0 dos Termos de Uso e da Política de Privacidade é exibido pelas rotas `/termos-de-uso` e `/politica-de-privacidade` do frontend, a partir de `frontend/src/features/termos/documentosLegais.ts`. O espelho em `docs/legal/` deve ser atualizado junto e continua no `exclude_docs` do `mkdocs.yml` até a aprovação formal. Os pontos ainda pendentes de confirmação aparecem destacados nas páginas.

O cadastro de aluno recusa menores de 18 anos (`400`, campo `data_nascimento`) até existir o fluxo verificável de consentimento do responsável (RN16/US65). O campo `consentimento_responsavel` do modelo foi mantido para esse fluxo futuro.

## Recuperação de senha (US10)

A solicitação e a redefinição são públicas. Elas estão disponíveis antes do login e do aceite dos termos.

| Rota | Corpo da solicitação |
| --- | --- |
| POST /api/auth/recuperar-senha/ | email |
| POST /api/auth/redefinir-senha/ | token, nova_senha, confirmacao_senha |

O pedido retorna HTTP 200 com a mesma mensagem para endereços cadastrados, desconhecidos, limitados ou com falha de envio. Falhas do serviço de e-mail ficam registradas no log. O link mais recente permanece válido por até uma hora, sobrevive à reinicialização da aplicação e só pode ser usado uma vez. Erros de link retornam HTTP 400 com código token_invalido, token_expirado ou token_usado. Após a redefinição, entre novamente com a nova senha.

Configure FRONTEND_URL com a URL pública do frontend. Em produção, use HTTPS e configure o backend SMTP com as variáveis EMAIL_* do arquivo .env.example. Em desenvolvimento, o backend de console exibe a mensagem no log local. O limite padrão é de cinco pedidos por e-mail e vinte por IP em quinze minutos. A aplicação conta o IP da conexão. Em ambientes atrás de proxy, aplique também o limite por IP do cliente na borda.

Execute as migrações do Django antes de liberar o fluxo. Solicitações emitidas antes da mudança de armazenamento precisam ser refeitas.

## API: Erros comuns e orientações corretivas (US37)

Cada exercício da biblioteca pode ter uma lista de pares **erro comum + orientação corretiva** (modelo `ErroComumExercicio`, em `apps/exercicios/`). A US37 (RF2420) permite ao treinador editar (CA01) e remover (CA02) esses pares. O cadastro (US36) usa a mesma API.

Cada item pertence a um único exercício; não há catálogo compartilhado entre exercícios. A lista é opcional no exercício, mas, dentro de um item, o erro e a orientação são obrigatórios (RN22).

As telas do treinador que usam esta API estão descritas em `frontend/README.md`, na seção "Erros comuns e orientações corretivas (US37)".

### Acesso

As rotas usam `[*ROTA_PROTEGIDA, IsTreinador]` (`apps/contas/permissions.py`):

- sem autenticação: `401`;
- treinador ou aluno com termos pendentes: `403` com `code` `TERMOS_PENDENTES` (US63);
- aluno com termos aceitos: `403` (CA04, RN14, RNF08).

O exercício vem sempre da URL. Um exercício inexistente, ou um item acessado pelo exercício errado, responde `404`. Campos `exercicio` ou `id` enviados no corpo são ignorados.

### Rotas dos erros comuns

| Rota | Ação | Resposta de sucesso |
| --- | --- | --- |
| `GET /api/exercicios/<exercicio_id>/erros-comuns/` | Lista os itens do exercício, em ordem de criação | `200` com a lista de itens |
| `POST /api/exercicios/<exercicio_id>/erros-comuns/` | Cadastra um item (US36) | `201` com o item criado |
| `GET /api/exercicios/<exercicio_id>/erros-comuns/<id>/` | Consulta um item | `200` com o item |
| `PUT /api/exercicios/<exercicio_id>/erros-comuns/<id>/` | Edita o item; os dois campos são obrigatórios (CA01) | `200` com o item atualizado |
| `PATCH /api/exercicios/<exercicio_id>/erros-comuns/<id>/` | Edita só os campos enviados (CA01) | `200` com o item atualizado |
| `DELETE /api/exercicios/<exercicio_id>/erros-comuns/<id>/` | Remove o item **de forma definitiva** (CA02; "Remover orientação" e a confirmação "Remover orientação?" nas telas) | `204` sem corpo |

Corpo de `POST` e `PUT`:

```json
{ "erro": "Olhar somente para a bola.", "orientacao_corretiva": "Mantenha o olhar à frente durante o deslocamento." }
```

Item na resposta:

```json
{
  "id": 1,
  "erro": "Olhar somente para a bola.",
  "orientacao_corretiva": "Mantenha o olhar à frente durante o deslocamento.",
  "criado_em": "2026-11-25T10:09:43.361995-03:00",
  "atualizado_em": "2026-11-25T11:14:41.857730-03:00"
}
```

### Validação e erros

| Status | Quando | Corpo |
| --- | --- | --- |
| `400` | `erro` ou `orientacao_corretiva` ausente (no `POST` e no `PUT`), vazio, só com espaços ou com mais de 1000 caracteres | `{ "<campo>": ["mensagem"] }` |
| `401` | Requisição sem autenticação, ou token inválido ou vencido | `{ "detail": "..." }`; com token inválido ou vencido, também `code` `token_not_valid` |
| `403` | Aluno (`"Apenas treinadores podem fazer isso."`) ou termos pendentes (`code` `TERMOS_PENDENTES`) | `{ "detail": "..." }` |
| `404` | Exercício inexistente, item inexistente ou item de outro exercício | `{ "detail": "..." }` |

Os espaços nas pontas dos dois textos são removidos ao salvar.

### Consulta do exercício

`GET /api/exercicios/` e `GET /api/exercicios/<id>/` trazem o campo **somente leitura** `erros_orientacoes`, com os itens no formato acima. O `PUT`/`PATCH` do exercício (US39) ignora esse campo e nunca apaga itens. O campo de texto antigo `erros_comuns` continua no exercício, sem migração, por compatibilidade com a US39.

Criar, editar ou remover um item não altera o exercício (`atualizado_em` e `erros_comuns` ficam como estavam).

### Treinos já prescritos (RN23) — contrato para o RF2307

A prescrição de treinos ainda não existe. Quando for implementada, ela deve **copiar** os dados do exercício no momento da prescrição, usando `snapshot_exercicio(exercicio)` de `apps/exercicios/services.py`, e **não** referenciar o exercício nem os itens. É isso que garante que editar ou remover itens na biblioteca não altere treinos já prescritos, já que a remoção do item é definitiva.

A função devolve dados puros, sem ids e serializáveis em JSON:

```json
{
  "nome": "Drible com deslocamento",
  "objetivo": "Conduzir a bola em movimento",
  "fundamento": "DRIBLE",
  "fundamento_nome": "Drible",
  "orientacoes": "",
  "erros_comuns": "",
  "video_base": "",
  "erros_orientacoes": [
    { "erro": "Olhar somente para a bola.", "orientacao_corretiva": "Mantenha o olhar à frente durante o deslocamento." }
  ]
}
```

Para copiar vários exercícios sem uma consulta por exercício, carregue-os com `prefetch_related("erros_orientacoes")`. O teste integrado do CA03 (`test_ca03_treino_prescrito_mantem_orientacoes`, em `apps/exercicios/tests.py`) está marcado como pulado até o RF2307 existir e já traz o roteiro a seguir.
