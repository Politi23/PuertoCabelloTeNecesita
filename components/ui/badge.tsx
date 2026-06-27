import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface border border-line text-ink',
        critico: 'bg-crit/15 text-crit border border-crit/30',
        alta: 'bg-warn/15 text-warn border border-warn/30',
        media: 'bg-warn/10 text-warn/80 border border-warn/20',
        abastecido: 'bg-ok/15 text-ok border border-ok/30',
        pendiente: 'bg-surface border border-line text-muted',
        aprobada: 'bg-ok/15 text-ok border border-ok/30',
        rechazada: 'bg-crit/15 text-crit border border-crit/30',
        en_proceso: 'bg-gold/15 text-gold border border-gold/30',
        resuelta: 'bg-ok/10 text-ok/70 border border-ok/20',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
