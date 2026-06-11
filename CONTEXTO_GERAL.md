# Contexto geral do projeto - ACIC

Este documento resume o estado atual do projeto ACIC como um todo: backend, banco de dados, frontend, infraestrutura, organizacao das pastas, comandos ja rodados e proximos passos.

## 1. Objetivo atual

O projeto ACIC e uma plataforma web para a Associacao Comercial e Industrial de Crateus.

O sistema foi pensado em tres frentes:

- Portal publico: paginas abertas para visitantes.
- Painel administrativo: area restrita para admins e editores gerenciarem conteudo.
- Area do associado: area logada para associados solicitarem certificados e se inscreverem em eventos.

No momento, a prioridade pratica e:

- Backend NestJS organizado.
- Prisma configurado.
- PostgreSQL com tabelas criadas.
- Estrutura pronta para iniciar auth e CRUDs.

O frontend ja tem varias paginas publicas prontas visualmente, mas ainda usa dados mockados.

## 2. Stack definida

Backend:

- NestJS
- TypeScript
- Prisma ORM
- JWT para autenticacao futura
- bcrypt para hash de senha futura

Banco de dados:

- PostgreSQL

Infraestrutura:

- Docker
- Docker Compose

Frontend:

- React + Vite

Observacao: o frontend ja existe no repositorio, mas nao e prioridade neste momento.

## 3. Organizacao geral das pastas

Estrutura principal do repositorio:

```txt
PI 3 asic/
├── backend/
├── frontend/
├── docker-compose.yml
├── .env
├── .gitignore
└── CONTEXTO_BACKEND_BANCO.md
```

Resumo:

- `backend/`: API NestJS, Prisma, schema do banco, migrations e futura regra de negocio.
- `frontend/`: aplicacao React/Vite, paginas publicas, componentes, estilos, assets e mocks.
- `docker-compose.yml`: orquestra banco, backend e frontend.
- `.gitignore`: regras de arquivos ignorados pelo Git.
- `CONTEXTO_BACKEND_BANCO.md`: este documento de contexto.

## 4. Pasta backend

Estrutura atual relevante:

```txt
backend/
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.mjs
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── 20260609152000_init/
│           └── migration.sql
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.controller.spec.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── interceptors/
│   └── modules/
│       ├── associados/
│       ├── auth/
│       ├── certificados/
│       ├── eventos/
│       ├── inscricoes/
│       ├── noticias/
│       ├── presidentes/
│       ├── quem-somos/
│       ├── servicos/
│       ├── slides/
│       └── usuarios/
└── test/
```

## 5. O que cada parte faz

### `backend/Dockerfile`

Arquivo corrigido para rodar o backend NestJS.

Antes ele estava com comandos de frontend/Vite, expondo a porta `5173`.

Agora:

- Usa Node.js.
- Instala dependencias do backend.
- Gera Prisma Client.
- Expoe a porta `3000`.
- Roda `npm run start:dev` no ambiente de desenvolvimento.

### `backend/prisma/schema.prisma`

Arquivo principal de modelagem do banco.

Define:

- Enums de roles e status.
- Models/tabelas principais do sistema.
- Relacionamentos entre usuarios, associados, eventos, inscricoes e certificados.

### `backend/prisma/migrations/20260609152000_init/migration.sql`

Migration inicial criada a partir do schema.

Ela cria no PostgreSQL:

- Tipos enum.
- Tabelas.
- Indices unicos.
- Chaves estrangeiras.

### `backend/src/prisma/prisma.service.ts`

Servico que encapsula o `PrismaClient`.

Ele conecta no banco quando o modulo NestJS inicia e desconecta quando o modulo e finalizado.

### `backend/src/prisma/prisma.module.ts`

Modulo global do Prisma.

Serve para permitir que os modulos futuros usem `PrismaService` sem precisar recriar conexao com banco.

### `backend/src/app.module.ts`

Modulo raiz do NestJS.

Foi atualizado para importar `PrismaModule`.

### `backend/src/modules/`

Pastas dos modulos planejados do sistema.

