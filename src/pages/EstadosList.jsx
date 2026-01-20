import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogoService } from '../services/catalogoService';
import './EstadosList.css';

const EstadosList = () => {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    loadEstados();
  }, [filters]);

  const loadEstados = async () => {
    try {
      setLoading(true);
      const data = await catalogoService.getEstados();

      const estadosList = Array.isArray(data.results) 
        ? data.results 
        : (Array.isArray(data) ? data : []);

      setEstados(estadosList);
      setError('');
    } catch (err) {
      setError('Error al cargar los estados');
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
    if (!window.confirm('¿Estás seguro de que deseas eliminar este estado?')) {
      return;
    }

    try {
      await catalogoService.deleteEstado(id);
      loadEstados();
    } catch (err) {
      alert('Error al eliminar el estado');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando estados...</div>;
  }

  return (
    <div className="estados-list">
      <div className="container">
        <div className="page-header">
          <h1>Gestión de Estados</h1>
          <Link to="/admin/estados/nuevo" className="btn btn-primary">
            + Nuevo Estado
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

        {estados.length === 0 ? (
          <div className="card">
            <p>No hay estados creados. <Link to="/admin/estados/nuevo">Crea uno nuevo</Link></p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Es Final</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estados
                  .filter((estado) => 
                    filters.search === '' || 
                    estado.nombre_estado?.toLowerCase().includes(filters.search.toLowerCase())
                  )
                  .map((estado) => (
                    <tr key={estado.id_estado}>
                      <td>{estado.id_estado}</td>
                      <td>
                        <strong>{estado.nombre_estado}</strong>
                      </td>
                      <td>
                        <span className={`badge ${estado.es_final ? 'badge-danger' : 'badge-success'}`}>
                          {estado.es_final ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/estados/${estado.id_estado}/editar`}
                            className="btn btn-outline"
                            style={{ fontSize: '12px', padding: '6px 12px', marginRight: '8px' }}
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(estado.id_estado)}
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

export default EstadosList;

