'use server'

import { createClient } from '@/lib/supabase/server'
import { requestSchema } from '@/lib/validations/request'
import type { RequestFormData } from '@/lib/validations/request'

export async function submitRequest(
  data: RequestFormData
): Promise<{ success: boolean; error?: string }> {
  const parsed = requestSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos. Revisa el formulario.' }
  }

  const supabase = createClient()
  const { error } = await supabase.from('requests').insert({
    category: parsed.data.category,
    zone: parsed.data.zone,
    description: parsed.data.description,
    contact: parsed.data.contact || null,
    contact_public: parsed.data.contact ? (parsed.data.contact_public ?? false) : false,
  })

  if (error) {
    console.error('Error al insertar petición:', error)
    return { success: false, error: 'No se pudo enviar. Intenta de nuevo en unos minutos.' }
  }

  return { success: true }
}
