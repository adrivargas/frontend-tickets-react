import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import './UsuarioForm.css';

const UsuarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    rol_usuario: 'CLIENTE',
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isEditing) {
      loadUsuario();
    } else {
      setLoadingData(false);
    }
  }, [id]);

  const loadUsuario = async () => {
    try {
      setLoadingData(true);
      const usuario = await usuarioService.getById(id);
      setFormData({
        nombre_completo: usuario.nombre_completo || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        rol_usuario: usuario.rol_usuario || 'CLIENTE',
        activo: usuario.activo !== undefined ? usuario.activo : true,
      });
    } catch (err) {
      setError('Error al cargar el usuario');
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
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await usuarioService.update(id, formData);
      } else {
        await usuarioService.create(formData);
      }
      navigate('/admin/usuarios');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="usuario-form">
      <div className="container">
        <div className="card">
          <h1>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre_completo">Nombre Completo *</label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                placeholder="Nombre completo del usuario"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="usuario@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rol_usuario">Rol *</label>
                <select
                  id="rol_usuario"
                  name="rol_usuario"
                  value={formData.rol_usuario}
                  onChange={handleChange}
                  required
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="AGENTE">Agente</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="activo" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                  />
                  <span>Usuario Activo</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin/usuarios')}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;
