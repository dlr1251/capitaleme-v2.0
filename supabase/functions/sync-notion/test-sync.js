#!/usr/bin/env node

/**
 * Script de prueba para la edge function de sincronización
 * Uso: node test-sync.js [content_type] [page_id]
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SYNC_SECRET = process.env.SYNC_SECRET || 'tu_secreto_super_seguro_aqui';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/sync-notion`;

async function testSync(contentType = null, pageId = null) {
  const payload = {};
  
  if (contentType) {
    payload.content_type = contentType;
  }
  
  if (pageId) {
    payload.page_id = pageId;
  }

  console.log('🚀 Iniciando sincronización...');
  console.log('📡 URL:', FUNCTION_URL);
  console.log('📦 Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SYNC_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Sincronización exitosa!');
      console.log('📊 Resultado:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Error en la sincronización:');
      console.error('📊 Error:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('💥 Error de conexión:', error.message);
  }
}

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
const contentType = args[0] || null;
const pageId = args[1] || null;

// Ejecutar prueba
testSync(contentType, pageId);
