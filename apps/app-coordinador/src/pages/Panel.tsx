const materias = [
  { nombre: 'Diseno de Coleccion', grupo: '4A Diseno de Modas', docente: 'Mariana Rivas', acts: 5, avance: 60, color: 'linear-gradient(135deg,#E11D6B,#7A1741)' },
  { nombre: 'Patronaje Industrial', grupo: '2B Patronaje', docente: 'Mariana Rivas', acts: 3, avance: 85, color: 'linear-gradient(135deg,#6C4CF1,#3A1D8A)' },
  { nombre: 'Fotografia de Moda', grupo: '6A Produccion', docente: 'Carlos Beltran', acts: 4, avance: 40, color: 'linear-gradient(135deg,#2D7FF0,#143f7a)' },
];

const KPIS = [
  { label: 'Alumnos activos', value: '48', color: '#E11D6B', wash: '#FCE7EF' },
  { label: 'Materias en curso', value: '4', color: '#6C4CF1', wash: '#ECE7FE' },
  { label: 'Entregas por revisar', value: '12', color: '#D9821B', wash: '#FBEEDA' },
  { label: 'Avance de calificacion', value: '62%', color: '#0E9E6E', wash: '#DFF3EB' },
];

export function Panel() {
  return (
    <div className="shell">
      <aside className="side">
        <div className="side-brand">
          <div className="brand-mark serif">F</div>
          <div>FashionCloud<small>Coordinacion</small></div>
        </div>
        <button className="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" /></svg>
          <span>Panel general</span>
        </button>
        <div className="nav-spacer" />
        <div className="nav-group">Centro de Diseno de Modas</div>
      </aside>
      <div className="main">
        <div className="topbar">
          <div>
            <div className="chip chip-magenta" style={{ marginBottom: 4 }}>Centro de Diseno de Modas · Otono 2026</div>
            <h1 className="serif">Panel general</h1>
          </div>
        </div>
        <div className="content">
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {KPIS.map((kpi, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)',
                padding: 20, position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11, background: kpi.wash, color: kpi.color,
                  display: 'grid', placeItems: 'center', marginBottom: 16
                }}>
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2">
                    {i === 0 && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></>}
                    {i === 1 && <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}
                    {i === 2 && <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>}
                    {i === 3 && <><circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/></>}
                  </svg>
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 560, fontSize: 34, letterSpacing: '-.02em', lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 7, fontWeight: 500 }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Materias table */}
          <div className="section-head" style={{ marginTop: 32 }}>
            <h2 className="serif">Estado de materias</h2>
          </div>
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <table className="tbl" style={{ padding: 8 }}>
              <thead>
                <tr><th>Materia</th><th>Docente</th><th>Actividades</th><th>Avance</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {materias.map((m, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.color, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                          {m.nombre.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div><div style={{ fontWeight: 600 }}>{m.nombre}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{m.grupo}</div></div>
                      </div>
                    </td>
                    <td>{m.docente}</td>
                    <td>{m.acts} actividades</td>
                    <td>
                      <div style={{ height: 7, borderRadius: 99, background: 'var(--line)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, background: 'var(--grad)', width: `${m.avance}%`, transition: 'width .6s' }} />
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 5 }}>{m.avance}% calificado</div>
                    </td>
                    <td>
                      <span className={`chip ${m.avance >= 80 ? 'chip-mint' : m.avance >= 40 ? 'chip-violet' : 'chip-amber'}`}>
                        <span className="dot"></span>
                        {m.avance >= 80 ? 'Completo' : m.avance >= 40 ? 'En progreso' : 'Iniciando'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
