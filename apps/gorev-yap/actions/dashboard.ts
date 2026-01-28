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

    // Fetch task counts
    const { count: pendingTasks } = await supabase
        .from("tasks")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("status", "pending");

    const { count: completedTasks } = await supabase
        .from("tasks")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("status", "completed");

    const { count: unreadNotifications } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

    return {
        balance: profile?.balance || 0,
        pendingTasks: pendingTasks || 0,
        completedTasks: completedTasks || 0,
        unreadNotifications: unreadNotifications || 0
    };
}

export async function getLatestAnnouncements() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("notifications")
        .select("*")
        .is("user_id", null)
        .order("created_at", { ascending: false })
        .limit(5);

    return data || [];
}
