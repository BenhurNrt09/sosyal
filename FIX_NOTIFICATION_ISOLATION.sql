-- ==========================================================
-- 🔒 BİLDİRİM İZOLASYONU VE GÜVENLİK FİX
-- ==========================================================

-- 1. NOTIFICATIONS TABLOSUNDA RLS'Yİ AKTİF ET
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. ESKİ POLİTİKALARI TEMİZLE
DROP POLICY IF EXISTS "Admin can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Enable all access for notifications" ON public.notifications;

-- 3. YENİ VE GÜÇLÜ POLİTİKALAR OLUŞTUR 

-- Kullanıcılar sadece kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi bildirimlerini güncelleyebilir (is_read durumunu değiştirmek için)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admin tüm bildirimleri görebilir
CREATE POLICY "Admin can view all notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin bildirim oluşturabilir
CREATE POLICY "Admin can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 4. REALTIME AKTİF ET (Eğer değilse)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
END $$;

-- 5. SCHEMA YENİLE
NOTIFY pgrst, 'reload schema';
