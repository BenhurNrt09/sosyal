-- Add new profile fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS device_type VARCHAR(10) CHECK (device_type IN ('android', 'iphone')),
ADD COLUMN IF NOT EXISTS instagram_username VARCHAR(100),
ADD COLUMN IF NOT EXISTS tiktok_username VARCHAR(100),
ADD COLUMN IF NOT EXISTS twitter_username VARCHAR(100),
ADD COLUMN IF NOT EXISTS youtube_username VARCHAR(100);

-- Add withdrawal request fields
ALTER TABLE withdrawal_requests
ADD COLUMN IF NOT EXISTS iban VARCHAR(34),
ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(200);
