import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { contatosPageMock } from '../../../mocks/institucionalMock';
import './Institucional.css';

function Contatos() {
  return (
    <SaibaMaisLayout titulo={contatosPageMock.pageTitle}>
      <BlockRenderer blocks={contatosPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default Contatos;