import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export function ProductCard({ product }: { product: Product }) {
    const imageSrc = product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'

    return (
        <Link href={`/product/${product.slug}`} className="group block text-center">
            <div className="relative mx-auto aspect-square w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={product.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="mt-6 flex flex-col gap-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-crtz-yellow group-hover:text-white">
                    {product.title}
                </h3>
                <p className="text-xs font-bold text-crtz-yellow">
                    THB {product.base_price.toLocaleString()}
                </p>
            </div>
        </Link>
    )
}
