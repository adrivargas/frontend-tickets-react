import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            🎫 Sistema de Tickets
          </Link>
          
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">Inicio</Link>
            <Link to="/about" className="navbar-link">Acerca de</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/tickets" className="navbar-link">Mis Tickets</Link>
                {user?.rol_usuario === 'ADMIN' && (
                  <Link to="/admin/usuarios" className="navbar-link">Usuarios</Link>
                )}
                {(user?.rol_usuario === 'ADMIN' || user?.rol_usuario === 'AGENTE') && (
                  <Link to="/admin/tickets" className="navbar-link">Administración</Link>
                )}
                <span className="navbar-user">
                  {user?.email || 'Usuario'}
                </span>
                <button onClick={handleLogout} className="btn btn-outline">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
