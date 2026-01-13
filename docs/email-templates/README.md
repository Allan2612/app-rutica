# Email Templates para Supabase

Este directorio contiene los templates de correo electrónico para la autenticación en Supabase.

## 📧 Templates disponibles

### 1. `confirm-signup.html`
Template para confirmar registro de nuevos usuarios.

**Variables de Supabase:**
- `{{ .ConfirmationURL }}` - URL de confirmación del email
- `{{ .Token }}` - Token de confirmación
- `{{ .TokenHash }}` - Hash del token
- `{{ .SiteURL }}` - URL del sitio

### 2. `reset-password.html`
Template para recuperación de contraseña.

**Variables de Supabase:**
- `{{ .ConfirmationURL }}` - URL para resetear contraseña
- `{{ .Token }}` - Token de recuperación
- `{{ .TokenHash }}` - Hash del token
- `{{ .SiteURL }}` - URL del sitio

## 🎨 Características

- **Tema oscuro** - Diseño moderno con fondo oscuro (#1a1a1a)
- **Responsive** - Se adapta a dispositivos móviles
- **Branding** - Colores de marca (verde #10b981)
- **Accesibilidad** - Alto contraste y fuentes legibles
- **Seguridad** - Notas de advertencia incluidas

## 📝 Cómo usar en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a: **Authentication** → **Email Templates**
3. Selecciona el template que quieres editar:
   - **Confirm signup** - Para registro
   - **Reset password** - Para recuperar contraseña
4. Copia y pega el contenido HTML del archivo correspondiente
5. Guarda los cambios

## ⚙️ Configuración recomendada

### URL de confirmación (Supabase Dashboard)
- **Site URL**: `https://tu-dominio.com`
- **Redirect URLs**: 
  - `https://tu-dominio.com/*`
  - `http://localhost:8081/*` (para desarrollo)

### Variables de entorno (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=tu-url-de-supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## 🔧 Personalización

Para personalizar los templates:

1. **Colores principales:**
   - Verde primario: `#10b981`
   - Fondo oscuro: `#1a1a1a`
   - Card: `#2a2a2a`
   - Texto: `#e5e5e5`

2. **Logo:**
   - Actualmente usa texto "Rutica"
   - Para agregar imagen: `<img src="URL_DE_TU_LOGO" alt="Rutica" style="width: 150px; height: auto;" />`

3. **Links:**
   - Actualiza `mailto:soporte@rutica.com` con tu email real

## 🧪 Testing

Para probar los emails:

1. En Supabase Dashboard, usa el botón "Send test email"
2. O registra un nuevo usuario en tu app
3. Verifica que el email se vea correctamente en:
   - Gmail (web y móvil)
   - Outlook
   - Apple Mail
   - Cliente de correo de tu preferencia

## 📱 Compatibilidad

Estos templates son compatibles con:
- ✅ Gmail
- ✅ Outlook
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Clientes de correo móviles
- ✅ Modo oscuro del sistema

## 🛡️ Seguridad

Los templates incluyen:
- Nota sobre expiración de links
- Advertencia si no solicitaste el cambio
- Información de contacto para soporte
- Enlaces que expiran automáticamente
