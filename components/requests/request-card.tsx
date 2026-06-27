import { MapPin, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import type { PublicRequest, RequestStatus } from '@/types/database'

const STATUS_LABELS: Record<RequestStatus, string> = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta',
}

export function RequestCard({ request, style }: { request: PublicRequest; style?: React.CSSProperties }) {
  return (
    <Card className="hover:border-muted/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30" style={style}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider">
            {request.category}
          </span>
          <Badge variant={request.status as Parameters<typeof Badge>[0]['variant']}>
            {STATUS_LABELS[request.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <p className="text-sm text-ink leading-relaxed">{request.description}</p>

        <div className="space-y-1.5 pt-1 border-t border-line/40">
          <div className="flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{request.zone}</span>
          </div>
          {request.contact && (
            <div className="flex items-center gap-1.5 text-xs text-ink bg-bg rounded px-2 py-1 border border-line/50">
              <Phone className="h-3 w-3 shrink-0 text-muted" aria-hidden="true" />
              <span className="font-mono">{request.contact}</span>
            </div>
          )}
          <p className="font-mono text-xs text-muted/50">
            {formatRelativeTime(request.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
