---
trigger: model_decision
activation: glob
glob: "backend/tsconfig*.json"
description: Configuração correta do TypeScript para NestJS. Ativar sempre que for criar ou editar tsconfig.json no backend.
---

# TypeScript Config — NestJS

## Regra crítica: CommonJS, não ESM/NodeNext

O NestJS **não é compatível** com `"module": "nodenext"` ou `"moduleResolution": "nodenext"`.

### Por que quebra:
- **Decorators** (`@Controller`, `@Injectable`, etc.) foram projetados para compilação CommonJS clássica
- **`moduleResolution: nodenext`** exige `.js` no fim de todos os imports — o `@nestjs/cli` não suporta isso
- **`reflect-metadata`** (usado para injeção de dependência) tem comportamento alterado com nodenext, causando erros como "Nest can't resolve dependencies"
- **`isolatedModules: true`** conflita com `emitDecoratorMetadata`

### tsconfig.json correto para este projeto:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

### Flags a remover/evitar:
- `"module": "nodenext"` ❌
- `"moduleResolution": "nodenext"` ❌
- `"resolvePackageJsonExports": true` ❌ (não necessário com commonjs)
- `"isolatedModules": true` ❌ (conflita com emitDecoratorMetadata)

### tsconfig.build.json (não alterar):
```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
```
