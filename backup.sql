--
-- PostgreSQL database dump
--

\restrict L2v2CVgvVA9lPOSKLglgPpc8YOh1mflBvUwdxfQ6ED7oviPCyfaM0d2YJH26Lfq

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerte; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerte (
    id_alerte integer NOT NULL,
    type character varying NOT NULL,
    message text NOT NULL,
    login_concerne character varying,
    ip character varying,
    vue boolean DEFAULT false NOT NULL,
    date_creation timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.alerte OWNER TO postgres;

--
-- Name: alerte_id_alerte_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerte_id_alerte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerte_id_alerte_seq OWNER TO postgres;

--
-- Name: alerte_id_alerte_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerte_id_alerte_seq OWNED BY public.alerte.id_alerte;


--
-- Name: avis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avis (
    id_avis integer NOT NULL,
    id_client integer NOT NULL,
    id_chambre integer NOT NULL,
    note integer,
    commentaire text,
    date_avis timestamp without time zone DEFAULT now(),
    CONSTRAINT avis_note_check CHECK (((note >= 1) AND (note <= 5)))
);


ALTER TABLE public.avis OWNER TO postgres;

--
-- Name: avis_id_avis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avis_id_avis_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avis_id_avis_seq OWNER TO postgres;

--
-- Name: avis_id_avis_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avis_id_avis_seq OWNED BY public.avis.id_avis;


--
-- Name: chambre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chambre (
    id_chambre integer NOT NULL,
    numero character varying NOT NULL,
    etage integer NOT NULL,
    statut character varying NOT NULL,
    id_type integer NOT NULL,
    image character varying
);


ALTER TABLE public.chambre OWNER TO postgres;

--
-- Name: chambre_id_chambre_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chambre_id_chambre_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chambre_id_chambre_seq OWNER TO postgres;

--
-- Name: chambre_id_chambre_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chambre_id_chambre_seq OWNED BY public.chambre.id_chambre;


--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id_client integer NOT NULL,
    nom character varying NOT NULL,
    prenom character varying NOT NULL,
    telephone character varying NOT NULL,
    email character varying,
    adresse character varying,
    id_utilisateur integer
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_client_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_client_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_id_client_seq OWNER TO postgres;

--
-- Name: client_id_client_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_client_seq OWNED BY public.client.id_client;


--
-- Name: paiement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paiement (
    id_paiement integer NOT NULL,
    montant numeric(10,2) NOT NULL,
    date_paiement timestamp without time zone DEFAULT now() NOT NULL,
    mode character varying NOT NULL,
    id_reservation integer NOT NULL
);


ALTER TABLE public.paiement OWNER TO postgres;

--
-- Name: paiement_id_paiement_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paiement_id_paiement_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paiement_id_paiement_seq OWNER TO postgres;

--
-- Name: paiement_id_paiement_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paiement_id_paiement_seq OWNED BY public.paiement.id_paiement;


--
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    id_reservation integer NOT NULL,
    date_arrivee date NOT NULL,
    date_depart date NOT NULL,
    statut character varying DEFAULT 'en_attente'::character varying NOT NULL,
    date_creation timestamp without time zone DEFAULT now() NOT NULL,
    id_client integer NOT NULL,
    id_chambre integer NOT NULL,
    note integer,
    commentaire text
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- Name: reservation_id_reservation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservation_id_reservation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservation_id_reservation_seq OWNER TO postgres;

--
-- Name: reservation_id_reservation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservation_id_reservation_seq OWNED BY public.reservation.id_reservation;


--
-- Name: type_chambre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_chambre (
    id_type integer NOT NULL,
    libelle character varying NOT NULL,
    description text,
    prix_nuit numeric(10,2) NOT NULL,
    capacite integer NOT NULL
);


ALTER TABLE public.type_chambre OWNER TO postgres;

--
-- Name: type_chambre_id_type_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_chambre_id_type_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_chambre_id_type_seq OWNER TO postgres;

--
-- Name: type_chambre_id_type_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_chambre_id_type_seq OWNED BY public.type_chambre.id_type;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id_utilisateur integer NOT NULL,
    nom character varying NOT NULL,
    prenom character varying NOT NULL,
    login character varying NOT NULL,
    mot_de_passe character varying NOT NULL,
    role character varying NOT NULL
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_utilisateur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateur_id_utilisateur_seq OWNER TO postgres;

--
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_utilisateur_seq OWNED BY public.utilisateur.id_utilisateur;


--
-- Name: alerte id_alerte; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte ALTER COLUMN id_alerte SET DEFAULT nextval('public.alerte_id_alerte_seq'::regclass);


--
-- Name: avis id_avis; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis ALTER COLUMN id_avis SET DEFAULT nextval('public.avis_id_avis_seq'::regclass);


--
-- Name: chambre id_chambre; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chambre ALTER COLUMN id_chambre SET DEFAULT nextval('public.chambre_id_chambre_seq'::regclass);


--
-- Name: client id_client; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id_client SET DEFAULT nextval('public.client_id_client_seq'::regclass);


--
-- Name: paiement id_paiement; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement ALTER COLUMN id_paiement SET DEFAULT nextval('public.paiement_id_paiement_seq'::regclass);


--
-- Name: reservation id_reservation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation ALTER COLUMN id_reservation SET DEFAULT nextval('public.reservation_id_reservation_seq'::regclass);


--
-- Name: type_chambre id_type; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_chambre ALTER COLUMN id_type SET DEFAULT nextval('public.type_chambre_id_type_seq'::regclass);


--
-- Name: utilisateur id_utilisateur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id_utilisateur SET DEFAULT nextval('public.utilisateur_id_utilisateur_seq'::regclass);


--
-- Data for Name: alerte; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerte (id_alerte, type, message, login_concerne, ip, vue, date_creation) FROM stdin;
1	tentative_role_privilégié	Tentative d'inscription avec le rôle "admin" depuis l'email "hacker@test.com". Le rôle a été forcé à "client".	hacker@test.com	\N	t	2026-10-09 22:15:18.495618
\.


--
-- Data for Name: avis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avis (id_avis, id_client, id_chambre, note, commentaire, date_avis) FROM stdin;
\.


--
-- Data for Name: chambre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chambre (id_chambre, numero, etage, statut, id_type, image) FROM stdin;
34	301	3	disponible	1	chambre-18.jpg
35	302	3	disponible	2	chambre-19.jpg
36	303	3	disponible	2	chambre-20.jpg
37	304	3	disponible	3	chambre-21.jpg
38	205	3	disponible	4	chambre-1791485446897-285699770.jpg
40	206	3	disponible	4	chambre-1791570069983-539571521.jpg
41	207	3	disponible	4	chambre-1791571415328-350677907.jpg
1	101	1	disponible	1	chambre-10.jpg
3	102	1	disponible	1	chambre-11.jpg
4	103	1	disponible	2	chambre-12.jpg
5	104	1	disponible	2	chambre-13.jpg
6	201	2	disponible	2	chambre-14.jpg
7	202	2	disponible	2	chambre-15.jpg
8	203	2	disponible	3	chambre-16.jpg
9	204	2	disponible	3	chambre-17.jpg
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id_client, nom, prenom, telephone, email, adresse, id_utilisateur) FROM stdin;
1	Test	Client	0100000000	\N	\N	\N
2	Martin	Sophie	0612345678	sophie@test.com	12 rue de Paris	9
3	Réceptionniste	Gérante	0600000000	recep@hotel.com	Hôtel	10
4	YESSOUFOU	Hikmanth	0156542345	idayatholaogou@gmail.com	\N	\N
5	Hacker	Test	0600000000	hacker@test.com	Unknown	12
\.


