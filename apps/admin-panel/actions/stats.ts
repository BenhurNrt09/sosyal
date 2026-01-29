"use server";

import { createAdminClient as createClient } from "@repo/lib/src/server";

export async function getAdminStats() {
    console.log("getAdminStats: Starting stats fetch...");
    const supabase = await createClient();

    // 1. Toplam Kullanıcı Sayısı
    const { count: userCount, error: userError } = await (supabase as any)
        .from("profiles")
        .select("*", { count: 'exact', head: true });
    console.log("getAdminStats: Users found:", userCount, userError);

    // 2. Toplam Destek Talebi
    const { count: supportCount, error: supportError } = await (supabase as any)
        .from("support_tickets")
        .select("*", { count: 'exact', head: true });
    console.log("getAdminStats: Support tickets found:", supportCount, supportError);

    // 2b. Toplam Görev Başvurusu (Hepsi)
    const { count: tasksCount, error: submissionsError } = await (supabase as any)
        .from("task_submissions")
        .select("*", { count: 'exact', head: true });
    console.log("getAdminStats: Total Submissions found:", tasksCount, submissionsError);

    const totalTaskActivity = (supportCount || 0) + (tasksCount || 0);

    // 3. Bakiye Havuzu
    const { data: balanceData, error: balanceError } = await (supabase as any)
        .from("profiles")
        .select("balance");

    const totalBalance = balanceData?.reduce((acc: any, curr: any) => acc + (Number(curr.balance) || 0), 0) || 0;
    console.log("getAdminStats: Total balance calculated:", totalBalance);

    // 4. Bekleyen Onaylar
    const { count: pendingTickets } = await (supabase as any)
        .from("support_tickets")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

    const { count: pendingWithdrawals } = await (supabase as any)
        .from("withdrawal_requests")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

    const totalPending = (pendingTickets || 0) + (pendingWithdrawals || 0);

    // 5. Son Üyelikler
    const { data: recentUsers } = await (supabase as any)
        .from("profiles")
        .select("id, username, created_at, email")
        .order("created_at", { ascending: false })
        .limit(5);

    // 6. Son Çekim Talepleri
    const { data: recentWithdrawals } = await (supabase as any)
        .from("withdrawal_requests")
        .select("*, profiles!user_id(username)")
        .order("created_at", { ascending: false })
        .limit(5);

    return {
        stats: {
            userCount: userCount || 0,
            taskCount: totalTaskActivity,
            totalBalance: totalBalance,
            pendingCount: totalPending
        },
        recentUsers: recentUsers || [],
        recentWithdrawals: recentWithdrawals || []
    };
}
