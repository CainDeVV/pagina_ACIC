---
description: Revisa um arquivo, módulo ou pull request do projeto ACIC antes de fazer merge ou avançar para a próxima fase.
---

# Revisar Código — Checklist ACIC

Use para revisar qualquer módulo, arquivo ou conjunto de mudanças.

## Backend — checklist

### DTOs
- [ ] Todos os campos têm `@ApiProperty()` do `@nestjs/swagger`?
- [ ] Campos obrigatórios têm `@IsNotEmpty({ message: '...' })` em português?
- [ ] Update DTO usa `PartialType(CreateDto)` importado de `@nestjs/swagger`?

### Service
- [ ] Injeta `PrismaService` via constructor (não instancia `new PrismaClient()`)?
- [ ] `passwordHash` está excluído de todas as respostas?
- [ ] `findOne` aceita tanto ID quanto slug com `OR: [{ id }, { slug }]`?
- [ ] Trata `P2002` → `ConflictException` e `P2025` → `NotFoundException`?
- [ ] `authorId` é gravado no `create` quando disponível?
- [ ] Usa `slugify` ao criar/atualizar entidades com `title`?

### Controller
- [ ] Rotas públicas (GET) não têm guard?
- [ ] Rotas admin têm `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(...)`?
- [ ] Usa `@ApiTags('...')` e `@ApiBearerAuth()` nas rotas protegidas?
- [ ] `@CurrentUser()` é usado no `create` para passar `authorId`?

### Módulo
- [ ] Módulo está registrado no `app.module.ts`?
- [ ] Importa `PrismaModule`?

### Banco de dados
- [ ] Se o schema foi modificado, a migration foi criada e aplicada?

---

## Frontend — checklist

### Componente/Página
- [ ] Componente funcional (sem classes)?
- [ ] Tem CSS próprio importado na mesma pasta?
- [ ] Textos sem encoding quebrado (sem `Ã`, `Ã§`, `Ã©`)?
- [ ] Usa `<Helmet>` para SEO do título da página?

### Integração com API
- [ ] Usa `services/api.js` (instância Axios) — não cria axios direto?
- [ ] Chamadas de API estão em `services/*Service.js`, não dentro do componente?
- [ ] Tem tratamento de loading e erro?
- [ ] Mock correspondente foi removido após integração?

---

## Relatório de revisão

Ao finalizar, gerar tabela:

| Item | Status | Observação |
|------|--------|------------|
| DTOs com @ApiProperty | ✅/❌ | ... |
| Service trata P2002/P2025 | ✅/❌ | ... |
| Módulo em app.module.ts | ✅/❌ | ... |
| Guards nas rotas admin | ✅/❌ | ... |

Listar itens que precisam ser corrigidos antes de avançar.