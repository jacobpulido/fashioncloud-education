import { useNavigate } from 'react-router-dom';

const COVERS = [
  'linear-gradient(135deg,#E11D6B,#7A1741)', 'linear-gradient(135deg,#6C4CF1,#3A1D8A)',
  'linear-gradient(135deg,#0E9E6E,#0a5e44)', 'linear-gradient(135deg,#D9821B,#7a4a0f)',
  'linear-gradient(135deg,#2D7FF0,#143f7a)', 'linear-gradient(135deg,#18171C,#46414f)',
];

const actividades = [
  { id: '1', tipo: 'Proyecto', titulo: 'Moodboard Coleccion Capsula P/V', materia: 'Diseno de Coleccion', fecha: '2026-06-20', cover: 0 },
  { id: '2', tipo: 'Investigacion', titulo: 'Analisis de tendencias WGSN', materia: 'Diseno de Coleccion', fecha: '2026-06-12', cover: 2 },
  { id: '3', tipo: 'Tarea', titulo: 'Ficha tecnica Prenda insignia', materia: 'Diseno de Coleccion', fecha: '2026-06-08', cover: 3 },
];

function dueLabel(fecha: string) {
  const d = Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
  if (d < 0) return { txt: 'Vencida', soon: true };
  if (d === 0) return { txt: 'Hoy', soon: true };
  if (d <= 3) return { txt: `En ${d} dias`, soon: true };
  return { txt: new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }), soon: false };
}

function TabIcon({ tab, active }: { tab: string; active: boolean }) {
  const svg = (path: string) => <path d={path} />;
  const circles = (cx: number, cy: number, r: number) => <circle cx={cx} cy={cy} r={r} />;
  
  let content: JSX.Element;
  if (tab === 'Inicio') {
    content = <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />;
  } else if (tab === 'Avances') {
    content = <>{circles(12, 8, 6)}<path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></>;
  } else {
    content = <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{circles(12, 7, 4)}</>;
  }
  
  return (
    <div className={`tab ${active ? 'active' : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {content}
      </svg>
      <span>{tab}</span>
    </div>
  );
}

export function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="phone-frame">
      <div className="ph-scroll">
        <div className="ph-header grad">
          <div className="ph-hi">Buenos dias</div>
          <div className="ph-name">
            <span>Sofia Lara</span>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E11D6B', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 600, color: '#fff' }}>SL</div>
          </div>
        </div>

        <div className="ph-pad">
          <div className="ph-section-t">
            <span>Pendientes</span>
            <span style={{ color: 'var(--magenta)' }}>{actividades.length}</span>
          </div>

          {actividades.map((act) => {
            const due = dueLabel(act.fecha);
            return (
              <div key={act.id} className="todo" onClick={() => navigate(`/actividad/${act.id}`)}>
                <div className="todo-cover" style={{ background: COVERS[act.cover] }}>
                  <span className="t-type">{act.tipo}</span>
                  <span className={`t-due ${due.soon ? 'soon' : ''}`}>{due.txt}</span>
                </div>
                <div className="todo-body">
                  <div className="t-subj">{act.materia}</div>
                  <div className="t-title">{act.titulo}</div>
                  <div className="t-foot">
                    <span className="chip chip-muted"><span className="dot"></span>Pendiente</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{act.fecha}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tabbar">
        <TabIcon tab="Inicio" active={true} />
        <TabIcon tab="Avances" active={false} />
        <TabIcon tab="Perfil" active={false} />
      </div>
    </div>
  );
}
