---
description: Faz o merge de uma branch de feature em develop, resolvendo conflitos e garantindo consistência. Usar ao integrar crud, uniao-correta ou qualquer feature branch.
---

# Workflow: Merge de Branch

> Nota: merge de `crud` → `develop` não é mais prioridade (ver comparação
> em projeto-acic.md). Este workflow continua válido para futuras branches
> como `uniao-correta`.

Use ao integrar uma feature branch em `develop`.

## Situação atual das branches

| Branch | O que tem de único |
|--------|--------------------|
| `origin/crud` | Quase idêntica à `develop` (controllers/services/Swagger iguais) — só difere em `!` nos DTOs, sem impacto. NÃO tem `api.js` nem `jsconfig.json` |
| `origin/develop` | Mais completa: tem `api.js`, `jsconfig.json`, e os mesmos controllers/services/Swagger da `crud` |
| `origin/uniao-correta` | Backend do Cainã sem módulos do Humberto |

## Passos

### 1. Garantir que está em develop e atualizado
```bash
git checkout develop
git pull origin develop
```

### 2. Fazer merge da branch
```bash
git merge origin/crud --no-ff -m "merge: integra crud em develop"
```

### 3. Se houver conflitos
Abrir os arquivos com conflito (`<<<<<<`, `=======`, `>>>>>>>`).
Critérios de resolução para este projeto:
- **DTOs**: praticamente idênticos — manter a versão da `develop`, não usar a da `crud`
- **package.json/package-lock.json**: mesclar manualmente, prefer versões mais novas
- **Páginas do frontend**: prefer `develop` (tem integração mais avançada)
- **tsconfig.json**: prefer `develop` (sem configurações problemáticas)

### 4. Após resolver conflitos
```bash
git add .
git commit -m "merge: resolve conflitos ao integrar crud em develop"
```

### 5. Verificar que o sistema ainda funciona
```bash
docker-compose up -d
# Testar: http://localhost:3000/api/docs
# Testar: http://localhost:5173
```

### 6. Push da branch integrada
```bash
git push origin develop
```

## Itens a verificar após merge
- [ ] `app.module.ts` importa todos os módulos?
- [ ] `package.json` tem `slugify` nas dependencies?
- [ ] Migrations estão aplicadas?
- [ ] Swagger em `/api/docs` lista todos os endpoints?
