import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Image src="/android-chrome-192x192.png" alt="" width={40} height={40} className="mx-auto mb-5" aria-hidden="true" />
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
