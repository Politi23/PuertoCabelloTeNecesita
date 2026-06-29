'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Phone, MapPin, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import { approveLostPet, rejectLostPet } from '@/app/admin/actions'
import { PET_SPECIES_LABELS } from '@/types/database'
import type { LostPet } from '@/types/database'

export function PendingPetItem({ pet }: { pet: LostPet }) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [confirmReject, setConfirmReject] = useState(false)

  const handleApprove = async () => {
    setLoading('approve')
    const result = await approveLostPet(pet.id)
    if (result.error) toast.error(result.error)
    else toast.success('Mascota publicada en el tablero.')
    setLoading(null)
  }

  const handleReject = async () => {
    if (!confirmReject) { setConfirmReject(true); return }
    setLoading('reject')
    const result = await rejectLostPet(pet.id)
    if (result.error) toast.error(result.error)
    else toast.success('Reporte rechazado.')
    setLoading(null)
    setConfirmReject(false)
  }

  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden flex flex-col">
      <div className="aspect-video w-full overflow-hidden bg-bg">
        <img
          src={pet.photo_url}
          alt={pet.name}
          className="w-full h-full object-cover"
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
            <MapPin className="h-3 w-3 shrink-0" />
            {pet.zone}
          </div>
          <div className="flex items-center gap-1.5 bg-bg border border-line/60 rounded px-2 py-1.5">
            <Phone className="h-3 w-3 shrink-0 text-gold" />
            <span className="font-mono text-ink">{pet.contact}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={handleApprove} disabled={!!loading} className="flex-1">
            {loading === 'approve' ? 'Publicando...' : 'Publicar'}
          </Button>
          {confirmReject ? (
            <div className="flex gap-1 flex-1">
              <Button size="sm" variant="destructive" onClick={handleReject} disabled={!!loading} className="flex-1 gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                {loading === 'reject' ? 'Rechazando...' : 'Confirmar'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmReject(false)} disabled={!!loading} className="px-2.5">
                No
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="destructive" onClick={handleReject} disabled={!!loading} className="flex-1">
              Rechazar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
