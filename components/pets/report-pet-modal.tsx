'use client'

import { useState } from 'react'
import { PawPrint, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PetForm } from './pet-form'

export function ReportPetModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <PawPrint className="h-4 w-4" aria-hidden="true" />
        Reportar mascota perdida
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Reportar mascota perdida"
        >
          <div
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-surface border border-line rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-line px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-gold" aria-hidden="true" />
                <h2 className="font-archivo font-semibold text-ink text-sm">
                  Reportar mascota perdida
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted hover:text-ink transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <PetForm onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
