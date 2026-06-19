import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('acic_access_token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;