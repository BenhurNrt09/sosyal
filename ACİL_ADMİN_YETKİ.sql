-- ==========================================================
-- 🚨 ACİL DURUM: %100 YETKİ VE VERİ ERİŞİM SIFIRLAMA
-- ==========================================================
-- Bu script, tüm kısıtlamaları kaldırır ve sizi admin yapar.

-- 1. TABLOLARI BÜTÜN DÜNYAYA AÇ (RLS'yi Kökten Kapat)
-- Bu işlemden sonra hiçbir kural (policy) okunmaz, her veri direkt gelir.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;

-- 2. EN SON GİRİŞ YAPAN KİŞİYİ ADMİN YAP (Yani Sizi)
DO $$
DECLARE
    last_user_id UUID;
BEGIN
    SELECT id INTO last_user_id FROM auth.users ORDER BY last_sign_in_at DESC LIMIT 1;
    
    IF last_user_id IS NOT NULL THEN
        -- username = 'admin' çakışmasını önle:
        -- Eğer başka birinde 'admin' kullanıcı adı varsa onu 'admin_eski' yap.
        UPDATE public.profiles 
        SET username = 'admin_' || substr(id::text, 1, 4) 
        WHERE username = 'admin' AND id <> last_user_id;

        -- Profiles tablosunu güncelle
        UPDATE public.profiles 
        SET role = 'admin', 
            username = 'admin', 
            name = 'Sistem Yöneticisi',
            balance = 999999
        WHERE id = last_user_id;
        
        -- Token yetkisini (metadata) güncelle
        UPDATE auth.users 
        SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"')
        WHERE id = last_user_id;
        
        -- Session'ı temizlemek için (isteğe bağlı)
        -- DELETE FROM auth.sessions WHERE user_id = last_user_id;
    END IF;
END $$;

-- 3. KONTROL SORGUSU (Burada kendi emailinizi ve 'admin' rolünü görmelisiniz)
SELECT id, email, role, username, name FROM public.profiles WHERE role = 'admin';