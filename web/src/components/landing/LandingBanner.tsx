import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/Button'

export function LandingBanner() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 25%)',
        }}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative z-10 max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">
            Modern survey design
          </p>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            Create surveys that feel fast, polished, and delightful.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Launch branded forms, share public links, and collect responses in a single dashboard
            built for teams.
          </p>
          <div className="flex flex-wrap gap-3">
            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <Button size="md">Get started free</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard">
                <Button variant="secondary" size="md">
                  Go to dashboard
                </Button>
              </Link>
            </SignedIn>
            <a href="#feedback">
              <Button variant="ghost" size="md">
                See reviews
              </Button>
            </a>
          </div>
        </div>

        <div className="relative z-10 flex justify-center">
          <div className="w-full max-w-xl rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <div className="rounded-[1.75rem] bg-linear-to-br from-white/90 to-slate-100/70 p-6 text-slate-900 shadow-lg">
              <div className="mb-5 rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
                  Live form preview
                </p>
                <h2 className="mt-4 text-2xl font-semibold">Share in one click</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-900">What did you enjoy most?</p>
                  <p className="text-sm text-slate-500">Select all that apply</p>
                  <div className="mt-4 space-y-2">
                    {['Design', 'Speed', 'Flexibility'].map((label) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="h-4 w-4 rounded-full border border-slate-400 bg-white" />
                        <span className="text-sm text-slate-700">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5">
                  <p className="text-sm font-medium text-slate-900">Feedback message</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    “I love how easy it is to turn questions into a branded experience.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
