import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { FeatureGrid } from '../components/landing/FeatureGrid'
import { Hero } from '../components/landing/Hero'
import { Button } from '../components/ui/Button'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold text-slate-900">Survey Builder</span>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="secondary" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </SignedIn>
        </div>
      </header>
      <Hero />
      <FeatureGrid />
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        Built for branded survey collection
      </footer>
    </div>
  )
}
