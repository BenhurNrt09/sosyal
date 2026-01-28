"use server";

import { createClient } from "@repo/lib/src/server";
import { revalidatePath } from "next/cache";

export async function createTask(taskData: {
    platform: string;
    platformName: string;
    taskType: string;
    taskTypeName: string;
    link: string;
    accountName: string;
    quantity: string;
    price: string;
    description?: string;
}) {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Kullanıcı oturumu bulunamadı" };
    }

    // Kullanıcının yeterli bakiyesi var mı kontrol et
    const totalCost = Number(taskData.quantity) * Number(taskData.price);

    const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

    if (!profile || profile.balance < totalCost) {
        return { error: "Yetersiz bakiye. Lütfen bakiye yükleyin." };
    }

    // Görevi oluştur
    const { data: task, error: taskError } = await supabase
        .from("tasks")
        .insert({
            user_id: user.id,
            platform: taskData.platform,
            platform_name: taskData.platformName,
            task_type: taskData.taskType,
            task_type_name: taskData.taskTypeName,
            link: taskData.link,
            account_name: taskData.accountName,
            quantity: parseInt(taskData.quantity),
            price: parseFloat(taskData.price),
            description: taskData.description || '',
            status: "pending",
            remaining_quantity: parseInt(taskData.quantity)
        })
        .select()
        .single();

    if (taskError) {
        console.error("Task creation error:", taskError);
        return { error: "Görev oluşturulurken bir hata oluştu" };
    }

    // Bakiyeden düş
    const { error: balanceError } = await supabase
        .from("profiles")
        .update({ balance: profile.balance - totalCost })
        .eq("id", user.id);

    if (balanceError) {
        console.error("Balance deduction error:", balanceError);
        // Rollback task
        await supabase.from("tasks").delete().eq("id", task.id);
        return { error: "Bakiye güncellenirken hata oluştu" };
    }

    // TÜM PARALA KULLANICILARINI BİLGİLENDİR (role = 'user')
    const { data: paralaUsers } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "user");  // Normal kullanıcılar (görev alanlar)

    if (paralaUsers && paralaUsers.length > 0) {
        const notifications = paralaUsers.map(u => ({
            user_id: u.id,
            title: "Yeni Görev!",
            message: `${taskData.platformName} - ${taskData.taskTypeName} görevi eklendi! Ödül: ₺${taskData.price}`,
            type: "task",
            link: "/tasks"  // Parala'daki görevler sayfası
        }));

        await supabase.from("notifications").insert(notifications);
    }

    revalidatePath("/dashboard/tasks");
    return { success: true, task };
}

export async function getMyTasks() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
        return { data: [] };
    }

    return { data: data || [] };
}

export async function getTaskSubmissions(taskId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("task_submissions")
        .select(`
            *,
            profiles:user_id (
                username,
                email
            )
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
        return { data: [] };
    }

    return { data: data || [] };
}
