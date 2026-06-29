import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="border-b border-line bg-surface/90 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-container xl:max-w-container-xl 2xl:max-w-container-tv mx-auto px-4 sm:px-6 lg:px-8 h-14 3xl:h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-gold rounded min-w-0"
        >
          <Image src="/android-chrome-192x192.png" alt="" width={20} height={20} className="shrink-0 3xl:w-6 3xl:h-6" aria-hidden="true" />
          <span className="font-archivo font-semibold text-ink text-sm 3xl:text-base tracking-tight truncate">
            Puerto Cabello Te Necesita
          </span>
        </Link>
        <Link
          href="/enviar"
          className="shrink-0 text-xs sm:text-sm bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors duration-150 rounded-md px-3 py-1.5 font-medium focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          Enviar petición
        </Link>
      </div>
    </header>
  )
}
