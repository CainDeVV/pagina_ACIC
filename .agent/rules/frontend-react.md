---
activation: glob
glob: "frontend/**/*.{jsx,js,css}"
description: Padrões de código React e Vite do projeto ACIC. Ativar em tarefas de frontend: componentes, páginas, estilos, mocks ou qualquer arquivo em frontend/src/.
---

# Padrões de Frontend — React + Vite

## Componentes
- Sempre componentes funcionais com arrow function ou `function`
- CSS modularizado: cada componente ou página tem seu próprio `.css` na mesma pasta
- Nunca criar CSS inline salvo exceções pontuais de estilo dinâmico
- Usar `react-helmet-async` (já instalado no package.json) — importar `{ Helmet }` de `react-helmet-async` para título de página SEO

## Estrutura de pastas
```
frontend/src/
├── services/          ← camada de API (api.js + *Service.js)
│   ├── api.js         ← instância Axios já criada — SEMPRE importar daqui
│   ├── eventosService.js
│   ├── servicosService.js
│   └── ...
├── mocks/             ← dados temporários — substituir gradualmente por services
├── components/        ← componentes reutilizáveis
│   └── NomeComponente/
│       ├── NomeComponente.jsx
│       └── NomeComponente.css
└── pages/Public/      ← páginas abertas ao público
    └── NomePagina/
        ├── NomePagina.jsx
        └── NomePagina.css
```

## Camada de serviços (services/)
O `api.js` já está criado com Axios e interceptor JWT.
Ao criar um novo service:
```js
// frontend/src/services/eventosService.js
import api from './api';

export const eventosService = {
  getAll: () => api.get('/eventos'),
  getOne: (slug) => api.get(`/eventos/${slug}`),
};
```
**Nunca** fazer chamadas Axios diretamente nos componentes — sempre passar por um service.

## Integração com API (ordem de prioridade)
Substituir mocks pela API real nesta ordem:
1. `Servicos.jsx` + `ServicoDetalhe.jsx` → `GET /api/servicos`
2. `Eventos.jsx` + `EventoDetalhe.jsx` → `GET /api/eventos`
3. `Home.jsx` (slider) → `GET /api/slides`
4. `GaleriaPresidentes.jsx` → `GET /api/presidentes`
5. Página Notícias (nova) → `GET /api/noticias`

Ao integrar, usar `useEffect` + `useState` ou um custom hook:
```jsx
const [dados, setDados] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  servicosService.getAll()
    .then(res => setDados(res.data))
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);
```

## Roteamento
- Usar React Router DOM v6
- Rotas públicas: definidas em `App.jsx`
- Rotas admin (Fase 3): usar componente `PrivateRoute` que verifica token no localStorage
- Chave do token JWT no localStorage: `acic_access_token`

## Painel Admin (Fase 3)
```
pages/Admin/
├── Login.jsx          ← POST /api/auth/login → salva acic_access_token
├── Dashboard.jsx
├── Slides/            ← CRUD
├── Eventos/           ← CRUD
├── Servicos/          ← CRUD
├── Noticias/          ← CRUD
└── Usuarios/          ← só ADMIN
```

## Mocks (situação atual — não remover ainda)
- `mocks/eventosMock.js` → usado em Eventos.jsx, EventoDetalhe.jsx
- `mocks/servicosMock.js` → usado em Servicos.jsx, ServicoDetalhe.jsx
- `mocks/homeMock.js` → usado em Home.jsx
- `mocks/institucionalMock.js` → usado em Diretoria.jsx
- Remover apenas após o service correspondente estar testado e funcionando

## Componentes disponíveis (não recriar)
| Componente | Uso |
|-----------|-----|
| `HeroSlider` | Slider com autoplay, controles, badge colorido |
| `ServiceCard` | Card de serviço com ícone, título e resumo |
| `EventRow` | Linha de listagem de evento com data |
| `NewsCard` | Card de notícia com imagem, título e resumo |
| `DirectorCard` | Card de membro da diretoria |
| `BlockRenderer` | Renderiza JSON do Editor.js em HTML |
| `Breadcrumb` | Navegação de localização |
| `SaibaMaisLayout` | Layout base para páginas institucionais |

## Assets
- Logos: `src/assets/ACIC.png`, `src/assets/ACIC-SOLO.png`, `src/assets/logo.png`
- Galeria de presidentes: `src/assets/galeriaPresidentes/` + `index.js` centralizando imports

## Encoding
- Todos os textos em UTF-8
- Se encontrar `CrateÃºs`, `AssociaÃ§Ã£o`, corrigir para `Crateús`, `Associação`

## Referência visual
- Site da entidade nacional: https://cacb.org.br
- Estrutura de menu e seções do portal seguem o padrão institucional da CACB