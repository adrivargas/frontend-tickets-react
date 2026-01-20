# Guía de Instalación - Frontend Sistema de Tickets

Esta guía te ayudará a instalar y ejecutar el frontend del Sistema de Tickets de Soporte Técnico.

## 📋 Requisitos Previos

1. **Node.js** (versión 16 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version` y `npm --version`

2. **Backend Django ejecutándose**
   - El backend debe estar corriendo en `http://localhost:8000`
   - Ver el README del backend para su instalación

3. **Navegador web moderno**
   - Chrome, Firefox, Edge o Safari (versiones recientes)

## 🚀 Instalación Paso a Paso

### Paso 1: Navegar al directorio del proyecto

```bash
cd frontend-tickets-react
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- React 18
- React Router 6
- Axios
- React Icons
- Vite

### Paso 3: Configurar variables de entorno (Opcional)

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000
```

Si no se crea este archivo, se usará `http://localhost:8000` por defecto.

### Paso 4: Iniciar el servidor de desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Paso 5: Verificar que funciona

1. Abrir el navegador en `http://localhost:3000`
2. Deberías ver la página de inicio del sistema
3. Puedes navegar a `/about` para ver información del sistema

## 🔧 Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea una build de producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter (si está configurado)

## ⚠️ Solución de Problemas

### Error: Cannot find module

Si obtienes errores de módulos no encontrados:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Puerto 3000 ya está en uso

Si el puerto 3000 está ocupado, Vite intentará usar otro puerto automáticamente, o puedes cambiarlo en `vite.config.js`:

```javascript
server: {
  port: 3001, // Cambiar el puerto
}
```

### Error: No se puede conectar a la API

Verifica que:
1. El backend Django esté corriendo en `http://localhost:8000`
2. CORS esté configurado correctamente en el backend
3. La URL de la API en `.env` sea correcta

### Error: Error de autenticación

El backend Django SimpleJWT por defecto usa `username` en lugar de `email`. Si el backend no está configurado para usar email, necesitarás ajustar el código de autenticación o usar el username del sistema de Django.

## 🌐 Build para Producción

Para crear una build optimizada para producción:

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`.

Para servir la build:

```bash
npm run preview
```

## 📝 Notas Importantes

1. **Backend necesario**: Este frontend requiere que el backend Django esté ejecutándose.

2. **CORS**: Asegúrate de que el backend tenga configurado CORS para permitir peticiones desde `http://localhost:3000` (en desarrollo) o desde tu dominio de producción.

3. **Datos de prueba**: Se recomienda tener datos de prueba en la base de datos del backend (categorías, prioridades, estados, canales, usuarios).

4. **Autenticación**: El sistema usa JWT. Los tokens se almacenan en localStorage. Asegúrate de que el backend esté configurado correctamente para JWT.

## ✅ Verificación Final

Después de la instalación, verifica:

- [ ] El servidor de desarrollo se inicia sin errores
- [ ] La página de inicio se carga correctamente
- [ ] Puedes navegar a `/about`
- [ ] El backend está corriendo y accesible
- [ ] Puedes hacer login (si tienes usuarios creados)

## 🆘 Soporte

Si tienes problemas con la instalación:

1. Revisa los logs del servidor en la terminal
2. Revisa la consola del navegador (F12)
3. Verifica que el backend esté funcionando correctamente
4. Consulta la documentación del backend

---

¡Listo! Ya puedes usar el sistema. 🎉
