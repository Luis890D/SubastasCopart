import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { vehiculoService } from '../services/vehiculo.service';
import './MisPujasPage.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const BADGE_DANIO = {
  verde:    { label: '🟢 Daño Menor',  cls: 'badge-verde' },
  amarillo: { label: '🟡 Daño Medio',  cls: 'badge-amarillo' },
  rojo:     { label: '🔴 Daño Severo', cls: 'badge-rojo' },
};

const formatCurrency = (n) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n ?? 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MisPujasPage = () => {
  const [subastas, setSubastas] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState('todas'); // 'todas' | 'ganando' | 'superadas' | 'finalizadas'

  const cargarMisPujas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehiculoService.getMisPujas();
      setSubastas(res.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar tus pujas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMisPujas();
  }, []);

  // Métricas
  const now = new Date();
  const stats = useMemo(() => {
    let ganando = 0;
    let superadas = 0;
    let finalizadas = 0;
    let ganadas = 0;

    subastas.forEach(s => {
      const isCerrada = new Date(s.fecha_fin) <= now;
      if (isCerrada) {
        finalizadas++;
        if (s.es_ganador) ganadas++;
      } else {
        if (s.es_ganador) ganando++;
        else superadas++;
      }
    });

    return { total: subastas.length, ganando, superadas, finalizadas, ganadas };
  }, [subastas, now]);

  // Filtrar según la pestaña seleccionada
  const subastasFiltradas = useMemo(() => {
    return subastas.filter(s => {
      const isCerrada = new Date(s.fecha_fin) <= now;
      if (tab === 'ganando') return !isCerrada && s.es_ganador;
      if (tab === 'superadas') return !isCerrada && !s.es_ganador;
      if (tab === 'finalizadas') return isCerrada;
      return true; // 'todas'
    });
  }, [subastas, tab, now]);

  return (
    <div className="mis-pujas-page container">
      {/* ── Header ── */}
      <div className="mis-pujas-header">
        <div>
          <h1>🏷️ Mis Pujas y Ofertas</h1>
          <p className="mis-pujas-sub">
            Monitorea el estado en tiempo real de todos los vehículos por los que has ofertado.
          </p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={cargarMisPujas}
          disabled={loading}
          title="Actualizar listado"
        >
          🔄 {loading ? 'Actualizando...' : 'Refrescar'}
        </button>
      </div>

      {/* ── Tarjetas de Resumen / Stats ── */}
      <div className="pujas-stats-grid">
        <div className="puja-stat-card card">
          <span className="p-stat-icon">🎯</span>
          <div>
            <div className="p-stat-num">{stats.total}</div>
            <div className="p-stat-lbl">Subastas participadas</div>
          </div>
        </div>

        <div className="puja-stat-card card stat-card-win">
          <span className="p-stat-icon">🏆</span>
          <div>
            <div className="p-stat-num text-success">{stats.ganando}</div>
            <div className="p-stat-lbl">Vas ganando ahora</div>
          </div>
        </div>

        <div className="puja-stat-card card stat-card-outbid">
          <span className="p-stat-icon">⚠️</span>
          <div>
            <div className="p-stat-num text-danger">{stats.superadas}</div>
            <div className="p-stat-lbl">Ofertas superadas</div>
          </div>
        </div>

        <div className="puja-stat-card card stat-card-done">
          <span className="p-stat-icon">🏁</span>
          <div>
            <div className="p-stat-num text-info">{stats.ganadas} / {stats.finalizadas}</div>
            <div className="p-stat-lbl">Subastas ganadas</div>
          </div>
        </div>
      </div>

      {/* ── Pestañas de Filtro ── */}
      <div className="pujas-tabs">
        <button
          className={`pujas-tab-btn ${tab === 'todas' ? 'active' : ''}`}
          onClick={() => setTab('todas')}
        >
          Todas ({stats.total})
        </button>
        <button
          className={`pujas-tab-btn ${tab === 'ganando' ? 'active' : ''}`}
          onClick={() => setTab('ganando')}
        >
          🏆 Vas ganando ({stats.ganando})
        </button>
        <button
          className={`pujas-tab-btn ${tab === 'superadas' ? 'active' : ''}`}
          onClick={() => setTab('superadas')}
        >
          ⚠️ Superadas ({stats.superadas})
        </button>
        <button
          className={`pujas-tab-btn ${tab === 'finalizadas' ? 'active' : ''}`}
          onClick={() => setTab('finalizadas')}
        >
          🏁 Finalizadas ({stats.finalizadas})
        </button>
      </div>

      {/* ── Contenido ── */}
      {loading ? (
        <div className="pujas-loading card">
          <div className="spinner" />
          <p>Cargando tus participaciones en subasta...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          ⚠️ {error}
          <button className="btn btn-sm btn-ghost" onClick={cargarMisPujas}>Reintentar</button>
        </div>
      ) : subastasFiltradas.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-icon">🏷️</span>
          <h3>
            {tab === 'todas'
              ? 'Aún no has realizado ninguna puja'
              : `No tienes subastas en el filtro "${tab}"`}
          </h3>
          <p>
            {tab === 'todas'
              ? 'Explora los vehículos activos en el inventario y realiza tu primera oferta para comenzar a competir.'
              : 'Selecciona la pestaña "Todas" para ver el historial completo.'}
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            🚗 Explorar Inventario y Pujar
          </Link>
        </div>
      ) : (
        <div className="pujas-list">
          {subastasFiltradas.map((s) => {
            const isCerrada = new Date(s.fecha_fin) <= now;
            const badge = BADGE_DANIO[s.nivel_danio] || BADGE_DANIO.verde;
            const imgSrc = s.foto_portada
              ? (s.foto_portada.startsWith('http') ? s.foto_portada : `${API_URL}${s.foto_portada}`)
              : null;

            return (
              <div
                key={s.id}
                className={`puja-item-card card ${
                  isCerrada
                    ? (s.es_ganador ? 'item-won' : 'item-closed')
                    : (s.es_ganador ? 'item-winning' : 'item-outbid')
                }`}
              >
                {/* Miniatura del Vehículo */}
                <div className="puja-item-img-wrap">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${s.marca} ${s.modelo}`}
                      className="puja-item-img"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="puja-item-placeholder">🚗</div>
                  )}
                  <span className={`badge ${badge.cls} item-badge-danio`}>{badge.label}</span>
                </div>

                {/* Información Central */}
                <div className="puja-item-info">
                  <div className="puja-item-top">
                    <span className={`puja-status-pill ${isCerrada ? 'closed' : 'live'}`}>
                      {isCerrada ? 'Subasta Cerrada' : '🔴 Subasta en Vivo'}
                    </span>
                    <span className="puja-count-tag">
                      Has pujado {s.mis_pujas_count} {s.mis_pujas_count === 1 ? 'vez' : 'veces'}
                    </span>
                  </div>

                  <h3 className="puja-item-title">
                    <Link to={`/vehiculos/${s.id}`}>{s.anio} {s.marca} {s.modelo}</Link>
                  </h3>

                  <div className="puja-item-tags">
                    {s.tipo_articulo && <span className="puja-tag">{s.tipo_articulo}</span>}
                    {s.combustible && <span className="puja-tag">{s.combustible}</span>}
                    {s.transmision && <span className="puja-tag">{s.transmision}</span>}
                    {s.tren_manejo && <span className="puja-tag">{s.tren_manejo}</span>}
                  </div>

                  {/* Estado de la puja del usuario */}
                  <div className="puja-status-banner">
                    {isCerrada ? (
                      s.es_ganador ? (
                        <div className="banner-won">
                          🎉 <strong>¡FELICIDADES! Ganaste esta subasta</strong> con una oferta de {formatCurrency(s.mi_puja_maxima)}
                        </div>
                      ) : (
                        <div className="banner-lost">
                          🏁 Subasta concluida. La oferta ganadora fue {formatCurrency(s.puja_actual)}
                        </div>
                      )
                    ) : (
                      s.es_ganador ? (
                        <div className="banner-winning">
                          🏆 <strong>¡Vas ganando!</strong> Eres el postor líder actual con {formatCurrency(s.mi_puja_maxima)}
                        </div>
                      ) : (
                        <div className="banner-outbid">
                          ⚠️ <strong>¡Tu oferta ha sido superada!</strong> La puja actual es {formatCurrency(s.puja_actual)}. ¡Mejora tu puja para ganar!
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Columna Financiera y Acción */}
                <div className="puja-item-pricing">
                  <div className="pricing-box">
                    <div className="price-row">
                      <span className="price-label">Mi oferta más alta:</span>
                      <span className="price-val my-bid">{formatCurrency(s.mi_puja_maxima)}</span>
                    </div>

                    <div className="price-row">
                      <span className="price-label">Puja actual líder:</span>
                      <span className={`price-val top-bid ${s.es_ganador ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(s.puja_actual)}
                      </span>
                    </div>

                    <div className="price-row price-sub">
                      <span className="price-label">Última oferta:</span>
                      <span className="price-sub-val">{formatDate(s.mi_ultima_puja_fecha)}</span>
                    </div>

                    <div className="price-row price-sub">
                      <span className="price-label">Cierre:</span>
                      <span className="price-sub-val">{formatDate(s.fecha_fin)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/vehiculos/${s.id}`}
                    className={`btn btn-full ${
                      !isCerrada && !s.es_ganador
                        ? 'btn-primary btn-pulse'
                        : isCerrada && s.es_ganador
                        ? 'btn-success'
                        : 'btn-outline'
                    }`}
                  >
                    {!isCerrada && !s.es_ganador
                      ? '⚡ Subir mi Puja →'
                      : !isCerrada && s.es_ganador
                      ? '👁️ Ver Subasta en Vivo →'
                      : '📄 Ver Ficha de Subasta →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisPujasPage;
