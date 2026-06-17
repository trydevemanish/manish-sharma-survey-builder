export function UseCasesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">Use cases</p>
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Designed for every survey workflow.
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Whether you need quick customer feedback, product research, or team pulse surveys, the editor adapts to your needs with clean, fast interactions.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xl font-semibold text-slate-900">Customer feedback</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Collect insights from visitors and customers with a beautiful shareable link.
            </p>
          </div>
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xl font-semibold text-slate-900">Event registration</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Register attendees quickly with responsive fields and live validation.
            </p>
          </div>
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xl font-semibold text-slate-900">Team surveys</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use forms to gather feedback from colleagues and share results instantly.
            </p>
          </div>
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xl font-semibold text-slate-900">Recruiting intake</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Collect candidate details, resumes, and files in a polished experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
