"use server";

import { createAdminClient as createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function getWithdrawalRequests() {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
        .from("withdrawal_requests")
        .select("*, profiles:user_id(username, email, balance)")
        .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { requests: data };
}

export async function updateWithdrawalStatus(id: string, status: 'approved' | 'rejected', userId: string, amount: number) {
    const supabase = await createClient();

    // 1. Start status update
    const { error: updateError } = await (supabase as any)
        .from("withdrawal_requests")
        .update({ status })
        .eq("id", id);

    if (updateError) return { error: updateError.message };

    // 2. If approved, we deduct the balance. 
    // In a production app, the balance should ideally be "frozen" when requested,
    // but here we deduct on approval.
    if (status === 'approved') {
        const { error: balanceError } = await (supabase as any).rpc('increment_balance', {
            user_id: userId,
            amount: -amount // Use negative to subtract
        });

        if (balanceError) {
            console.error("Withdrawal Balance Deduction Error:", balanceError);
            return { error: "Bakiye düşülemedi: " + balanceError.message };
        }
    }

    // 3. Create notification for user
    const title = status === 'approved' ? "Para Çekme Talebi Onaylandı" : "Para Çekme Talebi Reddedildi";
    const message = status === 'approved'
        ? `${amount}₺ tutarındaki çekim talebiniz onaylandı ve hesabınıza aktarıldı.`
        : `${amount}₺ tutarındaki çekim talebiniz maalesef reddedildi.`;

    await (supabase as any).from("notifications").insert({
        user_id: userId,
        title,
        message,
        type: status === 'approved' ? 'success' : 'warning',
        link: '/wallet'
    });

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/page");
    return { success: true };
}
