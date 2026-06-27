import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/providers'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Puerto Cabello Te Necesita',
  description:
    'Coordinación verificada de ayuda tras el terremoto en Puerto Cabello, Carabobo, Venezuela.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <Providers>
          {children}
          <Analytics />
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
