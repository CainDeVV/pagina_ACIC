--
-- PostgreSQL database dump
--

\restrict tvVIJQLn1gtnyw3y6PLOyLczcOQvDMHMi9aA2fBjFdXI4B2DIMk8x1KWaiT7reX

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Servico" DROP CONSTRAINT IF EXISTS "Servico_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Noticia" DROP CONSTRAINT IF EXISTS "Noticia_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."InscricaoEvento" DROP CONSTRAINT IF EXISTS "InscricaoEvento_eventoId_fkey";
ALTER TABLE IF EXISTS ONLY public."InscricaoEvento" DROP CONSTRAINT IF EXISTS "InscricaoEvento_associadoId_fkey";
ALTER TABLE IF EXISTS ONLY public."HomeSlide" DROP CONSTRAINT IF EXISTS "HomeSlide_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Evento" DROP CONSTRAINT IF EXISTS "Evento_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."CertificadoSolicitacao" DROP CONSTRAINT IF EXISTS "CertificadoSolicitacao_eventoId_fkey";
ALTER TABLE IF EXISTS ONLY public."CertificadoSolicitacao" DROP CONSTRAINT IF EXISTS "CertificadoSolicitacao_associadoId_fkey";
ALTER TABLE IF EXISTS ONLY public."Associado" DROP CONSTRAINT IF EXISTS "Associado_userId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Servico_slug_key";
DROP INDEX IF EXISTS public."QuemSomosSection_key_key";
DROP INDEX IF EXISTS public."Noticia_slug_key";
DROP INDEX IF EXISTS public."InscricaoEvento_eventoId_associadoId_key";
DROP INDEX IF EXISTS public."Evento_slug_key";
DROP INDEX IF EXISTS public."Associado_userId_key";
DROP INDEX IF EXISTS public."Associado_cnpj_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Servico" DROP CONSTRAINT IF EXISTS "Servico_pkey";
ALTER TABLE IF EXISTS ONLY public."QuemSomosSection" DROP CONSTRAINT IF EXISTS "QuemSomosSection_pkey";
ALTER TABLE IF EXISTS ONLY public."Presidente" DROP CONSTRAINT IF EXISTS "Presidente_pkey";
ALTER TABLE IF EXISTS ONLY public."Noticia" DROP CONSTRAINT IF EXISTS "Noticia_pkey";
ALTER TABLE IF EXISTS ONLY public."InscricaoEvento" DROP CONSTRAINT IF EXISTS "InscricaoEvento_pkey";
ALTER TABLE IF EXISTS ONLY public."HomeSlide" DROP CONSTRAINT IF EXISTS "HomeSlide_pkey";
ALTER TABLE IF EXISTS ONLY public."Evento" DROP CONSTRAINT IF EXISTS "Evento_pkey";
ALTER TABLE IF EXISTS ONLY public."Diretor" DROP CONSTRAINT IF EXISTS "Diretor_pkey";
ALTER TABLE IF EXISTS ONLY public."CertificadoSolicitacao" DROP CONSTRAINT IF EXISTS "CertificadoSolicitacao_pkey";
ALTER TABLE IF EXISTS ONLY public."Associado" DROP CONSTRAINT IF EXISTS "Associado_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Servico";
DROP TABLE IF EXISTS public."QuemSomosSection";
DROP TABLE IF EXISTS public."Presidente";
DROP TABLE IF EXISTS public."Noticia";
DROP TABLE IF EXISTS public."InscricaoEvento";
DROP TABLE IF EXISTS public."HomeSlide";
DROP TABLE IF EXISTS public."Evento";
DROP TABLE IF EXISTS public."Diretor";
DROP TABLE IF EXISTS public."CertificadoSolicitacao";
DROP TABLE IF EXISTS public."Associado";
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."RegistrationStatus";
DROP TYPE IF EXISTS public."PublishStatus";
DROP TYPE IF EXISTS public."EventStatus";
DROP TYPE IF EXISTS public."CertificateStatus";
--
-- Name: CertificateStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CertificateStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'ISSUED'
);


--
-- Name: EventStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EventStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CANCELLED',
    'FINISHED'
);


--
-- Name: PublishStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PublishStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


--
-- Name: RegistrationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RegistrationStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'EDITOR',
    'ASSOCIADO'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Associado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Associado" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "companyName" text NOT NULL,
    "tradeName" text,
    cnpj text NOT NULL,
    phone text,
    address text,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CertificadoSolicitacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CertificadoSolicitacao" (
    id text NOT NULL,
    "associadoId" text NOT NULL,
    "eventoId" text,
    reason text,
    status public."CertificateStatus" DEFAULT 'PENDING'::public."CertificateStatus" NOT NULL,
    "fileUrl" text,
    "reviewedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Diretor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Diretor" (
    id text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    category text NOT NULL,
    "photoUrl" text,
    bio text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Evento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Evento" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description jsonb NOT NULL,
    location text,
    "startsAt" timestamp(3) without time zone NOT NULL,
    "endsAt" timestamp(3) without time zone,
    capacity integer,
    "coverImage" text,
    status public."EventStatus" DEFAULT 'DRAFT'::public."EventStatus" NOT NULL,
    "authorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    destaque boolean DEFAULT false NOT NULL
);


