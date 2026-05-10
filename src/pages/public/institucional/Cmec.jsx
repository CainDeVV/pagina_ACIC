import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { cmecPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function Cmec() {
  return (
    <SaibaMaisLayout titulo={cmecPageMock.pageTitle}>
      <BlockRenderer blocks={cmecPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default Cmec;