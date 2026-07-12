const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with simple surveys.',
    features: ['1 active survey', 'Basic question types', 'Unlimited responses'],
    featured: false,
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For teams that want more control and polish.',
    features: ['Unlimited surveys', 'Advanced branding', 'Analytics + export'],
    featured: true,
  },
  {
    name: 'Custom',
    price: 'Custom',
    description: 'Tailored for organizations with unique needs.',
    features: ['SAML / SSO', 'Dedicated onboarding', 'Priority support'],
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">Pricing</p>
        <h2 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          Choose the plan that fits your workflow
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Start simple, scale with confidence, and unlock enterprise-grade features when you need them.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-8 shadow-sm ${
              plan.featured
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              {plan.featured ? (
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                  Popular
                </span>
              ) : null}
            </div>
            <p className={`mt-4 text-sm leading-7 ${plan.featured ? 'text-indigo-100' : 'text-slate-600'}`}>
              {plan.description}
            </p>
            <div className="mt-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.price !== 'Custom' ? <span className="ml-2 text-sm opacity-80">/month</span> : null}
            </div>
            <ul className={`mt-6 space-y-3 text-sm ${plan.featured ? 'text-indigo-50' : 'text-slate-600'}`}>
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${plan.featured ? 'bg-white' : 'bg-indigo-600'}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
