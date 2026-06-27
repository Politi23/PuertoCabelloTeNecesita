'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('GlobalError:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertTriangle className="h-10 w-10 text-warn mx-auto" aria-hidden="true" />
        <h1 className="font-archivo text-xl font-semibold text-ink">
          Algo salió mal
        </h1>
        <p className="text-muted text-sm">
          Ocurrió un error inesperado. Puedes intentar recargar la página.
        </p>
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reintentar
        </Button>
      </div>
    </div>
  )
}
