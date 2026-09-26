import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import './Auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', apellido: '', correo: '', telefono: '', password: '', confirm: ''
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return; }
    if (form.password.length < 6)       { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true); setError('');
    try {
      await authService.register({ nombre: form.nombre, apellido: form.apellido, correo: form.correo, telefono: form.telefono, password: form.password });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card animate-fade" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <div className="auth-logo">🚗</div>
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Únete a la plataforma de subastas</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre <span>*</span></label>
              <input name="nombre" value={form.nombre} onChange={handle}
                placeholder="Carlos" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido <span>*</span></label>
              <input name="apellido" value={form.apellido} onChange={handle}
                placeholder="Pérez" className="form-input" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Correo electrónico <span>*</span></label>
            <input name="correo" type="email" value={form.correo} onChange={handle}
              placeholder="correo@ejemplo.com" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handle}
              placeholder="50212345678" className="form-input" />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Contraseña <span>*</span></label>
              <input name="password" type="password" value={form.password} onChange={handle}
                placeholder="Mínimo 6 caracteres" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar <span>*</span></label>
              <input name="confirm" type="password" value={form.confirm} onChange={handle}
                placeholder="Repite la contraseña" className="form-input" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ Registrando...' : '✅ Crear Cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