No momento, elas estao principalmente como estrutura inicial. Os CRUDs ainda precisam ser implementados.

Modulos planejados:

- `auth`: login, JWT e autenticacao.
- `usuarios`: administradores, editores e associados enquanto usuarios do sistema.
- `associados`: dados das empresas associadas.
- `noticias`: conteudo de noticias do portal.
- `eventos`: agenda e detalhes de eventos.
- `inscricoes`: inscricao de associados em eventos.
- `certificados`: solicitacoes e emissao de certificados.
- `servicos`: servicos oferecidos pela ACIC.
- `presidentes`: galeria de presidentes.
- `quem-somos`: conteudo institucional.
- `slides`: slides da home.

### `backend/src/common/`

Pasta reservada para recursos compartilhados.

Uso esperado:

- `guards`: protecao de rotas, JWT, roles.
- `decorators`: decorators como `@CurrentUser()` e `@Roles()`.
- `filters`: tratamento padronizado de erros.
- `interceptors`: transformacao ou padronizacao de respostas.

## 6. Pasta frontend

O frontend existe e ja possui o portal publico desenhado em React.

Ele ainda nao esta integrado ao backend. As paginas usam arquivos mockados em `frontend/src/mocks/`.

Estrutura geral:

```txt
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── mocks/
│   ├── pages/
│   └── styles/
├── public/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── index.html
├── eslint.config.js
└── vite.config.js
```

### Stack do frontend

- React
- Vite
- React Router DOM
- React Icons
- CSS modularizado por componente/pagina

