---
description: Substitui um mock do frontend pela integração real com a API backend. Usar quando for conectar uma página que ainda usa dados de mocks/*.js.
---

# Workflow: Integrar Página com API

Use ao substituir um mock por chamadas reais ao backend.

## Pré-requisito
- Backend rodando com o endpoint correspondente
- `frontend/src/services/api.js` já existe (instância Axios com interceptor JWT)

## Passos

### 1. Criar o service da entidade
Em `frontend/src/services/nomeService.js`:

```js
import api from './api';

export const nomeService = {
  getAll: () => api.get('/nomes'),
  getOne: (slugOrId) => api.get(`/nomes/${slugOrId}`),
};
```

### 2. Atualizar o componente/página

Antes (com mock):
```jsx
import { nomesMock } from '../../../mocks/nomesMock';
// ...
const dados = nomesMock;
```

Depois (com API):
```jsx
import { useState, useEffect } from 'react';
import { nomeService } from '../../../services/nomeService';

const [dados, setDados] = useState([]);
const [loading, setLoading] = useState(true);
const [erro, setErro] = useState(null);

useEffect(() => {
  nomeService.getAll()
    .then(res => setDados(res.data))
    .catch(() => setErro('Não foi possível carregar os dados.'))
    .finally(() => setLoading(false));
}, []);

if (loading) return <p>Carregando...</p>;
if (erro) return <p>{erro}</p>;
```

### 3. Ordem de integração no projeto ACIC

| Prioridade | Página | Mock atual | Endpoint |
|-----------|--------|------------|----------|
| 1 | Servicos.jsx + ServicoDetalhe.jsx | servicosMock.js | GET /api/servicos |
| 2 | Eventos.jsx + EventoDetalhe.jsx | eventosMock.js | GET /api/eventos |
| 3 | Home.jsx (slider) | homeMock.js | GET /api/slides |
| 4 | GaleriaPresidentes.jsx | assets locais | GET /api/presidentes |
| 5 | Noticias.jsx (nova) | — | GET /api/noticias |

### 4. Após integrar
- Testar com o Docker rodando localmente
- Remover o import do mock do componente
- NÃO deletar o arquivo de mock ainda (pode ser útil como fallback)

### 5. Verificar no App.jsx
- Se a rota da nova página não existir, adicionar em `App.jsx`
