// Dados simplificados da diretoria especificamente para a Home
export const diretoriaHomeMock = [
  { id: 1, nome: 'João Silva', cargo: 'Presidente', imagem_url: 'https://i.pravatar.cc/300?img=11' },
  { id: 2, nome: 'Maria Souza', cargo: '1ª Vice-Presidente', imagem_url: 'https://i.pravatar.cc/300?img=5' },
  { id: 3, nome: 'Carlos Melo', cargo: '2º Vice-Presidente', imagem_url: 'https://i.pravatar.cc/300?img=12' },
  { id: 4, nome: 'Ana Ferreira', cargo: 'Diretora Financeira', imagem_url: 'https://i.pravatar.cc/300?img=9' },
];

export const quemSomosPageMock = {
  pageTitle: "Quem Somos",
  blocks: [
    { type: "heading", level: 1, content: "A CACB", className: "institutional-title" },
    { 
      type: "section",
      blocks: [
        { type: "paragraph", content: "A Confederação das Associações Comerciais e Empresariais do Brasil (CACB) é um coletivo empresarial que busca contribuir para o desenvolvimento econômico do país, representando 27 Federações, 2300 Associações Comerciais e Empresariais e 2 milhões de empresas em todo o território nacional." },
        { type: "paragraph", content: "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais." }
      ]
    },
    {
      type: "section",
      blocks: [
        { type: "heading", level: 2, content: "Histórico", className: "institutional-subtitle" },
        { type: "paragraph", content: "A CACB é a entidade de representação empresarial mais antiga das Américas. Sua história teve início com a fundação da Associação Comercial da Bahia, em 15 de julho de 1811, atendendo a três desejos: dos comerciantes, para terem um local condigno onde pudessem se reunir regularmente e aí realizar seus negócios, como já vinham fazendo há anos, na própria Cidade Baixa; do vice-rei do Brasil, D. Marcos de Noronha e Britto, VIII Conde dos Arcos de Val de Vez, interessado no desenvolvimento da província que governava, sede do maior porto do hemisfério sul à época, já aberto, desde 1808, às “nações amigas”; e do Príncipe Regente, D. João VI, de promover o progresso da Colônia, sede provisória da Corte Portuguesa." },
        { type: "figure", url: "https://cacb.org.br/wp-content/uploads/2024/03/foto-historia-sede-associacao-acb-bahia.jpg", alt: "Fachada histórica da Associação Comercial da Bahia", caption: "Associação Comercial da Bahia, a primeira da história, cujas instalações são tombadas pelo Instituto do Patrimônio Histórico e Artístico Nacional – IPHAN." },
        { type: "paragraph", content: "As associações de Norte a Sul do país tiveram importante papel na história do Brasil e na definição e encaminhamento das demandas dos empresários. A Associação Comercial de Alagoas, por exemplo, chegou a controlar a exportação do açúcar no século XIX." },
        { type: "paragraph", content: "O termo <em>comercial</em>, presente na nomenclatura destas associações vem de transação comercial, estas que, em 1811, eram feitas no local onde a ACBahia foi criada. A sede da Associação passou a centralizar a realização de negócios de diversos produtores e produtos, fomentando o comércio local da época." },
        { type: "paragraph", content: "Devido ao valor histórico do termo “comercial”, ele foi mantido e, até hoje, serve para dar nome às entidades da rede CACB em todo o país. Engana-se, no entanto, quem pensa que a representatividade do Sistema se limita apenas ao comércio." },
        { type: "paragraph", content: "Pelo contrário! As Associações Comerciais representam empresários dos mais variados setores, como do próprio comércio ou de serviços, indústria, agronegócio, entre outros. Além de defenderem os interesses dos empresários junto ao governo, as ACEs desenvolvem serviços para a classe, como capacitações, assessoria jurídica, planos de saúde, certificados de origem, certificado digital, mediação e arbitragem, entre outros." }
      ]
    },
    { type: "pdfLink", url: "https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf", text: "📄 Acesse aqui o estatuto da CACB", className: "institutional-pdf-link" }
  ]
};

