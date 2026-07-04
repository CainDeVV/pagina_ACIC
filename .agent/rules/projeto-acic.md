---
activation: always
---

# Contexto do Projeto ACIC

Plataforma web institucional da Associação Comercial e Industrial de Crateús (ACIC).
Referência visual e de estrutura: https://cacb.org.br
Branch de trabalho atual: `develop`

## Stack
- Backend: NestJS + TypeScript + Prisma ORM + PostgreSQL 16
- Frontend: React + Vite + CSS modularizado por componente
- Infra: Docker + Docker Compose (3 serviços: db, backend, frontend)
- Auth: JWT (passport-jwt) + bcryptjs
- Rate Limiting: @nestjs/throttler (5 req/min no login)
- Documentação API: Swagger em `/api/docs` (já configurado no main.ts)
- HTTP Client (frontend): Axios — instância em `frontend/src/services/api.js`
- Validação: class-validator + class-transformer (ValidationPipe global)

## Equipe

### Cainã — Infraestrutura, Auth & Núcleo
- Setup NestJS + Docker Compose unificado
- Módulos prontos: `auth`, `usuarios`, `presidentes`, `slides`, `quem-somos`
- JWT completo: JwtAuthGuard, RolesGuard, @CurrentUser(), @Roles()
- Seed: cria admin padrão `admin@acic.local` / `admin123`

### Humberto — CRUD de Conteúdo & Frontend
- Módulos prontos: `servicos`, `eventos`
- Criou `frontend/src/services/api.js` com Axios + interceptor JWT
- Adicionou campo `destaque: Boolean` em Evento e Servico + migration
- Swagger documentado nos controllers de eventos e serviços

## Estado atual dos módulos (branch develop)

### Backend — `backend/src/modules/`
| Módulo | Status | Rotas |
|--------|--------|-------|
| `auth` | ✅ Completo | POST /api/auth/login |
| `usuarios` | ✅ Completo | CRUD em /api/admin/usuarios (só ADMIN) |
| `presidentes` | ✅ Completo | GET /api/presidentes + CRUD admin |
| `slides` | ✅ Completo | GET /api/slides + CRUD admin |
| `quem-somos` | ✅ Completo | GET /api/quem-somos + CRUD admin |
| `servicos` | ✅ Completo | GET /api/servicos + findOne por ID/slug + CRUD admin |
| `eventos` | ✅ Completo | GET /api/eventos + findOne por ID/slug + CRUD admin |
| `noticias` | ❌ Vazio | Pasta existe, DTOs vazios — PRÓXIMO A IMPLEMENTAR |
| `associados` | ❌ Vazio | Pasta existe, DTOs vazios |
| `inscricoes` | ❌ Vazio | Pasta existe, DTOs vazios |
| `certificados` | ❌ Vazio | Pasta existe, DTOs vazios |
| `common/filters` | ❌ Vazio | Exception filter global não implementado |
| `common/interceptors` | ❌ Vazio | Response interceptor não implementado |

### Frontend — `frontend/src/`
| Área | Status |
|------|--------|
| Roteamento (App.jsx) | ✅ Todas as rotas públicas definidas |
| `services/api.js` | ✅ Axios com baseURL + interceptor JWT |
| Componentes visuais | ✅ HeroSlider, Navbar, Header, Footer, ServiceCard, EventRow, DirectorCard, NewsCard, Breadcrumb, BlockRenderer, ScrollToTop |
| Página Home | ✅ Existe, usa homeMock — integração pendente |
| Página Eventos + Detalhe | ✅ Existe, usa eventosMock — integração pendente |
| Página Serviços + Detalhe | ✅ Existe, usa servicosMock — integração pendente |
| Página Diretoria | ✅ Existe, usa institucionalMock |
| Galeria de Presidentes | ✅ Existe, usa assets locais |
| Placeholders | ✅ QuemSomos, Estatuto, EstruturaOrganizacional, Cmec, Contatos |
| Página Notícias | ❌ Não existe |
| Painel Administrativo | ❌ Não existe |
| Integração real com API | ❌ Todas as páginas ainda usam mocks |

## Plano de Fases

### Fase 1 — Fechar o backend (imediato)
1. Módulo `noticias/` — único crítico faltando (seguir padrão de `eventos/`)
2. Merge da branch `crud` do Humberto em `develop`
3. Exception Filter global + Response Interceptor em `common/`

### Fase 2 — Integração frontend (após Fase 1)
- Criar services em `frontend/src/services/`: `eventosService.js`, `servicosService.js`, `noticiasService.js`, `slidesService.js`, `presidentesService.js`
- Substituir mocks pelas chamadas reais na ordem: Serviços → Eventos → Slides (Home) → Presidentes → Notícias

