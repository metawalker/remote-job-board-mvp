# Manual Admin Setup Guide

Since the automated migration script encountered issues, here's a step-by-step guide to manually set up the admin functionality.

## Prerequisites

1. **Ensure you have a working Supabase project**
   - Your `.env.local` file should contain:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

2. **Verify your Next.js app is running**
   ```bash
   npm run dev
   ```

## Step 1: Apply Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/admin-migration.sql` into the editor
4. Click "Run" to execute the migration

### Option B: Using the migration script

If your environment is set up correctly, you can try:
```bash
node apply-admin-migration.js
```

## Step 2: Create Your First Admin User

1. **Go to your Supabase Dashboard**
2. Navigate to **Authentication → Users**
3. Find your user account and copy the **User ID**
4. Navigate to **Table Editor → user_profiles**
5. Find the row with your `user_id`
6. Set `is_admin = true` for your user
7. Click **Save**

If you don't have a `user_profiles` entry:
1. Go to **SQL Editor**
2. Run this query (replace `YOUR_USER_ID` with your actual user ID):
   ```sql
   INSERT INTO user_profiles (user_id, is_admin, created_at, updated_at)
   VALUES ('YOUR_USER_ID', true, now(), now());
   ```

## Step 3: Test Admin Functionality

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to the admin page**
   - Open your browser and go to: `http://localhost:3000/admin/review`
   - You should see the admin dashboard

3. **Check for pending jobs**
   - If you don't have any pending jobs, run the scraper first:
     ```bash
     node test-scraper.js
     ```
   - Or make a POST request to `/api/scrape` with some job URLs

## Step 4: Verify Everything Works

### Test the API endpoints:

1. **Get pending jobs:**
   ```bash
   curl -X GET http://localhost:3000/api/admin/pending-jobs \
     -H "Authorization: Bearer YOUR_SESSION_TOKEN"
   ```

2. **Approve a job:**
   ```bash
   curl -X PATCH http://localhost:3000/api/jobs/JOB_ID/approve \
     -H "Authorization: Bearer YOUR_SESSION_TOKEN"
   ```

3. **Reject a job:**
   ```bash
   curl -X DELETE http://localhost:3000/api/jobs/JOB_ID/approve \
     -H "Authorization: Bearer YOUR_SESSION_TOKEN"
   ```

## Troubleshooting

### Common Issues:

1. **"Access Denied" when visiting admin page**
   - Make sure your user has `is_admin = true` in the `user_profiles` table
   - Verify you're logged in to the application

2. **Database errors when applying migration**
   - Check if the tables already exist (schema.sql should be applied first)
   - Some "already exists" errors are normal and can be ignored

3. **API endpoints returning 401/403**
   - Verify your authentication is working
   - Check that RLS policies are properly applied
   - Make sure the `is_admin()` function exists in your database

4. **No pending jobs to review**
   - Run the scraper to get some job data: `node test-scraper.js`
   - Check that jobs are being created with `is_active = false`

### Database Verification:

Run these queries in your Supabase SQL Editor to verify setup:

```sql
-- Check if admin column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'is_admin';

-- Check if admin function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- Check admin users
SELECT user_id, is_admin 
FROM user_profiles 
WHERE is_admin = true;

-- Check pending jobs
SELECT COUNT(*) as pending_jobs 
FROM jobs 
WHERE is_active = false;
```

## Next Steps

Once everything is working:

1. **Configure job scraping sources** in your scraper
2. **Set up automated scraping** (cron job or scheduled function)
3. **Customize the admin dashboard** as needed
4. **Add more admin users** by setting `is_admin = true` for other user profiles

## Security Notes

- The service role key should never be exposed to client-side code
- Admin functionality is protected by Row Level Security (RLS) policies
- All admin API endpoints verify the user's admin status before allowing access
- The `is_admin` check is done server-side and cannot be bypassed

---

If you encounter any issues, check the browser console and server logs for error messages.