// Dados completos e categorizados para a página oficial de Diretoria
export const diretoriaPageMock = [
  {
    roleLabel: "PRESIDENTE",
    members: [
      { id: 101, nome: "MARIA DO CARMO XIMENES DE PINHO", cargo: "HIPERNACIONAL", imagem_url: null, biografia: "Empresária com vasta experiência no varejo e gestão corporativa, focada na inovação do comércio de Crateús." }
    ]
  },
  {
    roleLabel: "I VICE-PRESIDENTE",
    members: [
      { id: 102, nome: "FRANCISCO ROBERTO LIMA E SILVA", cargo: "GRÁFICA CRATEÚS", imagem_url: null, biografia: "" }
    ]
  },
  {
    roleLabel: "I SECRETÁRIO",
    members: [
      { id: 103, nome: "ANTONIO OSVALDO PONTES DE MELO", cargo: "TINA CONDIMENTOS", imagem_url: null, biografia: "" }
    ]
  },
  {
    roleLabel: "II SECRETÁRIO",
    members: [
      { id: 104, nome: "ANTÔNIO WAGNER CLAUDINO SALES", cargo: "RANCHEIRA W&S", imagem_url: null, biografia: "" }
    ]
  },
  {
    roleLabel: "I TESOUREIRO",
    members: [
      { id: 105, nome: "EDMILSON ARIMATEIA NORTE", cargo: "MARCONORTE", imagem_url: null, biografia: "" }
    ]
  },
  {
    roleLabel: "I DIRETOR SOCIAL",
    members: [
      { id: 106, nome: "ANTONIA LUCINEIDE LEITÃO MACHADO", cargo: "DISTRIBUIDORA DE ÁGUA E CIMENTO", imagem_url: null, biografia: "" }
    ]
  },
  {
    roleLabel: "II RELAÇÕES PÚBLICAS",
    members: [
      { id: 107, nome: "AGOSTINHO MORAES RODRIGUES", cargo: "CASA GOSTINHO", imagem_url: null, biografia: "" }
    ]
  },
  {
    roleLabel: "CONSELHO FISCAL",
    members: [
      { id: 108, nome: "MARCOS ALBERTO SOARES GOIANO", cargo: "COMERCIAL GOIANO", imagem_url: null, biografia: "" },
      { id: 109, nome: "ARNALDO RODRIGUES SALES", cargo: "VISUALLE", imagem_url: null, biografia: "" },
      { id: 110, nome: "MARIA ROZELINA PEREIRA DE SOUSA", cargo: "MERCADINHO SR. FRANSQUINHO", imagem_url: null, biografia: "" }
    ]
  },
  {
    roleLabel: "CONSELHO CONSULTIVO",
    members: [
      { id: 111, nome: "ANTONIO LUÍZ BENEVIDES SALES", cargo: "MERCANSALES", imagem_url: null, biografia: "" }
    ]
  }
];

