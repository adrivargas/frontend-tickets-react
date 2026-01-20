# Frontend - Sistema de Tickets de Soporte Técnico

Frontend desarrollado en **React.js** con **Vite** que consume la API REST desarrollada en Django REST Framework.

## 🚀 Características

- ✅ **Sección pública** con navegación y páginas informativas (Home, About)
- ✅ **Autenticación JWT** (login/logout con manejo de tokens)
- ✅ **Rutas protegidas** con control de acceso por roles
- ✅ **Control de acceso por roles**: ADMIN, AGENTE, CLIENTE
- ✅ **CRUD completo** de Tickets
- ✅ **CRUD completo** de Usuarios (solo ADMIN)
- ✅ **Gestión de comentarios** en tickets
- ✅ **Interfaz de administración** con tablas, filtros y paginación
- ✅ **Diseño responsive** y moderno

## 📋 Requisitos

- Node.js 16+ y npm
- Backend Django corriendo en `http://localhost:8000`

## 🛠️ Instalación

1. **Clonar e instalar dependencias:**
```bash
cd frontend-tickets-react
npm install
```

2. **Configurar variables de entorno (opcional):**
Crear archivo `.env`:
```
VITE_API_URL=http://localhost:8000
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
frontend-tickets-react/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.jsx       # Barra de navegación
│   │   └── ProtectedRoute.jsx  # Componente para rutas protegidas
│   ├── context/             # Context API
│   │   └── AuthContext.jsx  # Context de autenticación
│   ├── pages/               # Páginas/Componentes de rutas
│   │   ├── Home.jsx         # Página de inicio pública
│   │   ├── About.jsx        # Página "Acerca de"
│   │   ├── Login.jsx        # Página de login
│   │   ├── TicketsList.jsx  # Lista de tickets del usuario
│   │   ├── TicketForm.jsx   # Formulario crear/editar ticket
│   │   ├── TicketDetail.jsx # Detalle de ticket con comentarios
│   │   ├── AdminTickets.jsx # Administración de tickets
│   │   ├── UsuariosList.jsx # Lista de usuarios (admin)
│   │   ├── UsuarioForm.jsx  # Formulario crear/editar usuario
│   │   └── Unauthorized.jsx # Página de error 403
│   ├── services/            # Servicios de API
│   │   ├── api.js           # Configuración de axios
│   │   ├── authService.js   # Servicio de autenticación
│   │   ├── ticketService.js # Servicio de tickets
│   │   ├── usuarioService.js # Servicio de usuarios
│   │   ├── catalogoService.js # Servicio de catálogos
│   │   ├── comentarioService.js # Servicio de comentarios
│   │   └── userService.js   # Servicio de usuario actual
│   ├── config/              # Configuración
│   │   └── api.js           # URL base de la API
│   ├── App.jsx              # Componente principal con rutas
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Autenticación y Roles

### Roles del Sistema

1. **CLIENTE**: 
   - Puede crear y ver sus propios tickets
   - Puede comentar en sus tickets

2. **AGENTE**:
   - Puede ver todos los tickets
   - Puede asignarse tickets
   - Puede cambiar estados y comentar

3. **ADMIN**:
   - Acceso completo al sistema
   - Gestión de usuarios
   - Gestión completa de tickets
   - Configuración del sistema

### Rutas Protegidas

- `/tickets/*` - Requiere autenticación (cualquier rol)
- `/admin/tickets` - Requiere autenticación (AGENTE o ADMIN)
- `/admin/usuarios/*` - Requiere rol ADMIN

## 📡 Endpoints de la API

El frontend consume los siguientes endpoints:

### Autenticación
- `POST /api/auth/login/` - Login (obtener tokens JWT)
- `POST /api/auth/refresh/` - Refrescar token

### Tickets
- `GET /api/tickets/` - Listar tickets
- `GET /api/tickets/:id/` - Obtener ticket
- `POST /api/tickets/` - Crear ticket
- `PATCH /api/tickets/:id/` - Actualizar ticket
- `DELETE /api/tickets/:id/` - Eliminar ticket (solo ADMIN)

### Usuarios
- `GET /api/usuarios/` - Listar usuarios (solo lectura para no-admin)
- `GET /api/usuarios/:id/` - Obtener usuario
- `POST /api/usuarios/` - Crear usuario (solo ADMIN)
- `PATCH /api/usuarios/:id/` - Actualizar usuario (solo ADMIN)
- `DELETE /api/usuarios/:id/` - Eliminar usuario (solo ADMIN)

### Catálogos
- `GET /api/categorias/` - Listar categorías
- `GET /api/prioridades/` - Listar prioridades
- `GET /api/estados/` - Listar estados
- `GET /api/canales/` - Listar canales

### Comentarios
- `GET /api/comentarios/` - Listar comentarios
- `POST /api/comentarios/` - Crear comentario

## 🧪 Pruebas Funcionales

### Prueba 1: Acceso Público
1. Navegar a `http://localhost:3000`
2. Verificar que se muestra la página de inicio
3. Navegar a `/about`
4. Verificar contenido informativo

### Prueba 2: Autenticación
1. Navegar a `/login`
2. Ingresar credenciales válidas
3. Verificar redirección a `/tickets`
4. Verificar que el navbar muestra el usuario y opción de cerrar sesión

### Prueba 3: Crear Ticket (CLIENTE)
1. Iniciar sesión como CLIENTE
2. Navegar a `/tickets`
3. Click en "Nuevo Ticket"
4. Llenar formulario y crear
5. Verificar que aparece en la lista

### Prueba 4: Ver Detalle de Ticket
1. Click en "Ver" de un ticket
2. Verificar información completa
3. Agregar comentario
4. Verificar que aparece el comentario

### Prueba 5: Administración de Tickets (AGENTE/ADMIN)
1. Iniciar sesión como AGENTE o ADMIN
2. Navegar a `/admin/tickets`
3. Verificar lista completa de tickets
4. Usar filtros de búsqueda
5. Verificar paginación

### Prueba 6: Gestión de Usuarios (solo ADMIN)
1. Iniciar sesión como ADMIN
2. Navegar a `/admin/usuarios`
3. Crear nuevo usuario
4. Editar usuario existente
5. Eliminar usuario

### Prueba 7: Control de Acceso
1. Iniciar sesión como CLIENTE
2. Intentar acceder a `/admin/usuarios`
3. Verificar redirección a `/unauthorized` o página de inicio

### Prueba 8: Logout
1. Click en "Cerrar Sesión"
2. Verificar redirección a página de inicio
3. Intentar acceder a `/tickets`
4. Verificar redirección a `/login`

## 🔧 Configuración Avanzada

### Proxy de Desarrollo

El archivo `vite.config.js` incluye un proxy para desarrollo que redirige las peticiones `/api/*` al backend en `http://localhost:8000`.

### Manejo de Tokens JWT

- Los tokens se almacenan en `localStorage`
- El interceptor de axios agrega automáticamente el token a las peticiones
- Si el token expira, se intenta refrescar automáticamente
- Si el refresh falla, se redirige al login

### Variables de Entorno

Crear archivo `.env.local`:
```
VITE_API_URL=http://localhost:8000
```

## 📝 Notas Importantes

1. **Autenticación JWT**: El backend usa Django SimpleJWT que por defecto usa `username` en lugar de `email`. Asegúrate de que el backend esté configurado correctamente o ajusta el código de autenticación.

2. **CORS**: El backend debe tener configurado CORS para permitir peticiones desde `http://localhost:3000`.

3. **Usuario Actual**: El código actual busca el usuario por email después del login. Idealmente, el backend debería tener un endpoint `/api/me/` que retorne el usuario actual basado en el token JWT.

4. **Paginación**: La API usa paginación por defecto (10 resultados por página). El frontend maneja esto automáticamente.

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`.

## 📚 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **React Router 6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Vite** - Build tool y dev server
- **CSS3** - Estilos (sin frameworks adicionales)

## 📄 Licencia

Este proyecto es parte de un sistema educativo de gestión de tickets de soporte técnico.
#   f r o n t e n d - t i c k e t s - r e a c t  
 