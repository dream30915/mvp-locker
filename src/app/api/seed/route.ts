import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Initialize Supabase Admin Client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Clean up existing products
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

        if (deleteError) {
            console.error('Delete Error:', deleteError)
            return NextResponse.json({ error: deleteError.message }, { status: 500 })
        }

        // 2. Prepare new product data with BLANK images (no text in URL)
        // Using placehold.co with specific color and empty text param
        const blankImage = 'https://placehold.co/600x600/000000/000000/png?text=%20'

        const products = [
            {
                title: 'OG Alcatraz Tee',
                slug: 'og-alcatraz-tee-black-yellow',
                base_price: 1500,
                is_active: true,
                images: [blankImage],
            },
            {
                title: 'Superior Royale Zip Hoodie',
                slug: 'superior-royale-zip-hoodie',
                base_price: 3900,
                is_active: true,
                images: [blankImage],
            },
            {
                title: 'Guerilla Cargo Pants',
                slug: 'guerilla-cargo-pants-camo',
                base_price: 4200,
                is_active: true,
                images: [blankImage],
            },
            {
                title: 'Rules The World Beanie',
                slug: 'rules-the-world-beanie',
                base_price: 900,
                is_active: true,
                images: [blankImage],
            },
        ]

        // 3. Insert new products
        const { data, error: insertError } = await supabase
            .from('products')
            .insert(products)
            .select()

        if (insertError) {
            console.error('Insert Error:', insertError)
            return NextResponse.json({ error: insertError.message }, { status: 500 })
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Database re-seeded with blank images successfully', 
            products: data 
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
