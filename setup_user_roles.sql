-- Yeni Kullanıcılar için Otomatik Uygulama Yetkilendirme
-- Bu SQL script'i Supabase SQL Editor'da çalıştırın

-- 1. Handle new user trigger'ı - GÜNCEL VERSİYON
-- Bu trigger yeni kullanıcı kaydolduğunda otomatik profile oluşturur
-- VE hangi uygulamadan kayıt olduğunu metadata'dan okur

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    username, 
    name, 
    full_name,
    role, 
    balance,
    is_parala_user,
    is_dijital_havuz_user
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'), -- Default: 'user'
    0, -- Default balance
    COALESCE((NEW.raw_user_meta_data->>'is_parala_user')::boolean, false), -- Parala yetkisi
    COALESCE((NEW.raw_user_meta_data->>'is_dijital_havuz_user')::boolean, false) -- Dijital Havuz yetkisi
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger'ı auth.users tablosuna bağla (eğer yoksa oluştur)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Mevcut kullanıcıların rolünü kontrol et ve düzelt
UPDATE profiles 
SET role = 'user'
WHERE role IS NULL OR role = '';

-- 4. Admin kullanıcısını koruyun (eğer varsa)
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@admin.local';

-- 5. KONTROL: Tüm kullanıcıları, rollerini ve uygulama yetkilerini görün
SELECT 
  email, 
  username, 
  role,
  is_parala_user,
  is_dijital_havuz_user,
  created_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 20;
