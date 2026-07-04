# Relatório de Auditoria e Gap Analysis — ACIC

Este documento contém o mapeamento e a análise profunda do repositório, refletindo o estado real e atual do código.

> **Última atualização:** 04/07/2026

## 0. Mapeamento Atual do Repositório

A estrutura física encontrada é a seguinte:
- **Backend Modules** (`backend/src/modules/`): `associados`, `auth`, `certificados`, `diretoria`, `eventos`, `inscricoes`, `noticias`, `presidentes`, `quem-somos`, `servicos`, `slides`, `upload`, `usuarios`.
- **Frontend Pages** (`frontend/src/pages/`):
  - `Admin/Dashboard`, `Admin/Diretoria`, `Admin/Eventos`, `Admin/Noticias`, `Admin/Presidentes`, `Admin/QuemSomos`, `Admin/Servicos`, `Admin/Slides`
  - `Public/Eventos`, `Public/Home`, `Public/Institucional`, `Public/Login`, `Public/NotFound`, `Public/Noticias`, `Public/Servicos`
- **Frontend Services** (`frontend/src/services/`): `api.js`, `eventosService.js`, `institucionalService.js`, `noticiasService.js`, `servicosService.js`, `slidesService.js`, `uploadService.js`
- **Frontend Components** (`frontend/src/components/`): `Admin` (layouts e tabela compartilhados), `BlockRenderer`, `Breadcrumb`, `DirectorCard`, `EventRow`, `HeroSlider`, `Layout`, `Navbar`, `NewsCard`, `PrivateRoute`, `RichEditor`, `ScrollToTop`, `ServiceCard`
- **Frontend Mocks** (`frontend/src/mocks/`): ✅ **Pasta excluída** — não existe mais no projeto.

---

## 1. Backend — Status Módulo a Módulo

| Módulo | Completo | Guards | DTOs | Prisma Errors | Swagger | App Module | Git Status | Status |
|---|---|---|---|---|---|---|---|---|
| `auth` | ✅ Sim | N/A | ✅ Sim | N/A | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `usuarios` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `presidentes` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `slides` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `quem-somos` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `servicos` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `eventos` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `diretoria` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `upload` | ✅ Sim | ✅ Sim | N/A | N/A | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `noticias` | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Versionado | **Completo** |
| `associados` | ❌ Não | ❌ Não | ❌ Vazios | ❌ Não | ❌ Não | ❌ Não | ✅ Versionado | **Não iniciado** |
| `inscricoes` | ❌ Não | ❌ Não | ❌ Vazios | ❌ Não | ❌ Não | ❌ Não | ✅ Versionado | **Não iniciado** |
| `certificados`| ❌ Não | ❌ Não | ❌ Vazios | ❌ Não | ❌ Não | ❌ Não | ✅ Versionado | **Não iniciado** |

---

## 2. Frontend — Status Página a Página

### 2.1. Páginas Públicas

| Página | Consome API | Tratamento de Erro/Loading | SEO (`<Helmet>`) | Rota / Guard | Componentes OK |
|---|---|---|---|---|---|
| **Home** | ✅ Sim | ✅ Sim | ✅ Sim | ✅ `/` | ✅ Sim |
| **Eventos / Detalhe** | ✅ Sim | ✅ Erro visualizado | ✅ Sim | ✅ `/eventos`, `/eventos/:slug` | ✅ Sim |
| **Serviços / Detalhe** | ✅ Sim | ✅ Erro visualizado | ✅ Sim | ✅ `/servicos`, `/servicos/:slug` | ✅ Sim |
| **Notícias / Detalhe** | ✅ Sim | ✅ Erro visualizado | ✅ Sim | ✅ `/noticias`, `/noticias/:slug` | ✅ Sim |
| **Institucional (Todos)** | ✅ Sim | ⚠️ Aviso simples ("Conteúdo não publicado") | ✅ Sim | ✅ Registradas | ✅ Sim |
| **Login** | ✅ Sim | ✅ Sim | N/A | ✅ `/login` | ✅ Sim |

### 2.2. Páginas Administrativas (Painel Admin)

