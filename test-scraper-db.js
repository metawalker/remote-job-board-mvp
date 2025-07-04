// Generated by Copilot
// Test script to check database structure and insert test data

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://czvkltyhkzbuvsvqdlun.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dmtsdHloa3pidXZzdnFkbHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDUxMTgxMSwiZXhwIjoyMDY2MDg3ODExfQ.g-EmjKB06zXK46-2AdupzKXhTsEePklWuBgqBqNCbTI'

async function testDatabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  console.log('Testing database structure and job insertion...\n')
  
  try {
    // Test 1: Check if companies table exists
    console.log('1. Testing companies table...')
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
    
    if (companiesError) {
      console.error('❌ Companies table error:', companiesError)
      return
    } else {
      console.log('✅ Companies table accessible')
    }
    
    // Test 2: Check if jobs table exists
    console.log('2. Testing jobs table...')
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)
    
    if (jobsError) {
      console.error('❌ Jobs table error:', jobsError)
      return
    } else {
      console.log('✅ Jobs table accessible')
    }
    
    // Test 3: Try to create a company
    console.log('3. Testing company creation...')
    const { data: newCompany, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Test Scraper Company',
        description: 'Test company for scraper validation',
        is_verified: false
      })
      .select('id')
      .single()
    
    if (companyError) {
      console.error('❌ Company creation failed:', companyError)
      return
    } else {
      console.log('✅ Company created:', newCompany.id)
    }
    
    // Test 4: Try to create a job with exact same structure as scraper
    console.log('4. Testing job creation with scraper structure...')
    const { data: newJob, error: jobError } = await supabase
      .from('jobs')
      .insert({
        company_id: newCompany.id,
        title: 'Test Developer Position',
        description: 'Remote job opportunity at Test Scraper Company. Please visit the application URL for full details.',
        location: 'Remote',
        employment_type: 'full-time',
        remote_type: 'remote',
        skills: ['Remote Work'],
        apply_url: 'https://example.com/test-job',
        is_active: false,
        posted_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    if (jobError) {
      console.error('❌ Job creation failed:', jobError)
      console.log('This is likely why the scraper insertions fail')
    } else {
      console.log('✅ Job created successfully:', newJob.id)
      console.log('The scraper should work once the database is properly set up')
    }
    
    // Test 5: Check current job count
    const { data: jobCount, error: countError } = await supabase
      .from('jobs')
      .select('count(*)', { count: 'exact' })
    
    if (!countError) {
      console.log(`Total jobs in database: ${jobCount[0]?.count || 0}`)
    }
    
    // Cleanup
    if (newJob) {
      await supabase.from('jobs').delete().eq('id', newJob.id)
    }
    await supabase.from('companies').delete().eq('id', newCompany.id)
    console.log('✅ Test data cleaned up')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testDatabase()
