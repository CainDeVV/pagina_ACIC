import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { estatutoPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

function Estatuto() {
  return (
    <SaibaMaisLayout titulo={estatutoPageMock.pageTitle}>
      <BlockRenderer blocks={estatutoPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default Estatuto;