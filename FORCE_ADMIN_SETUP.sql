-- KESİN ÇÖZÜM: Admin Kullanıcısı Oluşturma ve Yetkilendirme
-- Aşağıdaki kodu Supabase SQL Editor'e yapıştırın ve RUN tuşuna basın.

DO $$
DECLARE
    target_email TEXT := 'admin@admin.local'; -- Giriş yapacağınız email
    target_pass TEXT := 'admin123';         -- Şifreniz
    new_user_id UUID;
BEGIN
    -- 1. Önce auth.users tablosunda kullanıcı var mı kontrol et, yoksa oluştur
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = target_email) THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            target_email,
            crypt(target_pass, gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"name":"Admin User","username":"admin"}',
            false,
            now(),
            now(),
            '',
            '',
            '',
            ''
        )
        RETURNING id INTO new_user_id;
        RAISE NOTICE 'Yeni kullanıcı oluşturuldu: %', target_email;
    ELSE
        SELECT id INTO new_user_id FROM auth.users WHERE email = target_email;
        -- Şifreyi de güncelle garanti olsun
        UPDATE auth.users SET encrypted_password = crypt(target_pass, gen_salt('bf')) WHERE id = new_user_id;
        RAISE NOTICE 'Mevcut kullanıcı bulundu: %', target_email;
    END IF;

    -- 2. Profiles tablosunda admin rolünü kesinleştir
    INSERT INTO public.profiles (id, email, username, name, role, balance)
    VALUES (
        new_user_id,
        target_email,
        'admin',
        'Yönetici',
        'admin',
        1000000
    )
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin', name = 'Yönetici', username = 'admin';

    RAISE NOTICE 'Profile tablosu güncellendi. Rol: admin';
END $$;

-- Kontrol Sorgusu (Sonuçta 1 satır görmelisiniz)
SELECT u.email, p.role, p.username, p.name 
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@admin.local';
