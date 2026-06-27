import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { LocationsRealtime } from '@/components/locations/locations-realtime'
import { RequestsSection } from '@/components/requests/requests-section'
import { Separator } from '@/components/ui/separator'
import { formatRelativeTime } from '@/lib/utils'
import type { LocationWithNeeds, PublicRequest } from '@/types/database'
import Link from 'next/link'
import { ArrowRight, Activity } from 'lucide-react'

export const revalidate = 0

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: locationsData }, { data: requestsData }] = await Promise.all([
    supabase
      .from('locations')
      .select('*, location_needs(*)')
      .order('urgency', { ascending: true }),
    supabase
      .from('public_requests')
      .select('*')
      .order('created_at', { ascending: false }),
  ])

  const locations = (locationsData ?? []) as LocationWithNeeds[]
  const publicRequests = (requestsData ?? []) as PublicRequest[]

  const lastUpdated = locations.reduce<string | null>((latest, loc) => {
    if (!latest) return loc.updated_at
    return loc.updated_at > latest ? loc.updated_at : latest
  }, null)

  const critCount = locations.filter((l) => l.urgency === 'critico').length

  return (
    <>
      <Header />
      <main className="max-w-container xl:max-w-container-xl 2xl:max-w-container-tv mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 3xl:py-12 space-y-8 sm:space-y-10 3xl:space-y-14">

        {/* Franja de situación */}
        <section
          className="bg-surface border border-line rounded-xl p-4 sm:p-5 3xl:p-7"
          aria-label="Resumen de situación"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Estado actual
            </span>
            {critCount > 0 && (
              <span className="ml-auto text-xs font-medium text-crit bg-crit/10 border border-crit/20 rounded-full px-2.5 py-0.5">
                {critCount} crítico{critCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 3xl:gap-8">
            <div>
              <p className="font-mono text-3xl sm:text-4xl 3xl:text-5xl font-medium text-gold leading-none">
                {locations.length}
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1.5">Lugares monitoreados</p>
            </div>
            <div>
              <p className="font-mono text-3xl sm:text-4xl 3xl:text-5xl font-medium text-gold leading-none">
                {publicRequests.length}
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1.5">Peticiones activas</p>
            </div>
            <div className="col-span-2 sm:col-span-1 pt-3 sm:pt-0 border-t border-line/50 sm:border-t-0 sm:border-l sm:border-line/50 sm:pl-6">
              <p className="font-mono text-base sm:text-lg 3xl:text-xl font-medium text-ink leading-none">
                {lastUpdated ? formatRelativeTime(lastUpdated) : '—'}
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1.5">Última actualización</p>
            </div>
          </div>
        </section>

        {/* Lugares */}
        <section>
          <h2 className="font-archivo text-xl sm:text-2xl 3xl:text-3xl font-semibold text-ink mb-4 sm:mb-5">
            Lugares principales
          </h2>
          <LocationsRealtime initialLocations={locations} />
        </section>

        <Separator />

        {/* Peticiones */}
        <RequestsSection initialRequests={publicRequests} />

        {/* CTA */}
        <div className="text-center py-8 sm:py-10 border border-dashed border-line rounded-xl">
          <p className="text-muted text-sm 3xl:text-base mb-4 max-w-sm mx-auto">
            ¿Necesitas ayuda o conoces a alguien que la necesite?
          </p>
          <Link
            href="/enviar"
            className="inline-flex items-center gap-2 justify-center rounded-lg bg-gold text-bg text-sm 3xl:text-base font-semibold h-11 px-7 hover:bg-gold/90 active:scale-[0.97] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none shadow-md shadow-gold/20"
          >
            Enviar petición
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
    </>
  )
}
