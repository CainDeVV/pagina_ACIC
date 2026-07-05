--
-- PostgreSQL database dump
--

\restrict 5ZVxe2sY00Hu14825gODxOyd55fCmNr7bb7EKaSvBIYVZVaxCPFIigiuRMZqT5c

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: CertificateStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CertificateStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'ISSUED'
);


ALTER TYPE public."CertificateStatus" OWNER TO postgres;

--
-- Name: EventStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EventStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CANCELLED',
    'FINISHED'
);


ALTER TYPE public."EventStatus" OWNER TO postgres;

--
-- Name: PublishStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PublishStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."PublishStatus" OWNER TO postgres;

--
-- Name: RegistrationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RegistrationStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
);


ALTER TYPE public."RegistrationStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'EDITOR',
    'ASSOCIADO'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Associado; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."Associado" OWNER TO postgres;

--
-- Name: CertificadoSolicitacao; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."CertificadoSolicitacao" OWNER TO postgres;

--
-- Name: Diretor; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."Diretor" OWNER TO postgres;

--
-- Name: Evento; Type: TABLE; Schema: public; Owner: postgres
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
    destaque boolean DEFAULT false NOT NULL,
    "coverImageCaption" text,
    "showCoverImage" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Evento" OWNER TO postgres;

--
-- Name: HomeSlide; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."HomeSlide" OWNER TO postgres;

--
-- Name: InscricaoEvento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InscricaoEvento" (
    id text NOT NULL,
    "eventoId" text NOT NULL,
    "associadoId" text NOT NULL,
    status public."RegistrationStatus" DEFAULT 'PENDING'::public."RegistrationStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InscricaoEvento" OWNER TO postgres;

--
-- Name: Noticia; Type: TABLE; Schema: public; Owner: postgres
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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "coverImageCaption" text,
    "showCoverImage" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Noticia" OWNER TO postgres;

--
-- Name: Patrocinador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patrocinador" (
    id text NOT NULL,
    name text NOT NULL,
    "logoUrl" text NOT NULL,
    "linkUrl" text,
    status public."PublishStatus" DEFAULT 'PUBLISHED'::public."PublishStatus" NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Patrocinador" OWNER TO postgres;

--
-- Name: Presidente; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."Presidente" OWNER TO postgres;

--
-- Name: QuemSomosSection; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."QuemSomosSection" OWNER TO postgres;

