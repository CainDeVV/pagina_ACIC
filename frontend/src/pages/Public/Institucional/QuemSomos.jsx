import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '@/components/Layout/SaibaMaisLayout';
import BlockRenderer from '@/components/BlockRenderer/BlockRenderer';
import { institucionalService } from '@/services/institucionalService';
import { CONTENT_STATUS } from '@/constants/status';
import './Institucional.css';

function QuemSomos() {
  const [pagina, setPagina] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDados() {
      try {
        // Usa o serviço passando a chave específica desta página no banco
        const dados = await institucionalService.buscarPagina('quem-somos');
        if (dados && dados.status === CONTENT_STATUS.PUBLISHED) {
          setPagina(dados);
        } else {
          setPagina(null);
        }
      } catch (error) {
        console.error("Erro ao buscar conteúdo Institucional:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarDados();
  }, []);

  if (carregando) {
    return (
      <SaibaMaisLayout titulo="Carregando...">
        <p className="inst-loading">Carregando informações...</p>
      </SaibaMaisLayout>
    );
  }

  // Fallback amigável caso a página ainda não tenha sido criada no banco
  if (!pagina) {
    return (
      <SaibaMaisLayout titulo="Quem Somos">
        <p className="inst-loading">
          Conteúdo ainda não publicado. Aguarde a inserção de dados no painel administrativo.
        </p>
      </SaibaMaisLayout>
    );
  }

  return (
    <>
    <Helmet>
      <title>{`${pagina.title} | ACIC`}</title>
      <meta name="description" content="Conheça a história e a missão da ACIC Crateús, trabalhando há mais de 40 anos pelo empresariado do Sertão Central." />
    </Helmet>
    <SaibaMaisLayout titulo={pagina.title}>
      {/* O backend envia o JSON do Editor.js dentro do campo 'content' */}
      <BlockRenderer blocks={pagina.content?.blocks || []} />
    </SaibaMaisLayout>
    </>
  );
}

export default QuemSomos;