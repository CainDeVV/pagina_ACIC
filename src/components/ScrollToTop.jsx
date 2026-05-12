import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation(); // Pega a URL atual (ex: '/servicos')

  useEffect(() => {
    // Toda vez que o 'pathname' mudar, o navegador rola para o topo (x: 0, y: 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente não desenha nada na tela
}