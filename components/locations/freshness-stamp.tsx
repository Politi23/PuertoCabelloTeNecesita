import { formatRelativeTime, isFresh } from '@/lib/utils'
import { Clock } from 'lucide-react'

export function FreshnessStamp({ date }: { date: string }) {
  const fresh = isFresh(date)
  return (
    <span
      className={`font-mono text-xs flex items-center gap-1 ${
        fresh ? 'text-ok' : 'text-warn'
      }`}
      title={new Date(date).toLocaleString('es-VE')}
    >
      <Clock className="h-3 w-3" aria-hidden="true" />
      Actualizado {formatRelativeTime(date)}
    </span>
  )
}
