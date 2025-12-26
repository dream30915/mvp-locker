import { createClient } from '@/utils/supabase/server'
import { ProductCard } from './ProductCard'

export async function ProductList() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (!products || products.length === 0) {
        return (
            <div className="py-20 text-center text-gray-500">
                <p>NO STOCK AVAILABLE</p>
            </div>
        )
    }

    return (
        <section className="container mx-auto px-4 py-16">
            <h2 className="mb-8 text-2xl font-black uppercase text-white">Latest Drop</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}
