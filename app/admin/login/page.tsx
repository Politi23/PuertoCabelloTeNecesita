import { LoginForm } from './login-form'
import Image from 'next/image'

export const metadata = {
  title: 'Acceso coordinador — Puerto Cabello Te Necesita',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Image src="/android-chrome-192x192.png" alt="" width={32} height={32} className="mx-auto mb-3" aria-hidden="true" />
          <h1 className="font-archivo text-xl font-semibold text-ink">Acceso coordinador</h1>
          <p className="text-sm text-muted mt-1">Puerto Cabello Te Necesita</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
