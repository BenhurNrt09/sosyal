"use server";

import { createClient } from "@repo/lib/src/server";

export async function getAdminStats() {
    const supabase = await createClient();

    // 1. Toplam Kullanıcı Sayısı
    const { count: userCount, error: userError } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true });

    // 2. Toplam Destek Talebi
    const { count: supportCount } = await supabase
        .from("support_tickets")
        .select("*", { count: 'exact', head: true });

    // 2b. Tamamlanan Görevler (gorev-al tarafındaki onaylanmış kanıtlar)
    const { count: completedTasksCount } = await supabase
        .from("task_submissions")
        .select("*", { count: 'exact', head: true })
        .eq("status", "approved");

    const totalTaskActivity = (supportCount || 0) + (completedTasksCount || 0);

    // 3. Bakiye Havuzu (Tüm kullanıcıların toplam bakiyesi)
    const { data: balanceData, error: balanceError } = await supabase
        .from("profiles")
        .select("balance");

    const totalBalance = balanceData?.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0) || 0;

    // 4. Bekleyen Onaylar (Support Tickets pending + Withdrawal pending)
    const { count: pendingTickets } = await supabase
        .from("support_tickets")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

    const { count: pendingWithdrawals } = await supabase
        .from("withdrawal_requests")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

    const totalPending = (pendingTickets || 0) + (pendingWithdrawals || 0);

    // 5. Son Üyelikler
    const { data: recentUsers } = await supabase
        .from("profiles")
        .select("id, username, created_at, email")
        .order("created_at", { ascending: false })
        .limit(5);

    // 6. Son Çekim Talepleri
    const { data: recentWithdrawals } = await supabase
        .from("withdrawal_requests")
        .select("*, profiles:user_id(username)")
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
