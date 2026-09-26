import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar-logo-icon">🚗</span>
          <span>Subastas <strong>Copart</strong></span>
        </Link>

        {/* Links escritorio */}
        <nav className="navbar-links">
          <Link to="/" className="nav-link">Inventario</Link>
          {isAuthenticated && (
            <>
              <Link to="/publicar" className="nav-link">Publicar</Link>
              <Link to="/mis-publicaciones" className="nav-link">Mis Vehículos</Link>
              <Link to="/mis-pujas" className="nav-link highlight-link">🏷️ Mis Pujas</Link>
            </>
          )}
        </nav>

        {/* Auth buttons / perfil */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-user-name">👤 {user?.nombre}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="navbar-mobile animate-slide">
          <Link to="/"       onClick={() => setMenuOpen(false)} className="mobile-link">🏠 Inventario</Link>
          {isAuthenticated && (
            <>
              <Link to="/publicar"          onClick={() => setMenuOpen(false)} className="mobile-link">➕ Publicar Vehículo</Link>
              <Link to="/mis-publicaciones" onClick={() => setMenuOpen(false)} className="mobile-link">📋 Mis Vehículos Publicados</Link>
              <Link to="/mis-pujas"         onClick={() => setMenuOpen(false)} className="mobile-link">🏷️ Mis Pujas / Ofertas</Link>
            </>
          )}
          <hr className="divider" />
          {isAuthenticated ? (
            <button onClick={handleLogout} className="mobile-link mobile-logout">🚪 Cerrar sesión</button>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="mobile-link">Iniciar sesión</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="mobile-link mobile-register">Registrarse</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
