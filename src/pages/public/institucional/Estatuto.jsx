import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { estatutoPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

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