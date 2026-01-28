-- Admin Panel RLS Politikaları Düzeltme Script'i
-- Bu script admin kullanıcılarının tüm verileri görebilmesini sağlar

-- 1. NOTIFICATIONS TABLE - Admin tüm bildirimleri görebilmeli
DROP POLICY IF EXISTS "Admin can view all notifications" ON notifications;
CREATE POLICY "Admin can view all notifications"
ON notifications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Normal kullanıcılar sadece kendi bildirimlerini görebilir
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admin bildirim ekleyebilir
DROP POLICY IF EXISTS "Admin can insert notifications" ON notifications;
CREATE POLICY "Admin can insert notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 2. SUPPORT_TICKETS TABLE - Admin tüm destek taleplerini görebilmeli
DROP POLICY IF EXISTS "Admin can view all support tickets" ON support_tickets;
CREATE POLICY "Admin can view all support tickets"
ON support_tickets FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Normal kullanıcılar sadece kendi taleplerini görebilir
DROP POLICY IF EXISTS "Users can view own support tickets" ON support_tickets;
CREATE POLICY "Users can view own support tickets"
ON support_tickets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Kullanıcılar destek talebi oluşturabilir
DROP POLICY IF EXISTS "Users can create support tickets" ON support_tickets;
CREATE POLICY "Users can create support tickets"
ON support_tickets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin destek taleplerini güncelleyebilir (cevap verir)
DROP POLICY IF EXISTS "Admin can update support tickets" ON support_tickets;
CREATE POLICY "Admin can update support tickets"
ON support_tickets FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 3. TASK_SUBMISSIONS TABLE - Admin tüm başvuruları görebilmeli
DROP POLICY IF EXISTS "Admin can view all submissions" ON task_submissions;
CREATE POLICY "Admin can view all submissions"
ON task_submissions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Kullanıcılar kendi başvurularını görebilir
DROP POLICY IF EXISTS "Users can view own submissions" ON task_submissions;
CREATE POLICY "Users can view own submissions"
ON task_submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Kullanıcılar başvuru oluşturabilir
DROP POLICY IF EXISTS "Users can create submissions" ON task_submissions;
CREATE POLICY "Users can create submissions"
ON task_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin başvuruları güncelleyebilir (onayla/reddet)
DROP POLICY IF EXISTS "Admin can update submissions" ON task_submissions;
CREATE POLICY "Admin can update submissions"
ON task_submissions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 4. PROFILES TABLE - Admin tüm profilleri görebilmeli ve güncelleyebilmeli
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
CREATE POLICY "Admin can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles as p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
  OR auth.uid() = id
);

DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
CREATE POLICY "Admin can update all profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles as p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
  OR auth.uid() = id
);

-- KONTROL: Tüm policy'leri listele
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('notifications', 'support_tickets', 'task_submissions', 'profiles')
ORDER BY tablename, policyname;
