import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { cmecPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

function Cmec() {
  return (
    <SaibaMaisLayout titulo={cmecPageMock.pageTitle}>
      <BlockRenderer blocks={cmecPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default Cmec;