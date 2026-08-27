# test-web (ShopCRUD)

A full-stack e-commerce web application with Next.js, Zustand, and Supabase integration.

## Features
- **Authentication & User Management**: Admin and User roles, profile management.
- **Product & Category CRUD**: Full CRUD support for products and categories.
- **Cart & Orders**: Shopping cart management and order creation/tracking.
- **Favorites**: Toggle favorite products per user.
- **Supabase Integration**: PostgreSQL schema with RLS, foreign key indexing, and real-time CRUD synchronization.

## Tech Stack
- **Frontend**: Next.js (Pages router), React, Zustand, CSS Modules
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security, REST API)

## Setup & Running Locally

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the `frontend` directory based on `.env.example`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**:
   Apply migrations to your Supabase project:
   ```bash
   npx supabase link --project-ref <your_project_ref>
   npx supabase db push
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
