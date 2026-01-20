import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogoService } from '../services/catalogoService';
import './CanalesList.css';

const CanalesList = () => {
  const [canales, setCanales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    loadCanales();
  }, [filters]);

  const loadCanales = async () => {
    try {
      setLoading(true);
      const data = await catalogoService.getCanales();

      const canalesList = Array.isArray(data.results) 
        ? data.results 
        : (Array.isArray(data) ? data : []);

      setCanales(canalesList);
      setError('');
    } catch (err) {
      setError('Error al cargar los canales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este canal?')) {
      return;
    }

    try {
      await catalogoService.deleteCanal(id);
      loadCanales();
    } catch (err) {
      alert('Error al eliminar el canal');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando canales...</div>;
  }

  return (
    <div className="canales-list">
      <div className="container">
        <div className="page-header">
          <h1>Gestión de Canales de Contacto</h1>
          <Link to="/admin/canales/nuevo" className="btn btn-primary">
            + Nuevo Canal
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="filters">
            <div className="form-group">
              <label htmlFor="search">Buscar</label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Buscar por nombre..."
              />
            </div>
          </div>
        </div>

        {canales.length === 0 ? (
          <div className="card">
            <p>No hay canales creados. <Link to="/admin/canales/nuevo">Crea uno nuevo</Link></p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {canales
                  .filter((canal) => 
                    filters.search === '' || 
                    canal.nombre_canal?.toLowerCase().includes(filters.search.toLowerCase()) ||
                    canal.descripcion?.toLowerCase().includes(filters.search.toLowerCase())
                  )
                  .map((canal) => (
                    <tr key={canal.id_canal}>
                      <td>{canal.id_canal}</td>
                      <td>
                        <strong>{canal.nombre_canal}</strong>
                      </td>
                      <td>{canal.descripcion || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/canales/${canal.id_canal}/editar`}
                            className="btn btn-outline"
                            style={{ fontSize: '12px', padding: '6px 12px', marginRight: '8px' }}
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(canal.id_canal)}
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanalesList;

