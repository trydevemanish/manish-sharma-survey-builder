import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/Button'

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Branded survey builder
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Create beautiful surveys your clients will love
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
        Build interactive forms, apply your brand, share a public link, and collect responses — all
        in one simple dashboard.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
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
    </section>
  )
}
