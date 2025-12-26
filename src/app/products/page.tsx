import { ProductList } from '@/components/product/ProductList'

export default function ProductsPage() {
    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <div className="pt-12 px-8">
                {/* Optional: Category Header could go here */}
                <ProductList />
            </div>
        </main>
    )
}
