# Contexto geral do projeto - ACIC

Este documento resume o estado atual do projeto ACIC como um todo: backend, banco de dados, frontend, infraestrutura, organização das pastas e próximos passos. O projeto tem evoluído e agora conta com integrações de API no frontend e uma área administrativa.

## 1. Objetivo atual

O projeto ACIC é uma plataforma web para a Associação Comercial e Industrial de Crateús.

O sistema foi pensado em três frentes:

- **Portal público:** páginas abertas para visitantes.
- **Painel administrativo:** área restrita para admins e editores gerenciarem conteúdo (atualmente em fase de implementação avançada com integrações de API).
- **Área do associado:** área logada para associados solicitarem certificados e se inscreverem em eventos.

No momento, a prioridade prática é:

- Consolidar a integração entre o frontend (tanto a área pública quanto o painel administrativo) e o backend (NestJS).
- Validar o funcionamento dos CRUDs no painel administrativo utilizando a API real.
- Finalizar fluxos de auth, gerenciamento de arquivos (upload) e edição de conteúdo rico usando EditorJS.

## 2. Stack definida

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- JWT para autenticação
- bcrypt para hash de senha
- Multer para upload de arquivos

**Banco de dados:**
- PostgreSQL

**Infraestrutura:**
- Docker
- Docker Compose

**Frontend:**
- React 19 + Vite
- React Router DOM
- Axios (para consumo da API)
- EditorJS (para edição de conteúdo rico no painel administrativo)

## 3. Organização geral das pastas

Estrutura principal do repositório:

```txt
PI 3 asic/
├── backend/
├── frontend/
├── uploads/
├── docker-compose.yml
├── .env
├── .gitignore
└── CONTEXTO_GERAL.md
```

Resumo:

- `backend/`: API NestJS, Prisma, schema do banco, migrations, gerenciamento de uploads e regras de negócio.
- `frontend/`: aplicação React/Vite, páginas públicas, painel administrativo, componentes, estilos, assets e integrações via Axios.
- `uploads/`: volume montado para arquivos submetidos pela aplicação (ex.: imagens de capa, galerias).
- `docker-compose.yml`: orquestra banco, backend e frontend.
- `CONTEXTO_GERAL.md`: este documento de contexto.

## 4. Pasta backend

O backend NestJS está estruturado para suportar a lógica do negócio, uploads e os CRUDs necessários para o frontend.

Estrutura relevante:

```txt
backend/
├── Dockerfile
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── prisma/
│   ├── common/
│   └── modules/
│       ├── associados/
│       ├── auth/
│       ├── certificados/
│       ├── diretoria/
│       ├── eventos/
│       ├── inscricoes/
│       ├── noticias/
│       ├── presidentes/
│       ├── quem-somos/
│       ├── servicos/
│       ├── slides/
│       ├── upload/
│       └── usuarios/
```

### O que cada parte faz:

- **`Dockerfile`**: Roda o backend NestJS, expondo a porta `3000`. No target de desenvolvimento, gera o Prisma Client e roda `start:dev`.
- **`prisma/schema.prisma`**: Modelagem do banco de dados contendo `User`, `Associado`, `Noticia`, `Evento` (com flag de `destaque`), `InscricaoEvento`, `CertificadoSolicitacao`, `Servico` (com flag de `destaque`), `Presidente`, `Diretor` (adicionado recentemente), `QuemSomosSection` e `HomeSlide`.
- **`src/modules/`**: Contém os módulos da aplicação, já com pastas estabelecidas para `auth`, `upload`, e os domínios do sistema (como `eventos`, `noticias`, `diretoria`, etc).

## 5. Pasta frontend

O frontend evoluiu substancialmente. As páginas foram categorizadas entre Públicas e Administrativas, e a comunicação com o backend (via API) foi iniciada, substituindo os antigos mocks.

Estrutura geral:

```txt
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── Admin/
│   │   └── Public/
│   ├── services/
│   ├── styles/
│   ├── main.jsx
│   └── App.jsx
├── package.json
└── vite.config.js
```

### Destaques do frontend:

- **Integração de API (`src/services/`)**: Módulos como `api.js`, `eventosService.js`, `noticiasService.js`, `uploadService.js`, entre outros, configurados usando **Axios** para requisições ao backend.
- **Painel Admin (`src/pages/Admin/`)**: O sistema conta agora com várias views administrativas, incluindo `Dashboard`, `Diretoria`, `Eventos`, `Noticias`, `Presidentes`, `QuemSomos`, `Servicos` e `Slides`.
- **Portal Público (`src/pages/Public/`)**: Onde habitam as views de `Home`, `Institucional`, `Eventos`, `Servicos`, `Noticias`, entre outras.
- **EditorJS**: Integrado nas dependências para possibilitar a criação de conteúdo complexo (como blocos de texto, imagens e cabeçalhos em notícias).

## 6. Infraestrutura e Docker Compose

O ambiente Docker integra de ponta a ponta o banco, o backend e o frontend.

### `docker-compose.yml`

Serviços definidos:

- **`db`**: PostgreSQL (porta `5432`). Usuário, senha e db padrão como `postgres` e `acic_db`.
- **`backend`**: NestJS, escutando na porta `3000`. Configurado com volume de `/uploads` para persistir imagens no host e com comando para rodar `prisma generate`, `prisma migrate deploy` e `prisma db seed` no boot.
- **`frontend`**: React/Vite, rodando na porta `5173`. Possui a variável `VITE_API_URL=http://localhost:3000` injetada, que o Axios utiliza para se comunicar com o backend local no Docker.

## 7. Banco de dados e Models atuais (Prisma)

O esquema do banco reflete o escopo completo para o conteúdo da ACIC:

- **`User` & `Associado`**: Com suporte a Roles (ADMIN, EDITOR, ASSOCIADO) e associação de empresas aos seus usuários.
- **`Noticia`, `Evento`, `Servico`**: Todos baseados no conceito de `slug`, status de publicação/rascunho (`PublishStatus` ou `EventStatus`), campos ricos de conteúdo em formato JSON (ideal para os blocos do EditorJS), e flags como `destaque` para eventos e serviços.
- **`InscricaoEvento` & `CertificadoSolicitacao`**: Modelam o fluxo dos associados.
- **`Presidente` & `Diretor`**: Dados da gestão e governança da Associação Comercial. `Diretor` foi incluído recentemente para modelar separadamente a diretoria executiva.
- **`QuemSomosSection` & `HomeSlide`**: Flexibilizam blocos institucionais e banners rotativos.

## 8. Próximos passos

O desenvolvimento caminha para o encerramento da fase de conexão entre o Painel Admin e o Backend. As próximas necessidades giram em torno de:

1. Finalizar e validar a comunicação CRUD completa via painel Admin com autenticação (JWT) ligada às requisições do Axios.
2. Garantir que as imagens passadas para o módulo de `upload` (backend) sejam armazenadas corretamente na pasta `/uploads` e servidas/listadas adequadamente para o frontend.
3. Substituir de vez as páginas estáticas/mockadas do `Portal Público` pelos retornos efetivos via `services` do Axios, formatando adequadamente os campos renderizados pelo `EditorJS`.
4. Finalizar o fluxo logado de "Área do associado", desde a tela de Login até a submissão de inscrições para eventos.
5. Revisar pontualmente o encoding de textos previamente definidos.
