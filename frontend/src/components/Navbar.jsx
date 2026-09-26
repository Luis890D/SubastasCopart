import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar principal de la aplicación
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">🏠 Subastas Copart</Link>
      <Link to="/subastas">Subastas</Link>
      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard ({user?.nombre})</Link>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
