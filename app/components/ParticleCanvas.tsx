'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 }) // Para trackear el mouse
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W: number, H: number
    const COLORS = ['#7C3AED', '#9D5CF6', '#4F46E5', '#2563EB', '#C084FC']
    const LINK = 150, MDIST = 180
    let particles: Particle[] = []

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      const COUNT = Math.min(Math.floor(W * H / 14000), 80)
      
      // Reinicializar partículas al redimensionar para mantener la densidad
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .4,
        vy: (Math.random() - .5) * .4,
        r: 1.5 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: .4 + Math.random() * .5
      }))
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    resize()

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      const { x: mX, y: mY } = mouseRef.current

      // 1. Física y Movimiento
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        // Repulsión del mouse
        const dx = p.x - mX, dy = p.y - mY, d = Math.hypot(dx, dy)
        if (d < MDIST) {
          const f = (MDIST - d) / MDIST * .015
          p.vx += dx / d * f
          p.vy += dy / d * f
        }

        // Límite de velocidad
        const sp = Math.hypot(p.vx, p.vy)
        if (sp > .8) { p.vx = p.vx / sp * .8; p.vy = p.vy / sp * .8 }
      })

      // 2. Dibujar Conexiones
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y)

          if (d < LINK) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            // Gradiente entre partículas
            const g = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            g.addColorStop(0, p1.color)
            g.addColorStop(1, p2.color)
            ctx.strokeStyle = g
            ctx.globalAlpha = (1 - d / LINK) * .35
            ctx.lineWidth = .8
            ctx.stroke()
          }
        }

        // Conexión al Mouse
        const dm = Math.hypot(p1.x - mX, p1.y - mY)
        if (dm < MDIST * 1.2) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mX, mY)
          ctx.strokeStyle = p1.color
          ctx.globalAlpha = (1 - dm / (MDIST * 1.2)) * .3
          ctx.lineWidth = .6
          ctx.stroke()
        }
      }

      // 3. Dibujar Partículas
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: 'transparent'
      }}
    />
  )
}