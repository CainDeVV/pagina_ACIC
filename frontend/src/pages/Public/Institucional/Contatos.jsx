import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import { Helmet } from 'react-helmet-async';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { contatosPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

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