Scripts definidos em `frontend/package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Entrada da aplicacao

Arquivo principal:

```txt
frontend/src/main.jsx
```

Ele renderiza o React usando:

- `StrictMode`
- `BrowserRouter`
- componente `App`

### Rotas do frontend

Arquivo:

```txt
frontend/src/App.jsx
```

Rotas publicas existentes:

```txt
/                              Home
/quem-somos                    Quem Somos
/diretoria                     Diretoria
/estatuto                      Estatuto
/estrutura-organizacional      Estrutura Organizacional
/cmec                          CMEC
/contatos                      Contatos
/galeria-presidentes           Galeria de Presidentes
/servicos                      Lista de servicos
/servicos/:slug                Detalhe de servico
/eventos                       Lista de eventos
/eventos/:slug                 Detalhe de evento
*                              Pagina 404
```

Layout usado em todas as rotas:

- `ScrollToTop`
- `Header`
- `Navbar`
- conteudo da rota
- `Footer`

### Paginas publicas existentes

Home:

```txt
frontend/src/pages/public/Home/Home.jsx
frontend/src/pages/public/Home/Home.css
```

Institucional:

```txt
frontend/src/pages/public/institucional/QuemSomos.jsx
frontend/src/pages/public/institucional/Diretoria.jsx
frontend/src/pages/public/institucional/Estatuto.jsx
frontend/src/pages/public/institucional/EstruturaOrganizacional.jsx
frontend/src/pages/public/institucional/Cmec.jsx
frontend/src/pages/public/institucional/Contatos.jsx
frontend/src/pages/public/institucional/GaleriaPresidentes.jsx
```

Servicos:

```txt
frontend/src/pages/public/servicos/Servicos.jsx
frontend/src/pages/public/servicos/ServicoDetalhe.jsx
```

Eventos:

```txt
frontend/src/pages/public/Eventos/Eventos.jsx
frontend/src/pages/public/Eventos/EventoDetalhe.jsx
```

NotFound:

```txt
frontend/src/pages/public/NotFound/NotFound.jsx
```

### Componentes existentes

Componentes principais:

```txt
frontend/src/components/HeroSlider/
frontend/src/components/ServiceCard/
frontend/src/components/EventRow/
frontend/src/components/NewsCard/
frontend/src/components/DirectorCard/
frontend/src/components/Breadcrumb/
frontend/src/components/Navbar/
frontend/src/components/layout/Header.jsx
frontend/src/components/layout/Footer.jsx
frontend/src/components/layout/SaibaMaisLayout.jsx
frontend/src/components/BlockRenderer/
frontend/src/components/ScrollToTop/
```

Uso geral:

- `HeroSlider`: slides da home.
- `ServiceCard`: cards de servicos.
- `EventRow`: listagem resumida de eventos.
- `NewsCard`: cards de noticias.
- `DirectorCard`: cards da diretoria.
- `Breadcrumb`: navegacao secundaria.
- `Header`, `Navbar`, `Footer`: estrutura visual global.
- `SaibaMaisLayout`: layout de paginas internas institucionais.
- `BlockRenderer`: renderiza blocos de conteudo vindos dos mocks.
- `ScrollToTop`: volta ao topo ao trocar de rota.

### Mocks do frontend

Os dados atuais do frontend estao em:

```txt
frontend/src/mocks/homeMock.js
frontend/src/mocks/eventosMock.js
frontend/src/mocks/servicosMock.js
frontend/src/mocks/institucionalMock.js
```

O que cada mock fornece:

- `homeMock.js`: slides, numeros institucionais e noticias da home.
- `eventosMock.js`: evento exemplo com titulo, banner, categoria, resumo e blocos de conteudo.
- `servicosMock.js`: servicos como registro de marcas, certificado de origem e certificado digital.
- `institucionalMock.js`: quem somos, diretoria, CMEC, estatuto, contatos e galeria de presidentes.

Observacao importante:

- Os textos dos mocks aparecem com problemas de encoding em alguns arquivos, por exemplo `CrateÃºs` em vez de `Crateús`.
- Isso nao quebra necessariamente a aplicacao, mas precisa ser revisado quando o conteudo final for definido.

### Assets do frontend

Pasta:

```txt
frontend/src/assets/
```

Contem:

- logos da ACIC.
- imagens da galeria de presidentes.
- arquivo `index.js` da galeria para centralizar imports das fotos.

Pasta publica:

```txt
frontend/public/
```

Contem:

- `favicon.svg`
- `icons.svg`

### Estilos

Existem estilos globais e estilos por componente/pagina.

Exemplos:

```txt
frontend/src/styles/index.css
frontend/src/styles/home.css
frontend/src/styles/eventos.css
frontend/src/styles/servicos.css
frontend/src/components/Navbar/Navbar.css
frontend/src/components/layout/Header.css
frontend/src/components/layout/Footer.css
frontend/src/pages/public/Eventos/Eventos.css
frontend/src/pages/public/servicos/Servicos.css
frontend/src/pages/public/institucional/Institucional.css
```

Ha algumas duplicacoes aparentes de estrutura, por exemplo:

- `frontend/src/pages/public/Home.jsx`
- `frontend/src/pages/public/Home/Home.jsx`

E tambem:

- `frontend/src/components/BlockRenderer.jsx`
- `frontend/src/components/BlockRenderer/BlockRenderer.jsx`

Isso precisa ser revisado depois para evitar componentes duplicados ou arquivos antigos sem uso.

### Estado atual do frontend

- Paginas publicas ja existem.
- Dados ainda estao mockados.
- Nao existe integracao real com API.
- Nao existe painel admin.
- Nao existe area do associado.
- Nao existe tela de login.
- Nao existe fluxo de certificado/inscricao no frontend.

### O que falta no frontend futuramente

Quando o backend estiver pronto, os proximos passos do frontend serao:

1. Criar camada de API, por exemplo `src/services/api.js`.
2. Usar `VITE_API_URL` para apontar para o backend.
3. Substituir mocks por chamadas HTTP reais.
4. Criar login administrativo.
5. Criar painel administrativo.
6. Criar area do associado.
7. Criar telas para inscricoes em eventos.
8. Criar telas para solicitacao/acompanhamento de certificados.
9. Revisar encoding dos textos.
10. Remover arquivos duplicados ou nao usados.

## 7. Docker Compose

Arquivo principal:

```txt
docker-compose.yml
```

Servicos definidos:

- `db`: PostgreSQL.
- `backend`: NestJS.
- `frontend`: React/Vite.

Para o foco atual, os servicos importantes sao:

- `db`
- `backend`

O PostgreSQL usa:

- Usuario: `postgres`
- Senha: `postgres`
- Banco: `acic_db`
- Porta: `5432`

O backend usa:

- Porta: `3000`
- `DATABASE_URL=postgresql://postgres:postgres@db:5432/acic_db` dentro do Docker.

