import { useState, useEffect } from 'react';

const pad = (n) => String(n).padStart(2, '0');

const Temporizador = ({ fechaFin, onExpire }) => {
  const [restante, setRestante] = useState(() => calcRestante(fechaFin));

  useEffect(() => {
    if (restante <= 0) { onExpire?.(); return; }
    const timer = setInterval(() => {
      setRestante(prev => {
        if (prev <= 1) { clearInterval(timer); onExpire?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fechaFin]);

  if (restante <= 0) return (
    <div className="temporizador temporizador-cerrado">⏰ Subasta Cerrada</div>
  );

  const dias  = Math.floor(restante / 86400);
  const horas = Math.floor((restante % 86400) / 3600);
  const mins  = Math.floor((restante % 3600) / 60);
  const segs  = restante % 60;
  const urgente = restante < 3600; // menos de 1 hora

  return (
    <div className={`temporizador ${urgente ? 'temporizador-urgente' : ''}`}>
      <span className="temp-label">⏱ Cierra en</span>
      <div className="temp-bloques">
        {dias > 0 && (
          <div className="temp-bloque">
            <span className="temp-num">{pad(dias)}</span>
            <span className="temp-unit">días</span>
          </div>
        )}
        <div className="temp-bloque">
          <span className="temp-num">{pad(horas)}</span>
          <span className="temp-unit">horas</span>
        </div>
        <div className="temp-bloque">
          <span className="temp-num">{pad(mins)}</span>
          <span className="temp-unit">min</span>
        </div>
        <div className="temp-bloque">
          <span className="temp-num">{pad(segs)}</span>
          <span className="temp-unit">seg</span>
        </div>
      </div>
    </div>
  );
};

function calcRestante(fechaFin) {
  const diff = new Date(fechaFin) - new Date();
  return diff > 0 ? Math.floor(diff / 1000) : 0;
}

export default Temporizador;
