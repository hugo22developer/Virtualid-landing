import Icon from './Icon'

const FEATURES = [
  { icon:'👁️', color:'', title:'Autenticación Biométrica', featured:true, desc:'Verificación facial y dactilar integrada directamente en la app móvil. Reconocimiento en menos de 300ms con tecnología anti-spoof liveness detection.' },
  { icon:'⚡', color:'blue', title:'Códigos TOTP Dinámicos', featured:false, desc:'Generación de OTP basados en tiempo (RFC 6238). Cada código es único, caduca en 30 segundos y no puede ser reutilizado.' },
  { icon:'📍', color:'green', title:'Geolocalización en Tiempo Real', featured:false, desc:'Validación de acceso por zona GPS con geofencing configurable. Registra automáticamente entradas y salidas por área predefinida.' },
  { icon:'🏛️', color:'yellow', title:'Multiinstitucional', featured:false, desc:'Una sola plataforma para múltiples organizaciones. Cada institución administra su propio espacio con branding y reglas personalizadas.' },
  { icon:'🛡️', color:'red', title:'Control de Acceso Granular', featured:false, desc:'Define permisos por área, horario, rol y nivel de seguridad. Integración con lectores físicos NFC/Bluetooth existentes.' },
  { icon:'📈', color:'indigo', title:'Dashboard Administrativo', featured:false, desc:'Supervisión en tiempo real de usuarios, asistencias e incidentes. Reportes automáticos y alertas configurables por correo o Slack.' },
]


export default function Features() {
  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    card.style.transform = `perspective(800px) rotateX(${-dy * 14}deg) rotateY(${dx * 14}deg) scale3d(1.04,1.04,1.04)`
    const spot = card.querySelector('.tilt-spotlight') as HTMLElement
    if (spot) {
      spot.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%')
      spot.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%')
    }
  }
 const onTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  // 1. Guardamos el elemento en una constante local
  const card = e.currentTarget 
  
  card.style.transition = 'transform .5s cubic-bezier(.34,1.3,.64,1)'
  card.style.transform = ''

  setTimeout(() => { 
    // 2. Usamos la constante 'card' en lugar de 'e.currentTarget'
    if (card) {
      card.style.transition = '' 
    }
  }, 500)
}

  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Características</span>
          <h2 className="section-title">Tecnología de punta en cada credencial</h2>
          <p className="section-sub">Una plataforma completa que combina seguridad de nivel bancario con experiencia de usuario excepcional.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`feature-card tilt-card${f.featured ? ' featured' : ''} reveal`}
              style={{ transitionDelay: `${i * 0.05}s` }}
              onMouseMove={onTilt}
              onMouseLeave={onTiltLeave}
            >
              <div className="tilt-spotlight" />
              <div className={`feature-icon${f.color ? ' ' + f.color : ''}`}>
                <Icon glyph={f.icon} />
              </div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}