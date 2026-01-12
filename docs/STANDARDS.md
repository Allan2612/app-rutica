# Estándares del Proyecto App-Rutica

## 1. Estructura de Archivos
Cada componente/screen debe seguir esta estructura:
```
ComponenteName/
├── index.ts          # Re-exporta el componente
├── ComponentName.tsx # Implementación
└── styles.ts         # Estilos (StyleSheet.create)
```

## 2. Imports
- **SIEMPRE usar alias `@/`** en lugar de rutas relativas `../../../`
- Configurado en `tsconfig.json` → `paths: { "@/*": ["src/*"] }`

### ✅ Correcto:
```typescript
import { colors } from '@/styles/theme/colors';
import { useAuthStore } from '@/store';
import { ProfileCard } from '@/components/user';
```

### ❌ Incorrecto:
```typescript
import { colors } from '../../../styles/theme/colors';
import { useAuthStore } from '../../../store';
```

## 3. Exports
- **Componentes y servicios**: Named exports (`export const/function`)
- **Screens**: Default export (`export default`)
- **Barrel files (index.ts)**: `export *` para re-exportar

### Componentes:
```typescript
// ProfileCard.tsx
export const ProfileCard = memo(function ProfileCard() { ... });

// index.ts
export * from './ProfileCard';
```

### Screens:
```typescript
// ProfileScreen.tsx
export default memo(function ProfileScreen() { ... });

// app/(app)/profile/index.tsx
export { default } from '@/features/user/ProfileScreen';
```

## 4. Colores y Estilos
- **NO usar colores hardcoded** (`#10b981`, `#333`, `#666`)
- **SIEMPRE usar theme**: `colors.primary[500]`, `colors.text.primary`
- **Estilos compartidos**: `src/styles/placeholder-screen-styles.ts` para placeholders

### ✅ Correcto:
```typescript
import { colors } from '@/styles/theme/colors';

backgroundColor: colors.background.primary,
color: colors.text.secondary,
borderColor: colors.border.medium,
```

### ❌ Incorrecto:
```typescript
backgroundColor: '#fff',
color: '#666',
borderColor: '#e5e5e5',
```

## 5. Logging
- **Producción**: Solo `console.error` para errores críticos
- **NO usar**: `console.log` para debug (remover antes de commit)

## 6. TypeScript
- Tipos en `src/types/entities/` y `src/types/enums/`
- Interfaces locales en el mismo archivo del componente
- Props: `ComponentNameProps` interface

## 7. Features Incompletas
Screens que son placeholders (solo texto "Próximamente"):
- `home/screens/HomeScreen`
- `business/screens/BusinessesScreen`
- `events/screens/EventsScreen`
- `attractions/screens/AttractionsScreen`
- `promotions/screens/PromotionsListScreen`

**Todos usan**: `placeholderScreenStyles` de `@/styles/placeholder-screen-styles`
