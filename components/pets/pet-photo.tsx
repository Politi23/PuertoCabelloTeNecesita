'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ZoomIn } from 'lucide-react'

export function PetPhoto({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="aspect-video w-full overflow-hidden bg-bg relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`Ver foto: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/20 transition-colors duration-200 flex items-center justify-center">
          <ZoomIn className="h-6 w-6 text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md" aria-hidden="true" />
        </div>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto: ${alt}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }}
          onClick={close}
        >
          <div className="absolute inset-0 -z-10 backdrop-blur-sm" aria-hidden="true" />
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 bg-surface border border-line text-ink rounded-full p-2 hover:bg-line transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Cerrar (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
