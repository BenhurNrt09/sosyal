"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function getGlobalSubmissions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('task_submissions')
        .select('*, tasks(*), profiles:user_id(username, full_name)')
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

    // In a real scenario, we'd call the completeTaskAndPay logic here
    // For now, let's assume it's handled via the lib but we need service role access

    // Fetch submission to get amount and user_id
    const { data: sub } = await supabase
        .from('task_submissions')
        .select('*, tasks(price)')
        .eq('id', id)
        .single();

    if (!sub) return { error: "Submission not found" };

    const amount = sub.tasks?.price || 0;

    // Update status
    const { error: updateError } = await supabase
        .from('task_submissions')
        .update({ status: 'completed' })
        .eq('id', id);

    if (updateError) return { error: updateError.message };

    // Add balance to user
    const { error: balanceError } = await supabase.rpc('increment_balance', {
        user_id: sub.user_id,
        amount: amount
    });

    if (balanceError) return { error: balanceError.message };

    revalidatePath("/dashboard/submissions");
    return { success: true };
}
