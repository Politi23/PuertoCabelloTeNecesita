'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { LocationCard } from './location-card'
import { MapPin } from 'lucide-react'
import type { LocationWithNeeds } from '@/types/database'

export function LocationsRealtime({
  initialLocations,
}: {
  initialLocations: LocationWithNeeds[]
}) {
  const [locations, setLocations] = useState(initialLocations)
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('locations-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'locations' },
        async () => {
          const { data } = await supabase
            .from('locations')
            .select('*, location_needs(*)')
            .order('urgency', { ascending: true })
          if (data) setLocations(data as LocationWithNeeds[])
          queryClient.invalidateQueries({ queryKey: ['locations'] })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'location_needs' },
        async () => {
          const { data } = await supabase
            .from('locations')
            .select('*, location_needs(*)')
            .order('urgency', { ascending: true })
          if (data) setLocations(data as LocationWithNeeds[])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, queryClient])

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-line rounded-lg">
        <MapPin className="h-8 w-8 text-muted/40 mb-3" aria-hidden="true" />
        <p className="text-muted font-medium">Sin lugares registrados aún</p>
        <p className="text-sm text-muted/60 mt-1 max-w-xs">
          El coordinador publicará la información en cuanto la tenga verificada.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
      {locations.map((loc, i) => (
        <LocationCard
          key={loc.id}
          location={loc}
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  )
}
