import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import { contatosPageMock } from '../../../mocks/institucionalMock';
import '../../../styles/institucional/institucional.css';

function Contatos() {
  return (
    <SaibaMaisLayout titulo={contatosPageMock.pageTitle}>
      <BlockRenderer blocks={contatosPageMock.blocks} />
    </SaibaMaisLayout>
  );
}

export default Contatos;