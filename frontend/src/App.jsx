import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import PrivateRoute      from './components/PrivateRoute';
import Navbar            from './components/Navbar';

// Pages
import HomePage              from './pages/HomePage';
import LoginPage             from './pages/LoginPage';
import RegisterPage          from './pages/RegisterPage';
import VehiculoDetailPage    from './pages/VehiculoDetailPage';
import PublicarVehiculoPage  from './pages/PublicarVehiculoPage';
import MisPublicacionesPage  from './pages/MisPublicacionesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Públicas */}
            <Route path="/"                element={<HomePage />} />
            <Route path="/vehiculos/:id"   element={<VehiculoDetailPage />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />

            {/* Protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/publicar"           element={<PublicarVehiculoPage />} />
              <Route path="/mis-publicaciones"  element={<MisPublicacionesPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <div className="loading-page">
                <span style={{ fontSize:'4rem' }}>🔍</span>
                <h2>404 — Página no encontrada</h2>
                <a href="/" className="btn btn-primary mt-2">Volver al inicio</a>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{
          background: 'var(--secondary)', color: '#fff',
          padding: '1.5rem', textAlign: 'center', fontSize: '.85rem',
          opacity: .85
        }}>
          🚗 Subastas Copart © {new Date().getFullYear()} — Plataforma de subastas en tiempo real
        </footer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
