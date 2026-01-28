-- KESİN ÇÖZÜM: Admin Dashboard'da Kullanıcıların Gözükmemesi ve RLS Döngüsü
-- Bu kodu Supabase SQL Editor'de çalıştırın.

-- 1. Önce eski tüm kısıtlayıcı politikaları silelim (Garanti olsun)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;
DROP POLICY IF EXISTS "Admin_Full_Access" ON public.profiles;
DROP POLICY IF EXISTS "Users_Self_View" ON public.profiles;
DROP POLICY IF EXISTS "Users_Self_Update" ON public.profiles;

-- 2. Yeni, döngüsüz (Non-Recursive) politikaları ekleyelim
-- Bu kural: Kullanıcının JWT token'ındaki role bakarak admin olup olmadığını anlar.
-- Veritabanına tekrar sormadığı için "infinite recursion" (sonsuz döngü) asla olmaz.

-- ADMIN HER ŞEYİ GÖREBİLİR VE YAPABİLİR
CREATE POLICY "Admin_Full_Access" 
ON public.profiles FOR ALL 
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
  (auth.jwt() ->> 'email' = 'admin@admin.local')
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
  (auth.jwt() ->> 'email' = 'admin@admin.local')
);

-- KULLANICILAR KENDİ PROFİLLERİNİ GÖREBİLİR
CREATE POLICY "Users_Self_View" 
ON public.profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- KULLANICILAR KENDİ PROFİLLERİNİ GÜNCELLEYEBİLİR
CREATE POLICY "Users_Self_Update" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- 3. RLS'yi aktif tutalım
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Admin kullanıcısının metadata'sını güncelleyelim
-- Bu adım çok önemli, token'ın içinde 'role' : 'admin' bilgisinin olmasını sağlar.
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"')
WHERE email = 'admin@admin.local';

-- Kontrol: Bu sorgu 'admin' döndürmeli
SELECT id, email, raw_app_meta_data->>'role' as role FROM auth.users WHERE email = 'admin@admin.local';
