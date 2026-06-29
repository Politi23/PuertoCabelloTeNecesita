import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PendingItem } from '@/components/requests/pending-item'
import { ActiveItem } from '@/components/requests/active-item'
import { LocationEditor } from '@/components/locations/location-editor'
import { PendingPetItem } from '@/components/pets/pending-pet-item'
import { Separator } from '@/components/ui/separator'
import { LogoutButton } from './logout-button'
import { Anchor, InboxIcon, MapPin, ClipboardList, PawPrint } from 'lucide-react'
import type { Request, LocationWithNeeds, LostPet } from '@/types/database'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const [{ data: pendingData }, { data: activeData }, { data: locationsData }, { data: pendingPetsData }] = await Promise.all([
    supabase
      .from('requests')
      .select('*')
      .eq('status', 'pendiente')
      .order('created_at', { ascending: true }),
    supabase
      .from('requests')
      .select('*')
      .in('status', ['aprobada', 'en_proceso'])
      .eq('is_public', true)
      .order('created_at', { ascending: true }),
    supabase
      .from('locations')
      .select('*, location_needs(*)')
      .order('name'),
    supabase
      .from('lost_pets')
      .select('*')
      .eq('is_public', false)
      .order('created_at', { ascending: true }),
  ])

  const pending = (pendingData ?? []) as Request[]
  const active = (activeData ?? []) as Request[]
  const locations = (locationsData ?? []) as LocationWithNeeds[]
  const pendingPets = (pendingPetsData ?? []) as LostPet[]

  return (
    <div className="min-h-screen">
      {/* Header admin */}
      <header className="border-b border-line bg-surface/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-container xl:max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Anchor className="h-5 w-5 text-gold shrink-0" aria-hidden="true" />
            <span className="font-archivo font-semibold text-ink text-sm truncate">
              Panel coordinador
            </span>
            {pending.length > 0 && (
              <span className="ml-1 text-xs font-medium text-crit bg-crit/10 border border-crit/20 rounded-full px-2 py-0.5 shrink-0">
                {pending.length} pendiente{pending.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-container xl:max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">

        {/* Bandeja de pendientes */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <InboxIcon className="h-5 w-5 text-muted" aria-hidden="true" />
            <h1 className="font-archivo text-xl sm:text-2xl font-semibold text-ink">
              Peticiones pendientes
            </h1>
          </div>
          <p className="text-sm text-muted mb-5 ml-7">
            {pending.length === 0
              ? 'Sin peticiones pendientes de revisión.'
              : `${pending.length} petición${pending.length > 1 ? 'es' : ''} esperando revisión.`}
          </p>

          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-line rounded-xl">
              <InboxIcon className="h-8 w-8 text-muted/30 mb-3" aria-hidden="true" />
              <p className="text-muted font-medium">Bandeja vacía</p>
              <p className="text-sm text-muted/60 mt-1">
                Cuando alguien envíe una petición aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pending.map((req) => (
                <PendingItem key={req.id} request={req} />
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Peticiones activas en el tablero */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="h-5 w-5 text-muted" aria-hidden="true" />
            <h2 className="font-archivo text-xl sm:text-2xl font-semibold text-ink">
              Peticiones en el tablero
            </h2>
          </div>
          <p className="text-sm text-muted mb-5 ml-7">
            {active.length === 0
              ? 'No hay peticiones publicadas actualmente.'
              : `${active.length} petición${active.length > 1 ? 'es' : ''} visible${active.length > 1 ? 's' : ''} al público. Márcalas como resueltas cuando la ayuda llegue.`}
          </p>

          {active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-line rounded-xl">
              <ClipboardList className="h-8 w-8 text-muted/30 mb-3" aria-hidden="true" />
              <p className="text-muted font-medium">Sin peticiones publicadas</p>
              <p className="text-sm text-muted/60 mt-1">
                Las peticiones aprobadas aparecerán aquí para que puedas gestionarlas.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {active.map((req) => (
                <ActiveItem key={req.id} request={req} />
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Mascotas pendientes */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <PawPrint className="h-5 w-5 text-muted" aria-hidden="true" />
            <h2 className="font-archivo text-xl sm:text-2xl font-semibold text-ink">
              Mascotas perdidas pendientes
            </h2>
            {pendingPets.length > 0 && (
              <span className="ml-1 text-xs font-medium text-crit bg-crit/10 border border-crit/20 rounded-full px-2 py-0.5 shrink-0">
                {pendingPets.length}
              </span>
            )}
          </div>
          <p className="text-sm text-muted mb-5 ml-7">
            {pendingPets.length === 0
              ? 'Sin reportes pendientes de revisión.'
              : `${pendingPets.length} reporte${pendingPets.length > 1 ? 's' : ''} esperando revisión.`}
          </p>
          {pendingPets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-line rounded-xl">
              <PawPrint className="h-8 w-8 text-muted/30 mb-3" aria-hidden="true" />
              <p className="text-muted font-medium">Sin reportes pendientes</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pendingPets.map((pet) => (
                <PendingPetItem key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Editor de lugares */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-muted" aria-hidden="true" />
            <h2 className="font-archivo text-xl sm:text-2xl font-semibold text-ink">
              Editor de lugares
            </h2>
          </div>
          <p className="text-sm text-muted mb-5 ml-7">
            Actualiza necesidades y nivel de urgencia. Los cambios se reflejan en tiempo real.
          </p>
          {locations.length === 0 ? (
            <p className="text-muted">No hay lugares registrados.</p>
          ) : (
            <div className="max-w-2xl">
              <LocationEditor locations={locations} />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
