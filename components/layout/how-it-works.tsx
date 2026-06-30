import { MapPin, Send, PawPrint, ShieldCheck, ChevronDown, HelpCircle } from 'lucide-react'

const STEPS = [
  {
    icon: MapPin,
    title: 'Mira qué necesita cada lugar',
    desc: 'En "Lugares principales" ves lo que cada sitio necesita ahora y lo que ya no. El color indica la urgencia: rojo es crítico, verde es abastecido, gris es sin información confirmada.',
  },
  {
    icon: Send,
    title: 'Pide ayuda',
    desc: 'Si necesitas algo o conoces a alguien que sí, toca "Enviar petición". Tu contacto queda privado: solo lo ve el coordinador, salvo que autorices mostrarlo.',
  },
  {
    icon: PawPrint,
    title: 'Reporta una mascota perdida',
    desc: 'Sube una foto y tus datos de contacto. Así, quien la vea puede avisarte directamente.',
  },
]

export function HowItWorks() {
  return (
    <details className="group bg-surface border border-line rounded-xl overflow-hidden" open>
      <summary className="flex items-center gap-2 p-4 sm:p-5 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl">
        <HelpCircle className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
        <span className="font-archivo font-semibold text-ink text-base sm:text-lg">
          ¿Cómo funciona?
        </span>
        <ChevronDown
          className="h-4 w-4 text-muted ml-auto shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="px-4 sm:px-5 pb-5 pt-0 -mt-1">
        <ol className="space-y-4">
          {STEPS.map((step) => (
            <li key={step.title} className="flex gap-3">
              <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                <step.icon className="h-4 w-4 text-gold" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-ink text-sm sm:text-base leading-snug">
                  {step.title}
                </p>
                <p className="text-sm text-muted leading-relaxed mt-0.5">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex items-start gap-2 mt-5 pt-4 border-t border-line/60">
          <ShieldCheck className="h-4 w-4 text-ok shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-muted leading-relaxed">
            <span className="text-ink font-medium">Nada se publica sin revisión.</span> Un
            coordinador revisa cada petición y cada reporte antes de que aparezca en la página. La
            confianza es lo más importante.
          </p>
        </div>
      </div>
    </details>
  )
}
