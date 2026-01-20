import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { comentarioService } from '../services/comentarioService';
import { useAuth } from '../context/AuthContext';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  useEffect(() => {
    loadTicket();
    loadComentarios();
  }, [id]);

  const loadTicket = async () => {
    try {
      const data = await ticketService.getById(id);
      setTicket(data);
    } catch (err) {
      setError('Error al cargar el ticket');
    } finally {
      setLoading(false);
    }
  };

  const loadComentarios = async () => {
    try {
      const data = await comentarioService.getByTicket(id);
      setComentarios(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      setEnviandoComentario(true);
      await comentarioService.create({
        id_ticket: parseInt(id),
        id_usuario_autor: user?.id_usuario || 1,
        contenido: nuevoComentario,
        es_interno: false,
      });
      setNuevoComentario('');
      loadComentarios();
    } catch (err) {
      setError('Error al enviar el comentario');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este ticket?')) return;

    try {
      await ticketService.delete(id);
      navigate('/tickets');
    } catch (err) {
      setError('Error al eliminar el ticket');
    }
  };

  if (loading) {
    return <div className="loading">Cargando ticket...</div>;
  }

  if (!ticket) {
    return <div className="alert alert-error">Ticket no encontrado</div>;
  }

  const canEdit = user?.rol_usuario === 'ADMIN' || user?.rol_usuario === 'AGENTE';
  const canDelete = user?.rol_usuario === 'ADMIN';

  return (
    <div className="ticket-detail">
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/tickets')} className="btn btn-outline">
            ← Volver
          </button>
          {canEdit && (
            <div>
              <button
                onClick={() => navigate(`/tickets/${id}/editar`)}
                className="btn btn-primary"
              >
                Editar
              </button>
              {canDelete && (
                <button onClick={handleDelete} className="btn btn-danger" style={{ marginLeft: '10px' }}>
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="ticket-header">
            <div>
              <h1>{ticket.titulo}</h1>
              <p className="ticket-code">Código: {ticket.codigo_ticket}</p>
            </div>
            <div className="ticket-badges">
              <span className={`badge ${getEstadoBadgeClass(ticket.id_estado?.nombre_estado)}`}>
                {ticket.id_estado?.nombre_estado || '-'}
              </span>
              <span className={`badge ${getPrioridadBadgeClass(ticket.id_prioridad?.nombre_prioridad)}`}>
                {ticket.id_prioridad?.nombre_prioridad || '-'}
              </span>
            </div>
          </div>

          <div className="ticket-info">
            <div className="info-item">
              <strong>Categoría:</strong> {ticket.id_categoria?.nombre_categoria || '-'}
            </div>
            <div className="info-item">
              <strong>Canal:</strong> {ticket.id_canal?.nombre_canal || '-'}
            </div>
            <div className="info-item">
              <strong>Cliente:</strong> {ticket.id_cliente?.nombre_completo || '-'}
            </div>
            {ticket.id_agente_asignado && (
              <div className="info-item">
                <strong>Agente:</strong> {ticket.id_agente_asignado.nombre_completo}
              </div>
            )}
            <div className="info-item">
              <strong>Fecha de creación:</strong>{' '}
              {new Date(ticket.fecha_creacion).toLocaleString()}
            </div>
          </div>

          <div className="ticket-description">
            <h3>Descripción</h3>
            <p>{ticket.descripcion}</p>
          </div>
        </div>

        <div className="card">
          <h2>Comentarios ({comentarios.length})</h2>

          <div className="comentarios-list">
            {comentarios.length === 0 ? (
              <p>No hay comentarios aún.</p>
            ) : (
              comentarios.map((comentario) => (
                <div key={comentario.id_comentario} className="comentario-item">
                  <div className="comentario-header">
                    <strong>{comentario.id_usuario_autor?.nombre_completo || 'Usuario'}</strong>
                    <span className="comentario-fecha">
                      {new Date(comentario.fecha_creacion).toLocaleString()}
                    </span>
                  </div>
                  <div className="comentario-contenido">{comentario.contenido}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleEnviarComentario} className="comentario-form">
            <div className="form-group">
              <label htmlFor="comentario">Nuevo Comentario</label>
              <textarea
                id="comentario"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows="3"
                placeholder="Escribe un comentario..."
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={enviandoComentario}>
              {enviandoComentario ? 'Enviando...' : 'Enviar Comentario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  function getEstadoBadgeClass(estado) {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('abierto')) return 'badge-success';
    if (estadoLower.includes('cerrado')) return 'badge-danger';
    if (estadoLower.includes('en progreso')) return 'badge-primary';
    return 'badge-secondary';
  }

  function getPrioridadBadgeClass(prioridad) {
    const prioridadLower = prioridad?.toLowerCase() || '';
    if (prioridadLower.includes('alta')) return 'badge-danger';
    if (prioridadLower.includes('media')) return 'badge-warning';
    if (prioridadLower.includes('baja')) return 'badge-success';
    return 'badge-secondary';
  }
};

export default TicketDetail;
