import { useState, useEffect } from 'react';
import { catalogoService } from '../services/catalogoService';
import Modal from './Modal';
import './CategoriaModal.css';

const CategoriaModal = ({ isOpen, onClose, categoria }) => {
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!categoria;

  useEffect(() => {
    if (isOpen) {
      loadCategorias();
      if (categoria) {
        setFormData({
          nombre_categoria: categoria.nombre_categoria || '',
          descripcion: categoria.descripcion || '',
        });
      } else {
        setFormData({
          nombre_categoria: '',
          descripcion: '',
        });
      }
      setError('');
    }
  }, [isOpen, categoria]);

  const loadCategorias = async () => {
    try {
      const data = await catalogoService.getCategorias();
      const categoriasList = Array.isArray(data.results) 
        ? data.results 
        : (Array.isArray(data) ? data : []);
      setCategorias(categoriasList);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
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
        await catalogoService.updateCategoria(categoria.id_categoria, formData);
      } else {
        await catalogoService.createCategoria(formData);
      }
      onClose();
      loadCategorias();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.nombre_categoria?.[0] || 'Error al guardar la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Categoría' : 'Gestión de Categorías'}
    >
      <div className="categoria-modal">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          
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
              rows="3"
              placeholder="Descripción de la categoría (opcional)"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>

        <div className="categorias-list-section">
          <h3>Categorías Existentes</h3>
          {categorias.length === 0 ? (
            <p className="empty-message">No hay categorías creadas</p>
          ) : (
            <div className="items-list">
              {categorias.map((cat) => (
                <div key={cat.id_categoria} className="item-row">
                  <div className="item-info">
                    <strong>{cat.nombre_categoria}</strong>
                    {cat.descripcion && <span className="item-desc">{cat.descripcion}</span>}
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => {
                        setFormData({
                          nombre_categoria: cat.nombre_categoria || '',
                          descripcion: cat.descripcion || '',
                        });
                        setError('');
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id_categoria)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CategoriaModal;

