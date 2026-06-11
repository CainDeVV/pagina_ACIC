import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import { Helmet } from 'react-helmet-async';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import './Institucional.css';

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