"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";
import { notifyAdmins } from "./notifications";

export async function createWithdrawalRequest(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Kullanıcı oturumu bulunamadı" };
    }

    // Extract form data
    const amount = parseFloat(formData.get("amount") as string);
    const iban = formData.get("iban") as string;
    const bankName = formData.get("bankName") as string;
    const accountHolderName = formData.get("accountHolderName") as string;

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        return { error: "Geçersiz miktar" };
    }

    // Get user's current balance
    const { data: profile, error: profileError } = await (supabase
        .from("profiles") as any)
        .select("balance")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return { error: "Bakiye bilgisi alınamadı" };
    }

    // Check if user has sufficient balance
    if (profile.balance < amount) {
        return { error: "Yetersiz bakiye" };
    }

    // Create withdrawal request
    const { error: insertError } = await (supabase
        .from("withdrawal_requests") as any)
        .insert({
            user_id: user.id,
            amount,
            iban: iban.replace(/\s/g, ""), // Remove spaces from IBAN
            bank_name: bankName,
            account_holder_name: accountHolderName,
            status: "pending",
            created_at: new Date().toISOString(),
        });

    if (insertError) {
        console.error("Withdrawal request error:", insertError);
        return { error: "Para çekme talebi oluşturulurken bir hata oluştu" };
    }

    // Notify admins
    await notifyAdmins(
        "Yeni Para Çekme Talebi",
        `${user.email} tarafından ${amount}₺ tutarında yeni bir çekim talebi oluşturuldu.`,
        "payment",
        "/dashboard/finance"
    );

    revalidatePath("/wallet");
    return { success: true, message: "Para çekme talebiniz başarıyla oluşturuldu" };
}

export async function getWithdrawalRequests() {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Kullanıcı oturumu bulunamadı" };
    }

    const { data: requests, error: requestsError } = await (supabase
        .from("withdrawal_requests") as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (requestsError) {
        console.error("Withdrawal requests fetch error:", requestsError);
        return { error: "Para çekme talepleri yüklenirken bir hata oluştu" };
    }

    return { requests };
}
