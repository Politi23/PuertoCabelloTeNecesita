import { Badge } from '@/components/ui/badge'
import type { UrgencyLevel } from '@/types/database'

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  critico: 'Crítico',
  alta: 'Alta',
  media: 'Media',
  sin_info: 'Sin información',
  abastecido: 'Abastecido',
}

export function UrgencyPill({ urgency }: { urgency: UrgencyLevel }) {
  return (
    <Badge variant={urgency}>
      {URGENCY_LABELS[urgency]}
    </Badge>
  )
}
