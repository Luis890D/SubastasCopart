import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ correo: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card animate-fade">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">🚗</div>
          <h1 className="auth-title">Bienvenido de vuelta</h1>
          <p className="auth-subtitle">Inicia sesión para participar en subastas</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Correo electrónico <span>*</span></label>
            <input name="correo" type="email" value={form.correo} onChange={handle}
              placeholder="correo@ejemplo.com" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña <span>*</span></label>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="••••••••" className="form-input" required />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ Ingresando...' : '🔑 Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">Regístrate aquí</Link>
        </p>

        {/* Usuarios de prueba */}
        <div className="auth-demo">
          <p className="auth-demo-title">👥 Usuarios de prueba:</p>
          <p>usuario1@test.com · usuario2@test.com · usuario3@test.com</p>
          <p>Contraseña: <strong>Test1234!</strong></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
