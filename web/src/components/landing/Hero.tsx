import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/Button'

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <div className="rounded-4xl border border-slate-200 bg-white/90 px-8 py-16 shadow-2xl backdrop-blur-sm">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">
          Branded survey builder
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Create beautiful surveys your clients will love.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Build interactive forms, style them with your brand, publish a public link, and collect
          responses from any device.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <Button size="md">Get started free</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="md">Go to dashboard</Button>
            </Link>
          </SignedIn>
          <a href="#features">
            <Button variant="secondary" size="md">
              See features
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
