"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Oturum açılmadı" };

    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { notifications: data };
}

export async function markAsRead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/notifications");
    return { success: true };
}

export async function createNotification(userId: string, title: string, message: string, type: string = 'info', link?: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("notifications")
        .insert({
            user_id: userId,
            title,
            message,
            type,
            link
        });

    if (error) {
        console.error("Error creating notification:", error);
        return { error: error.message };
    }
    return { success: true };
}

// Special function to notify all admins
export async function notifyAdmins(title: string, message: string, type: string = 'info', link?: string) {
    const supabase = await createClient();

    // Get all admin IDs
    const { data: admins, error: adminError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin");

    if (adminError || !admins) return { error: "Adminler bulunamadı" };

    const notifications = admins.map(admin => ({
        user_id: admin.id,
        title,
        message,
        type,
        link
    }));

    const { error } = await supabase.from("notifications").insert(notifications);
    return error ? { error: error.message } : { success: true };
}
