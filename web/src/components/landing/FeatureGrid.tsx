import { Card } from '../ui/Card'

const features = [
  {
    title: 'Visual builder',
    description: 'Add, remove, and reorder questions with six field types including file uploads.',
  },
  {
    title: 'Per-survey branding',
    description: 'Set a primary color and logo so every public survey feels on-brand.',
  },
  {
    title: 'Share & collect',
    description: 'Send a public link — respondents fill it in without signing in.',
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-5xl px-6 pb-20">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6">
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
