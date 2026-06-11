import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { cmecPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function Cmec() {
  return (
    <>
      <Helmet>
        <title>CMEC | ACIC</title>
      </Helmet>
    <SaibaMaisLayout titulo={cmecPageMock.pageTitle}>
      <BlockRenderer blocks={cmecPageMock.blocks} />
    </SaibaMaisLayout>
    </>
  );
}

export default Cmec;