| Página Admin | List (GET) | Form (POST/PATCH) | Delete | Upload de Imagem | Rota Protegida |
|---|---|---|---|---|---|
| **Dashboard** | N/A | N/A | N/A | N/A | ✅ `/admin` |
| **Slides** | ✅ `SlidesList.jsx` | ✅ `SlideForm.jsx` | ✅ Sim | ✅ Sim | ✅ `/admin/slides` |
| **Presidentes** | ✅ `PresidentesList.jsx` | ✅ `PresidenteForm.jsx` | ✅ Sim | ✅ Sim | ✅ `/admin/presidentes` |
| **Diretoria** | ✅ `DiretoriaList.jsx` | ✅ `DiretoriaForm.jsx` | ✅ Sim | ✅ Sim | ✅ `/admin/diretoria` |
| **Serviços** | ✅ `ServicosList.jsx` | ✅ `ServicosForm.jsx` | ✅ Sim | ✅ Sim | ✅ `/admin/servicos` |
| **Eventos** | ✅ `EventosList.jsx` | ✅ `EventoForm.jsx` | ✅ Sim | ✅ Sim | ✅ `/admin/eventos` |
| **Notícias** | ✅ `NoticiasList.jsx` | ✅ `NoticiaForm.jsx` | ✅ Sim | ✅ Sim | ✅ `/admin/noticias` |
| **Páginas Institucionais** | ✅ `QuemSomosList.jsx` | ✅ `QuemSomosForm.jsx` | ✅ Sim | N/A | ✅ `/admin/quemsomos` |

> **Componentes Admin Compartilhados:** `AdminFormLayout.jsx`, `AdminListLayout.jsx`, `AdminTable.jsx`, `AdminGlobal.css`, `AdminTable.css` — formam o design system do painel.  
> **Editor Rich Text:** O componente `RichEditor.jsx` é utilizado nos formulários que exigem edição de conteúdo rico (Notícias, Institucional).

---

## 3. Integração Front ↔ Back

| Endpoint / Fluxo | Status Atual |
|---|---|
| **Painel Administrativo (Rotas de POST/PATCH/DELETE)** | ✅ **Resolvido.** O frontend agora possui telas completas de CRUD para Slides, Presidentes, Diretoria, Serviços, Eventos, Notícias e Páginas Institucionais. Todas as rotas admin do backend estão consumidas pelo frontend. |
| **Listagem de Notícias** | ✅ **Resolvido.** A página `Noticias.jsx` foi criada em `Public/Noticias/` junto com `NoticiaDetalhe.jsx`. Rotas `/noticias` e `/noticias/:slug` estão registradas no `App.jsx`. |
| **Upload de Imagens** | ✅ **Integrado.** O `uploadService.js` foi adicionado e é usado pelos formulários admin para envio de arquivos. |

---

## 4. Banco de Dados / Prisma

- **Coerência Geral:** O banco está em perfeita sincronia com o Prisma (`schema is up to date`). Não há migrações pendentes.
- **Modelos Órfãos:** `Associado`, `InscricaoEvento`, e `CertificadoSolicitacao` existem de forma robusta no banco, mas não possuem serviços/controllers no Backend (conforme tabela na Seção 1).

---

## 5. Segurança

- ✅ **Rotas:** Upload e rotas admin devidamente protegidas (verificado no arquivo `upload.controller.ts`).
- ✅ **Secrets:** `JWT_SECRET` alinhado entre o `.env` raiz (Docker) e o `backend/.env` (Local).
- ✅ **URLs:** Não há `localhost:3000` hardcoded na lógica das páginas ou controllers, apenas no fallback do `api.js`.
- ✅ **PasswordHash:** Não há vazamento da hash de senha. O serviço de usuários limpa a propriedade `passwordHash` (com desestruturação `const { passwordHash: _, ...result } = user;`) antes de retornar a resposta.
- ✅ **Rate Limiting:** ~~Bug anterior corrigido.~~ O `ThrottlerModule` em `app.module.ts` agora está configurado para `ttl: 60000, limit: 100` (100 requisições por minuto), valor adequado para operação normal do portal.

---

## 6. Infra / Docker

