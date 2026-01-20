import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogoService } from '../services/catalogoService';
import './CategoriaForm.css';

const CategoriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadCategoria();
    }
  }, [id]);

  const loadCategoria = async () => {
    try {
      setLoadingData(true);
      const data = await catalogoService.getCategorias();
      const categorias = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
      const categoria = categorias.find(c => c.id_categoria === parseInt(id));
      
      if (categoria) {
        setFormData({
          nombre_categoria: categoria.nombre_categoria || '',
          descripcion: categoria.descripcion || '',
        });
      }
    } catch (err) {
      setError('Error al cargar la categoría');
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
        await catalogoService.updateCategoria(id, formData);
      } else {
        await catalogoService.createCategoria(formData);
      }
      navigate('/admin/categorias');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="categoria-form">
      <div className="container">
        <div className="page-header">
          <h1>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h1>
          <button
            onClick={() => navigate('/admin/categorias')}
            className="btn btn-outline"
          >
            Volver
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre_categoria">Nombre Categoría *</label>
              <input
                type="text"
                id="nombre_categoria"
                name="nombre_categoria"
                value={formData.nombre_categoria}
                onChange={handleChange}
                required
                placeholder="Ej: Soporte Técnico"
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
                placeholder="Descripción de la categoría (opcional)"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin/categorias')}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Categoría'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriaForm;

