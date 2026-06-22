--
-- PostgreSQL database dump
--

\restrict xJGbMydH5dzcPOSUg7cEcyVMtVBjWhG7PgA7kmKaPOCyt38u6abTAlGUdYVsc3e

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

-- *not* dropping schema, since initdb creates it
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
    destaque boolean DEFAULT false NOT NULL
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
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Noticia" OWNER TO postgres;

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
    destaque boolean DEFAULT false NOT NULL
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



--
-- Data for Name: CertificadoSolicitacao; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Diretor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Diretor" VALUES ('6cacaac5-18d7-43c5-ac91-6787522ff95b', 'MARIA DO CARMO XIMENES DE PINHO', 'HIPERNACIONAL', 'PRESIDENTE', NULL, 'Empresária com vasta experiência no varejo e gestão corporativa, focada na inovação do comércio de Crateús.', 1, '2026-06-18 16:31:01.882', '2026-06-18 16:31:01.882');
INSERT INTO public."Diretor" VALUES ('3f2bc3b8-0af5-444e-b8e5-96d49d776710', 'FRANCISCO ROBERTO LIMA E SILVA', 'GRÁFICA CRATEÚS', 'I VICE-PRESIDENTE', NULL, '', 2, '2026-06-18 16:31:09.132', '2026-06-18 16:31:09.132');
INSERT INTO public."Diretor" VALUES ('6ba3a41f-3740-443b-b718-cd1cfdb94643', 'ANTONIO OSVALDO PONTES DE MELO', 'TINA CONDIMENTOS', 'I SECRETÁRIO', NULL, '', 3, '2026-06-18 16:31:13.644', '2026-06-18 16:31:13.644');
INSERT INTO public."Diretor" VALUES ('46fd3bc7-1a2e-423d-8e7f-8443915e9e53', 'ANTÔNIO WAGNER CLAUDINO SALES', 'RANCHEIRA W&S', 'II SECRETÁRIO', NULL, '', 4, '2026-06-18 16:31:18.186', '2026-06-18 16:31:18.186');
INSERT INTO public."Diretor" VALUES ('98e88e41-fe81-4e5c-8ef1-0560467425c2', 'EDMILSON ARIMATEIA NORTE', 'MARCONORTE', 'I TESOUREIRO', NULL, '', 5, '2026-06-18 16:31:23.715', '2026-06-18 16:31:23.715');
INSERT INTO public."Diretor" VALUES ('0adce432-a62f-4a4a-a5cc-88f2f16497a6', 'ANTONIA LUCINEIDE LEITÃO MACHADO', 'DISTRIBUIDORA DE ÁGUA E CIMENTO', 'I DIRETOR SOCIAL', NULL, '', 6, '2026-06-18 16:31:27.693', '2026-06-18 16:31:27.693');
INSERT INTO public."Diretor" VALUES ('82580036-40b0-4e72-b69d-b30b6d7f7675', 'AGOSTINHO MORAES RODRIGUES', 'CASA GOSTINHO', 'II RELAÇÕES PÚBLICAS', NULL, '', 7, '2026-06-18 16:31:32.122', '2026-06-18 16:31:32.122');
INSERT INTO public."Diretor" VALUES ('196f0d4b-fff0-4c1e-8c27-ba52da27563d', 'MARCOS ALBERTO SOARES GOIANO', 'COMERCIAL GOIANO', 'CONSELHO FISCAL', NULL, '', 8, '2026-06-18 16:31:35.783', '2026-06-18 16:31:35.783');
INSERT INTO public."Diretor" VALUES ('0817ae6e-9970-49a7-8274-460cf78b90dd', 'ARNALDO RODRIGUES SALES', 'VISUALLE', 'CONSELHO FISCAL', NULL, '', 9, '2026-06-18 16:31:40.446', '2026-06-18 16:31:40.446');
INSERT INTO public."Diretor" VALUES ('dd1de2e8-6572-465f-9a53-9f993d680788', 'MARIA ROZELINA PEREIRA DE SOUSA', 'MERCADINHO SR. FRANSQUINHO', 'CONSELHO FISCAL', NULL, '', 10, '2026-06-18 16:31:44.598', '2026-06-18 16:31:44.598');
INSERT INTO public."Diretor" VALUES ('25bd6944-ea8b-4a8e-a475-f08ac3ee6e67', 'ANTONIO LUÍZ BENEVIDES SALES', 'MERCANSALES', 'CONSELHO CONSULTIVO', NULL, '', 11, '2026-06-18 16:31:48.465', '2026-06-18 16:31:48.465');


