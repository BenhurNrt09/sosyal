"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";
import { notifyAdmins } from "./notifications";

export async function submitSupportTicket(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Kullanıcı oturumu bulunamadı" };
    }

    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const category = formData.get("category") as string;

    if (!subject || !message) {
        return { error: "Lütfen tüm alanları doldurun" };
    }

    const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject,
        message,
        category: category || 'Diğer',
        status: 'pending'
    });

    if (error) {
        console.error("Support ticket error:", error);
        return { error: "Destek talebi oluşturulurken bir hata oluştu" };
    }

    // Notify admins
    await notifyAdmins(
        "Yeni Destek Talebi",
        `${user.email} yeni bir destek talebi oluşturdu: ${subject}`,
        "support",
        "/dashboard/support"
    );

    revalidatePath("/support");
    return { success: true };
}
