-- increment_balance fonksiyonunu oluşturur
-- Bu fonksiyon kullanıcı bakiyesini güvenli bir şekilde artırmak için kullanılır.

CREATE OR REPLACE FUNCTION public.increment_balance(amount float8, user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET balance = COALESCE(balance, 0) + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
