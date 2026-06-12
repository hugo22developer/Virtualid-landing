'use client'
import { useEffect, useState, useRef } from 'react'

const QR_PATTERN = [1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,1,0,1,1,1,1,0,0,1,0,1,0,0,1,1,0,1,0,1]
const FULL_TEXT = 'VIRTUALID reemplaza las credenciales físicas con identidades digitales verificables, autenticación biométrica y control de acceso en tiempo real. Todo desde una app.'

interface HeroProps {
  onOpenModal: (id: string) => void
}

export default function Hero({ onOpenModal }: HeroProps) {
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [counter500, setCounter500] = useState(0)
  const [counter120, setCounter120] = useState(0)
  const [counter99, setCounter99] = useState('0.0')
  const countersStarted = useRef(false)
  const statsRef = useRef<HTMLDivElement>(null)

  // Typewriter
  useEffect(() => {
    let i = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    const type = () => {
      if (i < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, i + 1))
        i++
        const ch = FULL_TEXT[i - 1]
        const delay = (ch === ',' || ch === '.') ? 160 : ch === ' ' ? 30 : 28 + Math.random() * 20
        const t = setTimeout(type, delay)
        timers.push(t)
      } else {
        const t = setTimeout(() => setShowCursor(false), 3000)
        timers.push(t)
      }
    }
    const init = setTimeout(type, 900)
    timers.push(init)
    return () => timers.forEach(clearTimeout)
  }, [])

  // Counter animation helper
  const animateNum = (target: number, duration: number, cb: (v: number) => void) => {
    const steps = duration / 16
    const inc = target / steps
    let cur = 0
    const tick = () => {
      cur = Math.min(cur + inc, target)
      cb(cur)
      if (cur < target) setTimeout(tick, 16)
    }
    tick()
  }

  // Counters on scroll
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted.current) {
          countersStarted.current = true
          animateNum(500, 1800, v => setCounter500(Math.floor(v)))
          animateNum(120, 1800, v => setCounter120(Math.floor(v)))
          animateNum(99.9, 1800, v => setCounter99(v.toFixed(1)))
        }
      })
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

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
    e.currentTarget.style.transform = ''
  }

  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-badge">🚀 Plataforma de Identificación Digital de Nueva Generación</div>
            <h1>
              Credenciales digitales{' '}
              <span className="glitch-wrap neon-accent">
                seguras e inteligentes
                <span className="glitch-layer glitch-layer-1" aria-hidden>seguras e inteligentes</span>
                <span className="glitch-layer glitch-layer-2" aria-hidden>seguras e inteligentes</span>
              </span>{' '}
              para tu institución
            </h1>
            <p className="hero-sub">
              {typedText}
              {showCursor && <span className="typewriter-cursor" />}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onOpenModal('demo')}>
                🎯 Solicitar demo gratuita
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => onOpenModal('login')}>
                Iniciar sesión →
              </button>
            </div>
            <div className="hero-stats" ref={statsRef}>
              <div>
                <div className="stat-num">{counter500}<span>+</span></div>
                <div className="stat-label">Instituciones activas</div>
              </div>
              <div>
                <div className="stat-num">{counter120}<span>K</span></div>
                <div className="stat-label">Usuarios verificados</div>
              </div>
              <div>
                <div className="stat-num">{counter99}<span>%</span></div>
                <div className="stat-label">Uptime garantizado</div>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-glow-card">
                <div className="phone-frame">
                  <div className="phone-screen">
                    <div className="phone-header">
                      <div className="phone-avatar">👤</div>
                      <div className="phone-name">Ana García Mendoza</div>
                      <div className="phone-id">ID: VID-2024-00837 · Universidad Nacional</div>
                    </div>
                    <div className="phone-body">
                      <div className="qr-zone">
                        <div className="qr-pattern">
                          {QR_PATTERN.map((cell, i) => (
                            <div
                              key={i}
                              className="qr-cell"
                              style={{ background: cell ? '#080D1E' : 'transparent', animationDelay: `${i * 0.04}s` }}
                            />
                          ))}
                        </div>
                        <div className="qr-label">ESCANEAR PARA VERIFICAR</div>
                      </div>
                      <div className="totp-zone">
                        <div className="totp-label">⚡ CÓDIGO DINÁMICO (TOTP)</div>
                        <div className="totp-code">847 291</div>
                        <div className="totp-bar-track"><div className="totp-bar" /></div>
                      </div>
                      <div className="status-chip">
                        <div className="status-dot" />
                        <div className="status-text">IDENTIDAD VERIFICADA · 📍 Campus Norte</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-cards">
              <div className="f-card f-card-1">
                <span className="f-card-icon">🔐</span>
                <div><div className="f-card-title">Autenticación biométrica</div><div className="f-card-sub">Face ID · Huella dactilar</div></div>
              </div>
              <div className="f-card f-card-2">
                <span className="f-card-icon">✅</span>
                <div><div className="f-card-title">Acceso concedido</div><div className="f-card-sub">Laboratorio 3B · Hace 2 seg</div></div>
              </div>
              <div className="f-card f-card-3">
                <span className="f-card-icon">📊</span>
                <div><div className="f-card-title">+1,240 accesos hoy</div><div className="f-card-sub">+18% vs ayer</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
