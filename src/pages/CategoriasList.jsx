import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { catalogoService } from '../services/catalogoService';
import './CategoriasList.css';

const CategoriasList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [filters, setFilters] = useState({ search: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadCategorias();
  }, [page, filters]);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const params = { page, ...filters };
      const data = await catalogoService.getCategorias();

      const categoriasList = Array.isArray(data.results) 
        ? data.results 
        : (Array.isArray(data) ? data : []);

      setCategorias(categoriasList);
      setError('');
    } catch (err) {
      setError('Error al cargar las categorías');
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
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    try {
      await catalogoService.deleteCategoria(id);
      loadCategorias();
    } catch (err) {
      alert('Error al eliminar la categoría');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando categorías...</div>;
  }

  return (
    <div className="categorias-list">
      <div className="container">
        <div className="page-header">
          <h1>Gestión de Categorías</h1>
          <Link to="/admin/categorias/nuevo" className="btn btn-primary">
            + Nueva Categoría
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

        {categorias.length === 0 ? (
          <div className="card">
            <p>No hay categorías creadas. <Link to="/admin/categorias/nuevo">Crea una nueva</Link></p>
          </div>
        ) : (
          <>
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
                  {categorias
                    .filter((cat) => 
                      filters.search === '' || 
                      cat.nombre_categoria?.toLowerCase().includes(filters.search.toLowerCase()) ||
                      cat.descripcion?.toLowerCase().includes(filters.search.toLowerCase())
                    )
                    .map((categoria) => (
                      <tr key={categoria.id_categoria}>
                        <td>{categoria.id_categoria}</td>
                        <td>
                          <strong>{categoria.nombre_categoria}</strong>
                        </td>
                        <td>{categoria.descripcion || '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/admin/categorias/${categoria.id_categoria}/editar`}
                              className="btn btn-outline"
                              style={{ fontSize: '12px', padding: '6px 12px', marginRight: '8px' }}
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(categoria.id_categoria)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriasList;

