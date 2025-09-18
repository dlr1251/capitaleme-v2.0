#!/bin/bash

# Script de despliegue para la edge function de sincronización
# Uso: ./deploy.sh

echo "🚀 Desplegando edge function sync-notion..."

# Verificar que supabase CLI esté instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no está instalado. Instálalo con: npm install -g supabase"
    exit 1
fi

# Verificar que estemos en el directorio correcto
if [ ! -f "index.ts" ]; then
    echo "❌ No se encontró index.ts. Ejecuta este script desde el directorio de la función."
    exit 1
fi

# Verificar que estemos logueados en Supabase
if ! supabase status &> /dev/null; then
    echo "❌ No estás logueado en Supabase. Ejecuta: supabase login"
    exit 1
fi

# Desplegar la función
echo "📦 Desplegando función..."
supabase functions deploy sync-notion

if [ $? -eq 0 ]; then
    echo "✅ Función desplegada exitosamente!"
    echo ""
    echo "🔧 Configuración necesaria:"
    echo "1. Configura las variables de entorno en tu proyecto de Supabase"
    echo "2. Asegúrate de que las tablas existan en tu base de datos"
    echo "3. Prueba la función con: node test-sync.js"
    echo ""
    echo "📚 Ver README.md para más detalles"
else
    echo "❌ Error al desplegar la función"
    exit 1
fi
