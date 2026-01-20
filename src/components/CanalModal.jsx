import { useState, useEffect } from 'react';
import { catalogoService } from '../services/catalogoService';
import Modal from './Modal';
import './CanalModal.css';

const CanalModal = ({ isOpen, onClose, canal }) => {
  const [formData, setFormData] = useState({
    nombre_canal: '',
    descripcion: '',
  });
  const [canales, setCanales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!canal;

  useEffect(() => {
    if (isOpen) {
      loadCanales();
      if (canal) {
        setFormData({
          nombre_canal: canal.nombre_canal || '',
          descripcion: canal.descripcion || '',
        });
      } else {
        setFormData({
          nombre_canal: '',
          descripcion: '',
        });
      }
      setError('');
    }
  }, [isOpen, canal]);

  const loadCanales = async () => {
    try {
      const data = await catalogoService.getCanales();
      const canalesList = Array.isArray(data.results) 
        ? data.results 
        : (Array.isArray(data) ? data : []);
      setCanales(canalesList);
    } catch (err) {
      console.error('Error al cargar canales:', err);
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
        await catalogoService.updateCanal(canal.id_canal, formData);
      } else {
        await catalogoService.createCanal(formData);
      }
      onClose();
      loadCanales();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.nombre_canal?.[0] || 'Error al guardar el canal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este canal?')) {
      return;
    }

    try {
      await catalogoService.deleteCanal(id);
      loadCanales();
    } catch (err) {
      alert('Error al eliminar el canal');
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Canal' : 'Gestión de Canales de Contacto'}
    >
      <div className="canal-modal">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          
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
              rows="3"
              placeholder="Descripción del canal (opcional)"
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

        <div className="canales-list-section">
          <h3>Canales Existentes</h3>
          {canales.length === 0 ? (
            <p className="empty-message">No hay canales creados</p>
          ) : (
            <div className="items-list">
              {canales.map((can) => (
                <div key={can.id_canal} className="item-row">
                  <div className="item-info">
                    <strong>{can.nombre_canal}</strong>
                    {can.descripcion && <span className="item-desc">{can.descripcion}</span>}
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => {
                        setFormData({
                          nombre_canal: can.nombre_canal || '',
                          descripcion: can.descripcion || '',
                        });
                        setError('');
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(can.id_canal)}
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

export default CanalModal;

