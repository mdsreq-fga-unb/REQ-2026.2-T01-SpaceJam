# SpaceJam

[![UnB](https://img.shields.io/badge/UnB-FGA-blue)](https://fga.unb.br/)
[![Requisitos de Software](https://img.shields.io/badge/Requisitos--de--Software-2026.2-brightgreen)](#)

**Projeto da Disciplina de Requisitos de Software (2026.2)**  
**Universidade de Brasília (UnB) — Campus Faculdade do Gama (FGA)**  
**Docente:** Prof. Dr. George Marsicano

---

## 🚀 Sobre o Projeto

O **SpaceJam** é uma solução digital desenvolvida para apoiar a gestão e o acompanhamento de atletas de basquete orientados pelo treinador Lucas Cordeiro (`@cordeirotrainer`). O sistema resolve a fragmentação de registros mantidos em notas, documentos e cadernos, centralizando em um só lugar o perfil dos atletas, histórico de testes físicos (altura, envergadura, standing reach, jump height), evolução técnica, lesões e planejamento de treinos.

---

## 👥 Equipe de Desenvolvimento

| Foto | Nome | GitHub |
| :--: | :-- | :--: |
| <img src="https://github.com/juliaamandasl.png" width="80" alt="Julia Amanda" style="border-radius: 50%;"> | [Julia Amanda](https://github.com/juliaamandasl) | [@juliaamandasl](https://github.com/juliaamandasl) |
| <img src="https://github.com/luussato1.png" width="80" alt="Luiz Henrique" style="border-radius: 50%;"> | [Luiz Henrique](https://github.com/luussato1) | [@luussato1](https://github.com/luussato1) |
| <img src="https://github.com/Guilherme-Reis-Mendes.png" width="80" alt="Guilherme Mendes" style="border-radius: 50%;"> | [Guilherme Mendes](https://github.com/Guilherme-Reis-Mendes) | [@Guilherme-Reis-Mendes](https://github.com/Guilherme-Reis-Mendes) |
| <img src="https://github.com/Paulosrsr.png" width="80" alt="Paulo Sérgio" style="border-radius: 50%;"> | [Paulo Sérgio](https://github.com/Paulosrsr) | [@Paulosrsr](https://github.com/Paulosrsr) |
| <img src="https://github.com/code-silva.png" width="80" alt="Anderson Fernandes" style="border-radius: 50%;"> | [Anderson Fernandes](https://github.com/code-silva) | [@code-silva](https://github.com/code-silva) |
| <img src="https://github.com/OliveiraThiago14.png" width="80" alt="Thiago Oliveira" style="border-radius: 50%;"> | [Thiago Oliveira](https://github.com/OliveiraThiago14) | [@OliveiraThiago14](https://github.com/OliveiraThiago14) | |

---

## 🔗 Links Úteis e Documentação

* 🌐 **Site da Documentação (GitHub Pages):** [Acessar Documentação Completa](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-SpaceJam/)
* 📄 **Visão do Produto e Projeto:** Disponível na aba de Capítulos do nosso site MkDocs.
* 🤝 **Cliente Parceiro:** Lucas Cordeiro (Treinador de Basquete)
* 📸 **Instagram do Cliente:** [@cordeirotrainer](https://www.instagram.com/cordeirotrainer/)

---

## 📁 Estrutura do Repositório

```text
.
├── .github/
│   └── workflows/                # Automações e pipelines de CI/CD (deploy)
├── docs/                         # Código-fonte da documentação (arquivos Markdown e assets)
├── README.md                     # Apresentação principal do repositório
├── mkdocs.yml                    # Arquivo de configuração do MkDocs
└── requirements.txt              # Dependências Python para execução do MkDocs
```

---

## 📌 Como Executar a Documentação Localmente

### Pré-requisitos

* **Python 3.10 ou superior**
* **pip e virtualenv**

### Passo a Passo

1. **Clone o repositório:**

```bash
git clone [https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam.git](https://github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam.git)
cd REQ-2026.2-T01-SpaceJam
```

2. **Crie e ative um ambiente virtual:**

```bash
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

3. **Instale as dependências:**

```bash
pip install -r requeriments.txt
```

4. **Inicie o servidor de desenvolvimento do MkDocs:**

```bash
mkdocks serve
```

Acesse a documentação no navegador através do endereço: http://127.0.0.1:8000/.


