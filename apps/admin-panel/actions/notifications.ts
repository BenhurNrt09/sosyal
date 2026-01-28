"use server";

import { createAdminClient as createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function getAllNotifications() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notifications")
        .select("*, profiles!user_id(username, email)")
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) return { error: error.message };
    return { notifications: data };
}

export async function broadcastNotification(payload: {
    target: 'all' | 'gorev-al' | 'gorev-yap' | 'specific',
    specificUserId?: string,
    title: string,
    message: string,
    type: string,
    link?: string
}) {
    const supabase = await createClient();

    let targetUserIds: string[] = [];

    if (payload.target === 'specific' && payload.specificUserId) {
        targetUserIds = [payload.specificUserId];
    } else {
        // Fetch users based on target
        // Note: For 'all', we might want to limit to active users or handle differently if there are thousands.
        // For this implementation, we'll fetch all profile IDs.
        let query = supabase.from("profiles").select("id");

        // In a real broad app, 'gorev-al' and 'gorev-yap' distinctions might need a specific field in profiles.
        // For now, if we don't have an app_source field, 'all' is the safest broadcast.

        const { data: users, error: fetchError } = await query;
        if (fetchError) return { error: fetchError.message };
        targetUserIds = users.map(u => u.id);
    }

    if (targetUserIds.length === 0) return { error: "Hedef kullanıcı bulunamadı" };

    const notifications = targetUserIds.map(userId => ({
        user_id: userId,
        title: payload.title,
        message: payload.message,
        type: payload.type || 'info',
        link: payload.link || null
    }));

    // Chunking for large broadcasts
    const chunkSize = 100;
    for (let i = 0; i < notifications.length; i += chunkSize) {
        const chunk = notifications.slice(i, i + chunkSize);
        const { error: insertError } = await supabase.from("notifications").insert(chunk);
        if (insertError) return { error: insertError.message };
    }

    revalidatePath("/dashboard/notifications");
    return { success: true, count: targetUserIds.length };
}

export async function deleteNotification(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/dashboard/notifications");
    return { success: true };
}
export async function markAllNotificationsAsRead(userId?: string) {
    const supabase = await createClient();

    let targetId = userId;

    if (!targetId) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return { error: "Yetkisiz erişim" };
        targetId = userData.user.id;
    }

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", targetId);

    if (error) return { error: error.message };
    revalidatePath("/dashboard/notifications");
    return { success: true };
}
