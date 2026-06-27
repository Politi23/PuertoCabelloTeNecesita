'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Phone, MapPin, Tag, CheckCircle2, Loader, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { updateRequestStatus, resolveAndHideRequest } from '@/app/admin/actions'
import type { Request } from '@/types/database'

export function ActiveItem({ request }: { request: Request }) {
  const [loading, setLoading] = useState<'proceso' | 'resolver' | null>(null)
  const [confirmResolve, setConfirmResolve] = useState(false)

  const handleMarkInProgress = async () => {
    setLoading('proceso')
    const result = await updateRequestStatus(request.id, 'en_proceso')
    if (result.error) toast.error(result.error)
    else toast.success('Marcada como en proceso.')
    setLoading(null)
  }

  const handleResolve = async () => {
    if (!confirmResolve) {
      setConfirmResolve(true)
      return
    }
    setLoading('resolver')
    const result = await resolveAndHideRequest(request.id)
    if (result.error) toast.error(result.error)
    else toast.success('Petición resuelta y retirada del tablero.')
    setLoading(null)
    setConfirmResolve(false)
  }

  return (
    <div className="bg-surface border border-line rounded-lg p-4 space-y-3 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gold uppercase tracking-wider flex items-center gap-1">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {request.category}
          </span>
          <Badge variant={request.status}>{request.status === 'en_proceso' ? 'En proceso' : 'Aprobada'}</Badge>
        </div>
        <span className="font-mono text-xs text-muted shrink-0">
          {formatRelativeTime(request.created_at)}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm text-ink leading-relaxed flex-1">{request.description}</p>

      {/* Zona y contacto */}
      <div className="space-y-1.5 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          {request.zone}
        </div>
        {request.contact && (
          <div className="flex items-center gap-1.5 text-ink bg-bg rounded px-2 py-1.5 border border-line/60">
            <Phone className="h-3 w-3 shrink-0 text-muted" aria-hidden="true" />
            <span className="font-mono flex-1">{request.contact}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-1">
        {request.status === 'aprobada' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleMarkInProgress}
            disabled={!!loading}
            className="flex-1 gap-1.5"
          >
            <Loader className="h-3.5 w-3.5" aria-hidden="true" />
            {loading === 'proceso' ? 'Guardando...' : 'En proceso'}
          </Button>
        )}

        {confirmResolve ? (
          <div className="flex gap-1 flex-1">
            <Button
              size="sm"
              onClick={handleResolve}
              disabled={!!loading}
              className="flex-1 gap-1 bg-ok hover:bg-ok/90 text-white border-ok"
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {loading === 'resolver' ? 'Resolviendo...' : 'Confirmar'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmResolve(false)}
              disabled={!!loading}
              className="px-2.5"
            >
              No
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleResolve}
            disabled={!!loading}
            className="flex-1 gap-1.5 border-ok/30 text-ok hover:bg-ok/10 hover:border-ok/50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Resolver y retirar
          </Button>
        )}
      </div>

      {confirmResolve && (
        <p className="text-xs text-muted flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 shrink-0 text-warn" aria-hidden="true" />
          Se retirará del tablero público.
        </p>
      )}
    </div>
  )
}
