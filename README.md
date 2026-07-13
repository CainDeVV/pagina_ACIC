# Portal ACIC — Associação Comercial e Industrial de Crateús

Sistema web institucional da ACIC, composto por um **portal público** (notícias, eventos, serviços, quadro de diretoria, patrocinadores, área do associado) e um **painel administrativo** para gestão de todo esse conteúdo.

Projeto desenvolvido como parte do **Projeto Integrador III** (CRT0433/CRT0429), UFC Campus Crateús, semestre 2026.1, sob orientação do Prof. Bruno Riccelli dos Santos Silva.

**Equipe 08:** Alvaro Souza Freire, Cainã Farias da Silva, Joadson Moreno Ferreira, José Humberto Clemente Freitas Filho, Railton Araujo Moroto, Rykelme da Silva Gonçalves.

> Para instruções de instalação e execução, veja o arquivo [`INSTALACAO.md`](./INSTALACAO.md).

---

## Sobre a stack

O projeto evoluiu ao longo do desenvolvimento e foi consolidado na seguinte stack:

### Backend
- **NestJS 10** (TypeScript) — arquitetura modular
- **Prisma ORM** + **PostgreSQL 16**
- **JWT + Passport** para autenticação
- **Swagger** para documentação automática dos endpoints (`/api/docs`)
- **Multer + Sharp** para upload e processamento de imagens
- **Helmet** para cabeçalhos de segurança HTTP
- **@nestjs/throttler** para limitação de requisições (rate limiting)
- **class-validator / class-transformer** para validação automática de DTOs

### Frontend
- **React 19** + **Vite**
- **React Router** para navegação
- **EditorJS** para edição de conteúdo rico (notícias, páginas institucionais)
- **Axios** para consumo da API
- **DOMPurify** para sanitização de HTML antes de renderizar conteúdo
- **dnd-kit** para reordenação de itens (drag and drop)

### Infraestrutura
- **Docker Compose** orquestrando três serviços: `db`, `backend` e `frontend`
- Healthchecks configurados para banco e backend
- Seed automático do usuário administrador na subida do container

---

## Estrutura do projeto

```
pagina_ACIC/
├── backend/                # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma   # Modelo de dados
│   │   ├── seed.ts         # Seed do usuário admin inicial
│   │   └── migrations/
│   ├── src/
│   │   ├── modules/        # Um módulo por domínio (ver abaixo)
│   │   ├── common/         # Filtros, guards e utilitários compartilhados
│   │   └── main.ts         # Bootstrap da aplicação
│   └── Dockerfile
├── frontend/                # SPA React
│   ├── src/
│   │   ├── pages/           # Páginas do portal público e do painel admin
│   │   ├── components/      # Componentes reutilizáveis (inclui o editor rico)
│   │   ├── services/        # Camada de comunicação com a API (Axios)
│   │   ├── contexts/        # Contextos React (autenticação, etc.)
│   │   └── hooks/
│   └── Dockerfile
├── uploads/                  # Arquivos de mídia enviados (imagens, PDFs)
├── docker-compose.yml
└── backup_acic.sql           # Dump de exemplo do banco
```

### Módulos do backend (15)

| Módulo | Responsabilidade |
|---|---|
| `auth` | Login, geração e validação de JWT |
| `usuarios` | Cadastro e gestão de usuários do sistema |
| `associados` | Área do associado da ACIC |
| `noticias` | CRUD de notícias do portal |
| `eventos` | CRUD de eventos |
| `inscricoes` | Inscrições de associados/visitantes em eventos |
| `certificados` | Solicitação de certificados |
| `servicos` | Serviços oferecidos pela ACIC |
| `presidentes` | Histórico de presidentes da associação |
| `diretoria` | Quadro de diretores atual |
| `patrocinadores` | Gestão de patrocinadores |
| `slides` | Slides/banners da página inicial |
| `home` | Conteúdo agregado da página inicial |
| `quem-somos` | Conteúdo institucional (Quem Somos) |
| `upload` | Upload e processamento de arquivos/imagens |

### Modelo de dados (12 entidades)

`User`, `Associado`, `Noticia`, `Evento`, `InscricaoEvento`, `CertificadoSolicitacao`, `Servico`, `Presidente`, `Diretor`, `QuemSomosSection`, `HomeSlide`, `Patrocinador`.

O sistema tem três perfis de usuário: `ADMIN`, `EDITOR` e `ASSOCIADO` — este último foi um acréscimo de escopo em relação ao planejamento inicial do Marco 1, refletindo a criação da área do associado.

---

## Segurança

- Autenticação via **JWT**, com rotas sensíveis protegidas por `RolesGuard` e decorator `@Roles()` (controle de acesso por perfil)
- **Helmet** ativo em todas as respostas HTTP
- **CORS restrito**: apenas a origem definida em `FRONTEND_URL` pode consumir a API
- Validação automática de entrada (`ValidationPipe` com `whitelist` e `forbidNonWhitelisted`), rejeitando campos não esperados
- Upload de arquivos com **whitelist de tipos MIME** e sanitização do nome da pasta de destino
- Senhas armazenadas com hash (`bcryptjs`)
- Conteúdo rico (EditorJS) sanitizado no frontend com **DOMPurify** antes da renderização

---

## Limitações conhecidas

O sistema implementa todos os requisitos funcionais essenciais. Os itens abaixo, de prioridade **Média**, foram conscientemente deixados fora do escopo desta entrega:

- **Busca/filtro por palavra-chave**: hoje o sistema oferece apenas paginação, sem busca textual dedicada
- **Sistema de categorias**: notícias/eventos usam campo de texto livre, sem entidade/CRUD de categorias
- **Agendamento automático de publicação**: os campos de data existem no modelo, mas a publicação é **manual** — não há job/cron rodando essa automação
- **Rate limit específico de login**: existe apenas throttling genérico (100 requisições/minuto por IP), não um limite dedicado de tentativas de login
- **Backup automatizado**: não há rotina agendada de backup; o dump do banco (`backup_acic.sql`) é feito manualmente

---

## Documentação da API

Com o backend em execução, a documentação interativa (Swagger) fica disponível em:

```
http://localhost:3000/api/docs
```
