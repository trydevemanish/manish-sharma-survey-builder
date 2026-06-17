export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">About us</p>
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Build surveys with confidence and speed.
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            We help teams design, publish, and analyze branded surveys without the overhead of complex tooling. Create forms that feel modern, simple, and delightful.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold text-slate-900">Design-first experience</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Drag, style, and publish surveys with a clean builder focused on ease of use.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold text-slate-900">Built for collaboration</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep your data organized, share links instantly, and track results in one dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
            alt="Working team reviewing survey analytics"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
