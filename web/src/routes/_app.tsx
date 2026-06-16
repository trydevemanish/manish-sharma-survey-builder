import { useAuth } from '@clerk/clerk-react'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AppShell } from '../components/layout/AppShell'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/sign-in' })
    }
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-600">Loading...</div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
