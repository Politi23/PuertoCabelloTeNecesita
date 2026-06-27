'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function validateForm(email: string, password: string): string | null {
  if (!email.trim()) return 'El correo es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Escribe un correo válido.'
  if (!password) return 'La contraseña es obligatoria.'
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  return null
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const formError = validateForm(email, password)
    if (formError) {
      if (formError.includes('correo')) setErrors({ email: formError })
      else setErrors({ password: formError })
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (error) {
      setErrors({ form: 'Correo o contraseña incorrectos.' })
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })) }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-crit">{errors.email}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })) }}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-crit">{errors.password}</p>
        )}
      </div>
      {errors.form && <p className="text-sm text-crit">{errors.form}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
