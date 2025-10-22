# 🔧 Troubleshooting JWT - Unauthorized Error

## ❌ Problema: "Unauthorized" ao acessar rotas protegidas

### 🔍 Causas Comuns

#### 1. **Token Expirado** ⏰
O token JWT tem um tempo de expiração. Verifique se seu token ainda é válido.

**Sintoma:** Token funcionava antes, mas agora retorna 401 Unauthorized.

**Solução:**
```bash
# Faça login novamente para obter um novo token
POST http://localhost:3333/sessions
```

#### 2. **JWT_SECRET Diferente** 🔑
O `JWT_SECRET` usado para gerar o token deve ser o mesmo usado para validá-lo.

**Sintoma:** Erro logo após gerar o token.

**Solução:**
1. Verifique o arquivo `.env`:
   ```env
   JWT_SECRET="seu-segredo-aqui"
   ```
2. Reinicie o servidor após alterar o `.env`
3. Gere um novo token

#### 3. **Formato do Token Incorreto** 📝
O header deve estar no formato correto.

**Sintoma:** Sempre retorna 401, mesmo com token novo.

**Formato Correto:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Formatos ERRADOS:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ❌ (faltando "Bearer ")
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...        ❌ (faltando "Authorization:")
```

#### 4. **Payload do Token Inválido** 🎯
O token precisa ter o campo `sub` como UUID válido.

**Sintoma:** Erro de validação mesmo com token válido.

**Verificar:** O token deve conter:
```json
{
  "sub": "uuid-do-usuario",  // Deve ser um UUID válido
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 🛠️ Ferramentas de Debug

### 1. Endpoint de Debug
Use o endpoint criado para verificar seu token:

```http
GET http://localhost:3333/debug/token
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta se o token for válido:**
```json
{
  "status": "valid",
  "decoded": {
    "sub": "uuid-do-usuario",
    "iat": 1234567890,
    "exp": 1234567890
  },
  "expiresIn": "604800 seconds",
  "expiresAt": "2025-10-29T00:00:00.000Z",
  "issuedAt": "2025-10-22T00:00:00.000Z",
  "now": "2025-10-22T03:30:00.000Z"
}
```

**Resposta se o token for inválido:**
```json
{
  "status": "invalid",
  "error": "jwt expired / jwt malformed / invalid signature",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Decodificar Token Online
Use [jwt.io](https://jwt.io) para decodificar e inspecionar o token:
1. Cole seu token
2. Verifique o payload
3. Confirme que `sub` é um UUID válido
4. Verifique a data de expiração (`exp`)

### 3. Logs do Servidor
Ative logs detalhados no NestJS:

```typescript
// src/infra/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'], // ← Adicione isso
  });
  // ...
}
```

## ✅ Checklist de Verificação

Execute este checklist passo a passo:

- [ ] **1. O servidor está rodando?**
  ```bash
  npm run start:dev
  ```

- [ ] **2. O `.env` tem `JWT_SECRET` configurado?**
  ```bash
  cat .env | grep JWT_SECRET
  ```

- [ ] **3. O token é recente?**
  - Faça login novamente para obter um token novo
  - Tokens expiram após o tempo definido em `JWT_EXPIRES_IN`

- [ ] **4. O header está no formato correto?**
  - Deve começar com `Authorization: Bearer `
  - Deve ter exatamente um espaço após "Bearer"

- [ ] **5. Teste o token no endpoint de debug:**
  ```http
  GET http://localhost:3333/debug/token
  Authorization: Bearer SEU_TOKEN_AQUI
  ```

- [ ] **6. A rota não está marcada como `@Public()`?**
  - Rotas com `@Public()` não precisam de token
  - Verifique se você não adicionou acidentalmente

## 🔄 Passo a Passo: Obter Token Novo

1. **Faça login:**
   ```http
   POST http://localhost:3333/sessions
   Content-Type: application/json

   {
     "email": "seu@email.com",
     "password": "sua-senha"
   }
   ```

2. **Copie o token da resposta:**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

3. **Use o token nas requisições:**
   ```http
   GET http://localhost:3333/transactions
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🐛 Problemas Específicos

### "jwt expired"
**Causa:** O token passou do tempo de expiração.

**Solução:** Faça login novamente para obter um novo token.

### "jwt malformed"
**Causa:** O token está corrompido ou incompleto.

**Solução:** 
1. Verifique se copiou o token completo
2. Certifique-se de não ter espaços extras
3. Gere um novo token

### "invalid signature"
**Causa:** O `JWT_SECRET` usado para gerar o token é diferente do atual.

**Solução:**
1. Confirme o `JWT_SECRET` no `.env`
2. Reinicie o servidor
3. Faça login novamente para obter um novo token

### "Invalid token"
**Causa:** O payload do token não passou na validação.

**Solução:**
1. Verifique se o campo `sub` é um UUID válido
2. Use o endpoint de debug para ver o conteúdo do token
3. Gere um novo token fazendo login

## 📝 Exemplo Completo Funcionando

```http
### 1. Fazer login
# @name login
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "teste@example.com",
  "password": "123456"
}

### 2. Testar o token (debug)
GET http://localhost:3333/debug/token
Authorization: Bearer {{login.response.body.access_token}}

### 3. Usar o token em rota protegida
GET http://localhost:3333/transactions
Authorization: Bearer {{login.response.body.access_token}}
```

## 🚀 Configuração Recomendada do .env

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/personal_finance"

# Server
PORT=3333

# JWT (IMPORTANTE!)
JWT_SECRET="meu-super-segredo-forte-com-pelo-menos-32-caracteres-aqui"
JWT_EXPIRES_IN="7d"  # Token expira em 7 dias
```

## 💡 Dicas

1. **Use o REST Client do VS Code** - Ele permite usar variáveis e reutilizar o token automaticamente
2. **Não compartilhe seu JWT_SECRET** - Mantenha seguro e diferente em cada ambiente
3. **Configure tokens de longa duração em desenvolvimento** - Use `JWT_EXPIRES_IN="30d"` para facilitar
4. **Em produção, use tokens de curta duração** - `JWT_EXPIRES_IN="15m"` ou `"1h"` é mais seguro
5. **Implemente refresh tokens** - Para sessões longas sem reautenticação constante

## ❓ Ainda com problemas?

1. Teste o endpoint de debug: `GET /debug/token`
2. Verifique os logs do servidor
3. Use jwt.io para inspecionar o token
4. Certifique-se de que o Reflector está registrado no AppModule (já corrigido)
5. Gere um novo token e teste imediatamente

---

**Correções aplicadas neste troubleshooting:**
- ✅ Adicionado `Reflector` ao `AppModule`
- ✅ Melhorado `handleRequest` no `JwtAuthGuard`
- ✅ Criado endpoint de debug `/debug/token`
- ✅ Adicionado melhor tratamento de erros

