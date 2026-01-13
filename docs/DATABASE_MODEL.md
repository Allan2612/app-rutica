# Modelo de Base de Datos - Rutica

Este documento describe el modelo de datos completo de la aplicación Rutica.

## Convención de Nomenclatura

Todas las tablas y columnas siguen un patrón consistente:
- **Tablas**: nombre en inglés, snake_case, plural
- **Columnas**: `nombre_columna_SUFIJO` donde SUFIJO es un código de 3 letras que identifica la tabla
- **Claves primarias**: `id_SUFIJO`
- **Timestamps**: `created_at_SUFIJO`, `updated_at_SUFIJO`

### Sufijos de Tablas

| Sufijo | Tabla |
|--------|-------|
| PRF | profiles |
| LOC | locations |
| BUS | businesses |
| BCA | business_categories |
| BIM | business_images |
| BSL | business_social_links |
| PRD | products |
| PCA | product_categories |
| PIM | product_images |
| PCM | product_category_map |
| ATR | attractions |
| ACA | attraction_categories |
| AIM | attraction_images |
| EVT | events |
| EIM | event_images |
| PRM | promotions |
| PPR | promotion_products |
| PCR | promotion_categories |
| PCI | promotion_combo_items |
| BRV | business_reviews |
| PRV | product_reviews |
| ARV | attraction_reviews |
| ERV | event_reviews |

---

## Tipos Enumerados (ENUMs)

```typescript
// Rol del usuario en el sistema
type UserRole = 'buyer' | 'seller' | 'admin';

// Estado de moderación para negocios, atracciones, promociones
type ModerationStatus = 'pending' | 'approved' | 'rejected';

// Alcance de una promoción
type PromoScope = 'general' | 'product' | 'category' | 'combo';

// Tipo de descuento
type DiscountType = 'none' | 'percentage' | 'fixed';

// Tipo de posicionamiento/promoción destacada
type PlacementType = 'none' | 'search_boost' | 'featured';

// Estado de pago de una promoción
type PromoPaymentState = 'unpaid' | 'paid' | 'rejected';

// Tipo de evento
type EventType = 'festival' | 'market' | 'concert' | 'workshop' | 'tour' | 'other';
```

---

## Tablas

### profiles (PRF)

Almacena la información de los usuarios registrados.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_PRF` | uuid | NO | - | PK, referencia a auth.users.id |
| `first_name_PRF` | text | NO | - | Nombre del usuario |
| `last_name1_PRF` | text | NO | - | Primer apellido |
| `last_name2_PRF` | text | SI | NULL | Segundo apellido (opcional) |
| `phone_number_PRF` | text | SI | NULL | Número de teléfono |
| `role_PRF` | user_role | NO | 'buyer' | Rol del usuario |
| `is_active_PRF` | boolean | NO | true | Usuario activo/inactivo |
| `created_at_PRF` | timestamptz | NO | now() | Fecha de creación |
| `updated_at_PRF` | timestamptz | NO | now() | Última actualización |

**Índices:**
- PK: `id_PRF`

---

### locations (LOC)

Almacena ubicaciones geográficas reutilizables.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_LOC` | uuid | NO | gen_random_uuid() | PK |
| `country_LOC` | text | SI | 'Costa Rica' | País |
| `province_LOC` | text | SI | NULL | Provincia |
| `canton_LOC` | text | SI | NULL | Cantón |
| `district_LOC` | text | SI | NULL | Distrito |
| `address_LOC` | text | SI | NULL | Dirección detallada |
| `latitude_LOC` | double precision | NO | - | Latitud |
| `longitude_LOC` | double precision | NO | - | Longitud |
| `created_at_LOC` | timestamptz | NO | now() | Fecha de creación |

---

### business_categories (BCA)

Categorías para clasificar negocios.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_BCA` | uuid | NO | gen_random_uuid() | PK |
| `name_BCA` | text | NO | - | Nombre de la categoría (único) |

---

### businesses (BUS)

Negocios registrados en la plataforma.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_BUS` | uuid | NO | gen_random_uuid() | PK |
| `owner_id_BUS` | uuid | NO | - | FK → profiles.id_PRF |
| `name_BUS` | text | NO | - | Nombre del negocio |
| `description_BUS` | text | SI | NULL | Descripción |
| `category_id_BUS` | uuid | SI | NULL | FK → business_categories.id_BCA |
| `location_id_BUS` | uuid | SI | NULL | FK → locations.id_LOC |
| `whatsapp_phone_BUS` | text | SI | NULL | Teléfono WhatsApp |
| `contact_phone_BUS` | text | SI | NULL | Teléfono de contacto |
| `contact_email_BUS` | text | SI | NULL | Email de contacto |
| `website_BUS` | text | SI | NULL | Sitio web |
| `moderation_status_BUS` | moderation_status | NO | 'pending' | Estado de moderación |
| `reviewed_by_BUS` | uuid | SI | NULL | FK → profiles.id_PRF (admin) |
| `reviewed_at_BUS` | timestamptz | SI | NULL | Fecha de revisión |
| `moderation_note_BUS` | text | SI | NULL | Nota de moderación |
| `is_active_BUS` | boolean | NO | true | Negocio activo |
| `created_at_BUS` | timestamptz | NO | now() | Fecha de creación |
| `updated_at_BUS` | timestamptz | NO | now() | Última actualización |

