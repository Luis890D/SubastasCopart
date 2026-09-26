import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vehiculoService } from '../services/vehiculo.service';
import VehiculoCard from '../components/VehiculoCard';

const MisPublicacionesPage = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    vehiculoService.getMios()
      .then(r => setVehiculos(r.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner" /><p>Cargando...</p></div>;

  return (
    <div className="page animate-fade">
      <div className="flex-between mb-3">
        <h1>📋 Mis Publicaciones</h1>
        <Link to="/publicar" className="btn btn-primary">➕ Publicar nuevo</Link>
      </div>

      {error && <div className="alert alert-error mb-3">{error}</div>}

      {vehiculos.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize:'4rem' }}>🚗</span>
          <h3>No tienes vehículos publicados</h3>
          <p>Comienza publicando tu primer vehículo en subasta</p>
          <Link to="/publicar" className="btn btn-primary mt-2">Publicar vehículo</Link>
        </div>
      ) : (
        <div className="vehiculos-grid">
          {vehiculos.map(v => <VehiculoCard key={v.id} vehiculo={v} />)}
        </div>
      )}
    </div>
  );
};

export default MisPublicacionesPage;
