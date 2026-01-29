-- Görev Tamamlama ve Ödeme Mantığı (Atomic)
-- Bu fonksiyon hem submission durumunu günceller hem de ödemeyi gerçekleştirir.

CREATE OR REPLACE FUNCTION public.complete_task_and_pay(p_submission_id UUID)
RETURNS void AS $$
DECLARE
    v_task_id UUID;
    v_worker_id UUID;
    v_amount FLOAT8;
    v_creator_id UUID;
    v_status TEXT;
BEGIN
    -- 1. Başvuru ve Görev bilgilerini al
    SELECT ts.task_id, ts.user_id, t.price::FLOAT8, t.user_id, ts.status
    INTO v_task_id, v_worker_id, v_amount, v_creator_id, v_status
    FROM public.task_submissions ts
    JOIN public.tasks t ON ts.task_id = t.id
    WHERE ts.id = p_submission_id;

    -- Kontrol: Başvuru var mı?
    IF v_task_id IS NULL THEN
        RAISE EXCEPTION 'Başvuru bulunamadı.';
    END IF;

    -- Kontrol: Zaten tamamlanmış mı?
    IF v_status = 'completed' THEN
        RETURN;
    END IF;

    -- 2. Başvuru durumunu 'completed' yap
    UPDATE public.task_submissions
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = p_submission_id;

    -- 3. Ödemeyi Alana (Worker) Aktar
    UPDATE public.profiles
    SET balance = COALESCE(balance, 0) + v_amount
    WHERE id = v_worker_id;

    -- 4. Görev sayacını güncelle (Kalan miktar)
    UPDATE public.tasks
    SET remaining_quantity = GREATEST(0, COALESCE(remaining_quantity, quantity::INT) - 1)
    WHERE id = v_task_id;

    -- 5. İşlem kaydı oluştur (Worker için)
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (v_worker_id, 'Ödeme Alındı', 'Görev onaylandı. Hesabınıza ₺' || v_amount || ' eklendi.', 'payment');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
