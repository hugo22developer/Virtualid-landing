'use client'
import { useEffect, useState } from 'react'

interface NavProps {
  onOpenModal: (id: string) => void
}

export default function Navbar({ onOpenModal }: NavProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const smooth = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <div className="nav-inner">
          <a href="#" className="logo">
              <div className="logo-icon">
             <img src="/images/image.png" alt="Logo" className="logos" />
        </div>
            VIRTUAL<span>ID</span>
          </a>
          <ul className="nav-links">
            <li><a href="#features"      onClick={e => smooth(e, 'features')}>Características</a></li>
            <li><a href="#como-funciona" onClick={e => smooth(e, 'como-funciona')}>Cómo funciona</a></li>
            <li><a href="#precios"       onClick={e => smooth(e, 'precios')}>Precios</a></li>
            <li><a href="#contacto"      onClick={e => smooth(e, 'contacto')}>Contacto</a></li>
            <li>
              <a href="#" className="nav-cta" onClick={e => { e.preventDefault(); onOpenModal('login') }}>
                Iniciar sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}