--
-- Data for Name: Evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Evento" VALUES ('35755fe9-e36f-4cab-8d53-21d1c3c5f436', '150 Anos da ACIC Crateús', '150-anos-da-acic-crateus', '{"blocks": [{"type": "paragraph", "content": "Em 2026, a Associação Comercial e Industrial de Crateús (ACIC) celebra 150 anos de história, consolidando-se como uma das mais importantes entidades de representação empresarial do interior do Ceará."}, {"type": "paragraph", "content": "Fundada com o objetivo de fortalecer o comércio local e impulsionar o desenvolvimento econômico da região, a ACIC percorreu um longo caminho de conquistas, desafios e transformações, sempre ao lado dos empresários e empreendedores crateusenses."}, {"type": "heading", "level": 3, "content": "Uma trajetória de conquistas", "className": "evento-h3"}, {"type": "paragraph", "content": "Ao longo de 150 anos, a ACIC atuou ativamente na defesa dos interesses do setor produtivo local, promovendo eventos, capacitações, feiras de negócios e ações de desenvolvimento empresarial que beneficiaram milhares de comerciantes e empresários da região."}, {"type": "heading", "level": 3, "content": "Programação das Comemorações", "className": "evento-h3"}, {"type": "paragraph", "content": "<strong>Exposição Histórica:</strong> Galeria fotográfica e documental com registros dos 150 anos de atuação da ACIC Crateús."}, {"type": "paragraph", "content": "<strong>Jantar Comemorativo:</strong> Celebração especial com autoridades, empresários e parceiros da entidade."}, {"type": "paragraph", "content": "<strong>Fórum Empresarial:</strong> Debates e palestras sobre o futuro do empreendedorismo na região."}, {"type": "paragraph", "content": "<strong>Premiação:</strong> Reconhecimento de empresas e personalidades que contribuíram para o desenvolvimento comercial de Crateús."}, {"type": "heading", "level": 3, "content": "Participe desta história", "className": "evento-h3"}, {"type": "paragraph", "content": "As comemorações dos 150 anos são uma oportunidade única de celebrar a história da nossa cidade e reafirmar o compromisso da ACIC com o desenvolvimento econômico e social de Crateús e região. Fique atento às redes sociais para mais informações sobre a programação completa."}]}', 'Sede da ACIC - Crateús, CE', '2026-08-15 19:00:00', NULL, 200, 'https://cacb.org.br/wp-content/uploads/2024/01/hero-servicos-registro-de-marca.jpg', 'PUBLISHED', 'eaf50882-3696-4d9b-ae63-96ff47326155', '2026-06-18 10:35:41.473', '2026-06-18 10:35:41.473', false);


