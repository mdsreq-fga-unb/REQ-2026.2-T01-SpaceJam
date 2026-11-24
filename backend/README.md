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

Os rascunhos dos Termos de Uso e da Política de Privacidade ficam em `docs/legal/`. Eles estão no `exclude_docs` do `mkdocs.yml` e não são publicados até a aprovação formal. Enquanto isso, as rotas `/termos-de-uso` e `/politica-de-privacidade` do frontend exibem um aviso de rascunho provisório.