--
-- Name: Servico; Type: TABLE; Schema: public; Owner: postgres
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
    destaque boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Servico" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Associado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Associado" (id, "userId", "companyName", "tradeName", cnpj, phone, address, active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CertificadoSolicitacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CertificadoSolicitacao" (id, "associadoId", "eventoId", reason, status, "fileUrl", "reviewedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Diretor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Diretor" (id, name, role, category, "photoUrl", bio, "sortOrder", "createdAt", "updatedAt") FROM stdin;
0576984d-9e16-4604-9b97-a72e4eaa8d17	FRANCISCO ROBERTO LIMA E SILVA	GRÁFICA CRATEÚS	I VICE-PRESIDENTE	http://localhost:3000/uploads/diretoria/e9ab8795-0c59-4a77-b712-23cfb5679689.jpg	\N	2	2026-07-04 21:35:41.309	2026-07-05 14:01:52.821
49afb6ee-7f5d-4030-8bb3-d326c3cc92a6	ANTÔNIO WAGNER CLAUDINO SALES	RANCHEIRA W&S	II SECRETÁRIO	http://localhost:3000/uploads/diretoria/4ef5a8fd-6795-419f-bf52-4a9ecf9fe420.jpg	\N	3	2026-07-04 21:38:43.887	2026-07-05 14:01:57.767
43526c1a-3e15-4fcf-93c1-0723cbc87f4a	ANTONIO OSVALDO PONTES DE MELO	TINA CONDIMENTOS	I SECRETÁRIO	http://localhost:3000/uploads/diretoria/b05d6daf-94e4-47e3-bf7b-d370f40626df.jpg	\N	4	2026-07-04 21:38:15.398	2026-07-05 14:02:03.724
5453c786-3ce5-4ca8-900a-34042742d2b9	MARIA DO CARMO XIMENES DE PINHO	ACIC	PRESIDENTE	https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW4lMjBmYWNlfGVufDB8fDB8fHww	Empresária com vasta experiência no varejo e gestão corporativa, focada na inovação do comércio de Crateús.	1	2026-07-04 21:35:14.882	2026-07-05 13:57:05.832
\.


--
-- Data for Name: Evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Evento" (id, title, slug, description, location, "startsAt", "endsAt", capacity, "coverImage", status, "authorId", "createdAt", "updatedAt", destaque, "coverImageCaption", "showCoverImage") FROM stdin;
a909cb7e-7d7b-4dd7-a779-9bfefeecd485	150 Anos da ACIC Crateús	150-anos-da-acic-crateus	{"time": 1783255098747, "blocks": [{"id": "eucTRiUgLY", "data": {"text": "Em 2026, a Associação Comercial e Industrial de Crateús (ACIC) celebra 150 anos de história, consolidando-se como uma das mais importantes entidades de representação empresarial do interior do Ceará.<br>Fundada com o objetivo de fortalecer o comércio local e impulsionar o desenvolvimento econômico da região, a ACIC percorreu um longo caminho de conquistas, desafios e transformações, sempre ao lado dos empresários e empreendedores crateusenses."}, "type": "paragraph"}, {"id": "QvBSfd4ckt", "data": {"text": "Uma trajetória de conquistas", "level": 3}, "type": "header"}, {"id": "6epxpJtEwv", "data": {"text": "Ao longo de 150 anos, a ACIC atuou ativamente na defesa dos interesses do setor produtivo local, promovendo eventos, capacitações, feiras de negócios e ações de desenvolvimento empresarial que beneficiaram milhares de comerciantes e empresários da região."}, "type": "paragraph"}, {"id": "gbQQUe9dDE", "data": {"text": "Programação das Comemorações", "level": 3}, "type": "header"}, {"id": "llDzP_benz", "data": {"text": "<b>Exposição Histórica:</b> Galeria fotográfica e documental com registros dos 150 anos de atuação da ACIC Crateús.<br><b>Jantar Comemorativo:</b>&nbsp;Celebração especial com autoridades, empresários e parceiros da entidade.<br><b>Fórum Empresarial:</b>&nbsp;Debates e palestras sobre o futuro do empreendedorismo na região.<br><b>Premiação:</b>&nbsp;Reconhecimento de empresas e personalidades que contribuíram para o desenvolvimento comercial de Crateús.&nbsp;&nbsp;"}, "type": "paragraph"}, {"id": "FdL45n2U38", "data": {"text": "Participe desta história", "level": 3}, "type": "header"}, {"id": "g9LyWunKYF", "data": {"text": "As comemorações dos 150 anos são uma oportunidade única de celebrar a história da nossa cidade e reafirmar o compromisso da ACIC com o desenvolvimento econômico e social de Crateús e região. Fique atento às redes sociais para mais informações sobre a programação completa."}, "type": "paragraph"}], "version": "2.31.6"}	Sede da ACIC - Crateús, CE	2026-12-12 17:15:00	2026-12-13 18:16:00	200	https://www.10wallpaper.com/wallpaper/1920x1080/1612/Moonlit_night_bridge_lakes-Nature_Scenery_Wallpaper_1920x1080.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 23:12:04.734	2026-07-05 12:38:18.799	t	\N	t
d4f0e333-c407-4b8d-9dd1-f5d04ab62adc	Encontro de Associados ACIC – Fortalecendo o Associativismo	encontro-de-associados-acic-fortalecendo-o-associativismo	{"time": 1783262692023, "blocks": [{"id": "ek5PMrwgQf", "data": {"text": "A ACIC promoverá um encontro exclusivo para seus associados com o objetivo de apresentar resultados, discutir projetos em andamento e ouvir sugestões para o fortalecimento da entidade."}, "type": "paragraph"}, {"id": "TnmrGIh57Y", "data": {"text": "Durante o encontro serão apresentados os serviços oferecidos pela associação, novas parcerias institucionais, ações de capacitação, benefícios exclusivos aos associados e projetos voltados ao desenvolvimento econômico de Crateús."}, "type": "paragraph"}, {"id": "Nec0vAro2y", "data": {"text": "O evento representa uma oportunidade para fortalecer o diálogo entre diretoria e associados, incentivando a participação ativa na construção de uma entidade cada vez mais forte e representativa."}, "type": "paragraph"}], "version": "2.31.6"}	Sede da ACIC	2026-12-15 18:15:00	2026-12-16 15:12:00	47	https://www.10wallpaper.com/wallpaper/1366x768/1504/new_zealand_island_lake_wanaka-Nature_HD_Wallpaper_1366x768.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:26:56.911	2026-07-05 14:44:52.072	t	\N	t
5e2b7614-1b8c-47c0-8f27-a4bebc26a2af	Fórum ACIC de Desenvolvimento Econômico Regional	forum-acic-de-desenvolvimento-economico-regional	{"time": 1783262712587, "blocks": [{"id": "PfH_G7HDiI", "data": {"text": "O Fórum de Desenvolvimento Econômico Regional reunirá empresários, representantes do poder público, instituições financeiras, entidades parceiras e lideranças locais para debater estratégias voltadas ao crescimento econômico de Crateús e região."}, "type": "paragraph"}, {"id": "IR-Sd1iso7", "data": {"text": "A programação contará com palestras, painéis de discussão e apresentação de iniciativas que promovem o empreendedorismo, a geração de emprego, a inovação e o fortalecimento do comércio, da indústria e do setor de serviços."}, "type": "paragraph"}, {"id": "gNggbhY_3T", "data": {"text": "O evento reafirma o compromisso da ACIC em atuar como agente de desenvolvimento, incentivando o diálogo entre os diversos segmentos da sociedade e contribuindo para a construção de um ambiente cada vez mais favorável aos negócios."}, "type": "paragraph"}], "version": "2.31.6"}	Auditório da ACIC	2026-12-12 18:51:00	2026-12-13 15:41:00	23	https://external-preview.redd.it/nature-wallpaper-full-hd-1920x1080-v0-R_kYjxwmX0309efZm1a5ITPoWLzJ_IDuPDKSdKL1UkM.jpg?auto=webp&s=526cf61a963b7a09ca767629e4dea06540ba4080	CANCELLED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:27:34.962	2026-07-05 14:45:12.636	f	\N	t
c0551376-5f4f-401c-b6c5-5a43e2006238	Seminário ACIC – Gestão, Inovação e Desenvolvimento Empresarial	seminario-acic-gestao-inovacao-e-desenvolvimento-empresarial	{"time": 1783262673093, "blocks": [{"id": "_jBfBUr0PY", "data": {"text": "Com o objetivo de incentivar a competitividade das empresas locais, a ACIC realizará o Seminário de Gestão e Inovação Empresarial, reunindo especialistas para abordar temas relacionados à administração, marketing, liderança, tecnologia e planejamento estratégico."}, "type": "paragraph"}, {"id": "PGd8Gemjrg", "data": {"text": "O evento foi planejado para oferecer conhecimento prático e atualizado, contribuindo para o crescimento sustentável dos negócios e preparando empresas para os desafios do mercado."}, "type": "paragraph"}, {"id": "kMjwejgaQy", "data": {"text": "Além das palestras, haverá espaço para perguntas, interação com os palestrantes e troca de experiências entre os participantes."}, "type": "paragraph"}], "version": "2.31.6"}	Auditório da ACIC	2024-12-13 17:14:00	2025-12-14 17:14:00	40	https://wallpapers.com/images/hd/1920-x-1080-nature-desktop-3an6vr1phtti9egx.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:26:24.809	2026-07-05 14:44:33.14	f	Natureza	t
7514ab53-ff62-42ae-97ac-e8e9b71121f7	Café Empresarial ACIC – Conectando Negócios e Oportunidades	cafe-empresarial-acic-conectando-negocios-e-oportunidades	{"time": 1783267492536, "blocks": [{"id": "j9CM_0xBu7", "data": {"text": "A Associação Comercial e Industrial de Crateús (ACIC) convida empresários, empreendedores, profissionais liberais e associados para mais uma edição do Café Empresarial, um encontro voltado ao fortalecimento do relacionamento entre o setor produtivo da região."}, "type": "paragraph"}, {"id": "QLKIEOS5un", "data": {"text": "Durante o evento, os participantes terão a oportunidade de ampliar sua rede de contatos, conhecer novas oportunidades de negócios, trocar experiências e discutir os principais desafios enfrentados pelo comércio, indústria e setor de serviços."}, "type": "paragraph"}, {"id": "oR-N0xyhpU", "data": {"text": "A programação contará com uma palestra sobre inovação, ambiente para networking e apresentação das ações desenvolvidas pela ACIC em benefício dos associados."}, "type": "paragraph"}, {"id": "H1jM-3SnQu", "data": {"text": "Data: Em breve<br>Local: Auditório da ACIC<br>Público-alvo: Empresários, empreendedores e associados.<br>"}, "type": "paragraph"}, {"id": "0Lt4mX4O3s", "data": {"file": {"url": "https://wallpapercave.com/wp/wp10084718.png"}, "caption": "Legenda", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}], "version": "2.31.6"}	Auditório da ACIC	2026-12-12 16:13:00	2026-12-12 17:14:00	50	https://i.redd.it/7c77m6bw4k1d1.jpeg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:26:00.245	2026-07-05 20:36:48.9	f	\N	t
\.


--
-- Data for Name: HomeSlide; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."HomeSlide" (id, title, subtitle, "imageUrl", "linkUrl", status, "sortOrder", "authorId", "createdAt", "updatedAt") FROM stdin;
b52b25a5-040c-4214-b632-81e0f9216480	Fortalecendo o comércio de Crateús	Há décadas unindo empresários e impulsionando a economia regional	http://localhost:3000/uploads/slides/7555ea21-a88f-410b-be1a-e280c588f5bc.jpg	\N	PUBLISHED	1	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 22:17:19.043	2026-07-05 20:19:23.649
578dabd7-1345-4ead-a1dd-be8aa16633a6	Conectando empresários de todos os setores	Comércio, indústria, agropecuária e serviços em um só lugar	http://localhost:3000/uploads/slides/3e665307-c29f-4bdc-962a-9aa90c2c2f2f.jpg	\N	PUBLISHED	2	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 22:17:46.545	2026-07-05 20:19:23.65
332e6437-3947-444e-94d0-7a9885ea4d66	Titulo	Subtitulo	https://preview.redd.it/purple-sunrise-1920x1080-v0-vo9vm1fcqrp71.jpg?auto=webp&s=929f29167c61cdc698e4691bd0de2bbff2e16288	https://preview.redd.it/purple-sunrise-1920x1080-v0-vo9vm1fcqrp71.jpg?auto=webp&s=929f29167c61cdc698e4691bd0de2bbff2e16288	PUBLISHED	0	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 21:03:52.312	2026-07-05 21:03:52.312
c25a524d-877a-4d36-aa39-732bb1a11b58	Sua voz no desenvolvimento regional	Representação política e institucional para o empresário cearense	http://localhost:3000/uploads/slides/d781afdb-6271-46f8-8cef-7f5632d2d93b.jpg	\N	PUBLISHED	3	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 22:18:02.059	2026-07-05 20:18:56.025
\.


--
-- Data for Name: InscricaoEvento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InscricaoEvento" (id, "eventoId", "associadoId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Noticia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Noticia" (id, title, slug, summary, content, "coverImage", status, "publishedAt", "authorId", "createdAt", "updatedAt", "coverImageCaption", "showCoverImage") FROM stdin;
c1b44966-599c-493f-b816-fb9b878a95ea	Limite do Simples Nacional é tema de debate em Belo Horizonte	limite-do-simples-nacional-e-tema-de-debate-em-belo-horizonte	Evento da Câmara dos Deputados, com participação da CACB, discute atualização do teto do MEI e reforça mobilização nacional pela correção dos limites de faturamento	{"time": 1783269037580, "blocks": [{"id": "zy1lGeNuFH", "data": {"text": "A discussão sobre a atualização dos limites de faturamento do Microempreendedor Individual (MEI) e das empresas enquadradas no Simples Nacional chega a Belo Horizonte (MG) no próximo dia 23 de junho, e terá o presidente da Federação das Associações Comerciais e Empresariais do Estado de Minas Gerais (Federaminas) e diretor financeiro da CACB, Valmir Rodrigues, na mesa de debate. A audiência pública faz parte do programa Câmara pelo Brasil e integra a série de encontros promovidos pela Comissão Especial da Câmara dos Deputados que analisa o Projeto de Lei Complementar (PLP) 108/2021."}, "type": "paragraph"}, {"id": "6-U91E8Uke", "data": {"text": "A proposta prevê o aumento do limite de faturamento anual do MEI de R$ 81 mil para R$ 130 mil, além da possibilidade de contratação de até dois funcionários, o dobro do permitido atualmente. O objetivo é adequar as regras à realidade econômica do país e ampliar as condições para o crescimento dos pequenos negócios."}, "type": "paragraph"}, {"id": "w81DNkP-bC", "data": {"text": "O debate em Minas Gerais dá continuidade à mobilização nacional iniciada neste mês em Porto Alegre (RS), onde representantes do setor produtivo, parlamentares e entidades empresariais defenderam a necessidade de corrigir a defasagem dos limites do Simples Nacional, que não acompanham a inflação acumulada dos últimos anos."}, "type": "paragraph"}, {"id": "NpJxvFwYpa", "data": {"text": "Durante a primeira audiência regional, a presidente da Comissão Especial, a deputada federal Any Ortiz, destacou que muitos empreendedores acabam sendo desenquadrados do regime simplificado não por crescimento real dos negócios, mas pelo impacto da inflação sobre o faturamento. Já o relator da proposta, o deputado federal Jorge Goetten, afirmou que a atualização das regras pode estimular a formalização e a geração de empregos."}, "type": "paragraph"}, {"id": "lAqbuC3JXI", "data": {"text": "Além das mudanças previstas no PLP 108/2021, o Sistema de Associativismo liderado pela Confederação das Associações Comerciais e Empresariais do Brasil defende uma atualização mais ampla das faixas do Simples Nacional. A proposta da entidade considera uma correção de aproximadamente 83%, com base na inflação acumulada nos últimos sete anos. Pelos cálculos apresentados, o teto do MEI passaria para R$ 144,9 mil anuais, enquanto os limites para micro e pequenas empresas também seriam reajustados."}, "type": "paragraph"}, {"id": "nEnJyHKMqW", "data": {"text": "A expectativa é que os encontros regionais fortaleçam o apoio à proposta e contribuam para acelerar sua tramitação no Congresso Nacional. Após passar por cidades como Porto Alegre, São Paulo e Florianópolis, o debate chega a Belo Horizonte como parte de uma agenda nacional voltada à modernização do ambiente de negócios para os pequenos empreendedores brasileiros."}, "type": "paragraph"}, {"id": "sRz0AhYyTU", "data": {"text": "Presenças confirmadas", "level": 3}, "type": "header"}, {"id": "i5PbCQ2KXI", "data": {"text": "Estão confirmadas as presenças do relator da comissão especial, deputado Jorge Goetten (Republicanos-SC), e do coordenador do seminário, deputado Domingos Sávio (PL-MG)."}, "type": "paragraph"}, {"id": "qKpwYD8cdC", "data": {"text": "Participam da mesa de debates:", "level": 3}, "type": "header"}, {"id": "4bhHPvnWEn", "data": {"meta": {}, "items": [{"meta": {}, "items": [], "content": "presidente da Federação das Associações Comerciais e Empresariais do Estado de Minas Gerais (Federaminas), Valmir Rodrigues;"}, {"meta": {}, "items": [], "content": "presidente do Sistema S de MG/Fecomércio, Nadim Elias Donato Filho;"}, {"meta": {}, "items": [], "content": "presidente da Confederação Nacional de Dirigentes Lojistas (CNDL)/MG, José Cesar da Costa;"}, {"meta": {}, "items": [], "content": "presidente da Federação das Câmaras de Dirigentes Lojistas (FCDL)/MG, Frank Sinatra Santos Chaves;"}, {"meta": {}, "items": [], "content": "presidente da Associação Brasileira de Supermercados (ABRAS), João Galassi;"}, {"meta": {}, "items": [], "content": "presidente da Associação Nacional dos Comerciantes de Material de Construção (Anamaco)/MG, Cynthia Ciordaro de Carvalho;"}, {"meta": {}, "items": [], "content": "presidente da Câmara de Dirigentes Lojistas (CDL)/BH e do Sebrae/MG, Marcelo de Souza e Silva; e"}, {"meta": {}, "items": [], "content": "presidente da Associação Brasileira de Atacadistas e Distribuidores (ABAD), Leonardo Miguel Severini."}], "style": "unordered"}, "type": "list"}, {"id": "JNHgk__CFZ", "data": {"text": "Serviço:", "level": 3}, "type": "header"}, {"id": "3_s0Mzv4On", "data": {"text": "<b>Câmara pelo Brasil – Seminário “Novo enquadramento do Microempreendedor Individual (MEI) e atualização do Simples Nacional”</b>"}, "type": "paragraph"}, {"id": "qY6LDc_MTO", "data": {"text": "<b>Local:</b>&nbsp;Auditório da Sede da Fecomércio/MG – Rua Curitiba, 561 – Centro – Belo Horizonte – MG"}, "type": "paragraph"}, {"id": "hhKMRqquHC", "data": {"text": "<b>Data e horário:</b>&nbsp;23 de junho, às 9h<br><b>Inscrições:</b>&nbsp;https://forms.gle/V6kcxLp4XdGAYydD6"}, "type": "paragraph"}], "version": "2.31.6"}	https://cacb.org.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-19-at-14.50.24-800x493.jpeg	PUBLISHED	2026-12-15 14:15:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:15:05.555	2026-07-05 16:30:37.631	[Ultima reunião realizada da sede da FACISC. Allan Torres / Câmara dos Deputados]	t
c4dfcf69-f879-4104-ab13-373244a95169	STF suspende aplicação de multas pela NR-1	stf-suspende-aplicacao-de-multas-pela-nr-1	Pela decisão do ministro André Mendonça, está proibido aplicar punições pela falta de mapeamento dos riscos psicossociais no trabalho por 90 dias	{"time": 1783260806325, "blocks": [{"id": "_54x2t38BZ", "data": {"text": "O Sistema Nacional do Associativismo obteve mais uma vitória para o setor produtivo nesta quinta-feira (26). O ministro André Mendonça, do Supremo Tribunal Federal (STF), suspendeu, por um prazo de 90 dias, a aplicação de multas por descumprimento às regras de saúde mental previstas na Norma Regulamentadora NR-1, do Ministério do Trabalho e Emprego."}, "type": "paragraph"}, {"id": "wzzDlo3XvH", "data": {"text": "Segundo a decisão provisória, concedida por meio de liminar, está proibido autuar e aplicar punições pela falta de mapeamento dos riscos psicossociais no trabalho. “Saudamos a decisão proferida pelo ministro André Mendonça, suspendendo aplicação de penalidades previstas na NR1, diante da ausência de critérios objetivos e do consequente potencial de gerar insegurança jurídica”, destacou o vice-presidente Jurídico da Confederação das Associações Comerciais e Empresariais do Brasil (CACB), Anderson Trautman Cardoso."}, "type": "paragraph"}, {"id": "K9FlxXKdIw", "data": {"text": "Em artigo publicado no jornal O Estado de S. Paulo, na última terça-feira (23), o presidente da CACB, Alfredo Cotait Neto, reconheceu a importância de discutir a saúde mental no ambiente de trabalho, mas fez crítica a NR-1, que cria regras consideradas subjetivas, que podem resultar em insegurança jurídica, aumento de custos e dificuldades para a geração de empregos."}, "type": "paragraph"}, {"id": "UfcEWfXvRi", "data": {"text": "Cotait chama atenção justamente para a questão da fiscalização. “Quais serão os critérios para mensurar essa lista de riscos?”, questiona ele no texto. Para o presidente, o que o setor produtivo vê e repudia é que se está diante de novas regras subjetivas, que podem levar a punições injustas e onerosas."}, "type": "paragraph"}, {"id": "dle7DdfI47", "data": {"text": "Aprovadas em 2024, as alterações na NR-1 passaram a valer em 26 de maio deste ano. Pela nova regra, empregadores precisam acompanhar a avaliação dos riscos psicossociais nos processos de gestão de segurança e saúde no trabalho. Com a ordem do STF, o prazo para empresas se adaptarem sem serem multadas passa para final de setembro."}, "type": "paragraph"}, {"id": "arR3_PhX7l", "data": {"text": "A liminar não revoga a NR-1. As diretrizes de prevenção e as demais normas de saúde e segurança do trabalho continuam em vigor. O que fica suspenso, por 90 dias, é apenas a aplicação de multas e outras penalidades com base nos critérios questionados junto ao STF, que é o mapeamento realizado pelas empresas."}, "type": "paragraph"}], "version": "2.31.6"}	https://cacb.org.br/wp-content/uploads/2026/06/Capa-Carrossel-2-1.png	PUBLISHED	2026-12-13 15:12:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:13:48.05	2026-07-05 14:13:26.378	\N	t
f04857c4-a65f-41e2-a595-766bb53c945d	CACB participa de sessão solene e audiência pública na Câmara sobre micro e pequenas empresas	cacb-participa-de-sessao-solene-e-audiencia-publica-na-camara-sobre-micro-e-pequenas-empresas	O presidente da Confederação, Alfredo Cotait Neto, falará dos dois eventos que destacam a importância da atualização do Simples Nacional	{"time": 1783262198268, "blocks": [{"id": "a7G752j_hb", "data": {"text": "O presidente da Confederação das Associações Comerciais e Empresariais do Brasil (CACB), Alfredo Cotait Neto, participa, na próxima quarta-feira (1º de julho), de dois eventos na Câmara dos Deputados voltados ao fortalecimento das micro, pequenas e médias empresas. Às 9h, estará na Sessão Solene em Homenagem ao Dia das Micro, Pequenas e Médias Empresas, no Plenário Ulysses Guimarães."}, "type": "paragraph"}, {"id": "C0kSuMxubL", "data": {"text": "Às 14h, Cotait será expositor na Audiência Pública da Comissão Especial do PLP 108/2021, no Plenário 6 do Anexo II, que discutirá a atualização dos limites de enquadramento no Simples Nacional e do Microempreendedor Individual (MEI). O presidente da CACB defenderá as propostas da Confederação para modernizar o regime e fortalecer a competitividade dos pequenos negócios."}, "type": "paragraph"}, {"id": "HHIBHwquC3", "data": {"text": "SERVIÇO:", "level": 2}, "type": "header"}, {"id": "wkZrHJ97Kf", "data": {"text": "Sessão Solene em Homenagem ao Dia das Micro, Pequenas e Médias Empresas", "level": 4}, "type": "header"}, {"id": "qpB4H1KXTA", "data": {"text": "Data: 1º de julho de 2026 (quarta-feira)"}, "type": "paragraph"}, {"id": "H139I-b8GV", "data": {"text": "Horário: 9h"}, "type": "paragraph"}, {"id": "zhhJKEERCE", "data": {"text": "Local: Plenário Ulysses Guimarães, Câmara dos Deputados, Brasília (DF)"}, "type": "paragraph"}, {"id": "89PyZZokow", "data": {"text": "Participantes:"}, "type": "paragraph"}, {"id": "gqyoCcICr7", "data": {"meta": {}, "items": [{"meta": {}, "items": [], "content": "Alfredo Cotait Neto, Presidente da Confederação das Associações Comerciais e Empresariais do Brasil;"}, {"meta": {}, "items": [], "content": "Ana Cláudia Badra Cotait, Presidente do Conselho da Mulher Empreendedora e da Cultura;"}, {"meta": {}, "items": [], "content": "Deputada Adriana Ventura, Requerente;"}, {"meta": {}, "items": [], "content": "Deputado Jorge Goetten, Presidente Frente das Micro e Pequenas Empresas;"}, {"meta": {}, "items": [], "content": "Deputada Any Ortiz, Presidente da Frente Parlamentar Mista pela Mulher Empreendedora;"}, {"meta": {}, "items": [], "content": "Deputado Joaquim Passarinho, Presidente da Frente do Empreendedorismo;"}, {"meta": {}, "items": [], "content": "Deputado Júlio Lopes, Presidente da Frente Parlamentar pelo Brasil Competitivo;"}, {"meta": {}, "items": [], "content": "Deputada Bia Kicis, Presidente da Frente pelo Livre Mercado;"}, {"meta": {}, "items": [], "content": "Paulo Henrique Rodrigues Pereira, Ministro de Estado do Empreendedorismo, da Microempresa e da Empresa de Pequeno Porte;"}, {"meta": {}, "items": [], "content": "Ivo Dall’Acqua – Presidente da FECOMÉRCIO/SP;"}, {"meta": {}, "items": [], "content": "Representantes do SEBRAE; e"}, {"meta": {}, "items": [], "content": "Senador Jayme Campos – União/MT."}], "style": "unordered"}, "type": "list"}, {"id": "4U_edsMHTp", "data": {"text": "Audiência Pública da Comissão Especial do PLP 108/2021", "level": 4}, "type": "header"}, {"id": "D16mmXyxyC", "data": {"text": "Tema: Novo enquadramento do Microempreendedor Individual (MEI) e atualização do Simples Nacional."}, "type": "paragraph"}, {"id": "4r7LpaaKNg", "data": {"text": "Data: 1º de julho de 2026 (quarta-feira)"}, "type": "paragraph"}, {"id": "GI0iT7yUAf", "data": {"text": "Horário: 14h"}, "type": "paragraph"}, {"id": "Vq5srIVtiS", "data": {"text": "Local: Plenário 6 do Anexo II, Câmara dos Deputados, Brasília (DF)"}, "type": "paragraph"}, {"id": "Hy-fcLrRUR", "data": {"text": "Participantes:"}, "type": "paragraph"}, {"id": "GBS0vzlnAu", "data": {"meta": {}, "items": [{"meta": {}, "items": [], "content": "Alfredo Cotait Neto, Presidente da Confederação das Associações Comerciais e Empresariais do Brasil – CACB;"}, {"meta": {}, "items": [], "content": "Paulo Henrique Pereira, Ministro de Estado do Empreendedorismo, da Microempresa e da Empresa de Pequeno Porte;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}, {"meta": {}, "items": [], "content": "Leonardo Ferreira de Oliveira, Secretário Adjunto da Secretaria de Competitividade e Regulação do Ministério do Desenvolvimento, Indústria, Comércio e Serviços;"}, {"meta": {}, "items": [], "content": "Edgard Fernandes, Analista Técnico de Competitividade do Sebrae Nacional e Advogado Tributarista;"}, {"meta": {}, "items": [], "content": "José Roberto Tadros, Presidente da Confederação Nacional do Comércio de Bens, Serviços e Turismo – CNC;"}, {"meta": {}, "items": [], "content": "José César da Costa, Presidente da Confederação Nacional de Dirigentes Lojistas;"}, {"meta": {}, "items": [], "content": "Ricardo Alban, Presidente da Confederação Nacional das Indústrias – CNI;"}, {"meta": {}, "items": [], "content": "Reynaldo Pereira Lima Júnior, Presidente da Federação Nacional das Empresas de Serviços e das Empresas de Assessoramento, Perícias, Informações e Pesquisa – Fenacon;"}, {"meta": {}, "items": [], "content": "Rodrigo Marinho, Diretor Executivo do Instituto Livre Mercado"}], "style": "unordered"}, "type": "list"}], "version": "2.31.6"}	https://cacb.org.br/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-30-at-11.13.28-596x800.jpeg	PUBLISHED	2026-12-12 15:12:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 23:26:48.882	2026-07-05 14:36:38.32	O presidente da Confederação, Alfredo Cotait Neto, falará dos dois eventos que destacam a importância da atualização do Simples Nacional	t
e67b00ed-2693-46ab-b460-e33c45ef3867	Reforma tributária preocupa representantes do sistema do associativismo	reforma-tributaria-preocupa-representantes-do-sistema-do-associativismo	Durante reunião na sede da CACB, dirigentes afirmam que há complexidades nas exigências previstas, especialmente para micro e pequenos negócios	{"time": 1783267035183, "blocks": [{"id": "aRD_q9T4Z-", "data": {"text": "O impacto da reforma tributária para os pequenos negócios foi um dos principais temas tratados durante a 2ª Reunião do Conselho Deliberativo da Confederação das Associações Comerciais e Empresariais do Brasil (CACB), nesta quinta-feira (25), em Brasília (DF). Para o líder nacional do sistema do associativismo e presidente da CACB, Alfredo Cotait Neto, “todo o setor deve acompanhar atentamente cada etapa do processo de transição e se preparar para os efeitos da mudança”."}, "type": "paragraph"}, {"id": "A3TmKod73b", "data": {"text": "Vice-presidente jurídico da organização, Anderson Trautman Cardoso alertou para os desafios concretos que as empresas e entidades enfrentarão a partir do próximo ano. “A partir de 2027 nós teremos a transição com a extinção do PIS e da Cofins e a instituição da CBS. Com isso, haverá uma série de implicações não só para as nossas empresas, mas também para as nossas entidades”, afirmou o vice-presidente."}, "type": "paragraph"}, {"id": "kciD8AoBZG", "data": {"text": "“Temos uma série de lacunas para todos os setores, mas para as empresas do Simples Nacional isso se torna ainda mais grave porque a sustentação jurídica e contábil dessas empresas é muito menor”, disse Cardoso. Recentemente, a CACB encaminhou sugestões ao governo federal para adiar a exigência de determinadas obrigações acessórias e simplificar procedimentos relacionados à emissão de notas fiscais, entre outras."}, "type": "paragraph"}, {"id": "iuRfznSlzs", "data": {"text": "Outro tema abordado durante a reunião foi o Projeto de Lei Complementar 108/2021, que propõe a atualização dos limites de enquadramento do Simples Nacional, que enfrenta dificuldades para avançar na ampliação do teto de faturamento. A mudança na escala 6×1 também foi discutida. Segundo o presidente da CACB, apesar da redução do apoio à medida no Congresso Nacional, ainda existe preocupação com sua eventual aprovação."}, "type": "paragraph"}, {"id": "_KQRA5ymqE", "data": {"text": "A reunião, que contou com a participação do superintendente da CACB, Carlos Alberto Rezende, também tratou das medidas adotadas em relação à NR-1, que prevê a inclusão de riscos psicossociais no gerenciamento de saúde e segurança do trabalho. Sobre o tema, a CACB pretende ingressar com uma ação própria para ampliar os efeitos de decisões judiciais obtidas por outras entidades."}, "type": "paragraph"}, {"id": "XSwXSIPToC", "data": {"text": "Um outro tópico foi apresentado pelo vice-presidente da Federação das Associações Comerciais de Minas Gerais (Federaminas) e diretor financeiro da CACB, Valmir Rodrigues, que tratou da campanha de valorização do associativismo. A iniciativa busca ampliar a visibilidade do papel das associações comerciais e dar voz aos desafios enfrentados pelos empreendedores, especialmente os pequenos empresários."}, "type": "paragraph"}, {"id": "Fa9UAZQ6hb", "data": {"text": "Segundo Valmir, a proposta para o segundo semestre inclui a produção de conteúdos audiovisuais que retratem a realidade das empresas brasileiras, abordando temas como custos trabalhistas, geração de empregos e ambiente de negócios. A campanha pretende fortalecer o debate público sobre a importância do associativismo para o desenvolvimento econômico e social."}, "type": "paragraph"}, {"id": "WveZPMiU47", "data": {"text": "Além disso, o coordenador do Comitê Empresarial da Amazônia Legal da CACB, Marco Kobayashi, apresentou um balanço das atividades desenvolvidas e as perspectivas para os próximos anos. O grupo destacou o objetivo de transformar projetos ligados à sustentabilidade, bioeconomia, inovação e transição energética em oportunidades concretas de geração de renda para empresários e associações comerciais.&nbsp;Entre as propostas está a criação do Hub Empreendedor Sustentável Itinerante, iniciativa que pretende percorrer o país apoiando o desenvolvimento de projetos."}, "type": "paragraph"}, {"id": "7IOvvjUDc9", "data": {"text": "Entre outros assuntos, a reunião também tratou da mobilização pelo reconhecimento do Dia do Associativismo, celebrado em 15 de julho, e a retomada da tramitação do projeto que institui oficialmente a data em âmbito nacional. A criação de uma Semana do Associativismo também foi debatida como forma de ampliar a divulgação do setor e fortalecer sua presença junto à sociedade."}, "type": "paragraph"}, {"id": "TkBUFFA8xo", "data": {"text": "No contexto desse assunto, a Federação da Associações Comerciais e Empresariais do Estado do Paraná (Faciap) informou que apresentou uma minuta de projeto de lei para que câmaras municipais e assembleias legislativas instituam o Dia do Associativismo em seus calendários oficiais."}, "type": "paragraph"}, {"id": "kweYtzwPHu", "data": {"text": "Mobilização de comunicação e Gasto Brasil", "level": 4}, "type": "header"}, {"id": "3SbJtWZcZV", "data": {"text": "Durante a reunião, a diretora de Comunicação, Mônica Monteiro, falou sobre a realização de uma grande mobilização nacional em torno do Painel Gasto Brasil, plataforma criada pela CACB para monitorar a evolução dos gastos públicos.&nbsp;Monteiro também apresentou um relatório de comunicação que destacou o engajamento obtido nas comemorações dos 114 anos da CACB. A campanha mobilizou federações, associações comerciais, parlamentares e lideranças empresariais de todo o país, ampliando significativamente a presença institucional da Confederação nas redes sociais e nos meios de comunicação."}, "type": "paragraph"}, {"id": "J7R4gqNoXO", "data": {"text": "Também foram destacados os encontros promovidos em diversos estados para debater o futuro do Simples Nacional, entre eles Santa Catarina, Minas Gerais, São Paulo e Rio Grande do Sul, além de nova agenda prevista no Ceará. As iniciativas integram o esforço nacional da entidade para defender a competitividade das micro e pequenas empresas e ampliar o diálogo com o Congresso Nacional."}, "type": "paragraph"}, {"id": "VB3bfAeHtU", "data": {"text": "Outro ponto abordado foi o fortalecimento da Rede Parlamentar de Apoio à Micro e Pequena Empresa, que já conta com a participação de 71 deputados federais. A ação é desenvolvida de forma conjunta com a equipe de Relações Institucionais da CACB, representada na reunião pelo diretor João Andrade. A direção da entidade avaliou positivamente os resultados obtidos e destacou a importância do trabalho suprapartidário desenvolvido junto ao Legislativo."}, "type": "paragraph"}, {"id": "qkO1XfaoKM", "data": {"text": "Ao apresentar as prioridades de comunicação para os próximos meses, a entidade reafirmou o foco em cinco grandes temas considerados estratégicos para o ambiente de negócios brasileiro: reforma tributária, Simples Nacional, voto distrital, jornada de trabalho e inteligência artificial."}, "type": "paragraph"}, {"id": "r76orVeV9y", "data": {"text": "Durante a reunião, foi confirmada a realização de uma grande mobilização nacional em torno do Painel Gasto Brasil, plataforma criada pela CACB para monitorar a evolução dos gastos públicos.&nbsp;“Precisamos ampliar o debate sobre eficiência do gasto público e reforma administrativa”, defendeu Cotait."}, "type": "paragraph"}, {"id": "tmEY4sTD4c", "data": {"text": "Fortalecimento do associativismo"}, "type": "paragraph"}, {"id": "UtpgcJYOyL", "data": {"text": "Ao abrir a reunião, Alfredo Cotait Neto destacou a importância da atuação coordenada do sistema do associativismo em um momento de profundas transformações para o ambiente de negócios brasileiro. “Nós temos a responsabilidade de liderar debates fundamentais para o futuro do país. Nossa missão é representar os empreendedores brasileiros e defender medidas que promovam competitividade, crescimento econômico e geração de empregos”, afirmou."}, "type": "paragraph"}, {"id": "TVL00ow1Sd", "data": {"text": "Durante a atividade, Cotait também agradeceu o trabalho das equipes da CACB e ressaltou o papel das associações comerciais na defesa do empreendedorismo brasileiro. “Os resultados apresentados mostram a força do nosso sistema. Temos mais de 2.300 associações comerciais espalhadas pelo país, atuando diariamente para fortalecer empresas, gerar oportunidades e contribuir para o desenvolvimento econômico e social do Brasil”, concluiu."}, "type": "paragraph"}], "version": "2.31.6"}	https://cacb.org.br/wp-content/uploads/2026/06/Conselho-Deliberativo-foto-capa.png	PUBLISHED	2026-12-12 15:12:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:13:33.078	2026-07-05 15:57:15.239	Legenda da Imagem	t
8eaee9d5-6160-4e6f-8c27-db34fa03b070	Governo vai atualizar teto do MEI com base na inflação, mas de forma escalonada	governo-vai-atualizar-teto-do-mei-com-base-na-inflacao-mas-de-forma-escalonada	A afirmação é do ministro Bruno Moretti, do Planejamento. Segundo ele, o valor atual, de R$ 81 mil anuais, será elevado gradualmente nos dois próximos anos, até chegar perto de R$ 140 mil	{"time": 1783267168060, "blocks": [{"id": "bpJDW6izxy", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2026/06/RKM_1051-800x384.jpg"}, "caption": "Legenda da imagem", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}, {"id": "p4_WTnm3nf", "data": {"text": "O ministro do Planejamento e Orçamento, Bruno Moretti, reforçou nesta sexta-feira, 26/06, que o governo federal deve formalizar junto ao Congresso Nacional, nos próximos dias, uma proposta sobre o teto de faturamento dos microempreendedores individuais (MEI), elevando dos atuais R$ 81 mil por ano para algo entre R$ 130 mil e R$ 140 mil."}, "type": "paragraph"}, {"id": "RTe3eKBU_L", "data": {"text": "Moretti destacou que o limite de faturamento do MEI está defasado há anos e que o objetivo do governo é corrigir essa defasagem com base na inflação acumulada. “O teto está estagnado, e a gente trabalha com a perspectiva de atualizar esse valor para um patamar entre R$ 130 mil e R$ 140 mil, que é mais ou menos a reposição da inflação”, disse."}, "type": "paragraph"}, {"id": "xBqxVDQ_nh", "data": {"text": "No entanto, o aumento deve ser escalonado, sendo distribuído nos exercícios dos dois próximos anos. De acordo com Moretti, essa é uma forma de garantir o equilíbrio fiscal e a previsibilidade orçamentária. “Isso é absorvível desde que seja feito de maneira escalonada em 2027 e 2028”, afirmou."}, "type": "paragraph"}, {"id": "0a79P2iS7_", "data": {"text": "Moretti mostra sintonia com declarações do relator do Projeto de Lei Complementar (108/2021), deputado federal Jorge Goetten (Republicanos-SC). “Nós fizemos uma correção bem criteriosa, trazendo os indicadores da inflação desde 2012 até 2026. Chegamos a números muito próximos do que o setor defendia, e a equipe econômica já está de acordo. Pela proposta em elaboração, o limite anual do microempreendedor individual passaria para R$ 140 mil, em implementação escalonada”, disse Goetten durante um seminário nesta sexta-feira, em Fortaleza (CE)."}, "type": "paragraph"}, {"id": "g3hWV91va2", "data": {"text": "Além do reajuste no valor, o texto deve ampliar o limite para a contratação de funcionários, que é outra premissa do PLP 108/2021. “Atualizaria [de 1 para 2] o número de empregados que o MEI pode contratar também, outra demanda que o presidente Lula deverá atender”, afirmou Moretti."}, "type": "paragraph"}, {"id": "cw4qQ1kR5V", "data": {"text": "Segundo o ministro, a atualização de regras é tratada no governo como uma demanda legítima do setor e está sendo construída em diálogo com a Câmara dos Deputados e lideranças legislativas. Para ele, este é um exemplo de processo de negociação feito junto ao presidente da Casa, Hugo Motta (Republicanos-PB), e com o relator da matéria."}, "type": "paragraph"}, {"id": "Y7x5riLzR4", "data": {"text": "Outras reivindicações", "level": 3}, "type": "header"}, {"id": "oOiMEan0uo", "data": {"text": "Enquanto o governo federal assume o compromisso de encaminhar a proposta de reajuste do teto do MEI e a ampliação de contratações, a Câmara dos Deputados dá prosseguimento à discussão do tema em seminários regionais. Nesta sexta-feira, o debate ocorreu na Câmara Municipal de Fortaleza (CE)."}, "type": "paragraph"}, {"id": "KM0ICDjG28", "data": {"text": "Além do que já foi “pacificado” com o governo, o relator do PLP 108/2021 e o&nbsp;<a href=\\"https://dcomercio.com.br/publicacao/s/associacoes-comerciais-pedem-reajuste-a-totalidade-do-simples-nacional\\" target=\\"_blank\\">setor produtivo defendem a ampliação do limite de faturamento para todo o Simples Nacional</a>, que abrange as micro e pequenas empresas. Também há o pleito pela criação de um mecanismo permanente de correção dos valores, de forma automática, o que evitaria longos períodos sem atualizações, como na atual situação, em que a inflação acumulada reflete em perdas para os empreendedores."}, "type": "paragraph"}, {"id": "F8zLLgDgve", "data": {"text": "Segundo Goetten, o relatório final do PLP será construído em conjunto com parlamentares, entidades empresariais e equipe econômica do governo. Ele também destacou a importância da mobilização de entidades como a Confederação das Associações Comerciais e Empresariais do Brasil (CACB), além de frentes parlamentares ligadas ao empreendedorismo, livre mercado, comércio e serviços, mulheres empreendedoras e micro e pequenas empresas."}, "type": "paragraph"}, {"id": "7pjXflm6g9", "data": {"text": "Durante a atividade, Goetten elogiou a atuação do deputado federal Luiz Gastão (PSD-CE), que coordenou a sessão em Fortaleza, na articulação política da proposta no Congresso Nacional."}, "type": "paragraph"}, {"id": "5zWrse8PPP", "data": {"text": "Escala 6×1", "level": 3}, "type": "header"}, {"id": "OSb2_SwV9d", "data": {"text": "O deputado Goetten afirmou, ainda, que o relatório deverá aproveitar a discussão para criar mecanismos de compensação aos pequenos negócios caso seja aprovada a redução da jornada de trabalho. Entre as medidas estudadas está a isenção temporária da contribuição previdenciária sobre novos empregados contratados."}, "type": "paragraph"}, {"id": "ii-50E2-BS", "data": {"text": "“Queremos mitigar o impacto da nova jornada, principalmente para os pequenos negócios, garantindo por dois anos a isenção da contribuição previdenciária para as novas contratações decorrentes dessa mudança.”"}, "type": "paragraph"}, {"id": "93W7bDC-Za", "data": {"text": "O relator também anunciou que pretende incluir medidas para reduzir a inadimplência entre os microempreendedores individuais, hoje estimada em cerca de 40% dos inscritos. A proposta prevê reduzir de 360 para 60 dias o prazo de permanência do MEI inadimplente antes do cancelamento do registro."}, "type": "paragraph"}, {"id": "kqbteYSdpN", "data": {"text": "Goetten afirmou que a comissão também discutirá formas de combater a chamada “pejotização” do MEI. “Precisamos atualizar os limites sem descaracterizar a essência do MEI, garantindo proteção social ao pequeno empreendedor e evitando distorções nas relações de trabalho.”"}, "type": "paragraph"}, {"id": "8S23H2raKJ", "data": {"text": "Seminário", "level": 3}, "type": "header"}, {"id": "ahbOJgGV1z", "data": {"text": "Participaram do seminário representantes de entidades empresariais e do governo estadual, entre eles o presidente do Sistema Fecomércio (Federação do Comércio de Bens, Serviços e Turismo) do Ceará, Luiz Fernando Bittencourt; o diretor da Federação das Indústrias do Estado do Ceará (Fiec), Lauro Filho; o secretário-executivo de Comércio e Serviços da Secretaria do Desenvolvimento Econômico (SDE), Vicente Ferreira; a gerente da Unidade de Políticas Públicas do Sebrae Ceará, Francisca Vilma Ferreira; e o vereador e representante da Câmara Municipal, Paulo Martins (PDT-CE)."}, "type": "paragraph"}, {"id": "4F2bjK99gR", "data": {"text": "O evento contou, ainda, com a presença de representantes da Federação das Micro e Pequenas Empresas (Femicro), da Associação de Micro e Pequenos Empresários e de presidentes de sindicatos patronais de diversos municípios cearenses, como Juazeiro do Norte, Caucaia, Cascavel e Maranguape, além de membros de segmentos como autoescolas, moda e beleza, carnes e eventos."}, "type": "paragraph"}, {"id": "vnxXSLO7J0", "data": {"text": "Os seminários sobre o tema integram o programa&nbsp;Câmara pelo Brasil&nbsp;e já foram realizados em Porto Alegre (RS), São Paulo (SP), Florianópolis (SC) e Belo Horizonte (MG)."}, "type": "paragraph"}, {"id": "ta28Hsvz1X", "data": {"file": {"url": "https://wallpapercave.com/wp/wp10084718.png"}, "caption": "Legenda da imagem 02", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}], "version": "2.31.6"}	https://cacb.org.br/wp-content/uploads/2026/06/RKM_1051-800x384.jpg	PUBLISHED	2026-12-13 16:13:00	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-05 00:14:42.661	2026-07-05 15:59:28.112	Participantes do Seminário na Câmara Municipal de Fortaleza (CE). Foto: Câmara pelo Brasil.	f
\.


--
-- Data for Name: Patrocinador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patrocinador" (id, name, "logoUrl", "linkUrl", status, "sortOrder", "createdAt", "updatedAt") FROM stdin;
da481d5b-806a-42f8-a1ee-6d4df5137837	Banco do Brasil	https://upload.wikimedia.org/wikipedia/commons/5/52/BB-logo1.jpg	https://www.bb.com.br/site/	PUBLISHED	2	2026-07-05 19:07:31.872	2026-07-05 19:14:04.62
613f0895-afb3-4309-b18a-3454316eaf35	Kojima Productions	https://upload.wikimedia.org/wikipedia/pt/7/75/Kojima_Productions_logo.png	https://www.kojimaproductions.jp/	PUBLISHED	3	2026-07-05 19:08:10.527	2026-07-05 19:14:08.485
a59ddaa1-2591-47c3-af61-4caf17239076	Hytale Studios	https://hytale.com/images/logo.webp	https://hytale.com/	PUBLISHED	7	2026-07-05 19:11:59.521	2026-07-05 19:30:53.465
22bab48d-8e1f-44e2-855b-b2db34e5582a	CD Projekt Red	https://upload.wikimedia.org/wikipedia/pt/d/d0/CDProjekt_2014_logo.svg.png	https://www.cdprojektred.com/en	PUBLISHED	4	2026-07-05 19:12:34.758	2026-07-05 19:34:48.447
74fcfb9f-ade9-44c2-a66a-e421dc4891e5	Arkane Studios	https://upload.wikimedia.org/wikipedia/commons/9/95/Arkane_Studios_Logo_2020.png	https://www.arkane-studios.com/en	PUBLISHED	6	2026-07-05 19:28:45.159	2026-07-05 19:34:55.862
2de7d34d-9aa6-4b42-af8d-8540b09502ba	Bethesda Studios 	https://upload.wikimedia.org/wikipedia/commons/2/22/Bethesda_Game_Studios_logo.svg	https://bethesda.net/pt-BR	PUBLISHED	5	2026-07-05 19:10:57.329	2026-07-05 19:34:58.642
4cf42e05-e92b-4d35-aef7-bdfdd9b8685a	Nubank	https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Nubank_logo.svg/1280px-Nubank_logo.svg.png	https://nubank.com.br/	PUBLISHED	1	2026-07-05 19:06:22.159	2026-07-05 19:35:18.671
\.


--
-- Data for Name: Presidente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Presidente" (id, name, "termStart", "termEnd", "photoUrl", bio, "sortOrder", "createdAt", "updatedAt") FROM stdin;
a92e2c9d-0d31-412f-a560-44b2a99e1c32	Pedro de Miranda Melo	1954	1958	http://localhost:3000/uploads/presidentes/b3826258-469d-4659-a852-bb5e0f7875f2.jpeg	\N	10	2026-07-05 02:37:44.971	2026-07-05 21:19:02.287
6205b722-3052-450a-b4f6-51648b138682	Armando Marques Mourão	1958	1961	http://localhost:3000/uploads/presidentes/72d62d0c-a929-4fd4-b09a-0726a0107b28.jpeg	\N	11	2026-07-05 02:37:21.566	2026-07-05 21:19:02.289
1a13f500-bf11-4318-8580-991b3ba67e4e	Antônio de Melo Rosa	1961	1964	http://localhost:3000/uploads/presidentes/c7a7c113-0414-4979-b918-681d7c28602b.jpeg	\N	12	2026-07-05 02:36:41.675	2026-07-05 21:19:02.291
00929f4d-2cc3-4563-8278-11ce966dfd35	Francisco de Assis Machado	1964	1968	http://localhost:3000/uploads/presidentes/d93b368e-bf42-4aa7-88f2-6fa6f3d8f956.jpeg	\N	13	2026-07-05 02:36:24.276	2026-07-05 21:19:02.292
66c3d9a7-ff22-414d-971e-4e594beaeb43	Manoel Evaristo de Paiva	1939	1943	http://localhost:3000/uploads/presidentes/e2cedd8e-52ac-44cc-b607-aebc54befcff.jpeg	\N	6	2026-07-05 02:39:10.972	2026-07-05 21:19:02.274
1aa15cad-2bbe-4e1d-8563-63d49e03d846	João José de Castro	1968	1971	http://localhost:3000/uploads/presidentes/f6583c58-d50a-41f3-98d6-b87284e5cbf6.jpeg	\N	14	2026-07-05 02:35:14.968	2026-07-05 21:19:02.293
2ea9b675-a5d7-499e-825c-5662d7d620de	Boanerges Cisne Sales	1971	1974	http://localhost:3000/uploads/presidentes/5513a420-650d-4d76-9c70-2466990dc235.jpeg	\N	15	2026-07-05 02:34:57.106	2026-07-05 21:19:02.295
2b594e6f-d8b7-402d-b8cb-e42c6a2f36ae	Raimundo Soares Resende	1974	1976	http://localhost:3000/uploads/presidentes/cd56042b-e4c0-4d16-9133-e9e30123b7cf.jpeg	\N	16	2026-07-05 02:34:23.402	2026-07-05 21:19:02.298
26ba2d7a-be02-4f88-94f4-1681d03bb39b	José Américo Moreira	1978	1980	http://localhost:3000/uploads/presidentes/58f307d0-b860-496e-846b-11b87664699c.jpeg	\N	18	2026-07-05 02:33:06.134	2026-07-05 21:19:02.302
af05788b-b942-40d1-91d1-aec1f66b5813	Antonio Pimentel Rocha	1980	1982	http://localhost:3000/uploads/presidentes/fdc6f6aa-7c1b-4ac6-9de5-48d3023d1c98.jpeg	\N	19	2026-07-05 02:32:45.406	2026-07-05 21:19:02.305
6813e143-3145-4798-9144-2b162b1ec622	Edmundo Pinto Filho	1982	1984	http://localhost:3000/uploads/presidentes/190336ea-1a42-42fe-b05e-30f63c398fe0.jpeg	\N	20	2026-07-05 02:31:19.152	2026-07-05 21:19:02.306
9eafa5e7-bf63-41dc-b417-89248b92de94	Antônio Soares Martins	1984	1991	http://localhost:3000/uploads/presidentes/7f12dfbe-005b-44b6-bbbe-49d52265882d.jpeg	\N	21	2026-07-05 02:30:57.948	2026-07-05 21:19:02.309
5c5a7764-7b78-4812-ba13-a8e04b518318	José Airton Melo Aguiar	1991	1993	http://localhost:3000/uploads/presidentes/a23f9848-543f-4f8f-a00c-9acb504afea7.jpeg	\N	22	2026-07-05 02:30:30.979	2026-07-05 21:19:02.311
0719e948-4b59-4805-97d6-8f776babfaf5	Fernando Antônio Aguiar Albuquerque	1995	1997	http://localhost:3000/uploads/presidentes/bbad030e-14e3-4093-9d85-0badc5bbf55f.jpeg	\N	23	2026-07-05 02:30:01.465	2026-07-05 21:19:02.314
93202e54-dab9-49e1-b0b3-77e226e5351e	José de Melo Cavalcante	1999	2003	http://localhost:3000/uploads/presidentes/b9c69588-715e-4d98-bc0d-ee86f6ff285a.jpeg	\N	24	2026-07-05 02:29:47.406	2026-07-05 21:19:02.315
3c9926d6-607b-48e0-81fe-ac9112645861	Antônio Luiz Benevides Sales	2015	2016	http://localhost:3000/uploads/presidentes/7e86fcb7-0769-4d6a-9bdb-039e00b12927.jpeg	\N	25	2026-07-04 22:31:44.362	2026-07-05 21:19:02.318
8dcdcc04-fa14-4abe-b531-b1d56ca22db3	Francisco Roberto Lima e Silva	2017	2023	http://localhost:3000/uploads/presidentes/a4d0ac6d-fe05-478a-8a57-a4862dd2222c.jpeg	Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal.	26	2026-07-04 22:26:48.785	2026-07-05 21:19:02.319
38f93392-0855-4d27-a110-70994bf0d979	Francisco Mariano Cavalcante	1925	1929	http://localhost:3000/uploads/presidentes/17b7ed19-8a26-4987-a443-296d52e42f0e.jpeg	\N	2	2026-07-05 02:40:41.261	2026-07-05 21:19:04.261
97577a77-83f4-4f88-977b-5a5ccadc52cc	Firmino Rocha Aguiar	1929	1931	http://localhost:3000/uploads/presidentes/eb2d6d1e-6e63-4504-ae10-370183242b27.jpeg	\N	3	2026-07-05 02:40:27.632	2026-07-05 21:19:04.262
4e8029d1-57f8-414d-b2db-1a50328b4b41	Julio Evaristo de Paiva	1947	1951	http://localhost:3000/uploads/presidentes/63514f0d-e9ca-47b8-8730-22c99c10d806.jpeg	\N	8	2026-07-05 02:38:32.151	2026-07-05 21:19:02.265
0451075a-ee86-451e-b748-0960e3126131	Abel Alcanfor Soares	1931	1935	http://localhost:3000/uploads/presidentes/5b220f98-fc99-4c9a-8e76-bff65947dcff.jpeg	\N	4	2026-07-05 02:40:10.702	2026-07-05 21:19:02.266
5a52e0d4-bafa-4f56-895d-42cbdbf9328b	Auton Aragão	1921	1925	http://localhost:3000/uploads/presidentes/43db60c8-5059-4fa4-8df0-bf3eaa72a984.jpeg	\N	1	2026-07-05 02:40:56.8	2026-07-05 21:17:08.997
f5f39a91-dc76-4a5f-af21-cbac94af719b	Raimundo Bezerra de Melo	1976	1978	http://localhost:3000/uploads/presidentes/dd6c15b9-778c-4543-802c-9800a3b62b02.jpeg	\N	17	2026-07-05 02:33:41.152	2026-07-05 21:19:02.301
fc440316-4f8c-4975-89e7-c11a0353ee2f	Pedro Machado da Ponte	1935	1939	http://localhost:3000/uploads/presidentes/3cec27bd-4091-4f2b-adfd-84544fca365d.jpeg	\N	5	2026-07-05 02:39:56.165	2026-07-05 21:19:02.267
2ff8c42f-371c-4aff-bc0f-1fde0719c2e8	Bento Coutinho de Macedo	1951	1954	http://localhost:3000/uploads/presidentes/4d260188-e51a-48a9-9ca6-50baaa31fd5b.jpeg	\N	9	2026-07-05 02:38:13.182	2026-07-05 21:19:02.268
73df3705-8351-44b9-a27a-83bafacca9e3	Francisco Melo Lima	1943	1947	http://localhost:3000/uploads/presidentes/8a906a0e-e905-42ab-a362-15554250686c.jpeg	\N	7	2026-07-05 02:38:51.777	2026-07-05 21:19:02.282
\.


--
-- Data for Name: QuemSomosSection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuemSomosSection" (id, key, title, content, status, "sortOrder", "createdAt", "updatedAt") FROM stdin;
81af1727-4785-4a43-abf8-3db635858899	diretoria	Diretoria da ACIC	{"time": 1783214855231, "blocks": [{"id": "K092zRyv24", "data": {"text": "Diretoria", "level": 2}, "type": "header"}, {"id": "v1kMuM-fzc", "data": {"text": "Conheça a composição completa da nossa diretoria executiva, conselhos fiscais e consultivos que atuam em prol do ecossistema empresarial de Crateús."}, "type": "paragraph"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 20:10:01.071	2026-07-05 01:27:35.287
d4abbf7d-790d-409a-b127-58e30b02c85d	estatuto	Estatuto da CACB	{"time": 1783198163971, "blocks": [{"id": "1bRs9v1Oay", "data": {"text": "Estatuto da CACB", "level": 2}, "type": "header"}, {"id": "P4mnh4Jq8g", "data": {"text": "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais."}, "type": "paragraph"}, {"id": "9yA7LiXnbr", "data": {"text": "Para <a href=\\"https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf\\">baixar o estatuto em PDF clique aqui</a>. Se preferir você pode ver o documento que está disponibilizado a seguir:"}, "type": "paragraph"}, {"id": "VKshr0p3wV", "data": {"url": "https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf"}, "type": "pdfEmbed"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 20:48:50.092	2026-07-04 20:49:24.024
f661fa9d-e756-4453-adf3-bc971df8c843	contatos	Contatos	{"time": 1783200430801, "blocks": [{"id": "seLZdyQ3Va", "data": {"text": "<b>Presidente</b><br>Alfredo Cotait Neto<br>61 – 3321.1311<br><a href=\\"mailto:presidente@cacb.org.br\\">presidente@cacb.org.br</a>"}, "type": "paragraph"}, {"id": "uLUyxGIRWf", "data": {"text": "<b>Superintendente</b><br>Carlos Rezende<br>61 – 3321.1311<br><a href=\\"mailto:rezende@cacb.org.br\\">rezende@cacb.org.br</a>"}, "type": "paragraph"}, {"id": "X5NJsoKAe0", "data": {"text": "<b>Assessora da Diretoria</b><br>Ana Paula Passos<br>61 – 3321.1311<br><a href=\\"mailto:ana.passos@cacb.org.br\\">ana.passos@cacb.org.br</a>"}, "type": "paragraph"}, {"id": "GRcImUX4uE", "data": {"text": "<b>Dúvidas sobre proteção de dados</b><br><a href=\\"mailto:protecaodedados@cacb.org.br\\" target=\\"_blank\\">protecaodedados@cacb.org.br</a>"}, "type": "paragraph"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 21:27:10.857	2026-07-04 21:27:10.857
dde52338-949b-46c0-a2cd-51d17bab4f81	cmec	CMEC	{"time": 1783221296177, "blocks": [{"id": "i4x8AZyjEd", "data": {"text": "Conselho da Mulher Empreendedora e da Cultura", "level": 2}, "type": "header"}, {"id": "jlPX4Vaqbj", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2022/09/CMEC_NOVO-LOGO_Nacional-Padrao-2-1536x864.png"}, "caption": "[Banner oficial do CMEC Nacional]", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}, {"id": "WiEZLeXIqy", "data": {"text": "O Conselho Nacional da Mulher Empreendedora e da Cultura (CMEC Nacional), é um órgão da Confederação das Associações Comerciais e Empresariais do Brasil (CACB), criado em 24 de abril de 2002, em Brasília, pelo Conselho Diretor desta entidade. A primeira prioridade do CMEC é estimular e apoiar a implantação dos conselhos estaduais, objetivando disseminar o Ideal Empreendedor, difundindo e promovendo o Associativismo como base de sustentação nacional."}, "type": "paragraph"}, {"id": "dRTBK8S4nc", "data": {"text": "A proposta do CMEC é trabalhar intensamente para promover a integração de lideranças femininas, expandindo os contatos do CMEC com as diversas organizações empresariais de todos os estados brasileiros e de outros países."}, "type": "paragraph"}, {"id": "_cDW8T-d6q", "data": {"text": "Com essa missão, o CMEC atua com uma visão pró-ativa, de forma a potencializar a mulher criando oportunidades de aprimoramento profissional, possibilitando a ampliação da sua área de atuação, promovendo uma capacitação cada vez maior e procurando fazer com que ela atue em um competitivo mercado de trabalho."}, "type": "paragraph"}, {"id": "Bj5cvCIrtr", "data": {"text": "Nossas Conquistas", "level": 2}, "type": "header"}, {"id": "n_pR1qsDU6", "data": {"text": "Desde sua instituição, o Conselho obteve importantes conquistas, entre eles o Programa Internacional para Formação de Liderança, o Líder Mulher – Lapidando Diamantes do Sebrae e a realização do XIV Congresso Ibero-Americano das Mulheres Empresárias, que ocorreu entre os dias 19 e 23 de outubro de 2003, na cidade de Araxá (MG), a participação na 56ª sessão da Commission sobre o Status da Mulher na ONU e a reunião com a Chefe de Gabinete da Secretaria de Assuntos Globais das Mulheres, Anita Botti."}, "type": "paragraph"}, {"id": "D1CWxpqI81", "data": {"text": "Para saber mais, acesse o site do CMEC <a href=\\"https://www.cmecmulher.com.br/\\">clicando aqui</a>."}, "type": "paragraph"}, {"id": "l5-KU37wnM", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2025/01/Conselho-executivo-CMEC-2025.jpg"}, "caption": "[Conselho Executivo do CMEC Nacional]", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}, {"id": "P1yHZPPS8c", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2023/10/Conselho-CMEC-outubro-2023-2.jpeg"}, "caption": "[Conselho Consultivo do CMEC Nacional]", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 20:54:23.163	2026-07-05 03:14:56.234
edc0aeee-b38d-48d4-82e6-fc77f282da2c	quem-somos	Quem Somos	{"time": 1783259074303, "blocks": [{"id": "GtlczBZsTa", "data": {"text": "A CACB", "level": 2}, "type": "header"}, {"id": "6AfxRiu5EW", "data": {"text": "A Confederação das Associações Comerciais e Empresariais do Brasil (CACB) é um coletivo empresarial que busca contribuir para o desenvolvimento econômico do país, representando 27 Federações, 2300 Associações Comerciais e Empresariais e 2 milhões de empresas em todo o território nacional."}, "type": "paragraph"}, {"id": "AOs46Wp8Qw", "data": {"text": "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais."}, "type": "paragraph"}, {"id": "Y8Cq1XepKl", "data": {"text": "Histórico", "level": 3}, "type": "header"}, {"id": "i0EAPmQOen", "data": {"text": "A CACB é a entidade de representação empresarial mais antiga das Américas. Sua história teve início com a fundação da Associação Comercial da Bahia, em 15 de julho de 1811, atendendo a três desejos: dos comerciantes, para terem um local condigno onde pudessem se reunir regularmente e aí realizar seus negócios, como já vinham fazendo há anos, na própria Cidade Baixa; do vice-rei do Brasil, D. Marcos de Noronha e Britto, VIII Conde dos Arcos de Val de Vez, interessado no desenvolvimento da província que governava, sede do maior porto do hemisfério sul à época, já aberto, desde 1808, às “nações amigas”; e do Príncipe Regente, D. João VI, de promover o progresso da Colônia, sede provisória da Corte Portuguesa."}, "type": "paragraph"}, {"id": "QWTFRZyOTQ", "data": {"file": {"url": "https://cacb.org.br/wp-content/uploads/2024/03/foto-historia-sede-associacao-acb-bahia.jpg"}, "caption": "Associação Comercial da Bahia, a primeira da história, cujas instalações são tombadas pelo Instituto do Patrimônio Histórico e Artístico Nacional – IPHAN.", "stretched": false, "withBorder": false, "withBackground": false}, "type": "image"}, {"id": "0gud_jIc36", "data": {"text": "As associações de Norte a Sul do país tiveram importante papel na história do Brasil e na definição e encaminhamento das demandas dos empresários. A Associação Comercial de Alagoas, por exemplo, chegou a controlar a exportação do açúcar no século XIX."}, "type": "paragraph"}, {"id": "HdBKc23ndf", "data": {"text": "O termo &lt;em&gt;comercial&lt;/em&gt;, presente na nomenclatura destas associações vem de transação comercial, estas que, in 1811, eram feitas no local onde a ACBahia foi criada. A sede da Associação passou a centralizar a realização de negócios de diversos produtores e produtos, fomentando o comércio local da época."}, "type": "paragraph"}, {"id": "1NTi1sH_EY", "data": {"text": "Devido ao valor histórico do termo “comercial”, ele foi mantido e, até hoje, serve para dar nome às entidades da rede CACB em todo o país. Engana-se, no entanto, quem pensa que a representatividade do Sistema se limita apenas ao comércio."}, "type": "paragraph"}, {"id": "ZZ6Un7DTOc", "data": {"text": "Pelo contrário! As Associações Comerciais representam empresários dos mais variados setores, como do próprio comércio ou de serviços, indústria, agronegócio, entre outros. Além de defenderem os interesses dos empresários junto ao governo, as ACEs desenvolvem serviços para a classe, como capacitações, assessoria jurídica, planos de saúde, certificados de origem, certificado digital, mediação e arbitragem, entre outros."}, "type": "paragraph"}, {"id": "38mlHiPHrO", "data": {"url": "https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf", "text": "📄 Acesse aqui o estatuto da CACB"}, "type": "pdfLink"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-04 21:01:01.789	2026-07-05 13:44:34.359
b00d5f0d-f2e5-4e6a-bedf-658f3d7a09eb	presidentes	Galeria de Presidentes	{"time": 1783285452641, "blocks": [{"id": "wbSFKCrcQU", "data": {"text": "Nossa História em Liderenças", "level": 2}, "type": "header"}, {"id": "XvvoEfRMMp", "data": {"text": "Conheça os líderes que conduziram a nossa instituição ao longo dos anos, deixando seu legado e contribuindo ativamente para o fortalecimento do associativismo crateuense."}, "type": "paragraph"}], "version": "2.31.6"}	PUBLISHED	0	2026-07-05 01:10:27.12	2026-07-05 21:04:12.692
\.


--
-- Data for Name: Servico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Servico" (id, title, slug, summary, description, icon, "imageUrl", status, "authorId", "createdAt", "updatedAt", destaque, "sortOrder") FROM stdin;
430dcb6e-5f84-4ea7-b4b6-3fa3cab7daba	Registro de Marcas, Softwares e Patentes	registro-de-marcas-softwares-e-patentes	Tenha total segurança para investir nos seus negócios.	{"time": 1783202921214, "blocks": [{"id": "Sb-b5mNOsc", "data": {"text": "O serviço de registro de marcas é importante para dar segurança às empresas no que tange à gestão da imagem dos negócios. Através dele, as Associações Comerciais de todo o país poderão oferecer o registro de marcas, softwares e patentes, o que abrange não apenas o logotipo da empresa, mas também dos produtos e serviços oferecidos por ela."}, "type": "paragraph"}, {"id": "NqY16ObS3V", "data": {"text": "A marca é um dos principais patrimônios de uma empresa e, quando bem cuidada, pode, inclusive, gerar lucros. O registro oficial da marca, além de evitar problemas jurídicos, também dá ao empresário segurança para investir no marketing da empresa. Nesse sentido, o AC Marcas oferece pesquisa, monitoramento, registro e renovação de marcas, softwares e patentes, tudo no mesmo pacote, por meio do suporte de especialistas qualificados, gestão online, com credibilidade e confiança."}, "type": "paragraph"}, {"id": "10eBH03-ni", "data": {"text": "Passo a passo para registrar sua marca:", "level": 3}, "type": "header"}, {"id": "0PwHoZubJG", "data": {"text": "<b>BUSCA DE MARCA:</b> Uma pesquisa é realizada no INPI para verificar se a sua marca poderá ser registrada."}, "type": "paragraph"}, {"id": "ThjBfP8-gO", "data": {"text": "<b>INÍCIO DO PROCESSO:</b> Se a busca apontar que é viável, é cobrada uma taxa única (inclusas a busca e a GRU, exigida pelo INPI), e o processo de solicitação de registro da sua marca junto ao INPI é iniciado."}, "type": "paragraph"}, {"id": "prROZ42Mzq", "data": {"text": "<b>AVALIAÇÃO:</b> A solicitação é avaliada pelo INPI e nós fazemos todo o acompanhamento."}, "type": "paragraph"}, {"id": "xvvRMNRx6T", "data": {"text": "<b>APROVAÇÃO:</b> Com a aprovação da solicitação, o cliente paga a taxa final diretamente ao INPI, sob orientação do ACMarcas, e o registro da sua marca é concedido."}, "type": "paragraph"}, {"id": "Y99WhKI-99", "data": {"text": "<b>VALIDADE:</b> O registro da sua marca tem validade de dez anos e você pode fazer a renovação com o ACMarcas."}, "type": "paragraph"}, {"id": "cvI6F0AxsY", "data": {"text": "Por que fazer o registro da sua marca com o ACMarcas?", "level": 3}, "type": "header"}, {"id": "L0a79-B07E", "data": {"meta": {}, "items": [{"meta": {}, "items": [], "content": "Melhores custos e parcelamento em até 10x vezes para Associados."}, {"meta": {}, "items": [], "content": "Não cobramos mensalidades e nem anuidades pelo registro."}, {"meta": {}, "items": [], "content": "Associados da AC ganham descontos especiais."}, {"meta": {}, "items": [], "content": "Confiabilidade de ser um serviço da Associação Comercial, garantindo mais segurança para o seu processo."}, {"meta": {}, "items": [], "content": "Todo o procedimento é realizado por especialistas qualificados."}, {"meta": {}, "items": [], "content": "Atuamos desde a pesquisa de viabilidade até o deferimento da marca."}, {"meta": {}, "items": [], "content": "Fazemos o controle de prazos por meio da tecnologia, facilitando o acompanhamento do processo."}, {"meta": {}, "items": [], "content": "Informações e orientações de atendimento online e presencial."}, {"meta": {}, "items": [], "content": "As ACEs interessadas em levar o AC Marcas ao seu município, devem entrar em contato com a Federação do seu estado para solicitar o agendamento de uma reunião. No caso das Federações, o contato deve ser feito diretamente com a CACB."}], "style": "unordered"}, "type": "list"}, {"id": "cXfzdBaDSx", "data": {"text": "Parceiro", "level": 3}, "type": "header"}, {"id": "hhPIu-68Qz", "data": {"text": "O serviço será oferecido em parceria com o Escritório de Marcas &amp; Patentes da Associação Comercial (AC Marcas), que intermedeia as comunicações durante o processo de registro de marcas de empresas de todos os portes e tipos jurídicos."}, "type": "paragraph"}, {"id": "O_S9JnYANQ", "data": {"text": "O serviço vai promover o acesso aos institutos de propriedade intelectual, incluindo o registro de marcas, softwares e patentes para empresas, em especial os Microempreendedores Individuais (MEIs) e pequenas empresas.", "title": "Marca conhecida é marca registrada", "imageUrl": "https://cacb.org.br/wp-content/uploads/2024/01/hero-servicos-registro-de-marca.jpg"}, "type": "imageTextHighlight"}, {"id": "8WLidd9sla", "data": {"text": "FAQs", "level": 3}, "type": "header"}, {"id": "IfVxyAcdZu", "data": {"text": "<b>Qual a diferença entre registro de marca, patente e software?</b>"}, "type": "paragraph"}, {"id": "rQ8tyb-2LV", "data": {"text": "O registro de marca serve para associar a marca aos seus produtos e serviços, garantindo que não seja copiada. Já o Registro de Patentes protege o próprio produto, tecnologia ou processo criado por você ou pela sua empresa, que apresente um diferencial de mercado ou uma inovação. E o Registro de Software é depositado em um banco de propriedade, que recebe um protocolo que comprova esse depósito."}, "type": "paragraph"}, {"id": "wpSUv_Vbfd", "data": {"text": "<b>Porque eu preciso registrar minha marca?</b>"}, "type": "paragraph"}, {"id": "tpGPgpZNad", "data": {"text": "Registrar sua marca, patente ou software torna o seu projeto (prestação de serviços, produto) exclusivo dentro do segmento que está inserido, não podendo, assim, possuir imitações ou aproximações ao Registro, que não precisa necessariamente ser ligado a uma empresa."}, "type": "paragraph"}, {"id": "oY4MJaIIaP", "data": {"text": "<b>Preciso pagar para registrar minha marca ou patente?</b>"}, "type": "paragraph"}, {"id": "eMChiAC6Ab", "data": {"text": "Sim, todo processo de registro tem pelo menos duas taxas: a final e a inicial. A inicial é a Guia de Recolhimento da União (GRU), que é emitida no momento da solicitação (que já está inclusa no serviço prestado pelo ACMarcas). Já a final é paga diretamente ao INPI, quando o processo é aprovado, com orientação do ACMarcas."}, "type": "paragraph"}, {"id": "uD4pPitBcW", "data": {"text": "<b>Sou MEI ou MPE, mesmo assim, preciso registrar minha marca?</b>"}, "type": "paragraph"}, {"id": "tMmJPHUbwa", "data": {"text": "Sim, inclusive microempreendedores individuais e microempresas podem registrar suas marcas."}, "type": "paragraph"}, {"id": "vG5jSvsoiK", "data": {"text": "<b>Quanto tempo leva para obter o meu registro?</b>"}, "type": "paragraph"}, {"id": "II16ol1ug9", "data": {"text": "O prazo varia muito em função das etapas do processo, podendo chegar a dois anos. No entanto, o ACMarcas faz o acompanhamento de todo o processo e informa o cliente a cada etapa."}, "type": "paragraph"}, {"id": "rIIkJkysc1", "data": {"text": "<b>Quantas etapas existem dentro do processo de concessão de marca?</b>"}, "type": "paragraph"}, {"id": "lcNS5z-alq", "data": {"text": "Não se trata de um processo ágil e imediato. Por essa razão, o apoio de uma consultoria especializada é imprescindível, inclusive para não perder o prazo exigido por algumas delas. As etapas, normalmente, são: pedido Inicial, exame formal, publicação para oposição, possibilidade de exigência formal, exame técnico, possibilidade de recurso, deferimento e pagamento, cumprimento do prazo ordinário e concessão válida por dez anos, com possibilidade de renovação."}, "type": "paragraph"}], "version": "2.31.6"}	📜	https://cacb.org.br/wp-content/uploads/2024/01/capas-servicos-registro-de-marca.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 21:47:44.178	2026-07-05 20:26:18.617	t	3
186780db-30b2-441f-8b88-28340ca05069	Certificado de Origem	certificado-de-origem	Caminho livre para sua exportação com agilidade	{"time": 1783258914540, "blocks": [{"id": "6u98lB2Uty", "data": {"text": "O Certificado de Origem atesta a origem da mercadoria, uma vez cumpridas as regras estabelecidas entre os países que fazem parte do acordo, proporcionando ao importador o benefício de redução ou isenção do imposto de importação, sendo uma das vantagens comerciais no processo de exportação."}, "type": "paragraph"}, {"id": "DyOiIyjK8i", "data": {"text": "Certificado de Origem Preferencial", "level": 3}, "type": "header"}, {"id": "heRwaNlXbm", "data": {"text": "O Certificado de Origem Preferencial é um documento que atesta a origem da mercadoria no país exportador, ao qual cumpre com as regras estabelecidas entre os países membros. Os elementos principais das regras de origem são: critérios de origem, condições de expedição e de transporte e provas documentais. O objetivo é dar competitividade aos exportadores brasileiros, oferecendo ao importador do país membro a redução ou isenção do imposto de importação."}, "type": "paragraph"}, {"id": "6KrScxu9Bf", "data": {"text": "Certificado de Origem Não Preferencial", "level": 3}, "type": "header"}, {"id": "maj3gmJcRw", "data": {"text": "Certificado de Origem Comum – normas de origem não preferencial – conjunto de leis, regulamentos e determinações administrativas de aplicação geral, utilizados para a determinação do país de origem das mercadorias, desde que não relacionados a regimes comerciais contratuais ou autônomos que prevejam a concessão de preferências tarifárias. Este Certificado não oferece uma preferência tarifária de política comercial, mas segue regras de origem para a aplicação de tratamento de nação mais favorecida, direitos antidumping e direitos compensatórios, salvaguardas, exigências de marcação de origem, restrições quantitativas discriminatórias ou quotas tarifárias, estatísticas e compras do setor público, entre outros."}, "type": "paragraph"}, {"id": "v5pNNA7kYL", "data": {"text": "Certificado de Origem Digital (COD)", "level": 3}, "type": "header"}, {"id": "6aEfBbn1PC", "data": {"text": "O sistema ECO da CACB, já homologado pelo MDIC para o projeto COD – Certificado de Origem com assinatura Digital, vem atendendo empresas exportadoras de todo o país de forma ágil, segura, prática e flexível, com poder de decisão próximo e imediato."}, "type": "paragraph"}, {"id": "uCzjRaDPD0", "data": {"text": "Sistema ECO", "level": 3}, "type": "header"}, {"id": "nvKXPE3awY", "data": {"text": "O sistema ECO proporciona uma conexão online entre todos os seus pontos de certificação, possibilitando resolver qualquer problema que ocorrer em fronteiras. Além disto, possibilita a importação de dados do sistema do prestador (despachante) e ou exportador, através de integração via WebService."}, "type": "paragraph"}, {"id": "1gWGwXJX5H", "data": {"text": "Sistema Ippex (Faciap)", "level": 3}, "type": "header"}, {"id": "lBp1t3v7hG", "data": {"text": "O Instituto de Planejamento e Promoção em Comércio Exterior – Ippex foi criado em 2006, pela Faciap, com o objetivo de ajudar empresas paranaenses a ingressarem no mercado internacional e se manterem competitivas nesse mercado."}, "type": "paragraph"}, {"id": "T6uYZwFCEV", "data": {"text": "A atuação do Ippex no Paraná veio também para complementar o serviço de emissão de Certificado de Origem para exportação já existente na Faciap desde 1999 – federação que representa hoje cerca de 270 associações comerciais e um universo com mais de 50 mil empresas associadas em todo o estado."}, "type": "paragraph"}, {"id": "A0yzkIZrzB", "data": {"text": "Atendendo a mais des de 12 mil clientes, o Ippex já emitiu mais de 500 mil certificados de origem, atestando a origem de mercadorias em mais 200 países."}, "type": "paragraph"}, {"id": "xh2-WXnlpA", "data": {"text": "Baixe os arquivos de apresentação da parceria:", "level": 3}, "type": "header"}, {"id": "aIWUd-CpaN", "data": {"url": "https://cacb.org.br/wp-content/uploads/2022/09/Apresentacao_CACB_Ippex-29092022.pdf", "text": "📄 Apresentação CACB"}, "type": "pdfLink"}, {"id": "EvYq_IWeX5", "data": {"url": "https://cacb.org.br/wp-content/uploads/2022/09/Apresentacao-Ippex_Faciap-29092022.pdf", "text": "📄 Apresentação Ippex"}, "type": "pdfLink"}, {"id": "jguT4I4y3M", "data": {"text": "Garanta a procedência de suas exportações, com uma plataforma segura e ágil para a emissão de Certificado de Origem.", "title": "O Certificado de Origem garante que o seu produto será bem recebido no exterior.", "imageUrl": "https://cacb.org.br/wp-content/uploads/2023/07/hero-servicos-certificado-de-origem.jpg"}, "type": "imageTextHighlight"}], "version": "2.31.6"}	🌍	https://cacb.org.br/wp-content/uploads/2023/07/capas-servicos-certificado-de-origem.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 21:52:07.844	2026-07-05 20:26:26.352	t	1
29b7cb6b-9097-4113-ba07-0377d020a822	Certificado Digital	certificado-digital	Certificado Digital sem sair de casa	{"time": 1783258118473, "blocks": [{"id": "-PUXbFdMgz", "data": {"text": "Ao adquirir o certificado da CACB você fortalece o sistema associativista e as entidades que dão voz aos empresários de todo o país.", "level": 2}, "type": "header"}, {"id": "6WecExYwZp", "data": {"text": "Um documento ou contrato assinado com o certificado digital tem o mesmo valor de um documento físico. Por isso, você pode assinar de onde estiver, com rapidez, segurança e confidencialidade. O certificado digital agiliza os processos e reduz muito os custos porque não é mais preciso se deslocar, comprar papel, imprimir, transportar e armazenar os documentos."}, "type": "paragraph"}, {"id": "KxYedP6SE7", "data": {"text": "Hoje, o certificado é cada vez mais solicitado para acessar os portais dos governos e obter ou enviar documentos. Essa demanda tende a aumentar e quanto mais serviços forem ofertados online, maior é a necessidade de segurança para fazer as transações."}, "type": "paragraph"}, {"id": "WM472iFmhD", "data": {"text": "Certisign", "level": 3}, "type": "header"}, {"id": "0PaQOQ3H1h", "data": {"text": "A Certisign é uma IDtech com mais de duas décadas de atuação no mercado e líder em Certificação Digital. Viabiliza que serviços e transações sejam realizados on-line de maneira segura e com a garantia da identidade dos envolvidos. Por meio de suas soluções, proporciona às pessoas mais tempo e dinheiro, para que possam aproveitar a vida."}, "type": "paragraph"}, {"id": "YIdx5euhje", "data": {"text": "Certificado Digital é o seu documento no mundo digital. Ele serve tanto para pessoas físicas, quanto para empresas, e é usado para garantir segurança à transação de dados. O certificado tem validade jurídica e identifica, sem deixar dúvida, quem é a pessoa ou empresa que está assinando.", "title": "Agilidade e segurança", "imageUrl": "https://cacb.org.br/wp-content/uploads/2023/07/hero-servicos-certificado-digital.jpg"}, "type": "imageTextHighlight"}], "version": "2.31.6"}	💻	https://cacb.org.br/wp-content/uploads/2023/07/capas-servicos-certificado-digital.jpg	PUBLISHED	fe449d86-1afe-41a3-861d-2c5a1d2c572d	2026-07-04 21:52:23.541	2026-07-05 20:26:26.353	t	2
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "passwordHash", role, active, "createdAt", "updatedAt") FROM stdin;
fe449d86-1afe-41a3-861d-2c5a1d2c572d	Administrador ACIC	admin@acic.local	$2b$10$n9NWI9iehqdhbqa9d1.rpOp7V38HT9wkuUPylv71YE4BOPLyAZWYW	ADMIN	t	2026-07-04 13:41:14.321	2026-07-04 13:41:14.321
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4044045e-6466-4fb8-bd21-980276ff17ed	fe20df575463e75531652f922a35925ec426f5e177b55ebe586108c239208c46	2026-07-04 13:40:36.052149+00	20260609152000_init	\N	\N	2026-07-04 13:40:35.865145+00	1
ba697132-5412-4f71-a04e-a4e2f27fa7e1	5d2a4b83c6b6f4656f84189281bad7ce8cb0d614117119b5ef2084c7ba40994d	2026-07-04 13:40:36.06676+00	20260611170426_add_destaque_flag	\N	\N	2026-07-04 13:40:36.05681+00	1
91800739-632e-4712-99bd-a3aa8b40770e	cdfb9d07c936469e1892ea772fa6170332fc7829e01d9dc380277465ee4a4e51	2026-07-04 13:40:36.091608+00	20260618002945_add_diretor	\N	\N	2026-07-04 13:40:36.071515+00	1
867f2c6f-7edd-49e1-8e61-609f06cf4a2c	e916f28cd574eae2bda4c66f5c9f1abd70aeb7171e14541b3bdbd2d4e30a2949	2026-07-05 14:22:23.62882+00	20260705142223_add_cover_image_options	\N	\N	2026-07-05 14:22:23.614276+00	1
360d6579-7d99-436f-899b-a7aee10ff402	7846778ce89bd8e03e08c20ff5d1465bcf8d60a6abcff2224a697ffbec48fcf9	2026-07-05 18:41:35.321927+00	20260705184135_add_sponsors	\N	\N	2026-07-05 18:41:35.293662+00	1
87860303-9d54-4a31-b7e9-793db911ed35	0a3668cc40f698c54c13567ada7d2e731f27229d253190091cd4965402b28b81	2026-07-05 20:24:34.11353+00	20260705202434_add_sort_order_servico	\N	\N	2026-07-05 20:24:34.101921+00	1
\.


--
-- Name: Associado Associado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Associado"
    ADD CONSTRAINT "Associado_pkey" PRIMARY KEY (id);


--
-- Name: CertificadoSolicitacao CertificadoSolicitacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CertificadoSolicitacao"
    ADD CONSTRAINT "CertificadoSolicitacao_pkey" PRIMARY KEY (id);


--
-- Name: Diretor Diretor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diretor"
    ADD CONSTRAINT "Diretor_pkey" PRIMARY KEY (id);


--
-- Name: Evento Evento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Evento"
    ADD CONSTRAINT "Evento_pkey" PRIMARY KEY (id);


--
-- Name: HomeSlide HomeSlide_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HomeSlide"
    ADD CONSTRAINT "HomeSlide_pkey" PRIMARY KEY (id);


--
-- Name: InscricaoEvento InscricaoEvento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InscricaoEvento"
    ADD CONSTRAINT "InscricaoEvento_pkey" PRIMARY KEY (id);


--
-- Name: Noticia Noticia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Noticia"
    ADD CONSTRAINT "Noticia_pkey" PRIMARY KEY (id);


--
-- Name: Patrocinador Patrocinador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patrocinador"
    ADD CONSTRAINT "Patrocinador_pkey" PRIMARY KEY (id);


--
-- Name: Presidente Presidente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Presidente"
    ADD CONSTRAINT "Presidente_pkey" PRIMARY KEY (id);


--
-- Name: QuemSomosSection QuemSomosSection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuemSomosSection"
    ADD CONSTRAINT "QuemSomosSection_pkey" PRIMARY KEY (id);


--
-- Name: Servico Servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Servico"
    ADD CONSTRAINT "Servico_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Associado_cnpj_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Associado_cnpj_key" ON public."Associado" USING btree (cnpj);


--
-- Name: Associado_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Associado_userId_key" ON public."Associado" USING btree ("userId");


--
-- Name: Evento_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Evento_slug_key" ON public."Evento" USING btree (slug);


--
-- Name: InscricaoEvento_eventoId_associadoId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InscricaoEvento_eventoId_associadoId_key" ON public."InscricaoEvento" USING btree ("eventoId", "associadoId");


--
-- Name: Noticia_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Noticia_slug_key" ON public."Noticia" USING btree (slug);


--
-- Name: QuemSomosSection_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "QuemSomosSection_key_key" ON public."QuemSomosSection" USING btree (key);


--
-- Name: Servico_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Servico_slug_key" ON public."Servico" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Associado Associado_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Associado"
    ADD CONSTRAINT "Associado_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CertificadoSolicitacao CertificadoSolicitacao_associadoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CertificadoSolicitacao"
    ADD CONSTRAINT "CertificadoSolicitacao_associadoId_fkey" FOREIGN KEY ("associadoId") REFERENCES public."Associado"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CertificadoSolicitacao CertificadoSolicitacao_eventoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CertificadoSolicitacao"
    ADD CONSTRAINT "CertificadoSolicitacao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES public."Evento"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Evento Evento_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Evento"
    ADD CONSTRAINT "Evento_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: HomeSlide HomeSlide_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HomeSlide"
    ADD CONSTRAINT "HomeSlide_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InscricaoEvento InscricaoEvento_associadoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InscricaoEvento"
    ADD CONSTRAINT "InscricaoEvento_associadoId_fkey" FOREIGN KEY ("associadoId") REFERENCES public."Associado"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InscricaoEvento InscricaoEvento_eventoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InscricaoEvento"
    ADD CONSTRAINT "InscricaoEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES public."Evento"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Noticia Noticia_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Noticia"
    ADD CONSTRAINT "Noticia_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Servico Servico_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Servico"
    ADD CONSTRAINT "Servico_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 5ZVxe2sY00Hu14825gODxOyd55fCmNr7bb7EKaSvBIYVZVaxCPFIigiuRMZqT5c

