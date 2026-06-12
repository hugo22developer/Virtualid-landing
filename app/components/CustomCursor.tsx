'use client'
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [ring, setRing] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  const animRef = useRef<number>(0)
  const ringRef = useRef({ x: 0, y: 0 })
  const posRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      setPos({ x: e.clientX, y: e.clientY })
      if (!active) setActive(true)
      const el = document.elementFromPoint(e.clientX, e.clientY)
      setHover(!!(el?.closest('button, a, .btn, .glass-card, .feature-card, .pricing-card')))
    }
    const onLeave = () => setActive(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    const animate = () => {
      ringRef.current.x += (posRef.current.x - ringRef.current.x) * 0.12
      ringRef.current.y += (posRef.current.y - ringRef.current.y) * 0.12
      setRing({ x: ringRef.current.x, y: ringRef.current.y })
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(animRef.current)
    }
  }, [active])

  return (
    <>
      <div
        id="cursor-ring"
        className={`${active ? 'active' : ''} ${hover ? 'hover' : ''}`}
        style={{ left: ring.x, top: ring.y }}
      />
      <div
        id="cursor-dot"
        className={active ? 'active' : ''}
        style={{ left: pos.x, top: pos.y }}
      />
    </>
  )
}