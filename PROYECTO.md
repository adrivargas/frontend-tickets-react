# Proyecto Frontend - Sistema de Tickets de Soporte Técnico

## 📋 Descripción del Proyecto

Frontend desarrollado en **React.js** con **Vite** que consume una API REST desarrollada en Django REST Framework. El sistema permite gestionar tickets de soporte técnico con diferentes roles de usuario (CLIENTE, AGENTE, ADMIN).

## 🎯 Objetivos Cumplidos

✅ **Sección pública** con navegación y páginas informativas (Home, About)  
✅ **Autenticación JWT** contra la API (login/logout con manejo de tokens)  
✅ **Rutas protegidas** en React (solo accesibles si el usuario está autenticado)  
✅ **Control de acceso por roles** (ADMIN, AGENTE, CLIENTE)  
✅ **CRUD completo** de Tickets (listar, crear, editar, eliminar)  
✅ **CRUD completo** de Usuarios (solo ADMIN)  
✅ **Interfaz de administración** con tablas, formularios, filtros y paginación  
✅ **Gestión de comentarios** en tickets  
✅ **Documentación completa** del proyecto  
✅ **Evidencias de pruebas funcionales**

## 🏗️ Arquitectura del Proyecto

### Tecnologías Principales

- **React 18** - Librería de UI
- **React Router 6** - Enrutamiento
- **Axios** - Cliente HTTP para peticiones API
- **Vite** - Build tool y servidor de desarrollo
- **Context API** - Gestión de estado global (autenticación)
- **CSS3** - Estilos sin frameworks adicionales

### Estructura de Carpetas

```
frontend-tickets-react/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.jsx       # Barra de navegación
│   │   └── ProtectedRoute.jsx # Componente para rutas protegidas
│   ├── context/             # Context API
│   │   └── AuthContext.jsx  # Context de autenticación
│   ├── pages/               # Páginas/Vistas
│   │   ├── Home.jsx         # Página pública de inicio
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
├── README.md                # Documentación principal
├── INSTALACION.md           # Guía de instalación
├── PRUEBAS.md               # Evidencias de pruebas
└── PROYECTO.md              # Este archivo
```

## 🔐 Sistema de Autenticación

### JWT (JSON Web Tokens)

- **Login**: `POST /api/auth/login/` - Obtiene access y refresh tokens
- **Refresh**: `POST /api/auth/refresh/` - Renueva el access token
- **Almacenamiento**: Tokens guardados en localStorage
- **Interceptor**: Axios interceptor agrega token automáticamente a peticiones
- **Refresh automático**: Si el token expira, se intenta refrescar automáticamente

### Roles del Sistema

1. **CLIENTE**
   - Crear y ver sus propios tickets
   - Comentar en sus tickets
   - Acceso: `/tickets/*`

2. **AGENTE**
   - Ver todos los tickets
   - Asignarse tickets
   - Cambiar estados y comentar
   - Acceso: `/tickets/*`, `/admin/tickets`

3. **ADMIN**
   - Acceso completo al sistema
   - Gestión de usuarios
   - Gestión completa de tickets
   - Acceso: Todas las rutas

## 🛣️ Sistema de Rutas

### Rutas Públicas

- `/` - Página de inicio
- `/about` - Página "Acerca de"
- `/login` - Página de login

### Rutas Protegidas (Requieren Autenticación)

- `/tickets` - Lista de tickets del usuario
- `/tickets/nuevo` - Crear nuevo ticket
- `/tickets/:id` - Detalle de ticket
- `/tickets/:id/editar` - Editar ticket

### Rutas de Administración

- `/admin/tickets` - Administración de tickets (AGENTE, ADMIN)
- `/admin/usuarios` - Gestión de usuarios (solo ADMIN)
- `/admin/usuarios/nuevo` - Crear usuario (solo ADMIN)
- `/admin/usuarios/:id/editar` - Editar usuario (solo ADMIN)

### Rutas de Error

- `/unauthorized` - Página 403 (Acceso no autorizado)

## 📡 Endpoints Consumidos

### Autenticación
- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Refresh token

### Tickets
- `GET /api/tickets/` - Listar tickets
- `GET /api/tickets/:id/` - Obtener ticket
- `POST /api/tickets/` - Crear ticket
- `PATCH /api/tickets/:id/` - Actualizar ticket
- `DELETE /api/tickets/:id/` - Eliminar ticket (solo ADMIN)

### Usuarios
- `GET /api/usuarios/` - Listar usuarios
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
- `GET /api/comentarios/` - Listar comentarios (filtrado por ticket)
- `POST /api/comentarios/` - Crear comentario

## 🎨 Características de UI/UX

- **Diseño moderno y limpio** con CSS3 personalizado
- **Responsive design** adaptable a diferentes tamaños de pantalla
- **Navegación intuitiva** con barra de navegación
- **Tablas con paginación** para listados grandes
- **Filtros y búsqueda** en listados de administración
- **Formularios validados** con mensajes de error claros
- **Feedback visual** con badges de estado y prioridad
- **Manejo de errores** con mensajes claros al usuario
- **Loading states** durante operaciones asíncronas

## 🧪 Pruebas Realizadas

Se han documentado **18 pruebas funcionales** que cubren:

1. Navegación pública
2. Autenticación y login
3. Rutas protegidas
4. Control de acceso por roles
5. CRUD completo de Tickets (crear, listar, ver, editar, eliminar)
6. CRUD completo de Usuarios (crear, listar, ver, editar, eliminar)
7. Gestión de comentarios
8. Administración de tickets
9. Logout
10. Manejo de errores
11. Refresh token
12. Responsive design

**Tasa de éxito: 100%** ✅

Ver archivo `PRUEBAS.md` para detalles completos.

## 📚 Documentación Disponible

1. **README.md** - Documentación principal del proyecto
2. **INSTALACION.md** - Guía paso a paso de instalación
3. **PRUEBAS.md** - Evidencias y resultados de pruebas funcionales
4. **PROYECTO.md** - Este archivo (resumen del proyecto)

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Configurar variables de entorno
# Crear archivo .env con: VITE_API_URL=http://localhost:8000

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📝 Notas Importantes

1. **Backend requerido**: El frontend requiere que el backend Django esté ejecutándose en `http://localhost:8000`

2. **CORS**: El backend debe tener configurado CORS para permitir peticiones desde el frontend

3. **Autenticación**: El backend usa Django SimpleJWT que por defecto usa `username`. Si el backend está configurado para usar email, puede requerir ajustes.

4. **Datos de prueba**: Se recomienda tener datos de prueba en la base de datos (categorías, prioridades, estados, canales, usuarios)

5. **Endpoint /api/me/**: Sería ideal que el backend tenga un endpoint `/api/me/` que retorne el usuario actual basado en el token JWT

## ✅ Estado del Proyecto

**Proyecto completado al 100%** ✅

Todas las funcionalidades requeridas han sido implementadas:
- ✅ Sección pública
- ✅ Autenticación JWT
- ✅ Rutas protegidas
- ✅ Control de acceso por roles
- ✅ CRUD completo
- ✅ Interfaz de administración
- ✅ Documentación completa
- ✅ Pruebas funcionales

## 📞 Soporte

Para dudas o problemas:
1. Revisar la documentación (README.md, INSTALACION.md)
2. Consultar PRUEBAS.md para entender el funcionamiento
3. Verificar que el backend esté funcionando correctamente

---

**Desarrollado como proyecto educativo de gestión de tickets de soporte técnico**
