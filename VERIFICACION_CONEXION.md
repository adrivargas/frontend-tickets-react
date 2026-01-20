# Verificación de Conexión Frontend-Backend

## Configuración Actual

### Frontend (React)
- **URL Base de API**: `http://localhost:8000` (configurado en `src/config/api.js`)
- **Puerto del Frontend**: `3000` (por defecto en Vite)

### Backend (Django)
- **Puerto del Backend**: `8000` (por defecto en Django)
- **CORS Configurado**: `http://localhost:3000` y `http://127.0.0.1:3000`

## Pasos para Verificar la Conexión

### 1. Verificar que el Backend esté corriendo
```bash
cd Backend_tickets_django
python manage.py runserver
```
Deberías ver:
```
Starting development server at http://127.0.0.1:8000/
```

### 2. Verificar que el Frontend esté corriendo
```bash
cd frontend-tickets-react
npm run dev
```
Deberías ver:
```
VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

### 3. Probar la conexión manualmente
Abre tu navegador y ve a:
- **Backend**: http://localhost:8000/api/tickets/ (debería requerir autenticación)
- **Frontend**: http://localhost:3000/

### 4. Verificar en la Consola del Navegador
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Network**
3. Intenta cargar la página de tickets
4. Busca las peticiones a `/api/tickets/`
5. Verifica:
   - **Status**: Debería ser `200` (éxito) o `401` (no autenticado)
   - **Response**: Debería mostrar los datos JSON

### 5. Verificar Autenticación
1. Asegúrate de estar logueado
2. Ve a la pestaña **Application** (o **Storage**)
3. Busca **Local Storage**
4. Verifica que existan:
   - `accessToken`
   - `refreshToken`
   - `user`

## Problemas Comunes

### Error: CORS policy
Si ves un error de CORS, verifica que en `settings.py` esté:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Error: 401 Unauthorized
- Verifica que tengas un token válido en Local Storage
- Intenta cerrar sesión y volver a iniciar sesión

### Error: Network Error o Connection Refused
- Verifica que el backend esté corriendo en el puerto 8000
- Verifica que no haya otro proceso usando el puerto 8000

## Logs del Backend

Cuando hagas una petición desde el frontend, deberías ver en la terminal del backend:
```
[XX/XX/XXXX XX:XX:XX] "GET /api/tickets/ HTTP/1.1" 200 XXX
```

Si ves `401`, significa que el token no está siendo enviado o es inválido.
Si ves `200`, significa que la conexión está funcionando correctamente.

