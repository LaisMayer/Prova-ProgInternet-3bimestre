# README — Erros encontrados (APENAS LISTA DE ERROS)



## Resumo geral

O projeto apresenta problemas de compatibilidade de módulos (ESM vs CommonJS), uso incorreto de bibliotecas de autenticação (JWT), armazenamento inseguro de senhas, rotas montadas de forma errada e ausência de helpers confiáveis para leitura/escrita do `db.json`. Muitos problemas são de segurança (alto) e alguns são de organização/estrutura (médio).

---

## Lista de erros por área / arquivo

### 1) `package.json` — inconsitência de módulos

* **Problema**: `type: "module"` sinaliza ESM, mas o código usa `module.exports`/`require` em alguns arquivos.
* **Gravidade**: Alta (impede a aplicação de rodar).
* **Correção sugerida (conceitual)**: Padronizar: ou ESM (`import`/`export`) ou CommonJS (`require`/`module.exports`) em todo o projeto.

### 2) `server.js`

* **Problemas**:

  * Rotas montadas com caminhos incorretos (ex.: `app.use("routes/", ...)` em vez de `app.use('/auth', authRoutes)`);
  * Possível ausência de `express.json()` ou `body-parser` configurado corretamente (corpo de requisições não sendo parseado);
  * Imports/exports incompatíveis com o padrão do projeto.
* **Gravidade**: Alta (rota não funciona / requisições sem body).
* **Correção sugerida**: Padronizar imports e montar rotas com paths corretos; garantir `app.use(express.json())`.

### 3) `routes/` (auth.js e users.js)

* **Problemas**:

  * Responsabilidades trocadas: endpoints de autenticação e CRUD de usuários misturados ou nomeados de forma confusa;
  * Falta de proteção das rotas que devem ser protegidas (não aplicam middleware de auth).
* **Gravidade**: Alta (pode permitir acesso não autorizado ou falha nas rotas esperadas pelo professor).
* **Correção sugerida**: Organizar rotas: `POST /auth/register`, `POST /auth/login`; e `GET/PUT/DELETE /users` protegidas por middleware.

### 4) `controllers/authController.js`

* **Problemas**:

  * Uso misto de bibliotecas JWT (ex.: `jwt-simple` junto com `jsonwebtoken`) ou uso incorreto da API da biblioteca;
  * Leitura do segredo JWT feita de forma errada (tentativa de `import` do `process.env` ou uso de valor indefinido);
  * Token sem tempo de expiração configurado corretamente ou expiração não respeitada;
  * Senhas comparadas em texto puro (sem `bcrypt`) em alguns trechos.
* **Gravidade**: Muito alta (falha de segurança / autenticação quebrada).
* **Correção sugerida**: Usar **uma** biblioteca (recomendado: `jsonwebtoken`) e `bcryptjs` para hash/compare; usar `process.env.JWT_SECRET` com fallback seguro apenas em dev; garantir `expiresIn: '1h'`.

### 5) `controllers/usersController.js`

* **Problemas**:

  * Exposição do hash de senha nas respostas (retorna `senha` junto com user);
  * `update` e `delete` sem validação de permissões (qualquer usuário autenticado pode alterar qualquer outro);
  * Escrita no `db.json` sem await/consistência (pode haver escrita parcial/concorrência);
  * Uso inconsistente de `async/await` e callbacks; em alguns pontos o `write` não é aguardado.
* **Gravidade**: Alta (privacidade e integridade dos dados comprometidos).
* **Correção sugerida**: Nunca retornar o campo `senha`; validar permissões; sempre aguardar gravação no disco antes de responder; usar rota/controle de acesso.

### 6) `utils/db.js` (ou falta dele)

* **Problemas**:

  * Helpers de leitura/escrita não existem ou estão espalhados com código duplicado;
  * Uso incorreto de caminhos (`__dirname` em ESM sem o `fileURLToPath`), levando a erro de arquivo não encontrado;
  * Nenhuma inicialização do `db.json` caso o arquivo não exista.
* **Gravidade**: Média (provoca falhas ao iniciar e dificulta manutenção).
* **Correção sugerida**: Criar funções `readDb()` e `writeDb()` que tratem arquivo inexistente, parse seguro e escrita atomizada.

### 7) `middleware/auth.js`

* **Problemas**:

  * Token parsing frágil (não checa se Authorization começa com `Bearer`);
  * Mensagens de erro genéricas ou respostas com status incorretos;
  * Verificação do token pode estar usando segredo errado ou função de verificação inadequada.
* **Gravidade**: Alta (rota protegida pode ficar aberta ou sempre negar acesso).
* **Correção sugerida**: Implementar verificação robusta: checar header, extrair token, `jwt.verify(token, SECRET)` e propagar `req.user`.

### 8) `db.json` — persistência e segurança

* **Problemas**:

  * Senhas armazenadas em texto simples ou hashes expostos;
  * Ausência de `.gitignore` para evitar comitar `db.json` com dados reais;
  * Estrutura inconsistente de objetos (campos faltando em alguns registros).
* **Gravidade**: Muito alta (dados sensíveis expostos e risco de vazamento no controle de versão).
* **Correção sugerida**: Armazenar apenas hash de senha; adicionar `db.json` ao `.gitignore`; padronizar esquema de usuário.

### 9) Erros de resposta HTTP e mensagens

* **Problemas**:

  * Códigos HTTP inconsistentes (ex.: retornar 200 em falha de autenticação ou 500 quando deveria ser 400/401);
  * Mensagens de erro pouco informativas ou muito verbosas (expor stack trace).
* **Gravidade**: Média.
* **Correção sugerida**: Usar códigos corretos: 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 409 (conflict).

### 10) Concor­rência e integridade das escritas no arquivo

* **Problemas**:

  * Múltiplas requisições de escrita podem sobrescrever mudanças (não há lock nem controle);
  * `writeFile` sem estratégia atômica (risco de arquivo corrompido).
* **Gravidade**: Média-alta (dados podem ser perdidos/corrompidos).
* **Correção sugerida**: Serializar escritas (fila simples) ou usar banco leve (SQLite) para concorrência.

### 11) Validações e sanitização de entradas

* **Problemas**:

  * Falta de validação de `email`, `senha` e `nome` (aceita entradas vazias ou inválidas);
  * Ausência de sanitização (risco de injeção em outros contextos).
* **Gravidade**: Média.
* **Correção sugerida**: Validar formato de email, tamanho mínimo de senha; sanitizar strings.

### 12) Boas práticas faltantes

* **Problemas**:

  * Segredo JWT codificado no código (inseguro);
  * Falta de `.env` e de instruções claras para variáveis de ambiente;
  * Falta de tratamento de erros globais (middleware de erro);
  * Ausência de testes automatizados ou coleções Thunder Client organizadas.
* **Gravidade**: Média.
* **Correção sugerida**: Usar variáveis de ambiente, criar arquivo `.env.example`, adicionar middleware de erro e criar coleção de testes para Thunder Client.

---
