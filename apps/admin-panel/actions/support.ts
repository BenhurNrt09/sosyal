"use server";

import { createAdminClient as createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function replyToSupportTicket(id: string, response: string, userId: string, subject: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("support_tickets")
        .update({
            admin_response: response,
            status: 'replied',
            updated_at: new Date().toISOString()
        })
        .eq("id", id);

    if (error) return { error: error.message };

    // Notify user
    await supabase.from("notifications").insert({
        user_id: userId,
        title: "Destek Talebiniz Cevaplandı",
        message: `"${subject}" konulu destek talebinize cevap verildi: ${response.substring(0, 50)}...`,
        type: 'support',
        link: '/support'
    });

    revalidatePath("/dashboard/support");
    return { success: true };
}

export async function deleteSupportTicket(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("support_tickets").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/dashboard/support");
    return { success: true };
}

export async function getSupportTickets() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("support_tickets")
        .select("*, profiles!user_id(username, name, email)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tickets:", error);
        return { data: [], error: error.message };
    }

    return { data: data || [] };
}
