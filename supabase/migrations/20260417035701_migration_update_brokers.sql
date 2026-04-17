-- Migration: Add missing columns to brokers table for manual agent creation
-- Description: Adds email, full_name, and phone columns directly to the brokers table
-- so admins can create a broker application without requiring an active auth.users row first.

ALTER TABLE public.brokers
ADD COLUMN IF NOT EXISTS email text UNIQUE,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Note: We add UNIQUE to the email column to ensure the same email 
-- cannot be registered multiple times as an agent.