--
-- Name: HomeSlide; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HomeSlide" (
    id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    "imageUrl" text NOT NULL,
    "linkUrl" text,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "authorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: InscricaoEvento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InscricaoEvento" (
    id text NOT NULL,
    "eventoId" text NOT NULL,
    "associadoId" text NOT NULL,
    status public."RegistrationStatus" DEFAULT 'PENDING'::public."RegistrationStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Noticia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Noticia" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    summary text,
    content jsonb NOT NULL,
    "coverImage" text,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "authorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Presidente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Presidente" (
    id text NOT NULL,
    name text NOT NULL,
    "termStart" integer NOT NULL,
    "termEnd" integer,
    "photoUrl" text,
    bio text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: QuemSomosSection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuemSomosSection" (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    content jsonb NOT NULL,
    status public."PublishStatus" DEFAULT 'PUBLISHED'::public."PublishStatus" NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Servico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Servico" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    summary text,
    description jsonb NOT NULL,
    icon text,
    "imageUrl" text,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "authorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    destaque boolean DEFAULT false NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'EDITOR'::public."UserRole" NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Associado; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Associado" (id, "userId", "companyName", "tradeName", cnpj, phone, address, active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CertificadoSolicitacao; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CertificadoSolicitacao" (id, "associadoId", "eventoId", reason, status, "fileUrl", "reviewedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Diretor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Diretor" (id, name, role, category, "photoUrl", bio, "sortOrder", "createdAt", "updatedAt") FROM stdin;
0576984d-9e16-4604-9b97-a72e4eaa8d17	FRANCISCO ROBERTO LIMA E SILVA	GRÁFICA CRATEÚS	I VICE-PRESIDENTE	\N	\N	2	2026-07-04 21:35:41.309	2026-07-04 21:39:24.839
43526c1a-3e15-4fcf-93c1-0723cbc87f4a	ANTONIO OSVALDO PONTES DE MELO	TINA CONDIMENTOS	I SECRETÁRIO	\N	\N	4	2026-07-04 21:38:15.398	2026-07-04 21:39:34.377
49afb6ee-7f5d-4030-8bb3-d326c3cc92a6	ANTÔNIO WAGNER CLAUDINO SALES	RANCHEIRA W&S	II SECRETÁRIO	\N	\N	3	2026-07-04 21:38:43.887	2026-07-04 22:27:56.273
5453c786-3ce5-4ca8-900a-34042742d2b9	MARIA DO CARMO XIMENES DE PINHO	ACIC	PRESIDENTE	\N	Empresária com vasta experiência no varejo e gestão corporativa, focada na inovação do comércio de Crateús.	1	2026-07-04 21:35:14.882	2026-07-04 23:26:21.965
\.


--
-- Data for Name: Evento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Evento" (id, title, slug, description, location, "startsAt", "endsAt", capacity, "coverImage", status, "authorId", "createdAt", "updatedAt", destaque) FROM stdin;
a909cb7e-7d7b-4dd7-a779-9bfefeecd485	150 Anos da ACIC Crateús	150-anos-da-acic-crateus	{"time": 1783212001578, "blocks": [{"id": "eucTRiUgLY", "data": {"text": "Em 2026, a Associação Comercial e Industrial de Crateús (ACIC) celebra 150 anos de história, consolidando-se como uma das mais importantes entidades de representação empresarial do interior do Ceará.<br>Fundada com o objetivo de fortalecer o comércio local e impulsionar o desenvolvimento econômico da região, a ACIC percorreu um longo caminho de conquistas, desafios e transformações, sempre ao lado dos empresários e empreendedores crateusenses."}, "type": "paragraph"}, {"id": "QvBSfd4ckt", "data": {"text": "Uma trajetória de conquistas", "level": 3}, "type": "header"}, {"id": "6epxpJtEwv", "data": {"text": "Ao longo de 150 anos, a ACIC atuou ativamente na defesa dos interesses do setor produtivo local, promovendo eventos, capacitações, feiras de negócios e ações de desenvolvimento empresarial que beneficiaram milhares de comerciantes e empresários da região."}, "type": "paragraph"}, {"id": "gbQQUe9dDE", "data": {"text": "Programação das Comemorações", "level": 3}, "type": "header"}, {"id": "llDzP_benz", "data": {"text": "<b>Exposição Histórica:</b> Galeria fotográfica e documental com registros dos 150 anos de atuação da ACIC Crateús.<br><b>Jantar Comemorativo:</b>&nbsp;Celebração especial com autoridades, empresários e parceiros da entidade.<br><b>Fórum Empresarial:</b>&nbsp;Debates e palestras sobre o futuro do empreendedorismo na região.<br><b>Premiação:</b>&nbsp;Reconhecimento de empresas e personalidades que contribuíram para o desenvolvimento comercial de Crateús.&nbsp;&nbsp;"}, "type": "paragraph"}, {"id": "FdL45n2U38", "data": {"text": "Participe desta história", "level": 3}, "type": "header"}, {"id": "g9LyWunKYF", "data": {"text": "As comemorações dos 150 anos são uma oportunidade única de celebrar a história da nossa cidade e reafirmar o compromisso da ACIC com o desenvolvimento econômico e social de Crateús e região. Fique atento às redes sociais para mais informações sobre a programação completa."}, "type": "paragraph"}], "version": "2.31.6"}	Sede da ACIC - Crateús, CE	2026-12-12 17:15:00	2026-12-13 18:16:00	200	https://cacb.org.br/wp-content/uploads/2024/01/hero-servicos-registro-de-marca.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 23:12:04.734	2026-07-05 00:40:01.628	t
d4f0e333-c407-4b8d-9dd1-f5d04ab62adc	Evento 03	evento-03	{"time": 1783212013841, "blocks": [{"id": "9Rv33wsKJD", "data": {"text": "Descrição 03"}, "type": "paragraph"}], "version": "2.31.6"}	Localização 03	2026-12-15 18:15:00	2026-12-16 15:12:00	47	\N	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:26:56.911	2026-07-05 00:40:13.847	t
5e2b7614-1b8c-47c0-8f27-a4bebc26a2af	Evento 04	evento-04	{"time": 1783212054419, "blocks": [{"id": "LwLPMguQcN", "data": {"text": "Descrição 04"}, "type": "paragraph"}], "version": "2.31.6"}	Localização 04	2026-12-12 18:51:00	2026-12-13 15:41:00	23	\N	CANCELLED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:27:34.962	2026-07-05 00:40:54.426	f
7514ab53-ff62-42ae-97ac-e8e9b71121f7	Evento 01	evento-01	{"time": 1783211893848, "blocks": [{"id": "CyLbRiYFrG", "data": {"text": "Evento 01&nbsp;Evento 01&nbsp;Evento 01"}, "type": "paragraph"}], "version": "2.31.6"}	Localização 01	2026-12-12 16:13:00	2026-12-12 17:14:00	50	\N	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:26:00.245	2026-07-05 00:38:13.853	f
c0551376-5f4f-401c-b6c5-5a43e2006238	Evento 02	evento-02	{"time": 1783211909472, "blocks": [{"id": "Tb9tqLergL", "data": {"text": "Descrição 02"}, "type": "paragraph"}], "version": "2.31.6"}	Localização 02	2024-12-13 17:14:00	2025-12-14 17:14:00	\N	\N	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:26:24.809	2026-07-05 00:38:29.479	f
\.


--
-- Data for Name: HomeSlide; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HomeSlide" (id, title, subtitle, "imageUrl", "linkUrl", status, "sortOrder", "authorId", "createdAt", "updatedAt") FROM stdin;
b52b25a5-040c-4214-b632-81e0f9216480	Fortalecendo o comércio de Crateús	Há décadas unindo empresários e impulsionando a economia regional	https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80	\N	PUBLISHED	1	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 22:17:19.043	2026-07-04 22:31:59.272
578dabd7-1345-4ead-a1dd-be8aa16633a6	Conectando empresários de todos os setores	Comércio, indústria, agropecuária e serviços em um só lugar	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80	\N	PUBLISHED	2	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 22:17:46.545	2026-07-04 22:32:15.98
c25a524d-877a-4d36-aa39-732bb1a11b58	Sua voz no desenvolvimento regional	Representação política e institucional para o empresário cearense	https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&q=80	\N	PUBLISHED	3	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 22:18:02.059	2026-07-04 22:32:20.854
\.


--
-- Data for Name: InscricaoEvento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InscricaoEvento" (id, "eventoId", "associadoId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Noticia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Noticia" (id, title, slug, summary, content, "coverImage", status, "publishedAt", "authorId", "createdAt", "updatedAt") FROM stdin;
c1b44966-599c-493f-b816-fb9b878a95ea	Noticia 05	noticia-05	Noticia 05 Sumario Noticia 05 Noticia 05 Noticia 05 Noticia 05 Noticia 05	{"time": 1783212189052, "blocks": [{"id": "y6Ofc0X5UO", "data": {"text": "Noticia 05&nbsp;Noticia 04&nbsp;Noticia 03&nbsp;Noticia 02&nbsp;Noticia 01&nbsp;Noticia 00"}, "type": "paragraph"}], "version": "2.31.6"}	\N	PUBLISHED	2026-12-15 14:15:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:15:05.555	2026-07-05 00:43:09.06
8eaee9d5-6160-4e6f-8c27-db34fa03b070	Noticia 04	noticia-04	Noticia 04 Sumario	{"time": 1783212193310, "blocks": [{"id": "Td7Bp7sSXn", "data": {"text": "Noticia 04"}, "type": "paragraph"}], "version": "2.31.6"}	\N	PUBLISHED	2026-12-13 16:13:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:14:42.661	2026-07-05 00:43:13.316
c4dfcf69-f879-4104-ab13-373244a95169	Noticia 03	noticia-03	Noticia 03 Sumario	{"time": 1783212196794, "blocks": [{"id": "bleqGNaquL", "data": {"text": "Noticia 03"}, "type": "paragraph"}], "version": "2.31.6"}	\N	PUBLISHED	2026-12-13 15:12:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:13:48.05	2026-07-05 00:43:16.799
e67b00ed-2693-46ab-b460-e33c45ef3867	Noticia 02	noticia-02	Noticia 02 Sumario	{"time": 1783212200916, "blocks": [{"id": "GyjBVNeqPa", "data": {"text": "Eita"}, "type": "paragraph"}], "version": "2.31.6"}	\N	PUBLISHED	2026-12-12 15:12:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:13:33.078	2026-07-05 00:43:20.922
f04857c4-a65f-41e2-a595-766bb53c945d	Noticia 01	noticia-01	Noticia 01 Sumario	{"time": 1783212209864, "blocks": [{"id": "Wi69g5W5vu", "data": {"text": "Noticia 01"}, "type": "paragraph"}], "version": "2.31.6"}	\N	PUBLISHED	2026-12-12 15:12:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 23:26:48.882	2026-07-05 00:43:29.87
\.


--
-- Data for Name: Presidente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Presidente" (id, name, "termStart", "termEnd", "photoUrl", bio, "sortOrder", "createdAt", "updatedAt") FROM stdin;
5a52e0d4-bafa-4f56-895d-42cbdbf9328b	Auton Aragão	1921	1925	http://localhost:3000/uploads/presidentes/43db60c8-5059-4fa4-8df0-bf3eaa72a984.jpeg	\N	1	2026-07-05 02:40:56.8	2026-07-05 02:40:56.8
8dcdcc04-fa14-4abe-b531-b1d56ca22db3	Francisco Roberto Lima e Silva	2017	2023	http://localhost:3000/uploads/presidentes/a4d0ac6d-fe05-478a-8a57-a4862dd2222c.jpeg	Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal.	26	2026-07-04 22:26:48.785	2026-07-05 02:28:54.442
3c9926d6-607b-48e0-81fe-ac9112645861	Antônio Luiz Benevides Sales	2015	2016	http://localhost:3000/uploads/presidentes/7e86fcb7-0769-4d6a-9bdb-039e00b12927.jpeg	\N	25	2026-07-04 22:31:44.362	2026-07-05 02:29:09.339
93202e54-dab9-49e1-b0b3-77e226e5351e	José de Melo Cavalcante	1999	2003	http://localhost:3000/uploads/presidentes/b9c69588-715e-4d98-bc0d-ee86f6ff285a.jpeg	\N	24	2026-07-05 02:29:47.406	2026-07-05 02:29:47.406
0719e948-4b59-4805-97d6-8f776babfaf5	Fernando Antônio Aguiar Albuquerque	1995	1997	http://localhost:3000/uploads/presidentes/bbad030e-14e3-4093-9d85-0badc5bbf55f.jpeg	\N	23	2026-07-05 02:30:01.465	2026-07-05 02:30:10.554
5c5a7764-7b78-4812-ba13-a8e04b518318	José Airton Melo Aguiar	1991	1993	http://localhost:3000/uploads/presidentes/a23f9848-543f-4f8f-a00c-9acb504afea7.jpeg	\N	22	2026-07-05 02:30:30.979	2026-07-05 02:30:30.979
9eafa5e7-bf63-41dc-b417-89248b92de94	Antônio Soares Martins	1984	1991	http://localhost:3000/uploads/presidentes/7f12dfbe-005b-44b6-bbbe-49d52265882d.jpeg	\N	21	2026-07-05 02:30:57.948	2026-07-05 02:30:57.948
6813e143-3145-4798-9144-2b162b1ec622	Edmundo Pinto Filho	1982	1984	http://localhost:3000/uploads/presidentes/190336ea-1a42-42fe-b05e-30f63c398fe0.jpeg	\N	20	2026-07-05 02:31:19.152	2026-07-05 02:31:19.152
af05788b-b942-40d1-91d1-aec1f66b5813	Antonio Pimentel Rocha	1980	1982	http://localhost:3000/uploads/presidentes/fdc6f6aa-7c1b-4ac6-9de5-48d3023d1c98.jpeg	\N	19	2026-07-05 02:32:45.406	2026-07-05 02:32:45.406
26ba2d7a-be02-4f88-94f4-1681d03bb39b	José Américo Moreira	1978	1980	http://localhost:3000/uploads/presidentes/58f307d0-b860-496e-846b-11b87664699c.jpeg	\N	18	2026-07-05 02:33:06.134	2026-07-05 02:33:06.134
f5f39a91-dc76-4a5f-af21-cbac94af719b	Raimundo Bezerra de Melo	1976	1978	http://localhost:3000/uploads/presidentes/dd6c15b9-778c-4543-802c-9800a3b62b02.jpeg	\N	17	2026-07-05 02:33:41.152	2026-07-05 02:33:41.152
2b594e6f-d8b7-402d-b8cb-e42c6a2f36ae	Raimundo Soares Resende	1974	1976	http://localhost:3000/uploads/presidentes/cd56042b-e4c0-4d16-9133-e9e30123b7cf.jpeg	\N	16	2026-07-05 02:34:23.402	2026-07-05 02:34:23.402
2ea9b675-a5d7-499e-825c-5662d7d620de	Boanerges Cisne Sales	1971	1974	http://localhost:3000/uploads/presidentes/5513a420-650d-4d76-9c70-2466990dc235.jpeg	\N	15	2026-07-05 02:34:57.106	2026-07-05 02:34:57.106
1aa15cad-2bbe-4e1d-8563-63d49e03d846	João José de Castro	1968	1971	http://localhost:3000/uploads/presidentes/f6583c58-d50a-41f3-98d6-b87284e5cbf6.jpeg	\N	14	2026-07-05 02:35:14.968	2026-07-05 02:35:14.968
00929f4d-2cc3-4563-8278-11ce966dfd35	Francisco de Assis Machado	1964	1968	http://localhost:3000/uploads/presidentes/d93b368e-bf42-4aa7-88f2-6fa6f3d8f956.jpeg	\N	13	2026-07-05 02:36:24.276	2026-07-05 02:36:24.276
1a13f500-bf11-4318-8580-991b3ba67e4e	Antônio de Melo Rosa	1961	1964	http://localhost:3000/uploads/presidentes/c7a7c113-0414-4979-b918-681d7c28602b.jpeg	\N	12	2026-07-05 02:36:41.675	2026-07-05 02:36:41.675
6205b722-3052-450a-b4f6-51648b138682	Armando Marques Mourão	1958	1961	http://localhost:3000/uploads/presidentes/72d62d0c-a929-4fd4-b09a-0726a0107b28.jpeg	\N	11	2026-07-05 02:37:21.566	2026-07-05 02:37:21.566
a92e2c9d-0d31-412f-a560-44b2a99e1c32	Pedro de Miranda Melo	1954	1958	http://localhost:3000/uploads/presidentes/b3826258-469d-4659-a852-bb5e0f7875f2.jpeg	\N	10	2026-07-05 02:37:44.971	2026-07-05 02:37:44.971
2ff8c42f-371c-4aff-bc0f-1fde0719c2e8	Bento Coutinho de Macedo	1951	1954	http://localhost:3000/uploads/presidentes/4d260188-e51a-48a9-9ca6-50baaa31fd5b.jpeg	\N	9	2026-07-05 02:38:13.182	2026-07-05 02:38:13.182
4e8029d1-57f8-414d-b2db-1a50328b4b41	Julio Evaristo de Paiva	1947	1951	http://localhost:3000/uploads/presidentes/63514f0d-e9ca-47b8-8730-22c99c10d806.jpeg	\N	8	2026-07-05 02:38:32.151	2026-07-05 02:38:32.151
73df3705-8351-44b9-a27a-83bafacca9e3	Francisco Melo Lima	1943	1947	http://localhost:3000/uploads/presidentes/8a906a0e-e905-42ab-a362-15554250686c.jpeg	\N	7	2026-07-05 02:38:51.777	2026-07-05 02:38:51.777
66c3d9a7-ff22-414d-971e-4e594beaeb43	Manoel Evaristo de Paiva	1939	1943	http://localhost:3000/uploads/presidentes/e2cedd8e-52ac-44cc-b607-aebc54befcff.jpeg	\N	6	2026-07-05 02:39:10.972	2026-07-05 02:39:10.972
fc440316-4f8c-4975-89e7-c11a0353ee2f	Pedro Machado da Ponte	1935	1939	http://localhost:3000/uploads/presidentes/3cec27bd-4091-4f2b-adfd-84544fca365d.jpeg	\N	5	2026-07-05 02:39:56.165	2026-07-05 02:39:56.165
0451075a-ee86-451e-b748-0960e3126131	Abel Alcanfor Soares	1931	1935	http://localhost:3000/uploads/presidentes/5b220f98-fc99-4c9a-8e76-bff65947dcff.jpeg	\N	4	2026-07-05 02:40:10.702	2026-07-05 02:40:10.702
97577a77-83f4-4f88-977b-5a5ccadc52cc	Firmino Rocha Aguiar	1929	1931	http://localhost:3000/uploads/presidentes/eb2d6d1e-6e63-4504-ae10-370183242b27.jpeg	\N	3	2026-07-05 02:40:27.632	2026-07-05 02:40:27.632
38f93392-0855-4d27-a110-70994bf0d979	Francisco Mariano Cavalcante	1925	1929	http://localhost:3000/uploads/presidentes/17b7ed19-8a26-4987-a443-296d52e42f0e.jpeg	\N	2	2026-07-05 02:40:41.261	2026-07-05 02:40:41.261
\.


--
-- Data for Name: QuemSomosSection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."QuemSomosSection" (id, key, title, content, status, "sortOrder", "createdAt", "updatedAt") FROM stdin;
81af1727-4785-4a43-abf8-3db635858899	diretoria	Diretoria da ACIC	{"time": 1783214855231, "blocks": [{"id": "K092zRyv24", "data": {"text": "Diretoria", "level": 2}, "type": "header"}, {"id": "v1kMuM-fzc", "data": {"text": "Conheça a composição completa da nossa diretoria executiva, conselhos fiscais e consultivos que atuam em prol do ecossistema empresarial de Crateús."}, "type": "paragraph"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 20:10:01.071	2026-07-05 01:27:35.287
b00d5f0d-f2e5-4e6a-bedf-658f3d7a09eb	presidentes	Galeria de Presidentes	{"time": 1783214885623, "blocks": [{"id": "wbSFKCrcQU", "data": {"text": "Galeria de Presidentes", "level": 2}, "type": "header"}, {"id": "XvvoEfRMMp", "data": {"text": "Conheça os líderes que conduziram a nossa instituição ao longo dos anos, deixando seu legado e contribuindo ativamente para o fortalecimento do associativismo crateuense."}, "type": "paragraph"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-05 01:10:27.12	2026-07-05 01:28:05.673
d4abbf7d-790d-409a-b127-58e30b02c85d	estatuto	Estatuto da CACB	{"time": 1783198163971, "blocks": [{"id": "1bRs9v1Oay", "data": {"text": "Estatuto da CACB", "level": 2}, "type": "header"}, {"id": "P4mnh4Jq8g", "data": {"text": "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais."}, "type": "paragraph"}, {"id": "9yA7LiXnbr", "data": {"text": "Para <a href=\\"https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf\\">baixar o estatuto em PDF clique aqui</a>. Se preferir você pode ver o documento que está disponibilizado a seguir:"}, "type": "paragraph"}, {"id": "VKshr0p3wV", "data": {"url": "https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf"}, "type": "pdfEmbed"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 20:48:50.092	2026-07-04 20:49:24.024
edc0aeee-b38d-48d4-82e6-fc77f282da2c	quem-somos	Quem Somos	{"time": 1783199050831, "blocks": [{"id": "GtlczBZsTa", "data": {"text": "A CACB", "level": 2}, "type": "header"}, {"id": "6AfxRiu5EW", "data": {"text": "A Confederação das Associações Comerciais e Empresariais do Brasil (CACB) é um coletivo empresarial que busca contribuir para o desenvolvimento econômico do país, representando 27 Federações, 2300 Associações Comerciais e Empresariais e 2 milhões de empresas em todo o território nacional."}, "type": "paragraph"}, {"id": "AOs46Wp8Qw", "data": {"text": "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais."}, "type": "paragraph"}, {"id": "Y8Cq1XepKl", "data": {"text": "Histórico", "level": 3}, "type": "header"}, {"id": "i0EAPmQOen", "data": {"text": "A CACB é a entidade de representação empresarial mais antiga das Américas. Sua história teve início com a fundação da Associação Comercial da Bahia, em 15 de julho de 1811, atendendo a três desejos: dos comerciantes, para terem um local condigno onde pudessem se reunir regularmente e aí realizar seus negócios, como já vinham fazendo há anos, na própria Cidade Baixa; do vice-rei do Brasil, D. Marcos de Noronha e Britto, VIII Conde dos Arcos de Val de Vez, interessado no desenvolvimento da província que governava, sede do maior porto do hemisfério sul à época, já aberto, desde 1808, às “nações amigas”; e do Príncipe Regente, D. João VI, de promover o progresso da Colônia, sede provisória da Corte Portuguesa."}, "type": "paragraph"}, {"id": "QWTFRZyOTQ", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2024/03/foto-historia-sede-associacao-acb-bahia.jpg"}, "caption": "Associação Comercial da Bahia, a primeira da história, cujas instalações são tombadas pelo Instituto do Patrimônio Histórico e Artístico Nacional – IPHAN.", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}, {"id": "0gud_jIc36", "data": {"text": "As associações de Norte a Sul do país tiveram importante papel na história do Brasil e na definição e encaminhamento das demandas dos empresários. A Associação Comercial de Alagoas, por exemplo, chegou a controlar a exportação do açúcar no século XIX."}, "type": "paragraph"}, {"id": "HdBKc23ndf", "data": {"text": "O termo &lt;em&gt;comercial&lt;/em&gt;, presente na nomenclatura destas associações vem de transação comercial, estas que, in 1811, eram feitas no local onde a ACBahia foi criada. A sede da Associação passou a centralizar a realização de negócios de diversos produtores e produtos, fomentando o comércio local da época."}, "type": "paragraph"}, {"id": "1NTi1sH_EY", "data": {"text": "Devido ao valor histórico do termo “comercial”, ele foi mantido e, até hoje, serve para dar nome às entidades da rede CACB em todo o país. Engana-se, no entanto, quem pensa que a representatividade do Sistema se limita apenas ao comércio."}, "type": "paragraph"}, {"id": "ZZ6Un7DTOc", "data": {"text": "Pelo contrário! As Associações Comerciais representam empresários dos mais variados setores, como do próprio comércio ou de serviços, indústria, agronegócio, entre outros. Além de defenderem os interesses dos empresários junto ao governo, as ACEs desenvolvem serviços para a classe, como capacitações, assessoria jurídica, planos de saúde, certificados de origem, certificado digital, mediação e arbitragem, entre outros."}, "type": "paragraph"}, {"id": "UjCcpc6YNl", "data": {"text": "<a href=\\"https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf\\">📄 Acesse aqui o estatuto da CACB</a>"}, "type": "paragraph"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 21:01:01.789	2026-07-04 21:04:10.883
dde52338-949b-46c0-a2cd-51d17bab4f81	cmec	CMEC	{"time": 1783199294446, "blocks": [{"id": "i4x8AZyjEd", "data": {"text": "Conselho da Mulher Empreendedora e da Cultura", "level": 2}, "type": "header"}, {"id": "jlPX4Vaqbj", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2022/09/CMEC_NOVO-LOGO_Nacional-Padrao-2-1536x864.png"}, "caption": "[Banner oficial do CMEC Nacional]", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}, {"id": "WiEZLeXIqy", "data": {"text": "O Conselho Nacional da Mulher Empreendedora e da Cultura (CMEC Nacional), é um órgão da Confederação das Associações Comerciais e Empresariais do Brasil (CACB), criado em 24 de abril de 2002, em Brasília, pelo Conselho Diretor desta entidade. A primeira prioridade do CMEC é estimular e apoiar a implantação dos conselhos estaduais, objetivando disseminar o Ideal Empreendedor, difundindo e promovendo o Associativismo como base de sustentação nacional."}, "type": "paragraph"}, {"id": "dRTBK8S4nc", "data": {"text": "A proposta do CMEC é trabalhar intensamente para promover a integração de lideranças femininas, expandindo os contatos do CMEC com as diversas organizações empresariais de todos os estados brasileiros e de outros países."}, "type": "paragraph"}, {"id": "_cDW8T-d6q", "data": {"text": "Com essa missão, o CMEC atua com uma visão pró-ativa, de forma a potencializar a mulher criando oportunidades de aprimoramento profissional, possibilitando a ampliação da sua área de atuação, promovendo uma capacitação cada vez maior e procurando fazer com que ela atue em um competitivo mercado de trabalho."}, "type": "paragraph"}, {"id": "Bj5cvCIrtr", "data": {"text": "Nossas Conquistas", "level": 2}, "type": "header"}, {"id": "n_pR1qsDU6", "data": {"text": "Desde sua instituição, o Conselho obteve importantes conquistas, entre eles o Programa Internacional para Formação de Liderança, o Líder Mulher – Lapidando Diamantes do Sebrae e a realização do XIV Congresso Ibero-Americano das Mulheres Empresárias, que ocorreu entre os dias 19 e 23 de outubro de 2003, na cidade de Araxá (MG), a participação na 56ª sessão da Commission sobre o Status da Mulher na ONU e a reunião com a Chefe de Gabinete da Secretaria de Assuntos Globais das Mulheres, Anita Botti."}, "type": "paragraph"}, {"id": "D1CWxpqI81", "data": {"text": "Para saber mais, acesse o site do CMEC <a href=\\"https://www.cmecmulher.com.br/\\">clicando aqui</a>."}, "type": "paragraph"}, {"id": "l5-KU37wnM", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2025/01/Conselho-executivo-CMEC-2025.jpg"}, "caption": "[Conselho Executivo do CMEC Nacional]", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}, {"id": "P1yHZPPS8c", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2023/10/Conselho-CMEC-outubro-2023-2.jpeg"}, "caption": "[Conselho Consultivo do CMEC Nacional]", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 20:54:23.163	2026-07-04 21:08:14.503
f661fa9d-e756-4453-adf3-bc971df8c843	contatos	Contatos	{"time": 1783200430801, "blocks": [{"id": "seLZdyQ3Va", "data": {"text": "<b>Presidente</b><br>Alfredo Cotait Neto<br>61 – 3321.1311<br><a href=\\"mailto:presidente@cacb.org.br\\">presidente@cacb.org.br</a>"}, "type": "paragraph"}, {"id": "uLUyxGIRWf", "data": {"text": "<b>Superintendente</b><br>Carlos Rezende<br>61 – 3321.1311<br><a href=\\"mailto:rezende@cacb.org.br\\">rezende@cacb.org.br</a>"}, "type": "paragraph"}, {"id": "X5NJsoKAe0", "data": {"text": "<b>Assessora da Diretoria</b><br>Ana Paula Passos<br>61 – 3321.1311<br><a href=\\"mailto:ana.passos@cacb.org.br\\">ana.passos@cacb.org.br</a>"}, "type": "paragraph"}, {"id": "GRcImUX4uE", "data": {"text": "<b>Dúvidas sobre proteção de dados</b><br><a href=\\"mailto:protecaodedados@cacb.org.br\\" target=\\"_blank\\">protecaodedados@cacb.org.br</a>"}, "type": "paragraph"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 21:27:10.857	2026-07-04 21:27:10.857
\.


--
-- Data for Name: Servico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Servico" (id, title, slug, summary, description, icon, "imageUrl", status, "authorId", "createdAt", "updatedAt", destaque) FROM stdin;
29b7cb6b-9097-4113-ba07-0377d020a822	Certificado Digital	certificado-digital	Certificado Digital sem sair de casa	{"time": 1783202032525, "blocks": [], "version": "2.31.6"}	💻	https://cacb.org.br/wp-content/uploads/2023/07/capas-servicos-certificado-digital.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 21:52:23.541	2026-07-04 21:53:52.534	t
186780db-30b2-441f-8b88-28340ca05069	Certificado de Origem	certificado-de-origem	Caminho livre para sua exportação com agilidade	{"time": 1783202037498, "blocks": [], "version": "2.31.6"}	🌍	https://cacb.org.br/wp-content/uploads/2023/07/capas-servicos-certificado-de-origem.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 21:52:07.844	2026-07-04 21:53:57.503	t
430dcb6e-5f84-4ea7-b4b6-3fa3cab7daba	Registro de Marcas, Softwares e Patentes	registro-de-marcas-softwares-e-patentes	Tenha total segurança para investir nos seus negócios.	{"time": 1783202921214, "blocks": [{"id": "Sb-b5mNOsc", "data": {"text": "O serviço de registro de marcas é importante para dar segurança às empresas no que tange à gestão da imagem dos negócios. Através dele, as Associações Comerciais de todo o país poderão oferecer o registro de marcas, softwares e patentes, o que abrange não apenas o logotipo da empresa, mas também dos produtos e serviços oferecidos por ela."}, "type": "paragraph"}, {"id": "NqY16ObS3V", "data": {"text": "A marca é um dos principais patrimônios de uma empresa e, quando bem cuidada, pode, inclusive, gerar lucros. O registro oficial da marca, além de evitar problemas jurídicos, também dá ao empresário segurança para investir no marketing da empresa. Nesse sentido, o AC Marcas oferece pesquisa, monitoramento, registro e renovação de marcas, softwares e patentes, tudo no mesmo pacote, por meio do suporte de especialistas qualificados, gestão online, com credibilidade e confiança."}, "type": "paragraph"}, {"id": "10eBH03-ni", "data": {"text": "Passo a passo para registrar sua marca:", "level": 3}, "type": "header"}, {"id": "0PwHoZubJG", "data": {"text": "<b>BUSCA DE MARCA:</b> Uma pesquisa é realizada no INPI para verificar se a sua marca poderá ser registrada."}, "type": "paragraph"}, {"id": "ThjBfP8-gO", "data": {"text": "<b>INÍCIO DO PROCESSO:</b> Se a busca apontar que é viável, é cobrada uma taxa única (inclusas a busca e a GRU, exigida pelo INPI), e o processo de solicitação de registro da sua marca junto ao INPI é iniciado."}, "type": "paragraph"}, {"id": "prROZ42Mzq", "data": {"text": "<b>AVALIAÇÃO:</b> A solicitação é avaliada pelo INPI e nós fazemos todo o acompanhamento."}, "type": "paragraph"}, {"id": "xvvRMNRx6T", "data": {"text": "<b>APROVAÇÃO:</b> Com a aprovação da solicitação, o cliente paga a taxa final diretamente ao INPI, sob orientação do ACMarcas, e o registro da sua marca é concedido."}, "type": "paragraph"}, {"id": "Y99WhKI-99", "data": {"text": "<b>VALIDADE:</b> O registro da sua marca tem validade de dez anos e você pode fazer a renovação com o ACMarcas."}, "type": "paragraph"}, {"id": "cvI6F0AxsY", "data": {"text": "Por que fazer o registro da sua marca com o ACMarcas?", "level": 3}, "type": "header"}, {"id": "L0a79-B07E", "data": {"meta": {}, "items": [{"meta": {}, "items": [], "content": "Melhores custos e parcelamento em até 10x vezes para Associados."}, {"meta": {}, "items": [], "content": "Não cobramos mensalidades e nem anuidades pelo registro."}, {"meta": {}, "items": [], "content": "Associados da AC ganham descontos especiais."}, {"meta": {}, "items": [], "content": "Confiabilidade de ser um serviço da Associação Comercial, garantindo mais segurança para o seu processo."}, {"meta": {}, "items": [], "content": "Todo o procedimento é realizado por especialistas qualificados."}, {"meta": {}, "items": [], "content": "Atuamos desde a pesquisa de viabilidade até o deferimento da marca."}, {"meta": {}, "items": [], "content": "Fazemos o controle de prazos por meio da tecnologia, facilitando o acompanhamento do processo."}, {"meta": {}, "items": [], "content": "Informações e orientações de atendimento online e presencial."}, {"meta": {}, "items": [], "content": "As ACEs interessadas em levar o AC Marcas ao seu município, devem entrar em contato com a Federação do seu estado para solicitar o agendamento de uma reunião. No caso das Federações, o contato deve ser feito diretamente com a CACB."}], "style": "unordered"}, "type": "list"}, {"id": "cXfzdBaDSx", "data": {"text": "Parceiro", "level": 3}, "type": "header"}, {"id": "hhPIu-68Qz", "data": {"text": "O serviço será oferecido em parceria com o Escritório de Marcas &amp; Patentes da Associação Comercial (AC Marcas), que intermedeia as comunicações durante o processo de registro de marcas de empresas de todos os portes e tipos jurídicos."}, "type": "paragraph"}, {"id": "O_S9JnYANQ", "data": {"text": "O serviço vai promover o acesso aos institutos de propriedade intelectual, incluindo o registro de marcas, softwares e patentes para empresas, em especial os Microempreendedores Individuais (MEIs) e pequenas empresas.", "title": "Marca conhecida é marca registrada", "imageUrl": "https://cacb.org.br/wp-content/uploads/2024/01/hero-servicos-registro-de-marca.jpg"}, "type": "imageTextHighlight"}, {"id": "8WLidd9sla", "data": {"text": "FAQs", "level": 3}, "type": "header"}, {"id": "IfVxyAcdZu", "data": {"text": "<b>Qual a diferença entre registro de marca, patente e software?</b>"}, "type": "paragraph"}, {"id": "rQ8tyb-2LV", "data": {"text": "O registro de marca serve para associar a marca aos seus produtos e serviços, garantindo que não seja copiada. Já o Registro de Patentes protege o próprio produto, tecnologia ou processo criado por você ou pela sua empresa, que apresente um diferencial de mercado ou uma inovação. E o Registro de Software é depositado em um banco de propriedade, que recebe um protocolo que comprova esse depósito."}, "type": "paragraph"}, {"id": "wpSUv_Vbfd", "data": {"text": "<b>Porque eu preciso registrar minha marca?</b>"}, "type": "paragraph"}, {"id": "tpGPgpZNad", "data": {"text": "Registrar sua marca, patente ou software torna o seu projeto (prestação de serviços, produto) exclusivo dentro do segmento que está inserido, não podendo, assim, possuir imitações ou aproximações ao Registro, que não precisa necessariamente ser ligado a uma empresa."}, "type": "paragraph"}, {"id": "oY4MJaIIaP", "data": {"text": "<b>Preciso pagar para registrar minha marca ou patente?</b>"}, "type": "paragraph"}, {"id": "eMChiAC6Ab", "data": {"text": "Sim, todo processo de registro tem pelo menos duas taxas: a final e a inicial. A inicial é a Guia de Recolhimento da União (GRU), que é emitida no momento da solicitação (que já está inclusa no serviço prestado pelo ACMarcas). Já a final é paga diretamente ao INPI, quando o processo é aprovado, com orientação do ACMarcas."}, "type": "paragraph"}, {"id": "uD4pPitBcW", "data": {"text": "<b>Sou MEI ou MPE, mesmo assim, preciso registrar minha marca?</b>"}, "type": "paragraph"}, {"id": "tMmJPHUbwa", "data": {"text": "Sim, inclusive microempreendedores individuais e microempresas podem registrar suas marcas."}, "type": "paragraph"}, {"id": "vG5jSvsoiK", "data": {"text": "<b>Quanto tempo leva para obter o meu registro?</b>"}, "type": "paragraph"}, {"id": "II16ol1ug9", "data": {"text": "O prazo varia muito em função das etapas do processo, podendo chegar a dois anos. No entanto, o ACMarcas faz o acompanhamento de todo o processo e informa o cliente a cada etapa."}, "type": "paragraph"}, {"id": "rIIkJkysc1", "data": {"text": "<b>Quantas etapas existem dentro do processo de concessão de marca?</b>"}, "type": "paragraph"}, {"id": "lcNS5z-alq", "data": {"text": "Não se trata de um processo ágil e imediato. Por essa razão, o apoio de uma consultoria especializada é imprescindível, inclusive para não perder o prazo exigido por algumas delas. As etapas, normalmente, são: pedido Inicial, exame formal, publicação para oposição, possibilidade de exigência formal, exame técnico, possibilidade de recurso, deferimento e pagamento, cumprimento do prazo ordinário e concessão válida por dez anos, com possibilidade de renovação."}, "type": "paragraph"}], "version": "2.31.6"}	📜	https://cacb.org.br/wp-content/uploads/2024/01/capas-servicos-registro-de-marca.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 21:47:44.178	2026-07-04 22:08:41.264	t
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, email, "passwordHash", role, active, "createdAt", "updatedAt") FROM stdin;
fe449d86-1afe-41a3-861d-2c5a1d2c572d	Administrador ACIC	admin@acic.local	$2b$10$n9NWI9iehqdhbqa9d1.rpOp7V38HT9wkuUPylv71YE4BOPLyAZWYW	ADMIN	t	2026-07-04 13:41:14.321	2026-07-04 13:41:14.321
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4044045e-6466-4fb8-bd21-980276ff17ed	fe20df575463e75531652f922a35925ec426f5e177b55ebe586108c239208c46	2026-07-04 13:40:36.052149+00	20260609152000_init	\N	\N	2026-07-04 13:40:35.865145+00	1
ba697132-5412-4f71-a04e-a4e2f27fa7e1	5d2a4b83c6b6f4656f84189281bad7ce8cb0d614117119b5ef2084c7ba40994d	2026-07-04 13:40:36.06676+00	20260611170426_add_destaque_flag	\N	\N	2026-07-04 13:40:36.05681+00	1
91800739-632e-4712-99bd-a3aa8b40770e	cdfb9d07c936469e1892ea772fa6170332fc7829e01d9dc380277465ee4a4e51	2026-07-04 13:40:36.091608+00	20260618002945_add_diretor	\N	\N	2026-07-04 13:40:36.071515+00	1
\.


--
-- Name: Associado Associado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Associado"
    ADD CONSTRAINT "Associado_pkey" PRIMARY KEY (id);


--
-- Name: CertificadoSolicitacao CertificadoSolicitacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CertificadoSolicitacao"
    ADD CONSTRAINT "CertificadoSolicitacao_pkey" PRIMARY KEY (id);


--
-- Name: Diretor Diretor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Diretor"
    ADD CONSTRAINT "Diretor_pkey" PRIMARY KEY (id);


--
-- Name: Evento Evento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Evento"
    ADD CONSTRAINT "Evento_pkey" PRIMARY KEY (id);


--
-- Name: HomeSlide HomeSlide_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HomeSlide"
    ADD CONSTRAINT "HomeSlide_pkey" PRIMARY KEY (id);


--
-- Name: InscricaoEvento InscricaoEvento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InscricaoEvento"
    ADD CONSTRAINT "InscricaoEvento_pkey" PRIMARY KEY (id);


--
-- Name: Noticia Noticia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Noticia"
    ADD CONSTRAINT "Noticia_pkey" PRIMARY KEY (id);


--
-- Name: Presidente Presidente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Presidente"
    ADD CONSTRAINT "Presidente_pkey" PRIMARY KEY (id);


--
-- Name: QuemSomosSection QuemSomosSection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuemSomosSection"
    ADD CONSTRAINT "QuemSomosSection_pkey" PRIMARY KEY (id);


--
-- Name: Servico Servico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Servico"
    ADD CONSTRAINT "Servico_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Associado_cnpj_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Associado_cnpj_key" ON public."Associado" USING btree (cnpj);


--
-- Name: Associado_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Associado_userId_key" ON public."Associado" USING btree ("userId");


--
-- Name: Evento_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Evento_slug_key" ON public."Evento" USING btree (slug);


--
-- Name: InscricaoEvento_eventoId_associadoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "InscricaoEvento_eventoId_associadoId_key" ON public."InscricaoEvento" USING btree ("eventoId", "associadoId");


--
-- Name: Noticia_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Noticia_slug_key" ON public."Noticia" USING btree (slug);


--
-- Name: QuemSomosSection_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "QuemSomosSection_key_key" ON public."QuemSomosSection" USING btree (key);


--
-- Name: Servico_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Servico_slug_key" ON public."Servico" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Associado Associado_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Associado"
    ADD CONSTRAINT "Associado_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CertificadoSolicitacao CertificadoSolicitacao_associadoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CertificadoSolicitacao"
    ADD CONSTRAINT "CertificadoSolicitacao_associadoId_fkey" FOREIGN KEY ("associadoId") REFERENCES public."Associado"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CertificadoSolicitacao CertificadoSolicitacao_eventoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CertificadoSolicitacao"
    ADD CONSTRAINT "CertificadoSolicitacao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES public."Evento"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Evento Evento_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Evento"
    ADD CONSTRAINT "Evento_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: HomeSlide HomeSlide_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HomeSlide"
    ADD CONSTRAINT "HomeSlide_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InscricaoEvento InscricaoEvento_associadoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InscricaoEvento"
    ADD CONSTRAINT "InscricaoEvento_associadoId_fkey" FOREIGN KEY ("associadoId") REFERENCES public."Associado"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InscricaoEvento InscricaoEvento_eventoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InscricaoEvento"
    ADD CONSTRAINT "InscricaoEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES public."Evento"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Noticia Noticia_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Noticia"
    ADD CONSTRAINT "Noticia_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Servico Servico_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Servico"
    ADD CONSTRAINT "Servico_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict tvVIJQLn1gtnyw3y6PLOyLczcOQvDMHMi9aA2fBjFdXI4B2DIMk8x1KWaiT7reX

