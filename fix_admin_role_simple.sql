-- Admin Kullanıcı Rol Düzeltme (TEK KOMUT)
-- Aşağıdaki 'EMAIL_ADRESİNİZ' kısmını kendi email adresinizle değiştirip çalıştırın.

UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'EMAIL_ADRESİNİZ');

-- Kontrol için şu sorguyu çalıştırın:
SELECT u.email, p.role, p.username, p.name 
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'EMAIL_ADRESİNİZ';
