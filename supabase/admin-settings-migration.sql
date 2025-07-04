-- Generated by Copilot
-- Admin Settings Migration
-- This migration adds the admin_settings table for storing scraping configuration

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_at ON admin_settings(updated_at);

-- Enable RLS for admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
-- Only admins can view settings
CREATE POLICY "Admin can view settings" ON admin_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

-- Only admins can insert settings
CREATE POLICY "Admin can insert settings" ON admin_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

-- Only admins can update settings
CREATE POLICY "Admin can update settings" ON admin_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

-- Only admins can delete settings
CREATE POLICY "Admin can delete settings" ON admin_settings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_admin_settings_updated_at_trigger
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_settings_updated_at();

-- Insert default scraping settings
INSERT INTO admin_settings (setting_key, setting_value, updated_by)
VALUES 
    ('scraping_config', '{
        "sources": {
            "ycombinator": {"enabled": true, "priority": "high"},
            "weworkremotely": {"enabled": true, "priority": "high"},
            "remoteok": {"enabled": true, "priority": "medium"},
            "google_careers": {"enabled": false, "priority": "low"}
        },
        "scheduling": {
            "enabled": false,
            "frequency": "daily",
            "time": "09:00",
            "timezone": "UTC"
        },
        "filters": {
            "min_salary": 0,
            "required_skills": [],
            "excluded_companies": [],
            "job_types": ["full-time", "contract", "part-time"]
        },
        "notifications": {
            "email": {
                "enabled": false,
                "address": "",
                "on_completion": true,
                "on_errors": true
            },
            "slack": {
                "enabled": false,
                "webhook_url": "",
                "channel": "#general"
            }
        },
        "rate_limits": {
            "requests_per_minute": 30,
            "delay_between_requests": 2000,
            "max_concurrent": 3
        }
    }', (
        SELECT id FROM auth.users 
        WHERE email = (
            SELECT email FROM auth.users 
            JOIN user_profiles ON auth.users.id = user_profiles.user_id 
            WHERE user_profiles.is_admin = true 
            LIMIT 1
        )
    ))
ON CONFLICT (setting_key) DO NOTHING;

-- Create helper function to get scraping settings
CREATE OR REPLACE FUNCTION get_scraping_settings()
RETURNS JSONB AS $$
DECLARE
    settings JSONB;
BEGIN
    SELECT setting_value INTO settings
    FROM admin_settings
    WHERE setting_key = 'scraping_config';
    
    RETURN COALESCE(settings, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to update scraping settings
CREATE OR REPLACE FUNCTION update_scraping_settings(new_settings JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Update or insert settings
    INSERT INTO admin_settings (setting_key, setting_value, updated_by)
    VALUES ('scraping_config', new_settings, auth.uid())
    ON CONFLICT (setting_key) 
    DO UPDATE SET 
        setting_value = new_settings,
        updated_at = NOW(),
        updated_by = auth.uid();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create scraping_history table for tracking scraping runs
CREATE TABLE IF NOT EXISTS scraping_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'running',
    source VARCHAR(50) NOT NULL,
    jobs_found INTEGER DEFAULT 0,
    jobs_added INTEGER DEFAULT 0,
    jobs_skipped INTEGER DEFAULT 0,
    error_message TEXT,
    settings_snapshot JSONB,
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for scraping_history
CREATE INDEX IF NOT EXISTS idx_scraping_history_started_at ON scraping_history(started_at);
CREATE INDEX IF NOT EXISTS idx_scraping_history_status ON scraping_history(status);
CREATE INDEX IF NOT EXISTS idx_scraping_history_source ON scraping_history(source);

-- Enable RLS for scraping_history
ALTER TABLE scraping_history ENABLE ROW LEVEL SECURITY;

-- Create policies for scraping_history
CREATE POLICY "Admin can view scraping history" ON scraping_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

CREATE POLICY "Admin can insert scraping history" ON scraping_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

CREATE POLICY "Admin can update scraping history" ON scraping_history
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_admin = true
        )
    );

-- Create function to log scraping activity
CREATE OR REPLACE FUNCTION log_scraping_activity(
    p_source VARCHAR(50),
    p_jobs_found INTEGER DEFAULT 0,
    p_jobs_added INTEGER DEFAULT 0,
    p_jobs_skipped INTEGER DEFAULT 0,
    p_error_message TEXT DEFAULT NULL,
    p_status VARCHAR(20) DEFAULT 'completed',
    p_settings_snapshot JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    history_id UUID;
BEGIN
    INSERT INTO scraping_history (
        status, source, jobs_found, jobs_added, jobs_skipped, 
        error_message, settings_snapshot, completed_at, created_by
    )
    VALUES (
        p_status, p_source, p_jobs_found, p_jobs_added, p_jobs_skipped,
        p_error_message, p_settings_snapshot, NOW(), auth.uid()
    )
    RETURNING id INTO history_id;
    
    RETURN history_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users (admin checks are in RLS policies)
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON scraping_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_scraping_settings() TO authenticated;
GRANT EXECUTE ON FUNCTION update_scraping_settings(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION log_scraping_activity(VARCHAR, INTEGER, INTEGER, INTEGER, TEXT, VARCHAR, JSONB) TO authenticated;
