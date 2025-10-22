# Guia de Autenticação JWT

## Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
JWT_SECRET="seu-segredo-super-secreto-aqui"
JWT_EXPIRES_IN="7d"  # Token expira em 7 dias
```

### 2. Instalação das Dependências

```bash
npm install
```

## Endpoints da API

### Registro de Usuário

```http
POST /accounts
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "User created successfully"
}
```

### Login (Autenticação)

```http
POST /sessions
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Obter Perfil do Usuário (Requer autenticação)

```http
GET /me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user",
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Uso em Controllers

### Rotas Protegidas (Padrão)

Por padrão, todas as rotas são protegidas e requerem autenticação JWT:

```typescript
import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/protected")
export class ProtectedController {
  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    // O usuário está automaticamente autenticado
    console.log(user.sub); // ID do usuário
    
    return {
      message: "Esta rota é protegida!",
      userId: user.sub
    };
  }
}
```

### Rotas Públicas

Use o decorator `@Public()` para rotas que não requerem autenticação:

```typescript
import { Controller, Get } from "@nestjs/common";
import { Public } from "@/infra/auth/public";

@Controller("/public")
@Public() // Aplica a toda a classe
export class PublicController {
  @Get()
  async handle() {
    return {
      message: "Esta rota é pública!"
    };
  }
}
```

Ou aplique apenas a métodos específicos:

```typescript
import { Controller, Get, Post } from "@nestjs/common";
import { Public } from "@/infra/auth/public";

@Controller("/mixed")
export class MixedController {
  @Get()
  @Public() // Apenas este método é público
  async publicMethod() {
    return { message: "Público" };
  }

  @Post()
  async protectedMethod() {
    return { message: "Protegido" };
  }
}
```

## Estrutura da Implementação

### Camada de Domínio

- **Use Cases:**
  - `authenticate-user.ts` - Autenticação de usuários
  - `register-user.ts` - Registro de novos usuários

- **Repositories (Abstrações):**
  - `encrypter.ts` - Interface para criptografia JWT
  - `hash-comparer.ts` - Interface para comparação de hash
  - `hash-generator.ts` - Interface para geração de hash

### Camada de Infraestrutura

- **Auth Module:**
  - `auth.module.ts` - Configuração do módulo de autenticação
  - `jwt.strategy.ts` - Estratégia de validação JWT
  - `jwt-auth.guard.ts` - Guard para proteção de rotas
  - `public.ts` - Decorator para rotas públicas
  - `current-user-decorator.ts` - Decorator para obter usuário atual

- **Cryptography Module:**
  - `cryptography.module.ts` - Módulo de criptografia
  - `jwt-encrypter.ts` - Implementação do encrypter usando JWT
  - `bcrypt-hasher.ts` - Implementação do hasher usando bcrypt

- **Controllers:**
  - `authenticate.controller.ts` - Login
  - `register.controller.ts` - Registro
  - `get-profile.controller.ts` - Perfil do usuário

## Fluxo de Autenticação

1. **Registro:**
   - Usuário envia dados para `/accounts`
   - Senha é hasheada com bcrypt
   - Usuário é salvo no banco de dados

2. **Login:**
   - Usuário envia credenciais para `/sessions`
   - Sistema verifica email e senha
   - Se válido, retorna um token JWT

3. **Acesso a Rotas Protegidas:**
   - Cliente envia token no header `Authorization: Bearer <token>`
   - `JwtAuthGuard` intercepta a requisição
   - `JwtStrategy` valida o token
   - Se válido, usuário é anexado à request
   - Controller pode acessar dados do usuário via `@CurrentUser()`

## Testando com curl

```bash
# Registrar usuário
curl -X POST http://localhost:3333/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","password":"senha123"}'

# Fazer login
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Acessar rota protegida
curl -X GET http://localhost:3333/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Segurança

⚠️ **Importante:**

1. Nunca commite o arquivo `.env` com o `JWT_SECRET` real
2. Use um `JWT_SECRET` forte em produção (mínimo 32 caracteres aleatórios)
3. Configure o `JWT_EXPIRES_IN` apropriadamente para seu caso de uso
4. Sempre use HTTPS em produção
5. Considere implementar refresh tokens para sessões de longa duração
6. Implemente rate limiting para prevenir ataques de força bruta

## Próximos Passos Sugeridos

- [ ] Implementar refresh tokens
- [ ] Adicionar rate limiting nos endpoints de autenticação
- [ ] Implementar logout (blacklist de tokens)
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Implementar "esqueci minha senha"
- [ ] Adicionar logs de auditoria de autenticação

