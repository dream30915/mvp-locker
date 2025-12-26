import { createClient } from '@/utils/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { ProductActions } from '@/components/product/ProductActions'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    // 1. Fetch Product
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!product) return notFound()

    // 2. Fetch Variants
    const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id)
        .order('size', { ascending: true }) // Naive sort, ideally S,M,L logic needed

    // Image Helper
    const defaultImage = product.images?.[0] || 'https://via.placeholder.com/600'

    return (
        <main className="min-h-screen pb-20 bg-background">
            <Navbar />

            <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 md:grid-cols-2 lg:gap-24">
                {/* GALLERY */}
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square w-full overflow-hidden bg-crtz-grey">
                        <Image
                            src={defaultImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Thumbnails could go here */}
                </div>

                {/* DETAILS */}
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
                            {product.title}
                        </h1>
                        <p className="mt-4 text-2xl font-bold text-crtz-yellow">
                            THB {product.base_price.toLocaleString()}
                        </p>
                    </div>

                    <div className="prose prose-invert border-y border-gray-800 py-6">
                        <p>{product.description}</p>
                    </div>

                    <ProductActions product={product} variants={variants || []} />
                </div>
            </div>
        </main>
    )
}
