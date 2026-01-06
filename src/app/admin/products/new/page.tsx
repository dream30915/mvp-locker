'use client'

import { createClient } from '@/utils/supabase/client'
import { Navbar } from '@/components/layout/Navbar'
import { createProduct } from '@/app/actions/admin-products'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        setUploading(true)

        const file = e.target.files[0]
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}.${ext}`

        // Upload to 'products' bucket
        // Ensure bucket exists in Supabase Storage and is Public
        const { data, error } = await supabase.storage
            .from('products')
            .upload(fileName, file)

        if (error) {
            alert('Upload failed: ' + error.message)
            setUploading(false)
            return
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName)

        setImageUrl(publicUrl)
        setUploading(false)
    }

    async function handleSubmit(formData: FormData) {
        if (!imageUrl) {
            alert('Please upload an image first')
            return
        }
        
        // Append Cloud Image URL to Form
        formData.append('imagePath', imageUrl)

        const result = await createProduct(null, formData)
        
        if (result?.error) {
            setMessage(result.error)
        } else if (result?.success) {
            alert('Product Created!')
            router.push('/admin')
        }
    }

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-8 text-3xl font-black uppercase tracking-tighter">New Product</h1>

                <form action={handleSubmit} className="max-w-lg mx-auto flex flex-col gap-6 border border-crtz-grey bg-gray-900 p-8">
                    
                    {/* Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold uppercase text-gray-400">Product Image</label>
                        <div className="border-2 border-dashed border-gray-700 p-8 text-center hover:border-crtz-yellow cursor-pointer relative">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Preview" className="mx-auto h-48 object-contain" />
                            ) : (
                                <p className="text-sm text-gray-500">{uploading ? 'UPLOADING...' : 'CLICK TO UPLOAD'}</p>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold uppercase text-gray-400">Title</label>
                        <input name="title" required className="bg-black/50 border border-white/20 p-3 text-white focus:border-crtz-yellow focus:outline-none" placeholder="E.g. OG T-Shirt" />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold uppercase text-gray-400">Description</label>
                        <textarea name="description" rows={3} className="bg-black/50 border border-white/20 p-3 text-white focus:border-crtz-yellow focus:outline-none" placeholder="Product details..." />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold uppercase text-gray-400">Price (THB)</label>
                        <input type="number" name="price" required className="bg-black/50 border border-white/20 p-3 text-white focus:border-crtz-yellow focus:outline-none" placeholder="1500" />
                    </div>

                    {message && <p className="text-red-500 font-bold uppercase text-center">{message}</p>}

                    <button 
                        type="submit" 
                        disabled={uploading}
                        className="mt-4 bg-crtz-yellow py-3 text-black font-black uppercase hover:bg-white disabled:opacity-50"
                    >
                        Create Product
                    </button>
                    
                </form>
            </div>
        </main>
    )
}
