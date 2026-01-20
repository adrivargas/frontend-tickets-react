import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Sistema de Tickets de Soporte Técnico</h1>
          <p className="hero-subtitle">
            Gestiona y resuelve tus solicitudes de soporte de manera eficiente
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Características</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Gestión de Tickets</h3>
              <p>Crea y gestiona tickets de soporte técnico de manera organizada</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Múltiples Roles</h3>
              <p>Sistema de roles: Cliente, Agente y Administrador</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Rápido y Eficiente</h3>
              <p>Interfaz moderna y fácil de usar para una gestión ágil</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Seguimiento</h3>
              <p>Monitorea el estado de tus tickets en tiempo real</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
