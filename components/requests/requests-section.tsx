'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { RequestCard } from './request-card'
import { REQUEST_CATEGORIES } from '@/types/database'
import type { PublicRequest } from '@/types/database'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

async function fetchPublicRequests(): Promise<PublicRequest[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('public_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export function RequestsSection({
  initialRequests,
}: {
  initialRequests: PublicRequest[]
}) {
  const [category, setCategory] = useState<string | null>(null)
  const { data: requests } = useQuery({
    queryKey: ['public_requests'],
    queryFn: fetchPublicRequests,
    initialData: initialRequests,
    refetchInterval: 60000,
  })

  const filtered = category ? requests.filter((r) => r.category === category) : requests

  return (
    <section>
      <h2 className="font-archivo text-xl 3xl:text-2xl font-semibold text-ink mb-4">
        Peticiones de la comunidad
      </h2>

      {/* Filtros: scroll horizontal en móvil, wrap en tablet+ */}
      <div className="overflow-x-auto scrollbar-none -mx-4 sm:mx-0 mb-5">
      <div
        className="flex gap-2 pb-1 px-4 sm:px-0 sm:flex-wrap w-max sm:w-auto"
        role="group"
        aria-label="Filtrar por categoría"
      >
        <button
          onClick={() => setCategory(null)}
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold active:scale-95',
            category === null
              ? 'bg-gold text-bg border-gold shadow-sm shadow-gold/20'
              : 'border-line text-muted hover:border-muted/40 hover:text-ink bg-transparent'
          )}
        >
          Todas
        </button>
        {REQUEST_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold active:scale-95',
              category === cat
                ? 'bg-gold text-bg border-gold shadow-sm shadow-gold/20'
                : 'border-line text-muted hover:border-muted/40 hover:text-ink bg-transparent'
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-line rounded-lg">
          <MessageSquare className="h-8 w-8 text-muted/40 mb-3" aria-hidden="true" />
          <p className="text-muted font-medium">
            {category
              ? `Sin peticiones en "${category}"`
              : 'Sin peticiones publicadas aún'}
          </p>
          <p className="text-sm text-muted/60 mt-1 max-w-xs">
            {category
              ? 'Prueba otra categoría o ve todas.'
              : 'Las peticiones aparecen aquí una vez que el coordinador las aprueba.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
          {filtered.map((req, i) => (
            <RequestCard
              key={req.id}
              request={req}
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
