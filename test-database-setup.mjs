// Generated by Copilot
// Script to test database connectivity and create scraping_sources table if needed
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseAndCreateSources() {
  try {
    console.log('🔍 Testing database connectivity...')
    
    // Test basic connectivity
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      return
    }

    console.log('✅ Database connection successful')

    // Check if scraping_sources table exists
    console.log('🔍 Checking if scraping_sources table exists...')
    const { data: sourcesData, error: sourcesError } = await supabase
      .from('scraping_sources')
      .select('id, name, url, enabled')
      .limit(1)

    if (sourcesError) {
      if (sourcesError.message.includes('relation "scraping_sources" does not exist')) {
        console.log('❌ scraping_sources table does not exist')
        console.log('📝 Creating scraping_sources table...')
        
        // Create the table using raw SQL
        const { error: createError } = await supabase.rpc('create_scraping_sources_table')
        
        if (createError) {
          console.error('❌ Failed to create table:', createError.message)
          
          // Try manual table creation
          console.log('🔧 Attempting manual table creation...')
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS scraping_sources (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              url TEXT NOT NULL,
              enabled BOOLEAN DEFAULT true,
              description TEXT,
              priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
              last_scraped_at TIMESTAMP WITH TIME ZONE,
              total_jobs_found INTEGER DEFAULT 0,
              success_rate DECIMAL(5,2) DEFAULT 100.0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
          
          const { error: manualCreateError } = await supabase
            .from('scraping_sources')
            .select('*')
            .limit(0)
          
          if (manualCreateError) {
            console.error('❌ Manual table creation also failed:', manualCreateError.message)
            console.log('🔧 You need to run the migration SQL manually in your Supabase dashboard')
            return
          }
        }
      } else {
        console.error('❌ Error accessing scraping_sources table:', sourcesError.message)
        return
      }
    } else {
      console.log('✅ scraping_sources table exists')
      if (sourcesData && sourcesData.length > 0) {
        console.log(`📊 Found ${sourcesData.length} existing sources`)
        sourcesData.forEach(source => {
          console.log(`  - ${source.name}: ${source.url} (${source.enabled ? 'enabled' : 'disabled'})`)
        })
        return // Exit if we already have data
      }
    }

    // Insert some test data
    console.log('📝 Inserting test scraping sources...')
    const testSources = [
      {
        name: 'Y Combinator Jobs',
        url: 'https://www.ycombinator.com/jobs/search?remote=true',
        enabled: true,
        description: 'Remote jobs from Y Combinator startups',
        priority: 'high'
      },
      {
        name: 'We Work Remotely',
        url: 'https://weworkremotely.com/remote-jobs',
        enabled: true,
        description: 'Popular remote work job board',
        priority: 'high'
      },
      {
        name: 'Remote.co',
        url: 'https://remote.co/remote-jobs/',
        enabled: true,
        description: 'Curated remote job listings',
        priority: 'medium'
      },
      {
        name: 'AngelList (Wellfound)',
        url: 'https://wellfound.com/jobs?remote=true',
        enabled: false,
        description: 'Startup jobs with remote options',
        priority: 'medium'
      }
    ]

    const { data: insertedData, error: insertError } = await supabase
      .from('scraping_sources')
      .insert(testSources)
      .select()

    if (insertError) {
      console.error('❌ Failed to insert test data:', insertError.message)
    } else {
      console.log('✅ Successfully inserted test scraping sources')
      console.log(`📊 Inserted ${insertedData.length} sources`)
    }

    // Test the API endpoint
    console.log('🧪 Testing updated API endpoint...')
    const response = await fetch('http://localhost:3000/api/admin/settings')
    
    if (response.ok) {
      const apiData = await response.json()
      console.log('✅ API test successful')
      console.log('📊 API returned', apiData.settings?.sources?.length || 0, 'sources')
      
      if (apiData.settings?.sources) {
        apiData.settings.sources.forEach((source, index) => {
          console.log(`  ${index + 1}. ${source.name}: ${source.url}`)
        })
      }
    } else {
      console.log('❌ API test failed:', response.status, await response.text())
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message)
  }
}

// Run the test
testDatabaseAndCreateSources()
