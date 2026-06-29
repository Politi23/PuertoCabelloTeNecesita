import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://puertocabellotenecesita.vercel.app',
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: 'https://puertocabellotenecesita.vercel.app/enviar',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
