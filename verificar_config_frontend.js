// Script para verificar la configuración del frontend
// Ejecutar con: node verificar_config_frontend.js

const fs = require('fs');
const path = require('path');

console.log("=" .repeat(80));
console.log("VERIFICACIÓN COMPLETA DE CONFIGURACIÓN - FRONTEND");
console.log("=".repeat(80));
console.log();

// 1. Verificar archivo de configuración de API
console.log("1. CONFIGURACIÓN DE API:");
console.log("-".repeat(80));
const apiConfigPath = path.join(__dirname, 'src', 'config', 'api.js');
try {
    if (fs.existsSync(apiConfigPath)) {
        const apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
        console.log("   ✅ Archivo src/config/api.js existe");
        console.log("   Contenido:");
        console.log(apiConfig.split('\n').map(line => '      ' + line).join('\n'));
        
        if (apiConfig.includes('localhost:8000')) {
            console.log("   ✅ URL apunta a localhost:8000");
        } else {
            console.log("   ⚠️ URL NO apunta a localhost:8000");
        }
    } else {
        console.log("   ❌ Archivo src/config/api.js NO existe");
    }
} catch (error) {
    console.log(`   ❌ Error al leer archivo: ${error.message}`);
}
console.log();

// 2. Verificar servicio de API
console.log("2. SERVICIO DE API:");
console.log("-".repeat(80));
const apiServicePath = path.join(__dirname, 'src', 'services', 'api.js');
try {
    if (fs.existsSync(apiServicePath)) {
        const apiService = fs.readFileSync(apiServicePath, 'utf8');
        console.log("   ✅ Archivo src/services/api.js existe");
        
        if (apiService.includes('import API_BASE_URL')) {
            console.log("   ✅ Importa API_BASE_URL correctamente");
        }
        
        if (apiService.includes('baseURL: API_BASE_URL')) {
            console.log("   ✅ Usa baseURL correctamente");
        }
        
        if (apiService.includes('Authorization')) {
            console.log("   ✅ Incluye interceptor para Authorization");
        }
    } else {
        console.log("   ❌ Archivo src/services/api.js NO existe");
    }
} catch (error) {
    console.log(`   ❌ Error al leer archivo: ${error.message}`);
}
console.log();

// 3. Verificar servicios principales
console.log("3. SERVICIOS PRINCIPALES:");
console.log("-".repeat(80));
const services = [
    'authService.js',
    'ticketService.js',
    'userService.js',
    'catalogoService.js',
];
services.forEach(service => {
    const servicePath = path.join(__dirname, 'src', 'services', service);
    if (fs.existsSync(servicePath)) {
        console.log(`   ✅ ${service} existe`);
    } else {
        console.log(`   ❌ ${service} NO existe`);
    }
});
console.log();

// 4. Verificar package.json
console.log("4. DEPENDENCIAS:");
console.log("-".repeat(80));
const packagePath = path.join(__dirname, 'package.json');
try {
    if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const deps = packageJson.dependencies || {};
        
        const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
        requiredDeps.forEach(dep => {
            if (deps[dep]) {
                console.log(`   ✅ ${dep}: ${deps[dep]}`);
            } else {
                console.log(`   ❌ ${dep} NO está instalado`);
            }
        });
        
        // Verificar scripts
        console.log("\n   Scripts disponibles:");
        const scripts = packageJson.scripts || {};
        Object.keys(scripts).forEach(script => {
            console.log(`      - ${script}: ${scripts[script]}`);
        });
    }
} catch (error) {
    console.log(`   ❌ Error al leer package.json: ${error.message}`);
}
console.log();

// 5. Verificar estructura de directorios
console.log("5. ESTRUCTURA DE DIRECTORIOS:");
console.log("-".repeat(80));
const directories = [
    'src',
    'src/components',
    'src/config',
    'src/context',
    'src/pages',
    'src/services',
];
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        console.log(`   ✅ ${dir}/`);
    } else {
        console.log(`   ❌ ${dir}/ NO existe`);
    }
});
console.log();

// 6. Verificar archivos de configuración
console.log("6. ARCHIVOS DE CONFIGURACIÓN:");
console.log("-".repeat(80));
const configFiles = [
    'vite.config.js',
    'index.html',
    'src/main.jsx',
    'src/App.jsx',
];
configFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} NO existe`);
    }
});
console.log();

// 7. Resumen
console.log("=".repeat(80));
console.log("RESUMEN:");
console.log("=".repeat(80));
console.log("   Configuración de API: Revisar arriba");
console.log("   Servicios: Revisar arriba");
console.log("   Dependencias: Revisar arriba");
console.log();
console.log("NEXT STEPS:");
console.log("   1. Si hay errores, corrige los archivos mencionados");
console.log();
console.log("   2. Instala las dependencias:");
console.log("      npm install");
console.log();
console.log("   3. Inicia el servidor de desarrollo:");
console.log("      npm run dev");
console.log();
console.log("   4. Abre el navegador en:");
console.log("      http://localhost:3000/");
console.log();
console.log("   5. Verifica la consola del navegador (F12) para errores");
console.log("=".repeat(80));

