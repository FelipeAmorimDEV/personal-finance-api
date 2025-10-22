# 🧪 Teste: Criar Categoria

## ❌ O Problema Atual

Você está recebendo erro:
```json
{
  "errors": {
    "name": "ZodValidationError",
    "details": [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": ["name"],
        "message": "Required"
      }
    ]
  }
}
```

**Causa:** Você está testando no Render que tem código antigo!

## ✅ Solução: Testar Localmente PRIMEIRO

### 1. Rode o servidor localmente
```bash
npm run start:dev
```

### 2. Altere o baseUrl no client.http
```http
# @baseUrl = https://personal-finance-api-t2j1.onrender.com
@baseUrl = http://localhost:3333
```

### 3. Teste o fluxo completo

#### Passo 1: Criar usuário
```http
POST http://localhost:3333/accounts
Content-Type: application/json

{
  "name": "Teste Usuario",
  "email": "teste@example.com",
  "password": "123456"
}
```

#### Passo 2: Fazer login
```http
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "teste@example.com",
  "password": "123456"
}
```

**Copie o `access_token` da resposta!**

#### Passo 3: Criar categoria com o token
```http
POST http://localhost:3333/categories
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI

{
  "name": "Food",
  "description": "Food category",
  "color": "#FF6B6B",
  "icon": "🍔"
}
```

**Deve funcionar!** ✅

## 🐛 Debug: Por que o Render não funciona?

O servidor no Render está rodando **código antigo** que:
- ❌ Não tem as correções do Reflector
- ❌ Não tem o endpoint de health
- ❌ Não tem os logs de debug
- ❌ Pode ter problemas com rotas públicas

## 📝 Checklist para Funcionar

### Local (FAÇA ISSO PRIMEIRO):
- [ ] `npm run start:dev` rodando
- [ ] `@baseUrl = http://localhost:3333` no client.http
- [ ] Criar usuário → OK
- [ ] Fazer login → OK  
- [ ] Copiar token
- [ ] Criar categoria com token → OK

### Render (DEPOIS):
- [ ] Commit do código
- [ ] Push para repositório
- [ ] Aguardar deploy automático
- [ ] `GET /health` retorna versão nova
- [ ] Testar criar categoria

## 🔍 Verificando Headers

Certifique-se que sua requisição tem:

```http
POST http://localhost:3333/categories
Content-Type: application/json                    ← IMPORTANTE!
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...  ← TOKEN VÁLIDO

{
  "name": "Food",        ← Campo obrigatório
  "description": "..."
}
```

## ⚠️ Erros Comuns

### 1. "name" is required
**Causa:** Content-Type não é `application/json`
**Solução:** Adicione o header `Content-Type: application/json`

### 2. "Invalid token"
**Causa:** Token expirado ou inválido
**Solução:** Faça login novamente e copie o novo token

### 3. Ainda não funciona no Render
**Causa:** Código antigo no servidor
**Solução:** 
1. Teste localmente para confirmar que funciona
2. Faça commit e push
3. Aguarde deploy
4. Teste novamente

## 🚀 Usando REST Client (VS Code)

Com a extensão REST Client, você pode usar variáveis:

```http
### 1. Login
# @name login
POST {{baseUrl}}/sessions
Content-Type: application/json

{
  "email": "teste@example.com",
  "password": "123456"
}

### 2. Criar categoria (usa o token automaticamente!)
POST {{baseUrl}}/categories
Content-Type: application/json
Authorization: Bearer {{login.response.body.access_token}}

{
  "name": "Food",
  "description": "Food category",
  "color": "#FF6B6B",
  "icon": "🍔"
}
```

O REST Client automaticamente pega o token do login! 🎉

## 📊 Resposta Esperada (Sucesso)

```json
{
  "category": {
    "id": "uuid-aqui",
    "name": "Food",
    "description": "Food category",
    "userId": "uuid-do-usuario",
    "color": "#FF6B6B",
    "icon": "🍔",
    "createdAt": "2025-10-22T05:44:22.000Z"
  }
}
```

## 💡 Dica Final

**SEMPRE teste localmente antes de testar em produção!**

1. ✅ Local funcionando
2. ✅ Commit + Push
3. ✅ Deploy
4. ✅ Testar produção

Não pule direto para produção! 🚀