---

### business_images (BIM)

Imágenes de negocios almacenadas en Storage.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_BIM` | uuid | NO | gen_random_uuid() | PK |
| `business_id_BIM` | uuid | NO | - | FK → businesses.id_BUS |
| `bucket_BIM` | text | NO | - | Nombre del bucket en Storage |
| `path_BIM` | text | NO | - | Ruta del archivo en Storage |
| `sort_order_BIM` | integer | NO | 0 | Orden de visualización |
| `created_at_BIM` | timestamptz | NO | now() | Fecha de creación |

---

### business_social_links (BSL)

Enlaces a redes sociales de negocios.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_BSL` | uuid | NO | gen_random_uuid() | PK |
| `business_id_BSL` | uuid | NO | - | FK → businesses.id_BUS |
| `platform_BSL` | text | NO | - | Plataforma (facebook, instagram, etc.) |
| `url_BSL` | text | NO | - | URL del perfil |

---

### product_categories (PCA)

Categorías para clasificar productos.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_PCA` | uuid | NO | gen_random_uuid() | PK |
| `name_PCA` | text | NO | - | Nombre de la categoría (único) |

---

### products (PRD)

Productos ofrecidos por los negocios.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_PRD` | uuid | NO | gen_random_uuid() | PK |
| `business_id_PRD` | uuid | NO | - | FK → businesses.id_BUS |
| `name_PRD` | text | NO | - | Nombre del producto |
| `description_PRD` | text | SI | NULL | Descripción |
| `price_PRD` | numeric(12,2) | NO | - | Precio |
| `currency_PRD` | text | NO | 'CRC' | Moneda (CRC, USD) |
| `is_active_PRD` | boolean | NO | true | Producto activo |
| `created_at_PRD` | timestamptz | NO | now() | Fecha de creación |
| `updated_at_PRD` | timestamptz | NO | now() | Última actualización |

---

### product_images (PIM)

Imágenes de productos.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_PIM` | uuid | NO | gen_random_uuid() | PK |
| `product_id_PIM` | uuid | NO | - | FK → products.id_PRD |
| `bucket_PIM` | text | NO | - | Nombre del bucket |
| `path_PIM` | text | NO | - | Ruta del archivo |
| `sort_order_PIM` | integer | NO | 0 | Orden de visualización |
| `created_at_PIM` | timestamptz | NO | now() | Fecha de creación |

---

### product_category_map (PCM)

Relación N:N entre productos y categorías.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `product_id_PCM` | uuid | NO | - | FK → products.id_PRD |
| `category_id_PCM` | uuid | NO | - | FK → product_categories.id_PCA |

**PK compuesta:** (product_id_PCM, category_id_PCM)

---

### attraction_categories (ACA)

Categorías para clasificar atracciones turísticas.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_ACA` | uuid | NO | gen_random_uuid() | PK |
| `name_ACA` | text | NO | - | Nombre de la categoría (único) |

---

### attractions (ATR)

Atracciones turísticas.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_ATR` | uuid | NO | gen_random_uuid() | PK |
| `submitted_by_ATR` | uuid | NO | - | FK → profiles.id_PRF |
| `name_ATR` | text | NO | - | Nombre de la atracción |
| `description_ATR` | text | SI | NULL | Descripción |
| `category_id_ATR` | uuid | SI | NULL | FK → attraction_categories.id_ACA |
| `location_id_ATR` | uuid | SI | NULL | FK → locations.id_LOC |
| `moderation_status_ATR` | moderation_status | NO | 'pending' | Estado de moderación |
| `reviewed_by_ATR` | uuid | SI | NULL | FK → profiles.id_PRF (admin) |
| `reviewed_at_ATR` | timestamptz | SI | NULL | Fecha de revisión |
| `moderation_note_ATR` | text | SI | NULL | Nota de moderación |
| `is_active_ATR` | boolean | NO | true | Atracción activa |
| `created_at_ATR` | timestamptz | NO | now() | Fecha de creación |
| `updated_at_ATR` | timestamptz | NO | now() | Última actualización |

---

### attraction_images (AIM)

Imágenes de atracciones.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_AIM` | uuid | NO | gen_random_uuid() | PK |
| `attraction_id_AIM` | uuid | NO | - | FK → attractions.id_ATR |
| `bucket_AIM` | text | NO | - | Nombre del bucket |
| `path_AIM` | text | NO | - | Ruta del archivo |
| `sort_order_AIM` | integer | NO | 0 | Orden de visualización |
| `created_at_AIM` | timestamptz | NO | now() | Fecha de creación |

