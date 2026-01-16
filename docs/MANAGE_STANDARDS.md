# Estándares para Módulos de Gestión (Manage)

> **Fecha de creación:** 16 de enero de 2026  
> **Versión:** 1.0.0  
> **Propósito:** Definir la estructura y estándares para crear y mantener módulos de gestión (manage) en la aplicación Rutica.

---

## 📋 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Estructura de Archivos](#-estructura-de-archivos)
3. [Componentes Reutilizables](#-componentes-reutilizables)
4. [Convenciones de Nombres](#-convenciones-de-nombres)
5. [Patrones de Formularios](#-patrones-de-formularios)
6. [Servicios y Hooks](#-servicios-y-hooks)
7. [Guía de Implementación](#-guía-de-implementación)
8. [Checklist de Calidad](#-checklist-de-calidad)

---

## 🎯 Visión General

Los módulos de gestión (manage) siguen una arquitectura limpia y reutilizable que permite crear, editar, eliminar y listar entidades de forma consistente. Actualmente implementado para:

- ✅ **Negocios (Business)** - Completamente implementado
- ✅ **Eventos (Events)** - Completamente implementado
- 🔲 **Atracciones (Attractions)** - Pendiente
- 🔲 **Promociones (Promotions)** - Pendiente
- 🔲 **Productos (Products)** - Pendiente

### Principios Fundamentales

1. **DRY (Don't Repeat Yourself):** Reutilizar componentes y lógica
2. **Separación de Responsabilidades:** UI, lógica de negocio y datos separados
3. **Consistencia Visual:** Todos los formularios siguen el mismo diseño
4. **Type Safety:** TypeScript en todos los archivos
5. **Testeable:** Componentes y hooks desacoplados

---

## 📁 Estructura de Archivos

### Estructura Estándar de un Módulo Manage

```
src/
├── features/
│   └── {entity}/                    # Ej: attractions, promotions, products
│       ├── hooks/
│       │   ├── index.ts             # Re-export de todos los hooks
│       │   ├── useCategories.ts     # (Opcional) Si usa categorías
│       │   ├── useCreate{Entity}Form.ts
│       │   ├── useEdit{Entity}Form.ts
│       │   ├── useCreate{Entity}.ts
│       │   ├── useUpdate{Entity}.ts
│       │   ├── useDelete{Entity}.ts
│       │   └── useUser{Entities}.ts # Lista de entidades del usuario
│       ├── services/
│       │   ├── index.ts
│       │   ├── {entity}.service.ts
│       │   ├── create{Entity}.service.ts
│       │   └── user{Entities}.service.ts
│       └── screens/
│           ├── Add{Entity}Screen/
│           │   ├── Add{Entity}Screen.tsx
│           │   └── index.ts
│           ├── Edit{Entity}Screen/
│           │   ├── Edit{Entity}Screen.tsx
│           │   ├── styles.ts
│           │   └── index.ts
│           └── Manage{Entities}Screen/
│               ├── Manage{Entities}Screen.tsx
│               ├── styles.ts
│               └── index.ts
├── components/
│   └── {entity}/
│       ├── index.ts
│       ├── {Entity}FormView/        # Vista de formulario específica
│       │   ├── {Entity}FormView.tsx
│       │   ├── styles.ts           # Re-exporta form-view-styles
│       │   └── index.ts
│       ├── User{Entity}Card/       # Card para lista de usuario
│       │   ├── User{Entity}Card.tsx
│       │   ├── styles.ts
│       │   └── index.ts
│       └── {Entity}Card/           # (Opcional) Card para público
│           ├── {Entity}Card.tsx
│           ├── styles.ts
│           └── index.ts
└── app/
    └── (app)/(tabs)/manage/
        └── {entities}/             # Ej: attractions, promotions
            ├── index.tsx           # Lista (ManageScreen)
            ├── add.tsx             # Crear nuevo
            └── [id]/
                └── edit.tsx        # Editar existente
```

---

## 🧩 Componentes Reutilizables

### Core Components (Ya disponibles en `/components/manage/`)

Estos componentes **DEBEN** ser reutilizados en todos los módulos:

#### 1. **GenericFormView**
Wrapper para todos los formularios de gestión.

```typescript
import { GenericFormView } from '@/components/manage';

<GenericFormView
    title="Agregar {Entity}"
    subtitle="Completa la información..."
    isSubmitting={isSubmitting}
    hasChanges={hasChanges}
    submitLabel="Crear {Entity}"
    onCancel={handleCancel}
    onSubmit={handleSubmit}
>
    {/* Secciones del formulario */}
</GenericFormView>
```

#### 2. **BasicInfoSection**
Campos de nombre y descripción (genérico y configurable).

```typescript
import { BasicInfoSection } from '@/components/manage';

<BasicInfoSection
    name={formData.name}
    description={formData.description}
    onNameChange={(text) => onFieldChange('name', text)}
    onDescriptionChange={(text) => onFieldChange('description', text)}
    errors={errors}
    nameLabel="Nombre de la Atracción"           // Configurable
    namePlaceholder="Ej: Volcán Arenal"         // Configurable
    descriptionPlaceholder="Describe..."         // Configurable
    sectionTitle="Información Básica"            // Opcional
    nameRequired={true}                          // Default: true
/>
```

#### 3. **CategorySection**
Selector de categorías (si aplica).

```typescript
import { CategorySection } from '@/components/manage';

<CategorySection
    categories={categories}
    selectedIds={formData.selectedCategoryIds}
    onSelectionChange={(ids) => onFieldChange('selectedCategoryIds', ids)}
    isLoading={loadingCategories}
    error={errors.categories}
/>
```

#### 4. **ImageSection**
Selector de imágenes (logo, cover, gallery).

```typescript
import { ImageSection } from '@/components/manage';

// Con logo (para negocios)
<ImageSection
    logoUri={formData.logoUri}
    coverUri={formData.coverUri}
    galleryUris={formData.galleryUris}
    onLogoChange={(uri) => onFieldChange('logoUri', uri)}
    onCoverChange={(uri) => onFieldChange('coverUri', uri)}
    onGalleryChange={(uris) => onFieldChange('galleryUris', uris)}
    showLogo={true}  // Default
/>

// Sin logo (para eventos, atracciones)
<ImageSection
    coverUri={formData.coverUri}
    galleryUris={formData.galleryUris}
    onCoverChange={(uri) => onFieldChange('coverUri', uri)}
    onGalleryChange={(uris) => onFieldChange('galleryUris', uris)}
    showLogo={false}
    sectionTitle="Imágenes de la Atracción"
/>
```

#### 5. **LocationSection**
Selector de ubicación con mapa.

```typescript
import { LocationSection } from '@/components/manage';

<LocationSection
    onLocationSelect={handleLocationSelect}
    initialLatitude={formData.coordinates?.latitude}
    initialLongitude={formData.coordinates?.longitude}
    error={errors.location}
/>
```

#### 6. **ContactSection**
Campos de contacto (teléfono, email, website).

```typescript
import { ContactSection } from '@/components/manage';

<ContactSection
    phone={formData.phone}
    email={formData.email}
    website={formData.website}
    onPhoneChange={(text) => onFieldChange('phone', text)}
    onEmailChange={(text) => onFieldChange('email', text)}
    onWebsiteChange={(text) => onFieldChange('website', text)}
/>
```

#### 7. **SocialLinksSection**
Redes sociales (Facebook, Instagram, TikTok).

```typescript
import { SocialLinksSection } from '@/components/manage';

<SocialLinksSection
    facebook={formData.facebook}
    instagram={formData.instagram}
    tiktok={formData.tiktok}
    onFacebookChange={(text) => onFieldChange('facebook', text)}
    onInstagramChange={(text) => onFieldChange('instagram', text)}
    onTiktokChange={(text) => onFieldChange('tiktok', text)}
/>
```

#### 8. **ConfirmDeleteDialog**
Diálogo de confirmación para eliminar.

```typescript
import { ConfirmDeleteDialog } from '@/components/manage';

<ConfirmDeleteDialog
    visible={!!deleteDialog}
    entityName={deleteDialog?.name || ''}
    entityType="atracción"  // "negocio" | "evento" | "atracción" | "promoción" | "producto"
    onConfirm={handleConfirmDelete}
    onCancel={() => setDeleteDialog(null)}
    isDeleting={!!deletingId}
/>
```

### Estilos Compartidos

**Usar estilos centralizados:**

```typescript
// Para secciones de formulario
import { formSectionStyles } from '@/styles/form-section-styles';

// Para FormViews completos
import { formViewStyles } from '@/styles/form-view-styles';
```

---

## 📝 Convenciones de Nombres

### Archivos y Carpetas

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Feature folder | `{entity}` (singular) | `attractions/`, `promotions/` |
| Screen | `{Action}{Entity}Screen` | `AddAttractionScreen`, `EditProductScreen` |
| Component | `{Entity}{Type}` | `AttractionFormView`, `UserProductCard` |
| Hook | `use{Action}{Entity}` | `useCreateAttraction`, `useUserPromotions` |
| Service | `{entity}.service.ts` | `attraction.service.ts` |
| Type Interface | `{Entity}FormData`, `{Entity}FormErrors` | `AttractionFormData` |

### Rutas (Expo Router)

```
app/(app)/(tabs)/manage/{entities}/
├── index.tsx           → /(app)/(tabs)/manage/attractions
├── add.tsx             → /(app)/(tabs)/manage/attractions/add
└── [id]/
    └── edit.tsx        → /(app)/(tabs)/manage/attractions/:id/edit
```

### Variables y Funciones

```typescript
// ✅ CORRECTO
const handleCreateAttraction = () => {};
const attractionFormData: AttractionFormData = {};
const { data: attractions } = useUserAttractions();

// ❌ INCORRECTO
const handleCreate = () => {};           // Poco descriptivo
const data: FormData = {};               // Nombre genérico
const { data } = useAttractions();       // Sin alias
```

---

## 🎨 Patrones de Formularios

### Patrón 1: Formulario de Creación (Add)

```tsx
import { memo } from 'react';
import { useRouter } from 'expo-router';
import { useCreateAttractionForm } from '@/features/attractions/hooks';
import { AttractionFormView } from '@/components/attractions';

export const AddAttractionScreen = memo(function AddAttractionScreen() {
    const router = useRouter();
    const {
        categories,
        loadingCategories,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        isSubmitting,
        hasChanges,
    } = useCreateAttractionForm();

    return (
        <AttractionFormView
            title="Agregar Atracción"
            subtitle="Completa la información para agregar una nueva atracción turística"
            formData={formData}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel="Crear Atracción"
            onFieldChange={updateField}
            onLocationSelect={handleLocationSelect}
            onCancel={() => router.push('/(app)/(tabs)/manage/attractions')}
            onSubmit={handleSubmit}
        />
    );
});
```

### Patrón 2: FormView Component

```tsx
import { memo } from 'react';
import {
    BasicInfoSection,
    CategorySection,
    ImageSection,
    LocationSection,
    ContactSection,
    SocialLinksSection,
    GenericFormView,
} from '@/components/manage';
// Importar secciones específicas si las hay
import { AttractionTypeSection } from '@/components/attractions';

interface AttractionFormViewProps {
    title: string;
    subtitle: string;
    formData: AttractionFormData;
    errors: AttractionFormErrors;
    categories: CategoryItem[];
    loadingCategories: boolean;
    isSubmitting: boolean;
    hasChanges: boolean;
    submitLabel: string;
    onFieldChange: (field: keyof AttractionFormData, value: any) => void;
    onLocationSelect: (location: any) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export const AttractionFormView = memo(function AttractionFormView({
    title,
    subtitle,
    formData,
    errors,
    categories,
    loadingCategories,
    isSubmitting,
    hasChanges,
    submitLabel,
    onFieldChange,
    onLocationSelect,
    onCancel,
    onSubmit,
}: AttractionFormViewProps) {
    return (
        <GenericFormView
            title={title}
            subtitle={subtitle}
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel={submitLabel}
            onCancel={onCancel}
            onSubmit={onSubmit}
        >
            <BasicInfoSection
                name={formData.name}
                description={formData.description}
                onNameChange={(text) => onFieldChange('name', text)}
                onDescriptionChange={(text) => onFieldChange('description', text)}
                errors={errors}
                nameLabel="Nombre de la Atracción"
                namePlaceholder="Ej: Volcán Arenal"
            />

            <CategorySection
                categories={categories}
                selectedIds={formData.selectedCategoryIds}
                onSelectionChange={(ids) => onFieldChange('selectedCategoryIds', ids)}
                isLoading={loadingCategories}
                error={errors.categories}
            />

            {/* Secciones específicas de la entidad */}
            <AttractionTypeSection
                type={formData.type}
                onTypeChange={(type) => onFieldChange('type', type)}
            />

            <ImageSection
                coverUri={formData.coverUri}
                galleryUris={formData.galleryUris}
                onCoverChange={(uri) => onFieldChange('coverUri', uri)}
                onGalleryChange={(uris) => onFieldChange('galleryUris', uris)}
                showLogo={false}
                sectionTitle="Imágenes de la Atracción"
            />

            <LocationSection
                onLocationSelect={onLocationSelect}
                initialLatitude={formData.coordinates?.latitude}
                initialLongitude={formData.coordinates?.longitude}
                error={errors.location}
            />

            <ContactSection
                phone={formData.phone}
                email={formData.email}
                website={formData.website}
                onPhoneChange={(text) => onFieldChange('phone', text)}
                onEmailChange={(text) => onFieldChange('email', text)}
                onWebsiteChange={(text) => onFieldChange('website', text)}
            />

            <SocialLinksSection
                facebook={formData.facebook}
                instagram={formData.instagram}
                tiktok={formData.tiktok}
                onFacebookChange={(text) => onFieldChange('facebook', text)}
                onInstagramChange={(text) => onFieldChange('instagram', text)}
                onTiktokChange={(text) => onFieldChange('tiktok', text)}
            />
        </GenericFormView>
    );
});
```

### Patrón 3: Hook de Formulario

```typescript
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCategories } from './useCategories';
import { useCreateAttraction } from './useCreateAttraction';
import type { CreateAttractionData } from '../services';

interface FormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    type: 'natural' | 'cultural' | 'adventure' | null;
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string;
    coordinates: { latitude: number; longitude: number } | null;
    phone: string;
    email: string;
    website: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    coverUri: string | null;
    galleryUris: string[];
}

interface FormErrors {
    name?: string;
    categories?: string;
    location?: string;
    type?: string;
}

const initialFormData: FormData = {
    name: '',
    description: '',
    selectedCategoryIds: [],
    type: null,
    province: null,
    canton: null,
    district: null,
    address: '',
    coordinates: null,
    phone: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    coverUri: null,
    galleryUris: [],
};

export function useCreateAttractionForm() {
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const createMutation = useCreateAttraction();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});

    const hasChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialFormData);
    }, [formData]);

    const updateField = useCallback(
        <K extends keyof FormData>(field: K, value: FormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (errors[field as keyof FormErrors]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        },
        [errors]
    );

    const handleLocationSelect = useCallback((location: any) => {
        setFormData((prev) => ({
            ...prev,
            province: location.province || prev.province,
            canton: location.canton || prev.canton,
            district: location.district || prev.district,
            address: location.address || prev.address,
            coordinates: location.latitude && location.longitude
                ? { latitude: location.latitude, longitude: location.longitude }
                : prev.coordinates,
        }));
    }, []);

    const validate = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (formData.selectedCategoryIds.length === 0) {
            newErrors.categories = 'Debe seleccionar al menos una categoría';
        }

        if (!formData.coordinates) {
            newErrors.location = 'La ubicación es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
        if (!validate()) {
            Toast.show({
                type: 'error',
                text1: 'Campos requeridos',
                text2: 'Por favor completa todos los campos obligatorios',
            });
            return;
        }

        try {
            const dataToSubmit: CreateAttractionData = {
                name: formData.name,
                description: formData.description || null,
                category_ids: formData.selectedCategoryIds,
                type: formData.type,
                province: formData.province!,
                canton: formData.canton!,
                district: formData.district!,
                address: formData.address || null,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
                phone: formData.phone || null,
                email: formData.email || null,
                website: formData.website || null,
                facebook_url: formData.facebook || null,
                instagram_url: formData.instagram || null,
                tiktok_url: formData.tiktok || null,
                cover_image_uri: formData.coverUri,
                gallery_image_uris: formData.galleryUris,
            };

            await createMutation.mutateAsync(dataToSubmit);

            Toast.show({
                type: 'success',
                text1: '¡Atracción creada!',
                text2: 'La atracción se ha agregado exitosamente',
            });

            router.push('/(app)/(tabs)/manage/attractions');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo crear la atracción',
            });
        }
    }, [formData, validate, createMutation, router]);

    return {
        categories,
        loadingCategories,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        isSubmitting: createMutation.isPending,
        hasChanges,
    };
}
```

---

## 🔌 Servicios y Hooks

### Estructura de Servicios

```typescript
// {entity}.service.ts - Servicio principal
export interface Attraction {
    id: string;
    name: string;
    description: string | null;
    type: 'natural' | 'cultural' | 'adventure';
    // ... otros campos
}

export interface CreateAttractionData {
    name: string;
    description: string | null;
    // ... campos requeridos
}

export interface UpdateAttractionData extends Partial<CreateAttractionData> {}
```

### Hooks Requeridos

1. **useCreate{Entity}** - Mutación para crear
2. **useUpdate{Entity}** - Mutación para actualizar
3. **useDelete{Entity}** - Mutación para eliminar
4. **useUser{Entities}** - Query para listar entidades del usuario
5. **useCreate{Entity}Form** - Hook de formulario de creación
6. **useEdit{Entity}Form** - Hook de formulario de edición

---

## 🚀 Guía de Implementación

### Pasos para Crear un Nuevo Módulo Manage

#### 1. **Definir el Modelo de Datos**

```typescript
// src/features/attractions/services/attraction.service.ts
export interface Attraction {
    id: string;
    name: string;
    description: string | null;
    type: 'natural' | 'cultural' | 'adventure';
    cover_image_url: string | null;
    // ... campos específicos
}
```

#### 2. **Crear Servicios**

- `{entity}.service.ts` - CRUD operations
- `user{Entities}.service.ts` - User-specific queries

#### 3. **Crear Hooks**

- `useCreate{Entity}.ts`
- `useUpdate{Entity}.ts`
- `useDelete{Entity}.ts`
- `useUser{Entities}.ts`
- `useCreate{Entity}Form.ts`
- `useEdit{Entity}Form.ts`

#### 4. **Crear Componentes**

```
components/{entity}/
├── {Entity}FormView/        # Reutiliza componentes de manage
├── User{Entity}Card/        # Para lista de usuario
└── {Entity}SpecificSection/ # Solo si necesita campos específicos
```

#### 5. **Crear Screens**

```
features/{entity}/screens/
├── Add{Entity}Screen/
├── Edit{Entity}Screen/
└── Manage{Entities}Screen/
```

#### 6. **Configurar Rutas**

```
app/(app)/(tabs)/manage/{entities}/
├── index.tsx
├── add.tsx
└── [id]/edit.tsx
```

---

## ✅ Checklist de Calidad

### Antes de Considerar el Módulo Completo

- [ ] **Reutilización de Componentes**
  - [ ] Usa `GenericFormView`
  - [ ] Usa `BasicInfoSection`
  - [ ] Usa `ImageSection` con configuración apropiada
  - [ ] Usa `LocationSection` si aplica
  - [ ] Usa `ContactSection` si aplica
  - [ ] Usa `SocialLinksSection` si aplica
  - [ ] Usa `CategorySection` si aplica
  - [ ] Usa `ConfirmDeleteDialog`

- [ ] **Estructura de Archivos**
  - [ ] Sigue la estructura estándar definida
  - [ ] Todos los archivos tienen `index.ts` para exports

- [ ] **Convenciones de Nombres**
  - [ ] Nombres consistentes con el patrón
  - [ ] TypeScript interfaces con sufijos apropiados

- [ ] **Funcionalidad**
  - [ ] CRUD completo (Create, Read, Update, Delete)
  - [ ] Validación de formularios
  - [ ] Manejo de errores con Toast
  - [ ] Loading states
  - [ ] Confirmación antes de eliminar

- [ ] **TypeScript**
  - [ ] Sin errores de tipos
  - [ ] Interfaces bien definidas
  - [ ] No usar `any` sin justificación

- [ ] **Estilos**
  - [ ] Usa estilos centralizados cuando sea posible
  - [ ] Consistencia visual con otros módulos

- [ ] **Testing** (Opcional pero recomendado)
  - [ ] Hooks tienen pruebas unitarias
  - [ ] Servicios tienen pruebas de integración

---

## 📚 Referencias

### Módulos de Referencia

- **Business (Negocios):** Módulo completo con todas las características
- **Events (Eventos):** Módulo con campos específicos (fechas, precios)

### Archivos Clave

- `/src/components/manage/` - Componentes reutilizables
- `/src/styles/form-section-styles.ts` - Estilos compartidos de secciones
- `/src/styles/form-view-styles.ts` - Estilos compartidos de formularios
- `/docs/MANAGE_HUB.md` - Documentación del hub de gestión

---

## 🔄 Actualizaciones del Documento

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2026-01-16 | Versión inicial del documento de estándares |

---

## 💡 Consejos y Mejores Prácticas

### 1. **Comienza Simple**
No agregues campos específicos desde el inicio. Primero implementa con los componentes básicos y luego extiende según necesidades.

### 2. **Reutiliza, No Dupliques**
Antes de crear un nuevo componente, verifica si puedes configurar uno existente.

### 3. **Mantén la Consistencia**
Todos los módulos deben verse y sentirse similares. Los usuarios deben poder navegar entre ellos intuitivamente.

### 4. **Documenta lo Específico**
Si tu módulo tiene lógica específica no cubierta aquí, documéntala en un README dentro del feature.

### 5. **Prueba con Datos Reales**
Asegúrate de probar con diferentes tipos de datos y casos extremos.
