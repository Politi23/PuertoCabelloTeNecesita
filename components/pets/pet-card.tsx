import { Phone, MapPin } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { PET_SPECIES_LABELS } from '@/types/database'
import type { LostPet } from '@/types/database'

export function PetCard({ pet }: { pet: LostPet }) {
  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden flex flex-col">
      <div className="aspect-video w-full overflow-hidden bg-bg">
        <img
          src={pet.photo_url}
          alt={`${PET_SPECIES_LABELS[pet.species]} llamado ${pet.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
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
  )
}
