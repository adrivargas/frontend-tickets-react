import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { catalogoService } from '../services/catalogoService';
import { useAuth } from '../context/AuthContext';
import './TicketsList.css';

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');
  const [estados, setEstados] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [canales, setCanales] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    prioridad: '',
    canal: '',
  });
  const { user } = useAuth();

  const loadCatalogos = useCallback(async () => {
    try {
      const [estadosData, prioridadesData, canalesData] = await Promise.all([
        catalogoService.getEstados(),
        catalogoService.getPrioridades(),
        catalogoService.getCanales(),
      ]);
      
      setEstados(Array.isArray(estadosData.results) ? estadosData.results : (Array.isArray(estadosData) ? estadosData : []));
      setPrioridades(Array.isArray(prioridadesData.results) ? prioridadesData.results : (Array.isArray(prioridadesData) ? prioridadesData : []));
      setCanales(Array.isArray(canalesData.results) ? canalesData.results : (Array.isArray(canalesData) ? canalesData : []));
    } catch (err) {
      console.error('Error al cargar catálogos:', err);
    }
  }, []);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      // Limpiar filtros vacíos antes de enviar
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      const params = { page, ...cleanFilters };
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
      console.error('Error completo:', err);
      console.error('Error response:', err.response?.data);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadCatalogos();
  }, [loadCatalogos]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const abiertos = tickets.filter(t => {
      const estado = t.id_estado?.nombre_estado?.toLowerCase() || '';
      return estado.includes('abierto');
    }).length;
    
    const enProgreso = tickets.filter(t => {
      const estado = t.id_estado?.nombre_estado?.toLowerCase() || '';
      return estado.includes('progreso') || estado.includes('en progreso');
    }).length;
    
    const criticos = tickets.filter(t => {
      const prioridad = t.id_prioridad?.nombre_prioridad?.toLowerCase() || '';
      return prioridad.includes('crítica') || prioridad.includes('critica');
    }).length;
    
    const hoy = tickets.filter(t => {
      const fecha = new Date(t.fecha_creacion);
      const hoy = new Date();
      return fecha.toDateString() === hoy.toDateString();
    }).length;

    return { abiertos, enProgreso, criticos, hoy };
  }, [tickets]);

  const handleFilterClick = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value,
    }));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
    setPage(1);
  };

  // Agrupar tickets por estado para vista Kanban
  const ticketsPorEstado = useMemo(() => {
    const grouped = estados.reduce((acc, estado) => {
      acc[estado.id_estado] = {
        estado,
        tickets: [],
      };
      return acc;
    }, {});

    tickets.forEach((ticket) => {
      const estadoId = ticket.id_estado?.id_estado;
      if (estadoId && grouped[estadoId]) {
        grouped[estadoId].tickets.push(ticket);
      }
    });

    return grouped;
  }, [tickets, estados]);

  const getPrioridadBadgeClass = (prioridad) => {
    const prioridadLower = prioridad?.toLowerCase() || '';
    if (prioridadLower.includes('crítica') || prioridadLower.includes('critica')) return 'badge-critical';
    if (prioridadLower.includes('alta')) return 'badge-danger';
    if (prioridadLower.includes('media')) return 'badge-warning';
    if (prioridadLower.includes('baja')) return 'badge-success';
    return 'badge-secondary';
  };

  const getEstadoBadgeClass = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('abierto')) return 'badge-open';
    if (estadoLower.includes('cerrado')) return 'badge-closed';
    if (estadoLower.includes('en progreso') || estadoLower.includes('progreso')) return 'badge-progress';
    if (estadoLower.includes('en espera') || estadoLower.includes('espera')) return 'badge-waiting';
    if (estadoLower.includes('resuelto')) return 'badge-resolved';
    return 'badge-secondary';
  };

  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('abierto')) return '#3b82f6';
    if (estadoLower.includes('cerrado')) return '#6b7280';
    if (estadoLower.includes('en progreso') || estadoLower.includes('progreso')) return '#f59e0b';
    if (estadoLower.includes('en espera') || estadoLower.includes('espera')) return '#f59e0b';
    if (estadoLower.includes('resuelto')) return '#10b981';
    return '#6b7280';
  };

  if (loading) {
    return <div className="loading">Cargando tickets...</div>;
  }

  return (
    <div className="tickets-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Bandeja de Tickets</h1>
          <Link to="/tickets/nuevo" className="btn btn-success btn-create-ticket">
            + Crear Ticket
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Tarjetas de Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card stat-open">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-label">Abiertos</div>
              <div className="stat-value">{stats.abiertos}</div>
            </div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-icon">⚙️</div>
            <div className="stat-content">
              <div className="stat-label">En Progreso</div>
              <div className="stat-value">{stats.enProgreso}</div>
            </div>
          </div>
          <div className="stat-card stat-critical">
            <div className="stat-icon">🔴</div>
            <div className="stat-content">
              <div className="stat-label">Críticos (SLA &lt;2h)</div>
              <div className="stat-value">{stats.criticos}</div>
            </div>
          </div>
          <div className="stat-card stat-today">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-label">Utiliza hoy</div>
              <div className="stat-value">{stats.hoy}</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Estado:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filters.estado === '' ? 'active' : ''}`}
                onClick={() => handleFilterClick('estado', '')}
              >
                Todos
              </button>
              {estados.map((estado) => (
                <button
                  key={estado.id_estado}
                  className={`filter-btn ${filters.estado === estado.nombre_estado ? 'active' : ''}`}
                  onClick={() => handleFilterClick('estado', estado.nombre_estado)}
                >
                  {estado.nombre_estado}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Prioridad:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filters.prioridad === '' ? 'active' : ''}`}
                onClick={() => handleFilterClick('prioridad', '')}
              >
                Todas
              </button>
              {prioridades.map((prioridad) => (
                <button
                  key={prioridad.id_prioridad}
                  className={`filter-btn priority-${prioridad.nombre_prioridad.toLowerCase()} ${filters.prioridad === prioridad.nombre_prioridad ? 'active' : ''}`}
                  onClick={() => handleFilterClick('prioridad', prioridad.nombre_prioridad)}
                >
                  {prioridad.nombre_prioridad}
                  {prioridad.nombre_prioridad.toLowerCase().includes('crítica') && stats.criticos > 0 && (
                    <span className="filter-badge">{stats.criticos}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Canal:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filters.canal === '' ? 'active' : ''}`}
                onClick={() => handleFilterClick('canal', '')}
              >
                Todos
              </button>
              {canales.map((canal) => (
                <button
                  key={canal.id_canal}
                  className={`filter-btn ${filters.canal === canal.nombre_canal ? 'active' : ''}`}
                  onClick={() => handleFilterClick('canal', canal.nombre_canal)}
                >
                  {canal.nombre_canal}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-search">
            <input
              type="text"
              placeholder="Buscar por ID, título, usuario..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        {/* Vista Kanban */}
        {viewMode === 'kanban' && (
          <div className="kanban-board-modern">
            {estados.map((estado) => {
              const columna = ticketsPorEstado[estado.id_estado];
              const ticketsColumna = columna?.tickets || [];
              
              return (
                <div key={estado.id_estado} className="kanban-column-modern">
                  <div className="kanban-column-header-modern" style={{ borderTopColor: getEstadoColor(estado.nombre_estado) }}>
                    <h3>{estado.nombre_estado.toUpperCase()}</h3>
                    <span className="kanban-count-modern">{ticketsColumna.length}</span>
                  </div>
                  <div className="kanban-column-content-modern">
                    {ticketsColumna.length === 0 ? (
                      <div className="kanban-empty-modern">No hay tickets</div>
                    ) : (
                      ticketsColumna.map((ticket) => (
                        <Link
                          key={ticket.id_ticket}
                          to={`/tickets/${ticket.id_ticket}`}
                          className="kanban-card-modern"
                        >
                          <div className="kanban-card-header-modern">
                            <div className="kanban-card-badges">
                              <span className={`badge ${getEstadoBadgeClass(ticket.id_estado?.nombre_estado)}`}>
                                {ticket.id_estado?.nombre_estado || '-'}
                              </span>
                              <span className={`badge ${getPrioridadBadgeClass(ticket.id_prioridad?.nombre_prioridad)}`}>
                                {ticket.id_prioridad?.nombre_prioridad || '-'}
                              </span>
                              {ticket.id_canal && (
                                <span className="badge badge-channel">{ticket.id_canal.nombre_canal}</span>
                              )}
                            </div>
                          </div>
                          <div className="kanban-card-code-modern">{ticket.codigo_ticket}</div>
                          <div className="kanban-card-title-modern">{ticket.titulo}</div>
                          {ticket.id_cliente && (
                            <div className="kanban-card-user">
                              <div className="user-avatar">{ticket.id_cliente.nombre_completo?.charAt(0) || 'U'}</div>
                              <div className="user-info">
                                <div className="user-name">{ticket.id_cliente.nombre_completo || '-'}</div>
                                <div className="user-email">{ticket.id_cliente.email || '-'}</div>
                              </div>
                            </div>
                          )}
                          <div className="kanban-card-category-modern">
                            {ticket.id_categoria?.nombre_categoria || '-'}
                            {ticket.id_categoria?.descripcion && ` · ${ticket.id_categoria.descripcion}`}
                          </div>
                          {ticket.id_prioridad && (
                            <div className="kanban-card-sla">
                              <span>SLA: Resp {ticket.id_prioridad.tiempo_respuesta_hrs}h · Res {ticket.id_prioridad.tiempo_resolucion_hrs}h</span>
                            </div>
                          )}
                          <div className="kanban-card-footer-modern">
                            <div className="kanban-card-dates">
                              <div className="kanban-card-date">
                                Creado: {new Date(ticket.fecha_creacion).toLocaleDateString()} {new Date(ticket.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {ticket.fecha_actualizacion && (
                                <div className="kanban-card-date">
                                  Última act: {new Date(ticket.fecha_actualizacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsList;
