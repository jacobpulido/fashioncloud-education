import { useParams, useNavigate } from 'react-router-dom';

const actividades = [
  { id: '1', tipo: 'Proyecto', titulo: 'Moodboard Coleccion Capsula P/V', materia: 'Diseno de Coleccion', fecha: '2026-06-20', cover: 0, valor: 100, desc: 'Construye un moodboard editorial que defina paleta, texturas, siluetas e inspiracion de tu coleccion capsula primavera/verano.' },
];

export function Actividad() {
  const { id } = useParams();
  const navigate = useNavigate();
  const act = actividades.find(a => a.id === id) || actividades[0];

  return (
    <div className="phone-frame">
      <div className="ph-scroll">
        <div className="ph-cover-lg" style={{ height: 200, background: 'linear-gradient(135deg,#E11D6B,#7A1741)', display: 'flex', alignItems: 'flex-end', padding: 18, position: 'relative' }}>
          <div className="ph-back" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </div>
          <span className="t-type" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: '#fff', background: 'rgba(0,0,0,.3)', padding: '4px 10px', borderRadius: 8 }}>{act.tipo}</span>
        </div>

        <div className="ph-detail-body">
          <h2>{act.titulo}</h2>
          
          <div className="detail-meta">
            <div className="dm">{act.materia}<b>Materia</b></div>
            <div className="dm">{act.fecha}<b>Limite</b></div>
            <div className="dm">{act.valor} pts<b>Valor</b></div>
          </div>

          <div className="instructions">
            <h4>Instrucciones</h4>
            <p>{act.desc}</p>
          </div>

          <h4 style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Tu entrega</h4>
          
          <div className="upload-zone">
            <div className="uz-ico">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
            </div>
            <h4>Sube tu evidencia</h4>
            <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>Toca para seleccionar archivo</p>
          </div>

          <div className="upload-opts">
            <button className="uo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
              Foto
            </button>
            <button className="uo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
              PDF
            </button>
            <button className="uo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8z" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>
              Video
            </button>
            <button className="uo">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              Enlace
            </button>
          </div>

          <button className="btn btn-primary" style={{ marginTop: 8 }}>Entregar actividad</button>
        </div>
      </div>

      <div className="tabbar">
        <div className="tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg><span>Inicio</span></div>
        <div className="tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg><span>Avances</span></div>
        <div className="tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg><span>Perfil</span></div>
      </div>
    </div>
  );
}
