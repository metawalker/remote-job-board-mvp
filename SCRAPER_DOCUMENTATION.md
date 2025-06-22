# Web Scraper API Documentation

This document describes the advanced multi-source web scraper for remote job listings.

## Overview

The scraper API endpoint (`/api/scrape`) is a protected POST endpoint that scrapes remote job listings from multiple sources and inserts them into the Supabase database with `is_active = false` for admin review.

## API Endpoint

**URL:** `POST /api/scrape`

**Authentication:** Bearer token (must match `CRON_SECRET` environment variable)

**Headers:**
```
Authorization: Bearer your-cron-secret-here
Content-Type: application/json
```

## Sources Scraped

### 1. YCombinator Jobs
- **URL:** https://www.ycombinator.com/jobs/search?remote=true
- **Method:** HTML parsing with Cheerio
- **Data Extracted:** Job title, company name, application URL
- **Location:** Always set to "Remote"

### 2. WeWorkRemotely
- **URL:** https://weworkremotely.com/categories/remote-programming-jobs
- **Method:** HTML parsing with Cheerio
- **Data Extracted:** Job title, company name, application URL
- **Location:** Always set to "Remote"

### 3. Google Careers
- **URL:** https://careers.google.com/api/v3/search/
- **Method:** API call with fallback
- **Data Extracted:** Job title, location, job ID for URL construction
- **Location:** Extracted from API or "Remote"

## Response Format

```json
{
  "success": true,
  "summary": {
    "totalJobsFound": 45,
    "totalJobsInserted": 38,
    "totalErrors": 0
  },
  "results": [
    {
      "source": "YCombinator",
      "jobsFound": 15,
      "jobsInserted": 12,
      "errors": []
    },
    {
      "source": "WeWorkRemotely", 
      "jobsFound": 20,
      "jobsInserted": 18,
      "errors": []
    },
    {
      "source": "Google Careers",
      "jobsFound": 10,
      "jobsInserted": 8,
      "errors": []
    }
  ],
  "message": "Successfully scraped 45 jobs and inserted 38 into database. 0 errors occurred."
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Error message details"
}
```

## Environment Variables

Add to your `.env.local` file:

```bash
# Scraper Configuration
CRON_SECRET=your-secure-secret-key-here-change-this-in-production
```

## Database Integration

### Job Insertion Process

1. **Company Creation/Lookup:** For each job, the scraper first creates or finds the company in the `companies` table
2. **Duplicate Prevention:** Checks for existing jobs with same title, company, and apply URL
3. **Job Insertion:** Inserts new jobs with:
   - `is_active = false` (requires admin approval)
   - `employment_type = 'full-time'`
   - `remote_type = 'remote'`
   - `skills = ['Remote Work']`
   - Generated description mentioning the company

### Data Normalization

- **Company Names:** Trimmed, special characters removed, max 100 chars
- **Job Titles:** Trimmed, normalized whitespace, max 200 chars
- **URLs:** Validated and converted to absolute URLs

## Testing

### Manual Testing

Use the provided test script:

```bash
node test-scraper.js
```

### cURL Testing

```bash
# Test unauthorized access
curl -X POST http://localhost:3000/api/scrape \
  -H "Authorization: Bearer wrong-token" \
  -H "Content-Type: application/json"

# Test authorized access
curl -X POST http://localhost:3000/api/scrape \
  -H "Authorization: Bearer your-secure-secret-key-here-change-this-in-production" \
  -H "Content-Type: application/json"
```

## Deployment Considerations

### Production Setup

1. **Change the CRON_SECRET:** Use a strong, unique secret in production
2. **Rate Limiting:** Consider implementing rate limiting to avoid being blocked
3. **Monitoring:** Set up logging and monitoring for scraper performance
4. **Cron Jobs:** Set up automated cron jobs to run the scraper periodically

### Scheduling with Vercel Cron

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scrape",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Error Handling

The scraper includes comprehensive error handling:

- **Network Timeouts:** 30-second timeout for all requests
- **Individual Source Failures:** If one source fails, others continue
- **Parsing Errors:** Graceful handling of HTML structure changes
- **Database Errors:** Logged but don't stop the overall process

## Limitations and Considerations

1. **Website Structure Changes:** Scraped sites may change their HTML structure
2. **Rate Limiting:** Some sites may block requests if too frequent
3. **Legal Compliance:** Ensure compliance with website terms of service
4. **Data Quality:** Scraped data may need manual review and cleanup

## Future Improvements

1. **Puppeteer Integration:** For JavaScript-heavy sites
2. **Proxy Rotation:** To avoid IP-based blocking
3. **Machine Learning:** For better job categorization
4. **RSS Feeds:** Alternative data sources
5. **Real-time Notifications:** Alert admins of new job batches

## Admin Workflow

1. **Scraper Runs:** Jobs inserted with `is_active = false`
2. **Admin Review:** Review jobs in admin dashboard
3. **Approval:** Set `is_active = true` for approved jobs
4. **Public Display:** Approved jobs appear on the public job board

## Troubleshooting

### Common Issues

1. **No Jobs Found:** Check if target websites have changed structure
2. **Authorization Errors:** Verify CRON_SECRET matches in environment and request
3. **Database Errors:** Check Supabase connection and RLS policies
4. **Timeout Errors:** Increase timeout or check network connectivity

### Debugging

Enable detailed logging by checking the console output and Supabase logs in the dashboard.
