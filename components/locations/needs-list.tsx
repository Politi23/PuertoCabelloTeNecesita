import { AlertTriangle, CheckCircle } from 'lucide-react'
import type { LocationNeed } from '@/types/database'

interface NeedsListProps {
  needs: LocationNeed[]
}

export function NeedsList({ needs }: NeedsListProps) {
  const needed = needs.filter((n) => n.kind === 'necesita')
  const notNeeded = needs.filter((n) => n.kind === 'no_necesita')

  if (needs.length === 0) {
    return (
      <p className="text-sm text-muted italic">
        Sin necesidades registradas aún.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {needed.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
            Necesita ahora
          </p>
          <ul className="space-y-1">
            {needed.map((n) => (
              <li key={n.id} className="flex items-start gap-2 text-sm text-ink">
                <AlertTriangle
                  className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                    n.high_priority ? 'text-crit' : 'text-warn'
                  }`}
                  aria-hidden="true"
                />
                <span className={n.high_priority ? 'font-medium' : ''}>{n.item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {notNeeded.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
            Ya no necesita
          </p>
          <ul className="space-y-1">
            {notNeeded.map((n) => (
              <li key={n.id} className="flex items-start gap-2 text-sm text-muted line-through">
                <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-ok" aria-hidden="true" />
                {n.item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
