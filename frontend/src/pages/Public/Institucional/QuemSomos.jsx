import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { quemSomosPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

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