O frontend usa:

- Porta: `5173`
- `VITE_API_URL=http://localhost:3000`

### Dockerfile do frontend

Arquivo:

```txt
frontend/Dockerfile
```

Estado:

- Usa Node.js para desenvolvimento.
- Expoe a porta `5173`.
- Roda Vite com `npm run dev -- --host`.
- Tambem possui etapa de build e etapa de producao com Nginx.

### Dockerfile do backend

Arquivo:

```txt
backend/Dockerfile
```

Estado:

- Foi corrigido para NestJS.
- Expoe a porta `3000`.
- Roda `npm run start:dev` no target de desenvolvimento.
- Gera Prisma Client durante build.

## 8. Banco de dados atual

O Prisma Studio mostrou os seguintes models/tabelas:

- `Associado`
- `CertificadoSolicitacao`
- `Evento`
- `HomeSlide`
- `InscricaoEvento`
- `Noticia`
- `Presidente`
- `QuemSomosSection`
- `Servico`
- `User`

Todos estavam com `0` registros, ou seja:

- As tabelas existem.
- O banco esta vazio.
- Ainda nao existe seed inicial.

## 9. Models definidos no Prisma

### `User`

Representa usuarios do sistema.

Roles possiveis:

- `ADMIN`
- `EDITOR`
- `ASSOCIADO`

Campos principais:

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `active`

### `Associado`

Representa uma empresa associada.

Campos principais:

- `companyName`
- `tradeName`
- `cnpj`
- `phone`
- `address`
- Relacao com `User`

### `Noticia`

Conteudo de noticia do portal.

Campos principais:

- `title`
- `slug`
- `summary`
- `content`
- `coverImage`
- `status`
- `publishedAt`
- autor opcional

### `Evento`

Eventos da ACIC.

Campos principais:

- `title`
- `slug`
- `description`
- `location`
- `startsAt`
- `endsAt`
- `capacity`
- `status`

### `InscricaoEvento`

Inscricao de associado em evento.

Relaciona:

- `Evento`
- `Associado`

