import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/enviar'],
        disallow: ['/admin'],
      },
    ],
    sitemap: 'https://puertocabellotenecesita.vercel.app/sitemap.xml',
  }
}
