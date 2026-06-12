"use client"
import { useEffect, useRef } from 'react'
import Icon from './Icon'

interface SectionProps {
  onOpenModal: (id: string) => void
}

/* ── HOW IT WORKS ── */
export function HowItWorks() {
  const steps = [
    { num:'01', title:'Registro institucional', desc:'La organización crea su espacio en la plataforma web y personaliza credenciales con su identidad visual.' },
    { num:'02', title:'Alta de usuarios', desc:'Importa usuarios en masa o invítalos individualmente. Cada uno recibe un enlace para registrar su biometría.' },
    { num:'03', title:'Emisión de credencial', desc:'La identidad digital es generada y asignada en segundos, lista para usarse desde la app móvil (iOS y Android).' },
    { num:'04', title:'Control automático', desc:'Accesos, asistencias y eventos se registran automáticamente. Administra todo desde el panel centralizado.' },
  ]
  return (
    <section className="section" id="como-funciona" style={{ background:'rgba(255,255,255,.015)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Cómo funciona</span>
          <h2 className="section-title">De la solicitud al acceso en minutos</h2>
          <p className="section-sub">Proceso de onboarding simplificado para instituciones y usuarios.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── DEMO / BENEFITS ── */
export function DemoSection({ onOpenModal }: SectionProps) {
  return (
    <section className="demo-section" id="plataforma">
      <div className="container">
        <div className="demo-inner reveal">
          <div>
            <span className="section-label">Por qué elegirnos</span>
            <h2 className="section-title" style={{ fontSize:'clamp(28px,4vw,52px)' }}>Deja atrás las tarjetas físicas para siempre</h2>
            <p style={{ color:'var(--gray-300)', margin:'16px 0 32px', fontSize:'15px', lineHeight:1.7 }}>Las tarjetas físicas se pierden, se dañan y no ofrecen trazabilidad. VIRTUALID es la evolución lógica de la identidad institucional.</p>
            <ul className="demo-list">
              <li><div className="demo-list-icon"><Icon glyph={'✅'} /></div><span><strong>Cero costo de reposición</strong> — No más plásticos, no más impresoras, no más tiempos de espera para credenciales nuevas.</span></li>
                <li><div className="demo-list-icon"><Icon glyph={'🔒'} /></div><span><strong>Imposible de falsificar</strong> — Cada credencial usa criptografía asimétrica y TOTP que cambia cada 30 segundos.</span></li>
                <li><div className="demo-list-icon"><Icon glyph={'📱'} /></div><span><strong>Siempre disponible</strong> — El usuario siempre lleva su teléfono. Funciona offline con firma criptográfica local.</span></li>
                <li><div className="demo-list-icon"><Icon glyph={'📊'} /></div><span><strong>Trazabilidad total</strong> — Cada acceso queda registrado con timestamp, ubicación GPS y nivel de autenticación.</span></li>
            </ul>
            <div style={{ marginTop:36 }}>
              <button className="btn btn-primary" onClick={() => onOpenModal('demo')}>Agendar demostración gratuita →</button>
            </div>
          </div>
          <div>
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700 }}>Panel Administrativo</div>
                <div className="status-chip"><div className="status-dot" /><span style={{ fontSize:11, color:'var(--green)', fontWeight:600 }}>EN VIVO</span></div>
              </div>
              <div className="admin-stats-grid">
                <div className="admin-stat violet"><div className="admin-stat-label">ACCESOS HOY</div><div className="admin-stat-value">1,248</div><div className="admin-stat-trend">↑ +12.4%</div></div>
                <div className="admin-stat green"><div className="admin-stat-label">USUARIOS ACTIVOS</div><div className="admin-stat-value">847</div><div className="admin-stat-sub">de 1,200 total</div></div>
              </div>
              <div className="admin-activity-label">ACTIVIDAD RECIENTE</div>
              <div className="admin-activity">
                <div className="activity-item ok"><span><Icon glyph={'✅'} /></span><div><div className="activity-title">J. Hernández · Acceso concedido</div><div className="activity-sub">Biblioteca Principal · hace 28s</div></div></div>
                <div className="activity-item deny"><span><Icon glyph={'❌'} /></span><div><div className="activity-title">Intento no autorizado</div><div className="activity-sub">Zona Restringida · hace 1min</div></div></div>
                <div className="activity-item new"><span><Icon glyph={'🆕'} /></span><div><div className="activity-title">M. López · Credencial emitida</div><div className="activity-sub">Admin · hace 3min</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PRICING ── */
export function Pricing({ onOpenModal }: SectionProps) {
  const plans = [
    {
      name:'Básico', desc:'Para instituciones pequeñas que inician su transformación digital.',
      price:'49', period:'USD / mes · hasta 200 usuarios', popular:false,
      features:[
        { text:'Hasta 200 credenciales activas', ok:true },
        { text:'App móvil (iOS + Android)', ok:true },
        { text:'Códigos TOTP dinámicos', ok:true },
        { text:'Panel administrativo básico', ok:true },
        { text:'Soporte por email', ok:true },
        { text:'Autenticación biométrica', ok:false },
        { text:'Geolocalización avanzada', ok:false },
        { text:'API y webhooks', ok:false },
      ],
      cta:'Comenzar gratis', ctaStyle:'btn-outline',
    },
    {
      name:'Profesional', desc:'Para instituciones en crecimiento que necesitan control total.',
      price:'149', period:'USD / mes · hasta 1,000 usuarios', popular:true,
      features:[
        { text:'Hasta 1,000 credenciales activas', ok:true },
        { text:'App móvil personalizada con branding', ok:true },
        { text:'Códigos TOTP dinámicos', ok:true },
        { text:'Panel administrativo completo', ok:true },
        { text:'Soporte prioritario 24/7', ok:true },
        { text:'Autenticación biométrica', ok:true },
        { text:'Geolocalización y geofencing', ok:true },
        { text:'API REST + webhooks', ok:true },
      ],
      cta:'Solicitar demo', ctaStyle:'btn-primary',
    },
    {
      name:'Enterprise', desc:'Para grandes organizaciones con requerimientos complejos y escala.',
      price:null, period:'Cotización personalizada', popular:false,
      features:[
        { text:'Usuarios ilimitados', ok:true },
        { text:'Múltiples instituciones (multi-tenant)', ok:true },
        { text:'SSO / SAML / LDAP', ok:true },
        { text:'SLA 99.99% garantizado', ok:true },
        { text:'Gerente de cuenta dedicado', ok:true },
        { text:'On-premise disponible', ok:true },
        { text:'Integración con sistemas legacy', ok:true },
        { text:'Auditoría y cumplimiento normativo', ok:true },
      ],
      cta:'Hablar con ventas', ctaStyle:'btn-outline',
    },
  ]

  return (
    <section className="section" id="precios">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Precios</span>
          <h2 className="section-title">Planes para cada institución</h2>
          <p className="section-sub">Sin costos ocultos. Sin contratos eternos. Escala cuando lo necesites.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <div key={i} className={`pricing-card${p.popular ? ' popular' : ''} reveal`} style={{ transitionDelay:`${i * 0.1}s` }}>
              {p.popular && <div className="popular-badge">Más popular</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-desc">{p.desc}</div>
              {p.price
                ? <div className="plan-price"><sup>$</sup><span>{p.price}</span></div>
                : <div className="plan-price" style={{ fontSize:36, paddingTop:8 }}>A medida</div>
              }
              <div className="plan-period">{p.period}</div>
              <ul className="plan-features">
                {p.features.map((f, j) => (
                  <li key={j} className={f.ok ? '' : 'na'}>{f.text}</li>
                ))}
              </ul>
              <button
                className={`btn ${p.ctaStyle} btn-full`}
                onClick={() => onOpenModal(p.name === 'Enterprise' ? 'contact' : 'demo')}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── TESTIMONIALS ── */
export function Testimonials() {
  const items = [
    { stars:'★★★★★', text:'"Eliminamos por completo las credenciales físicas en 3 semanas. El ahorro en impresión y reposición fue inmediato. El control de asistencias ahora es 100% automático."', avatar:'👩‍💼', name:'Dra. Claudia Ramírez', role:'Directora TI · Universidad del Valle' },
    { stars:'★★★★★', text:'"La autenticación biométrica nos dio una capa de seguridad que antes era imposible de implementar con presupuesto razonable. VIRTUALID lo hizo accesible."', avatar:'👨‍💼', name:'Ing. Mario Solís', role:'CISO · Grupo Hospitalario Norte' },
    { stars:'★★★★★', text:'"Implementamos VIRTUALID para 8,000 estudiantes en menos de un mes. La API fue fácil de integrar con nuestro ERP existente y el soporte fue excepcional."', avatar:'👨‍🎓', name:'Mtro. Roberto Fuentes', role:'Rector · Instituto Politécnico del Sur' },
  ]
  return (
    <section className="section" style={{ background:'rgba(255,255,255,.015)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Testimonios</span>
          <h2 className="section-title">Instituciones que ya confían en VIRTUALID</h2>
        </div>
        <div className="testimonials-grid">
          {items.map((t, i) => (
            <div key={i} className="testimonial-card reveal" style={{ transitionDelay:`${i * 0.1}s` }}>
              <div className="stars">{t.stars}</div>
              <div className="testimonial-text">{t.text}</div>
              <div className="testimonial-author">
                <div className="author-avatar">{t.avatar}</div>
                <div><div className="author-name">{t.name}</div><div className="author-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── GLASS TECH SECTION ── */
export function TechSection() {
  const cards = [
    { tag:'🔐 Biometría', icon:'🧬', bg:'gc-bg-violet', title:'Autenticación facial y dactilar', desc:'Tecnología liveness detection que distingue presencia real de fotos o máscaras. Verificación en menos de 300ms con precisión del 99.97%.', stat:'99.97', statUnit:'%', statColor:'#c084fc', statLbl:'Precisión biométrica' },
    { tag:'⚡ Código dinámico', icon:'🔢', bg:'gc-bg-blue', title:'TOTP — Código de un solo uso', desc:'RFC 6238. Cada código expira en 30 segundos, es único por dispositivo y nunca puede ser reutilizado ni interceptado de forma efectiva.', stat:'30', statUnit:'s', statColor:'#60a5fa', statLbl:'Vida útil por código' },
    { tag:'📍 Geolocalización', icon:'🗺️', bg:'gc-bg-teal', title:'Geofencing y validación GPS', desc:'Define zonas de acceso con precisión de metros. El sistema valida si el usuario está físicamente dentro del área autorizada antes de conceder acceso.', stat:'<5', statUnit:'m', statColor:'#34d399', statLbl:'Precisión de geofencing' },
  ]
  return (
    <section className="glass-section" id="tecnologia">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Tecnología</span>
          <h2 className="section-title">Seguridad de <span className="neon-accent">nueva generación</span></h2>
          <p className="section-sub">Cada capa de VIRTUALID fue diseñada con tecnología de punta para garantizar integridad, velocidad y confianza total.</p>
        </div>
        <div className="glass-cards-row">
          {cards.map((c, i) => (
            <div key={i} className="glass-card reveal" style={{ transitionDelay:`${i * 0.12}s` }}>
              <div className={`glass-card-bg ${c.bg}`} />
              <div className="glass-card-gloss" />
              <div className="glass-card-shine" />
              <div className="glass-card-content">
                <div className="gc-tag">{c.tag}</div>
                  <div className="gc-icon"><Icon glyph={c.icon} /></div>
                <div className="gc-title">{c.title}</div>
                <div className="gc-desc">{c.desc}</div>
                <div className="gc-footer">
                  <div>
                    <div className="gc-stat" style={{ color: c.statColor }}>{c.stat}<span style={{ fontSize:16 }}>{c.statUnit}</span></div>
                    <div className="gc-stat-lbl">{c.statLbl}</div>
                  </div>
                  <div className="gc-btn">→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA ── */
export function CTA({ onOpenModal }: SectionProps) {
  return (
    <section className="cta-section" id="contacto">
      <div className="container">
        <div className="cta-inner reveal">
          <span className="section-label">¿Listo para modernizar tu institución?</span>
          <h2>Empieza tu prueba gratuita hoy</h2>
          <p>30 días sin costo, sin tarjeta de crédito.<br />Setup en menos de 24 horas con soporte dedicado.</p>
          <div className="security-row" style={{ justifyContent:'center' }}>
            <div className="sec-badge"><Icon glyph={'🔐'} /> Cifrado AES-256</div>
            <div className="sec-badge"><Icon glyph={'🛡️'} /> ISO 27001</div>
            <div className="sec-badge"><Icon glyph={'✅'} /> GDPR Compliant</div>
            <div className="sec-badge">🇲🇽 Datos en México</div>
          </div>
          <div className="cta-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onOpenModal('demo')}><Icon glyph={'🚀'} /> Solicitar demo gratuita</button>
            <button className="btn btn-outline btn-lg" onClick={() => onOpenModal('contact')}><Icon glyph={'💬'} /> Hablar con un experto</button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER ── */
export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo"><div className="logo-icon"><Icon glyph={'🪪'} /></div>VIRTUAL<span>ID</span></a>
            <p>Plataforma tecnológica de identificación digital diseñada para reemplazar las credenciales físicas institucionales con identidades virtuales seguras y escalables.</p>
          </div>
          <div className="footer-col"><h4>Producto</h4><a href="#">Características</a><a href="#">Precios</a><a href="#">Seguridad</a><a href="#">API &amp; Docs</a></div>
          <div className="footer-col"><h4>Empresa</h4><a href="#">Acerca de</a><a href="#">Blog</a><a href="#">Carreras</a><a href="#">Contacto</a></div>
          <div className="footer-col"><h4>Legal</h4><a href="#">Términos de uso</a><a href="#">Privacidad</a><a href="#">Cookies</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 VIRTUALID Technologies S.A. de C.V. — Todos los derechos reservados.</span>
          <span>🇲🇽 Hecho en México</span>
        </div>
      </div>
    </footer>
  )
}