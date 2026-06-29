'use client'

import { useState, useEffect, useCallback } from 'react'
import { Phone, MapPin, X, ZoomIn } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { PET_SPECIES_LABELS } from '@/types/database'
import type { LostPet } from '@/types/database'

export function PetCard({ pet }: { pet: LostPet }) {
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
      <div className="bg-surface border border-line rounded-lg overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="aspect-video w-full overflow-hidden bg-bg relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label={`Ver foto de ${pet.name}`}
        >
          <img
            src={pet.photo_url}
            alt={`${PET_SPECIES_LABELS[pet.species]} llamado ${pet.name}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/20 transition-colors duration-200 flex items-center justify-center">
            <ZoomIn className="h-6 w-6 text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md" aria-hidden="true" />
          </div>
        </button>

        <div className="p-4 space-y-2 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-ink text-sm">{pet.name}</p>
              <p className="text-xs text-muted">{PET_SPECIES_LABELS[pet.species]}</p>
            </div>
            <span className="text-xs font-mono text-muted shrink-0">
              {formatRelativeTime(pet.created_at)}
            </span>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed flex-1">{pet.description}</p>

          <div className="space-y-1.5 text-xs text-muted pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              {pet.zone}
            </div>
            <div className="flex items-center gap-1.5 bg-bg border border-line/60 rounded px-2 py-1.5">
              <Phone className="h-3 w-3 shrink-0 text-gold" aria-hidden="true" />
              <span className="font-mono text-ink">{pet.contact}</span>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto de ${pet.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }}
          onClick={close}
        >
          <div
            className="absolute inset-0 -z-10 backdrop-blur-sm"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 bg-surface border border-line text-ink rounded-full p-2 hover:bg-line transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Cerrar (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={pet.photo_url}
            alt={`${PET_SPECIES_LABELS[pet.species]} llamado ${pet.name}`}
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
