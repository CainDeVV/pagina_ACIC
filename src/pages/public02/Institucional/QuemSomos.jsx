import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { quemSomosPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

function QuemSomos() {
  return (
    <SaibaMaisLayout titulo={quemSomosPageMock.pageTitle}>
      <BlockRenderer blocks={quemSomosPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default QuemSomos;