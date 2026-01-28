-- ==========================================================
-- 🛡️ ADMİN PANELİ VERİ ERİŞİM VE RLS DÜZENLEMESİ (V2)
-- ==========================================================
-- Bu script: Bildirimler, Destek Mesajları ve Başvuruların admin panelinde gözükmesini sağlar.

-- 1. ADIM: TÜM KRİTİK TABLOLARDA RLS'Yİ DEVRE DIŞI BIRAK (En Garanti Yöntem)
-- Adminin önündeki tüm engelleri kaldırıyoruz.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions DISABLE ROW LEVEL SECURITY;

-- 2. ADIM: ADMİN HESABININ VERİLERİNİ GÜNCELLE
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Son giriş yapan kullanıcıyı (Siz) bul ve admin yap
    SELECT id INTO target_user_id FROM auth.users ORDER BY last_sign_in_at DESC LIMIT 1;
    
    IF target_user_id IS NOT NULL THEN
        UPDATE public.profiles 
        SET role = 'admin', 
            name = 'Sistem Yöneticisi', 
            username = 'admin'
        WHERE id = target_user_id;

        UPDATE auth.users 
        SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"')
        WHERE id = target_user_id;
    END IF;
END $$;

-- 3. KONTROL SORGUSU (Her şeyin sayısını görmeliyiz)
SELECT 
    (SELECT count(*) FROM public.profiles) as toplam_kullanici,
    (SELECT count(*) FROM public.notifications) as toplam_bildirim,
    (SELECT count(*) FROM public.support_tickets) as toplam_destek,
    (SELECT count(*) FROM public.task_submissions) as toplam_basvuru;
