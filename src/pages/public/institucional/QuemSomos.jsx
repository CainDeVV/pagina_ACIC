import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import '../../../styles/institucional/quemSomos.css';

function QuemSomos() {
  return (
    <SaibaMaisLayout titulo="Quem Somos">
      
      <h2 className="quem-somos-titulo">A CACB</h2>
      
      <p>
        A Confederação das Associações Comerciais e Empresariais do Brasil (CACB) é um coletivo 
        empresarial que busca contribuir para o desenvolvimento econômico do país, representando 
        27 Federações, 2300 Associações Comerciais e Empresariais e 2 milhões de empresas em 
        todo o território nacional.
      </p>

      <p>
        A CACB é uma organização multissetorial que reúne empresários de todos os setores da 
        economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os 
        portes e profissionais liberais.
      </p>

      <h3 className="quem-somos-subtitulo">Histórico</h3>

      <p>
        A CACB é a entidade de representação empresarial mais antiga das Américas. Sua história 
        teve início com a fundação da Associação Comercial da Bahia, em 15 de julho de 1811, 
        atendendo a três desejos: dos comerciantes, para terem um local condigno onde pudessem 
        se reunir regularmente e aí realizar seus negócios, como já vinham fazendo há anos, na 
        própria Cidade Baixa; do vice-rei do Brasil, D. Marcos de Noronha e Britto, VIII Conde 
        dos Arcos de Val de Vez, interessado no desenvolvimento da província que governava, sede 
        do maior porto do hemisfério sul à época, já aberto, desde 1808, às “nações amigas”; e 
        do Príncipe Regente, D. João VI, de promover o progresso da Colônia, sede provisória da 
        Corte Portuguesa.
      </p>

      {/* Uso de figure e figcaption para imagem + legenda semântica */}
      <figure className="quem-somos-figura">
        <img 
          src="https://cacb.org.br/wp-content/uploads/2024/03/foto-historia-sede-associacao-acb-bahia.jpg" 
          alt="Fachada histórica da Associação Comercial da Bahia" 
        />
        <figcaption className="quem-somos-legenda">
          Associação Comercial da Bahia, a primeira da história, cujas instalações são tombadas 
          pelo Instituto do Patrimônio Histórico e Artístico Nacional – IPHAN.
        </figcaption>
      </figure>

      <p>
        As associações de Norte a Sul do país tiveram importante papel na história do Brasil e na 
        definição e encaminhamento das demandas dos empresários. A Associação Comercial de Alagoas, 
        por exemplo, chegou a controlar a exportação do açúcar no século XIX.
      </p>

      <p>
        O termo comercial, presente na nomenclatura destas associações vem de transação comercial, 
        estas que, em 1811, eram feitas no local onde a ACBahia foi criada. A sede da Associação 
        passou a centralizar a realização de negócios de diversos produtores e produtos, fomentando 
        o comércio local da época.
      </p>

      <p>
        Devido ao valor histórico do termo “comercial”, ele foi mantido e, até hoje, serve para dar 
        nome às entidades da rede CACB em todo o país. Engana-se, no entanto, quem pensa que a 
        representatividade do Sistema se limita apenas ao comércio.
      </p>

      <p>
        Pelo contrário! As Associações Comerciais representam empresários dos mais variados setores, 
        como do próprio comércio ou de serviços, indústria, agronegócio, entre outros. Além de 
        defenderem os interesses dos empresários junto ao governo, as ACEs desenvolvem serviços 
        para a classe, como capacitações, assessoria jurídica, planos de saúde, certificados de 
        origem, certificado digital, mediação e arbitragem, entre outros.
      </p>

      {/* Botão para o PDF usando target="_blank" para abrir em nova aba */}
      <a 
        href="https://cacb.org.br/downloads/Estatuto_Atual_CACB.pdf" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="quem-somos-link-pdf"
      >
        📄 Acesse aqui o estatuto da CACB
      </a>

    </SaibaMaisLayout>
  );
}

export default QuemSomos;