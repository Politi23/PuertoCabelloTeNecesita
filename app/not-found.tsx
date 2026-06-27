import Link from 'next/link'
import { Anchor } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Anchor className="h-10 w-10 text-gold mx-auto mb-5" aria-hidden="true" />
      <h1 className="font-archivo text-2xl sm:text-3xl font-semibold text-ink mb-2 text-balance">
        Página no encontrada
      </h1>
      <p className="text-muted mb-8 max-w-xs">La dirección que buscas no existe.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-gold text-bg text-sm font-semibold h-10 px-6 hover:bg-gold/90 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
      >
        Volver al tablero
      </Link>
    </main>
  )
}
