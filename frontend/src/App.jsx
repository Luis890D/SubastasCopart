import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute      from './components/PrivateRoute';
import Navbar            from './components/Navbar';

// Pages
import HomePage          from './pages/HomePage';
import SubastasPage      from './pages/SubastasPage';
import SubastaDetailPage from './pages/SubastaDetailPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import DashboardPage     from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/"              element={<HomePage />} />
            <Route path="/subastas"      element={<SubastasPage />} />
            <Route path="/subastas/:id"  element={<SubastaDetailPage />} />
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/register"      element={<RegisterPage />} />

            {/* Rutas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
