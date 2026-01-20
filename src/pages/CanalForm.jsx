import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogoService } from '../services/catalogoService';
import './CanalForm.css';

const CanalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre_canal: '',
    descripcion: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadCanal();
    }
  }, [id]);

  const loadCanal = async () => {
    try {
      setLoadingData(true);
      const data = await catalogoService.getCanales();
      const canales = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
      const canal = canales.find(c => c.id_canal === parseInt(id));
      
      if (canal) {
        setFormData({
          nombre_canal: canal.nombre_canal || '',
          descripcion: canal.descripcion || '',
        });
      }
    } catch (err) {
      setError('Error al cargar el canal');
      console.error(err);
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
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await catalogoService.updateCanal(id, formData);
      } else {
        await catalogoService.createCanal(formData);
      }
      navigate('/admin/canales');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el canal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="canal-form">
      <div className="container">
        <div className="page-header">
          <h1>{isEditing ? 'Editar Canal' : 'Nuevo Canal de Contacto'}</h1>
          <button
            onClick={() => navigate('/admin/canales')}
            className="btn btn-outline"
          >
            Volver
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre_canal">Nombre Canal *</label>
              <input
                type="text"
                id="nombre_canal"
                name="nombre_canal"
                value={formData.nombre_canal}
                onChange={handleChange}
                required
                placeholder="Ej: Email, Teléfono, Chat"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                placeholder="Descripción del canal (opcional)"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin/canales')}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Canal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CanalForm;

