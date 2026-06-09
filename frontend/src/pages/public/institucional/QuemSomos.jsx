import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { quemSomosPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function QuemSomos() {
  return (
    <SaibaMaisLayout titulo={quemSomosPageMock.pageTitle}>
      <BlockRenderer blocks={quemSomosPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default QuemSomos;