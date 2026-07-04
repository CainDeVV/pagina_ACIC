---
description: Workflow completo para criar o módulo de autenticação JWT do projeto ACIC.
---

# Implementar Auth

> ⚠️ Auth já está implementado e funcionando na branch develop.
> Use este workflow apenas se precisar recriar ou debugar o módulo do zero.

## O que existe atualmente

```
backend/src/modules/auth/
├── auth.controller.ts    ← POST /api/auth/login com ThrottlerGuard
├── auth.module.ts        ← importa JwtModule, PassportModule, PrismaModule
├── auth.service.ts       ← valida email/senha com bcrypt, retorna JWT
├── dto/login.dto.ts      ← { email, password } com class-validator
└── strategies/jwt.strategy.ts ← extrai payload { sub, email, role }

backend/src/common/
├── guards/jwt-auth.guard.ts   ← extends AuthGuard('jwt')
├── guards/roles.guard.ts      ← verifica @Roles() no contexto
├── decorators/current-user.decorator.ts
└── decorators/roles.decorator.ts
```

## Credenciais de teste (seed)
- Email: `admin@acic.local`
- Senha: `admin123`
- Role: `ADMIN`

## Como usar nos controllers

```ts
// Rota protegida — qualquer usuário autenticado
@UseGuards(JwtAuthGuard)
@Get('perfil')
getPerfil(@CurrentUser() user: any) { return user; }

// Rota protegida — apenas ADMIN ou EDITOR
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
@Post('admin/recurso')
create(@CurrentUser() user: any) { ... }

// Rota protegida — apenas ADMIN
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Post('admin/usuarios')
createUser() { ... }
```

## Se precisar recriar (passos)

1. `npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs @nestjs/throttler`
2. `npm install -D @types/passport-jwt @types/bcryptjs`
3. Criar arquivos na ordem: `dto/login.dto.ts` → `strategies/jwt.strategy.ts` → `auth.service.ts` → `auth.controller.ts` → `auth.module.ts`
4. Criar guards e decorators em `common/`
5. Registrar `AuthModule` e `ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }])` no `app.module.ts`