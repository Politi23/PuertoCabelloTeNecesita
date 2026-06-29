import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  )
}
