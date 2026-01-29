-- 1. MODİFİKASYON: Uygulama Bazlı Erişim Kontrolü
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_parala_user BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_dijital_havuz_user BOOLEAN DEFAULT false;

-- Mevcut kullanıcıları role göre eşleyelim (opsiyonel ama iyi olur)
-- NOT: User'ın hangi app'e kayıtlı olduğunu en başta bilemeyebiliriz, 
-- bu yüzden login olurken otomatik set edilecek bir mantık da kurabiliriz.
-- Ama temiz olanı, yeni kayıt olanların işaretlenmesidir.

COMMENT ON COLUMN public.profiles.is_parala_user IS 'Kullanıcının Parala (gorev-al) uygulamasını kullanma yetkisi var mı?';
COMMENT ON COLUMN public.profiles.is_dijital_havuz_user IS 'Kullanıcının Dijital Havuz (gorev-yap) uygulamasını kullanma yetkisi var mı?';

-- Şifre sıfırlama için geçici kod alanı (custom flow için)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reset_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reset_code_expires TIMESTAMPTZ;
