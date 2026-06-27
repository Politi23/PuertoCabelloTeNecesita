'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Phone, MapPin, Tag, Eye, EyeOff, UserCheck, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { approveRequest, rejectRequest } from '@/app/admin/actions'
import type { Request } from '@/types/database'

export function PendingItem({ request }: { request: Request }) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [contactPublic, setContactPublic] = useState(request.contact_public)
  const [confirmReject, setConfirmReject] = useState(false)

  const handleApprove = async () => {
    setLoading('approve')
    const result = await approveRequest(request.id, contactPublic)
    if (result.error) toast.error(result.error)
    else toast.success('Petición aprobada y publicada.')
    setLoading(null)
  }

  const handleReject = async () => {
    if (!confirmReject) {
      setConfirmReject(true)
      return
    }
    setLoading('reject')
    const result = await rejectRequest(request.id)
    if (result.error) toast.error(result.error)
    else toast.success('Petición rechazada.')
    setLoading(null)
    setConfirmReject(false)
  }

  const submitterWantedPublic = request.contact_public

  return (
    <div className="bg-surface border border-line rounded-lg p-4 space-y-3 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gold uppercase tracking-wider flex items-center gap-1">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {request.category}
          </span>
          <Badge variant={request.status}>{request.status}</Badge>
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

      {/* Solo si hay contacto: preferencia del solicitante + control del admin */}
      {request.contact && (
        <div className="space-y-2">
          {/* Indicador de preferencia original del solicitante (solo lectura) */}
          <div
            className={`flex items-center gap-2 text-xs rounded px-2.5 py-1.5 border ${
              submitterWantedPublic
                ? 'bg-ok/5 border-ok/20 text-ok/80'
                : 'bg-line/30 border-line/60 text-muted'
            }`}
          >
            <UserCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>
              Solicitante eligió:{' '}
              <span className="font-medium">
                {submitterWantedPublic ? 'contacto público' : 'contacto privado'}
              </span>
            </span>
          </div>

          {/* Toggle del coordinador para ajustar la decisión final */}
          <button
            onClick={() => setContactPublic((v) => !v)}
            className={`flex items-center gap-2 text-xs rounded-md px-3 py-2 border transition-all duration-150 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              contactPublic
                ? 'bg-ok/10 border-ok/30 text-ok'
                : 'bg-surface border-line text-muted hover:border-muted/40 hover:text-ink'
            }`}
            aria-pressed={contactPublic}
          >
            {contactPublic ? (
              <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {contactPublic
                ? 'Publicar con contacto visible'
                : 'Publicar con contacto privado'}
            </span>
          </button>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={!!loading}
          className="flex-1"
        >
          {loading === 'approve' ? 'Aprobando...' : 'Aprobar'}
        </Button>

        {confirmReject ? (
          <div className="flex gap-1 flex-1">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={!!loading}
              className="flex-1 gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              {loading === 'reject' ? 'Rechazando...' : 'Confirmar'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmReject(false)}
              disabled={!!loading}
              className="px-2.5"
            >
              No
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={!!loading}
            className="flex-1"
          >
            Rechazar
          </Button>
        )}
      </div>
    </div>
  )
}
