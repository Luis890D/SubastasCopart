import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { vehiculoService } from '../services/vehiculo.service';
import { useApi } from '../hooks/useApi';
import VehiculoCard from '../components/VehiculoCard';
import Filtros      from '../components/Filtros';
import './HomePage.css';

const HomePage = () => {
  const [filtros, setFiltros] = useState({});

  const fetchVehiculos = useCallback(
    () => vehiculoService.getAll(filtros),
    [JSON.stringify(filtros)]
  );

  const { data, loading, error, execute } = useApi(fetchVehiculos, true);
  const vehiculos = data || [];

  const handleFilter = (f) => {
    setFiltros(f);
    execute();
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-badge">🔴 Subastas en vivo ahora</div>
          <h1 className="hero-title">
            Encuentra tu próximo<br />
            <span className="gradient-text">vehículo ideal</span>
          </h1>
          <p className="hero-sub">
            Miles de vehículos en subasta. Puja en tiempo real, gana al mejor precio.
          </p>
          <div className="hero-actions">
            <a href="#inventario" className="btn btn-primary btn-lg">🚗 Ver Inventario</a>
            <Link to="/register"  className="btn btn-outline btn-lg">Crear cuenta gratis</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">{vehiculos.length}</span><span className="stat-label">Subastas activas</span></div>
            <div className="stat"><span className="stat-num">3</span><span className="stat-label">Compradores activos</span></div>
            <div className="stat"><span className="stat-num">Q.20K</span><span className="stat-label">Precio mínimo</span></div>
          </div>
        </div>
      </section>

      {/* ── Inventario ── */}
      <section id="inventario" className="inventario-section">
        <div className="inventario-layout container">
          {/* Filtros sidebar */}
          <div className="filtros-sidebar">
            <Filtros onFilter={handleFilter} loading={loading} />
          </div>

          {/* Grid */}
          <div className="inventario-main">
            <div className="section-title flex-between">
              <h2>🚗 Inventario en Subasta</h2>
              <span className="badge badge-blue">{vehiculos.length} vehículos</span>
            </div>

            {loading && (
              <div className="vehiculos-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="skeleton" style={{ height: 200 }} />
                    <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
                      <div className="skeleton" style={{ height: 20, width: '70%' }} />
                      <div className="skeleton" style={{ height: 16, width: '45%' }} />
                      <div className="skeleton" style={{ height: 60 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="alert alert-error">
                ⚠️ Error al cargar los vehículos: {error}
              </div>
            )}

            {!loading && !error && vehiculos.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No se encontraron vehículos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}

            {!loading && vehiculos.length > 0 && (
              <div className="vehiculos-grid animate-fade">
                {vehiculos.map(v => <VehiculoCard key={v.id} vehiculo={v} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
