import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { catalogoService } from '../services/catalogoService';
import { useAuth } from '../context/AuthContext';
import './TicketForm.css';

const TicketForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    id_categoria: '',
    id_prioridad: '',
    id_canal: '',
    id_estado: '',
  });

  const [categorias, setCategorias] = useState([]);
  // Prioridades fijas (hardcoded) - Deben coincidir con la base de datos
  // IDs según la base de datos: Baja(1), Media(2), Alta(3), Crítica(7)
  const prioridades = [
    { id_prioridad: 1, nombre_prioridad: 'Baja' },
    { id_prioridad: 2, nombre_prioridad: 'Media' },
    { id_prioridad: 3, nombre_prioridad: 'Alta' },
    { id_prioridad: 7, nombre_prioridad: 'Crítica' },
  ];
  const [canales, setCanales] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  
  // Determinar si el usuario puede editar el estado (solo ADMIN y AGENTE)
  const canEditEstado = user?.rol_usuario === 'ADMIN' || user?.rol_usuario === 'AGENTE';

  useEffect(() => {
    loadCatalogos();
    if (isEditing) {
      loadTicket();
    } else {
      setLoadingData(false);
    }
  }, [id]);

  const loadCatalogos = async () => {
    try {
      const [cats, canals, estadosData] = await Promise.all([
        catalogoService.getCategorias(),
        catalogoService.getCanales(),
        catalogoService.getEstados(),
      ]);

      setCategorias(Array.isArray(cats.results) ? cats.results : (Array.isArray(cats) ? cats : []));
      setCanales(Array.isArray(canals.results) ? canals.results : (Array.isArray(canals) ? canals : []));
      setEstados(Array.isArray(estadosData.results) ? estadosData.results : (Array.isArray(estadosData) ? estadosData : []));
      // Las prioridades están hardcoded, no se cargan de la API
    } catch (err) {
      console.error('Error al cargar catálogos:', err);
    }
  };

  const loadTicket = async () => {
    try {
      setLoadingData(true);
      const ticket = await ticketService.getById(id);
      setFormData({
        titulo: ticket.titulo || '',
        descripcion: ticket.descripcion || '',
        id_categoria: ticket.id_categoria?.id_categoria || '',
        id_prioridad: ticket.id_prioridad?.id_prioridad || '',
        id_canal: ticket.id_canal?.id_canal || '',
        id_estado: ticket.id_estado?.id_estado || '',
      });
    } catch (err) {
      setError('Error al cargar el ticket');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convertir valores de string a entero para los ForeignKeys
      const data = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        id_categoria: formData.id_categoria ? parseInt(formData.id_categoria) : null,
        id_prioridad: formData.id_prioridad ? parseInt(formData.id_prioridad) : null,
        id_canal: formData.id_canal ? parseInt(formData.id_canal) : null,
        id_cliente: user?.id_usuario || null,
      };
      
      // Solo incluir id_estado si es edición y el usuario puede editarlo
      if (isEditing && canEditEstado && formData.id_estado) {
        data.id_estado = formData.id_estado ? parseInt(formData.id_estado) : null;
      }

      if (isEditing) {
        await ticketService.update(id, data);
      } else {
        await ticketService.create(data);
      }

      navigate('/tickets');
    } catch (err) {
      console.error('Error completo al guardar ticket:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      console.error('Data enviada:', {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        id_categoria: parseInt(formData.id_categoria),
        id_prioridad: parseInt(formData.id_prioridad),
        id_canal: parseInt(formData.id_canal),
        id_cliente: user?.id_usuario,
      });
      
      // Mostrar error más detallado
      let errorMessage = 'Error al guardar el ticket';
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'object') {
          // Si hay múltiples errores, mostrarlos todos
          const errors = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          errorMessage = errors || errorMessage;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="ticket-form">
      <div className="container">
        <div className="card">
          <h1>{isEditing ? 'Editar Ticket' : 'Nuevo Ticket'}</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Título *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Describe brevemente el problema"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Detalla el problema o solicitud"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_categoria">Categoría *</label>
                <select
                  id="id_categoria"
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_prioridad">Prioridad *</label>
                <select
                  id="id_prioridad"
                  name="id_prioridad"
                  value={formData.id_prioridad}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {prioridades.map((prio) => (
                    <option key={prio.id_prioridad} value={prio.id_prioridad}>
                      {prio.nombre_prioridad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_canal">Canal de Contacto *</label>
                <select
                  id="id_canal"
                  name="id_canal"
                  value={formData.id_canal}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {canales.map((canal) => (
                    <option key={canal.id_canal} value={canal.id_canal}>
                      {canal.nombre_canal}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campo de Estado - Solo visible en edición y para ADMIN/AGENTE */}
            {isEditing && canEditEstado && (
              <div className="form-group">
                <label htmlFor="id_estado">Estado *</label>
                <select
                  id="id_estado"
                  name="id_estado"
                  value={formData.id_estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {estados.map((estado) => (
                    <option key={estado.id_estado} value={estado.id_estado}>
                      {estado.nombre_estado}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
