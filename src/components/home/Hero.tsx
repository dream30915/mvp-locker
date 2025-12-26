import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-center bg-background">

            <div className="z-10 flex flex-col items-center gap-0 px-4">
                {/* Brand Logo - Maximized Size (+10 size boost) */}
                <div className="relative z-20 mb-0 h-40 w-40 md:h-64 md:w-64">
                    <Image
                        src="/logo-v2.png"
                        alt="Brand Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Text Image - FIX: Use standard img to respect intrinsic aspect ratio (Tight Fit) */}
                {/* Visual Fix: Negative margin to pull it closer to the logo (overcoming object-contain whitespace) */}
                <img
                    src="/mvp-text-v2.png"
                    alt="MADE VIA PATH"
                    className="relative z-10 h-auto w-[80vw] max-w-[600px] object-contain md:max-w-[800px]"
                />

                <p className="max-w-xl text-sm font-bold tracking-widest text-gray-400 sm:text-lg font-orbitron">
                    No Access Without Authorization.
                </p>

                <Link
                    href="/products"
                    className="group relative mt-8 flex h-14 w-56 items-center justify-center overflow-hidden border border-white bg-transparent text-white transition-all hover:bg-white hover:text-[#040f26]"
                >
                    <span className="flex items-center gap-2 text-xl font-bold uppercase tracking-widest font-orbitron">
                        Enter Shop
                    </span>
                </Link>
            </div>
        </section>
    )
}