--
-- Data for Name: paiement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paiement (id_paiement, montant, date_paiement, mode, id_reservation) FROM stdin;
1	90000.00	2026-10-08 13:52:04.411354	especes	4
2	210000.00	2026-10-08 19:29:24.266747	carte	5
3	36000.00	2026-10-08 19:30:23.283295	carte	6
\.


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation (id_reservation, date_arrivee, date_depart, statut, date_creation, id_client, id_chambre, note, commentaire) FROM stdin;
2	2026-10-15	2026-10-18	confirmee	2026-10-02 23:14:25.306538	1	1	\N	\N
1	2026-10-10	2026-10-15	annulee	2026-10-02 23:13:03.220286	1	1	\N	\N
7	2026-10-09	2026-10-12	confirmee	2026-10-09 05:34:04.075077	1	1	\N	\N
6	2026-10-29	2026-10-31	annulee	2026-10-08 19:30:20.970142	2	37	\N	\N
5	2026-10-30	2026-11-20	annulee	2026-10-08 19:29:16.970268	2	34	\N	\N
4	2026-10-30	2026-11-08	en_cours	2026-10-08 13:50:53.724012	2	1	\N	\N
3	2026-10-21	2026-10-27	annulee	2026-10-08 13:34:31.553062	2	1	\N	\N
\.


