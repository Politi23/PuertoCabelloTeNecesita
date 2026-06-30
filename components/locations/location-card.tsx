import { ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UrgencyPill } from './urgency-pill'
import { NeedsList } from './needs-list'
import { FreshnessStamp } from './freshness-stamp'
import type { LocationWithNeeds, UrgencyLevel } from '@/types/database'

const urgencyStrip: Record<UrgencyLevel, string> = {
  critico: 'border-t-2 border-t-crit',
  alta: 'border-t-2 border-t-warn',
  media: 'border-t-2 border-t-warn/40',
  sin_info: 'border-t-2 border-t-muted/40',
  abastecido: 'border-t-2 border-t-ok',
}

export function LocationCard({ location, style }: { location: LocationWithNeeds; style?: React.CSSProperties }) {
  return (
    <Card
      className={`flex flex-col hover:border-muted/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 ${urgencyStrip[location.urgency]}`}
      style={style}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-base leading-snug">{location.name}</CardTitle>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{location.type}</p>
            {location.zone && (
              <p className="text-xs text-muted/60 mt-0.5">{location.zone}</p>
            )}
          </div>
          <div className="shrink-0 mt-0.5">
            <UrgencyPill urgency={location.urgency} />
          </div>
        </div>
        {location.is_verified && location.verified_source && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-line/50">
            <ShieldCheck className="h-3.5 w-3.5 text-ok shrink-0" aria-hidden="true" />
            <span className="text-xs text-ok font-medium">
              Verificado · {location.verified_source}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-3">
        <NeedsList needs={location.location_needs} />
      </CardContent>
      <div className="px-4 pb-3 pt-2 border-t border-line/40">
        <FreshnessStamp date={location.updated_at} />
      </div>
    </Card>
  )
}
