import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { QuemSomosPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function QuemSomos() {
  return (
    <SaibaMaisLayout titulo={QuemSomosPageMock.pageTitle}>
      <BlockRenderer blocks={QuemSomosPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default QuemSomos;