Status:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`

### `CertificadoSolicitacao`

Solicitacao de certificado por associado.

Pode estar ligada a um evento.

Status:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `ISSUED`

### `Servico`

Servicos oferecidos pela ACIC.

Campos principais:

- `title`
- `slug`
- `summary`
- `description`
- `icon`
- `imageUrl`
- `status`

### `Presidente`

Galeria de presidentes da ACIC.

Campos principais:

- `name`
- `termStart`
- `termEnd`
- `photoUrl`
- `bio`
- `sortOrder`

### `QuemSomosSection`

Secoes institucionais da pagina "Quem Somos".

Campos principais:

- `key`
- `title`
- `content`
- `status`
- `sortOrder`

### `HomeSlide`

Slides da home.

Campos principais:

- `title`
- `subtitle`
- `imageUrl`
- `linkUrl`
- `status`
- `sortOrder`

## 10. Comandos que foram rodados

### Instalar/sincronizar dependencias do backend

```bash
cd backend
npm install
```

Resultado:

- Dependencias foram instaladas/sincronizadas.
- O `package-lock.json` foi alterado.
- O npm reportou vulnerabilidades, mas isso nao bloqueou o build.

### Gerar Prisma Client

```bash
npm run prisma:generate
```

Resultado:

- Passou.
- Prisma Client foi gerado.

### Validar schema Prisma

```bash
npx prisma validate
```

Resultado:

- Passou.
- O schema esta valido.

### Build do backend

```bash
npm run build
```

Resultado:

- Passou.
- O NestJS compilou corretamente.

### Validar Docker Compose

```bash
docker compose config
```

Resultado:

- Passou.
- Houve aviso de permissao ao ler `C:\Users\caina\.docker\config.json`, mas a configuracao foi exibida.

### Subir banco com Docker

```bash
docker compose up -d db
```

Resultado anterior:

- Falhou quando o Docker daemon nao estava rodando.

Depois, pela imagem do Prisma Studio, o banco aparentemente foi iniciado e as tabelas foram criadas.

### Testes

```bash
npm test
```

Resultado:

- Falhou por problema de dependencia de teste relacionada a `jest-util` dentro do `ts-jest`.
- Isso nao bloqueia banco, Prisma nem build.

### Prisma Studio

Foi aberto o Prisma Studio.

Resultado observado:

- Todos os models apareceram.
- Todos estavam com `0` registros.
- Isso confirmou que o banco reconhece as tabelas/models.

### Comandos de frontend

Nao foram rodados comandos de validacao do frontend durante esta etapa.

Comandos disponiveis para quando for validar:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

## 11. O que ja esta pronto

- Estrutura base do backend NestJS.
- Dockerfile do backend corrigido.
- Prisma configurado.
- Schema Prisma definido.
- Migration inicial criada.
- PrismaService criado.
- PrismaModule criado.
- AppModule importando PrismaModule.
- Prisma Client gerando corretamente.
- Backend compilando.
- Banco reconhecendo os models no Prisma Studio.
- Frontend publico criado visualmente.
- Rotas publicas configuradas no React Router.
- Componentes publicos principais criados.
- Mocks de home, institucional, servicos e eventos criados.
- Assets da ACIC e galeria de presidentes adicionados.

## 12. O que ainda precisa ser feito agora

Como o foco e apenas backend e banco, a ordem recomendada e:

### 1. Confirmar migration no banco

Como o Prisma Studio ja mostrou as tabelas, provavelmente esta ok.

Mesmo assim, vale confirmar com:

```bash
cd backend
npx prisma migrate status
```

### 2. Criar seed inicial

Criar um arquivo de seed para inserir pelo menos:

- Um usuario `ADMIN`.

Exemplo de usuario inicial:

- Nome: Administrador ACIC
- Email: `admin@acic.local`
- Senha: definida pela equipe
- Role: `ADMIN`

Isso sera necessario para testar login depois.

### 3. Implementar modulo auth

Criar:

- Login.
- Validacao de senha com bcrypt.
- Geracao de token JWT.
- Strategy JWT.
- Guard JWT.

### 4. Implementar controle de permissoes

Criar:

- Decorator `@Roles()`.
- Guard para roles.

Permissoes previstas:

- `ADMIN`: acesso total.
- `EDITOR`: gerencia conteudo publico.
- `ASSOCIADO`: acessa area do associado.

### 5. Criar CRUDs principais do backend

Ordem recomendada:

1. `usuarios`
2. `associados`
3. `noticias`
4. `eventos`
5. `servicos`
6. `presidentes`
7. `slides`
8. `quem-somos`
9. `inscricoes`
10. `certificados`

## 13. O que precisa ser feito no frontend futuramente

Depois que o backend estiver com auth e CRUDs principais:

### 1. Criar camada de comunicacao com API

Criar arquivo ou pasta para centralizar chamadas HTTP.

Exemplo:

```txt
frontend/src/services/api.js
```

Essa camada deve usar:

```txt
VITE_API_URL=http://localhost:3000
```

### 2. Substituir mocks por dados reais

Trocar:

- `homeMock.js` por endpoints de slides/noticias/eventos.
- `servicosMock.js` por endpoint de servicos.
- `eventosMock.js` por endpoint de eventos.
- `institucionalMock.js` por endpoints de quem somos, presidentes e dados institucionais.

### 3. Criar autenticao no frontend

Criar:

- Tela de login.
- Guard de rotas privadas.
- Armazenamento do token JWT.
- Logout.
- Tratamento de expiracao de sessao.

### 4. Criar painel admin

Telas esperadas:

- Dashboard.
- Gerenciar usuarios.
- Gerenciar noticias.
- Gerenciar eventos.
- Gerenciar servicos.
- Gerenciar presidentes.
- Gerenciar slides.
- Gerenciar conteudo institucional.
- Gerenciar certificados e inscricoes.

### 5. Criar area do associado

Telas esperadas:

- Dashboard do associado.
- Perfil/dados da empresa.
- Lista de eventos.
- Inscricao em evento.
- Minhas inscricoes.
- Solicitar certificado.
- Acompanhar certificados.

### 6. Revisar conteudo e encoding

Alguns textos mockados aparecem com caracteres quebrados.

Exemplos:

- `CrateÃºs`
- `AssociaÃ§Ã£o`
- `Ã©`

Quando o conteudo final for migrado para o banco, corrigir tudo para UTF-8 adequado.

### 7. Revisar duplicacoes

Verificar se estes arquivos sao todos usados ou se alguns sao sobras:

```txt
frontend/src/pages/public/Home.jsx
frontend/src/pages/public/Home/Home.jsx
frontend/src/components/BlockRenderer.jsx
frontend/src/components/BlockRenderer/BlockRenderer.jsx
frontend/src/components/ScrollToTop.jsx
frontend/src/components/ScrollToTop/ScrollToTop.jsx
```

## 14. Mapa entre frontend e backend

Quando a integracao com API for feita, a relacao esperada sera:

```txt
Frontend Home
├── slides da home          -> backend: slides / HomeSlide
├── noticias recentes       -> backend: noticias / Noticia
├── eventos em destaque     -> backend: eventos / Evento
└── numeros institucionais  -> ainda nao modelado especificamente

