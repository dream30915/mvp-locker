import Link from 'next/link'
import { ShoppingCart, User, Menu } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-900 p-4 md:hidden bg-background">
            <div className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-widest text-white">
                    MVP★
                </Link>

                <div className="flex items-center gap-4 text-crtz-yellow">
                    <Link href="/cart"><ShoppingCart size={20} /></Link>
                    <Link href="/account"><User size={20} /></Link>
                    <button><Menu size={20} /></button>
                </div>
            </div>
        </nav>
    )
}
