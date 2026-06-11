import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { contatosPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function Contatos() {
  return (
    <>
      <Helmet>
        <title>Contatos | ACIC</title>
      </Helmet>
    <SaibaMaisLayout titulo={contatosPageMock.pageTitle}>
      <BlockRenderer blocks={contatosPageMock.blocks} />
    </SaibaMaisLayout>
    </>
  );
}

export default Contatos;