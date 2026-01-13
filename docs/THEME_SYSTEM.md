# Sistema de Temas - App Rutica

## 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [Guía de Implementación](#guía-de-implementación)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Ejemplos de Código](#ejemplos-de-código)
7. [Troubleshooting](#troubleshooting)

---

## Resumen Ejecutivo

El sistema de temas de App Rutica implementa un modo oscuro completo con las siguientes características:

- ✅ **Modo light/dark** con soporte para modo automático
- ✅ **Persistencia** de preferencias con AsyncStorage
- ✅ **Colores dinámicos** que responden al cambio de tema
- ✅ **Animaciones suaves** en transiciones
- ✅ **Cross-platform** (iOS, Android, Web)
- ✅ **Sistema centralizado** con Zustand store
- ✅ **35+ componentes** actualizados
- ✅ **Paleta GitHub-inspired** para máxima legibilidad

### Paleta de Colores Dark Mode

El sistema utiliza una paleta inspirada en GitHub Dark y VS Code, probada y optimizada para legibilidad:

**Colores Base:**
- Background primario: `#0d1117` (Negro profundo)
- Background secundario: `#161b22` (Gris muy oscuro)
- Background terciario: `#21262d` (Gris oscuro)
- Texto primario: `#e6edf3` (Blanco brillante)
- Texto secundario: `#8b949e` (Gris medio)
- Texto terciario: `#6e7681` (Gris suave)
- Bordes: `#30363d` / `#3d444d` / `#484f58` (Sutiles pero visibles)
- Accent: `#58a6ff` (Azul brillante para links/accents)

**Ventajas de esta paleta:**
- ✅ Alto contraste WCAG AAA
- ✅ Reduce fatiga visual
- ✅ Usada por millones de desarrolladores
- ✅ Probada en múltiples plataformas

---

## Arquitectura del Sistema

### Estructura de Archivos

```
src/
├── store/
│   └── themeStore.ts          # Store de Zustand con persistencia
├── hooks/
│   ├── useThemedColors.ts     # Hook principal para colores dinámicos
│   ├── use-color-scheme.ts    # Detección de tema (mobile)
│   └── use-color-scheme.web.ts # Detección de tema (web)
├── styles/
│   └── theme/
│       ├── colors.ts          # Paleta de colores light/dark
│       ├── spacing.ts         # Sistema de espaciado
│       ├── typography.ts      # Tipografía
│       └── index.ts           # Exports centralizados
└── components/
    └── layout/
        └── Header/
            └── ThemeToggle/   # Botón de cambio de tema
```

### Flujo de Datos

```
┌─────────────────┐
│  ThemeToggle    │ ──► Cambia modo (light/dark/auto)
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  themeStore     │ ──► Guarda en AsyncStorage
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ useColorScheme  │ ──► Detecta tema del sistema
└─────────────────┘
        │
        ▼
┌─────────────────┐
│useThemedColors  │ ──► Retorna colores dinámicos
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  Componentes    │ ──► Usan colores dinámicos
└─────────────────┘
```

---

## Componentes Principales

### 1. themeStore.ts

**Propósito:** Store de Zustand que maneja el estado global del tema.

**Responsabilidades:**
- Almacenar modo de tema (light/dark/auto)
- Persistir preferencias en AsyncStorage
- Calcular tema efectivo según modo y sistema

**API:**
```typescript
interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  effectiveTheme: 'light' | 'dark';
  isLoaded: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  updateEffectiveTheme: (systemTheme: 'light' | 'dark') => void;
  loadTheme: () => Promise<void>;
}
```

**Key de almacenamiento:** `@app-rutica/theme-mode`

### 2. useThemedColors Hook

**Propósito:** Hook principal que retorna colores dinámicos según el tema actual.

**Retorna:**
```typescript
{
  // Fondos
  background: {
    primary: string,    // Fondo principal
    secondary: string,  // Fondo secundario
    tertiary: string,   // Fondo terciario
  },
  
  // Textos
  text: {
    primary: string,    // Texto principal
    secondary: string,  // Texto secundario
    tertiary: string,   // Texto terciario
    inverse: string,    // Texto inverso
  },
  
  // Bordes
  border: {
    light: string,      // Borde claro
    medium: string,     // Borde medio
    dark: string,       // Borde oscuro
  },
  
  // Colores de marca
  primary: {...},       // Verde principal
  success: string,      // Verde éxito
  warning: string,      // Amarillo advertencia
  error: string,        // Rojo error
  info: string,         // Azul información
  
  // Colores de estado
  status: {...},        // pending, approved, rejected
  
  // Utilidades
  theme: 'light' | 'dark',
  isDark: boolean,
}
```

**Optimización:**
- Usa `useMemo` para evitar recálculos innecesarios
- Solo se recomputa cuando cambia el tema

### 3. useColorScheme Hook

**Propósito:** Detecta el tema del sistema y carga preferencias guardadas.

**Comportamiento:**
- Mobile: Carga tema inmediatamente
- Web: Maneja hidratación del servidor

### 4. ThemeToggle Component

**Propósito:** Botón para cambiar entre modo claro y oscuro.

**Características:**
- Animación de rotación 360° (400ms)
- Icono dinámico (sun/moon)
- Ciclo: light → dark → light

---

## Guía de Implementación

### Paso 1: Crear un Nuevo Componente

#### 1.1 Importar el Hook

```typescript
import { useThemedColors } from '@/hooks';
```

#### 1.2 Usar el Hook en el Componente

```typescript
export const MyComponent = memo(function MyComponent() {
  const colors = useThemedColors();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>
        Hello World
      </Text>
    </View>
  );
});
```

### Paso 2: Actualizar Componente Existente

#### Antes (hardcoded):
```typescript
import { View, Text } from 'react-native';
import { colors } from '@/styles/theme';

export const MyComponent = () => (
  <View style={{ backgroundColor: colors.background.primary }}>
    <Text style={{ color: '#333' }}>Hello</Text>
  </View>
);
```

#### Después (dinámico):
```typescript
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';

export const MyComponent = () => {
  const colors = useThemedColors();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>Hello</Text>
    </View>
  );
};
```

### Paso 3: Estilos con StyleSheet

#### Opción A: Estilos Inline (Recomendado para colores dinámicos)

```typescript
export const MyComponent = memo(function MyComponent() {
  const colors = useThemedColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Title</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
});
```

#### Opción B: Archivo de Estilos Separado

```typescript
// MyComponent.tsx
export const MyComponent = memo(function MyComponent() {
  const colors = useThemedColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Title</Text>
    </View>
  );
});

// styles.ts
import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
});
```

### Paso 4: Componentes con Props de Color

Para componentes que reciben colores como props (iconos, ActivityIndicator):

```typescript
export const MyComponent = memo(function MyComponent() {
  const colors = useThemedColors();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      {/* ActivityIndicator */}
      <ActivityIndicator size="large" color={colors.primary[500]} />
      
      {/* Iconos de Lucide */}
      <User size={24} color={colors.text.primary} />
      <Settings size={20} color={colors.text.secondary} />
      
      {/* TextInput */}
      <TextInput
        placeholder="Buscar..."
        placeholderTextColor={colors.text.tertiary}
        style={{ color: colors.text.primary }}
      />
    </View>
  );
});
```

### Paso 5: Colores Específicos del Tema

Para casos donde light y dark necesitan colores completamente diferentes:

```typescript
export const MyComponent = memo(function MyComponent() {
  const colors = useThemedColors();
  
  // Acceder a la bandera isDark
  const chipBackground = colors.isDark 
    ? colors.primary[900]  // Dark mode: más oscuro
    : colors.primary[50];   // Light mode: más claro
  
  const chipText = colors.isDark
    ? colors.primary[200]  // Dark mode: más claro
    : colors.primary[700]; // Light mode: más oscuro
  
  return (
    <View style={{ backgroundColor: chipBackground }}>
      <Text style={{ color: chipText }}>Chip</Text>
    </View>
  );
});
```

---

## Mejores Prácticas

### ✅ DO: Hacer

1. **Usar `useThemedColors` para todos los colores dinámicos**
   ```typescript
   const colors = useThemedColors();
   backgroundColor: colors.background.primary
   ```

2. **Mantener spacing y typography en archivos de estilos**
   ```typescript
   const styles = StyleSheet.create({
     container: {
       padding: spacing.md,
       fontSize: typography.sizes.lg,
     },
   });
   ```

3. **Usar memo para componentes**
   ```typescript
   export const MyComponent = memo(function MyComponent() { ... });
   ```

4. **Aplicar colores dinámicos con arrays de estilos**
   ```typescript
   <View style={[styles.container, { backgroundColor: colors.background.primary }]} />
   ```

5. **Usar colores de marca desde colors.primary**
   ```typescript
   <ActivityIndicator color={colors.primary[500]} />
   ```

### ❌ DON'T: No Hacer

1. **No importar colors estáticamente en componentes .tsx**
   ```typescript
   // ❌ Mal
   import { colors } from '@/styles/theme';
   backgroundColor: colors.background.primary // No cambia con tema
   ```

2. **No usar colores hardcodeados**
   ```typescript
   // ❌ Mal
   color: '#333333'
   backgroundColor: '#fff'
   borderColor: '#e5e7eb'
   ```

3. **No crear múltiples instancias del hook innecesariamente**
   ```typescript
   // ❌ Mal - múltiples llamadas en el mismo componente
   const colors1 = useThemedColors();
   const colors2 = useThemedColors();
   
   // ✅ Bien - una sola instancia
   const colors = useThemedColors();
   ```

4. **No olvidar colores de placeholder en TextInput**
   ```typescript
   // ❌ Mal
   <TextInput placeholder="..." />
   
   // ✅ Bien
   <TextInput 
     placeholder="..." 
     placeholderTextColor={colors.text.tertiary}
   />
   ```

### Excepciones: Colores Fijos Permitidos

Algunos colores **pueden** permanecer hardcodeados por diseño:

```typescript
// ✅ OK - Rating stars siempre amarillos
<Star size={16} color="#fbbf24" fill="#fbbf24" />

// ✅ OK - Iconos sobre fondos de color fijo
<View style={{ backgroundColor: colors.primary[500] }}>
  <User color="#fff" size={20} /> {/* Blanco sobre verde */}
</View>

// ✅ OK - MapPin sobre gradient oscuro
<LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}>
  <MapPin color="#fff" size={16} />
</LinearGradient>
```

---

## Ejemplos de Código

### Ejemplo 1: Screen Completa

```typescript
// ProfileScreen.tsx
import { memo } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import styles from './styles';

export default memo(function ProfileScreen() {
  const colors = useThemedColors();
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Screen>
        <BaseHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Cargando perfil...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BaseHeader />
      <ScrollView 
        style={[styles.scrollContainer, { backgroundColor: colors.background.primary }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Mi Perfil
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {user?.email}
          </Text>
        </View>
        
        <ProfileCard profile={profile} />
      </ScrollView>
    </Screen>
  );
});
```

### Ejemplo 2: Componente UI

```typescript
// BusinessCard.tsx
import { memo } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const BusinessCard = memo(function BusinessCard({
  name,
  description,
  imageUrl,
  rating = 4.5,
  onPress,
}) {
  const colors = useThemedColors();
  
  return (
    <Pressable 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.background.primary,
          borderColor: colors.border.medium,
        }
      ]} 
      onPress={onPress}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]} />
      )}
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {name}
        </Text>
        
        {description && (
          <Text 
            style={[styles.description, { color: colors.text.secondary }]} 
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <Star size={16} color="#fbbf24" fill="#fbbf24" />
          <Text style={[styles.rating, { color: colors.text.primary }]}>
            {rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
```

### Ejemplo 3: Componente con Inputs

```typescript
// SearchBar.tsx
import { memo, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const SearchBar = memo(function SearchBar({ onSearch }) {
  const [text, setText] = useState('');
  const colors = useThemedColors();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.medium,
        }
      ]}
    >
      <Search size={20} color={colors.text.tertiary} />
      
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Buscar..."
        placeholderTextColor={colors.text.tertiary}
        style={[
          styles.input,
          { color: colors.text.primary }
        ]}
      />
    </View>
  );
});
```

### Ejemplo 4: Listas con Chips

```typescript
// CategoryFilter.tsx
import { memo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useThemedColors } from '@/hooks';

export const CategoryFilter = memo(function CategoryFilter({
  categories,
  selectedIds,
  onToggle,
}) {
  const colors = useThemedColors();
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((cat) => {
        const isSelected = selectedIds.includes(cat.id);
        
        return (
          <Pressable
            key={cat.id}
            onPress={() => onToggle(cat.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: isSelected 
                ? colors.primary[500] 
                : colors.border.light,
              backgroundColor: isSelected 
                ? (colors.isDark ? colors.primary[900] : colors.primary[50])
                : colors.background.primary,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: isSelected 
                  ? (colors.isDark ? colors.primary[200] : colors.primary[700])
                  : colors.text.tertiary,
                fontSize: 14,
                fontWeight: isSelected ? '600' : '400',
              }}
            >
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});
```

---

## Troubleshooting

### Problema: Los colores no cambian al alternar el tema

**Causa:** El componente importa colores estáticamente.

**Solución:**
```typescript
// ❌ Antes
import { colors } from '@/styles/theme';

// ✅ Después
import { useThemedColors } from '@/hooks';

export const MyComponent = () => {
  const colors = useThemedColors();
  // ...
};
```

### Problema: El tema no persiste al cerrar la app

**Causa:** AsyncStorage no está guardando correctamente.

**Verificar:**
1. El hook `useColorScheme` está siendo llamado en algún lugar
2. La función `loadTheme()` se ejecuta al iniciar
3. No hay errores en consola relacionados con AsyncStorage

**Solución:**
```typescript
// En _layout.tsx o componente raíz
useEffect(() => {
  const { loadTheme } = useThemeStore.getState();
  loadTheme();
}, []);
```

### Problema: Parpadeo al cargar la app

**Causa:** El tema no se carga antes de renderizar.

**Solución:** El hook `useColorScheme` maneja esto automáticamente con `isLoaded`. Asegúrate de que se use en el componente raíz.

### Problema: Colores incorrectos en modo oscuro

**Causa:** Valores hardcodeados o colores light usados en dark.

**Solución:**
```typescript
// ✅ Usar colores adaptativos
const chipBg = colors.isDark 
  ? colors.primary[900]  // Oscuro en dark mode
  : colors.primary[50];   // Claro en light mode
```

### Problema: Performance lenta al cambiar tema

**Causa:** Re-renders innecesarios.

**Solución:**
- Usar `memo` en componentes
- `useThemedColors` ya usa `useMemo`
- Evitar crear objetos de estilo en cada render

```typescript
// ❌ Mal - crea nuevo objeto cada render
<View style={{ backgroundColor: colors.background.primary }} />

// ✅ Mejor - reutiliza estilos
<View style={[styles.container, { backgroundColor: colors.background.primary }]} />
```

---

## Checklist para Nuevos Componentes

Al crear o actualizar un componente, verifica:

- [ ] Importa `useThemedColors` desde `@/hooks`
- [ ] Usa `colors` dinámicos en vez de valores hardcodeados
- [ ] Aplica `placeholderTextColor` en TextInput
- [ ] Aplica `color` dinámico en iconos
- [ ] Usa `memo` para optimización
- [ ] Mantiene spacing/typography en StyleSheet
- [ ] No importa `colors` estáticamente en .tsx
- [ ] Testea en modo light y dark
- [ ] Verifica que se vea bien en ambos temas

---

## Referencias Rápidas

### Colores Comunes

```typescript
const colors = useThemedColors();

// Fondos
colors.background.primary   // Fondo principal
colors.background.secondary // Fondo secundario
colors.background.tertiary  // Fondo terciario

// Textos
colors.text.primary   // Texto principal
colors.text.secondary // Texto secundario
colors.text.tertiary  // Texto terciario (placeholders)

// Bordes
colors.border.light   // Borde claro
colors.border.medium  // Borde medio
colors.border.dark    // Borde oscuro

// Marca
colors.primary[500]   // Verde principal
colors.primary[700]   // Verde oscuro
colors.primary[50]    // Verde muy claro

// Semánticos
colors.success  // Verde éxito
colors.error    // Rojo error
colors.warning  // Amarillo advertencia
colors.info     // Azul información

// Utilidades
colors.isDark   // boolean
colors.theme    // 'light' | 'dark'
```

### Imports Comunes

```typescript
// Hook principal
import { useThemedColors } from '@/hooks';

// Store (raramente necesario)
import { useThemeStore } from '@/store';

// Sistema de estilos
import { spacing, typography } from '@/styles/theme';
```

---

## Conclusión

El sistema de temas de App Rutica está diseñado para ser:
- **Simple**: Un solo hook `useThemedColors` para la mayoría de casos
- **Consistente**: Mismos patrones en toda la app
- **Performante**: Optimizado con memo y useMemo
- **Extensible**: Fácil de agregar nuevos colores o modos

Para cualquier duda, revisa los componentes existentes como referencia:
- `BusinessCard` - Componente UI complejo
- `BaseHeader` - Header con múltiples elementos
- `CategorySearchBar` - Inputs y chips dinámicos
- `BusinessesScreen` - Screen completa con loading

**Última actualización:** Enero 2026
