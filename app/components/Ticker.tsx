const TICKER_EVENTS = [
  { icon:'✅', text:'<strong>María R.</strong> accedió al Laboratorio 3B',   time:'hace 2s',  tag:'tick-ok',   label:'ACCESO OK'  },
  { icon:'🧬', text:'<strong>Carlos M.</strong> verificó biometría facial',   time:'hace 5s',  tag:'tick-bio',  label:'BIOMETRÍA'  },
  { icon:'🆕', text:'Credencial emitida para <strong>Ana Torres</strong>',    time:'hace 8s',  tag:'tick-new',  label:'NUEVA ID'   },
  { icon:'❌', text:'Acceso denegado en <strong>Zona Restringida</strong>',   time:'hace 11s', tag:'tick-deny', label:'DENEGADO'   },
  { icon:'✅', text:'<strong>Luis H.</strong> registró asistencia — Turno A', time:'hace 14s', tag:'tick-ok',   label:'ASISTENCIA' },
  { icon:'📍', text:'<strong>Sofía V.</strong> en Campus Norte geolocalizada',time:'hace 18s', tag:'tick-ok',   label:'GPS OK'     },
  { icon:'🔑', text:'<strong>Rector</strong> inició sesión desde nuevo dispositivo',time:'hace 22s',tag:'tick-bio',label:'2FA'},
  { icon:'✅', text:'<strong>Diego P.</strong> accedió a Biblioteca Central', time:'hace 26s', tag:'tick-ok',   label:'ACCESO OK'  },
  { icon:'🆕', text:'Nuevo perfil institucional: <strong>TechCorp MX</strong>',time:'hace 30s',tag:'tick-new', label:'NUEVA ORG' },
  { icon:'❌', text:'TOTP expirado — reintento de <strong>Pedro A.</strong>', time:'hace 33s', tag:'tick-deny', label:'EXPIRADO'   },
  { icon:'🧬', text:'<strong>Valeria S.</strong> pasó reconocimiento facial', time:'hace 38s', tag:'tick-bio',  label:'BIOMETRÍA'  },
  { icon:'✅', text:'<strong>Dr. Mora</strong> accedió al Quirófano 2 — OK', time:'hace 42s', tag:'tick-ok',   label:'ACCESO OK'  },
  { icon:'📊', text:'1,452 eventos registrados hoy en <strong>UniTech</strong>',time:'hace 45s',tag:'tick-new',label:'REPORTE'   },
  { icon:'✅', text:'<strong>Ing. Reyes</strong> marcó salida — Turno B',    time:'hace 50s', tag:'tick-ok',   label:'SALIDA'     },
]

import Icon from './Icon'

export default function Ticker() {
  const events = [...TICKER_EVENTS, ...TICKER_EVENTS]
  return (
    <div className="ticker-section">
      <div className="ticker-header">
        <div className="ticker-live-dot" />
        <span className="ticker-label">Actividad en vivo</span>
      </div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {events.map((ev, i) => (
            <div key={i} className="tick-event">
              <span className="tick-event-icon"><Icon glyph={ev.icon} /></span>
              <span className="tick-event-text" dangerouslySetInnerHTML={{ __html: ev.text }} />
              <span className="tick-event-time">{ev.time}</span>
              <span className={`tick-tag ${ev.tag}`}>{ev.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ticker-fade-l" />
      <div className="ticker-fade-r" />
    </div>
  )
}