---
activation: glob
glob: "backend/**/*.ts"
description: Padrões de código NestJS, Prisma e PostgreSQL do projeto ACIC. Ativar em tarefas de backend: criar módulos, services, controllers, DTOs, guards, migrations ou qualquer arquivo em backend/src/.
---

# Padrões de Backend — NestJS + Prisma

## Estrutura de módulo NestJS
Cada módulo em `backend/src/modules/` deve ter exatamente:
```
nome/
├── nome.module.ts
├── nome.controller.ts
├── nome.service.ts
└── dto/
    ├── create-nome.dto.ts
    └── update-nome.dto.ts
```

## DTOs
- Sempre usar `class-validator` + `class-transformer`
- Sempre adicionar `@ApiProperty()` do `@nestjs/swagger` em todos os campos
- Update DTO: usar `PartialType(CreateDto)` importado de `@nestjs/swagger` (não de `@nestjs/mapped-types`)
- Campos obrigatórios: `@IsNotEmpty()` com `message` em português
- Campos opcionais: `@IsOptional()` + `?` no TypeScript

```ts
// update-nome.dto.ts — padrão obrigatório
import { PartialType } from '@nestjs/swagger';
import { CreateNomeDto } from './create-nome.dto';
export class UpdateNomeDto extends PartialType(CreateNomeDto) {}
```

## Services — padrão completo
- Sempre injetar `PrismaService` via constructor (não instanciar PrismaClient diretamente)
- Tratar `PrismaClientKnownRequestError`:
  - `P2002` → `ConflictException` (unique constraint)
  - `P2025` → `NotFoundException` (registro não encontrado)
- Para entidades com slug (Evento, Servico, Noticia): usar `slugify(titulo, { lower: true, strict: true })`
- `findOne` deve buscar por ID OU slug: `prisma.model.findFirst({ where: { OR: [{ id }, { slug }] } })`
- `authorId` deve ser passado como parâmetro opcional e gravado no create

```ts
import slugify from 'slugify';

async create(dto: CreateNomeDto, authorId?: string) {
  const slug = slugify(dto.title, { lower: true, strict: true });
  try {
    return await this.prisma.nome.create({ data: { ...dto, slug, authorId } });
  } catch (error) {
    if (error.code === 'P2002') throw new ConflictException('Já existe um registro com este título.');
    throw error;
  }
}
```

## Controllers — padrão completo
- Separação clara: rotas públicas sem guard, rotas admin com guard
- `@Controller()` sem path — usar path explícito em cada `@Get()`, `@Post()`, etc.
- Rotas públicas: `/nome` e `/nome/:idOrSlug`
- Rotas admin: `/admin/nome` e `/admin/nome/:id`
- Sempre usar `@ApiTags('Nome')` e `@ApiBearerAuth()` nas rotas protegidas

```ts
@ApiTags('Nomes')
@Controller()
export class NomesController {
  // ROTA PÚBLICA
  @Get('nomes')
  findAll() { return this.nomesService.findAll(); }

  @Get('nomes/:idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) { return this.nomesService.findOne(idOrSlug); }

  // ROTAS ADMIN (protegidas)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/nomes')
  create(@Body() dto: CreateNomeDto, @CurrentUser() user: any) {
    return this.nomesService.create(dto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/nomes/:id')
  update(@Param('id') id: string, @Body() dto: UpdateNomeDto) {
    return this.nomesService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/nomes/:id')
  remove(@Param('id') id: string) { return this.nomesService.remove(id); }
}
```

## Módulos
```ts
@Module({
  imports: [PrismaModule],
  controllers: [NomesController],
  providers: [NomesService],
})
export class NomesModule {}
```
- Sempre importar `PrismaModule`
- Registrar o módulo novo em `app.module.ts`

## Guards e decorators disponíveis
```ts
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
```

## Prisma — regras críticas
- **NUNCA** modificar `schema.prisma` sem rodar `npx prisma migrate dev --name descricao` depois
- Nunca expor `passwordHash` — sempre remover via desestruturação: `const { passwordHash: _, ...result } = user`
- Sempre usar `include: { author: { select: { name: true, email: true } } }` ao retornar entidades com authorId

## TypeScript Config (tsconfig.json)
**NUNCA usar `"module": "nodenext"` ou `"moduleResolution": "nodenext"` em NestJS.**
Configuração obrigatória:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "ES2021",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "skipLibCheck": true
  }
}
```

## Autenticação
- Hash de senha: `bcrypt.hash(password, 10)` — nunca menos que 10 rounds
- JWT payload: `{ sub: user.id, email: user.email, role: user.role }`
- Rate limit no login: ThrottlerGuard (5 req por 60s — já configurado globalmente)
