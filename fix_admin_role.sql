-- Admin Kullanıcı Rol Kontrolü ve Düzeltme Script'i
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Mevcut tüm profilleri ve rollerini görüntüle (Hata düzeltildi: auth.users.id olarak belirtildi)
SELECT 
    u.id, 
    u.email, 
    p.username, 
    p.name, 
    p.role, 
    u.created_at 
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 2. Admin yapmak istediğiniz kullanıcının EMAIL'ini aşağıya yazın
DO $$
DECLARE
    admin_email TEXT := 'admin@admin.com';  -- <-- BURAYA KENDİ EMAİL'İNİZİ YAZIN!
    user_id_val UUID;
BEGIN
    -- Kullanıcının ID'sini bul
    SELECT id INTO user_id_val 
    FROM auth.users 
    WHERE email = admin_email;
    
    IF user_id_val IS NULL THEN
        RAISE NOTICE 'Kullanıcı bulunamadı: %', admin_email;
    ELSE
        -- Kullanıcıyı admin yap (Profile yoksa oluştur)
        INSERT INTO public.profiles (id, role, name, username, balance)
        VALUES (
            user_id_val, 
            'admin', 
            'Admin', 
            split_part(admin_email, '@', 1),
            0
        )
        ON CONFLICT (id) DO UPDATE 
        SET role = 'admin';
        
        RAISE NOTICE 'Kullanıcı admin yapıldı: % (ID: %)', admin_email, user_id_val;
    END IF;
END $$;

-- 3. Kontrol: Admin kullanıcıları görüntüle
SELECT 
    au.email,
    p.username,
    p.name,
    p.role,
    p.balance
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role = 'admin';
