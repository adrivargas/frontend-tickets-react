import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Páginas públicas
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';

// Páginas privadas - Tickets
import TicketsList from './pages/TicketsList';
import TicketForm from './pages/TicketForm';
import TicketDetail from './pages/TicketDetail';

// Páginas privadas - Administración
import AdminTickets from './pages/AdminTickets';
import UsuariosList from './pages/UsuariosList';
import UsuarioForm from './pages/UsuarioForm';
import CategoriasList from './pages/CategoriasList';
import CategoriaForm from './pages/CategoriaForm';
import EstadosList from './pages/EstadosList';
import EstadoForm from './pages/EstadoForm';
import CanalesList from './pages/CanalesList';
import CanalForm from './pages/CanalForm';

// Páginas de error
import Unauthorized from './pages/Unauthorized';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas - Tickets (cualquier usuario autenticado) */}
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <TicketsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/nuevo"
                element={
                  <ProtectedRoute>
                    <TicketForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/:id"
                element={
                  <ProtectedRoute>
                    <TicketDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/:id/editar"
                element={
                  <ProtectedRoute>
                    <TicketForm />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas protegidas - Administración (solo ADMIN y AGENTE) */}
              <Route
                path="/admin/tickets"
                element={
                  <ProtectedRoute>
                    <AdminTickets />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas protegidas - Usuarios (solo ADMIN) */}
              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UsuariosList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/usuarios/nuevo"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UsuarioForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/usuarios/:id/editar"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UsuarioForm />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas protegidas - Categorías (solo ADMIN) */}
              <Route
                path="/admin/categorias"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CategoriasList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categorias/nuevo"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CategoriaForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categorias/:id/editar"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CategoriaForm />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas protegidas - Estados (solo ADMIN) */}
              <Route
                path="/admin/estados"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <EstadosList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/estados/nuevo"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <EstadoForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/estados/:id/editar"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <EstadoForm />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas protegidas - Canales (solo ADMIN) */}
              <Route
                path="/admin/canales"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CanalesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/canales/nuevo"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CanalForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/canales/:id/editar"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CanalForm />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas de error */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
