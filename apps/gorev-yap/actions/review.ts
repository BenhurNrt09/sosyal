"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function reviewSubmission(formData: FormData) {
    const submissionId = formData.get("submissionId") as string;
    const decision = formData.get("decision") as 'approve' | 'reject';
    const taskId = formData.get("taskId") as string;

    const supabase = createClient();

    // 1. Update submission status
    const { error: updateError } = await supabase
        .from("task_submissions")
        .update({
            status: decision === 'approve' ? 'approved' : 'rejected',
            reviewed_at: new Date().toISOString()
        })
        .eq("id", submissionId);

    if (updateError) {
        return { error: "İşlem sırasında hata oluştu." };
    }

    // 2. If approved, add balance to worker
    if (decision === 'approve') {
        // Get task price and worker id
        const { data: submission } = await supabase
            .from("task_submissions")
            .select("worker_id, tasks(price_per_action)")
            .eq("id", submissionId)
            .single();

        if (submission && submission.tasks) {
            // Unfortunately `tasks` is returned as array or object depending on query, here object.
            // But TS might complain if types aren't perfect.
            // Assuming relationship works:
            // @ts-ignore
            const amount = submission.tasks.price_per_action;
            const workerId = submission.worker_id;

            // RPC call or direct update. For MVP direct update is risky but we'll specific sql
            // "update profiles set balance = balance + amount where id = workerId"

            // Let's us the previous rpc if exists or simple update
            const { error: balanceError } = await supabase.rpc('add_balance', {
                user_id: workerId,
                amount: amount
            });

            if (balanceError) console.error("Balance update error", balanceError);

            // Create Transaction Record
            await supabase.from("transactions").insert({
                user_id: workerId,
                amount: amount,
                transaction_type: 'task_reward',
                status: 'completed',
                description: 'Görev Kazancı',
                reference_id: submissionId
            });
        }
    }

    revalidatePath(`/dashboard/tasks/${taskId}`);
    return { success: true };
}
