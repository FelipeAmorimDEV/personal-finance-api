# ✅ Endpoint de Listagem de Transações

## 📋 Implementação Completa

Foi criado um endpoint completo para listar transações com filtros avançados, seguindo a arquitetura DDD do projeto.

## 🎯 Endpoint

### **GET** `/transactions`

**Requer autenticação:** ✅ Sim (JWT Token)

**Query Parameters (todos opcionais):**
- `month` (number) - Filtrar por mês (1-12)
- `year` (number) - Filtrar por ano (ex: 2025)
- `type` (string) - Filtrar por tipo: `income` ou `expense`
- `categoryId` (string) - Filtrar por categoria específica
- `accountId` (string) - Filtrar por conta específica

**Resposta:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "amount": 70.00,
      "type": "expense",
      "description": "IFood",
      "date": "2025-10-13T00:00:00.000Z",
      "accountId": "uuid",
      "categoryId": "uuid",
      "createdAt": "2025-10-13T00:00:00.000Z",
      "updatedAt": "2025-10-13T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

## 📁 Arquivos Criados/Modificados

### ✨ Criados:

1. **`src/domain/application/usecases/list-transactions.ts`**
   - Caso de uso para listar transações com filtros
   - Retorna transações e total

2. **`src/infra/http/controllers/list-transactions.controller.ts`**
   - Controller NestJS
   - Usa `@CurrentUser()` para pegar o ID do usuário autenticado
   - Converte query params em formato correto
   - Mapeia entidades de domínio para resposta HTTP

### 🔧 Modificados:

1. **`src/domain/application/repositories/transactions-repository.ts`**
   - Adicionado interface `FindManyTransactionsParams`
   - Adicionado método abstrato `findManyWithFilters`

2. **`src/infra/database/prisma/repositories/prisma-transactions-repository.ts`**
   - Implementado método `findManyWithFilters`
   - Lógica de filtro por:
     - userId (através da relação com account)
     - Mês e ano (range de datas)
     - Tipo (income/expense)
     - CategoryId
     - AccountId
   - Ordenação por data (mais recentes primeiro)

3. **`src/infra/http/http.module.ts`**
   - Registrado `ListTransactionsController`
   - Registrado `ListTransactionsUseCase`

4. **`client.http`**
   - Adicionados 4 exemplos de uso do endpoint

## 🔍 Funcionalidades Implementadas

### 1. **Filtragem por Período**
```http
GET /transactions?month=10&year=2025
```
Retorna todas as transações de outubro de 2025.

### 2. **Filtragem por Tipo**
```http
GET /transactions?type=expense
```
Retorna apenas despesas.

### 3. **Filtragem por Categoria**
```http
GET /transactions?categoryId=uuid-da-categoria
```
Retorna transações de uma categoria específica.

### 4. **Filtragem por Conta**
```http
GET /transactions?accountId=uuid-da-conta
```
Retorna transações de uma conta específica.

### 5. **Filtros Combinados**
```http
GET /transactions?month=10&year=2025&type=expense&categoryId=uuid
```
Todos os filtros podem ser combinados.

### 6. **Listagem Completa**
```http
GET /transactions
```
Sem filtros, retorna todas as transações do usuário autenticado.

## 🔐 Segurança

- ✅ **Autenticação obrigatória** - Usa JWT guard
- ✅ **Isolamento por usuário** - Apenas transações do usuário autenticado são retornadas
- ✅ **Validação de propriedade** - Filtra através da relação `account.userId`

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│                  fetchTransactions(params)                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              GET /transactions?filters                       │
│              Authorization: Bearer <token>                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ListTransactionsController                      │
│  - Extrai userId do token (@CurrentUser)                    │
│  - Valida e converte query params                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ListTransactionsUseCase                         │
│  - Lógica de negócio                                        │
│  - Chama repositório com filtros                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         PrismaTransactionsRepository                         │
│  - findManyWithFilters()                                    │
│  - Constrói query Prisma com filtros                        │
│  - Filtra por userId via relação                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
│              SELECT * FROM transactions                      │
│              JOIN accounts ON ...                            │
│              WHERE account.userId = ? AND ...                │
└─────────────────────────────────────────────────────────────┘
```

## 📝 Exemplos de Uso

### Exemplo 1: Listar todas as transações
```bash
curl -X GET http://localhost:3333/transactions \
  -H "Authorization: Bearer seu-token-jwt"
```

### Exemplo 2: Despesas de outubro de 2025
```bash
curl -X GET "http://localhost:3333/transactions?month=10&year=2025&type=expense" \
  -H "Authorization: Bearer seu-token-jwt"
```

### Exemplo 3: Transações de uma categoria específica
```bash
curl -X GET "http://localhost:3333/transactions?categoryId=uuid-categoria" \
  -H "Authorization: Bearer seu-token-jwt"
```

### Exemplo 4: Usando o arquivo client.http
Basta usar a extensão REST Client do VS Code e executar qualquer uma das requisições no arquivo `client.http`:

```http
# @name list_transactions_filtered
GET {{baseUrl}}/transactions?month=10&year=2025&type=expense
Authorization: Bearer {{authenticate.response.body.access_token}}
```

## ✅ Checklist de Implementação

- ✅ Caso de uso criado (`list-transactions.ts`)
- ✅ Controller criado (`list-transactions.controller.ts`)
- ✅ Método de repositório implementado (`findManyWithFilters`)
- ✅ Interface de filtros definida (`FindManyTransactionsParams`)
- ✅ Registrado no HttpModule
- ✅ Exemplos de uso no client.http
- ✅ Filtros por mês/ano funcionando
- ✅ Filtros por tipo funcionando
- ✅ Filtros por categoria funcionando
- ✅ Filtros por conta funcionando
- ✅ Autenticação JWT integrada
- ✅ Isolamento de dados por usuário
- ✅ Ordenação por data (mais recentes primeiro)

## 🚀 Testando

1. **Inicie o servidor:**
   ```bash
   npm run start:dev
   ```

2. **Faça login para obter o token:**
   ```bash
   POST http://localhost:3333/sessions
   ```

3. **Use o token para listar transações:**
   ```bash
   GET http://localhost:3333/transactions
   Authorization: Bearer <seu-token>
   ```

## 🎉 Resultado

Endpoint completamente funcional e integrado com o frontend! Todos os filtros da action do Next.js estão suportados no backend. 🚀