export const cmecPageMock = {
  pageTitle: "CMEC",
  blocks: [
    { type: "heading", level: 1, content: "Conselho da Mulher Empreendedora e da Cultura", className: "institutional-title" },
    { type: "image", url: "https://cacb.org.br/wp-content/uploads/2022/09/CMEC_NOVO-LOGO_Nacional-Padrao-2.png", alt: "Banner oficial do CMEC Nacional", className: "institutional-banner" },
    {
      type: "section",
      blocks: [
        { type: "paragraph", content: "O Conselho Nacional da Mulher Empreendedora e da Cultura (CMEC Nacional), é um órgão da Confederação das Associações Comerciais e Empresariais do Brasil (CACB), criado em 24 de abril de 2002, em Brasília, pelo Conselho Diretor desta entidade. A primeira prioridade do CMEC é estimular e apoiar a implantação dos conselhos estaduais, objetivando disseminar o Ideal Empreendedor, difundindo e promovendo o Associativismo como base de sustentação nacional." },
        { type: "paragraph", content: "A proposta do CMEC é trabalhar intensamente para promover a integração de lideranças femininas, expandindo os contatos do CMEC com as diversas organizações empresariais de todos os estados brasileiros e de outros países." },
        { type: "paragraph", content: "Com essa missão, o CMEC atua com uma visão pró-ativa, de forma a potencializar a mulher criando oportunidades de aprimoramento profissional, possibilitando a ampliação da sua área de atuação, promovendo uma capacitação cada vez maior e procurando fazer com que ela atue em um competitivo mercado de trabalho." }
      ]
    },
    {
      type: "section",
      blocks: [
        { type: "heading", level: 2, content: "Nossas Conquistas", id: "titulo-conquistas", className: "institutional-subtitle" },
        { type: "paragraph", content: "Desde sua instituição, o Conselho obteve importantes conquistas, entre elas o Programa Internacional para Formação de Liderança, o Líder Mulher – Lapidando Diamantes do Sebrae e a realização do XIV Congresso Ibero-Americano das Mulheres Empresárias, que ocorreu entre os dias 19 e 23 de outubro de 2003, na cidade de Araxá (MG), a participação na 56ª sessão da Comissão sobre o Status da Mulher na ONU e a reunião com a Chefe de Gabinete da Secretaria de Assuntos Globais das Mulheres, Anita Botti." },
        { type: "paragraph", content: "Para saber mais, acesse o site do CMEC <a href='#' class='institutional-link'>clicando aqui</a>.", style: { marginTop: '24px' } }
      ]
    },
    {
      type: "gallery",
      className: "institutional-gallery",
      images: [
        { url: "https://cacb.org.br/wp-content/uploads/2025/01/Conselho-executivo-CMEC-2025.jpg", alt: "Reunião de lideranças femininas do CMEC" },
        { url: "https://cacb.org.br/wp-content/uploads/2023/10/Conselho-CMEC-outubro-2023-2.jpeg", alt: "Palestra sobre empreendedorismo feminino" }
      ]
    }
  ]
};

export const estatutoPageMock = {
  pageTitle: "Estatuto",
  blocks: [
    { type: "heading", level: 1, content: "Estatuto da CACB", className: "institutional-title" },
    {
      type: "section",
      blocks: [
        { 
          type: "paragraph", 
          content: "A CACB é uma organização multissetorial que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais." 
        },
        { 
          type: "paragraph", 
          // O link embutido no texto é feito usando uma tag <a> comum, que será processada pelo dangerouslySetInnerHTML
          content: "Para <a href='https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf' target='_blank' rel='noopener noreferrer' style='color: #0266b0; font-weight: bold; text-decoration: none;'>baixar o estatuto em PDF clique aqui</a>. Se preferir você pode ver o documento que está disponibilizado a seguir:" 
        }
      ]
    },
    { type: "pdfEmbed", url: "https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf" }
  ]
};

export const contatosPageMock = {
  pageTitle: "Contatos",
  blocks: [
    { 
      type: "paragraph", 
      // Usamos a tag <strong> para o negrito, <br/> para pular linha e a nossa classe padrão para o link
      content: "<strong>Presidente</strong><br/>Alfredo Cotait Neto<br/>61 – 3321.1311<br/><a href='mailto:presidente@cacb.org.br' class='institutional-link'>presidente@cacb.org.br</a>" 
    },
    { 
      type: "paragraph", 
      content: "<strong>Superintendente</strong><br/>Carlos Rezende<br/>61 – 3321.1311<br/><a href='mailto:rezende@cacb.org.br' class='institutional-link'>rezende@cacb.org.br</a>" 
    },
    { 
      type: "paragraph", 
      content: "<strong>Assessora da Diretoria</strong><br/>Ana Paula Passos<br/>61 – 3321.1311<br/><a href='mailto:ana.passos@cacb.org.br' class='institutional-link'>ana.passos@cacb.org.br</a>" 
    },
    { 
      type: "paragraph", 
      content: "<strong>Dúvidas sobre proteção de dados</strong><br/><a href='mailto:protecaodedados@cacb.org.br' class='institutional-link'>protecaodedados@cacb.org.br</a>" 
    }
  ]
};

import { galeria } from "../assets/galeriaPresidentes";

