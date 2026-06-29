import { z } from 'zod'

const noHtml = (val: string) => !/<[^>]+>/.test(val)

export const lostPetSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres')
    .refine(noHtml, 'El texto no puede contener etiquetas HTML'),
  species: z.enum(['perro', 'gato', 'ave', 'reptil', 'otro'] as const, {
    required_error: 'Selecciona la especie',
  }),
  description: z
    .string()
    .min(10, 'Describe la mascota con al menos 10 caracteres (color, tamaño, señas particulares)')
    .max(500, 'Máximo 500 caracteres')
    .refine(noHtml, 'El texto no puede contener etiquetas HTML'),
  zone: z
    .string()
    .min(3, 'Indica la zona donde se perdió (mínimo 3 caracteres)')
    .max(200, 'Máximo 200 caracteres')
    .refine(noHtml, 'El texto no puede contener etiquetas HTML'),
  contact: z
    .string()
    .min(5, 'El contacto es obligatorio para que puedan reportar al animal')
    .max(200, 'Máximo 200 caracteres')
    .refine(noHtml, 'El contacto no puede contener etiquetas HTML'),
  photo_url: z.string().url('La foto es obligatoria'),
})

export type LostPetFormData = z.infer<typeof lostPetSchema>
