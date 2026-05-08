import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import '../../../styles/institucional/cmec.css';

function Cmec() {
  return (
    <SaibaMaisLayout titulo="CMEC">
      
      {/* Imagem Principal */}
      <img 
        src="https://cacb.org.br/wp-content/uploads/2022/09/CMEC_NOVO-LOGO_Nacional-Padrao-2.png" 
        alt="Banner CMEC" 
        className="cmec-banner"
      />

      {/* Textos */}
      <p>
        O Conselho Nacional da Mulher Empreendedora e da Cultura (CMEC Nacional), é um órgão da 
        Confederação das Associações Comerciais e Empresariais do Brasil (CACB), criado em 24 de 
        abril de 2002, em Brasília, pelo Conselho Diretor desta entidade. A primeira prioridade 
        do CMEC é estimular e apoiar a implantação dos conselhos estaduais, objetivando disseminar 
        o Ideal Empreendedor, difundindo e promovendo o Associativismo como base de sustentação nacional.
      </p>

      <p>
        A proposta do CMEC é trabalhar intensamente para promover a integração de lideranças femininas, 
        expandindo os contatos do CMEC com as diversas organizações empresariais de todos os estados 
        brasileiros e de outros países.
      </p>

      <p>
        Com essa missão, o CMEC atua com uma visão pró-ativa, de forma a potencializar a mulher 
        criando oportunidades de aprimoramento profissional, possibilitando a ampliação da sua área 
        de atuação, promovendo uma capacitação cada vez maior e procurando fazer com que ela atue 
        em um competitivo mercado de trabalho.
      </p>

      <p>
        Desde sua instituição, o Conselho obteve importantes conquistas, entre elas o Programa 
        Internacional para Formação de Liderança, o Líder Mulher – Lapidando Diamantes do Sebrae e 
        a realização do XIV Congresso Ibero-Americano das Mulheres Empresárias, que ocorreu entre 
        os dias 19 e 23 de outubro de 2003, na cidade de Araxá (MG), a participação na 56ª sessão 
        da Comissão sobre o Status da Mulher na ONU e a reunião com a Chefe de Gabinete da Secretaria 
        de Assuntos Globais das Mulheres, Anita Botti.
      </p>

      <p style={{ marginTop: '24px' }}>
        Para saber mais, acesse o site do CMEC <a href="#" className="cmec-link">clicando aqui</a>.
      </p>

      {/* Imagens Extras no final */}
      <div className="cmec-galeria">
        <img 
          src="https://cacb.org.br/wp-content/uploads/2025/01/Conselho-executivo-CMEC-2025.jpg" 
          alt="Imagem extra 1" 
        />
        <img 
          src="https://cacb.org.br/wp-content/uploads/2023/10/Conselho-CMEC-outubro-2023-2.jpeg" 
          alt="Imagem extra 2" 
        />
      </div>

    </SaibaMaisLayout>
  );
}

export default Cmec;