export const galeriaPresidentesMock = {
  pageTitle: "Galeria de Presidentes",
  intro: "Conheça os líderes que conduziram a nossa instituição ao longo dos anos, deixando seu legado e contribuindo ativamente para o fortalecimento do associativismo crateuense.",
  presidentes: [

    {
      id: 25,
      nome: "Francisco Roberto Lima e Silva",
      periodo: "2017 - 2023",
      foto: galeria.FcoRoberto,
      texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 24,
      nome: "Antônio Luiz Benevides Sales",
      periodo: "2015 - 2017",
      foto: galeria.AntLuiz,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 23,
      nome: "José de Melo Cavalcante",
      periodo: "1999 - 2001 e 2001 - 2003",
      foto: galeria.JosedeMelo,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 22,
      nome: "Fernando Antônio Aguiar Albuquerque",
      periodo: "1995 - 1997",
      foto: galeria.FernandoAguiar,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 21,
      nome: "José Airton Melo Aguiar",
      periodo: "1991 - 1993",
      foto: galeria.JoseAirton,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 20,
      nome: "Antônio Soares Martins",
      periodo: "1984 - 1986 e 1986 - 1991",
      foto: galeria.AntSoares,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 19,
      nome: "Edmundo Pinto FIlho",
      periodo: "1982 - 1984",
      foto: galeria.Edmundo,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 18,
      nome: "José Américo Moreira",
      periodo: "1978 - 1980",
      foto: galeria.JoseAmerico,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 17,
      nome: "Raimundo Bezerra de Melo",
      periodo: "1976 - 1978",
      foto: galeria.RaimundoBezerra,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 16,
      nome: "Raimundo Soares Resende",
      periodo: "1974 - 1976",
      foto: galeria.RaimundoSoares,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 15,
      nome: "Boanerges Cisne Sales",
      periodo: "1971 - 1974",
      foto: galeria.Boanerges,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 14,
      nome: "João José de Castro",
      periodo: "1968 - 1971",
      foto: galeria.JoaoJose,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 13,
      nome: "Francisco de Assis Machado",
      periodo: "1964 - 1968",
      foto: galeria.FcoDeAssis,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 12,
      nome: "Antônio de Melo Rosa",
      periodo: "1961 - 1964",
      foto: galeria.AntMelo,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 11,
      nome: "Armando Marques Mourão",
      periodo: "1958 - 1961",
      foto: galeria.Armando,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 10,
      nome: "Pedro de Miranda Melo",
      periodo: "1954 - 1958",
      foto: galeria.PedroDeMiranda,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 9,
      nome: "Bento Coutinho de Macedo",
      periodo: "1951 - 1954",
      foto: galeria.Bento,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {

      id: 8,
      nome: "Julio Evaristo de Paiva",
      periodo: "1947 - 1951",
      foto: galeria.Julio,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 7,
      nome: "Francisco Melo Lima",
      periodo: "1943 - 1947",
      foto: galeria.FcoMelo,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 6,
      nome: "Manoel Evaristo de Paiva",
      periodo: "1939 - 1943",
      foto: galeria.Manoel,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },

    {
      id: 5,
      nome: "Pedro Machado da Ponte",
      periodo: "1935 - 1939",
      foto: galeria.Pedro,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },

    {
      id: 4,
      nome: "Abel Alcanfor soares",
      periodo: "1931 - 1935",
      foto: galeria.Abel,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },

    {
      id: 3,
      nome: "Firmino Rocha Aguiar ",
      periodo: "1929 - 1931",
      foto: galeria.Firmino,
      //texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },

    {
      id: 2,
      nome: "Francisco Mariano Cavalcante",
      periodo: "1925 - 1929",
      foto: galeria.FcoMariano,
      //texto: "Primeira mulher a assumir a presidência. O seu mandato foi marcado pela criação do CMEC estadual e pelo incentivo massivo ao empreendedorismo feminino."
    },
    {
      id: 1,
      nome: "Auton Aragão",
      periodo: "1921 - 1925 ",
      foto: galeria.AutonAragao,
      //texto: "Liderou a associação em um momento de expansão digital, sendo o principal responsável pela criação dos primeiros portais de integração entre as federações."
    }
  ]
};