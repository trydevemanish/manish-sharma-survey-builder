import { SignOutButton, UserButton } from '@clerk/clerk-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from '../ui/Button'

const navItems = [{ to: '/dashboard', label: 'Dashboard' }]

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <Link to="/dashboard" className="text-lg font-semibold text-slate-900">
          Survey Builder
        </Link>
        <p className="mt-1 text-xs text-slate-500">Create branded surveys</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-3 border-t border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">Account</p>
            <p className="text-xs text-slate-500">Profile & settings</p>
          </div>
        </div>
        <SignOutButton>
          <Button variant="secondary" size="sm" className="w-full">
            Sign out
          </Button>
        </SignOutButton>
      </div>
    </aside>
  )
}
