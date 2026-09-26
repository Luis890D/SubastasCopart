import { useState, useCallback, useEffect } from 'react';
import './Filtros.css';

export const MARCAS_POPULARES = [
  'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet', 'Nissan',
  'Hyundai', 'Mercedes-Benz', 'Jeep', 'Mazda', 'Kia',
  'Volkswagen', 'Mitsubishi', 'Subaru', 'Audi'
];

export const COMBUSTIBLES = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'Gas'];
export const TRENES       = ['AWD', 'FWD', 'RWD', '4WD'];
export const DANIOS       = [
  { value: 'verde',    label: '🟢 Daño Menor'  },
  { value: 'amarillo', label: '🟡 Daño Medio'  },
  { value: 'rojo',     label: '🔴 Daño Severo' },
];
export const ANIOS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const INITIAL = {
  busqueda: '',
  marca: '',
  modelo: '',
  anio: '',
  combustible: '',
  nivel_danio: '',
  tren_manejo: '',
  orden: 'recientes'
};

const Filtros = ({ onFilter, loading, currentFilters = {} }) => {
  const [filtros, setFiltros] = useState({ ...INITIAL, ...currentFilters });
  const [open, setOpen] = useState(true);
  const [modoFiltro, setModoFiltro] = useState('ambos'); // 'escrita' | 'lista' | 'ambos'

  useEffect(() => {
    setFiltros(prev => ({ ...prev, ...currentFilters }));
  }, [currentFilters]);

  const handle = useCallback((e) => {
    const { name, value } = e.target;
    setFiltros(f => ({ ...f, [name]: value }));
  }, []);

  const aplicar = (e) => {
    if (e) e.preventDefault();
    onFilter(filtros);
  };

  const limpiar = () => {
    setFiltros(INITIAL);
    onFilter(INITIAL);
  };

  const contarFiltrosActivos = () => {
    return Object.entries(filtros).filter(([k, v]) => v && k !== 'orden').length;
  };

  const activosCount = contarFiltrosActivos();

  return (
    <aside className="filtros-panel card">
      {/* Header colapsable */}
      <div className="filtros-header" onClick={() => setOpen(o => !o)}>
        <div className="filtros-header-left">
          <span>⚙️ Panel de Filtrado</span>
          {activosCount > 0 && (
            <span className="badge-contador">{activosCount} activo{activosCount > 1 ? 's' : ''}</span>
          )}
        </div>
        <span className="filtros-toggle">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <form className="filtros-body" onSubmit={aplicar}>
          {/* Selector de modo: Escrito / Por Lista / Todos */}
          <div className="filtros-tabs">
            <button
              type="button"
              className={`filtro-tab-btn ${modoFiltro === 'ambos' ? 'active' : ''}`}
              onClick={() => setModoFiltro('ambos')}
            >
              🔄 Ambos
            </button>
            <button
              type="button"
              className={`filtro-tab-btn ${modoFiltro === 'escrita' ? 'active' : ''}`}
              onClick={() => setModoFiltro('escrita')}
            >
              ✍️ Escrito
            </button>
            <button
              type="button"
              className={`filtro-tab-btn ${modoFiltro === 'lista' ? 'active' : ''}`}
              onClick={() => setModoFiltro('lista')}
            >
              📋 Por Lista
            </button>
          </div>

          {/* ════ SECCIÓN ESCRITA ════ */}
          {(modoFiltro === 'ambos' || modoFiltro === 'escrita') && (
            <div className="filtro-seccion">
              <div className="seccion-tag">✍️ Búsqueda Escrita</div>

              {/* Búsqueda libre */}
              <div className="form-group">
                <label className="form-label">Término de búsqueda</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    name="busqueda"
                    value={filtros.busqueda}
                    onChange={handle}
                    placeholder="Ej: Hilux, Turbo, Deportivo..."
                    className="form-input"
                  />
                  {filtros.busqueda && (
                    <button
                      type="button"
                      className="input-clear-btn"
                      onClick={() => setFiltros(f => ({ ...f, busqueda: '' }))}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Escribir Marca libremente con datalist de sugerencias */}
              <div className="form-group">
                <label className="form-label">Marca (escribir o sugerida)</label>
                <input
                  type="text"
                  list="sugerencias-marcas"
                  name="marca"
                  value={filtros.marca}
                  onChange={handle}
                  placeholder="Escribe: Toyota, BMW..."
                  className="form-input"
                />
                <datalist id="sugerencias-marcas">
                  {MARCAS_POPULARES.map(m => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              {/* Escribir Modelo */}
              <div className="form-group">
                <label className="form-label">Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={filtros.modelo}
                  onChange={handle}
                  placeholder="Ej: Civic, F-150, Hilux..."
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* ════ SECCIÓN POR LISTA ════ */}
          {(modoFiltro === 'ambos' || modoFiltro === 'lista') && (
            <div className="filtro-seccion">
              <div className="seccion-tag">📋 Selección por Lista</div>

              {/* Marca por lista desplegable */}
              <div className="form-group">
                <label className="form-label">Seleccionar Marca de la lista</label>
                <select
                  name="marca"
                  value={filtros.marca}
                  onChange={handle}
                  className="form-select"
                >
                  <option value="">-- Todas las marcas --</option>
                  {MARCAS_POPULARES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Nivel de Daño por lista */}
              <div className="form-group">
                <label className="form-label">Nivel de Daño</label>
                <select
                  name="nivel_danio"
                  value={filtros.nivel_danio}
                  onChange={handle}
                  className="form-select"
                >
                  <option value="">-- Todos los niveles --</option>
                  {DANIOS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Año por lista */}
              <div className="form-group">
                <label className="form-label">Año</label>
                <select
                  name="anio"
                  value={filtros.anio}
                  onChange={handle}
                  className="form-select"
                >
                  <option value="">-- Todos los años --</option>
                  {ANIOS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Combustible por lista */}
              <div className="form-group">
                <label className="form-label">Combustible</label>
                <select
                  name="combustible"
                  value={filtros.combustible}
                  onChange={handle}
                  className="form-select"
                >
                  <option value="">-- Todos los combustibles --</option>
                  {COMBUSTIBLES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Tracción por lista */}
              <div className="form-group">
                <label className="form-label">Tracción / Tren de Manejo</label>
                <select
                  name="tren_manejo"
                  value={filtros.tren_manejo}
                  onChange={handle}
                  className="form-select"
                >
                  <option value="">-- Todas las tracciones --</option>
                  {TRENES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ════ ORDENAR ════ */}
          <div className="form-group">
            <label className="form-label">Ordenar lista por</label>
            <select
              name="orden"
              value={filtros.orden}
              onChange={handle}
              className="form-select"
            >
              <option value="recientes">🕒 Más recientes primero</option>
              <option value="precio_asc">💲 Precio: Menor a Mayor</option>
              <option value="precio_desc">💎 Precio: Mayor a Menor</option>
              <option value="tiempo_fin">⏳ Subastas por terminar</option>
              <option value="anio_desc">📅 Año: Más nuevo a más antiguo</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="filtros-acciones">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? '⏳ Filtrando...' : '🔍 Aplicar Filtros'}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-full btn-sm"
              onClick={limpiar}
            >
              ✕ Limpiar todos los filtros
            </button>
          </div>
        </form>
      )}
    </aside>
  );
};

export default Filtros;
