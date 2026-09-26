import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { vehiculoService } from '../services/vehiculo.service';
import VehiculoCard from '../components/VehiculoCard';
import Filtros, { DANIOS } from '../components/Filtros';
import './HomePage.css';

const INITIAL_FILTERS = {
  busqueda: '',
  marca: '',
  modelo: '',
  anio: '',
  combustible: '',
  nivel_danio: '',
  tren_manejo: '',
  orden: 'recientes'
};

const HomePage = () => {
  const [filtros, setFiltros] = useState(INITIAL_FILTERS);
  const [inputBusqueda, setInputBusqueda] = useState('');
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar vehículos con los filtros actuales
  const cargarVehiculos = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehiculoService.getAll(params);
      setVehiculos(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarVehiculos(filtros);
  }, [filtros, cargarVehiculos]);

  // Manejar submit del buscador escrito rápido
  const handleBusquedaRapida = (e) => {
    e.preventDefault();
    setFiltros(prev => ({ ...prev, busqueda: inputBusqueda }));
  };

  const limpiarBusquedaRapida = () => {
    setInputBusqueda('');
    setFiltros(prev => ({ ...prev, busqueda: '' }));
  };

  // Manejar filtros desde el sidebar
  const handleFilterChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    if (nuevosFiltros.busqueda !== undefined) {
      setInputBusqueda(nuevosFiltros.busqueda);
    }
  };

  // Filtro rápido por píldoras (nivel de daño o tren)
  const aplicarPildora = (campo, valor) => {
    setFiltros(prev => {
      const nuevo = { ...prev };
      if (nuevo[campo] === valor) {
        nuevo[campo] = ''; // toggle off si ya estaba seleccionado
      } else {
        nuevo[campo] = valor;
      }
      return nuevo;
    });
  };

  // Remover un filtro individual activo
  const removerFiltro = (campo) => {
    if (campo === 'busqueda') setInputBusqueda('');
    setFiltros(prev => ({ ...prev, [campo]: '' }));
  };

  const limpiarTodosLosFiltros = () => {
    setInputBusqueda('');
    setFiltros(INITIAL_FILTERS);
  };

  // Contar filtros activos distintos a 'orden'
  const filtrosActivos = Object.entries(filtros).filter(
    ([k, v]) => v && k !== 'orden'
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-badge">🔴 Subastas en Vivo Copart GT</div>
          <h1 className="hero-title">
            Encuentra y subasta tu próximo<br />
            <span className="gradient-text">vehículo ideal</span>
          </h1>
          <p className="hero-sub">
            Subastas en tiempo real con historial transparente de pujas, fotos en alta resolución y ficha técnica detallada.
          </p>

          {/* ── Barra de Búsqueda Escrita Principal en Hero ── */}
          <form className="hero-search-bar" onSubmit={handleBusquedaRapida}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={inputBusqueda}
              onChange={(e) => setInputBusqueda(e.target.value)}
              placeholder="Escribe marca, modelo, tipo o año (ej: Toyota Hilux 2021)..."
              className="hero-search-input"
            />
            {inputBusqueda && (
              <button
                type="button"
                className="search-clear"
                onClick={limpiarBusquedaRapida}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-search">
              Buscar
            </button>
          </form>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">{vehiculos.length}</span>
              <span className="stat-label">Vehículos listados</span>
            </div>
            <div className="stat">
              <span className="stat-num">3</span>
              <span className="stat-label">Compradores activos</span>
            </div>
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Inspección certificada</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inventario ── */}
      <section id="inventario" className="inventario-section">
        <div className="container">

          {/* ── Píldoras de Selección Rápida por Lista ── */}
          <div className="pildoras-filtro-wrap">
            <span className="pildoras-label">📋 Filtros rápidos por lista:</span>
            <div className="pildoras-scroll">
              <button
                type="button"
                className={`pildora-btn ${filtrosActivos.length === 0 ? 'active' : ''}`}
                onClick={limpiarTodosLosFiltros}
              >
                🏷️ Todos los vehículos
              </button>
              <button
                type="button"
                className={`pildora-btn ${filtros.nivel_danio === 'verde' ? 'active green' : ''}`}
                onClick={() => aplicarPildora('nivel_danio', 'verde')}
              >
                🟢 Daño Menor
              </button>
              <button
                type="button"
                className={`pildora-btn ${filtros.nivel_danio === 'amarillo' ? 'active yellow' : ''}`}
                onClick={() => aplicarPildora('nivel_danio', 'amarillo')}
              >
                🟡 Daño Medio
              </button>
              <button
                type="button"
                className={`pildora-btn ${filtros.nivel_danio === 'rojo' ? 'active red' : ''}`}
                onClick={() => aplicarPildora('nivel_danio', 'rojo')}
              >
                🔴 Daño Severo
              </button>
              <button
                type="button"
                className={`pildora-btn ${filtros.combustible === 'Gasolina' ? 'active' : ''}`}
                onClick={() => aplicarPildora('combustible', 'Gasolina')}
              >
                ⛽ Gasolina
              </button>
              <button
                type="button"
                className={`pildora-btn ${filtros.combustible === 'Diésel' ? 'active' : ''}`}
                onClick={() => aplicarPildora('combustible', 'Diésel')}
              >
                🛢️ Diésel
              </button>
              <button
                type="button"
                className={`pildora-btn ${filtros.tren_manejo === '4WD' ? 'active' : ''}`}
                onClick={() => aplicarPildora('tren_manejo', '4WD')}
              >
                🚙 4WD / Tracción 4x4
              </button>
            </div>
          </div>

          <div className="inventario-layout">
            {/* ── Sidebar de Filtros (Escrito + Lista) ── */}
            <div className="filtros-sidebar">
              <Filtros
                onFilter={handleFilterChange}
                loading={loading}
                currentFilters={filtros}
              />
            </div>

            {/* ── Contenido Principal del Inventario ── */}
            <div className="inventario-main">
              {/* Barra de título y ordenación */}
              <div className="inventario-header card">
                <div className="inventario-header-left">
                  <h2>🚗 Inventario en Subasta</h2>
                  <span className="badge badge-blue">
                    {loading ? 'Cargando...' : `${vehiculos.length} vehículo${vehiculos.length !== 1 ? 's' : ''}`}
                  </span>
                </div>

                {/* Ordenar por lista */}
                <div className="ordenar-box">
                  <label htmlFor="ordenar-select">Ordenar:</label>
                  <select
                    id="ordenar-select"
                    value={filtros.orden || 'recientes'}
                    onChange={(e) => setFiltros(prev => ({ ...prev, orden: e.target.value }))}
                    className="form-select form-select-sm"
                  >
                    <option value="recientes">🕒 Más recientes</option>
                    <option value="precio_asc">💲 Precio: Menor a Mayor</option>
                    <option value="precio_desc">💎 Precio: Mayor a Menor</option>
                    <option value="tiempo_fin">⏳ Próximas a vencer</option>
                    <option value="anio_desc">📅 Año: Más nuevo</option>
                  </select>
                </div>
              </div>

              {/* Chips de filtros activos */}
              {filtrosActivos.length > 0 && (
                <div className="filtros-activos-bar">
                  <span className="filtros-activos-label">Filtros aplicados:</span>
                  <div className="chips-list">
                    {filtrosActivos.map(([campo, valor]) => {
                      let displayVal = valor;
                      if (campo === 'nivel_danio') {
                        const d = DANIOS.find(x => x.value === valor);
                        displayVal = d ? d.label : valor;
                      }
                      return (
                        <span key={campo} className="filtro-chip">
                          <strong>{campo}:</strong> {displayVal}
                          <button
                            type="button"
                            onClick={() => removerFiltro(campo)}
                            title="Quitar filtro"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                    <button
                      type="button"
                      className="btn-limpiar-chips"
                      onClick={limpiarTodosLosFiltros}
                    >
                      Limpiar todos
                    </button>
                  </div>
                </div>
              )}

              {/* Skeleton loading */}
              {loading && (
                <div className="vehiculos-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card">
                      <div className="skeleton" style={{ height: 200 }} />
                      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', padding: '1rem' }}>
                        <div className="skeleton" style={{ height: 20, width: '70%' }} />
                        <div className="skeleton" style={{ height: 16, width: '45%' }} />
                        <div className="skeleton" style={{ height: 50 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error state */}
              {!loading && error && (
                <div className="alert alert-error">
                  ⚠️ Error al cargar los vehículos: {error}
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && vehiculos.length === 0 && (
                <div className="empty-state card">
                  <span className="empty-icon">🔍</span>
                  <h3>No se encontraron vehículos</h3>
                  <p>
                    {filtrosActivos.length > 0
                      ? 'Ningún vehículo coincide con los filtros aplicados. Intenta modificarlos o eliminarlos.'
                      : 'Actualmente no hay vehículos disponibles en subasta.'}
                  </p>
                  {filtrosActivos.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={limpiarTodosLosFiltros}
                      style={{ marginTop: '1rem' }}
                    >
                      Mostrar todos los vehículos
                    </button>
                  )}
                </div>
              )}

              {/* Grid de vehículos con imágenes funcionando */}
              {!loading && vehiculos.length > 0 && (
                <div className="vehiculos-grid animate-fade">
                  {vehiculos.map(v => (
                    <VehiculoCard key={v.id} vehiculo={v} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
