'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { lostPetSchema, type LostPetFormData } from '@/lib/validations/lost-pet'
import { submitLostPet } from '@/app/(public)/reportar-mascota/actions'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function PetForm({ onSuccess }: { onSuccess?: () => void }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LostPetFormData>({
    resolver: zodResolver(lostPetSchema),
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes (JPG, PNG, WEBP).')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('La imagen no puede superar los 5 MB.')
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload a Supabase Storage
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`
    const { data, error } = await supabase.storage.from('pet-photos').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error || !data) {
      toast.error('No se pudo subir la foto. Intenta de nuevo.')
      setPreview(null)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('pet-photos').getPublicUrl(data.path)
    setPhotoUrl(urlData.publicUrl)
    setValue('photo_url', urlData.publicUrl, { shouldValidate: true })
    setUploading(false)
  }

  const clearPhoto = () => {
    setPreview(null)
    setPhotoUrl(null)
    setValue('photo_url', '', { shouldValidate: false })
    if (fileRef.current) fileRef.current.value = ''
  }

  const onSubmit = async (data: LostPetFormData) => {
    const result = await submitLostPet(data)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Reporte enviado. Será revisado antes de publicarse.')
    reset()
    clearPhoto()
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Foto */}
      <div className="space-y-1.5">
        <Label>Foto de la mascota <span className="text-crit">*</span></Label>
        {preview ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-line bg-bg">
            <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-2 right-2 bg-bg/80 hover:bg-bg text-ink rounded-full p-1 transition-colors"
              aria-label="Quitar foto"
            >
              <X className="h-4 w-4" />
            </button>
            {uploading && (
              <div className="absolute inset-0 bg-bg/60 flex items-center justify-center gap-2 text-sm text-ink">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo...
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-video rounded-lg border-2 border-dashed border-line hover:border-gold/50 bg-surface flex flex-col items-center justify-center gap-2 text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ImagePlus className="h-8 w-8" aria-hidden="true" />
            <span className="text-sm">Toca para agregar una foto</span>
            <span className="text-xs text-muted/60">JPG, PNG o WEBP · máx. 5 MB</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input type="hidden" {...register('photo_url')} />
        {errors.photo_url && (
          <p className="text-xs text-crit">{errors.photo_url.message}</p>
        )}
      </div>

      {/* Nombre */}
      <div className="space-y-1.5">
        <Label htmlFor="pet-name">Nombre de la mascota <span className="text-crit">*</span></Label>
        <Input
          id="pet-name"
          placeholder="Ej: Rocky, Sin nombre..."
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-xs text-crit">{errors.name.message}</p>}
      </div>

      {/* Especie */}
      <div className="space-y-1.5">
        <Label>Especie <span className="text-crit">*</span></Label>
        <Select onValueChange={(v) => setValue('species', v as LostPetFormData['species'], { shouldValidate: true })}>
          <SelectTrigger aria-invalid={!!errors.species}>
            <SelectValue placeholder="Selecciona la especie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="perro">Perro</SelectItem>
            <SelectItem value="gato">Gato</SelectItem>
            <SelectItem value="ave">Ave</SelectItem>
            <SelectItem value="reptil">Reptil</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {errors.species && <p className="text-xs text-crit">{errors.species.message}</p>}
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <Label htmlFor="pet-desc">Descripción <span className="text-crit">*</span></Label>
        <Textarea
          id="pet-desc"
          placeholder="Color, tamaño, collar, señas particulares..."
          rows={3}
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="text-xs text-crit">{errors.description.message}</p>}
      </div>

      {/* Zona */}
      <div className="space-y-1.5">
        <Label htmlFor="pet-zone">Zona donde se perdió <span className="text-crit">*</span></Label>
        <Input
          id="pet-zone"
          placeholder="Ej: Sector Las Morochas, av. Soublette..."
          {...register('zone')}
          aria-invalid={!!errors.zone}
        />
        {errors.zone && <p className="text-xs text-crit">{errors.zone.message}</p>}
      </div>

      {/* Contacto */}
      <div className="space-y-1.5">
        <Label htmlFor="pet-contact">
          Contacto para reportar avistamientos <span className="text-crit">*</span>
        </Label>
        <Input
          id="pet-contact"
          placeholder="Teléfono, WhatsApp o nombre con número..."
          {...register('contact')}
          aria-invalid={!!errors.contact}
        />
        <p className="text-xs text-muted">
          Este contacto será visible al público para que puedan reportarte si la ven.
        </p>
        {errors.contact && <p className="text-xs text-crit">{errors.contact.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || uploading}
      >
        {isSubmitting ? 'Enviando...' : 'Reportar mascota perdida'}
      </Button>

      <p className="text-xs text-muted text-center">
        El reporte será revisado por el coordinador antes de publicarse.
      </p>
    </form>
  )
}
