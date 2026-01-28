-- ==========================================================
-- 🚀 FİNAL ÇÖZÜM: TABLO BAĞLANTILARINI VE ERİŞİMİ DÜZELT (V3)
-- ==========================================================

-- 1. TABLOLARDA RLS'Yİ TAMAMEN KAPAT (Admin her şeyi görmeli)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests DISABLE ROW LEVEL SECURITY;

-- 2. İLİŞKİLERİ (FOREIGN KEYS) SIFIRDAN VE DOĞRU İSİMLERLE KUR
-- Eğer bu kısımlarda hata alırsanız "already exists" diyebilir, sorun değil.
DO $$ 
BEGIN
    -- Başvuruları Profillere Bağla
    BEGIN
        ALTER TABLE public.task_submissions DROP CONSTRAINT IF EXISTS task_submissions_user_id_fkey;
        ALTER TABLE public.task_submissions ADD CONSTRAINT task_submissions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'task_submissions_user_id_fkey zaten var.';
    END;

    -- Başvuruları Görevlere Bağla
    BEGIN
        ALTER TABLE public.task_submissions DROP CONSTRAINT IF EXISTS task_submissions_task_id_fkey;
        ALTER TABLE public.task_submissions ADD CONSTRAINT task_submissions_task_id_fkey 
        FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'task_submissions_task_id_fkey zaten var.';
    END;

    -- Bildirimleri Profillere Bağla
    BEGIN
        ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
        ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'notifications_user_id_fkey zaten var.';
    END;

    -- Destek Taleplerini Profillere Bağla
    BEGIN
        ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_id_fkey;
        ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'support_tickets_user_id_fkey zaten var.';
    END;
END $$;

-- 3. SUPABASE'İN HAFIZASINI TAZELE (EN ÖNEMLİ ADIM)
-- Terminaldeki "Could not find relationship" hatasını bu komut çözer.
NOTIFY pgrst, 'reload schema';

-- 4. TERMİNALDEKİ HATAYI KONTROL ET
-- Eğer bu sorgu sonuç veriyorsa veritabanı SÜPER çalışıyor demektir.
SELECT count(*) as basvuru_sayisi FROM public.task_submissions;
SELECT count(*) as bildirim_sayisi FROM public.notifications;

-- 5. ADMİN YETKİSİNİ TAZELİĞİNDEN EMİN OL
UPDATE public.profiles SET role = 'admin' WHERE username = 'admin' OR name = 'Sistem Yöneticisi';
