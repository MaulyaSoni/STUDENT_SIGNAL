'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/students', label: 'Students' },
    { href: '/upload', label: 'Upload Data' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg">
                E
              </div>
              <span className="font-semibold text-xl hidden sm:inline">EarlySignal.AI</span>
            </Link>
            <nav className="hidden md:flex gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'text-muted-foreground hover:text-foreground',
                      pathname === link.href && 'text-foreground font-semibold'
                    )}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
