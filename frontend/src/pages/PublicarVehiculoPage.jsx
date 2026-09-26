import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehiculoService } from '../services/vehiculo.service';
import './Publicar.css';

const TRANSMISIONES = ['Automático', 'Manual', 'CVT', 'Semiautomático'];
const COMBUSTIBLES   = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'Gas'];
const TRENES         = ['AWD', 'FWD', 'RWD', '4WD'];
const TIPOS          = ['Automóvil', 'Camioneta', 'Pickup', 'SUV', 'Van', 'Motocicleta', 'Camión'];

const PublicarVehiculoPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    anio: '', tipo_articulo: '', marca: '', modelo: '', motor: '',
    transmision: '', combustible: '', tren_manejo: '', cilindros: '',
    nivel_danio: '', precio_base: '', fecha_inicio: '', fecha_fin: '',
  });
  const [fotos,   setFotos]   = useState([]);
  const [previews,setPreviews]= useState([]);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFotos = (e) => {
    const files = Array.from(e.target.files);
    setFotos(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (fotos.length < 5) { setError('Debes subir al menos 5 fotografías'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      fotos.forEach(f => formData.append('fotos', f));
      const res = await vehiculoService.create(formData);
      if (!res.success) throw new Error(res.error || 'Error al publicar');
      setSuccess('✅ ¡Vehículo publicado exitosamente!');
      setTimeout(() => navigate(`/vehiculos/${res.data.id}`), 1500);
    } catch (err) {
      setError(err.message || 'Error al publicar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page publicar-page animate-fade">
      <div className="publicar-header">
        <h1>➕ Publicar Vehículo en Subasta</h1>
        <p>Completa la ficha técnica y sube al menos 5 fotografías</p>
      </div>

      {error   && <div className="alert alert-error mb-3">{error}</div>}
      {success && <div className="alert alert-success mb-3">{success}</div>}

      <form onSubmit={submit} className="publicar-form">
        {/* Información básica */}
        <div className="publicar-section card">
          <div className="card-body">
            <h3 className="mb-2">🚗 Ficha Técnica</h3>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Año <span>*</span></label>
                <input name="anio" type="number" value={form.anio} onChange={handle}
                  placeholder="2020" min="1900" max="2030" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de artículo</label>
                <select name="tipo_articulo" value={form.tipo_articulo} onChange={handle} className="form-select">
                  <option value="">Seleccionar...</option>
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">N° Cilindros</label>
                <input name="cilindros" type="number" value={form.cilindros} onChange={handle}
                  placeholder="4" min="1" max="16" className="form-input" />
              </div>
            </div>
            <div className="form-grid mt-2">
              <div className="form-group">
                <label className="form-label">Marca <span>*</span></label>
                <input name="marca" value={form.marca} onChange={handle}
                  placeholder="Toyota" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Modelo <span>*</span></label>
                <input name="modelo" value={form.modelo} onChange={handle}
                  placeholder="Camry" className="form-input" required />
              </div>
            </div>
            <div className="form-grid mt-2">
              <div className="form-group">
                <label className="form-label">Motor</label>
                <input name="motor" value={form.motor} onChange={handle}
                  placeholder="2.5L" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Transmisión</label>
                <select name="transmision" value={form.transmision} onChange={handle} className="form-select">
                  <option value="">Seleccionar...</option>
                  {TRANSMISIONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Combustible</label>
                <select name="combustible" value={form.combustible} onChange={handle} className="form-select">
                  <option value="">Seleccionar...</option>
                  {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tren de manejo</label>
                <select name="tren_manejo" value={form.tren_manejo} onChange={handle} className="form-select">
                  <option value="">Seleccionar...</option>
                  {TRENES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Nivel de daño */}
        <div className="publicar-section card">
          <div className="card-body">
            <h3 className="mb-2">🔍 Clasificación por Estado de Daño <span style={{color:'var(--red)'}}>*</span></h3>
            <div className="danio-opciones">
              {[
                { v:'verde',    l:'🟢 Daño Menor / Limpio',   desc:'Vehículo con daño cosmético mínimo.' },
                { v:'amarillo', l:'🟡 Daño Medio / Reparable', desc:'Daño estructural pero reparable.'   },
                { v:'rojo',     l:'🔴 Daño Severo / Salvamento',desc:'Daño total o vehículo salvamento.' },
              ].map(o => (
                <label key={o.v} className={`danio-opcion ${form.nivel_danio === o.v ? 'selected' : ''}`}>
                  <input type="radio" name="nivel_danio" value={o.v} checked={form.nivel_danio === o.v} onChange={handle} required />
                  <div className="danio-content">
                    <span className="danio-label">{o.l}</span>
                    <span className="danio-desc">{o.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Parámetros de subasta */}
        <div className="publicar-section card">
          <div className="card-body">
            <h3 className="mb-2">⚙️ Parámetros de la Subasta</h3>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Precio base (Q.) <span>*</span></label>
                <input name="precio_base" type="number" value={form.precio_base} onChange={handle}
                  placeholder="20000" min="1" step="0.01" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha y Hora de Inicio <span>*</span></label>
                <input name="fecha_inicio" type="datetime-local" value={form.fecha_inicio} onChange={handle}
                  className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha y Hora de Cierre <span>*</span></label>
                <input name="fecha_fin" type="datetime-local" value={form.fecha_fin} onChange={handle}
                  className="form-input" required />
              </div>
            </div>
          </div>
        </div>

        {/* Galería de fotos */}
        <div className="publicar-section card">
          <div className="card-body">
            <h3 className="mb-2">📷 Galería Fotográfica <span style={{color:'var(--red)'}}>*</span></h3>
            <p style={{fontSize:'.88rem', color:'var(--text-light)', marginBottom:'1rem'}}>
              Mínimo 5 fotografías requeridas. Máximo 10 imágenes (JPG, PNG, WEBP — 5MB c/u)
            </p>
            <label className="upload-area">
              <input type="file" accept="image/*" multiple onChange={handleFotos}
                className="upload-input" />
              <span className="upload-icon">📁</span>
              <span className="upload-text">
                {fotos.length > 0 ? `${fotos.length} foto(s) seleccionada(s)` : 'Haz clic o arrastra las fotos aquí'}
              </span>
              <span className="upload-hint">Al menos 5 fotos requeridas</span>
            </label>
            {previews.length > 0 && (
              <div className="fotos-preview">
                {previews.map((url, i) => (
                  <div key={i} className="foto-thumb">
                    <img src={url} alt={`Preview ${i+1}`} />
                    <span className="foto-num">{i+1}</span>
                  </div>
                ))}
              </div>
            )}
            {fotos.length > 0 && fotos.length < 5 && (
              <div className="alert alert-warning mt-2">
                ⚠️ Necesitas {5 - fotos.length} foto(s) más
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
          {loading ? '⏳ Publicando...' : '🚀 Publicar en Subasta'}
        </button>
      </form>
    </div>
  );
};

export default PublicarVehiculoPage;
