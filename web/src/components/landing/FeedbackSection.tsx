const testimonials = [
  {
    quote: 'Survey Builder made it easy to launch customer feedback forms in minutes. The results look polished and the workflow is intuitive.',
    author: 'Sara Park',
    role: 'Product Lead, Pulse Labs',
  },
  {
    quote: 'Our team now ships surveys faster, and the branded forms have helped boost response rates. The dashboard keeps everything organized.',
    author: 'Amit Joshi',
    role: 'Growth Manager, MarketLoop',
  },
  {
    quote: 'The preview and publish experience feels modern and calm. It is exactly what we needed for our internal research and external campaigns.',
    author: 'Lina Martinez',
    role: 'Research Director, Brightline',
  },
]

export function FeedbackSection() {
  return (
    <section id="feedback" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">What users are saying</p>
        <h2 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Trusted feedback from teams like yours</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.author}
            className="group rounded-4xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-lg leading-8 text-slate-700">“{testimonial.quote}”</p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-semibold text-white">
                {testimonial.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{testimonial.author}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
