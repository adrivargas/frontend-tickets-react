import { useState, useEffect } from 'react';
import { catalogoService } from '../services/catalogoService';
import Modal from './Modal';
import './EstadoModal.css';

const EstadoModal = ({ isOpen, onClose, estado }) => {
  const [formData, setFormData] = useState({
    nombre_estado: '',
    es_final: false,
  });
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!estado;

  useEffect(() => {
    if (isOpen) {
      loadEstados();
      if (estado) {
        setFormData({
          nombre_estado: estado.nombre_estado || '',
          es_final: estado.es_final || false,
        });
      } else {
        setFormData({
          nombre_estado: '',
          es_final: false,
        });
      }
      setError('');
    }
  }, [isOpen, estado]);

  const loadEstados = async () => {
    try {
      const data = await catalogoService.getEstados();
      const estadosList = Array.isArray(data.results) 
        ? data.results 
        : (Array.isArray(data) ? data : []);
      setEstados(estadosList);
    } catch (err) {
      console.error('Error al cargar estados:', err);
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
        await catalogoService.updateEstado(estado.id_estado, formData);
      } else {
        await catalogoService.createEstado(formData);
      }
      onClose();
      loadEstados();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.nombre_estado?.[0] || 'Error al guardar el estado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este estado?')) {
      return;
    }

    try {
      await catalogoService.deleteEstado(id);
      loadEstados();
    } catch (err) {
      alert('Error al eliminar el estado');
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Estado' : 'Gestión de Estados'}
    >
      <div className="estado-modal">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          
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

        <div className="estados-list-section">
          <h3>Estados Existentes</h3>
          {estados.length === 0 ? (
            <p className="empty-message">No hay estados creados</p>
          ) : (
            <div className="items-list">
              {estados.map((est) => (
                <div key={est.id_estado} className="item-row">
                  <div className="item-info">
                    <strong>{est.nombre_estado}</strong>
                    <span className={`badge ${est.es_final ? 'badge-danger' : 'badge-success'}`}>
                      {est.es_final ? 'Final' : 'No Final'}
                    </span>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => {
                        setFormData({
                          nombre_estado: est.nombre_estado || '',
                          es_final: est.es_final || false,
                        });
                        setError('');
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(est.id_estado)}
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

export default EstadoModal;

