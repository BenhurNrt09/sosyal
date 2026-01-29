"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function approveAndPaySubmission(submissionId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Oturum bulunamadı." };
    }

    // RPC'yi çağır: complete_task_and_pay
    // Bu fonksiyon hem durumu 'completed' yapar hem de bakiyeyi aktarır.
    const { error } = await supabase.rpc('complete_task_and_pay', {
        p_submission_id: submissionId
    });

    if (error) {
        console.error("Payout error:", error);
        return { error: "Ödeme işlemi sırasında bir hata oluştu: " + error.message };
    }

    revalidatePath("/dashboard/tasks/submissions");
    return { success: true };
}

export async function rejectSubmission(submissionId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('task_submissions')
        .update({ status: 'rejected' })
        .eq('id', submissionId);

    if (error) {
        return { error: "Reddetme işlemi başarısız: " + error.message };
    }

    revalidatePath("/dashboard/tasks/submissions");
    return { success: true };
}
