import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized">
      <div className="container">
        <div className="card unauthorized-card">
          <h1>403 - Acceso No Autorizado</h1>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p className="unauthorized-message">
            Esta sección requiere permisos especiales. Contacta al administrador si crees que esto es un error.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
