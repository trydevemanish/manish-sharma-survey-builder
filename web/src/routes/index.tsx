import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AboutSection } from '../components/landing/AboutSection'
import { FeatureGrid } from '../components/landing/FeatureGrid'
import { FeedbackSection } from '../components/landing/FeedbackSection'
import { LandingBanner } from '../components/landing/LandingBanner'
import { PartnerMarquee } from '../components/landing/PartnerMarquee'
import { UseCasesSection } from '../components/landing/UseCasesSection'
import { Button } from '../components/ui/Button'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="absolute inset-x-0 top-0 z-20 bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-white">Survey Mini</span>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <Button variant="ghost" size="sm" className="text-white border-white/20">
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-white border-white/20">
                  Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>
      <LandingBanner />
      <FeatureGrid />
      <UseCasesSection />
      <AboutSection />
      <FeedbackSection />
      <PartnerMarquee />

      <footer className="border-t border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:justify-between">
          <p>Built for fast feedback, branded surveys, and simple respondent collection.</p>
          <p className="mt-3 lg:mt-0">© 2026 Survey Builder</p>
        </div>
      </footer>
    </div>
  )
}
