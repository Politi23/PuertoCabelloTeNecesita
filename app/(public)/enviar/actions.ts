'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { requestSchema } from '@/lib/validations/request'
import type { RequestFormData } from '@/lib/validations/request'

// Module-level rate limiter: IP → list of timestamps
// Works across warm serverless instances; resets on cold start (acceptable for this scale)
const ipTimestamps = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000  // 10 minutes
const MAX_REQUESTS = 5             // max submissions per IP per window

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (ipTimestamps.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_REQUESTS) return true
  ipTimestamps.set(ip, [...recent, now])
  return false
}

export async function submitRequest(
  data: RequestFormData
): Promise<{ success: boolean; error?: string }> {
  const ip =
    headers().get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers().get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return {
      success: false,
      error: 'Demasiadas peticiones desde tu conexión. Espera unos minutos antes de intentar de nuevo.',
    }
  }

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
