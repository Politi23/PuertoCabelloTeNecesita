export type UrgencyLevel = 'critico' | 'alta' | 'media' | 'abastecido'
export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada' | 'en_proceso' | 'resuelta'
export type NeedKind = 'necesita' | 'no_necesita'

export interface Profile {
  id: string
  full_name: string | null
  role: string
  created_at: string
}

export interface Location {
  id: string
  name: string
  type: string
  plus_code: string | null
  zone: string | null
  urgency: UrgencyLevel
  is_verified: boolean
  verified_source: string | null
  updated_by: string | null
  updated_at: string
  created_at: string
}

export interface LocationNeed {
  id: string
  location_id: string
  item: string
  kind: NeedKind
  high_priority: boolean
  created_at: string
}

export interface LocationWithNeeds extends Location {
  location_needs: LocationNeed[]
}

export interface Request {
  id: string
  category: string
  zone: string
  description: string
  contact: string | null
  contact_public: boolean
  status: RequestStatus
  is_public: boolean
  approved_by: string | null
  created_at: string
  updated_at: string
}

export interface PublicRequest {
  id: string
  category: string
  zone: string
  description: string
  status: RequestStatus
  contact: string | null
  created_at: string
  updated_at: string
}

export type PetSpecies = 'perro' | 'gato' | 'ave' | 'reptil' | 'otro'
export type PetStatus = 'perdido' | 'encontrado'

export interface LostPet {
  id: string
  name: string
  species: PetSpecies
  description: string
  zone: string
  contact: string
  photo_url: string
  status: PetStatus
  is_public: boolean
  approved_by: string | null
  created_at: string
  updated_at: string
}

export const PET_SPECIES_LABELS: Record<PetSpecies, string> = {
  perro: 'Perro',
  gato: 'Gato',
  ave: 'Ave',
  reptil: 'Reptil',
  otro: 'Otro',
}

export const REQUEST_CATEGORIES = [
  'Escombros',
  'Ropa',
  'Comida y agua',
  'Medicina',
  'Mudanza',
  'Refugio',
  'Voluntariado',
  'Otro',
] as const

export type RequestCategory = (typeof REQUEST_CATEGORIES)[number]
