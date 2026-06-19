const partners = ['Acme', 'Pulse', 'LaunchCo', 'Brightline', 'SurveyPro', 'MetricLab']

export function PartnerMarquee() {
  return (
    <section className="border-t border-slate-200 bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Used by modern teams</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Companies that trust the forms experience
          </h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 px-4 py-5">
          <div className="flex animate-marquee items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
            {partners.map((company) => (
              <span
                key={company}
                className="inline-flex min-w-[14rem] items-center justify-center rounded-full border border-slate-700 bg-white/5 px-6 py-3 shadow-sm"
              >
                {company}
              </span>
            ))}
            {partners.map((company) => (
              <span
                key={`repeat-${company}`}
                className="inline-flex min-w-[14rem] items-center justify-center rounded-full border border-slate-700 bg-white/5 px-6 py-3 shadow-sm"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
