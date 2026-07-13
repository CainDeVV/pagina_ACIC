import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // replace previne que o usuário volte para a rota restrita clicando no botão "Voltar" do navegador
    return <Navigate to="/login" replace />; 
  }

  return children ? children : <Outlet />;
}

export default PrivateRoute;