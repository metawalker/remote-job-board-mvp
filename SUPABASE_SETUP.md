# Supabase Integration Setup Guide

This guide will help you set up Supabase for your Remote Job Board MVP.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js installed on your machine
3. Your Next.js application set up

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `remote-job-board-mvp`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to your users
5. Click "Create new project"

## Step 2: Set Up Environment Variables

1. In the Supabase dashboard, go to **Settings** → **API**
2. Copy your project URL and anon key
3. Create a `.env.local` file in your project root:

```bash
# Copy .env.local.example to .env.local and fill in your values
cp .env.local.example .env.local
```

4. Update `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the schema

This will create:
- User profiles table
- Jobs table
- Job applications table
- Row Level Security policies
- Sample data

## Step 4: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

### Optional: Set up Google OAuth

1. Go to **Authentication** → **Providers**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `https://your-project-id.supabase.co/auth/v1/callback`

## Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)
3. Click "Sign In" to test authentication
4. The jobs should load from the database

## Step 6: Deploy to Production

### Update Environment Variables for Production

1. Set your production environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. Update Supabase auth settings:
   - **Site URL**: `https://your-domain.com`
   - **Redirect URLs**: `https://your-domain.com/auth/callback`

## Available Features

### Authentication
- Email/password signup and login
- Google OAuth (if configured)
- Automatic user profile creation
- Session management

### Jobs
- View all active jobs
- Real-time updates
- Search and filter capabilities
- Job application tracking

### Database Features
- Row Level Security (RLS)
- Automatic timestamps
- Optimized indexes
- Sample data included

## Database Schema Overview

### Tables

1. **user_profiles**: Extended user information
2. **jobs**: Job listings with all details
3. **job_applications**: Track user applications

### Key Features

- **Row Level Security**: Users can only access their own data
- **Automatic Triggers**: Updated timestamps and profile creation
- **Enums**: Type-safe employment types and statuses
- **Indexes**: Optimized for common queries

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   - Restart your development server
   - Check `.env.local` syntax

2. **Authentication not working**:
   - Verify redirect URLs in Supabase settings
   - Check browser console for errors

3. **Database connection issues**:
   - Verify your Supabase URL and keys
   - Check RLS policies in Supabase dashboard

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Review the database logs in Supabase dashboard

## Next Steps

1. Customize the job application process
2. Add job posting functionality
3. Implement user profile management
4. Add email notifications
5. Set up real-time subscriptions
6. Add search and filtering features

Your Remote Job Board MVP is now fully integrated with Supabase! 🎉
