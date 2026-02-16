# Smart Bookmark App

A full-stack real-time bookmark manager built using **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.

## Live Demo

https://smart-bookmark-app-vercel.vercel.app

## GitHub Repository

https://github.com/NivedhanaS/smart-bookmark-app

---

## Features

* Google OAuth authentication (Supabase Auth)
* Private bookmarks per user (Row Level Security enabled)
* Add / Delete bookmarks
* Real-time bookmark updates using Supabase Realtime
* Search bookmarks instantly
* Clickable bookmarks opening in new tab
* Form validation preventing empty submissions
* Responsive UI using Tailwind CSS
* Deployed on Vercel

---

## Tech Stack

* Next.js (App Router)
* Supabase (Auth, Database, Realtime)
* Tailwind CSS
* Vercel (Deployment)

---

## Database Design

Table: `bookmarks`

Columns:

* id (uuid)
* user_id (uuid → auth.users)
* title (text)
* url (text)
* created_at (timestamp)

Row Level Security ensures users can only access their own bookmarks.

---

## Problems Faced and Solutions

**Problem:** Google OAuth redirect not working after deployment
**Solution:** Updated Supabase Site URL and added Vercel domain to Google OAuth redirect URIs.

**Problem:** Realtime updates not reflecting
**Solution:** Enabled realtime for bookmarks table and subscribed using Supabase channel listener.

**Problem:** Environment variables missing in Vercel deployment
**Solution:** Added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel project settings and redeployed.

---

## Setup Instructions (Local)

git clone https://github.com/NivedhanaS/smart-bookmark-app.git
cd smart-bookmark-app
npm install
npm run dev
