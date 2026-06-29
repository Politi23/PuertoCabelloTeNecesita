import { Header } from '@/components/layout/header'
import { RequestForm } from '@/components/requests/request-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Enviar petición — Puerto Cabello Te Necesita',
}

export default function EnviarPage() {
  return (
    <>
      <Header />
      <main className="w-full min-w-0 max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors duration-150 mb-6 focus-visible:ring-2 focus-visible:ring-gold rounded"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al tablero
        </Link>

        <div className="max-w-xl mx-auto lg:mx-0 xl:mx-auto">
          <h1 className="font-archivo text-2xl sm:text-3xl font-semibold text-ink mb-2">
            Enviar petición de ayuda
          </h1>
          <p className="text-muted text-sm sm:text-base mb-8 max-w-prose">
            Tu petición será revisada por el coordinador antes de aparecer en el tablero público.
            Solo se publica lo que se puede verificar.
          </p>
          <RequestForm />
        </div>
      </main>
    </>
  )
}