---

### events (EVT)

Eventos temporales (ferias, conciertos, etc.).

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_EVT` | uuid | NO | gen_random_uuid() | PK |
| `submitted_by_EVT` | uuid | NO | - | FK → profiles.id_PRF |
| `name_EVT` | text | NO | - | Nombre del evento |
| `description_EVT` | text | SI | NULL | Descripción |
| `event_type_EVT` | event_type | NO | 'other' | Tipo de evento |
| `location_id_EVT` | uuid | SI | NULL | FK → locations.id_LOC |
| `start_at_EVT` | timestamptz | NO | - | Fecha/hora de inicio |
| `end_at_EVT` | timestamptz | NO | - | Fecha/hora de fin |
| `moderation_status_EVT` | moderation_status | NO | 'pending' | Estado de moderación |
| `reviewed_by_EVT` | uuid | SI | NULL | FK → profiles.id_PRF (admin) |
| `reviewed_at_EVT` | timestamptz | SI | NULL | Fecha de revisión |
| `moderation_note_EVT` | text | SI | NULL | Nota de moderación |
| `is_active_EVT` | boolean | NO | true | Evento activo |
| `created_at_EVT` | timestamptz | NO | now() | Fecha de creación |
| `updated_at_EVT` | timestamptz | NO | now() | Última actualización |

---

### event_images (EIM)

Imágenes de eventos.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_EIM` | uuid | NO | gen_random_uuid() | PK |
| `event_id_EIM` | uuid | NO | - | FK → events.id_EVT |
| `bucket_EIM` | text | NO | - | Nombre del bucket |
| `path_EIM` | text | NO | - | Ruta del archivo |
| `sort_order_EIM` | integer | NO | 0 | Orden de visualización |
| `created_at_EIM` | timestamptz | NO | now() | Fecha de creación |

---

### promotions (PRM)

Promociones y ofertas de negocios.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_PRM` | uuid | NO | gen_random_uuid() | PK |
| `business_id_PRM` | uuid | NO | - | FK → businesses.id_BUS |
| `created_by_PRM` | uuid | NO | - | FK → profiles.id_PRF |
| `scope_PRM` | promo_scope | NO | 'general' | Alcance de la promoción |
| `title_PRM` | text | NO | - | Título de la promoción |
| `description_PRM` | text | SI | NULL | Descripción |
| `discount_type_PRM` | discount_type | NO | 'none' | Tipo de descuento |
| `discount_value_PRM` | numeric(12,2) | NO | 0 | Valor del descuento |
| `start_at_PRM` | timestamptz | NO | - | Fecha de inicio |
| `end_at_PRM` | timestamptz | NO | - | Fecha de fin |
| `placement_PRM` | placement_type | NO | 'none' | Tipo de posicionamiento |
| `placement_score_PRM` | integer | NO | 0 | Puntuación de posicionamiento |
| `moderation_status_PRM` | moderation_status | NO | 'pending' | Estado de moderación |
| `reviewed_by_PRM` | uuid | SI | NULL | FK → profiles.id_PRF (admin) |
| `reviewed_at_PRM` | timestamptz | SI | NULL | Fecha de revisión |
| `moderation_note_PRM` | text | SI | NULL | Nota de moderación |
| `payment_state_PRM` | promo_payment_state | NO | 'unpaid' | Estado de pago |
| `payment_reference_PRM` | text | SI | NULL | Referencia de pago |
| `payment_note_PRM` | text | SI | NULL | Nota de pago |
| `created_at_PRM` | timestamptz | NO | now() | Fecha de creación |
| `updated_at_PRM` | timestamptz | NO | now() | Última actualización |

---

### promotion_products (PPR)

Relación N:N entre promociones y productos.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `promotion_id_PPR` | uuid | NO | - | FK → promotions.id_PRM |
| `product_id_PPR` | uuid | NO | - | FK → products.id_PRD |

**PK compuesta:** (promotion_id_PPR, product_id_PPR)

---

### promotion_categories (PCR)

Relación N:N entre promociones y categorías.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `promotion_id_PCR` | uuid | NO | - | FK → promotions.id_PRM |
| `category_id_PCR` | uuid | NO | - | FK → product_categories.id_PCA |

**PK compuesta:** (promotion_id_PCR, category_id_PCR)

---

### promotion_combo_items (PCI)

Items de combos para promociones.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_PCI` | uuid | NO | gen_random_uuid() | PK |
| `promotion_id_PCI` | uuid | NO | - | FK → promotions.id_PRM |
| `product_id_PCI` | uuid | NO | - | FK → products.id_PRD |
| `quantity_PCI` | integer | NO | 1 | Cantidad en el combo |

