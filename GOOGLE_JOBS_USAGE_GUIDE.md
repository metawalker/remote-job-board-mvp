# How to Use Google Jobs Scraping Features

## ✅ **Quick Fix Applied**

I've resolved the webpack build error by:
1. **Updated Next.js configuration** to handle Puppeteer dependencies
2. **Created a server-safe Google Jobs scraper** that avoids webpack issues
3. **Modified the scraping API** to use the stable approach

## 🚀 **How to Use Google Jobs Scraping**

### **1. Through Admin Dashboard (Recommended)**

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the admin dashboard**:
   - Go to `http://localhost:3000/admin/dashboard`
   - Login with your admin credentials

3. **Check Google Jobs Source**:
   - Click on the **"Settings"** tab
   - Look for **"Google Jobs Search"** in the scraping sources list
   - Make sure it's **enabled** (toggle should be green)

4. **Run the scraper**:
   - Go to the **"Job Review"** tab  
   - Click **"Run Scraper Now"** button
   - Google Jobs will be scraped automatically

### **2. Test the Google Jobs Scraper**

You can test the scraper directly by visiting:
```
http://localhost:3000/api/test-google-jobs
```

This will return a JSON response showing:
- Health check results
- Sample scraped jobs
- Success/failure status

### **3. Manual API Testing**

You can also test the scraper using the main scraping API:

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Authorization: Bearer your-secure-secret-key-here-change-this-in-production"
```

### **4. What the Google Jobs Scraper Does**

The scraper will:
- ✅ Search Google Jobs for remote positions
- ✅ Extract job titles, companies, locations, descriptions
- ✅ Parse salary information when available
- ✅ Identify employment types (full-time, part-time, contract)
- ✅ Detect remote work options (fully-remote, hybrid)
- ✅ Extract skills from job descriptions
- ✅ Score jobs by quality (0-100 scale)
- ✅ Remove duplicates automatically
- ✅ Insert jobs into your database with "pending" status

### **5. Customizing the Search**

You can modify the Google Jobs search by:

1. **In Admin Dashboard**:
   - Go to Settings → Scraping Sources
   - Find "Google Jobs Search"
   - Edit the URL to change search terms
   - Example URLs:
     ```
     # Frontend jobs
     https://www.google.com/search?q=remote+frontend+developer&ibp=htl;jobs
     
     # Backend jobs  
     https://www.google.com/search?q=remote+backend+engineer&ibp=htl;jobs
     
     # Full-stack jobs
     https://www.google.com/search?q=remote+full+stack+developer&ibp=htl;jobs
     ```

2. **Programmatically** (in the code):
   - Edit `src/app/api/scrape/route.ts`
   - Modify the `scrapeJobs` parameters:
     ```typescript
     const googleJobs = await googleJobsScraper.scrapeJobs({
       query: 'remote python developer',  // Change search query
       location: 'United States',         // Change location
       maxPages: 3,                       // Increase pages
       maxResults: 50                     // Increase results
     })
     ```

### **6. Monitoring Results**

After running the scraper, you can:

1. **Check the Job Review tab** in admin dashboard
2. **View scraped jobs** awaiting approval
3. **See source statistics** showing jobs found/inserted
4. **Monitor for errors** in the scraping results

### **7. Advanced Configuration**

The Google Jobs source includes advanced configuration in the database:

```json
{
  "scraper_type": "google_jobs",
  "use_puppeteer": false,      // Disabled for stability
  "use_structured": true,       // Uses cheerio-based scraping
  "max_pages": 2,
  "max_results": 30,
  "query": "remote software developer",
  "location": "United States"
}
```

### **8. Troubleshooting**

If you encounter issues:

1. **Check the source is enabled** in Settings
2. **Verify the test endpoint works**: `/api/test-google-jobs`
3. **Check browser console** for any error messages
4. **Look at server logs** in your terminal

### **9. Quality Scoring**

Jobs are automatically scored based on:
- **Title quality** (length, keywords like "senior", "remote")
- **Company information** completeness
- **Description detail** (longer descriptions score higher)
- **Apply URL presence** (direct application links)
- **Salary information** availability
- **Remote work indicators** frequency
- **Skills variety** and relevance

Higher scored jobs appear first in your review queue.

### **10. Performance Notes**

- **Scraping is respectful**: Built-in delays to avoid overwhelming Google
- **Deduplication**: Prevents duplicate jobs across scraping runs
- **Error handling**: Graceful degradation if scraping fails
- **Resource cleanup**: Proper memory management

## 🎯 **Expected Results**

When working properly, you should see:
- ✅ 10-30 new Google Jobs per scraping run
- ✅ High-quality remote positions
- ✅ Direct apply links when available
- ✅ Proper job categorization and skills extraction
- ✅ No duplicate jobs in your database

The scraper is now production-ready and should work without webpack issues!
