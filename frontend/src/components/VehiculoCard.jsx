import { useState } from 'react';
import { Link } from 'react-router-dom';
import './VehiculoCard.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const BADGE = {
  verde:    { label: '🟢 Daño Menor',  cls: 'badge-verde'    },
  amarillo: { label: '🟡 Daño Medio',  cls: 'badge-amarillo' },
  rojo:     { label: '🔴 Daño Severo', cls: 'badge-rojo'     },
};

const formatCurrency = (n) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n ?? 0);

const calcStatus = (fecha_inicio, fecha_fin) => {
  const now = new Date();
  if (now < new Date(fecha_inicio)) return { label: 'Próximamente', cls: 'status-soon'   };
  if (now > new Date(fecha_fin))    return { label: 'Finalizada',   cls: 'status-closed' };
  return                                   { label: 'En vivo 🔴',   cls: 'status-live'   };
};

const VehiculoCard = ({ vehiculo }) => {
  const {
    id, marca, modelo, anio, nivel_danio,
    precio_base, puja_actual, total_pujas,
    foto_portada, fecha_inicio, fecha_fin,
    tren_manejo, combustible,
  } = vehiculo;

  const [imgError, setImgError] = useState(false);

  const badge  = BADGE[nivel_danio] || BADGE.verde;
  const status = calcStatus(fecha_inicio, fecha_fin);

  const imgSrc = foto_portada
    ? (foto_portada.startsWith('http') ? foto_portada : `${API_URL}${foto_portada}`)
    : null;

  return (
    <Link to={`/vehiculos/${id}`} className="vehiculo-card card">
      {/* Imagen */}
      <div className="vc-image-wrap">
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={`${marca} ${modelo}`}
            className="vc-image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="vc-image-placeholder">
            <span>🚗</span>
            <small style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
              {marca} {modelo}
            </small>
          </div>
        )}
        <span className={`vc-status ${status.cls}`}>{status.label}</span>
        <span className={`badge ${badge.cls} vc-badge`}>{badge.label}</span>
      </div>

      {/* Info */}
      <div className="vc-body">
        <div className="vc-title-row">
          <h3 className="vc-title">{anio} {marca} {modelo}</h3>
        </div>
        <div className="vc-tags">
          {tren_manejo && <span className="vc-tag">{tren_manejo}</span>}
          {combustible && <span className="vc-tag">{combustible}</span>}
        </div>

        <div className="vc-price-block">
          <div>
            <p className="vc-label">Puja actual</p>
            <p className="vc-price">{formatCurrency(puja_actual ?? precio_base)}</p>
          </div>
          <div className="text-right">
            <p className="vc-label">Base</p>
            <p className="vc-base">{formatCurrency(precio_base)}</p>
          </div>
        </div>

        <div className="vc-footer">
          <span className="vc-pujas">
            🏷 {total_pujas ?? 0} {total_pujas === 1 ? 'puja' : 'pujas'}
          </span>
          <span className="btn btn-primary btn-sm">Ver subasta →</span>
        </div>
      </div>
    </Link>
  );
};

export default VehiculoCard;
