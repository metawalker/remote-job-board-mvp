# Troubleshooting: No Jobs in Admin Dashboard

## Problem
- Scraper shows "2 jobs found, 0 inserted"
- Admin dashboard shows no pending jobs
- This indicates database insertion is failing

## Root Cause Analysis

The issue is likely one of these:

1. **Database schema not applied** - Main tables may not exist
2. **Admin migration not applied** - Admin functionality may not be set up
3. **RLS policies preventing insertion** - Permission issues
4. **Environment variables not configured** - Database connection failing

## Step-by-Step Solution

### Step 1: Verify Environment Setup

Check if your `.env.local` file exists and has the correct Supabase credentials:

```bash
# In your project root, check if file exists
ls -la .env.local

# The file should contain:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Apply Main Database Schema

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and run in SQL Editor

**Option B: Using the script**
```bash
node apply-schema.mjs
```

### Step 3: Apply Admin Migration

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase Dashboard → SQL Editor  
2. Copy contents of `supabase/admin-migration.sql`
3. Paste and run in SQL Editor

**Option B: Using the script**
```bash
node apply-admin-migration.js
```

### Step 4: Create Admin User

1. Sign up/login to your app at http://localhost:3001/auth
2. In Supabase Dashboard → Table Editor → user_profiles
3. Find your user and set `is_admin = true`

### Step 5: Test the Fix

```bash
# Run scraper again
node test-scraper.js

# Check admin dashboard
# Go to http://localhost:3001/admin/review
```

## Quick Diagnostic Commands

```bash
# Test environment variables
node test-env.js

# Check if server is running
curl http://localhost:3001/api/admin/pending-jobs

# Manual test of scraper
curl -X POST http://localhost:3001/api/scrape \
  -H "Authorization: Bearer your-secure-secret-key-here-change-this-in-production" \
  -H "Content-Type: application/json"
```

## Expected Outcomes

After applying both schemas:

✅ **Main Schema Applied:**
- Tables: companies, user_profiles, jobs, job_applications
- Sample data: 4 companies, 4 jobs
- RLS policies for data protection

✅ **Admin Migration Applied:**  
- Added `is_admin` column to user_profiles
- Admin RLS policies for full data access
- `is_admin()` function for role checking

✅ **Scraper Working:**
- Jobs found > 0
- Jobs inserted > 0  
- Jobs appear in admin dashboard with `is_active = false`

## Common Issues & Solutions

### "Jobs found but 0 inserted"
- **Cause**: RLS policies or missing tables
- **Fix**: Apply main schema first, then admin migration

### "Admin dashboard shows access denied"  
- **Cause**: User not marked as admin
- **Fix**: Set `is_admin = true` in user_profiles table

### "Environment variables not set"
- **Cause**: Missing or incorrect .env.local file
- **Fix**: Copy from Supabase Dashboard → Settings → API

### "Connection errors"
- **Cause**: Invalid Supabase URL or keys
- **Fix**: Double-check credentials in Supabase dashboard

## Next Steps After Fix

1. ✅ Verify scraper inserts jobs successfully
2. ✅ Test admin approval/rejection workflow  
3. ✅ Check that approved jobs appear on main site
4. ✅ Set up automated scraping (optional)

---

**Need help?** Check the detailed guides:
- `MANUAL_ADMIN_SETUP.md` - Complete admin setup
- `APPLY_SCHEMA_GUIDE.md` - Database schema application
- `SUPABASE_SETUP.md` - Initial Supabase configuration
