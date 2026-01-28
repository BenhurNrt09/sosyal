"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function getWithdrawalRequests() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("*, profiles:user_id(username, email, balance)")
        .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { requests: data };
}

export async function updateWithdrawalStatus(id: string, status: 'approved' | 'rejected', userId: string, amount: number) {
    const supabase = await createClient();

    // Start status update
    const { error: updateError } = await supabase
        .from("withdrawal_requests")
        .update({ status })
        .eq("id", id);

    if (updateError) return { error: updateError.message };

    // If approved, we need to ensure balance was already deducted or deduct it now.
    // In our previous logic, we didn't deduct yet. Let's do it now.
    if (status === 'approved') {
        const { data: profile } = await supabase.from("profiles").select("balance").eq("id", userId).single();
        if (profile) {
            const newBalance = (profile.balance || 0) - amount;
            await supabase.from("profiles").update({ balance: newBalance }).eq("id", userId);
        }
    }

    // Create notification for user
    const title = status === 'approved' ? "Para Çekme Talebi Onaylandı" : "Para Çekme Talebi Reddedildi";
    const message = status === 'approved'
        ? `${amount}₺ tutarındaki çekim talebiniz onaylandı ve hesabınıza aktarıldı.`
        : `${amount}₺ tutarındaki çekim talebiniz maalesef reddedildi.`;

    await supabase.from("notifications").insert({
        user_id: userId,
        title,
        message,
        type: status === 'approved' ? 'success' : 'warning',
        link: '/wallet'
    });

    revalidatePath("/dashboard/finance");
    return { success: true };
}
