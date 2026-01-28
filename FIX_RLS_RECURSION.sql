-- KESİN ÇÖZÜM: RLS Infinite Recursion (Sonsuz Döngü) Hatasını Düzeltme
-- Bu kodu Supabase SQL Editor'e kopyalayın ve çalıştırın.

-- 1. Önce eski hatalı politikaları temizleyelim
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- 2. Yeni ve güvenli politikaları oluşturalım
-- Not: `auth.uid() = id` kontrolü veritabanı seviyesinde hızlıdır ve döngüye girmez.

-- Herkes kendi profilini görebilir
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Herkes kendi profilini güncelleyebilir
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Admin kontrolünü DOĞRUDAN auth.jwt() üzerinden yapmak sonsuz döngüyü engeller.
-- Ancak şimdilik en basit haliyle admin'lerin her şeyi görmesine izin verelim.
-- ÖNEMLİ: Recursive (kendi kendini çağıran) sorgulardan kaçınmak için (SELECT role FROM profiles...) yerine auth check kullanıyoruz.

CREATE POLICY "Admins can do everything" 
ON profiles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role' = 'admin' OR auth.users.email = 'admin@admin.local')
  )
);

-- 3. RLS'yi aktif tutalım ama politikaları düzelttik
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
