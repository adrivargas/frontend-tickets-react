import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { catalogoService } from '../services/catalogoService';
import Modal from '../components/Modal';
import CategoriaModal from '../components/CategoriaModal';
import EstadoModal from '../components/EstadoModal';
import CanalModal from '../components/CanalModal';
import './AdminTickets.css';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    prioridad: '',
  });
  
  // Estados para modales
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
  const [modalCanalOpen, setModalCanalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [editingEstado, setEditingEstado] = useState(null);
  const [editingCanal, setEditingCanal] = useState(null);

  useEffect(() => {
    loadTickets();
  }, [page, filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const params = { page, ...filters };
      const data = await ticketService.getAll(params);

      if (data.results) {
        setTickets(data.results);
        setNextPage(data.next ? page + 1 : null);
        setPrevPage(data.previous ? page - 1 : null);
      } else {
        setTickets(Array.isArray(data) ? data : []);
      }
      setError('');
    } catch (err) {
      setError('Error al cargar los tickets');
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

  const clearFilters = () => {
    setFilters({ search: '', estado: '', prioridad: '' });
    setPage(1);
  };

  const handleOpenCategoriaModal = (categoria = null) => {
    setEditingCategoria(categoria);
    setModalCategoriaOpen(true);
  };

  const handleCloseCategoriaModal = () => {
    setModalCategoriaOpen(false);
    setEditingCategoria(null);
  };

  const handleOpenEstadoModal = (estado = null) => {
    setEditingEstado(estado);
    setModalEstadoOpen(true);
  };

  const handleCloseEstadoModal = () => {
    setModalEstadoOpen(false);
    setEditingEstado(null);
  };

  const handleOpenCanalModal = (canal = null) => {
    setEditingCanal(canal);
    setModalCanalOpen(true);
  };

  const handleCloseCanalModal = () => {
    setModalCanalOpen(false);
    setEditingCanal(null);
  };

  const getEstadoBadgeClass = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('abierto')) return 'badge-success';
    if (estadoLower.includes('cerrado')) return 'badge-danger';
    if (estadoLower.includes('en progreso')) return 'badge-primary';
    return 'badge-secondary';
  };

  const getPrioridadBadgeClass = (prioridad) => {
    const prioridadLower = prioridad?.toLowerCase() || '';
    if (prioridadLower.includes('crítica') || prioridadLower.includes('critica')) return 'badge-danger';
    if (prioridadLower.includes('alta')) return 'badge-danger';
    if (prioridadLower.includes('media')) return 'badge-warning';
    if (prioridadLower.includes('baja')) return 'badge-success';
    return 'badge-secondary';
  };

  if (loading) {
    return <div className="loading">Cargando tickets...</div>;
  }

  return (
    <div className="admin-tickets">
      <div className="container">
        <div className="page-header">
          <h1>Administración</h1>
        </div>

        {/* Panel de Configuración */}
        <div className="card config-panel">
          <h2>Configuración del Sistema</h2>
          <div className="config-buttons">
            <button
              onClick={() => handleOpenCategoriaModal()}
              className="btn btn-primary"
            >
              📁 Categorías
            </button>
            <button
              onClick={() => handleOpenEstadoModal()}
              className="btn btn-primary"
            >
              📊 Estados
            </button>
            <button
              onClick={() => handleOpenCanalModal()}
              className="btn btn-primary"
            >
              📞 Canales
            </button>
          </div>
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
                placeholder="Buscar por código, título..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                placeholder="Filtrar por estado"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prioridad">Prioridad</label>
              <input
                type="text"
                id="prioridad"
                name="prioridad"
                value={filters.prioridad}
                onChange={handleFilterChange}
                placeholder="Filtrar por prioridad"
              />
            </div>
            <div className="form-group">
              <button onClick={clearFilters} className="btn btn-outline">
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="card">
            <p>No se encontraron tickets.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Título</th>
                    <th>Cliente</th>
                    <th>Categoría</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id_ticket}>
                      <td>
                        <strong>{ticket.codigo_ticket}</strong>
                      </td>
                      <td>{ticket.titulo}</td>
                      <td>{ticket.id_cliente?.nombre_completo || '-'}</td>
                      <td>{ticket.id_categoria?.nombre_categoria || '-'}</td>
                      <td>
                        <span className={`badge ${getPrioridadBadgeClass(ticket.id_prioridad?.nombre_prioridad)}`}>
                          {ticket.id_prioridad?.nombre_prioridad || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(ticket.id_estado?.nombre_estado)}`}>
                          {ticket.id_estado?.nombre_estado || '-'}
                        </span>
                      </td>
                      <td>
                        {new Date(ticket.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td>
                        <Link
                          to={`/tickets/${ticket.id_ticket}`}
                          className="btn btn-outline"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Ver
                        </Link>
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

        {/* Modales */}
        <CategoriaModal
          isOpen={modalCategoriaOpen}
          onClose={handleCloseCategoriaModal}
          categoria={editingCategoria}
        />
        
        <EstadoModal
          isOpen={modalEstadoOpen}
          onClose={handleCloseEstadoModal}
          estado={editingEstado}
        />
        
        <CanalModal
          isOpen={modalCanalOpen}
          onClose={handleCloseCanalModal}
          canal={editingCanal}
        />
      </div>
    </div>
  );
};

export default AdminTickets;
