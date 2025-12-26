import Link from 'next/link'
import { ShoppingCart, LogIn, User } from 'lucide-react'

export function Sidebar() {
    return (
        <div className="fixed left-0 top-0 hidden h-screen w-64 flex-col justify-between p-8 text-crtz-yellow md:flex">
            {/* HEADER LOGO */}
            <div>
                <Link href="/" className="mb-12 block text-2xl font-black tracking-widest text-white hover:text-gray-300 font-orbitron">
                    MVP
                </Link>

                {/* NAV LINKS */}
                <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest">
                    <Link href="/products" className="hover:text-white">Shop All</Link>
                    <Link href="/products?cat=tees" className="hover:text-white">T-Shirts</Link>
                    <Link href="/products?cat=hoodies" className="hover:text-white">Hoodies</Link>
                    <Link href="/products?cat=sweatshirts" className="hover:text-white">Sweatshirts</Link>
                    <Link href="/products?cat=pants" className="hover:text-white">Pants</Link>
                    <Link href="/products?cat=shorts" className="hover:text-white">Shorts</Link>
                    <Link href="/products?cat=jackets" className="hover:text-white">Jackets</Link>
                    <Link href="/products?cat=accessories" className="hover:text-white">Accessories</Link>
                </nav>
            </div>

            {/* FOOTER LINKS */}
            <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest">
                <Link href="/account" className="flex items-center gap-2 hover:text-white">
                    <User size={16} /> Account
                </Link>
                <Link href="/cart" className="flex items-center gap-2 hover:text-white">
                    <ShoppingCart size={16} /> Cart
                </Link>
                <div className="mt-4 border-t border-crtz-yellow pt-4 opacity-50">
                    <p>Shipping Policy</p>
                    <p>Terms of Service</p>
                </div>
            </div>
        </div>
    )
}
