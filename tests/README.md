# Verificação visual do Pages

Esta suíte opcional verifica a prévia local do MkDocs em desktop, celular, temas claro/escuro e sem JavaScript. Requer Node.js, Google Chrome, Playwright e Sharp.

Nesta pasta, instale as dependências de teste com `npm install`. Inicie a prévia do MkDocs na raiz do repositório e execute:

```sh
npm run test:visual -- http://127.0.0.1:8000/
```

Use a URL real da prévia, incluindo o caminho do projeto quando houver. A suíte fica separada dos testes Python porque o navegador é opcional para quem edita a documentação.
