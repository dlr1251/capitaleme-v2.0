# Scripts Directory

Esta carpeta contiene scripts organizados para sincronización, utilidades, mantenimiento y procesamiento de imágenes.

## Estructura

```
scripts/
├── sync/              # Scripts de sincronización desde Notion
├── utils/             # Utilidades y herramientas
├── images/            # Procesamiento de imágenes
├── maintenance/       # Scripts de mantenimiento del proyecto
└── deprecated/        # Scripts históricos (no usar)
```

## Scripts de Sincronización (`sync/`)

### `sync-all.js`
Sincroniza múltiples tipos de contenido desde Notion a Supabase.

```bash
npm run sync:all              # Sincroniza todo
npm run sync:all --visas     # Solo visas
npm run sync:all --clkr      # Solo CLKR
npm run sync:all --guides    # Solo guides
npm run sync:all --blog      # Solo blog
```

### `sync-visas.js`
Sincroniza visas desde Notion a Supabase.

```bash
npm run sync:visas           # Modo básico
node scripts/sync/sync-visas.js --optimized   # Modo optimizado
node scripts/sync/sync-visas.js --super       # Modo super optimizado
```

### `sync-clkr.js`
Sincroniza artículos CLKR desde Notion a Supabase.

```bash
npm run sync:clkr
```

### `sync-guides.js`
Sincroniza guides desde Notion a Supabase.

```bash
npm run sync:guides          # Modo básico
node scripts/sync/sync-guides.js --optimized   # Modo optimizado
node scripts/sync/sync-guides.js --super       # Modo super optimizado
node scripts/sync/sync-guides.js --production  # Modo producción (con logging)
```

## Utilidades (`utils/`)

### `test-connection.js`
Prueba conexiones a Supabase, Notion y otros servicios.

```bash
npm run test:connection
```

### `check-data.js`
Verifica datos en Supabase (visas, guides, estructura de BD).

```bash
node scripts/utils/check-data.js
```

### `optimize-code.js`
Optimiza código eliminando imports no utilizados.

```bash
npm run optimize
```

## Procesamiento de Imágenes (`images/`)

### `download-images.js`
Descarga imágenes desde Notion y las almacena localmente.

```bash
npm run images:download
```

### `migrate-cloudinary.js`
Migra imágenes a Cloudinary.

```bash
npm run images:migrate
```

### `sync-with-images.js`
Sincronización con procesamiento de imágenes.

```bash
npm run images:sync
```

## Mantenimiento (`maintenance/`)

### `fix-imports.js`
Arregla imports faltantes y elimina imports no utilizados.

```bash
npm run maintenance:fix-imports -- --add-missing    # Agregar imports faltantes
npm run maintenance:fix-imports -- --remove-unused  # Eliminar imports no usados
npm run maintenance:fix-imports -- --all            # Ambos
```

### `cleanup.js`
Limpia el proyecto eliminando código no utilizado, console.logs, etc.

```bash
npm run maintenance:cleanup
npm run maintenance:cleanup -- --keep-imports   # No eliminar imports
npm run maintenance:cleanup -- --keep-logs       # No eliminar console.logs
npm run maintenance:cleanup -- --skip-comments  # No escanear TODOs/FIXMEs
```

## Scripts Deprecated

Los scripts en la carpeta `deprecated/` son versiones antiguas que ya no se utilizan. Se mantienen por referencia histórica pero no deben usarse.

## Notas

- Todos los scripts requieren variables de entorno configuradas en `.env`
- Los scripts de sincronización pueden tomar varios minutos dependiendo de la cantidad de contenido
- Los scripts de mantenimiento pueden modificar archivos, asegúrate de tener un respaldo o usar control de versiones

