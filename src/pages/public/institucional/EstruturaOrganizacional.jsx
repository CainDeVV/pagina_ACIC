import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '../../../components/layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer';
import '../../../styles/institucional/institucional.css';

function EstruturaOrganizacional() {
  return (
    <>
      <Helmet>
        <title>Estrutura Organizacional | ACIC</title>
      </Helmet>
    <SaibaMaisLayout titulo="Estrutura Organizacional">
    </SaibaMaisLayout>
    </>
  );
}

export default EstruturaOrganizacional;