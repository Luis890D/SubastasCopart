import { useState } from 'react';
import './Carrusel.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const Carrusel = ({ fotos = [] }) => {
  const [idx, setIdx] = useState(0);
  if (!fotos.length) return (
    <div className="carrusel-empty">🚗 Sin fotos disponibles</div>
  );

  const prev = () => setIdx(i => (i - 1 + fotos.length) % fotos.length);
  const next = () => setIdx(i => (i + 1) % fotos.length);
  const src  = (f) => f.url?.startsWith('http') ? f.url : `${API_URL}${f.url}`;

  return (
    <div className="carrusel">
      {/* Imagen principal */}
      <div className="carrusel-main">
        <img src={src(fotos[idx])} alt={`Foto ${idx + 1}`} className="carrusel-img" />
        {fotos.length > 1 && (
          <>
            <button className="carrusel-btn carrusel-prev" onClick={prev}>‹</button>
            <button className="carrusel-btn carrusel-next" onClick={next}>›</button>
          </>
        )}
        <div className="carrusel-counter">{idx + 1} / {fotos.length}</div>
      </div>

      {/* Thumbnails */}
      {fotos.length > 1 && (
        <div className="carrusel-thumbs">
          {fotos.map((f, i) => (
            <button
              key={i}
              className={`carrusel-thumb ${i === idx ? 'active' : ''}`}
              onClick={() => setIdx(i)}
            >
              <img src={src(f)} alt={`Thumb ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carrusel;
