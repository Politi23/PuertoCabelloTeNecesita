import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col w-full max-w-full overflow-x-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      <Footer />
    </div>
  )
}