- **docker-compose.yml**: Totalmente configurado com redes (`acic_network`), volumes de banco (`pgdata`) e uploads, init.sql mapeado para boot, healthchecks rígidos configurados com sucesso.
- **.gitignore**: Cobre arquivos críticos e builds reais (`.env`, `node_modules`, `dist`).

---

## 7. Comparação Funcional com a Referência (cacb.org.br)

| Seção (Referência CACB) | Status no Projeto ACIC | Arquivo Vinculado |
|---|---|---|
| Quem Somos | ✅ Já existe | `QuemSomos.jsx` |
| Diretoria | ✅ Já existe | `Diretoria.jsx` |
| Palavra do Presidente | ❌ Não existe ainda | N/A |
| Estrutura Organizacional | ✅ Já existe | `EstruturaOrganizacional.jsx` |
| Estatuto | ✅ Já existe | `Estatuto.jsx` |
| CMEC | ✅ Já existe | `Cmec.jsx` |
| Contatos | ✅ Já existe | `Contatos.jsx` |
| Galeria de Presidentes | ✅ Já existe | `GaleriaPresidentes.jsx` |
| Notícias | ✅ Completo | `Noticias.jsx` + `NoticiaDetalhe.jsx` |
| Informativos | ❌ Não existe ainda | N/A |
| Revistas | ❌ Não existe ainda | N/A |
| Posicionamentos | ❌ Não existe ainda | N/A |
| Identidade Visual | ❌ Não existe ainda | N/A |
| ACIC na mídia | ❌ Não existe ainda | N/A |
| Eventos | ✅ Já existe | `Eventos.jsx` |
| Serviços | ✅ Já existe | `Servicos.jsx` |
| Newsletter | ❌ Não existe ainda | N/A |
| Publicações | ❌ Não existe ainda | N/A |
| Vídeos | ❌ Não existe ainda | N/A |

---

## 8. Lista Priorizada de Pendências

### ~~🔴 Crítico (Bloqueia produção / Experiência Quebrada)~~

> **✅ Todos os itens críticos foram resolvidos:**
> - ~~Remover ou aumentar o Rate Limit Global~~ → Corrigido para 100 req/min.
> - ~~Página de Listagem de Notícias~~ → Implementada com `Noticias.jsx` e `NoticiaDetalhe.jsx`.

### ~~🟡 Atenção (Necessita limpeza ou desenvolvimento ativo)~~

> **✅ Todos os itens de atenção foram resolvidos:**
> - ~~Desenvolvimento do Painel Admin (Frontend)~~ → Completamente implementado com 7 módulos de CRUD.
> - ~~Limpeza de Lixo do Repositório~~ → Pasta `mocks/` excluída.

### 🟢 Nice-to-have (Melhorias Futuras)
1. Iniciar desenvolvimento do "Espaço do Associado" (módulos de associados, inscrições, certificados).
2. Adicionar uma seção "Newsletter" no rodapé e "Publicações" em formato de PDF, seguindo a estrutura da referência.
3. Criar a página "Palavra do Presidente" para completar a cobertura institucional.

---

## 9. Roadmap Sugerido (Atualizado)

Com base no gap analysis atualizado, as sprints passadas concluíram com êxito os marcos 1, 2 e 3 do roadmap original. O foco agora avança para os módulos de segunda fase:

1. ~~**Correções Expressas (Concluído):**~~ Throttler corrigido e mocks excluídos.
2. ~~**Painel Admin Básico (Concluído):**~~ Telas React do Admin implementadas para Slides, Presidentes, Diretoria, Serviços, Eventos, Notícias e Páginas Institucionais.
3. ~~**Página de Notícias (Concluído):**~~ Rota `/noticias` e `/noticias/:slug` implementadas no frontend público.
4. **Módulo de Associados (Backend + Frontend):** Criar o backend que lida com empresas (CNPJ, active flag), seguido das telas no frontend (Área logada).
5. **Inscrições em Eventos:** Depende do Módulo de Associados. Permite que um Associado logado confirme presença em um evento.
6. **Módulo de Certificados:** Depende das inscrições. Gerencia a emissão pós-evento.
7. **Conteúdo Editorial Complementar:** Páginas de Informativos, Revistas, Posicionamentos e Identidade Visual.
