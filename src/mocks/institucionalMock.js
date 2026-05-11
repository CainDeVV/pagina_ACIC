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

export const galeriaPresidentesMock = {
  pageTitle: "Galeria de Presidentes",
  intro: "Conheça os líderes que conduziram a nossa instituição ao longo dos anos, deixando seu legado e contribuindo ativamente para o fortalecimento do associativismo brasileiro.",
  presidentes: [
    {
      id: 3,
      nome: "Alfredo Cotait Neto",
      periodo: "2021 - Atual",
      foto: "https://desvendandoumverso.wordpress.com/wp-content/uploads/2015/12/michel-temer-vampiro.jpg",
      texto: "Atual presidente, focado na reestruturação e modernização da entidade, além da defesa incansável dos direitos dos micro e pequenos empresários junto ao Governo Federal."
    },
    {
      id: 2,
      nome: "Dr. João Silva Albuquerque",
      periodo: "2014 - 2020",
      foto: "https://cdn.jornaldaparaiba.com.br/wp-content/uploads/2021/08/500x300/Bolsonaro-sorrindo-7.webp?fallback=https%3A%2F%2Fcdn.jornaldaparaiba.com.br%2Fwp-content%2Fuploads%2F2021%2F08%2FBolsonaro-sorrindo.jpeg%3Fxid%3D583659&xid=583659",
      texto: "Primeira mulher a assumir a presidência. O seu mandato foi marcado pela criação do CMEC estadual e pelo incentivo massivo ao empreendedorismo feminino."
    },
    {
      id: 1,
      nome: "Maria Fernanda Costa",
      periodo: "2010 - 2014",
      foto: "https://media.gazetadopovo.com.br/2023/02/06061310/Lula-1-720x712.jpg",
      texto: "Liderou a associação em um momento de expansão digital, sendo o principal responsável pela criação dos primeiros portais de integração entre as federações."
    }
  ]
};