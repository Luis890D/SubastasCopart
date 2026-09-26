import { useState, useCallback } from 'react';
import './Filtros.css';

const COMBUSTIBLES = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'Gas'];
const TRENES       = ['AWD', 'FWD', 'RWD', '4WD'];
const DANIOS       = [
  { value: 'verde',    label: '🟢 Daño Menor'  },
  { value: 'amarillo', label: '🟡 Daño Medio'  },
  { value: 'rojo',     label: '🔴 Daño Severo' },
];
const ANIOS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const INITIAL = { marca: '', modelo: '', anio: '', combustible: '', nivel_danio: '', tren_manejo: '' };

const Filtros = ({ onFilter, loading }) => {
  const [filtros, setFiltros] = useState(INITIAL);
  const [open, setOpen] = useState(true);

  const handle = useCallback((e) => {
    const { name, value } = e.target;
    setFiltros(f => ({ ...f, [name]: value }));
  }, []);

  const aplicar = (e) => {
    e.preventDefault();
    onFilter(filtros);
  };

  const limpiar = () => {
    setFiltros(INITIAL);
    onFilter(INITIAL);
  };

  return (
    <aside className="filtros-panel card">
      <div className="filtros-header" onClick={() => setOpen(o => !o)}>
        <span>🔍 Filtros de Búsqueda</span>
        <span className="filtros-toggle">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <form className="filtros-body" onSubmit={aplicar}>
          <div className="form-group">
            <label className="form-label">Marca</label>
            <input name="marca" value={filtros.marca} onChange={handle}
              placeholder="Toyota, Ford, BMW..." className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Modelo</label>
            <input name="modelo" value={filtros.modelo} onChange={handle}
              placeholder="Camry, F-150..." className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Año</label>
            <select name="anio" value={filtros.anio} onChange={handle} className="form-select">
              <option value="">Todos los años</option>
              {ANIOS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Combustible</label>
            <select name="combustible" value={filtros.combustible} onChange={handle} className="form-select">
              <option value="">Todos</option>
              {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nivel de Daño</label>
            <select name="nivel_danio" value={filtros.nivel_danio} onChange={handle} className="form-select">
              <option value="">Todos</option>
              {DANIOS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tren de Manejo</label>
            <select name="tren_manejo" value={filtros.tren_manejo} onChange={handle} className="form-select">
              <option value="">Todos</option>
              {TRENES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Buscando...' : '🔍 Aplicar filtros'}
          </button>
          <button type="button" className="btn btn-ghost btn-full btn-sm" onClick={limpiar}>
            ✕ Limpiar filtros
          </button>
        </form>
      )}
    </aside>
  );
};

export default Filtros;
