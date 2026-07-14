import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminList } from '@/hooks/useAdminList';
import AdminListLayout from '@/components/Admin/AdminListLayout';
import { usuariosService } from '@/services/usuariosService';
import { InlineBooleanToggle } from '@/components/Admin/TableCells';

function UsuariosList() {
  const { data, loading, error, handleDelete, handleUpdateField } = useAdminList({
    fetchMethod: usuariosService.buscarTodosAdmin,
    deleteMethod: usuariosService.remover,
    updateMethod: usuariosService.atualizar,
    itemName: 'usuário'
  });

  const loggedInUserId = React.useMemo(() => {
    const userStr = localStorage.getItem('acic_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch (e) { console.error('Erro ao ler id cacheado', e); }
    }
    return null;
  }, []);

  const safeHandleDelete = (id) => {
    if (id === loggedInUserId) {
      alert("Ação negada: Você não pode excluir a sua própria conta.");
      return;
    }
    handleDelete(id);
  };

  const safeHandleUpdateField = (row, field, value) => {
    if (field === 'active' && row.id === loggedInUserId && value === false) {
      alert("Ação negada: Você não pode desativar o próprio acesso.");
      return;
    }
    handleUpdateField(row, field, value);
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'role', label: 'Cargo' },
    { 
      key: 'active', 
      label: 'Acesso Ativo',
      render: (row) => (
        <InlineBooleanToggle 
          row={row} 
          field="active" 
          onUpdate={safeHandleUpdateField} 
        />
      )
    }
  ];

  const navigate = useNavigate();

  return (
    <AdminListLayout
      title="Usuários (Equipe)"
      createButtonLabel="Novo Usuário"
      createPath="/admin/usuarios/novo"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/usuarios/${row.id}/editar`)}
      onDelete={(id) => safeHandleDelete(id)}
    />
  );
}

export default UsuariosList;
