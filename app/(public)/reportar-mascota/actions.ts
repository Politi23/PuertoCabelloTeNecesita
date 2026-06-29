'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { lostPetSchema } from '@/lib/validations/lost-pet'
import type { LostPetFormData } from '@/lib/validations/lost-pet'

const ipTimestamps = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (ipTimestamps.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_REQUESTS) return true
  ipTimestamps.set(ip, [...recent, now])
  return false
}

export async function submitLostPet(
  data: LostPetFormData
): Promise<{ success: boolean; error?: string }> {
  const ip =
    headers().get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers().get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return { success: false, error: 'Demasiados reportes desde tu conexión. Espera unos minutos.' }
  }

  const parsed = lostPetSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos. Revisa el formulario.' }
  }

  const supabase = createClient()
  const { error } = await supabase.from('lost_pets').insert({
    name: parsed.data.name,
    species: parsed.data.species,
    description: parsed.data.description,
    zone: parsed.data.zone,
    contact: parsed.data.contact,
    photo_url: parsed.data.photo_url,
  })

  if (error) {
    console.error('Error al insertar mascota:', error)
    return { success: false, error: 'No se pudo enviar. Intenta de nuevo en unos minutos.' }
  }

  return { success: true }
}
