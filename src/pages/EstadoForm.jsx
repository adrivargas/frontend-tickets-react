import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogoService } from '../services/catalogoService';
import './EstadoForm.css';

const EstadoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre_estado: '',
    es_final: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadEstado();
    }
  }, [id]);

  const loadEstado = async () => {
    try {
      setLoadingData(true);
      const data = await catalogoService.getEstados();
      const estados = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
      const estado = estados.find(e => e.id_estado === parseInt(id));
      
      if (estado) {
        setFormData({
          nombre_estado: estado.nombre_estado || '',
          es_final: estado.es_final || false,
        });
      }
    } catch (err) {
      setError('Error al cargar el estado');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await catalogoService.updateEstado(id, formData);
      } else {
        await catalogoService.createEstado(formData);
      }
      navigate('/admin/estados');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el estado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="estado-form">
      <div className="container">
        <div className="page-header">
          <h1>{isEditing ? 'Editar Estado' : 'Nuevo Estado'}</h1>
          <button
            onClick={() => navigate('/admin/estados')}
            className="btn btn-outline"
          >
            Volver
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre_estado">Nombre Estado *</label>
              <input
                type="text"
                id="nombre_estado"
                name="nombre_estado"
                value={formData.nombre_estado}
                onChange={handleChange}
                required
                placeholder="Ej: Abierto, En Progreso, Cerrado"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="es_final"
                  checked={formData.es_final}
                  onChange={handleChange}
                />
                <span>Estado Final (marca si este estado cierra el ticket)</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin/estados')}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Estado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EstadoForm;

