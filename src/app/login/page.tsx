'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
            setLoading(false)
        } else {
            router.push('/account')
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        setMessage('')
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Check your email for confirmation link!')
        }
        setLoading(false)
    }

    const handleLineLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'line' as any,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) setMessage(error.message)
    }

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
                <div className="w-full max-w-md border border-white/20 bg-white/5 backdrop-blur-sm p-8">
                    <h1 className="mb-6 text-center text-3xl font-black uppercase tracking-tighter font-orbitron">Enter Archive</h1>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="EMAIL"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-black/50 border border-white/20 p-3 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                        />
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-black/50 border border-white/20 p-3 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-white py-3 font-bold uppercase text-[#040f26] hover:opacity-90 transition-colors"
                        >
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="my-6 text-center text-xs text-gray-500 uppercase">Or</div>

                    <button
                        type="button"
                        onClick={handleSignUp}
                        className="w-full border border-white/20 py-3 font-bold uppercase text-gray-400 hover:border-white hover:text-white transition-colors"
                    >
                        Create Account
                    </button>

                    <button
                        type="button"
                        onClick={handleLineLogin}
                        className="mt-4 w-full bg-[#06C755] py-3 font-bold uppercase text-white hover:opacity-90 transition-opacity"
                    >
                        Login with LINE
                    </button>

                    {message && <p className="mt-4 text-center text-xs text-red-500 font-bold uppercase">{message}</p>}
                </div>
            </div>
        </main>
    )
}
