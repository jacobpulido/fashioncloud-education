import { useNavigate } from 'react-router-dom';

export function Calificar() {
  const navigate = useNavigate();
  return (
    <div className="shell">
      <aside className="side">
        <div className="side-brand">
          <div className="brand-mark serif">F</div>
          <div>FashionCloud<small>Docente</small></div>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Volver
          </button>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 540, fontSize: 22 }}>Concentrado de notas</h1>
        </div>
        <div className="content">
          <div className="gradebook" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}>
            <table className="tbl">
              <thead>
                <tr><th>Alumno</th><th>Proyecto (40%)</th><th>Evidencia (25%)</th><th>Tarea (15%)</th><th>Investigacion (10%)</th><th>Presentacion (10%)</th><th>Final</th></tr>
              </thead>
              <tbody>
                {[
                  { nombre: 'Sofia Lara', notas: [95, 88, 85, 90, null] },
                  { nombre: 'Diego Mora', notas: [90, 85, 78, 92, null] },
                  { nombre: 'Renata Quintero', notas: [92, 90, null, 88, null] },
                  { nombre: 'Iker Solis', notas: [70, 75, 80, null, null] },
                  { nombre: 'Valentina Cruz', notas: [88, 82, 90, 85, null] },
                ].map((alumno, i) => {
                  const total = alumno.notas.reduce((a, b) => a + (b || 0), 0);
                  const count = alumno.notas.filter(n => n !== null).length;
                  const promedio = count > 0 ? (total / count).toFixed(1) : '—';
                  return (
                    <tr key={i}>
                      <td><span className="chip chip-mint"><span className="dot"></span>{alumno.nombre}</span></td>
                      {alumno.notas.map((n, j) => <td key={j}>{n !== null ? n : '—'}</td>)}
                      <td><span className="gb-final">{promedio}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
