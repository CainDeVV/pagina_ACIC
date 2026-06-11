import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { quemSomosPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function QuemSomos() {
  return (
     <>
      <Helmet>
        <title>Quem Somos | ACIC</title>
      </Helmet>
    <SaibaMaisLayout titulo={quemSomosPageMock.pageTitle}>
      <BlockRenderer blocks={quemSomosPageMock.blocks} />
    </SaibaMaisLayout>
    </>
  );
}

export default QuemSomos;
