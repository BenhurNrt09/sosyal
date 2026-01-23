"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function submitProof(formData: FormData) {
    const taskId = formData.get("taskId") as string;
    const proofUrl = formData.get("proofUrl") as string;
    const proofText = formData.get("proofText") as string;

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Kullanıcı oturumu bulunamadı." };
    }

    // Check if already submitted
    const { data: existing } = await supabase
        .from("task_submissions")
        .select("id")
        .eq("task_id", taskId)
        .eq("worker_id", user.id)
        .single();

    if (existing) {
        return { error: "Bu görev için zaten kanıt gönderdiniz." };
    }

    // Insert submission
    const { error } = await supabase.from("task_submissions").insert({
        task_id: taskId,
        worker_id: user.id,
        proof_url: proofUrl,
        proof_text: proofText,
        status: "pending"
    });

    if (error) {
        console.error("Submission error:", error);
        return { error: "Kanıt gönderilirken bir hata oluştu." };
    }

    revalidatePath("/dashboard/tasks");
    return { success: true };
}
