# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard for managing scraped job listings.

## Overview

The admin dashboard allows authorized users to:
- 📋 Review jobs scraped from external sources
- ✅ Approve jobs to make them live on the site
- ❌ Reject/delete jobs that are not suitable
- 📊 View pending job statistics

## Setup Steps

### 1. Apply Admin Schema Migration

First, apply the admin database schema changes:

1. Open your Supabase Dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy and paste the contents of `supabase/admin-migration.sql`
4. Click **Run** to execute

This will:
- Add `is_admin` column to `user_profiles` table
- Create admin-specific RLS policies
- Add helper functions for admin checks

### 2. Create Your First Admin User

After applying the schema:

1. **Sign up** for an account on your application using your admin email
2. In Supabase Dashboard, go to **SQL Editor**
3. Run this query (replace with your actual email):

```sql
UPDATE user_profiles 
SET is_admin = true 
WHERE user_id = (
    SELECT id FROM auth.users 
    WHERE email = 'your-admin-email@example.com'
);
```

### 3. Verify Admin Access

1. Sign in to your application with the admin account
2. You should see:
   - "Admin" badge in the user menu
   - "Admin Panel" button in the user menu
3. Click "Admin Panel" to access the dashboard

## Admin Dashboard Features

### 📊 Dashboard Overview

- **Pending Jobs Count**: Total jobs awaiting review
- **Verified Companies**: Jobs from verified company sources
- **Unique Companies**: Number of different companies represented

### 📋 Job Review Interface

Each pending job shows:

- **Job Details**: Title, company, location, salary, type
- **Skills**: Required skills and technologies
- **Source Information**: Where the job was scraped from
- **Apply URL**: Link to original job posting
- **Scrape Date**: When the job was discovered

### ⚡ Quick Actions

- **Approve**: Makes the job live on the public site (`is_active = true`)
- **Reject**: Permanently deletes the job from the database
- **View Original**: Opens the source job posting in a new tab

## API Endpoints

### Admin Authentication

All admin endpoints check for:
1. Valid user authentication
2. User has `is_admin = true` in their profile

### GET /api/admin/pending-jobs

Returns all jobs with `is_active = false`:

```json
{
  "success": true,
  "jobs": [
    {
      "id": "uuid",
      "title": "Senior Frontend Developer",
      "companies": {
        "name": "TechCorp",
        "is_verified": true
      },
      // ... other job fields
    }
  ],
  "count": 5
}
```

### PATCH /api/jobs/[id]/approve

Approves a job (sets `is_active = true`):

```bash
curl -X PATCH /api/jobs/123/approve \
  -H "Authorization: Bearer session-token"
```

### DELETE /api/jobs/[id]/approve

Rejects and deletes a job:

```bash
curl -X DELETE /api/jobs/123/approve \
  -H "Authorization: Bearer session-token"
```

## Security Features

### Row Level Security (RLS)

- **Admin Policies**: Only admins can view/modify inactive jobs
- **Public Policies**: Regular users only see active jobs
- **Isolation**: Regular users cannot access admin functions

### Authentication Checks

- All admin endpoints verify user authentication
- Additional check for `is_admin = true` in user profile
- Automatic redirects for unauthorized access

## Workflow

### Typical Admin Workflow

1. **Scraper Runs**: New jobs added with `is_active = false`
2. **Admin Review**: Admin reviews job quality and relevance
3. **Decision Making**:
   - ✅ **Approve**: Good jobs go live immediately
   - ❌ **Reject**: Poor quality/irrelevant jobs are deleted
4. **Public Visibility**: Approved jobs appear on the main site

### Batch Processing

- Multiple jobs can be approved/rejected quickly
- Real-time updates remove processed jobs from the list
- Refresh button to check for new scraped jobs

## Best Practices

### Review Guidelines

**Approve jobs that are:**
- ✅ Genuinely remote positions
- ✅ From legitimate companies
- ✅ Have clear job descriptions
- ✅ Include valid application URLs

**Reject jobs that are:**
- ❌ Not actually remote
- ❌ Spam or low-quality postings
- ❌ Have broken application links
- ❌ Are duplicates of existing jobs

### Security Recommendations

1. **Limit Admin Access**: Only give admin rights to trusted users
2. **Regular Reviews**: Check admin access periodically
3. **Monitor Activity**: Watch for unusual approval patterns
4. **Backup Strategy**: Regularly backup the database

## Troubleshooting

### Common Issues

**"Access Denied" when accessing admin panel:**
- Verify you're signed in
- Check if your account has `is_admin = true`
- Clear browser cache and try again

**No pending jobs showing:**
- Run the scraper to generate new jobs
- Check if all jobs have been reviewed already
- Verify the scraper is working correctly

**API errors when approving/rejecting:**
- Check browser console for detailed errors
- Verify your session is still valid
- Try refreshing the page

### Admin Status Check

To verify your admin status, run this query in Supabase:

```sql
SELECT 
  u.email,
  p.is_admin,
  p.created_at
FROM auth.users u
JOIN user_profiles p ON u.id = p.user_id
WHERE u.email = 'your-email@example.com';
```

## Future Enhancements

Potential admin dashboard improvements:

- **Bulk Actions**: Approve/reject multiple jobs at once
- **Filtering**: Filter by company, date, source
- **Analytics**: Job approval rates and trends
- **Company Management**: Edit company information
- **User Management**: Manage other admin users
- **Audit Log**: Track all admin actions

---

## Quick Start Checklist

- [ ] Apply `supabase/admin-migration.sql`
- [ ] Create admin user account
- [ ] Update user profile to set `is_admin = true`
- [ ] Sign in and verify "Admin Panel" appears
- [ ] Test approval/rejection functionality
- [ ] Run scraper to generate test jobs

Your admin dashboard is now ready for managing job approvals! 🎉
