'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Phone, MapPin, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import { removeLostPet } from '@/app/admin/actions'
import { PET_SPECIES_LABELS } from '@/types/database'
import type { LostPet } from '@/types/database'

export function PublishedPetItem({ pet }: { pet: LostPet }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handleRemove = async () => {
    if (!confirm) { setConfirm(true); return }
    setLoading(true)
    const result = await removeLostPet(pet.id)
    if (result.error) toast.error(result.error)
    else toast.success('Mascota marcada como encontrada y retirada del tablero.')
    setLoading(false)
  }

  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden flex flex-col">
      <div className="aspect-video w-full overflow-hidden bg-bg">
        <img
          src={pet.photo_url}
          alt={pet.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-3 flex flex-col flex-1">
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

        <div className="space-y-1.5 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            {pet.zone}
          </div>
          <div className="flex items-center gap-1.5 bg-bg border border-line/60 rounded px-2 py-1.5">
            <Phone className="h-3 w-3 shrink-0 text-gold" aria-hidden="true" />
            <span className="font-mono text-ink">{pet.contact}</span>
          </div>
        </div>

        {confirm ? (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleRemove}
              disabled={loading}
              className="flex-1 gap-1.5 bg-ok hover:bg-ok/90 text-bg"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              {loading ? 'Retirando...' : 'Confirmar'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirm(false)}
              disabled={loading}
              className="px-2.5"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={loading}
            className="w-full mt-1 gap-1.5"
          >
            <CheckCircle className="h-3.5 w-3.5 text-ok" />
            Marcar como encontrada
          </Button>
        )}
      </div>
    </div>
  )
}