Frontend Servicos
└── lista/detalhe servicos  -> backend: servicos / Servico

Frontend Eventos
└── lista/detalhe eventos   -> backend: eventos / Evento

Frontend Galeria Presidentes
└── presidentes             -> backend: presidentes / Presidente

Frontend Quem Somos
└── secoes institucionais   -> backend: quem-somos / QuemSomosSection

Area Admin
└── CRUDs protegidos        -> backend: auth + roles + CRUDs

Area Associado
├── login                   -> backend: auth
├── perfil empresa          -> backend: associados
├── inscricoes              -> backend: inscricoes
└── certificados            -> backend: certificados
```

Ponto de atencao:

- `numeros institucionais` da home ainda nao tem model especifico no Prisma.
- Se esses numeros precisarem ser editaveis no admin, criar um model proprio depois.

## 15. O que nao precisa fazer ainda

Por enquanto nao precisa:

- Mexer no frontend.
- Criar painel admin visual.
- Criar area do associado no React.
- Substituir mocks.
- Fazer upload real de imagens.
- Criar deploy.
- Criar tela de login no frontend.

Observacao: isso vale para a prioridade atual. O frontend existe e esta documentado aqui, mas nao precisa ser desenvolvido agora se o foco da equipe for fechar backend e banco primeiro.

## 16. Status resumido

Estado atual:

- Backend: base pronta.
- Banco: tabelas criadas e vazias.
- Prisma: funcionando.
- Docker: estrutura definida.
- CRUDs: ainda nao implementados.
- Auth: ainda nao implementado.
- Seed: ainda nao implementado.
- Frontend publico: paginas criadas visualmente, usando mocks.
- Frontend admin: ainda nao existe.
- Frontend associado: ainda nao existe.
- Integracao front-back: ainda nao existe.

Proximo passo mais importante:

Criar seed de admin e implementar o modulo `auth`.

## 17. Ordem sugerida de desenvolvimento geral

Para evitar retrabalho, a ordem mais segura e:

1. Fechar banco e migrations.
2. Criar seed de admin.
3. Implementar auth no backend.
4. Implementar guards JWT e roles.
5. Implementar CRUD de usuarios.
6. Implementar CRUDs de conteudo publico.
7. Implementar associados, inscricoes e certificados.
8. Testar API com Prisma/Postman/Insomnia.
9. Criar camada de API no frontend.
10. Substituir mocks das paginas publicas.
11. Criar painel admin.
12. Criar area do associado.
13. Revisar responsividade, textos e encoding.
14. Preparar deploy.
