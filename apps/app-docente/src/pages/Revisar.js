import { useNavigate } from 'react-router-dom';
export function Revisar() {
    const navigate = useNavigate();
    return (<div className="shell">
      <aside className="side">
        <div className="side-brand">
          <div className="brand-mark serif">F</div>
          <div>FashionCloud<small>Docente</small></div>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <div>
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver a inicio
            </button>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 540, fontSize: 22 }}>Galeria de revision</h1>
        </div>
        <div className="content">
          <div className="review-split">
            <div className="review-preview">
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 64, opacity: 0.85 }}>PDF</span>
              <div className="pv-meta" style={{ position: 'absolute', bottom: 18, left: 18, fontSize: 12.5 }}>
                moodboard_sofia.pdf · 3.2 MB
              </div>
              <div className="pv-nav prev" style={{ position: 'absolute', top: '50%', left: 14, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </div>
              <div className="pv-nav next" style={{ position: 'absolute', top: '50%', right: 14, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
            <div className="review-side">
              <div className="rs-student" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E11D6B', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 600, color: '#fff' }}>SL</div>
                <div><b style={{ fontSize: 16 }}>Sofia Lara</b><br /><span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Moodboard — Coleccion Capsula P/V</span></div>
              </div>

              <div className="grade-input" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--paper)', border: '1.5px solid var(--line)', borderRadius: 13, padding: '12px 16px', marginBottom: 14 }}>
                <input type="number" defaultValue={95} min={0} max={100} style={{ width: 64, border: 'none', background: 'none', fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 560, textAlign: 'center', outline: 'none' }}/>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: 'var(--muted-2)' }}>/ 100</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                <button className="ra-btn" style={{ padding: 14, borderRadius: 13, fontWeight: 600, fontSize: 14, border: '1.5px solid var(--mint)', background: 'var(--mint-wash)', color: 'var(--mint)', cursor: 'pointer' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  Aprobar
                </button>
                <button className="ra-btn" style={{ padding: 14, borderRadius: 13, fontWeight: 600, fontSize: 14, border: '1.5px solid var(--line)', cursor: 'pointer' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 4H3l7 7v7l4 2v-9l7-7z"/></svg>
                  Correccion
                </button>
              </div>

              <textarea placeholder="Comentario para el alumno..." rows={4} style={{ width: '100%', padding: 12, border: '1.5px solid var(--line)', borderRadius: 13, fontSize: 14, resize: 'none', outline: 'none', background: 'var(--paper)' }}/>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=Revisar.js.map