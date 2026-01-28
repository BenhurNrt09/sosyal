-- Admin Kullanıcısı Oluşturma Script'i
-- Bu script'i Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. Admin kullanıcısını auth.users tablosuna ekle
-- NOT: Supabase'de kullanıcı oluşturmak için Supabase Dashboard'u kullanmanız gerekiyor
-- Bu script sadece profile oluşturacak, önce Supabase Dashboard'dan admin kullanıcısı oluşturun:
-- Email: admin@admin.local
-- Password: admin123

-- 2. Eğer zaten bir kullanıcınız varsa ve ona admin rolü vermek istiyorsanız:
-- Önce kullanıcı ID'sini bulun:
-- SELECT id, email FROM auth.users;

-- 3. Sonra o kullanıcının profile'ına admin rolü verin (ID'yi değiştirin):
UPDATE profiles 
SET role = 'admin',
    username = 'admin',
    name = 'Administrator'
WHERE email = 'admin@admin.local';

-- 4. Veya mevcut bir kullanıcıya admin rolü vermek için (kendi email'inizi yazın):
-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE email = 'BURAYA_KENDI_EMAILINIZI_YAZIN';

-- 5. Tüm kullanıcıları görmek için:
SELECT id, email, username, role FROM profiles;
