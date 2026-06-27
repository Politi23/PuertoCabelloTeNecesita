'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from './actions'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  )
}
