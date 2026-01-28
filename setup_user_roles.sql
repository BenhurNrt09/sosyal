-- Yeni Kullanıcılar için Otomatik 'user' Rolü Atama
-- Bu SQL script'i Supabase SQL Editor'da çalıştırın

-- 1. Profiles tablosunda default role değerini 'user' yapın
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- 2. Handle new user trigger'ı (eğer yoksa oluştur)
-- Bu trigger yeni kullanıcı kaydolduğunda otomatik profile oluşturur

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, name, role, balance)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user', -- Default role is 'user', NOT 'admin'
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger'ı auth.users tablosuna bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Mevcut admin olmayan kullanıcıların rolünü güncelle
UPDATE profiles 
SET role = 'user'
WHERE role IS NULL OR role = '';

-- 5. Admin kullanıcısını koruyun
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@admin.local';

-- KONTROL: Tüm kullanıcıları ve rollerini görün
SELECT email, username, role FROM profiles ORDER BY created_at DESC;
