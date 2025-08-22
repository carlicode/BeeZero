import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Función para extraer URL de Google Maps
function extractGoogleMapsUrl(text) {
  if (!text) return { description: '', url: '' };
  
  // Buscar patrones de URL de Google Maps
  const urlPatterns = [
    /https:\/\/goo\.gl\/maps\/[\w]+/g,
    /https:\/\/maps\.app\.goo\.gl\/[\w]+/g,
    /https:\/\/maps\.google\.com\/[\w\/?&=.-]+/g
  ];
  
  let url = '';
  let description = text;
  
  // Buscar URL en el texto
  for (const pattern of urlPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      url = matches[0];
      // Remover la URL del texto de descripción
      description = text.replace(pattern, '').trim();
      break;
    }
  }
  
  return { description, url };
}

// Función principal
function processClientesFile() {
  try {
    // Leer el archivo Excel
    const filePath = path.join(process.cwd(), 'Clientes (1).xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ Archivo "Clientes (1).xlsx" no encontrado en el directorio raíz');
      console.log('📍 Asegúrate de que el archivo esté en:', process.cwd());
      return;
    }
    
    console.log('📂 Leyendo archivo:', filePath);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`📊 Encontrados ${data.length} registros`);
    
    // Procesar cada fila
    const processedData = data.map((row, index) => {
      const empresa = row.Empresa || '';
      const clienteOriginal = row.Cliente || '';
      
      // Extraer URL y descripción
      const { description, url } = extractGoogleMapsUrl(clienteOriginal);
      
      console.log(`${index + 1}. ${empresa}:`);
      console.log(`   📝 Descripción: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`);
      console.log(`   🗺️  URL Maps: ${url || 'No encontrada'}`);
      
      return {
        Empresa: empresa,
        Descripcion: description,
        'URL Maps': url,
        'Cliente Original': clienteOriginal // Mantener para referencia
      };
    });
    
    // Crear nuevo workbook
    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(processedData);
    
    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 20 }, // Empresa
      { wch: 60 }, // Descripcion
      { wch: 40 }, // URL Maps
      { wch: 80 }  // Cliente Original
    ];
    newSheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Clientes Procesados');
    
    // Guardar archivo procesado
    const outputPath = path.join(process.cwd(), 'Clientes_Procesados.xlsx');
    XLSX.writeFile(newWorkbook, outputPath);
    
    console.log('\n✅ Procesamiento completado!');
    console.log(`📄 Archivo guardado como: ${outputPath}`);
    console.log('\n📋 Resumen:');
    console.log(`   Total registros: ${processedData.length}`);
    console.log(`   URLs encontradas: ${processedData.filter(r => r['URL Maps']).length}`);
    console.log(`   Sin URL: ${processedData.filter(r => !r['URL Maps']).length}`);
    
  } catch (error) {
    console.error('❌ Error procesando archivo:', error.message);
  }
}

// Ejecutar
processClientesFile();
