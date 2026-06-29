import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-line mt-auto">
      <div className="max-w-container xl:max-w-container-xl 2xl:max-w-container-tv mx-auto px-4 sm:px-6 lg:px-8 min-h-14 py-3 flex items-center justify-between gap-x-4 gap-y-2 flex-wrap">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          aria-label="Inicio"
        >
          <Image
            src="/android-chrome-192x192.png"
            alt=""
            width={16}
            height={16}
            className="shrink-0 opacity-70"
            aria-hidden="true"
          />
          <span className="text-xs text-muted font-medium hidden sm:inline">
            Puerto Cabello Te Necesita
          </span>
        </Link>

        <a
          href="https://www.instagram.com/politiwebstudio/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-gold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded group"
        >
          <span className="text-muted/60 group-hover:text-muted transition-colors duration-150 hidden xs:inline sm:inline">
            Desarrollado por
          </span>
          <Instagram className="h-3 w-3 shrink-0 text-muted/60 group-hover:text-gold transition-colors duration-150" aria-hidden="true" />
          <span className="text-gold/80 group-hover:text-gold font-medium transition-colors duration-150">
            @politiwebstudio
          </span>
        </a>
      </div>
    </footer>
  )
}
