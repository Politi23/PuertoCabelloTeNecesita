'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  uuidSchema,
  urgencySchema,
  needKindSchema,
  needItemSchema,
} from '@/lib/validations/request'
import type { UrgencyLevel, NeedKind, RequestStatus } from '@/types/database'

async function getAdminUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

// ─── Requests ────────────────────────────────────────────────────────────────

export async function approveRequest(requestId: string, contactPublic: boolean) {
  try {
    if (!uuidSchema.safeParse(requestId).success) return { error: 'ID de petición inválido' }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const { error } = await supabase
      .from('requests')
      .update({
        status: 'aprobada',
        is_public: true,
        contact_public: contactPublic === true,
        approved_by: userId,
      })
      .eq('id', requestId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('approveRequest error:', err)
    return { error: 'Error inesperado al aprobar la petición.' }
  }
}

export async function rejectRequest(requestId: string) {
  try {
    if (!uuidSchema.safeParse(requestId).success) return { error: 'ID de petición inválido' }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const { error } = await supabase
      .from('requests')
      .update({ status: 'rechazada', is_public: false, approved_by: userId })
      .eq('id', requestId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('rejectRequest error:', err)
    return { error: 'Error inesperado al rechazar la petición.' }
  }
}

export async function updateRequestStatus(requestId: string, status: RequestStatus) {
  try {
    if (!uuidSchema.safeParse(requestId).success) return { error: 'ID de petición inválido' }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const isPublic = ['aprobada', 'en_proceso'].includes(status)
    const { error } = await supabase
      .from('requests')
      .update({ status, is_public: isPublic, approved_by: userId })
      .eq('id', requestId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('updateRequestStatus error:', err)
    return { error: 'Error inesperado al cambiar el estado.' }
  }
}

export async function resolveAndHideRequest(requestId: string) {
  try {
    if (!uuidSchema.safeParse(requestId).success) return { error: 'ID de petición inválido' }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const { error } = await supabase
      .from('requests')
      .update({ status: 'resuelta', is_public: false, approved_by: userId })
      .eq('id', requestId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('resolveAndHideRequest error:', err)
    return { error: 'Error inesperado al resolver la petición.' }
  }
}

// ─── Locations ───────────────────────────────────────────────────────────────

export async function updateLocationUrgency(locationId: string, urgency: UrgencyLevel) {
  try {
    if (!uuidSchema.safeParse(locationId).success) return { error: 'ID de lugar inválido' }
    if (!urgencySchema.safeParse(urgency).success) return { error: 'Nivel de urgencia inválido' }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const { error } = await supabase
      .from('locations')
      .update({ urgency, updated_by: userId, updated_at: new Date().toISOString() })
      .eq('id', locationId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('updateLocationUrgency error:', err)
    return { error: 'Error inesperado al actualizar la urgencia.' }
  }
}

export async function updateLocationVerification(
  locationId: string,
  isVerified: boolean,
  verifiedSource: string | null
) {
  try {
    if (!uuidSchema.safeParse(locationId).success) return { error: 'ID de lugar inválido' }
    if (isVerified && (!verifiedSource || verifiedSource.trim().length < 2)) {
      return { error: 'Escribe la fuente de verificación antes de marcar como verificado' }
    }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const { error } = await supabase
      .from('locations')
      .update({
        is_verified: isVerified,
        verified_source: isVerified ? verifiedSource : null,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', locationId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('updateLocationVerification error:', err)
    return { error: 'Error inesperado al actualizar la verificación.' }
  }
}

export async function addLocationNeed(
  locationId: string,
  item: string,
  kind: NeedKind,
  highPriority: boolean
) {
  try {
    if (!uuidSchema.safeParse(locationId).success) return { error: 'ID de lugar inválido' }
    const itemResult = needItemSchema.safeParse(item)
    if (!itemResult.success) return { error: itemResult.error.errors[0].message }
    if (!needKindSchema.safeParse(kind).success) return { error: 'Tipo de necesidad inválido' }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const { error: needError } = await supabase.from('location_needs').insert({
      location_id: locationId,
      item: itemResult.data,
      kind,
      high_priority: highPriority === true,
    })
    if (needError) return { error: needError.message }

    await supabase
      .from('locations')
      .update({ updated_by: userId, updated_at: new Date().toISOString() })
      .eq('id', locationId)

    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('addLocationNeed error:', err)
    return { error: 'Error inesperado al agregar la necesidad.' }
  }
}

export async function deleteLocationNeed(needId: string, locationId: string) {
  try {
    if (!uuidSchema.safeParse(needId).success) return { error: 'ID de necesidad inválido' }
    if (!uuidSchema.safeParse(locationId).success) return { error: 'ID de lugar inválido' }
    const userId = await getAdminUserId()
    if (!userId) return { error: 'No autorizado' }

    const supabase = createClient()
    const { error } = await supabase.from('location_needs').delete().eq('id', needId)
    if (error) return { error: error.message }

    await supabase
      .from('locations')
      .update({ updated_by: userId, updated_at: new Date().toISOString() })
      .eq('id', locationId)

    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('deleteLocationNeed error:', err)
    return { error: 'Error inesperado al eliminar la necesidad.' }
  }
}

export async function signOut() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/admin')
  } catch {
    // sign out best-effort
  }
}
