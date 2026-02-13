'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {

  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
// (login + realtime)
useEffect(() => {
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      router.push('/')
    } else {
      setUser(data.user)
      loadBookmarks()
    }
  }

  loadUser()

  const channel = supabase
    .channel('bookmarks-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookmarks' },
      () => loadBookmarks()
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

  const loadBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) {
      alert('Please fill in both title and URL fields')
      return
    }

    // Validate title: must contain at least one letter
    if (!/[a-zA-Z]/.test(title)) {
      alert('Title must contain at least one letter (e.g., "Google", "GitHub")')
      return
    }

    // Validate URL: must start with http://, https://, or www.
    const urlRegex = /^(https?:\/\/|www\.)/i
    if (!urlRegex.test(url.trim())) {
      alert('URL must start with http://, https://, or www. (e.g., "https://google.com")')
      return
    }

    await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: user.id
    })
    setTitle('')
    setUrl('')
    loadBookmarks()
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    loadBookmarks()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredBookmarks = bookmarks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">Dashboard</h1>
      <p className="mb-6">Logged in as: {user?.email}</p>

      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded bg-background text-foreground placeholder-muted border-accent flex-1 min-w-[150px]"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded bg-background text-foreground placeholder-muted border-accent flex-1 min-w-[150px]"
        />
        <button
          onClick={addBookmark}
          disabled={!title.trim() || !url.trim()}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition"
        >
          Add
        </button>
      </div>

      <div className="mb-6">
        <input
          placeholder=" Search bookmarks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full rounded bg-background text-foreground placeholder-muted border-accent"
        />
      </div>

      <div>
        {filteredBookmarks.length === 0 ? (
          <p className="text-center text-muted py-8">No bookmarks found</p>
        ) : (
          filteredBookmarks.map((b) => (
            <div key={b.id} className="mb-4 p-3 border rounded bg-opacity-50 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-foreground">{b.title}</p>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline text-sm break-all"
                >
                  {b.url}
                </a>
              </div>
              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-600 hover:text-red-800 whitespace-nowrap ml-4"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-black text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  )
}
