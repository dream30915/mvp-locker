'use client'

import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { usePathname } from 'next/navigation'

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHomePage = pathname === '/'

    return (
        <div className="min-h-screen text-white bg-background">
            {!isHomePage && <Sidebar />}
            {!isHomePage && <Navbar />}
            <div className={!isHomePage ? "md:pl-64" : ""}>
                {children}
            </div>
        </div>
    )
}
