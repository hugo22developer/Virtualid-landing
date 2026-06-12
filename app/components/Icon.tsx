'use client'
import React from 'react'

export default function Icon({ glyph, alt }: { glyph: string, alt?: string }) {
  const map: Record<string, string> = {
    '✅': 'check',
    '❌': 'deny',
    '🧬': 'bio',
    '🆕': 'new',
    '📍': 'pin',
    '🔑': 'key',
    '📊': 'report',
    '👁️': 'eye',
    '⚡': 'bolt',
    '🏛️': 'building',
    '🛡️': 'shield',
    '📈': 'chart',
    '🔢': 'numbers',
    '⚠️': 'warning',
    '💡': 'info',
    '🚀': 'rocket',
    '👤': 'user',
    '🎯': 'target',
    '🔐': 'lock'
    , '🔒': 'lock'
    , '📱': 'phone'
    , '🪪': 'idcard'
    , '💬': 'chat'
    , '✉️': 'mail'
    , '🏢': 'building'
    , '🧾': 'receipt'
  }

  const name = map[glyph] || 'placeholder'

  return (
    // use public/icons/*.svg — size controlled by CSS
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/icons/${name}.svg`} alt={alt || glyph} className="icon" />
  )
}
