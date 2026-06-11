import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import { Helmet } from 'react-helmet-async';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { estatutoPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

function Estatuto() {
  return (
    <>
    <Helmet>
      <title>Estatuto | ACIC</title>
    </Helmet>
    <SaibaMaisLayout titulo={estatutoPageMock.pageTitle}>
      <BlockRenderer blocks={estatutoPageMock.blocks} />
    </SaibaMaisLayout>
    </>
  );
}

export default Estatuto;