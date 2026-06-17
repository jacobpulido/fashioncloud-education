import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Sample data matching the prototype
const COVERS = [
    'linear-gradient(135deg,#E11D6B,#7A1741)', 'linear-gradient(135deg,#6C4CF1,#3A1D8A)',
    'linear-gradient(135deg,#0E9E6E,#0a5e44)', 'linear-gradient(135deg,#D9821B,#7a4a0f)',
    'linear-gradient(135deg,#2D7FF0,#143f7a)', 'linear-gradient(135deg,#18171C,#46414f)',
    'linear-gradient(135deg,#E8336D,#6C4CF1)',
];
const materias = [
    { id: 'm1', nombre: 'Diseño de Coleccion', grupo: '4A Diseño de Modas', cover: 0, docente: 'Mariana Rivas', acts: 5, pendientes: 3 },
    { id: 'm2', nombre: 'Patronaje Industrial', grupo: '2B Patronaje', cover: 1, docente: 'Mariana Rivas', acts: 3, pendientes: 0 },
    { id: 'm3', nombre: 'Fotografia de Moda', grupo: '6A Produccion', cover: 4, docente: 'Carlos Beltran', acts: 4, pendientes: 1 },
];
function NavItem({ label, icon, active, onClick }) {
    const paths = {
        home: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
        book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
        inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
        award: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    };
    return (<button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={paths[icon] || paths.home}/></svg>
      <span>{label}</span>
    </button>);
}
function ActionTile({ icon, title, desc, color, badge, onClick }) {
    return (<button className="action-tile" onClick={onClick}>
      {badge ? <span className="badge">{badge}</span> : null}
      <div className="a-ico" style={{ background: color }}>
        <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2">
          {icon === 'plus' && <><path d="M12 5v14M5 12h14"/></>}
          {icon === 'eye' && <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>}
          {icon === 'award' && <><circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/></>}
        </svg>
      </div>
      <h3 className="serif">{title}</h3>
      <p>{desc}</p>
    </button>);
}
export function Dashboard() {
    const navigate = useNavigate();
    const [view, setView] = useState('home');
    function renderContent() {
        if (view === 'revisar') {
            return (<>
          <div style={{ marginBottom: 24 }}>
            <button className="btn btn-ghost" onClick={() => setView('home')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
          </div>
          <div className="evidence-grid">
            {[1, 2, 3, 4, 5].map(i => (<div key={i} className="ev-card">
                <div className="ev-thumb" style={{ background: COVERS[i] }}>
                  <span className="ftype">IMG</span>
                  <span style={{ fontFamily: 'Fraunces', fontSize: 30, opacity: 0.9 }}>{i}</span>
                </div>
                <div className="ev-body">
                  <div className="nm">Evidencia_{i}.jpg</div>
                  <div className="sb">Sofia Lara · Pendiente</div>
                </div>
              </div>))}
          </div>
        </>);
        }
        if (view === 'calificar') {
            return (<>
          <div style={{ marginBottom: 24 }}>
            <button className="btn btn-ghost" onClick={() => setView('home')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
          </div>
          <div className="gradebook" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}>
            <table className="tbl" style={{ padding: 8 }}>
              <thead>
                <tr><th>Alumno</th><th>Proyecto (40%)</th><th>Evidencia (25%)</th><th>Tarea (15%)</th><th>Investigacion (10%)</th><th>Presentacion (10%)</th><th>Final</th></tr>
              </thead>
              <tbody>
                {['Sofia Lara', 'Diego Mora', 'Renata Quintero', 'Iker Solis', 'Valentina Cruz'].map((nombre, i) => (<tr key={i}>
                    <td><span className="chip chip-mint"><span className="dot"></span>{nombre}</span></td>
                    <td>{95 - i * 5}</td>
                    <td>{88 - i * 3}</td>
                    <td>{85 - i * 4}</td>
                    <td>{90 - i * 2}</td>
                    <td>—</td>
                    <td><span className="gb-final">{(90 - i * 4).toFixed(1)}</span></td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </>);
        }
        // Default: home view
        return (<>
        {/* 3 Acciones */}
        <div className="actions-3">
          <ActionTile icon="plus" title="Asignar" desc="Crea y publica una actividad en pocos minutos" color="linear-gradient(135deg,#E11D6B,#B81457)"/>
          <ActionTile icon="eye" title="Revisar" desc="Evalua las evidencias visualmente, en maximo tres clics" color="linear-gradient(135deg,#6C4CF1,#3A1D8A)" badge={4} onClick={() => setView('revisar')}/>
          <ActionTile icon="award" title="Calificar" desc="Promedios y resultados finales calculados automaticamente" color="linear-gradient(135deg,#0E9E6E,#0a5e44)" onClick={() => setView('calificar')}/>
        </div>

        {/* Materias */}
        <div className="section-head">
          <h2 className="serif">Mis materias</h2>
        </div>
        <div className="grid grid-3">
          {materias.map(m => (<div key={m.id} className="subj-card">
              <div className="subj-top" style={{ background: COVERS[m.cover] }}>
                <span className="grp">{m.grupo}</span>
              </div>
              <div className="subj-body">
                <h3 className="serif">{m.nombre}</h3>
                <div className="who">{m.docente}</div>
                <div className="subj-meta">
                  <span>{m.acts} actividades</span>
                  <span><b>{m.pendientes}</b> por revisar</span>
                </div>
              </div>
            </div>))}
        </div>
      </>);
    }
    return (<div className="shell">
      {/* Sidebar */}
      <aside className="side">
        <div className="side-brand">
          <div className="brand-mark serif">F</div>
          <div>FashionCloud<small>Docente</small></div>
        </div>
        <NavItem label="Inicio" icon="home" active={view === 'home'} onClick={() => setView('home')}/>
        <NavItem label="Mis materias" icon="book" onClick={() => setView('home')}/>
        <NavItem label="Por revisar" icon="inbox" onClick={() => setView('revisar')}/>
        <NavItem label="Calificaciones" icon="award" onClick={() => setView('calificar')}/>
        <div className="nav-spacer"/>
      </aside>

      {/* Main */}
      <div className="main">
        <div className="topbar">
          <div>
            <div className="chip chip-magenta" style={{ marginBottom: 4 }}>Otoño 2026</div>
            <h1 className="serif">
              {view === 'home' ? 'Hola, Mariana' : view === 'revisar' ? 'Por revisar' : 'Calificaciones'}
            </h1>
          </div>
          {view === 'home' && (<button className="btn btn-primary btn-lg">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              Nueva actividad
            </button>)}
        </div>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=Dashboard.js.map