### Fase 3 — Painel Admin
- `frontend/src/pages/Admin/`: Login, Dashboard, CRUD de Slides/Eventos/Serviços/Notícias/Usuários
- PrivateRoute no React Router (redireciona sem token)

### Fase 4 — Funcionalidades avançadas
- Upload de imagens: `POST /api/upload`
- Módulos Associados, Inscrições, Certificados
- Área do Associado no frontend

## Estrutura de pastas atual

```
PI 3 asic/
├── .env                        ← POSTGRES_* + JWT_SECRET + NODE_ENV
├── docker-compose.yml          ← db + backend + frontend (healthcheck)
├── backend/
│   ├── Dockerfile              ← multi-stage: development | build | production
│   ├── prisma/
│   │   ├── schema.prisma       ← schema completo (User, Evento, Servico, Noticia, Presidente, QuemSomosSection, HomeSlide, Associado, InscricaoEvento, CertificadoSolicitacao)
│   │   ├── seed.ts             ← cria admin@acic.local / admin123
│   │   └── migrations/        ← 2 migrations geradas (init + add_destaque_flag)
│   └── src/
│       ├── main.ts             ← CORS + prefix /api + ValidationPipe + Swagger
│       ├── app.module.ts       ← importa todos os módulos
│       ├── common/
│       │   ├── decorators/     ← @CurrentUser(), @Roles()
│       │   ├── guards/         ← JwtAuthGuard, RolesGuard
│       │   ├── filters/        ← VAZIO
│       │   └── interceptors/   ← VAZIO
│       ├── prisma/             ← PrismaModule (global) + PrismaService
│       └── modules/            ← um módulo por entidade
└── frontend/
    ├── src/
    │   ├── App.jsx             ← rotas com React Router
    │   ├── services/api.js     ← Axios configurado
    │   ├── mocks/              ← dados temporários (substituir na Fase 2)
    │   ├── components/         ← componentes reutilizáveis
    │   └── pages/Public/       ← Eventos, Home, Servicos, Institucional, NotFound
    └── vite.config.js
```

## Rotas da API

### Públicas (sem auth)
```
POST /api/auth/login
GET  /api/presidentes
GET  /api/slides
GET  /api/quem-somos · GET /api/quem-somos/:id
GET  /api/servicos   · GET /api/servicos/:idOrSlug
GET  /api/eventos    · GET /api/eventos/:idOrSlug
GET  /api/noticias   · GET /api/noticias/:idOrSlug   ← a implementar
```

### Protegidas (ADMIN ou EDITOR)
```
POST/PATCH/DELETE /api/admin/slides
POST/PATCH/DELETE /api/admin/presidentes
POST/PATCH/DELETE /api/admin/quem-somos
POST/PATCH/DELETE /api/admin/servicos
POST/PATCH/DELETE /api/admin/eventos
POST/PATCH/DELETE /api/admin/noticias   ← a implementar
POST /api/upload                         ← a implementar
```

### Somente ADMIN
```
GET/POST/PATCH/DELETE /api/admin/usuarios
```

### Documentação
```
GET /api/docs   ← Swagger UI com BearerAuth
```

## Convenções obrigatórias
- TypeScript no backend (emitDecoratorMetadata + experimentalDecorators SEMPRE ligados)
- Nomes de domínio em português: `noticia`, `evento`, `servico`, `presidente`
- Arquivos NestJS: `nome.controller.ts`, `nome.service.ts`, `nome.module.ts`
- DTOs: `class-validator` + `@ApiProperty` do Swagger em todos os campos
- Update DTOs: usar `PartialType(CreateDto)` do `@nestjs/swagger`
- Guards nas rotas admin: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN, UserRole.EDITOR)`
- Slug automático via `slugify` em create e update de Evento, Servico e Noticia
- `findOne` deve aceitar tanto ID quanto slug (`OR: [{ id }, { slug }]`)
- `passwordHash` NUNCA retornado nas respostas
- NUNCA modificar `schema.prisma` sem criar migration depois (`npx prisma migrate dev`)
- Rota pública: `@Controller()` com path explícito; rota admin: path com prefixo `admin/`

## ✅ Branch `crud` — comparada, merge não é prioridade
Comparação detalhada (19/06) mostrou que `servicos.controller.ts`,
`eventos.controller.ts` e o Swagger em `main.ts` são IDÊNTICOS entre
`develop` e `crud`. A única diferença real é o uso de `!` em alguns DTOs
(`login.dto.ts`, `create-evento.dto.ts`, `create-servico.dto.ts` —
ex: `title!: string` vs `title: string`), sem impacto funcional. A
`develop` está, na verdade, mais completa: só ela tem
`frontend/src/services/api.js` e `frontend/jsconfig.json`. Pode seguir
desenvolvendo direto na `develop` sem fazer merge da `crud`. Cleanup
opcional: remover os `!` desnecessários dos DTOs citados.