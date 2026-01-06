'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Check Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { checkIsAdmin } = await import('@/lib/auth-utils')
    if (!(await checkIsAdmin(user))) {
        return { error: 'Not an admin'
    }
    }

    // 2. Parse Data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priceRaw = formData.get('price') as string
    const imagePath = formData.get('imagePath') as string // Client uploads, sends path
   
    if (!title || !priceRaw || !imagePath) {
        return { error: 'Missing Required Fields' }
    }

    const price = parseInt(priceRaw)
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4)

    // 3. Insert Product
    const { error } = await supabase.from('products').insert({
        title,
        description,
        base_price: price,
        slug,
        is_active: true,
        images: [imagePath] // Assuming imagePath is full URL or relative path handled by frontend
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/products')
    revalidatePath('/')
    return { success: true }
}
