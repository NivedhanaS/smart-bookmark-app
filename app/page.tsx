'use client'

import { supabase } from '@/lib/supabaseClient'

export default function Home() {

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard'
      }
    })
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={loginWithGoogle}
        className="bg-red-600 text-white px-6 py-3 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}
