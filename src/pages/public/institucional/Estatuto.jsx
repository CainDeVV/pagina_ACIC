import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { estatutoPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function Estatuto() {
  return (
    <SaibaMaisLayout titulo={estatutoPageMock.pageTitle}>
      <BlockRenderer blocks={estatutoPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default Estatuto;