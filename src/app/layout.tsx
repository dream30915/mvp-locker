import type { Metadata } from 'next'
import { Courier_Prime, Orbitron } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/CartContext'
import { AppLayout } from '@/components/layout/AppLayout'

const courier = Courier_Prime({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-courier' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata: Metadata = {
  title: 'MADE VIA PATH',
  description: 'Exclusive streetwear drops.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${courier.variable} ${orbitron.variable} font-courier antialiased text-white bg-background`}>
        <CartProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </CartProvider>
      </body>
    </html>
  )
}
