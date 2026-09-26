import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehiculoService } from '../services/vehiculo.service';
import { socketService }   from '../services/socket.service';
import { useAuth }         from '../context/AuthContext';
import Carrusel     from '../components/Carrusel';
import Temporizador from '../components/Temporizador';
import './VehiculoDetail.css';

const fmt = (n) => new Intl.NumberFormat('es-GT', { style:'currency', currency:'GTQ' }).format(n ?? 0);

const BADGE = {
  verde:    { label:'🟢 Daño Menor',  cls:'badge-verde'    },
  amarillo: { label:'🟡 Daño Medio',  cls:'badge-amarillo' },
  rojo:     { label:'🔴 Daño Severo', cls:'badge-rojo'     },
};

const VehiculoDetailPage = () => {
  const { id }              = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate            = useNavigate();

  const [vehiculo,     setVehiculo]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [pujas,        setPujas]        = useState([]);
  const [monto,        setMonto]        = useState('');
  const [pujando,      setPujando]      = useState(false);
  const [pujaError,    setPujaError]    = useState('');
  const [pujaOk,       setPujaOk]       = useState('');
  const [cerrada,      setCerrada]      = useState(false);
  const [estoyGanando, setEstoyGanando] = useState(false);

  // ── Cargar vehículo ──────────────────────────────────────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [res, pRes] = await Promise.all([
        vehiculoService.getById(id),
        vehiculoService.getPujas(id),
      ]);
      setVehiculo(res.data);
      setPujas(pRes.data || []);
      const now = new Date();
      if (now >= new Date(res.data.fecha_fin)) setCerrada(true);
    } catch {
      setError('Error al cargar el vehículo');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Socket.io — tiempo real ──────────────────────────────────────────────────
  useEffect(() => {
    const socket = socketService.connect();
    socketService.unirseSubasta(id);

    socketService.onNuevaPuja(({ monto_actual, usuario_ganador }) => {
      setVehiculo(prev => prev ? { ...prev, puja_actual: monto_actual } : prev);
      setPujas(prev => [{ monto: monto_actual, fecha: new Date().toISOString() }, ...prev]);
      // Badge: ¿estoy ganando?
      if (user) setEstoyGanando(usuario_ganador === user.id);
    });

    return () => { socketService.offNuevaPuja(); };
  }, [id, user]);

  // ── Hacer puja ───────────────────────────────────────────────────────────────
  const pujar = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setPujando(true); setPujaError(''); setPujaOk('');
    try {
      await vehiculoService.pujar(id, { monto: parseFloat(monto) });
      setPujaOk(`✅ ¡Puja de ${fmt(monto)} realizada con éxito!`);
      setMonto('');
      setEstoyGanando(true);
    } catch (err) {
      setPujaError(err.message || 'Error al realizar la puja');
    } finally {
      setPujando(false);
    }
  };

  // ── Loading / Error ──────────────────────────────────────────────────────────
  if (loading) return (
    <div className="loading-page"><div className="spinner" /><p>Cargando subasta...</p></div>
  );
  if (error || !vehiculo) return (
    <div className="page"><div className="alert alert-error">{error || 'Vehículo no encontrado'}</div></div>
  );

  const {
    marca, modelo, anio, tipo_articulo, motor, transmision,
    combustible, tren_manejo, cilindros, nivel_danio,
    precio_base, puja_actual, fecha_inicio, fecha_fin, fotos = [],
    propietario_nombre, propietario_apellido,
  } = vehiculo;

  const badge      = BADGE[nivel_danio] || BADGE.verde;
  const minPuja    = puja_actual ? puja_actual * 1.10 : precio_base;
  const iniciada   = new Date() >= new Date(fecha_inicio);

  return (
    <div className="page vd-page animate-fade">
      {/* ── Encabezado ── */}
      <div className="vd-header">
        <div>
          <h1 className="vd-title">{anio} {marca} {modelo}</h1>
          <div className="vd-meta">
            <span className={`badge ${badge.cls}`}>{badge.label}</span>
            {tipo_articulo && <span className="badge badge-gray">{tipo_articulo}</span>}
            <span className="badge badge-blue">👤 {propietario_nombre} {propietario_apellido}</span>
          </div>
        </div>
      </div>

      <div className="vd-layout">
        {/* ── Columna izquierda: fotos + ficha ── */}
        <div className="vd-left">
          <Carrusel fotos={fotos} />

          {/* Ficha técnica */}
          <div className="card mt-3">
            <div className="card-body">
              <h3 className="mb-2">📋 Ficha Técnica</h3>
              <div className="ficha-grid">
                {[
                  ['Año',         anio],
                  ['Marca',       marca],
                  ['Modelo',      modelo],
                  ['Motor',       motor],
                  ['Transmisión', transmision],
                  ['Combustible', combustible],
                  ['Tren',        tren_manejo],
                  ['Cilindros',   cilindros ? `${cilindros} cil.` : null],
                ].filter(([,v]) => v).map(([k, v]) => (
                  <div key={k} className="ficha-item">
                    <span className="ficha-key">{k}</span>
                    <span className="ficha-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Columna derecha: motor de subasta ── */}
        <div className="vd-right">
          {/* Temporizador */}
          {iniciada && <Temporizador fechaFin={fecha_fin} onExpire={() => setCerrada(true)} />}
          {!iniciada && (
            <div className="alert alert-info">
              ⏳ Esta subasta inicia el {new Date(fecha_inicio).toLocaleString()}
            </div>
          )}

          {/* Puja actual */}
          <div className="puja-panel card">
            <div className="card-body">
              <div className="puja-header">
                <span className="puja-label">Puja actual más alta</span>
                <span className="puja-monto">{fmt(puja_actual ?? precio_base)}</span>
                <span className="puja-base">Precio base: {fmt(precio_base)}</span>
              </div>

              {/* Badge de estado del usuario */}
              {isAuthenticated && !cerrada && (
                estoyGanando
                  ? <div className="badge-estado badge-ganando animate-pulse">🏆 ¡Vas ganando esta subasta!</div>
                  : pujas.length > 0
                    ? <div className="badge-estado badge-superado">🔴 Tu oferta fue superada. ¡Puja ahora!</div>
                    : null
              )}

              {/* Formulario de puja */}
              {!cerrada && iniciada && isAuthenticated ? (
                <form onSubmit={pujar} className="puja-form mt-2">
                  <div className="puja-minimo">
                    Mínimo a pujar: <strong>{fmt(minPuja)}</strong>
                    <span className="puja-hint">(+10% sobre oferta actual)</span>
                  </div>
                  {pujaError && <div className="alert alert-error">{pujaError}</div>}
                  {pujaOk    && <div className="alert alert-success">{pujaOk}</div>}
                  <div className="puja-input-row">
                    <span className="puja-currency">Q.</span>
                    <input
                      type="number" step="0.01" min={minPuja}
                      value={monto} onChange={e => setMonto(e.target.value)}
                      placeholder={minPuja.toFixed(2)}
                      className="form-input puja-input" required
                    />
                    <button type="submit" className="btn btn-primary" disabled={pujando}>
                      {pujando ? '⏳' : '🏷 Pujar'}
                    </button>
                  </div>
                </form>
              ) : !cerrada && iniciada && !isAuthenticated ? (
                <div className="mt-2">
                  <div className="alert alert-warning">Debes iniciar sesión para pujar</div>
                  <a href="/login" className="btn btn-primary btn-full mt-2">🔑 Iniciar Sesión</a>
                </div>
              ) : cerrada ? (
                <div className="alert alert-error mt-2">⏰ Esta subasta ha finalizado</div>
              ) : null}
            </div>
          </div>

          {/* Historial de pujas */}
          <div className="card">
            <div className="card-body">
              <h3 className="mb-2">📊 Historial de Pujas ({pujas.length})</h3>
              {pujas.length === 0 ? (
                <p style={{ color:'var(--text-light)', textAlign:'center', padding:'1rem 0' }}>
                  Sin pujas aún. ¡Sé el primero!
                </p>
              ) : (
                <div className="pujas-lista">
                  {pujas.slice(0, 10).map((p, i) => (
                    <div key={i} className={`puja-row ${i === 0 ? 'puja-top' : ''}`}>
                      <span>🏷 {i === 0 ? '🥇 ' : ''}Oferta anónima</span>
                      <span className="puja-row-monto">{fmt(p.monto)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiculoDetailPage;
