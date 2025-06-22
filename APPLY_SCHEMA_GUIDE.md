# How to Apply the Database Schema to Supabase

Follow these steps to apply the database schema to your Supabase project:

## Step 1: Access Supabase Dashboard

1. Open your browser and go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: **remote-job-board-mvp**

Your project URL should be: `https://czvkltyhkzbuvsvqdlun.supabase.co`

## Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New Query"** to create a new SQL query

## Step 3: Copy and Paste Schema

1. Open the file `supabase/schema.sql` in your project
2. **Select All** (Ctrl+A) and **Copy** (Ctrl+C) the entire contents
3. **Paste** (Ctrl+V) into the SQL Editor in Supabase

## Step 4: Execute the Schema

1. Click the **"Run"** button (▶️) in the SQL Editor
2. Wait for the execution to complete
3. You should see success messages for most statements

## Expected Results

The schema will create:

✅ **4 Custom Types** (employment_type, remote_type, etc.)
✅ **4 Tables** (companies, user_profiles, jobs, job_applications)  
✅ **Multiple Indexes** for performance
✅ **Row Level Security (RLS)** policies
✅ **Triggers** for automatic timestamps
✅ **Sample Data** (4 companies and 4 jobs)

## Handling Errors

Some errors are normal if running the schema multiple times:

- ❌ "already exists" errors → **Normal**, skip these
- ❌ "duplicate key" errors → **Normal**, skip these  
- ❌ Permission errors → Check your account has admin access
- ❌ Syntax errors → Copy the schema file again

## Verification Steps

After running the schema, verify it worked:

1. Go to **"Table Editor"** in Supabase
2. You should see these tables:
   - `companies` (with 4 sample companies)
   - `jobs` (with 4 sample jobs)
   - `user_profiles` (empty)
   - `job_applications` (empty)

## Test the Integration

1. Start your Next.js app: `npm run dev`
2. Open http://localhost:3000
3. You should see job listings on the homepage
4. Try signing up/signing in to test authentication

## Next Steps

Once the schema is applied:

✅ **Test the scraper**: `node test-scraper.js`
✅ **Add more companies** via the dashboard
✅ **Set up automated scraping** with cron jobs
✅ **Deploy to production**

## Troubleshooting

If you encounter issues:

1. **Check Environment Variables**: Ensure `.env.local` has correct Supabase URLs
2. **Verify Project Access**: Make sure you're the project owner
3. **Review Logs**: Check the execution logs in the SQL Editor
4. **Contact Support**: Use Supabase Discord or documentation

## Alternative: Manual Table Creation

If the full schema fails, you can create tables individually:

1. Go to **"Table Editor"** → **"New Table"**
2. Create each table manually using the schema as reference
3. Add columns, constraints, and indexes step by step

---

📚 **Need Help?** Check the full documentation in `SUPABASE_SETUP.md`
