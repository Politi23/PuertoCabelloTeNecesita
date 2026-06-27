'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { requestSchema, type RequestFormData } from '@/lib/validations/request'
import { REQUEST_CATEGORIES } from '@/types/database'
import { submitRequest } from '@/app/(public)/enviar/actions'

export function RequestForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { contact_public: false },
  })

  const contactValue = watch('contact')
  const contactPublic = watch('contact_public')
  const hasContact = !!contactValue && contactValue.trim().length > 0

  const onSubmit = async (data: RequestFormData) => {
    const result = await submitRequest(data)
    if (result.success) {
      setSubmitted(true)
      reset()
    } else {
      toast.error(result.error ?? 'Error al enviar la petición.')
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle className="h-12 w-12 text-ok mx-auto" aria-hidden="true" />
        <h2 className="font-archivo text-xl font-semibold text-ink">Petición recibida</h2>
        <p className="text-muted max-w-md mx-auto">
          Tu petición fue enviada al coordinador. Será revisada y, si se aprueba, aparecerá en el
          tablero público. El coordinador verá tu contacto; solo será visible al público si así
          lo indicaste.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Enviar otra petición
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Categoría */}
      <div className="space-y-1.5">
        <Label htmlFor="category">Categoría</Label>
        <Select onValueChange={(v) => setValue('category', v, { shouldValidate: true })}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {REQUEST_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-crit">{errors.category.message}</p>
        )}
      </div>

      {/* Zona */}
      <div className="space-y-1.5">
        <Label htmlFor="zone">Zona o dirección</Label>
        <Input
          id="zone"
          placeholder="Ej: Calle Bolívar, sector Cumboto Norte"
          {...register('zone')}
          aria-invalid={!!errors.zone}
        />
        {errors.zone && (
          <p className="text-xs text-crit">{errors.zone.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Describe qué se necesita, cuántas personas, situación actual..."
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-crit">{errors.description.message}</p>
        )}
      </div>

      {/* Contacto */}
      <div className="space-y-1.5">
        <Label htmlFor="contact" className="flex items-center gap-1.5">
          Contacto
          <span className="text-muted font-normal">(opcional)</span>
        </Label>
        <Input
          id="contact"
          type="text"
          placeholder="Teléfono, WhatsApp o nombre"
          {...register('contact')}
        />

        {/* Visibilidad del contacto — solo aparece si hay contacto */}
        {hasContact ? (
          <button
            type="button"
            onClick={() => setValue('contact_public', !contactPublic, { shouldValidate: false })}
            aria-pressed={contactPublic}
            className={`flex items-center gap-2 text-xs rounded-md px-3 py-2 border transition-all duration-150 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              contactPublic
                ? 'bg-ok/10 border-ok/30 text-ok'
                : 'bg-surface border-line text-muted hover:border-muted/40 hover:text-ink'
            }`}
          >
            {contactPublic ? (
              <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {contactPublic
                ? 'Contacto visible al público cuando se publique'
                : 'Contacto privado — solo lo ve el coordinador'}
            </span>
          </button>
        ) : (
          <p className="text-xs text-muted flex items-center gap-1">
            <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
            Tu contacto no se muestra al público por defecto, solo lo ve el coordinador.
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar petición'}
      </Button>

      <p className="text-xs text-muted text-center">
        Todas las peticiones son revisadas antes de publicarse.
      </p>
    </form>
  )
}
