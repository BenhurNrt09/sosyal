"use server";

import { createClient } from "@repo/lib/src/server";

export async function getDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Oturum bulunamadı" };

    // Fetch profile for balance
    const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

    // Fetch statistics
    // Note: Assuming tables 'task_submissions' exists for counting tasks.
    // If not, we count notifications or similar as placeholder.
    const { count: pendingTasks } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("type", 'task')
        .eq("is_read", false);

    const { count: unreadNotifications } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

    return {
        balance: profile?.balance || 0,
        pendingTasks: pendingTasks || 0,
        completedTasks: 0, // Placeholder
        unreadNotifications: unreadNotifications || 0
    };
}

export async function getLatestAnnouncements() {
    const supabase = await createClient();
    // Fetch global notifications (broadcasts)
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .is("user_id", null) // If broad broadcasts have null user_id, or we find another way to distinguish
        .order("created_at", { ascending: false })
        .limit(5);

    // If we don't use null user_id for broadcasts, we just fetch latest announcements for this user
    const { data: userNotifs } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    return data || userNotifs || [];
}