--
-- Data for Name: type_chambre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_chambre (id_type, libelle, description, prix_nuit, capacite) FROM stdin;
1	Simple		100.00	2
3	Double	Chambre spacieuse avec un grand lit	300.00	3
4	Suite	Suite luxueuse avec salon séparé	500.00	6
2	Simple	Chambre confortable avec un lit simple	100.00	2
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (id_utilisateur, nom, prenom, login, mot_de_passe, role) FROM stdin;
5	Admin	Super	admin	$2b$10$H8E04KInqVkpCxHI2TOGauQyS7hS01uaCssFvN2J9dACNRj.rn5YW	admin
7	Dupont	Jean	client1	$2b$10$y1vwMf5fk2UgU3Y.v6o6Lu0WVSNsi5sL4A7jeNGFXbT08MgVu4c8q	client
9	Martin	Sophie	sophie@test.com	$2b$10$f2atBFRv4gklkuoorJ7pY.pA3TyObC/r497PtEIVJFUUf4svFY29K	client
10	Réceptionniste	Gérante	recep@hotel.com	$2b$10$ERS9s5UyXIlOrsJazup5Iu7QZT4hYHBSa1k8NzJzxQlZgWamYz49C	client
11	YESSOUFOU	Hikmanth	yeshik@hotel.com	$2b$10$G.rPqLAqleRjStVanP6IH.zo6mimsPoakh1vWa6DXCV9W6hJwJIyS	receptionniste
12	Hacker	Test	hacker@test.com	$2b$10$d.mYhgiDZ7/Z4rujNWxPruWFxaTo3NJ9cXwM0r0U29DK7R.n/NMjW	client
\.


--
-- Name: alerte_id_alerte_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alerte_id_alerte_seq', 1, true);


--
-- Name: avis_id_avis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avis_id_avis_seq', 1, false);


--
-- Name: chambre_id_chambre_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chambre_id_chambre_seq', 41, true);


--
-- Name: client_id_client_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_client_seq', 5, true);


--
-- Name: paiement_id_paiement_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paiement_id_paiement_seq', 3, true);


--
-- Name: reservation_id_reservation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_id_reservation_seq', 7, true);


--
-- Name: type_chambre_id_type_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_chambre_id_type_seq', 4, true);


--
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_utilisateur_seq', 12, true);


--
-- Name: chambre PK_23d2999e0ffe8ee16a6d3b0dec3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chambre
    ADD CONSTRAINT "PK_23d2999e0ffe8ee16a6d3b0dec3" PRIMARY KEY (id_chambre);


--
-- Name: alerte PK_559f3571e68d298f12b8806aa8f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte
    ADD CONSTRAINT "PK_559f3571e68d298f12b8806aa8f" PRIMARY KEY (id_alerte);


--
-- Name: client PK_83f4571a0e37e3822fff36d6b8a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "PK_83f4571a0e37e3822fff36d6b8a" PRIMARY KEY (id_client);


--
-- Name: utilisateur PK_d719cc17b2e613463e34fbae395; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "PK_d719cc17b2e613463e34fbae395" PRIMARY KEY (id_utilisateur);


--
-- Name: paiement PK_dfcbe2c7209228811aa3eed5e79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement
    ADD CONSTRAINT "PK_dfcbe2c7209228811aa3eed5e79" PRIMARY KEY (id_paiement);


--
-- Name: reservation PK_e753806ec455d46d48e103a56b3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "PK_e753806ec455d46d48e103a56b3" PRIMARY KEY (id_reservation);


--
-- Name: type_chambre PK_ec2340c429af0fee93dcbc4261c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_chambre
    ADD CONSTRAINT "PK_ec2340c429af0fee93dcbc4261c" PRIMARY KEY (id_type);


--
-- Name: utilisateur UQ_8aabfb85f405be6b712a966a1e1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "UQ_8aabfb85f405be6b712a966a1e1" UNIQUE (login);


--
-- Name: client UQ_e30022b0e2d7efed5745cdb090c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "UQ_e30022b0e2d7efed5745cdb090c" UNIQUE (id_utilisateur);


--
-- Name: avis avis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_pkey PRIMARY KEY (id_avis);


--
-- Name: reservation FK_14f35d514954f8a591dde18c799; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_14f35d514954f8a591dde18c799" FOREIGN KEY (id_client) REFERENCES public.client(id_client);


--
-- Name: paiement FK_1bd0862450402bb8847b17cd0f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiement
    ADD CONSTRAINT "FK_1bd0862450402bb8847b17cd0f8" FOREIGN KEY (id_reservation) REFERENCES public.reservation(id_reservation);


--
-- Name: reservation FK_1f79609a9a96bcb0ff12e5d10de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_1f79609a9a96bcb0ff12e5d10de" FOREIGN KEY (id_chambre) REFERENCES public.chambre(id_chambre);


--
-- Name: chambre FK_2115481d3ce85cfa57954bca108; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chambre
    ADD CONSTRAINT "FK_2115481d3ce85cfa57954bca108" FOREIGN KEY (id_type) REFERENCES public.type_chambre(id_type);


--
-- Name: client FK_e30022b0e2d7efed5745cdb090c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "FK_e30022b0e2d7efed5745cdb090c" FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id_utilisateur);


--
-- PostgreSQL database dump complete
--

\unrestrict L2v2CVgvVA9lPOSKLglgPpc8YOh1mflBvUwdxfQ6ED7oviPCyfaM0d2YJH26Lfq

