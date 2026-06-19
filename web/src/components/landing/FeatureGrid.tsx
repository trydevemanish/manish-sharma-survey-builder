import { Card } from '../ui/Card'

const features = [
  {
    id: 1,
    title: 'Visual builder',
    description: 'Add, remove, and reorder questions with six field types including file uploads.',
  },
  {
    id: 2,
    title: 'Per-survey branding',
    description: 'Set a primary color and logo so every public survey feels on-brand.',
  },
  {
    id: 3,
    title: 'Share & collect',
    description: 'Send a public link — respondents fill it in without signing in.',
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto mt-24 max-w-5xl px-6 pb-20">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">What we offer</p>
        <h2 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          What u are{' '}
          <span className="underline underline-offset-4 decoration-2 decoration-indigo-600">
            getting
          </span>{' '}
          ?
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="
              group relative overflow-hidden
              rounded-2xl p-6
              border border-slate-200/50
              bg-gradient-to-br from-slate-100 via-white to-slate-50
              transition-all duration-300 ease-out
              hover:-translate-y-2 hover:scale-[1.02]
              hover:border-sky-300
              hover:shadow-[0_20px_50px_rgba(6,12,2,0.15)]
              focus-within:ring-2 focus-within:ring-sky-400
            "
          >
            {/* Gradient Glow */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-slate-600">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
