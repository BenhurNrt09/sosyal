"use server";

import { createAdminClient as createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function getGlobalSubmissions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('task_submissions')
        .select(`
            *,
            tasks(*),
            profiles!user_id(username, name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
        return { data: [], error: error.message };
    }

    return { data: data || [] };
}

export async function updateGlobalSubmissionStatus(id: string, status: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('task_submissions')
        .update({ status })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/submissions");
    return { success: true };
}

export async function completeSubmissionAndPay(id: string) {
    const supabase = await createClient();

    // Fetch submission to get amount and user_id
    const { data: sub, error: fetchError } = await supabase
        .from('task_submissions')
        .select('*, tasks(price)')
        .eq('id', id)
        .single();

    if (fetchError || !sub) return { error: "Başvuru bulunamadı veya bir hata oluştu." };

    const amount = sub.tasks?.price || 0;

    // 1. Update status to completed
    const { error: updateError } = await supabase
        .from('task_submissions')
        .update({ status: 'completed' })
        .eq('id', id);

    if (updateError) return { error: updateError.message };

    // 2. Add balance to user using RPC
    // Note: increment_balance is more atomic and safer than manual update
    const { error: balanceError } = await supabase.rpc('increment_balance', {
        user_id: sub.user_id,
        amount: amount
    });

    if (balanceError) {
        console.error("Balance Update Error:", balanceError);
        // If RPC fails (maybe not created yet), attempt manual fallback
        // but it's better to ensure RPC exists.
        return { error: "Bakiye güncellenemedi: " + balanceError.message };
    }

    revalidatePath("/dashboard/submissions");
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/users"); // Ensure users page is updated
    return { success: true };
}
