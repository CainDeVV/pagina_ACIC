# Instalação e Execução — Portal ACIC

Este documento descreve como configurar e executar o Portal ACIC localmente. O projeto é totalmente conteinerizado — a única dependência obrigatória na máquina host é o **Docker**.

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20+)
- [Docker Compose](https://docs.docker.com/compose/) (já incluso no Docker Desktop)
- Git

Não é necessário ter Node.js, PostgreSQL ou nenhuma outra dependência instalada na máquina — tudo roda dentro dos containers.

---

## 1. Clonar o repositório

```bash
git clone https://github.com/CainDeVV/pagina_ACIC.git
cd pagina_ACIC
git checkout develop
```

---

## 2. Configurar variáveis de ambiente

O projeto usa um arquivo `.env` na raiz (não versionado, por segurança) para configurar banco de dados, autenticação e URLs. Crie o arquivo `.env` na raiz do projeto com o conteúdo abaixo, ajustando o que for necessário:

```env
# Banco de dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=acic_db
POSTGRES_PORT=5432

# Backend
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000
```

> Todas as variáveis têm um valor padrão definido no `docker-compose.yml`, então o sistema sobe mesmo sem `.env` — mas **para produção é obrigatório definir `JWT_SECRET` e senhas de banco próprias**, nunca usar os valores padrão.

---

## 3. Subir os containers

Na raiz do projeto:

```bash
docker compose up --build
```

Isso vai:
1. Subir o banco **PostgreSQL 16** e aguardar seu healthcheck ficar saudável
2. Subir o **backend** (NestJS), que automaticamente:
   - Gera o client do Prisma (`prisma generate`)
   - Aplica as migrations pendentes (`prisma migrate deploy`)
   - Executa o seed do usuário administrador (`prisma db seed`)
   - Inicia a API em modo desenvolvimento (hot reload)
3. Subir o **frontend** (Vite), que aguarda o backend estar saudável antes de iniciar

---

## 4. Acessar o sistema

| Serviço | URL |
|---|---|
| Portal público (frontend) | http://localhost:5173 |
| Login do painel administrativo | http://localhost:5173/login |
| API (backend) | http://localhost:3000/api |
| Documentação Swagger da API | http://localhost:3000/api/docs |

> **Atenção:** a tela de login (`/login`) não tem link visível no portal público — é uma decisão de design (o painel admin não é divulgado para o público geral). Para acessá-la, é necessário digitar a URL diretamente na barra de endereço do navegador.

### Credenciais do usuário administrador (seed)

```
E-mail: admin@acic.local
Senha:  admin123
```

> **Atenção:** essa é uma credencial de desenvolvimento/demonstração. Antes de qualquer uso em produção, a senha deve ser alterada.

---

## 5. Parar os containers

```bash
docker compose down
```

Para remover também os dados do banco (reset completo):

```bash
docker compose down -v
```

---

## Estrutura dos containers

| Container | Porta | Descrição |
|---|---|---|
| `acic_db` | 5432 | PostgreSQL 16 |
| `acic_backend` | 3000 | API NestJS |
| `acic_frontend` | 5173 | SPA React (Vite dev server) |

Os três containers se comunicam através da rede interna `acic_network`. Os dados do banco são persistidos no volume `pgdata`, e os arquivos enviados (imagens, PDFs) ficam mapeados na pasta local `./uploads`.

---

## Restaurando um dump de exemplo (opcional)

O repositório inclui um dump de exemplo (`backup_acic.sql`) com dados de demonstração. Para restaurá-lo após subir os containers:

```bash
docker exec -i acic_db psql -U postgres -d acic_db < backup_acic.sql
```

---

## Problemas comuns

| Sintoma | Causa provável / solução |
|---|---|
| Backend não conecta ao banco | Aguarde o healthcheck do `db` terminar — o backend só sobe depois que o banco reporta como saudável |
| Frontend não carrega dados da API | Confira se `VITE_API_URL` no `.env` aponta para `http://localhost:3000` |
| Erro de CORS no navegador | Confira se `FRONTEND_URL` no `.env` do backend está igual à URL real onde o frontend está rodando |
| Porta já em uso | Altere `POSTGRES_PORT` no `.env` ou libere a porta 3000/5173 na máquina |
| Uploads não aparecem | Verifique se a pasta `./uploads` tem permissão de escrita para o Docker |
