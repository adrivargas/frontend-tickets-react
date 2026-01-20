import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import './UsuariosList.css';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    loadUsuarios();
  }, [page, filters]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const params = { page, ...filters };
      const data = await usuarioService.getAll(params);

      if (data.results) {
        setUsuarios(data.results);
        setNextPage(data.next ? page + 1 : null);
        setPrevPage(data.previous ? page - 1 : null);
      } else {
        setUsuarios(Array.isArray(data) ? data : []);
      }
      setError('');
    } catch (err) {
      setError('Error al cargar los usuarios');
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
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await usuarioService.delete(id);
      loadUsuarios();
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'badge-danger';
      case 'AGENTE':
        return 'badge-primary';
      case 'CLIENTE':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="usuarios-list">
      <div className="container">
        <div className="page-header">
          <h1>Gestión de Usuarios</h1>
          <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
            + Nuevo Usuario
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <h2>Filtros</h2>
          <div className="filters">
            <div className="form-group">
              <label htmlFor="search">Buscar</label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Buscar por nombre, email, rol..."
              />
            </div>
          </div>
        </div>

        {usuarios.length === 0 ? (
          <div className="card">
            <p>No se encontraron usuarios.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td>{usuario.id_usuario}</td>
                      <td>{usuario.nombre_completo}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono || '-'}</td>
                      <td>
                        <span className={`badge ${getRolBadgeClass(usuario.rol_usuario)}`}>
                          {usuario.rol_usuario}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${usuario.activo ? 'badge-success' : 'badge-danger'}`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{new Date(usuario.fecha_creacion).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/usuarios/${usuario.id_usuario}/editar`}
                            className="btn btn-outline"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(usuario.id_usuario)}
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '6px 12px', marginLeft: '5px' }}
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

            {(nextPage || prevPage) && (
              <div className="pagination">
                <button
                  onClick={() => setPage(prevPage)}
                  disabled={!prevPage}
                  className="btn btn-outline"
                >
                  Anterior
                </button>
                <span>Página {page}</span>
                <button
                  onClick={() => setPage(nextPage)}
                  disabled={!nextPage}
                  className="btn btn-outline"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsuariosList;
