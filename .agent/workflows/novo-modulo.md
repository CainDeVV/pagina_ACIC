---
description: Cria um módulo NestJS completo no projeto ACIC: module, controller, service e DTOs. Seguir este workflow ao adicionar qualquer novo recurso ao backend.
---

# Workflow: Criar Módulo NestJS

Seguir este workflow para criar um módulo completo no padrão ACIC.
Referência: módulos `eventos/` e `servicos/` já implementados.

## Checklist

1. **Confirmar nome do módulo** (ex: `noticias`, `associados`)

2. **Criar os arquivos** em `backend/src/modules/{nome}/`:
   - `{nome}.module.ts`
   - `{nome}.controller.ts`
   - `{nome}.service.ts`
   - `dto/create-{nome}.dto.ts`
   - `dto/update-{nome}.dto.ts`

3. **Service**: injetar PrismaService, implementar `create`, `findAll`, `findOne(idOrSlug)`, `update(id, dto)`, `remove(id)`
   - Se tiver campo `title`: gerar slug com `slugify`
   - `findOne` sempre aceitar ID ou slug: `OR: [{ id }, { slug }]`
   - Tratar `P2002` → ConflictException, `P2025` → NotFoundException

4. **Controller**:
   - Rotas públicas sem guard: `GET /nome` e `GET /nome/:idOrSlug`
   - Rotas admin com guard: `POST/PATCH/DELETE /admin/nome`
   - Usar `@ApiTags`, `@ApiBearerAuth`, `@UseGuards(JwtAuthGuard, RolesGuard)`, `@Roles(UserRole.ADMIN, UserRole.EDITOR)`
   - Passar `@CurrentUser() user: any` no create para registrar `authorId`

5. **DTOs**:
   - `create-{nome}.dto.ts`: todos os campos com `@ApiProperty` + `class-validator`
   - `update-{nome}.dto.ts`: `export class UpdateNomeDto extends PartialType(CreateNomeDto) {}` (PartialType do `@nestjs/swagger`)

6. **Module**: importar `PrismaModule`, declarar controller e provider

7. **Registrar em `app.module.ts`**: importar e adicionar na lista `imports: []`

8. **Se precisar de novo campo no banco**: editar `schema.prisma` e rodar:
   ```bash
   npx prisma migrate dev --name nome_da_migration
   ```

## Template rápido — service com slug

```ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNomeDto } from './dto/create-nome.dto';
import { UpdateNomeDto } from './dto/update-nome.dto';
import slugify from 'slugify';

@Injectable()
export class NomesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNomeDto, authorId?: string) {
    const slug = slugify(dto.title, { lower: true, strict: true });
    try {
      return await this.prisma.nome.create({ data: { ...dto, slug, authorId } });
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('Já existe um registro com este título.');
      throw error;
    }
  }

  async findAll() {
    return this.prisma.nome.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, email: true } } },
    });
  }

  async findOne(idOrSlug: string) {
    const item = await this.prisma.nome.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { author: { select: { name: true, email: true } } },
    });
    if (!item) throw new NotFoundException('Registro não encontrado.');
    return item;
  }

  async update(id: string, dto: UpdateNomeDto) {
    let slug: string | undefined;
    if (dto.title) slug = slugify(dto.title, { lower: true, strict: true });
    try {
      return await this.prisma.nome.update({
        where: { id },
        data: { ...dto, ...(slug && { slug }) },
      });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Registro não encontrado.');
      if (error.code === 'P2002') throw new ConflictException('Slug já em uso por outro registro.');
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.nome.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Registro não encontrado.');
      throw error;
    }
  }
}
```