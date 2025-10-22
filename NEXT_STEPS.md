# 🚀 Próximos Passos - Configuração Final

## ✅ O que foi corrigido:

1. ✅ Adicionadas colunas `role` e `avatar` ao schema do Prisma
2. ✅ Criada migração SQL para atualizar o banco de dados
3. ✅ Corrigido erro de tipo no `auth.module.ts` (expiresIn)
4. ✅ Corrigidos imports nos controllers (zod-validation-pipe)

## 📋 Comandos para executar no WSL (Ubuntu)

Como você está usando WSL, precisa executar os seguintes comandos **dentro do ambiente Ubuntu/WSL**, não no PowerShell do Windows:

### 1. Abrir o WSL
```bash
# No PowerShell, digite:
wsl
```

### 2. Navegar até o diretório do projeto
```bash
cd ~/projetos/personal-finance-api
```

### 3. Instalar as dependências (se ainda não instalou)
```bash
npm install
```

### 4. Gerar o Prisma Client com os novos tipos
```bash
npx prisma generate
```

### 5. Aplicar a migração ao banco de dados
```bash
npx prisma migrate deploy
```

**OU** se preferir criar a migração de forma interativa (em desenvolvimento):
```bash
npx prisma migrate dev
```

### 6. Configurar variáveis de ambiente
Certifique-se de que seu arquivo `.env` contém:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/personal_finance?schema=public"
PORT=3333
JWT_SECRET="seu-segredo-super-secreto-aqui-minimo-32-caracteres"
JWT_EXPIRES_IN="7d"
```

### 7. Iniciar o servidor
```bash
npm run start:dev
```

## 🧪 Testando a API

Depois que o servidor estiver rodando, você pode testar usando o arquivo `client.http`:

### 1. Registrar um novo usuário
```http
POST http://localhost:3333/accounts
Content-Type: application/json

{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "senha123"
}
```

### 2. Fazer login
```http
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "senha123"
}
```

### 3. Obter perfil (com o token recebido no login)
```http
GET http://localhost:3333/me
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📊 Estrutura das Novas Colunas

### Tabela `users` agora possui:
- `id` (UUID)
- `name` (String)
- `email` (String, unique)
- `password` (String, hasheado)
- ✨ **`role`** (String, default: "user") - NOVO
- ✨ **`avatar`** (String?, opcional) - NOVO
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 🔍 Verificando se deu certo

Para verificar se tudo está funcionando:

1. **Compilação TypeScript:**
   ```bash
   npm run build
   ```
   Não deve haver erros de tipo.

2. **Servidor em desenvolvimento:**
   ```bash
   npm run start:dev
   ```
   O servidor deve iniciar sem erros.

3. **Verificar o banco de dados:**
   ```bash
   npx prisma studio
   ```
   Abre uma interface visual para ver as tabelas e os dados.

## ⚠️ Troubleshooting

### Erro: "prisma not found"
```bash
npm install
```

### Erro: "Can't reach database server"
Certifique-se de que o PostgreSQL está rodando e a `DATABASE_URL` está correta.

### Erro de migração
Se houver problemas com a migração, você pode:
```bash
# Resetar o banco (CUIDADO: apaga todos os dados!)
npx prisma migrate reset

# Ou aplicar manualmente
npx prisma db push
```

### Banco de dados não tem as colunas novas
Execute a migração manualmente:
```sql
-- Conecte no PostgreSQL e execute:
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
ALTER TABLE "users" ADD COLUMN "avatar" TEXT;
```

## 📚 Documentação

Consulte os seguintes arquivos para mais informações:
- `AUTH_GUIDE.md` - Guia completo de autenticação JWT
- `JWT_IMPLEMENTATION_SUMMARY.md` - Resumo da implementação
- `client.http` - Exemplos de requisições HTTP

## ✅ Checklist de Configuração

- [ ] Executar `npm install` no WSL
- [ ] Configurar `.env` com as variáveis necessárias
- [ ] Executar `npx prisma generate`
- [ ] Executar `npx prisma migrate deploy` ou `npx prisma migrate dev`
- [ ] Iniciar o servidor com `npm run start:dev`
- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Testar rota protegida (`/me`)

---

🎉 **Após completar estes passos, sua API estará com autenticação JWT totalmente funcional!**

