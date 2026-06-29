'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, ShieldCheck, ShieldOff, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UrgencyPill } from './urgency-pill'
import {
  updateLocationUrgency,
  updateLocationVerification,
  addLocationNeed,
  deleteLocationNeed,
} from '@/app/admin/actions'
import type { LocationWithNeeds, UrgencyLevel, NeedKind } from '@/types/database'

const URGENCY_OPTIONS: UrgencyLevel[] = ['critico', 'alta', 'media', 'abastecido']

export function LocationEditor({ locations }: { locations: LocationWithNeeds[] }) {
  const [selectedId, setSelectedId] = useState<string>(locations[0]?.id ?? '')
  const [newItem, setNewItem] = useState('')
  const [newKind, setNewKind] = useState<NeedKind>('necesita')
  const [highPriority, setHighPriority] = useState(false)
  const [saving, setSaving] = useState(false)
  const [itemError, setItemError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Verification state (local, synced from selected location)
  const [verifiedSource, setVerifiedSource] = useState('')

  const location = locations.find((l) => l.id === selectedId)

  // Sync verifiedSource and reset confirmDelete when switching locations
  useEffect(() => {
    setVerifiedSource(location?.verified_source ?? '')
    setConfirmDeleteId(null)
  }, [selectedId, location?.verified_source])

  const handleUrgencyChange = async (urgency: UrgencyLevel) => {
    if (!location) return
    setSaving(true)
    const result = await updateLocationUrgency(location.id, urgency)
    if (result.error) toast.error(result.error)
    else toast.success('Urgencia actualizada.')
    setSaving(false)
  }

  const handleVerificationToggle = async () => {
    if (!location) return
    const newVerified = !location.is_verified
    if (newVerified && !verifiedSource.trim()) {
      toast.error('Escribe la fuente de verificación antes de marcar como verificado.')
      return
    }
    setSaving(true)
    const result = await updateLocationVerification(
      location.id,
      newVerified,
      newVerified ? verifiedSource.trim() : null
    )
    if (result.error) toast.error(result.error)
    else toast.success(newVerified ? 'Lugar marcado como verificado.' : 'Verificación removida.')
    setSaving(false)
  }

  const handleSaveSource = async () => {
    if (!location || !location.is_verified) return
    setSaving(true)
    const result = await updateLocationVerification(location.id, true, verifiedSource.trim() || null)
    if (result.error) toast.error(result.error)
    else toast.success('Fuente actualizada.')
    setSaving(false)
  }

  const handleAddNeed = async () => {
    if (!location) return
    const trimmed = newItem.trim()
    if (trimmed.length < 2) {
      setItemError('Escribe al menos 2 caracteres')
      return
    }
    if (trimmed.length > 200) {
      setItemError('Máximo 200 caracteres')
      return
    }
    setItemError('')
    setSaving(true)
    const result = await addLocationNeed(location.id, trimmed, newKind, highPriority)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Necesidad añadida.')
      setNewItem('')
      setHighPriority(false)
    }
    setSaving(false)
  }

  const handleDeleteNeed = async (needId: string) => {
    if (!location) return
    if (confirmDeleteId !== needId) {
      setConfirmDeleteId(needId)
      return
    }
    setConfirmDeleteId(null)
    const result = await deleteLocationNeed(needId, location.id)
    if (result.error) toast.error(result.error)
    else toast.success('Necesidad eliminada.')
  }

  return (
    <div className="space-y-6">
      {/* Seleccionar lugar */}
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un lugar" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              <span className="flex items-center gap-2">
                {loc.name}
                {loc.is_verified && (
                  <ShieldCheck className="h-3.5 w-3.5 text-ok" aria-hidden="true" />
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {location && (
        <>
          {/* Verificación */}
          <div className="space-y-2 border border-line rounded-lg p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Verificación
              </p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  location.is_verified
                    ? 'text-ok bg-ok/10 border-ok/30'
                    : 'text-muted bg-surface border-line'
                }`}
              >
                {location.is_verified ? 'Verificado' : 'Sin verificar'}
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Fuente: ej. Dirección del hospital"
                value={verifiedSource}
                onChange={(e) => setVerifiedSource(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && location.is_verified && handleSaveSource()}
                className="flex-1"
              />
              {location.is_verified && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSaveSource}
                  disabled={saving || verifiedSource === (location.verified_source ?? '')}
                >
                  Guardar
                </Button>
              )}
            </div>

            <Button
              size="sm"
              variant={location.is_verified ? 'outline' : 'default'}
              onClick={handleVerificationToggle}
              disabled={saving}
              className="w-full gap-2"
            >
              {location.is_verified ? (
                <>
                  <ShieldOff className="h-4 w-4" aria-hidden="true" />
                  Quitar verificación
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Marcar como verificado
                </>
              )}
            </Button>
          </div>

          {/* Urgencia */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Urgencia</p>
            <div className="flex flex-wrap gap-2">
              {URGENCY_OPTIONS.map((u) => (
                <button
                  key={u}
                  onClick={() => handleUrgencyChange(u)}
                  disabled={saving}
                  className={`rounded-full border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    location.urgency === u
                      ? 'opacity-100 ring-2 ring-gold ring-offset-1 ring-offset-bg'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                  aria-pressed={location.urgency === u}
                >
                  <UrgencyPill urgency={u} />
                </button>
              ))}
            </div>
          </div>

          {/* Necesidades actuales */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Necesidades actuales
            </p>
            {location.location_needs.length === 0 ? (
              <p className="text-sm text-muted italic">Sin necesidades registradas.</p>
            ) : (
              <ul className="divide-y divide-line/40">
                {location.location_needs.map((n) => (
                  <li key={n.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <span className={`min-w-0 ${n.kind === 'no_necesita' ? 'line-through text-muted' : 'text-ink'}`}>
                      {n.item}
                      {n.high_priority && (
                        <span className="ml-1.5 text-xs text-crit font-medium">(prioridad)</span>
                      )}
                    </span>
                    {confirmDeleteId === n.id ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDeleteNeed(n.id)}
                          className="flex items-center gap-1 text-xs text-crit border border-crit/30 bg-crit/10 hover:bg-crit/20 rounded px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          aria-label={`Confirmar eliminar "${n.item}"`}
                        >
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          Eliminar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-muted hover:text-ink p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          aria-label="Cancelar"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteNeed(n.id)}
                        className="text-muted hover:text-crit transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold shrink-0"
                        aria-label={`Eliminar "${n.item}"`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Agregar necesidad */}
          <div className="space-y-3 border border-line rounded-lg p-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Agregar necesidad
            </p>
            <div className="space-y-1">
              <Input
                placeholder="Ej: Antibióticos, Sillas de ruedas..."
                value={newItem}
                onChange={(e) => { setNewItem(e.target.value); if (itemError) setItemError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNeed()}
                aria-invalid={!!itemError}
                aria-describedby={itemError ? 'item-error' : undefined}
              />
              {itemError && (
                <p id="item-error" className="text-xs text-crit">{itemError}</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <Select value={newKind} onValueChange={(v) => setNewKind(v as NeedKind)}>
                <SelectTrigger className="w-auto flex-1 min-w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="necesita">Necesita</SelectItem>
                  <SelectItem value="no_necesita">Ya no necesita</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex items-center gap-1.5 text-sm text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={highPriority}
                  onChange={(e) => setHighPriority(e.target.checked)}
                  className="accent-crit"
                />
                Alta prioridad
              </label>
              <Button
                size="sm"
                onClick={handleAddNeed}
                disabled={saving || !newItem.trim()}
                className="gap-1 shrink-0"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Agregar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