--
-- Data for Name: HomeSlide; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."HomeSlide" VALUES ('95091093-fa96-44e1-bc4c-8078e3e5115a', 'Fortalecendo o comércio de Crateús', 'Há décadas unindo empresários e impulsionando a economia regional', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80', NULL, 'PUBLISHED', 1, 'eaf50882-3696-4d9b-ae63-96ff47326155', '2026-06-18 17:30:04.75', '2026-06-18 17:30:04.75');
INSERT INTO public."HomeSlide" VALUES ('cf6d4316-dbb5-447f-af6b-0912a6ec1303', 'Conectando empresários de todos os setores', 'Comércio, indústria, agropecuária e serviços em um só lugar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80', NULL, 'PUBLISHED', 2, 'eaf50882-3696-4d9b-ae63-96ff47326155', '2026-06-18 17:30:11.113', '2026-06-18 17:30:11.113');
INSERT INTO public."HomeSlide" VALUES ('1633df56-5912-427b-89e5-15a2cdf49c33', 'Sua voz no desenvolvimento regional', 'Representação política e institucional para o empresário cearense', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&q=80', NULL, 'PUBLISHED', 3, 'eaf50882-3696-4d9b-ae63-96ff47326155', '2026-06-18 17:30:14.294', '2026-06-18 17:30:14.294');


--
-- Data for Name: InscricaoEvento; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Noticia; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Presidente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Presidente" VALUES ('a4ba6076-c8fd-46d4-a277-947d9b56eb4d', 'Francisco Roberto Lima e Silva', 2017, 2023, 'http://localhost:3000/uploads/galeriaPresidentes/FcoRobertoLimaeSilva(2017-2023).jpeg', 'Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal.', 1, '2026-06-18 16:47:26.099', '2026-06-18 16:47:26.099');
INSERT INTO public."Presidente" VALUES ('476c5d69-11c3-4f8f-8602-a029c6b06cc8', 'Antônio Luiz Benevides Sales', 2015, 2017, 'http://localhost:3000/uploads/galeriaPresidentes/AntLuizBenevideSales(2015-2017).jpeg', '', 2, '2026-06-18 16:48:18.131', '2026-06-18 16:48:18.131');
INSERT INTO public."Presidente" VALUES ('41a8d26d-528b-4317-88c2-1f661d7e6bc0', 'José de Melo Cavalcante', 1999, 2003, 'http://localhost:3000/uploads/galeriaPresidentes/JosédeMeloCavalcante(1999-2001)(2001-2003).jpeg', '', 3, '2026-06-18 16:48:27.803', '2026-06-18 16:48:27.803');
INSERT INTO public."Presidente" VALUES ('d91bcd62-d919-4eb2-92f2-76d541d3ea5f', 'Fernando Antônio Aguiar Albuquerque', 1995, 1997, 'http://localhost:3000/uploads/galeriaPresidentes/FernandoAntAguiarAlbuquerque(1995-1997).jpeg', '', 4, '2026-06-18 16:48:30.733', '2026-06-18 16:48:30.733');
INSERT INTO public."Presidente" VALUES ('69eead59-2614-4a18-bea6-25f9c1d6b7d5', 'José Airton Melo Aguiar', 1991, 1993, 'http://localhost:3000/uploads/galeriaPresidentes/JoséAirtonMeloAguiar(1991-1993).jpeg', '', 5, '2026-06-18 16:48:33.711', '2026-06-18 16:48:33.711');
INSERT INTO public."Presidente" VALUES ('a63817c7-2490-40b3-8d2f-c2c1850a9043', 'Antônio Soares Martins', 1984, 1991, 'http://localhost:3000/uploads/galeriaPresidentes/AntSoaresMartins(1984-1986)e(1986-1991).jpeg', '', 6, '2026-06-18 16:48:36.187', '2026-06-18 16:48:36.187');
INSERT INTO public."Presidente" VALUES ('91b45161-0c07-4dff-be53-09f857c3116f', 'Edmundo Pinto Filho', 1982, 1984, 'http://localhost:3000/uploads/galeriaPresidentes/EdmundoPintoFilho(1982-1984).jpeg', '', 7, '2026-06-18 16:48:38.818', '2026-06-18 16:48:38.818');
INSERT INTO public."Presidente" VALUES ('532bfbe0-96f9-44f7-bdfb-0904f391d312', 'José Américo Moreira', 1978, 1980, 'http://localhost:3000/uploads/galeriaPresidentes/JoséAméricoMoreira(1978-1980).jpeg', '', 8, '2026-06-18 16:48:44.693', '2026-06-18 16:48:44.693');
INSERT INTO public."Presidente" VALUES ('4595022a-0f70-4ebb-8618-81f65da2ae60', 'Raimundo Bezerra de Melo', 1976, 1978, 'http://localhost:3000/uploads/galeriaPresidentes/RaimundoBezerradeMelo(1976-1978).jpeg', '', 9, '2026-06-18 16:48:47.323', '2026-06-18 16:48:47.323');
INSERT INTO public."Presidente" VALUES ('26c65487-8817-4ced-ae1d-1a361f4ace49', 'Raimundo Soares Resende', 1974, 1976, 'http://localhost:3000/uploads/galeriaPresidentes/RaimundoSoaresResende(1974-1976).jpeg', '', 10, '2026-06-18 16:48:49.768', '2026-06-18 16:48:49.768');
INSERT INTO public."Presidente" VALUES ('4f7e1e23-56d1-4877-8104-df455b52abe4', 'Boanerges Cisne Sales', 1971, 1974, 'http://localhost:3000/uploads/galeriaPresidentes/BoanergesCisneSales(1971-1974).jpeg', '', 11, '2026-06-18 16:48:52.427', '2026-06-18 16:48:52.427');
INSERT INTO public."Presidente" VALUES ('ce641a38-3ba8-4773-b3c8-04b747a12bc1', 'João José de Castro', 1968, 1971, 'http://localhost:3000/uploads/galeriaPresidentes/JoãoJosédeCastro(1968-1971).jpeg', '', 12, '2026-06-18 16:48:55.144', '2026-06-18 16:48:55.144');
INSERT INTO public."Presidente" VALUES ('8062ef9e-8308-4fad-8988-755514af5ba5', 'Francisco de Assis Machado', 1964, 1968, 'http://localhost:3000/uploads/galeriaPresidentes/FcodeAssisMachado(1964-1968).jpeg', '', 13, '2026-06-18 16:48:57.53', '2026-06-18 16:48:57.53');
INSERT INTO public."Presidente" VALUES ('dcf3e0c5-8320-4a78-98b8-7d696dfa09ef', 'Antônio de Melo Rosa', 1961, 1964, 'http://localhost:3000/uploads/galeriaPresidentes/AntDeMeloRosa(1961-1964).jpeg', '', 14, '2026-06-18 16:48:59.797', '2026-06-18 16:48:59.797');
INSERT INTO public."Presidente" VALUES ('b3be41ff-e292-40fc-bd24-244e7988defd', 'Armando Marques Mourão', 1958, 1961, 'http://localhost:3000/uploads/galeriaPresidentes/ArmandoMarquesMourão(1958-1961).jpeg', '', 15, '2026-06-18 16:49:02.58', '2026-06-18 16:49:02.58');
INSERT INTO public."Presidente" VALUES ('55005490-1ee6-4d9f-a1af-0e949e121014', 'Pedro de Miranda Melo', 1954, 1958, 'http://localhost:3000/uploads/galeriaPresidentes/PedrodeMirandaMelo(1954-1958).jpeg', '', 16, '2026-06-18 16:49:06.493', '2026-06-18 16:49:06.493');
INSERT INTO public."Presidente" VALUES ('f82f5d9a-2671-4ffe-826d-5a3ea32e77ff', 'Bento Coutinho de Macedo', 1951, 1954, 'http://localhost:3000/uploads/galeriaPresidentes/BentoCoutinhodMacedo(1951-1954).jpeg', '', 17, '2026-06-18 16:49:09.496', '2026-06-18 16:49:09.496');
INSERT INTO public."Presidente" VALUES ('289174f3-a4f9-4d09-a6d9-c81d6bda7e89', 'Julio Evaristo de Paiva', 1947, 1951, 'http://localhost:3000/uploads/galeriaPresidentes/JulioEvaristodePaiva(1947-1951).jpeg', '', 18, '2026-06-18 16:49:11.888', '2026-06-18 16:49:11.888');
INSERT INTO public."Presidente" VALUES ('745659f9-b790-4d2f-b04e-6150c7f5b095', 'Francisco Melo Lima', 1943, 1947, 'http://localhost:3000/uploads/galeriaPresidentes/FcoMeloLima(1943-1947).jpeg', '', 19, '2026-06-18 16:49:14.966', '2026-06-18 16:49:14.966');
INSERT INTO public."Presidente" VALUES ('0dea6df1-9cf9-42c8-a6ea-18c680c19c7e', 'Manoel Evaristo de Paiva', 1939, 1943, 'http://localhost:3000/uploads/galeriaPresidentes/ManoelEvaristodePaiva(1939-1943).jpeg', '', 20, '2026-06-18 16:49:17.628', '2026-06-18 16:49:17.628');
INSERT INTO public."Presidente" VALUES ('c6dde0b4-cb57-4e7b-bcfa-ed2ba56a037d', 'Pedro Machado da Ponte', 1935, 1939, 'http://localhost:3000/uploads/galeriaPresidentes/PedroMachadodaPonte(1935-1939).jpeg', '', 21, '2026-06-18 16:49:20.175', '2026-06-18 16:49:20.175');
INSERT INTO public."Presidente" VALUES ('7af51137-4d37-4a09-98af-d0a40e3879dc', 'Abel Alcanfor Soares', 1931, 1935, 'http://localhost:3000/uploads/galeriaPresidentes/AbelAlcanforSoares(1931-1935).jpeg', '', 22, '2026-06-18 16:49:22.635', '2026-06-18 16:49:22.635');
INSERT INTO public."Presidente" VALUES ('04157a3d-d6ca-4d3e-9314-83baa7efa18f', 'Firmino Rocha Aguiar', 1929, 1931, 'http://localhost:3000/uploads/galeriaPresidentes/FirminoRochaAguiar(1929-1931).jpeg', '', 23, '2026-06-18 16:49:25.11', '2026-06-18 16:49:25.11');
INSERT INTO public."Presidente" VALUES ('797d9921-ea77-4bfa-95ab-5ce67d820fa0', 'Francisco Mariano Cavalcante', 1925, 1929, 'http://localhost:3000/uploads/galeriaPresidentes/FcoMarianoCavalcante(1925-1929).jpeg', 'Primeira mulher a assumir a presidência. O seu mandato foi marcado pela criação do CMEC estadual e pelo incentivo massivo ao empreendedorismo feminino.', 24, '2026-06-18 16:49:27.885', '2026-06-18 16:49:27.885');
INSERT INTO public."Presidente" VALUES ('901293ae-17aa-4cac-8632-1672a9a639f4', 'Auton Aragão', 1921, 1925, 'http://localhost:3000/uploads/galeriaPresidentes/AutonAragao(1921-1925).jpeg', 'Liderou a associação em um momento de expansão digital, sendo o principal responsável pela criação dos primeiros portais de integração entre as federações.', 25, '2026-06-18 16:49:30.918', '2026-06-18 16:49:30.918');


--
-- Data for Name: QuemSomosSection; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."QuemSomosSection" VALUES ('a2d5a42b-a5f2-4e6c-aba7-f0cd6ea35ed0', 'quem-somos', 'Quem Somos', '{"blocks": [{"type": "heading", "level": 1, "content": "A CACB", "className": "institutional-title"}, {"type": "section", "blocks": [{"type": "paragraph", "content": "A Confederação das Associações Comerciais e Empresariais do Brasil (CACB) é um coletivo empresarial que busca contribuir para o desenvolvimento econômico do país, representando 27 Federações, 2300 Associações Comerciais e Empresariais e 2 milhões de empresas em todo o território nacional."}, {"type": "paragraph", "content": "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais."}]}, {"type": "section", "blocks": [{"type": "heading", "level": 2, "content": "Histórico", "className": "institutional-subtitle"}, {"type": "paragraph", "content": "A CACB é a entidade de representação empresarial mais antiga das Américas. Sua história teve início com a fundação da Associação Comercial da Bahia, em 15 de julho de 1811, atendendo a três desejos: dos comerciantes, para terem um local condigno onde pudessem se reunir regularmente e aí realizar seus negócios, como já vinham fazendo há anos, na própria Cidade Baixa; do vice-rei do Brasil, D. Marcos de Noronha e Britto, VIII Conde dos Arcos de Val de Vez, interessado no desenvolvimento da província que governava, sede do maior porto do hemisfério sul à época, já aberto, desde 1808, às “nações amigas”; e do Príncipe Regente, D. João VI, de promover o progresso da Colônia, sede provisória da Corte Portuguesa."}, {"alt": "Fachada histórica da Associação Comercial da Bahia", "url": "https://cacb.org.br/wp-content/uploads/2024/03/foto-historia-sede-associacao-acb-bahia.jpg", "type": "figure", "caption": "Associação Comercial da Bahia, a primeira da história, cujas instalações são tombadas pelo Instituto do Patrimônio Histórico e Artístico Nacional – IPHAN."}, {"type": "paragraph", "content": "As associações de Norte a Sul do país tiveram importante papel na história do Brasil e na definição e encaminhamento das demandas dos empresários. A Associação Comercial de Alagoas, por exemplo, chegou a controlar a exportação do açúcar no século XIX."}, {"type": "paragraph", "content": "O termo <em>comercial</em>, presente na nomenclatura destas associações vem de transação comercial, estas que, in 1811, eram feitas no local onde a ACBahia foi criada. A sede da Associação passou a centralizar a realização de negócios de diversos produtores e produtos, fomentando o comércio local da época."}, {"type": "paragraph", "content": "Devido ao valor histórico do termo “comercial”, ele foi mantido e, até hoje, serve para dar nome às entidades da rede CACB em todo o país. Engana-se, no entanto, quem pensa que a representatividade do Sistema se limita apenas ao comércio."}, {"type": "paragraph", "content": "Pelo contrário! As Associações Comerciais representam empresários dos mais variados setores, como do próprio comércio ou de serviços, indústria, agronegócio, entre outros. Além de defenderem os interesses dos empresários junto ao governo, as ACEs desenvolvem serviços para a classe, como capacitações, assessoria jurídica, planos de saúde, certificados de origem, certificado digital, mediação e arbitragem, entre outros."}]}, {"url": "https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf", "text": "📄 Acesse aqui o estatuto da CACB", "type": "pdfLink", "className": "institutional-pdf-link"}]}', 'PUBLISHED', 1, '2026-06-18 10:47:20.072', '2026-06-18 10:47:20.072');
INSERT INTO public."QuemSomosSection" VALUES ('eb78c880-9a1f-490a-ac5a-f319f75837ba', 'cmec', 'CMEC', '{"blocks": [{"type": "heading", "level": 1, "content": "Conselho da Mulher Empreendedora e da Cultura", "className": "institutional-title"}, {"alt": "Banner oficial do CMEC Nacional", "url": "https://cacb.org.br/wp-content/uploads/2022/09/CMEC_NOVO-LOGO_Nacional-Padrao-2.png", "type": "image", "className": "institutional-banner"}, {"type": "section", "blocks": [{"type": "paragraph", "content": "O Conselho Nacional da Mulher Empreendedora e da Cultura (CMEC Nacional), é um órgão da Confederação das Associações Comerciais e Empresariais do Brasil (CACB), criado em 24 de abril de 2002, em Brasília, pelo Conselho Diretor desta entidade. A primeira prioridade do CMEC é estimular e apoiar a implantação dos conselhos estaduais, objetivando disseminar o Ideal Empreendedor, difundindo e promovendo o Associativismo como base de sustentação nacional."}, {"type": "paragraph", "content": "A proposta do CMEC é trabalhar intensamente para promover a integração de lideranças femininas, expandindo os contatos do CMEC com as diversas organizações empresariais de todos os estados brasileiros e de outros países."}, {"type": "paragraph", "content": "Com essa missão, o CMEC atua com uma visão pró-ativa, de forma a potencializar a mulher criando oportunidades de aprimoramento profissional, possibilitando a ampliação da sua área de atuação, promovendo uma capacitação cada vez maior e procurando fazer com que ela atue em um competitivo mercado de trabalho."}]}, {"type": "section", "blocks": [{"id": "titulo-conquistas", "type": "heading", "level": 2, "content": "Nossas Conquistas", "className": "institutional-subtitle"}, {"type": "paragraph", "content": "Desde sua instituição, o Conselho obteve importantes conquistas, entre eles o Programa Internacional para Formação de Liderança, o Líder Mulher – Lapidando Diamantes do Sebrae e a realização do XIV Congresso Ibero-Americano das Mulheres Empresárias, que ocorreu entre os dias 19 e 23 de outubro de 2003, na cidade de Araxá (MG), a participação na 56ª sessão da Commission sobre o Status da Mulher na ONU e a reunião com a Chefe de Gabinete da Secretaria de Assuntos Globais das Mulheres, Anita Botti."}, {"type": "paragraph", "style": {"marginTop": "24px"}, "content": "Para saber mais, acesse o site do CMEC <a href=''#'' class=''institutional-link''>clicando aqui</a>."}]}, {"type": "gallery", "images": [{"alt": "Reunião de lideranças femininas do CMEC", "url": "https://cacb.org.br/wp-content/uploads/2025/01/Conselho-executivo-CMEC-2025.jpg"}, {"alt": "Palestra sobre empreendedorismo feminino", "url": "https://cacb.org.br/wp-content/uploads/2023/10/Conselho-CMEC-outubro-2023-2.jpeg"}], "className": "institutional-gallery"}]}', 'PUBLISHED', 2, '2026-06-18 10:47:31.187', '2026-06-18 10:47:31.187');
INSERT INTO public."QuemSomosSection" VALUES ('26beff3a-a32e-4958-8eb1-6cae6ff41711', 'estatuto', 'Estatuto', '{"blocks": [{"type": "heading", "level": 1, "content": "Estatuto da CACB", "className": "institutional-title"}, {"type": "section", "blocks": [{"type": "paragraph", "content": "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais."}, {"type": "paragraph", "content": "Para <a href=''https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf'' target=''_blank'' rel=''noopener noreferrer'' style=''color: #0266b0; font-weight: bold; text-decoration: none;''>baixar o estatuto em PDF clique aqui</a>. Se preferir você pode ver o documento que está disponibilizado a seguir:"}]}, {"url": "https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf", "type": "pdfEmbed"}]}', 'PUBLISHED', 3, '2026-06-18 10:47:37.538', '2026-06-18 10:47:37.538');
INSERT INTO public."QuemSomosSection" VALUES ('590cd355-43f1-4d9c-96d6-56dd670ada4b', 'contatos', 'Contatos', '{"blocks": [{"type": "paragraph", "content": "<strong>Presidente</strong><br/>Alfredo Cotait Neto<br/>61 – 3321.1311<br/><a href=''mailto:presidente@cacb.org.br'' class=''institutional-link''>presidente@cacb.org.br</a>"}, {"type": "paragraph", "content": "<strong>Superintendente</strong><br/>Carlos Rezende<br/>61 – 3321.1311<br/><a href=''mailto:rezende@cacb.org.br'' class=''institutional-link''>rezende@cacb.org.br</a>"}, {"type": "paragraph", "content": "<strong>Assessora da Diretoria</strong><br/>Ana Paula Passos<br/>61 – 3321.1311<br/><a href=''mailto:ana.passos@cacb.org.br'' class=''institutional-link''>ana.passos@cacb.org.br</a>"}, {"type": "paragraph", "content": "<strong>Dúvidas sobre proteção de dados</strong><br/><a href=''mailto:protecaodedados@cacb.org.br'' class=''institutional-link''>protecaodedados@cacb.org.br</a>"}]}', 'PUBLISHED', 4, '2026-06-18 10:47:43.024', '2026-06-18 10:47:43.024');
INSERT INTO public."QuemSomosSection" VALUES ('a0171236-c88d-4709-8dc8-4ab4f911d486', 'diretoria', 'Diretoria', '{"blocks": [{"type": "paragraph", "content": "Conheça a composição completa da nossa diretoria executiva, conselhos fiscais e consultivos que atuam em prol do ecossistema empresarial de Crateús."}]}', 'PUBLISHED', 5, '2026-06-18 10:47:52.756', '2026-06-18 10:47:52.756');
INSERT INTO public."QuemSomosSection" VALUES ('6e62c11a-847b-43a9-9ea8-a60135ac80d3', 'galeria-presidentes', 'Galeria de Presidentes', '{"blocks": [{"type": "paragraph", "content": "Conheça os líderes que conduziram a nossa instituição ao longo dos anos, deixando seu legado e contribuindo ativamente para o fortalecimento do associativismo crateuense."}]}', 'PUBLISHED', 6, '2026-06-18 16:52:10.173', '2026-06-18 16:52:10.173');


--
-- Data for Name: Servico; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Servico" VALUES ('d0b3a864-1ca4-4567-868b-1bcb19ffa2af', 'Registro de Marcas, Softwares e Patentes', 'registro-de-marcas-softwares-e-patentes', 'Tenha total segurança para investir nos seus negócios.', '{"blocks": [{"type": "paragraph", "content": "O serviço de registro de marcas é importante para dar segurança às empresas no que tange à gestão da imagem dos negócios. Através dele, as Associações Comerciais de todo o país poderão oferecer o registro de marcas, softwares e patentes, o que abrange não apenas o logotipo da empresa, mas também dos produtos e serviços oferecidos por ela."}, {"type": "paragraph", "content": "A marca é um dos principais patrimônios de uma empresa e, quando bem cuidada, pode, inclusive, gerar lucros. O registro oficial da marca, além de evitar problemas jurídicos, também dá ao empresário segurança para investir no marketing da empresa. Nesse sentido, o AC Marcas oferece pesquisa, monitoramento, registro e renovação de marcas, softwares e patentes, tudo no mesmo pacote, por meio do suporte de especialistas qualificados, gestão online, com credibilidade e confiança."}, {"type": "heading", "level": 3, "content": "Passo a passo para registrar sua marca:", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "<strong>BUSCA DE MARCA:</strong> Uma pesquisa é realizada no INPI para verificar se a sua marca poderá ser registrada."}, {"type": "paragraph", "content": "<strong>INÍCIO DO PROCESSO:</strong> Se a busca apontar que é viável, é cobrada uma taxa única (inclusas a busca e a GRU, exigida pelo INPI), e o processo de solicitação de registro da sua marca junto ao INPI é iniciado."}, {"type": "paragraph", "content": "<strong>AVALIAÇÃO:</strong> A solicitação é avaliada pelo INPI e nós fazemos todo o acompanhamento."}, {"type": "paragraph", "content": "<strong>APROVAÇÃO:</strong> Com a aprovação da solicitação, o cliente paga a taxa final diretamente ao INPI, sob orientação do ACMarcas, e o registro da sua marca é concedido."}, {"type": "paragraph", "content": "<strong>VALIDADE:</strong> O registro da sua marca tem validade de dez anos e você pode fazer a renovação com o ACMarcas."}, {"type": "heading", "level": 3, "content": "Por que fazer o registro da sua marca com o ACMarcas?", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "• Melhores custos e parcelamento em até 10x vezes para Associados.<br/>• Não cobramos mensalidades e nem anuidades pelo registro.<br/>• Associados da AC ganham descontos especiais.<br/>• Confiabilidade de ser um serviço da Associação Comercial, garantindo mais segurança para o seu processo.<br/>• Todo o procedimento é realizado por especialistas qualificados.<br/>• Atuamos desde a pesquisa de viabilidade até o deferimento da marca.<br/>• Fazemos o controle de prazos por meio da tecnologia, facilitando o acompanhamento do processo.<br/>• Informações e orientações de atendimento online e presencial.<br/>• As ACEs interessadas em levar o AC Marcas ao seu município, devem entrar em contato com a Federação do seu estado para solicitar o agendamento de uma reunião. No caso das Federações, o contato deve ser feito diretamente com a CACB."}, {"type": "heading", "level": 3, "content": "Parceiro", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "O serviço será oferecido em parceria com o Escritório de Marcas & Patentes da Associação Comercial (AC Marcas), que intermedeia as comunicações durante o processo de registro de marcas de empresas de todos os portes e tipos jurídicos."}, {"text": "O serviço vai promover o acesso aos institutos de propriedade intelectual, incluindo o registro de marcas, softwares e patentes para empresas, em especial os Microempreendedores Individuais (MEIs) e pequenas empresas.", "type": "imageTextHighlight", "title": "Marca conhecida é marca registrada", "imageUrl": "https://cacb.org.br/wp-content/uploads/2024/01/hero-servicos-registro-de-marca.jpg"}, {"type": "heading", "level": 3, "content": "FAQs", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "<strong>Qual a diferença entre registro de marca, patente e software?</strong><br/>O registro de marca serve para associar a marca aos seus produtos e serviços, garantindo que não seja copiada. Já o Registro de Patentes protege o próprio produto, tecnologia ou processo criado por você ou pela sua empresa, que apresente um diferencial de mercado ou uma inovação. E o Registro de Software é depositado em um banco de propriedade, que recebe um protocolo que comprova esse depósito."}, {"type": "paragraph", "content": "<strong>Porque eu preciso registrar minha marca?</strong><br/>Registrar sua marca, patente ou software torna o seu projeto (prestação de serviços, produto) exclusivo dentro do segmento que está inserido, não podendo, assim, possuir imitações ou aproximações ao Registro, que não precisa necessariamente ser ligado a uma empresa."}, {"type": "paragraph", "content": "<strong>Preciso pagar para registrar minha marca ou patente?</strong><br/>Sim, todo processo de registro tem pelo menos duas taxas: a final e a inicial. A inicial é a Guia de Recolhimento da União (GRU), que é emitida no momento da solicitação (que já está inclusa no serviço prestado pelo ACMarcas). Já a final é paga diretamente ao INPI, quando o processo é aprovado, com orientação do ACMarcas."}, {"type": "paragraph", "content": "<strong>Sou MEI ou MPE, mesmo assim, preciso registrar minha marca?</strong><br/>Sim, inclusive microempreendedores individuais e microempresas podem registrar suas marcas."}, {"type": "paragraph", "content": "<strong>Quanto tempo leva para obter o meu registro?</strong><br/>O prazo varia muito em função das etapas do processo, podendo chegar a dois anos. No entanto, o ACMarcas faz o acompanhamento de todo o processo e informa o cliente a cada etapa."}, {"type": "paragraph", "content": "<strong>Quantas etapas existem dentro do processo de concessão de marca?</strong><br/>Não se trata de um processo ágil e imediato. Por essa razão, o apoio de uma consultoria especializada é imprescindível, inclusive para não perder o prazo exigido por algumas delas. As etapas, normalmente, são: pedido Inicial, exame formal, publicação para oposição, possibilidade de exigência formal, exame técnico, possibilidade de recurso, deferimento e pagamento, cumprimento do prazo ordinário e concessão válida por dez anos, com possibilidade de renovação."}]}', '📜', 'https://cacb.org.br/wp-content/uploads/2024/01/capas-servicos-registro-de-marca.jpg', 'PUBLISHED', 'eaf50882-3696-4d9b-ae63-96ff47326155', '2026-06-18 10:39:22.67', '2026-06-18 10:39:22.67', true);
INSERT INTO public."Servico" VALUES ('85edad2c-528e-4603-ad2b-825182138782', 'Certificado de Origem', 'certificado-de-origem', 'Caminho livre para sua exportação com agilidade', '{"blocks": [{"type": "paragraph", "content": "O Certificado de Origem atesta a origem da mercadoria, uma vez cumpridas as regras estabelecidas entre os países que fazem parte do acordo, proporcionando ao importador o benefício de redução ou isenção do imposto de importação, sendo uma das vantagens comerciais no processo de exportação."}, {"type": "heading", "level": 3, "content": "Certificado de Origem Preferencial", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "O Certificado de Origem Preferencial é um documento que atesta a origem da mercadoria no país exportador, ao qual cumpre com as regras estabelecidas entre os países membros. Os elementos principais das regras de origem são: critérios de origem, condições de expedição e de transporte e provas documentais. O objetivo é dar competitividade aos exportadores brasileiros, oferecendo ao importador do país membro a redução ou isenção do imposto de importação."}, {"type": "heading", "level": 3, "content": "Certificado de Origem Não Preferencial", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "Certificado de Origem Comum – normas de origem não preferencial – conjunto de leis, regulamentos e determinações administrativas de aplicação geral, utilizados para a determinação do país de origem das mercadorias, desde que não relacionados a regimes comerciais contratuais ou autônomos que prevejam a concessão de preferências tarifárias. Este Certificado não oferece uma preferência tarifária de política comercial, mas segue regras de origem para a aplicação de tratamento de nação mais favorecida, direitos antidumping e direitos compensatórios, salvaguardas, exigências de marcação de origem, restrições quantitativas discriminatórias ou quotas tarifárias, estatísticas e compras do setor público, entre outros."}, {"type": "heading", "level": 3, "content": "Certificado de Origem Digital (COD)", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "O sistema ECO da CACB, já homologado pelo MDIC para o projeto COD – Certificado de Origem com assinatura Digital, vem atendendo empresas exportadoras de todo o país de forma ágil, segura, prática e flexível, com poder de decisão próximo e imediato."}, {"type": "heading", "level": 3, "content": "Sistema ECO", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "O sistema ECO proporciona uma conexão online entre todos os seus pontos de certificação, possibilitando resolver qualquer problema que ocorrer em fronteiras. Além disto, possibilita a importação de dados do sistema do prestador (despachante) e ou exportador, através de integração via WebService."}, {"type": "heading", "level": 3, "content": "Sistema Ippex (Faciap)", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "O Instituto de Planejamento e Promoção em Comércio Exterior – Ippex foi criado em 2006, pela Faciap, com o objetivo de ajudar empresas paranaenses a ingressarem no mercado internacional e se manterem competitivas nesse mercado."}, {"type": "paragraph", "content": "A atuação do Ippex no Paraná veio também para complementar o serviço de emissão de Certificado de Origem para exportação já existente na Faciap desde 1999 – federação que representa hoje cerca de 270 associações comerciais e um universo com mais de 50 mil empresas associadas em todo o estado."}, {"type": "paragraph", "content": "Atendendo a mais des de 12 mil clientes, o Ippex já emitiu mais de 500 mil certificados de origem, atestando a origem de mercadorias em mais 200 países."}, {"type": "heading", "level": 3, "content": "Baixe os arquivos de apresentação da parceria:", "className": "servico-detalhe-h3"}, {"url": "https://cacb.org.br/wp-content/uploads/2022/09/Apresentacao_CACB_Ippex-29092022.pdf", "text": "📄 Apresentação CACB", "type": "pdfLink", "className": "institutional-pdf-link"}, {"url": "https://cacb.org.br/wp-content/uploads/2022/09/Apresentacao-Ippex_Faciap-29092022.pdf", "text": "📄 Apresentação Ippex/Faciap", "type": "pdfLink", "className": "institutional-pdf-link"}, {"text": "Garanta a procedência de suas exportações, com uma plataforma segura e ágil para a emissão de Certificado de Origem.", "type": "imageTextHighlight", "title": "O Certificado de Origem garante que o seu produto será bem recebido no exterior.", "imageUrl": "https://cacb.org.br/wp-content/uploads/2023/07/hero-servicos-certificado-de-origem.jpg"}]}', '🌍', 'https://cacb.org.br/wp-content/uploads/2023/07/capas-servicos-certificado-de-origem.jpg', 'PUBLISHED', 'eaf50882-3696-4d9b-ae63-96ff47326155', '2026-06-18 10:39:30.443', '2026-06-18 10:39:30.443', true);
INSERT INTO public."Servico" VALUES ('3a6d3193-7aed-4890-a43c-8f0e4fdbef45', 'Certificado Digital', 'certificado-digital', 'Certificado Digital sem sair de casa', '{"blocks": [{"type": "paragraph", "content": "Ao adquirir o certificado da CACB você fortalece o sistema associativista e as entidades que dão voz aos empresários de todo o país."}, {"type": "paragraph", "content": "Um documento ou contrato assinado com o certificado digital tem o mesmo valor de um documento físico. Por isso, você pode assinar de onde estiver, com rapidez, segurança e confidencialidade. O certificado digital agiliza os processos e reduz muito os custos porque não é mais preciso se deslocar, comprar papel, imprimir, transportar e armazenar os documentos."}, {"type": "paragraph", "content": "Hoje, o certificado é cada vez mais solicitado para acessar os portais dos governos e obter ou enviar documentos. Essa demanda tende a aumentar e quanto mais serviços forem ofertados online, maior é a necessidade de segurança para fazer as transações."}, {"type": "heading", "level": 3, "content": "Certisign", "className": "servico-detalhe-h3"}, {"type": "paragraph", "content": "A Certisign é uma IDtech com mais de duas décadas de atuação no mercado e líder em Certificação Digital. Viabiliza que serviços e transações sejam realizados on-line de maneira segura e com a garantia da identidade dos envolvidos. Por meio de suas soluções, proporciona às pessoas mais tempo e dinheiro, para que possam aproveitar a vida."}, {"text": "Certificado Digital é o seu documento no mundo digital. Ele serve tanto para pessoas físicas, quanto para empresas, e é usado para garantir segurança à transação de dados. O certificado tem validade jurídica e identifica, sem deixar dúvida, quem é a pessoa ou empresa que está assinando.", "type": "imageTextHighlight", "title": "Agilidade e segurança", "imageUrl": "https://cacb.org.br/wp-content/uploads/2023/07/hero-servicos-certificado-digital.jpg"}]}', '💻', 'https://cacb.org.br/wp-content/uploads/2023/07/capas-servicos-certificado-digital.jpg', 'PUBLISHED', 'eaf50882-3696-4d9b-ae63-96ff47326155', '2026-06-18 10:39:38.094', '2026-06-18 10:39:38.094', true);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES ('eaf50882-3696-4d9b-ae63-96ff47326155', 'Administrador ACIC', 'admin@acic.local', '$2b$10$Cg8FBx8m/Vgh54cmTiCUnO6aKcCZIdUC7KyrlYm8zfo8T9Unc376u', 'ADMIN', true, '2026-06-18 10:32:11.958', '2026-06-18 10:32:11.958');


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations VALUES ('661953c0-e069-4dec-ad47-62e09fbf2879', 'fe20df575463e75531652f922a35925ec426f5e177b55ebe586108c239208c46', '2026-06-18 10:29:08.636346+00', '20260609152000_init', NULL, NULL, '2026-06-18 10:29:08.441313+00', 1);
INSERT INTO public._prisma_migrations VALUES ('7679597f-5f38-46bb-8203-67291255122c', '5d2a4b83c6b6f4656f84189281bad7ce8cb0d614117119b5ef2084c7ba40994d', '2026-06-18 10:29:08.648989+00', '20260611170426_add_destaque_flag', NULL, NULL, '2026-06-18 10:29:08.641355+00', 1);
INSERT INTO public._prisma_migrations VALUES ('5cca83f5-acbc-4c8e-a549-51b5bee2504f', 'e217919b18f785798f96c5a3f497c9ee77cd3c1efd6bf3487ca4aaa15715ea9d', '2026-06-18 10:29:08.693665+00', '20260618002945_add_diretor', NULL, NULL, '2026-06-18 10:29:08.65469+00', 1);


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

\unrestrict xJGbMydH5dzcPOSUg7cEcyVMtVBjWhG7PgA7kmKaPOCyt38u6abTAlGUdYVsc3e

