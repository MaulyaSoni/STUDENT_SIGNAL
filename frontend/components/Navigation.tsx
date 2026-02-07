'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartLine, 
  faUsers, 
  faCloudArrowUp, 
  faRightFromBracket, 
  faGraduationCap,
  faRobot
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: faChartLine },
    { href: '/students', label: 'Students', icon: faUsers },
    { href: '/predict', label: 'ML Prediction', icon: faRobot },
    { href: '/upload', label: 'Upload Data', icon: faCloudArrowUp },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md shadow-lg shadow-primary/10">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold flex items-center justify-center text-xl shadow-lg shadow-primary/50 group-hover:shadow-primary/80 transition-all duration-300 group-hover:scale-110">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <span className="font-heading font-bold text-xl hidden sm:inline text-shiny">
                EarlySignal.AI
              </span>
            </Link>
            <nav className="hidden md:flex gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'text-glow-yellow hover:text-foreground hover:bg-accent/50 transition-all duration-300 btn-animate',
                      pathname === link.href && 'text-shiny font-semibold bg-accent/30'
                    )}
                  >
                    <FontAwesomeIcon icon={link.icon} className="mr-2" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="hover-lift border-primary/50 hover:border-primary">
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
