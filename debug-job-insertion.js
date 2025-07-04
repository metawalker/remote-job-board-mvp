// Generated by Copilot
// Debug script to test the exact insertion process the scraper uses

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://czvkltyhkzbuvsvqdlun.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dmtsdHloa3pidXZzdnFkbHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDUxMTgxMSwiZXhwIjoyMDY2MDg3ODExfQ.g-EmjKB06zXK46-2AdupzKXhTsEePklWuBgqBqNCbTI'

// Sample scraped job data (similar to what scraper would get)
const testJob = {
  title: 'Software Engineer - Remote Test',
  companyName: 'Scraped Test Company',
  location: 'Remote',
  applyUrl: 'https://example.com/jobs/test-scraped-job',
  source: 'Test Scraper'
}

async function debugJobInsertion() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  console.log('Debugging job insertion process...\n')
  
  try {
    // Step 1: Create or find company (exactly like scraper does)
    console.log('1. Creating/finding company:', testJob.companyName)
    
    const normalizedName = testJob.companyName.trim().replace(/\s+/g, ' ').replace(/[^\w\s-&.]/g, '').substring(0, 100)
    console.log('   Normalized name:', normalizedName)
    
    // First, try to find existing company
    const { data: existingCompany, error: findError } = await supabase
      .from('companies')
      .select('id')
      .eq('name', normalizedName)
      .single()
    
    if (findError && findError.code !== 'PGRST116') {
      console.error('❌ Error finding company:', findError)
      return
    }
    
    let companyId
    
    if (existingCompany) {
      console.log('   Found existing company:', existingCompany.id)
      companyId = existingCompany.id
    } else {
      console.log('   Creating new company...')
      
      const { data: newCompany, error: createError } = await supabase
        .from('companies')
        .insert({
          name: normalizedName,
          description: `Company scraped from job listings`,
          is_verified: false
        })
        .select('id')
        .single()
      
      if (createError) {
        console.error('❌ Error creating company:', createError)
        return
      }
      
      console.log('   Created new company:', newCompany.id)
      companyId = newCompany.id
    }
    
    // Step 2: Check for duplicate jobs (exactly like scraper does)
    console.log('2. Checking for duplicate jobs...')
    
    const { data: existingJob, error: duplicateError } = await supabase
      .from('jobs')
      .select('id')
      .eq('title', testJob.title)
      .eq('company_id', companyId)
      .eq('apply_url', testJob.applyUrl)
      .single()
    
    if (duplicateError && duplicateError.code !== 'PGRST116') {
      console.error('❌ Error checking duplicates:', duplicateError)
      return
    }
    
    if (existingJob) {
      console.log('   Job already exists, would be skipped:', existingJob.id)
      return
    } else {
      console.log('   No duplicate found, proceeding with insertion')
    }
    
    // Step 3: Insert job (exactly like scraper does)
    console.log('3. Inserting job...')
    
    const jobData = {
      company_id: companyId,
      title: testJob.title,
      description: `Remote job opportunity at ${testJob.companyName}. Please visit the application URL for full details.`,
      location: testJob.location || 'Remote',
      employment_type: 'full-time',
      remote_type: 'remote',
      skills: ['Remote Work'],
      apply_url: testJob.applyUrl,
      is_active: false, // Set to false for admin review
      posted_at: new Date().toISOString()
    }
    
    console.log('   Job data to insert:', JSON.stringify(jobData, null, 2))
    
    const { data: insertedJob, error: insertError } = await supabase
      .from('jobs')
      .insert(jobData)
      .select('id')
      .single()
    
    if (insertError) {
      console.error('❌ Error inserting job:', insertError)
      console.log('This is the exact error the scraper encounters')
    } else {
      console.log('✅ Job inserted successfully:', insertedJob.id)
      console.log('The scraper should work - the issue might be elsewhere')
      
      // Check if job is actually in database
      const { data: verifyJob, error: verifyError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', insertedJob.id)
        .single()
      
      if (verifyError) {
        console.error('❌ Error verifying job:', verifyError)
      } else {
        console.log('✅ Job verified in database:', verifyJob.title)
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

debugJobInsertion()
