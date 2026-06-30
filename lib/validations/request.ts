import { z } from 'zod'
import { REQUEST_CATEGORIES } from '@/types/database'

const noHtml = (val: string) => !/<[^>]+>/.test(val)

export const requestSchema = z.object({
  category: z.enum([...REQUEST_CATEGORIES] as [string, ...string[]], {
    required_error: 'Selecciona una categoría',
    invalid_type_error: 'Categoría inválida',
  }),
  zone: z
    .string()
    .min(3, 'Indica la zona o dirección (mínimo 3 caracteres)')
    .max(200, 'Máximo 200 caracteres')
    .refine(noHtml, 'El texto no puede contener etiquetas HTML'),
  description: z
    .string()
    .min(10, 'Describe la petición con al menos 10 caracteres')
    .max(1000, 'Máximo 1000 caracteres')
    .refine(noHtml, 'El texto no puede contener etiquetas HTML'),
  contact: z
    .string()
    .max(200, 'Máximo 200 caracteres')
    .refine(noHtml, 'El contacto no puede contener etiquetas HTML')
    .optional()
    .or(z.literal('')),
  contact_public: z.boolean().default(false),
})

export type RequestFormData = z.infer<typeof requestSchema>

// Validaciones para server actions del admin
export const uuidSchema = z.string().uuid('ID inválido')
export const urgencySchema = z.enum(['critico', 'alta', 'media', 'sin_info', 'abastecido'] as const, {
  invalid_type_error: 'Nivel de urgencia inválido',
})
export const needKindSchema = z.enum(['necesita', 'no_necesita'] as const, {
  invalid_type_error: 'Tipo de necesidad inválido',
})
export const needItemSchema = z
  .string()
  .min(2, 'El item debe tener al menos 2 caracteres')
  .max(200, 'Máximo 200 caracteres')
  .refine(noHtml, 'El texto no puede contener etiquetas HTML')

export const requestStatusSchema = z.enum(
  ['pendiente', 'aprobada', 'rechazada', 'en_proceso', 'resuelta'] as const,
  { invalid_type_error: 'Estado de petición inválido' }
)
