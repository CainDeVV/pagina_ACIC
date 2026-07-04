import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';

function DiretoriaList() {
  const navigate = useNavigate();
  const [diretores, setDiretores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiretores = async () => {
    setLoading(true);
    try {
      const data = await institucionalService.buscarDiretoria();
      
      // O backend retorna os dados agrupados: [{ roleLabel: '...', members: [...] }]
      // Para a tabela do painel admin, precisamos de uma lista plana (flat)
      const flatList = [];
      if (Array.isArray(data)) {
        data.forEach(group => {
          if (group.members && Array.isArray(group.members)) {
            flatList.push(...group.members);
          }
        });
      }
      
      setDiretores(flatList);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar diretoria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiretores();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este membro da diretoria?')) {
      try {
        await institucionalService.deletarDiretoria(id);
        fetchDiretores();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir membro da diretoria.');
      }
    }
  };

  const columns = [
    { label: 'Nome', key: 'name' },
    { label: 'Cargo', key: 'role' },
    { label: 'Categoria', key: 'category' },
    { label: 'Ordem', key: 'sortOrder' }
  ];

  return (
    <AdminListLayout
      title="Diretoria"
      createPath="/admin/diretoria/novo"
      loading={loading}
      error={error}
      data={diretores}
      columns={columns}
      onEdit={(row) => navigate(`/admin/diretoria/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default DiretoriaList;