import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import { Helmet } from 'react-helmet-async';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { cmecPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

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