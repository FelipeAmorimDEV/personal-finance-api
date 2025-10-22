# ✅ Correção: Problema de "Unauthorized"

## 🔧 Correções Aplicadas

### 1. **Adicionado Reflector ao AppModule**
O `JwtAuthGuard` precisa do `Reflector` para verificar se uma rota é pública.

**Antes:**
```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
]
```

**Depois:**
```typescript
providers: [
  Reflector,  // ← ADICIONADO
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
]
```

### 2. **Melhorado tratamento de erros no JwtAuthGuard**
Adicionado o método `handleRequest` para melhor feedback de erros.

```typescript
handleRequest(err: any, user: any, info: any) {
  if (err || !user) {
    throw err || new UnauthorizedException('Invalid token');
  }
  return user;
}
```

### 3. **Criado endpoint de debug**
Novo endpoint para testar e validar tokens JWT.

```http
GET /debug/token
Authorization: Bearer SEU_TOKEN_AQUI
```

## 🧪 Como Testar Agora

### Passo 1: Reinicie o servidor
```bash
npm run start:dev
```

### Passo 2: Faça login para obter um token NOVO
```http
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "sua-senha"
}
```

### Passo 3: Teste o token no endpoint de debug
```http
GET http://localhost:3333/debug/token
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta esperada (token válido):**
```json
{
  "status": "valid",
  "decoded": {
    "sub": "uuid-do-usuario",
    "iat": 1234567890,
    "exp": 1234567890
  },
  "expiresIn": "604800 seconds",
  "expiresAt": "2025-10-29T00:00:00.000Z"
}
```

**Se retornar "invalid":**
- Verifique se o `JWT_SECRET` no `.env` está configurado
- Faça login novamente para obter um token novo
- Certifique-se de que copiou o token completo

### Passo 4: Teste em uma rota protegida
```http
GET http://localhost:3333/transactions
Authorization: Bearer SEU_TOKEN_AQUI
```

## ⚠️ Problema Identificado no Seu Token

Analisando o token que você usou:
```
exp: 1761107213
iat: 1761107206
```

**Problema:** O token expira em apenas **7 segundos** após ser gerado!

Isso sugere que:
1. O `JWT_EXPIRES_IN` pode não estar configurado corretamente
2. Ou o token foi gerado com configuração incorreta

### Solução:

1. **Verifique seu arquivo `.env`:**
   ```env
   JWT_SECRET="seu-segredo-forte-aqui-minimo-32-caracteres"
   JWT_EXPIRES_IN="7d"  # ← Certifique-se que está assim
   ```

2. **Reinicie o servidor** após alterar o `.env`

3. **Faça login novamente** para obter um token com a validade correta

4. **Teste o novo token** no endpoint de debug

## 📋 Checklist Rápido

- [ ] Reiniciar o servidor (`npm run start:dev`)
- [ ] Verificar `.env` (JWT_SECRET e JWT_EXPIRES_IN)
- [ ] Fazer login novamente
- [ ] Copiar o token da resposta
- [ ] Testar no endpoint de debug (`GET /debug/token`)
- [ ] Testar em rota protegida

## 🎯 Usando o client.http Atualizado

O arquivo `client.http` foi atualizado com o endpoint de debug:

```http
### 1. Login
# @name authenticate
POST {{baseUrl}}/sessions
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "senha123"
}

### 2. Debug do token
GET {{baseUrl}}/debug/token
Authorization: Bearer {{authenticate.response.body.access_token}}

### 3. Testar rota protegida
GET {{baseUrl}}/transactions
Authorization: Bearer {{authenticate.response.body.access_token}}
```

O REST Client do VS Code automaticamente usa o token do login nas requisições seguintes! 🎉

## 📚 Documentação

Criei um guia completo de troubleshooting: **`JWT_TROUBLESHOOTING.md`**

## ✅ Status

- ✅ Reflector adicionado ao AppModule
- ✅ HandleRequest implementado no JwtAuthGuard  
- ✅ Endpoint de debug criado (`/debug/token`)
- ✅ client.http atualizado
- ✅ Documentação de troubleshooting criada

**Agora o problema de "Unauthorized" deve estar resolvido!** 🚀

Se ainda tiver problemas:
1. Use o endpoint `/debug/token` para investigar
2. Consulte o `JWT_TROUBLESHOOTING.md`
3. Verifique os logs do servidor