---

### Tablas de Reseñas

#### business_reviews (BRV)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_BRV` | uuid | NO | gen_random_uuid() | PK |
| `business_id_BRV` | uuid | NO | - | FK → businesses.id_BUS |
| `user_id_BRV` | uuid | NO | - | FK → profiles.id_PRF |
| `rating_BRV` | smallint | NO | - | Calificación (1-5) |
| `comment_BRV` | text | SI | NULL | Comentario |
| `created_at_BRV` | timestamptz | NO | now() | Fecha de creación |

**Constraint:** rating entre 1 y 5  
**Unique:** (business_id_BRV, user_id_BRV) - un review por usuario por negocio

#### product_reviews (PRV)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_PRV` | uuid | NO | gen_random_uuid() | PK |
| `product_id_PRV` | uuid | NO | - | FK → products.id_PRD |
| `user_id_PRV` | uuid | NO | - | FK → profiles.id_PRF |
| `rating_PRV` | smallint | NO | - | Calificación (1-5) |
| `comment_PRV` | text | SI | NULL | Comentario |
| `created_at_PRV` | timestamptz | NO | now() | Fecha de creación |

#### attraction_reviews (ARV)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_ARV` | uuid | NO | gen_random_uuid() | PK |
| `attraction_id_ARV` | uuid | NO | - | FK → attractions.id_ATR |
| `user_id_ARV` | uuid | NO | - | FK → profiles.id_PRF |
| `rating_ARV` | smallint | NO | - | Calificación (1-5) |
| `comment_ARV` | text | SI | NULL | Comentario |
| `created_at_ARV` | timestamptz | NO | now() | Fecha de creación |

#### event_reviews (ERV)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id_ERV` | uuid | NO | gen_random_uuid() | PK |
| `event_id_ERV` | uuid | NO | - | FK → events.id_EVT |
| `user_id_ERV` | uuid | NO | - | FK → profiles.id_PRF |
| `rating_ERV` | smallint | NO | - | Calificación (1-5) |
| `comment_ERV` | text | SI | NULL | Comentario |
| `created_at_ERV` | timestamptz | NO | now() | Fecha de creación |

---

## Diagrama de Relaciones

```
profiles (PRF)
    ├── businesses (BUS) [owner_id]
    │   ├── business_images (BIM)
    │   ├── business_social_links (BSL)
    │   ├── products (PRD)
    │   │   ├── product_images (PIM)
    │   │   ├── product_category_map (PCM) ──→ product_categories (PCA)
    │   │   └── product_reviews (PRV)
    │   ├── promotions (PRM)
    │   │   ├── promotion_products (PPR) ──→ products
    │   │   ├── promotion_categories (PCR) ──→ product_categories
    │   │   └── promotion_combo_items (PCI) ──→ products
    │   └── business_reviews (BRV)
    │
    ├── attractions (ATR) [submitted_by]
    │   ├── attraction_images (AIM)
    │   └── attraction_reviews (ARV)
    │
    └── events (EVT) [submitted_by]
        ├── event_images (EIM)
        └── event_reviews (ERV)

locations (LOC)
    ├── businesses (BUS) [location_id]
    ├── attractions (ATR) [location_id]
    └── events (EVT) [location_id]

business_categories (BCA)
    └── businesses (BUS) [category_id]

attraction_categories (ACA)
    └── attractions (ATR) [category_id]
```

---

## Uso en TypeScript

Los tipos están definidos en `src/types/entities/` y `src/types/enums/`:

```typescript
import { Profile, Business, Product, Attraction, Event } from '@/types/entities';
import { getFullName } from '@/types/entities';
import { UserRole, ModerationStatus, EventType } from '@/types/enums';

// Ejemplo de uso
const profile: Profile = {
  id_PRF: 'uuid...',
  first_name_PRF: 'Juan',
  last_name1_PRF: 'Pérez',
  last_name2_PRF: 'González',
  phone_number_PRF: '+506 8888-8888',
  role_PRF: 'buyer',
  is_active_PRF: true,
  created_at_PRF: '2024-01-01T00:00:00Z',
  updated_at_PRF: '2024-01-01T00:00:00Z',
};

// Helper para obtener nombre completo
const fullName = getFullName(profile); // "Juan Pérez González"
```

---

## Actualización: 2025-01-23

- Migración de `full_name_PRF` a campos separados: `first_name_PRF`, `last_name1_PRF`, `last_name2_PRF`
- Agregado tipo `Event` para eventos con nuevo enum `EventType`
- Función helper `getFullName()` para formatear nombre completo
