'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Features from './components/Features'

import { HowItWorks, DemoSection, Pricing, Testimonials, TechSection, CTA, Footer } from './components/Sections'
import Modals from './components/Modals'
import ToastContainer from './components/ToastContainer'
import { useScrollReveal } from './hooks/useScrollReveal'

// Dynamically import heavy client-only components
const ParticleCanvas = dynamic(() => import('./components/ParticleCanvas'), { ssr: false })
const CustomCursor   = dynamic(() => import('./components/CustomCursor'),   { ssr: false })

function LandingInner() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  useScrollReveal()

  const openModal = (id: string) => {
    setActiveModal(id)
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = 'hidden'
    }
  }
  const closeModal = (id: string) => {
    if (activeModal === id) {
      setActiveModal(null)
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.overflow = ''
      }
    }
  }

  // Escape key to close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && activeModal) closeModal(activeModal) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeModal])

  return (
    <>
      {/* Backgrounds */}
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="aurora-layer" aria-hidden>
        <div className="aurora-band aurora-1" />
        <div className="aurora-band aurora-2" />
        <div className="aurora-band aurora-3" />
        <div className="aurora-band aurora-4" />
      </div>

      {/* Client-only effects */}
      <ParticleCanvas />
      <CustomCursor />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navbar onOpenModal={openModal} />

      {/* Page sections */}
      <main>
        <Hero onOpenModal={openModal} />

        {/* Logos strip */}
        <div className="container">
          <div className="divider" />
          <div className="logos-strip">
            <span>UniTech</span><span>Colegio Nacional</span><span>HealthCorp</span>
            <span>EdufuturaMX</span><span>Instituto IPN</span><span>GovAccess</span>
          </div>
          <div className="divider" />
        </div>

        <Ticker />
        <Features />
        <HowItWorks />
        <DemoSection onOpenModal={openModal} />
        <Pricing onOpenModal={openModal} />
        <Testimonials />
        <TechSection />
        <CTA onOpenModal={openModal} />
      </main>

      <Footer />

      {/* Modals */}
      <Modals
        activeModal={activeModal}
        onClose={closeModal}
        onOpen={openModal}
      />
    </>
  )
}

export default function LandingPage() {
  return (
    <ToastProvider>
      <LandingInner />
    </ToastProvider>
  )
}