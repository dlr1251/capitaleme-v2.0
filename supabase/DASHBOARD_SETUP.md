# Dashboard Setup Guide for Supabase

Este documento explica cómo configurar Supabase para el dashboard de gestión de contenido.

## Pasos de Configuración

### 1. Ejecutar Migraciones SQL

Ve al SQL Editor en tu proyecto de Supabase y ejecuta los scripts en orden:

1. **001_dashboard_setup.sql** - Configura tablas, políticas RLS y funciones
2. **002_create_admin_user.sql** - Crea el usuario administrador (después de crear el usuario en Auth)

### 2. Crear Usuario Administrador

#### Opción A: Desde el Dashboard de Supabase

1. Ve a **Authentication > Users** en tu proyecto de Supabase
2. Haz clic en **Add User** o **Invite User**
3. Ingresa el email y contraseña del administrador
4. Copia el **User ID** (UUID) que se genera

#### Opción B: Manualmente (si ya tienes un usuario)

1. Ve a **Authentication > Users**
2. Encuentra tu usuario y copia su **User ID** (UUID)

### 3. Asignar Rol de Admin

Ejecuta este SQL en el SQL Editor, reemplazando los valores:

```sql
-- Reemplaza 'tu-email@ejemplo.com' con el email del usuario admin
SELECT create_admin_user('tu-email@ejemplo.com', 'admin');
```

O manualmente:

```sql
-- Reemplaza el UUID y email con tus valores reales
INSERT INTO public.profiles (id, email, role)
VALUES ('tu-user-uuid-aqui', 'tu-email@ejemplo.com', 'admin')
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();
```

### 4. Verificar Configuración

Ejecuta esta consulta para verificar que el usuario tiene rol de admin:

```sql
SELECT id, email, role 
FROM public.profiles 
WHERE role IN ('admin', 'super_admin');
```

### 5. Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```bash
# Server-side (ya deberías tenerlas)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Client-side (necesarias para el dashboard)
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

**Importante**: Las variables `PUBLIC_*` son accesibles desde el navegador y son necesarias para la autenticación del dashboard.

### 6. Configurar Supabase Storage para Archivos

Para que el editor de markdown pueda subir imágenes y archivos, necesitas crear un bucket de almacenamiento:

1. Ve a **Storage** en tu proyecto de Supabase
2. Haz clic en **New Bucket**
3. Nombra el bucket: `uploads`
4. Configuración:
   - **Public bucket**: NO (mantén privado)
   - **File size limit**: 10MB (o el límite que prefieras)
   - **Allowed MIME types**: Deja vacío para permitir todos los tipos, o especifica: `image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`

5. Configura las políticas de acceso (Storage Policies):

Ejecuta este SQL en el SQL Editor para permitir que los admins suban archivos:

```sql
-- Política para permitir que los admins suban archivos
CREATE POLICY "Admins can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Política para permitir lectura pública de archivos
CREATE POLICY "Public can read uploaded files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'uploads');
```

**Nota**: Si prefieres mantener los archivos completamente privados (solo accesibles para admins), no crees la segunda política.

## Qué Hace el Script SQL

### 1. Tabla `profiles`
- Crea la tabla si no existe
- Configura campos necesarios (id, email, role, etc.)
- Establece constraints y valores por defecto

### 2. Políticas RLS (Row Level Security)
- **Profiles**: Los usuarios pueden leer/actualizar su propio perfil
- **Content Tables**: 
  - Público puede leer solo contenido publicado
  - Admins pueden leer y gestionar todo (incluyendo borradores y archivados)

### 3. Campo `archived`
- Agrega el campo `archived` (boolean) a todas las tablas de contenido
- Permite soft delete sin eliminar datos físicamente

### 4. Funciones Helper
- `handle_new_user()`: Crea automáticamente un perfil cuando se registra un nuevo usuario
- `create_admin_user()`: Asigna rol de admin a un usuario existente

## Troubleshooting

### Error: "User profile not found"
- El usuario no tiene un perfil en la tabla `profiles`
- Solución: Ejecuta `create_admin_user()` o inserta manualmente el perfil

### Error: "Permission denied"
- Las políticas RLS están bloqueando el acceso
- Solución: Verifica que las políticas estén creadas correctamente ejecutando el script completo

### Error: "Column archived does not exist"
- El campo `archived` no existe en alguna tabla
- Solución: Ejecuta la sección 3 del script `001_dashboard_setup.sql`

## Seguridad

- **Nunca** expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente
- Solo usa `PUBLIC_SUPABASE_ANON_KEY` en el frontend
- Las políticas RLS protegen los datos a nivel de base de datos
- Solo usuarios con `role = 'admin'` o `role = 'super_admin'` pueden gestionar contenido

